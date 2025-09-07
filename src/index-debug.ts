import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
	DESCOPE_PROJECT_ID?: string;
	DESCOPE_MANAGEMENT_KEY?: string;
	DESCOPE_BASE_URL?: string;
	SERVER_URL?: string;
};

type Props = {};
type State = null;

export class ResumeMCPServer extends McpAgent<Bindings, State, Props> {
	server = new McpServer({
		name: "Resume MCP Server (Debug)",
		version: "1.0.0",
	});

	async init() {
		// Test tool
		this.server.tool(
			"ping",
			"Test connectivity and server status",
			{},
			async () => ({
				content: [{
					type: "text",
					text: "🏓 Pong! Resume MCP Server is working correctly."
				}],
			})
		);

		// Get resume summary
		this.server.tool(
			"getResumeSummary",
			"Get a formatted summary of the resume",
			{},
			async () => ({
				content: [{
					type: "text",
					text: "📋 Resume Summary:\n\n👤 John Doe\n📧 john.doe@example.com\n📍 San Francisco, CA\n\n💼 Current Role: Senior Software Engineer at Tech Company\n🎓 Education: BS Computer Science from Stanford University\n⭐ Top Skills: JavaScript, TypeScript, React, Node.js, Python\n\n📄 Summary: Experienced software engineer with expertise in full-stack development."
				}],
			})
		);
	}
}

// Create simple Hono app
const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use(cors({
	origin: "*",
	allowHeaders: ["Content-Type", "Authorization", "mcp-protocol-version"],
	maxAge: 86400,
}));

// Home page
app.get("/", (c) => {
	return c.html(`
		<html>
			<head>
				<title>Resume MCP Server - Debug</title>
				<style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }</style>
			</head>
			<body>
				<h1>🔗 Resume MCP Server (Debug Mode)</h1>
				<p>Model Context Protocol server for accessing resume data</p>
				<p><strong>Status:</strong> ✅ Server is running!</p>
				<p><strong>MCP Endpoint:</strong> <code>/sse</code></p>
				<p><strong>Note:</strong> This is a debug version without authentication.</p>
			</body>
		</html>
	`);
});

// Simple MCP endpoint (no authentication for debugging)
app.route("/sse", new Hono().mount("/", (req, env, ctx) => {
	ctx.props = {};
	return ResumeMCPServer.mount("/sse").fetch(req, env, ctx);
}));

export default app;