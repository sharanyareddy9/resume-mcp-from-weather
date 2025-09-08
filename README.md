# Resume MCP Server

A configurable [Model Context Protocol (MCP)](https://modelcontextprotocol.com/) server for accessing resume data, built on Cloudflare Workers with Descope OAuth authentication.

## 🚀 Quick Start

**Want to use this with your own resume?** See the [**Setup Guide**](SETUP.md) for step-by-step instructions.

## ✨ Features

- 📄 **Easy Resume Integration**: Just provide a PDF URL or edit the code directly
- 🔐 **Secure OAuth Authentication**: Built-in Descope OAuth 2.0/2.1 flow
- ☁️ **Serverless Deployment**: Runs on Cloudflare Workers (free tier available)
- 🔍 **Powerful Search**: Search through your resume content by keywords
- 🤖 **Claude Web Compatible**: Works seamlessly with Claude Web and other MCP clients
- 🔧 **Fully Customizable**: Fork and modify for your specific needs

## 🎯 Use Cases

- **AI Assistant Integration**: Let Claude access your resume data for job applications
- **Personal Branding**: Provide structured access to your professional information
- **Interview Preparation**: Quick access to your experience and achievements
- **Career Management**: Searchable database of your professional history

## 🏃‍♂️ Quick Setup

### For Your Own Resume
1. **Fork this repository**
2. **Follow the [Setup Guide](SETUP.md)** - it's just 3 steps!
3. **Deploy and connect to Claude Web**

### For Development/Testing
```bash
# Clone the repository
git clone https://github.com/your-username/resume-mcp-from-weather.git
cd resume-mcp-from-weather

# Install dependencies
npm install

# Set up local environment (see SETUP.md for details)
cp .dev.vars.template .dev.vars
# Edit .dev.vars with your credentials

# Run locally
npm run dev
```

## 🧪 Testing Your Server

### With MCP Inspector
```bash
# Start MCP Inspector
npx @modelcontextprotocol/inspector

# Connect to your server
# URL: http://localhost:8787/sse (local) or https://your-worker.workers.dev/sse (deployed)
# Complete OAuth flow when prompted
```

### With Claude Web
1. Add your MCP server URL in Claude Web settings
2. Complete OAuth authentication
3. Try commands like:
   - "Show me my resume summary"
   - "Search my resume for Python experience"
   - "What's my current job title?"

## 🚀 Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Your server will be available at:
# https://your-worker-name.your-account.workers.dev/sse
```

**Note**: See [SETUP.md](SETUP.md) for detailed deployment instructions including credential configuration.

## Debugging

Should anything go wrong it can be helpful to restart Claude, or to try connecting directly to your
MCP server on the command line with the following command.

```bash
npx mcp-remote http://localhost:8787/sse
```

In some rare cases it may help to clear the files added to `~/.mcp-auth`

```bash
rm -rf ~/.mcp-auth
```

## Features

The MCP server implementation includes:

- 📄 Resume Management and Retrieval
- 🔐 OAuth 2.0/2.1 Authorization Server Metadata (RFC 8414)
- 🔑 Dynamic Client Registration (RFC 7591)
- 🎫 Token Revocation (RFC 7009)
- 🔒 PKCE Support
- 📝 Bearer Token Authentication
