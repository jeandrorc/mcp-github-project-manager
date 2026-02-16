import { Octokit } from "@octokit/rest";

export interface ProjectInfo {
  type: string;
  name: string;
  version?: string;
  description?: string;
  technologies: string[];
  structure: {
    hasComponents?: boolean;
    hasPages?: boolean;
    hasApi?: boolean;
    hasModels?: boolean;
    isMonorepo?: boolean;
  };
  packageManager?: string;
  framework?: string;
  language?: string;
}

export class ProjectDetector {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(token: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * Detect project type and technologies
   */
  async detectProject(): Promise<ProjectInfo> {
    const info: ProjectInfo = {
      type: "unknown",
      name: this.repo,
      technologies: [],
      structure: {},
    };

    try {
      // Check for package.json (Node.js/JavaScript/TypeScript)
      const hasPackageJson = await this.fileExists("package.json");
      if (hasPackageJson) {
        const packageData = await this.analyzePackageJson();
        Object.assign(info, packageData);
      }

      // Check for Python files
      const hasPython = await this.fileExists("requirements.txt") || 
                       await this.fileExists("pyproject.toml") ||
                       await this.fileExists("setup.py");
      if (hasPython) {
        const pythonData = await this.analyzePythonProject();
        Object.assign(info, pythonData);
      }

      // Check for monorepo structure
      const isMonorepo = await this.fileExists("pnpm-workspace.yaml") ||
                        await this.fileExists("lerna.json") ||
                        await this.fileExists("turbo.json");
      if (isMonorepo) {
        info.structure.isMonorepo = true;
        info.type = "monorepo";
        info.technologies.push("Monorepo");
      }

      // Analyze directory structure
      const structure = await this.analyzeStructure();
      info.structure = { ...info.structure, ...structure };

    } catch (error) {
      console.error("Error detecting project:", error);
    }

    return info;
  }

  /**
   * Check if a file exists in the repository
   */
  private async fileExists(path: string): Promise<boolean> {
    try {
      await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read and parse package.json
   */
  private async analyzePackageJson(): Promise<Partial<ProjectInfo>> {
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: "package.json",
      });

      if (Array.isArray(response.data) || !("content" in response.data)) {
        return {};
      }

      const content = Buffer.from(response.data.content, "base64").toString("utf-8");
      const pkg = JSON.parse(content);

      const info: Partial<ProjectInfo> = {
        name: pkg.name || this.repo,
        version: pkg.version,
        description: pkg.description,
        technologies: [],
      };

      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      // Detect React
      if (deps.react) {
        info.technologies?.push("React");
        info.framework = "React";
        info.type = "frontend-react";
      }

      // Detect Next.js
      if (deps.next) {
        info.technologies?.push("Next.js");
        info.framework = "Next.js";
        info.type = "frontend-nextjs";
      }

      // Detect React Native
      if (deps["react-native"]) {
        info.technologies?.push("React Native");
        info.framework = "React Native";
        info.type = "mobile-react-native";
      }

      // Detect Expo
      if (deps.expo) {
        info.technologies?.push("Expo");
        info.type = "mobile-expo";
      }

      // Detect TypeScript
      if (deps.typescript || await this.fileExists("tsconfig.json")) {
        info.technologies?.push("TypeScript");
        info.language = "TypeScript";
      } else {
        info.language = "JavaScript";
      }

      // Detect Express/Fastify (Backend)
      if (deps.express || deps.fastify || deps.koa) {
        info.technologies?.push(deps.express ? "Express" : deps.fastify ? "Fastify" : "Koa");
        if (!info.type?.startsWith("frontend")) {
          info.type = "backend-nodejs";
        }
      }

      // Detect TailwindCSS
      if (deps.tailwindcss) {
        info.technologies?.push("TailwindCSS");
      }

      // Detect state management
      if (deps.redux || deps["@reduxjs/toolkit"]) {
        info.technologies?.push("Redux");
      } else if (deps.zustand) {
        info.technologies?.push("Zustand");
      } else if (deps.mobx) {
        info.technologies?.push("MobX");
      }

      // Detect build tools
      if (deps.vite) {
        info.technologies?.push("Vite");
      } else if (deps.webpack) {
        info.technologies?.push("Webpack");
      }

      // Detect package manager
      if (await this.fileExists("pnpm-lock.yaml")) {
        info.packageManager = "pnpm";
      } else if (await this.fileExists("yarn.lock")) {
        info.packageManager = "yarn";
      } else if (await this.fileExists("package-lock.json")) {
        info.packageManager = "npm";
      }

      return info;
    } catch (error) {
      console.error("Error analyzing package.json:", error);
      return {};
    }
  }

  /**
   * Analyze Python project
   */
  private async analyzePythonProject(): Promise<Partial<ProjectInfo>> {
    const info: Partial<ProjectInfo> = {
      type: "backend-python",
      language: "Python",
      technologies: ["Python"],
    };

    try {
      // Check for requirements.txt
      if (await this.fileExists("requirements.txt")) {
        const response = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: "requirements.txt",
        });

        if (!Array.isArray(response.data) && "content" in response.data) {
          const content = Buffer.from(response.data.content, "base64").toString("utf-8");
          
          if (content.includes("django")) {
            info.technologies?.push("Django");
            info.framework = "Django";
          } else if (content.includes("flask")) {
            info.technologies?.push("Flask");
            info.framework = "Flask";
          } else if (content.includes("fastapi")) {
            info.technologies?.push("FastAPI");
            info.framework = "FastAPI";
          }
        }
      }
    } catch (error) {
      console.error("Error analyzing Python project:", error);
    }

    return info;
  }

  /**
   * Analyze directory structure
   */
  private async analyzeStructure(): Promise<ProjectInfo["structure"]> {
    const structure: ProjectInfo["structure"] = {};

    try {
      const rootContents = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: "",
      });

      if (Array.isArray(rootContents.data)) {
        const dirs = rootContents.data
          .filter((item) => item.type === "dir")
          .map((item) => item.name);

        // Check for common structures
        structure.hasComponents = dirs.includes("components") || 
                                 await this.fileExists("src/components");
        structure.hasPages = dirs.includes("pages") || 
                           dirs.includes("app") ||
                           await this.fileExists("src/pages");
        structure.hasApi = dirs.includes("api") || 
                         await this.fileExists("src/api") ||
                         await this.fileExists("src/routes");
        structure.hasModels = await this.fileExists("src/models") ||
                            await this.fileExists("models");
        structure.isMonorepo = dirs.includes("packages") ||
                             (dirs.includes("frontend") && dirs.includes("backend"));
      }
    } catch (error) {
      console.error("Error analyzing structure:", error);
    }

    return structure;
  }
}
