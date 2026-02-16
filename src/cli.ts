#!/usr/bin/env node

import { ConfigLoader } from "./config-loader.js";
import * as readline from "readline";
import * as path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function initGlobalConfig() {
  console.log("\n🔧 Setting up global MCP configuration\n");
  console.log("This will create a global config at ~/.mcp-github-manager/config.json");
  console.log("You'll use ONE repository for ALL your project memories.\n");

  const token = await question("GitHub Token: ");
  const owner = await question("GitHub Owner (username or org): ");
  const repo = await question("GitHub Repository (memory repo): ");

  if (!token || !owner || !repo) {
    console.error("❌ All fields are required");
    process.exit(1);
  }

  ConfigLoader.saveGlobalConfig({
    github_token: token,
    github_owner: owner,
    github_repo: repo,
  });

  console.log("\n✅ Global configuration saved!");
  console.log(`\n📦 Repository: ${owner}/${repo}`);
  console.log("\nNext steps:");
  console.log("1. Go to your project directory");
  console.log("2. Run: mcp-github init-project");
  console.log("\nThis will create a .mcp-config.json with a namespace for that project.\n");

  rl.close();
}

async function initProjectConfig() {
  console.log("\n📁 Setting up project-specific configuration\n");

  const cwd = process.cwd();
  const defaultNamespace = path.basename(cwd);

  console.log(`Current directory: ${cwd}`);
  console.log(`Suggested namespace: ${defaultNamespace}\n`);

  const namespace = (await question(`Namespace (folder in memory repo) [${defaultNamespace}]: `)) || defaultNamespace;
  const projectName = (await question(`Project name [${namespace}]: `)) || namespace;

  try {
    const configPath = ConfigLoader.createLocalConfig(cwd, namespace, projectName);
    console.log(`\n✅ Project config created: ${configPath}`);
    console.log(`\n📂 Namespace: ${namespace}`);
    console.log(`📝 Project name: ${projectName}`);
    console.log("\nAll files will be stored in the memory repo under:");
    console.log(`  <memory-repo>/${namespace}/`);
    console.log("\nYou can now use this MCP with Claude Desktop or other tools!");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ Error: ${error.message}`);
    }
    process.exit(1);
  }

  rl.close();
}

function showConfig() {
  try {
    const config = ConfigLoader.loadConfig();
    console.log("\n📋 Current Configuration:\n");
    console.log(`Repository: ${config.github_owner}/${config.github_repo}`);
    if (config.namespace) {
      console.log(`Namespace: ${config.namespace}`);
      console.log(`Project: ${config.project_name || config.namespace}`);
      console.log(`Path: ${config.project_path}`);
      console.log(`\nMemory location: ${config.github_owner}/${config.github_repo}/${config.namespace}/`);
    } else {
      console.log("Namespace: (root - no local config)");
      console.log("\n💡 Tip: Run 'mcp-github init-project' to set up a namespace for this project");
    }
    console.log();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`\n❌ ${error.message}\n`);
      console.log("Run 'mcp-github init' to set up global configuration");
    }
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
MCP GitHub Project Manager CLI

Usage: mcp-github <command>

Commands:
  init              Set up global configuration (token, owner, repo)
  init-project      Set up project-specific configuration (namespace)
  config            Show current configuration
  help              Show this help message

Examples:
  # First-time setup (global config)
  mcp-github init

  # Set up a project (creates .mcp-config.json)
  cd my-project
  mcp-github init-project

  # View current config
  mcp-github config

Architecture:
  - Global config: ~/.mcp-github-manager/config.json
    Contains: token, owner, repo (ONE memory repository)
  
  - Local config: .mcp-config.json (in your project)
    Contains: namespace, project_name
  
  - Memory structure:
    <memory-repo>/
    ├── project-a/     ← namespace for project A
    ├── project-b/     ← namespace for project B
    └── project-c/     ← namespace for project C
`);
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "init":
      await initGlobalConfig();
      break;
    case "init-project":
      await initProjectConfig();
      break;
    case "config":
      showConfig();
      break;
    case "help":
    case "--help":
    case "-h":
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command || "(none)"}`);
      showHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
