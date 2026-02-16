import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GitHubProjectManager } from "./github-manager.js";
import dotenv from "dotenv";

dotenv.config();

// Validate environment variables
const requiredEnvVars = ["GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const manager = new GitHubProjectManager(
  process.env.GITHUB_TOKEN!,
  process.env.GITHUB_OWNER!,
  process.env.GITHUB_REPO!
);

const server = new Server(
  {
    name: "github-project-manager",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: "read_file",
    description: "Read a file from the GitHub repository",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Path to the file in the repository (e.g., docs/README.md)",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description: "Write or update a file in the GitHub repository",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Path to the file in the repository",
        },
        content: {
          type: "string",
          description: "Content to write to the file",
        },
        message: {
          type: "string",
          description: "Commit message",
        },
      },
      required: ["path", "content", "message"],
    },
  },
  {
    name: "create_file",
    description: "Create a new file in the GitHub repository",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Path for the new file",
        },
        content: {
          type: "string",
          description: "Content for the new file",
        },
        message: {
          type: "string",
          description: "Commit message",
        },
      },
      required: ["path", "content", "message"],
    },
  },
  {
    name: "list_files",
    description: "List files and folders in a directory",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Path to the directory (empty string for root)",
        },
        recursive: {
          type: "boolean",
          description: "List files recursively",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "search_content",
    description: "Search for content in repository files",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        path: {
          type: "string",
          description: "Optional path to limit search to specific folder",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_project_info",
    description: "Get project information from config.json",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "update_config",
    description: "Update project configuration",
    inputSchema: {
      type: "object" as const,
      properties: {
        key: {
          type: "string",
          description: "Configuration key (supports dot notation: section.key)",
        },
        value: {
          type: "string",
          description: "New value for the configuration key",
        },
      },
      required: ["key", "value"],
    },
  },
  {
    name: "delete_file",
    description: "Delete a file from the repository",
    inputSchema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "Path to the file to delete",
        },
        message: {
          type: "string",
          description: "Commit message",
        },
      },
      required: ["path", "message"],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case "read_file": {
        const result = await manager.readFile(args.path as string);
        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      }

      case "write_file": {
        const result = await manager.writeFile(
          args.path as string,
          args.content as string,
          args.message as string
        );
        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      }

      case "create_file": {
        const result = await manager.createFile(
          args.path as string,
          args.content as string,
          args.message as string
        );
        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      }

      case "list_files": {
        const result = await manager.listFiles(
          args.path as string,
          (args.recursive as boolean) || false
        );
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "search_content": {
        const result = await manager.searchContent(
          args.query as string,
          args.path as string | undefined
        );
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_project_info": {
        const result = await manager.getProjectInfo();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "update_config": {
        const result = await manager.updateConfig(
          args.key as string,
          args.value as string
        );
        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      }

      case "delete_file": {
        const result = await manager.deleteFile(
          args.path as string,
          args.message as string
        );
        return {
          content: [
            {
              type: "text" as const,
              text: result,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text" as const,
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GitHub Project Manager MCP server running on stdio");
}

main().catch(console.error);
