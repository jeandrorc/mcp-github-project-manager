import { Octokit } from "@octokit/rest";
import * as fs from "fs";
import * as path from "path";

interface FileInfo {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
}

interface SearchResult {
  file: string;
  matches: Array<{
    line: number;
    content: string;
  }>;
}

export class GitHubProjectManager {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private namespace: string;

  constructor(token: string, owner: string, repo: string, namespace?: string) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.namespace = namespace || ""; // Empty string means root of repo
  }

  /**
   * Prepend namespace to path if namespace is set
   */
  private resolvePath(path: string): string {
    if (!this.namespace) {
      return path;
    }
    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${this.namespace}/${cleanPath}`;
  }

  /**
   * Read a file from the repository
   */
  async readFile(filePath: string): Promise<string> {
    try {
      const resolvedPath = this.resolvePath(filePath);
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: resolvedPath,
      });

      if (Array.isArray(response.data)) {
        throw new Error("Path points to a directory, not a file");
      }

      if ("content" in response.data) {
        const content = Buffer.from(
          response.data.content,
          "base64"
        ).toString("utf-8");
        return content;
      }

      throw new Error("Unable to read file content");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Write or update a file in the repository
   */
  async writeFile(
    filePath: string,
    content: string,
    message: string
  ): Promise<string> {
    try {
      const resolvedPath = this.resolvePath(filePath);
      // Try to get existing file to get its SHA
      let sha: string | undefined;
      try {
        const existing = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: resolvedPath,
        });

        if (!Array.isArray(existing.data) && "sha" in existing.data) {
          sha = existing.data.sha;
        }
      } catch {
        // File doesn't exist, which is fine for write
      }

      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: resolvedPath,
        message: message,
        content: Buffer.from(content).toString("base64"),
        ...(sha && { sha }),
      });

      return `File updated successfully: ${response.data.commit.html_url}`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to write file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Create a new file in the repository
   */
  async createFile(
    filePath: string,
    content: string,
    message: string
  ): Promise<string> {
    try {
      const resolvedPath = this.resolvePath(filePath);
      // Check if file already exists
      try {
        await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: resolvedPath,
        });
        throw new Error("File already exists");
      } catch (error) {
        if (error instanceof Error && error.message === "File already exists") {
          throw error;
        }
        // File doesn't exist, continue
      }

      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: resolvedPath,
        message: message,
        content: Buffer.from(content).toString("base64"),
      });

      return `File created successfully: ${response.data.commit.html_url}`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Delete a file from the repository
   */
  async deleteFile(filePath: string, message: string): Promise<string> {
    try {
      const resolvedPath = this.resolvePath(filePath);
      const existing = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: resolvedPath,
      });

      if (Array.isArray(existing.data)) {
        throw new Error("Path points to a directory, not a file");
      }

      if (!("sha" in existing.data)) {
        throw new Error("Unable to get file SHA");
      }

      const response = await this.octokit.repos.deleteFile({
        owner: this.owner,
        repo: this.repo,
        path: resolvedPath,
        message: message,
        sha: existing.data.sha,
      });

      return `File deleted successfully: ${response.data.commit.html_url}`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete file: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(dirPath: string = "", recursive: boolean = false): Promise<FileInfo[]> {
    try {
      const resolvedPath = this.resolvePath(dirPath);
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: resolvedPath,
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Path is not a directory");
      }

      const files: FileInfo[] = response.data.map((item) => ({
        name: item.name,
        path: item.path,
        type: item.type as "file" | "dir",
        size: item.size,
      }));

      if (recursive) {
        const allFiles: FileInfo[] = [...files];
        for (const file of files) {
          if (file.type === "dir") {
            const subFiles = await this.listFiles(file.path, true);
            allFiles.push(...subFiles);
          }
        }
        return allFiles;
      }

      return files;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to list files: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Search for content in repository files
   */
  async searchContent(
    query: string,
    searchPath?: string
  ): Promise<SearchResult[]> {
    try {
      const resolvedSearchPath = searchPath ? this.resolvePath(searchPath) : (this.namespace || undefined);
      const searchQuery = resolvedSearchPath
        ? `${query} in:file path:${resolvedSearchPath}`
        : `${query} in:file repo:${this.owner}/${this.repo}`;

      const response = await this.octokit.search.code({
        q: searchQuery,
        per_page: 30,
      });

      const results: SearchResult[] = [];

      for (const item of response.data.items) {
        // Get file content to show context
        const fileContent = await this.readFile(item.path);
        const lines = fileContent.split("\n");
        const matches: Array<{ line: number; content: string }> = [];

        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            matches.push({
              line: index + 1,
              content: line.trim(),
            });
          }
        });

        if (matches.length > 0) {
          results.push({
            file: item.path,
            matches,
          });
        }
      }

      return results;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search content: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get project information from config.json
   */
  async getProjectInfo(): Promise<Record<string, unknown>> {
    try {
      const configContent = await this.readFile("config.json");
      return JSON.parse(configContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get project info: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Update project configuration
   */
  async updateConfig(key: string, value: string): Promise<string> {
    try {
      const configContent = await this.readFile("config.json");
      const config = JSON.parse(configContent);

      // Support dot notation for nested keys (e.g., "section.key")
      const keys = key.split(".");
      let current = config;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      await this.writeFile(
        "config.json",
        JSON.stringify(config, null, 2),
        `Update config: ${key} = ${value}`
      );

      return `Configuration updated: ${key} = ${value}`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update config: ${error.message}`);
      }
      throw error;
    }
  }
}
