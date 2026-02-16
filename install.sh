#!/bin/bash

# MCP GitHub Project Manager - Global Installation Script
# This script installs the MCP globally and sets up the CLI

set -e

echo "🚀 Installing MCP GitHub Project Manager globally..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Installation directory
INSTALL_DIR="$HOME/.mcp-github-manager"
BIN_DIR="$HOME/.local/bin"

# Create directories
echo -e "${BLUE}📁 Creating installation directory...${NC}"
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"

# Copy files
echo -e "${BLUE}📦 Copying MCP files...${NC}"
cp -r dist/* "$INSTALL_DIR/"
cp package.json "$INSTALL_DIR/"
cp -r node_modules "$INSTALL_DIR/" 2>/dev/null || true

# Install npm package globally for CLI
echo -e "${BLUE}🔧 Installing CLI command...${NC}"
cd "$INSTALL_DIR"
npm link 2>/dev/null || {
  echo -e "${YELLOW}⚠️  npm link failed, creating manual wrapper${NC}"
  cat > "$BIN_DIR/mcp-github" << 'EOF'
#!/bin/bash
node "$HOME/.mcp-github-manager/cli.js" "$@"
EOF
  chmod +x "$BIN_DIR/mcp-github"
}

# Check if BIN_DIR is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo -e "${YELLOW}⚠️  $BIN_DIR is not in your PATH${NC}"
    echo -e "${YELLOW}Add this line to your ~/.bashrc or ~/.zshrc:${NC}"
    echo -e "${GREEN}export PATH=\"\$HOME/.local/bin:\$PATH\"${NC}"
    echo ""
fi

echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run: ${GREEN}mcp-github init${NC} to set up global configuration"
echo "2. Or run: ${GREEN}mcp-github init-project${NC} in your project directory"
echo ""
echo -e "${BLUE}For help:${NC} ${GREEN}mcp-github --help${NC}"
