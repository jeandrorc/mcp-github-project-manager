import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface MCPConfig {
  github_token: string;
  github_owner: string;
  github_repo: string;
  namespace?: string;        // Project namespace (folder in the repo)
  project_name?: string;
  project_path?: string;
}

export class ConfigLoader {
  private static CONFIG_FILENAME = ".mcp-config.json";
  private static GLOBAL_CONFIG_DIR = path.join(os.homedir(), ".mcp-github-manager");
  private static GLOBAL_CONFIG_FILE = path.join(
    ConfigLoader.GLOBAL_CONFIG_DIR,
    "config.json"
  );

  /**
   * Load configuration with the following priority:
   * 1. Global config (repo info) from ~/.mcp-github-manager/config.json or env vars
   * 2. Local config (namespace) from .mcp-config.json in current/parent directories
   * 
   * This allows one global repo with multiple project namespaces
   */
  static loadConfig(startDir?: string): MCPConfig {
    const cwd = startDir || process.cwd();

    // Load global config (repo info)
    let baseConfig: Partial<MCPConfig> = {};

    // Try environment variables first
    if (
      process.env.GITHUB_TOKEN &&
      process.env.GITHUB_OWNER &&
      process.env.GITHUB_REPO
    ) {
      baseConfig = {
        github_token: process.env.GITHUB_TOKEN,
        github_owner: process.env.GITHUB_OWNER,
        github_repo: process.env.GITHUB_REPO,
      };
      console.error("Using repo config from environment variables");
    } else {
      // Try global config file
      const globalConfig = this.loadGlobalConfig();
      if (globalConfig) {
        baseConfig = globalConfig;
        console.error("Using repo config from global config file");
      }
    }

    if (!baseConfig.github_token || !baseConfig.github_owner || !baseConfig.github_repo) {
      throw new Error(
        "No global configuration found. Please set environment variables or run 'mcp-github init'"
      );
    }

    // Try to load local config (namespace)
    const localConfig = this.findLocalConfig(cwd);
    if (localConfig) {
      console.error(`Using namespace '${localConfig.namespace}' from: ${localConfig.project_path}`);
      return {
        ...baseConfig,
        namespace: localConfig.namespace,
        project_name: localConfig.project_name,
        project_path: localConfig.project_path,
      } as MCPConfig;
    }

    // No local config, use base config without namespace
    console.error("No local namespace config found, using root of repository");
    return baseConfig as MCPConfig;
  }

  /**
   * Find .mcp-config.json in current directory or parent directories
   */
  private static findLocalConfig(startDir: string): MCPConfig | null {
    let currentDir = path.resolve(startDir);
    const root = path.parse(currentDir).root;

    while (currentDir !== root) {
      const configPath = path.join(currentDir, this.CONFIG_FILENAME);

      if (fs.existsSync(configPath)) {
        try {
          const content = fs.readFileSync(configPath, "utf-8");
          const config = JSON.parse(content);

          // Local config only needs namespace and optional project_name
          // Token, owner, repo come from global config
          if (!config.namespace) {
            throw new Error(
              `Invalid config in ${configPath}: missing 'namespace' field`
            );
          }

          return {
            namespace: config.namespace,
            project_name: config.project_name || config.namespace,
            project_path: currentDir,
          } as any;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Failed to load config from ${configPath}: ${error.message}`);
          }
          throw error;
        }
      }

      // Move to parent directory
      currentDir = path.dirname(currentDir);
    }

    return null;
  }

  /**
   * Load global configuration from ~/.mcp-github-manager/config.json
   */
  private static loadGlobalConfig(): MCPConfig | null {
    if (!fs.existsSync(this.GLOBAL_CONFIG_FILE)) {
      return null;
    }

    try {
      const content = fs.readFileSync(this.GLOBAL_CONFIG_FILE, "utf-8");
      const config = JSON.parse(content);

      if (!config.github_token || !config.github_owner || !config.github_repo) {
        return null;
      }

      return config;
    } catch {
      return null;
    }
  }

  /**
   * Save global configuration
   */
  static saveGlobalConfig(config: MCPConfig): void {
    // Create directory if it doesn't exist
    if (!fs.existsSync(this.GLOBAL_CONFIG_DIR)) {
      fs.mkdirSync(this.GLOBAL_CONFIG_DIR, { recursive: true });
    }

    const configToSave = {
      github_token: config.github_token,
      github_owner: config.github_owner,
      github_repo: config.github_repo,
    };

    fs.writeFileSync(
      this.GLOBAL_CONFIG_FILE,
      JSON.stringify(configToSave, null, 2),
      "utf-8"
    );

    console.error(`Global config saved to: ${this.GLOBAL_CONFIG_FILE}`);
  }

  /**
   * Create a local .mcp-config.json in the specified directory
   * Local config only contains namespace and project name
   */
  static createLocalConfig(
    dir: string,
    namespace: string,
    projectName?: string,
    force = false
  ): string {
    const configPath = path.join(dir, this.CONFIG_FILENAME);

    if (fs.existsSync(configPath) && !force) {
      throw new Error(
        `Config file already exists: ${configPath}. Use --force to overwrite.`
      );
    }

    const configToSave = {
      project_name: projectName || namespace,
      namespace: namespace,
    };

    fs.writeFileSync(
      configPath,
      JSON.stringify(configToSave, null, 2),
      "utf-8"
    );

    return configPath;
  }

  /**
   * List all projects with local configs
   */
  static listProjects(searchDir?: string): Array<{
    name: string;
    path: string;
    config: MCPConfig;
  }> {
    const projects: Array<{
      name: string;
      path: string;
      config: MCPConfig;
    }> = [];

    const dir = searchDir || os.homedir();

    // This is a simple implementation that only checks immediate subdirectories
    // A more sophisticated version could recursively search
    if (fs.existsSync(dir)) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = path.join(dir, entry.name);
          const configPath = path.join(projectPath, this.CONFIG_FILENAME);

          if (fs.existsSync(configPath)) {
            try {
              const content = fs.readFileSync(configPath, "utf-8");
              const config = JSON.parse(content);

              projects.push({
                name: config.project_name || entry.name,
                path: projectPath,
                config: {
                  ...config,
                  project_path: projectPath,
                },
              });
            } catch {
              // Skip invalid configs
            }
          }
        }
      }
    }

    return projects;
  }
}
