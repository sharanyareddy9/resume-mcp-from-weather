import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { type Context, Hono } from "hono";
import { DescopeMcpProvider } from "./descope-hono/provider";
import { descopeMcpAuthRouter } from "./descope-hono/router";
import { descopeMcpBearerAuth } from "./descope-hono/middleware/bearerAuth";
import { cors } from "hono/cors";

type Bindings = {
	DESCOPE_PROJECT_ID: string;
	DESCOPE_MANAGEMENT_KEY: string;
	DESCOPE_BASE_URL?: string;
	SERVER_URL: string;
	RESUME_PDF_URL?: string;
};

type Props = {
	bearerToken: string;
};

type State = null;

export class ResumeMCP extends McpAgent<Bindings, State, Props> {
	server = new McpServer({
		name: "Resume MCP Server",
		version: "1.0.0",
	});

	async init() {
		// Get complete resume data
		this.server.tool("getResume", "Get complete resume data in JSON format", {}, async () => {
			const resumeData = await this.getResumeData();
			return {
				content: [
					{
						type: "text",
						text: `Here's the complete resume data:\n\n${JSON.stringify(resumeData, null, 2)}`,
					},
				],
			};
		});

		// Get resume summary
		this.server.tool(
			"getResumeSummary",
			"Get a formatted summary of the resume",
			{},
			async () => {
				const resumeData = await this.getResumeData();
				const summary = this.generateSummary(resumeData);
				return {
					content: [
						{
							type: "text",
							text: summary,
						},
					],
				};
			},
		);

		// Search resume content
		this.server.tool(
			"searchResume",
			"Search through resume content by keyword",
			{
				query: z.string().describe("Search query to find in resume"),
			},
			async ({ query }) => {
				const resumeData = await this.getResumeData();
				const results = this.searchResumeContent(resumeData, query);
				return {
					content: [
						{
							type: "text",
							text: results,
						},
					],
				};
			},
		);

		// Get authentication info
		this.server.tool("getAuthInfo", "Get current authentication information", {}, async () => ({
			content: [
				{
					type: "text",
					text: `Authenticated with bearer token: ${this.props.bearerToken ? "Yes" : "No"}`,
				},
			],
		}));

		// Test tool
		this.server.tool("ping", "Test connectivity and server status", {}, async () => ({
			content: [
				{
					type: "text",
					text: "🏓 Pong! Resume MCP Server is working correctly.",
				},
			],
		}));
	}

	private async getResumeData() {
		// Check if there's a PDF URL configured
		const pdfUrl = this.env.RESUME_PDF_URL as string | undefined;
		
		if (pdfUrl) {
			// For now, just return your actual resume data
			// TODO: In the future, we can add PDF parsing
			console.log("PDF URL configured:", pdfUrl);
			return this.getActualResumeData();
		}

		// Default resume data (for demo purposes)
		return {
			personalInfo: {
				name: "Your Name",
				email: "your.email@example.com",
				phone: "+1 (555) 123-4567",
				location: "San Francisco, CA",
				linkedIn: "https://linkedin.com/in/yourprofile",
				github: "https://github.com/yourusername",
				website: "https://yourwebsite.com",
			},
			summary: "Experienced software engineer with expertise in full-stack development, cloud technologies, and scalable system design.",
			experience: [
				{
					company: "Tech Company Inc.",
					position: "Senior Software Engineer",
					startDate: "2022-01",
					current: true,
					description: "Lead development of cloud-native applications and microservices architecture",
					achievements: [
						"Designed and implemented scalable APIs serving 1M+ requests/day",
						"Reduced deployment time by 80% through CI/CD automation",
						"Mentored 5 junior developers and led cross-functional teams",
					],
				},
			],
			education: [
				{
					institution: "Stanford University",
					degree: "Bachelor of Science",
					field: "Computer Science",
					year: "2020",
					gpa: "3.8",
				},
			],
			skills: {
				technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes"],
				languages: ["English (Native)"],
				certifications: ["AWS Certified Solutions Architect"],
			},
			projects: [
				{
					name: "Open Source Project",
					description: "A TypeScript library for building scalable web applications",
					technologies: ["TypeScript", "Node.js", "Jest"],
					url: "https://npm.js/package/your-project",
					github: "https://github.com/yourusername/your-project",
				},
			],
		};
	}

	private getActualResumeData() {
		return {
			personalInfo: {
				name: "Sharanya Reddy Charabuddi",
				email: "sharanya_charabuddi@berkeley.edu",
				phone: "4806584330",
				location: "5006 Wellington Park Drive, Bay Area 95136, California",
				linkedIn: "https://linkedin.com/in/sharanya-charabuddi",
				github: "https://github.com/sharanyareddy9",
				website: "https://sharanyacharabuddi.com",
			},
			summary: "Software engineering leader with 10+ years of experience transitioning into product management, with a strong foundation in AI/ML and enterprise SaaS.",
			experience: [
				{
					company: "Apple",
					position: "Senior Software Engineer",
					startDate: "2020-10",
					current: true,
					location: "Cupertino",
					description: "Working as part of the iCloud Education and Enterprise team, building solutions that enable Apple customers to have a consistent device experience",
					achievements: [
						"Part of the initial team that launched Apple Business Essentials, enabling IT administrators to deploy and manage devices across their organization",
						"Responsible for devices data of Apple School Manager, Apple Business Manager UI and Engineering DRI for Device Enrollment Program",
						"Collaborated across engineering, design, and product teams to help launch Apple Business Essentials",
					],
				},
				{
					company: "PayPal",
					position: "Senior Software Engineer",
					startDate: "2018-08",
					endDate: "2020-10",
					location: "San Jose",
					current: false,
					description: "Worked on Identity Experience team, developing core login backend services for web and mobile platforms",
					achievements: [
						"Developed features to improve PayPal mobile app login experience, which later called OneTouch feature",
						"Worked closely with UX research and product teams to conduct A/B testing for frictionless login experience",
					],
				},
				{
					company: "PayPal",
					position: "Software Engineer",
					startDate: "2014-09",
					endDate: "2018-08",
					location: "San Jose",
					current: false,
					description: "Developed centralized monitoring tool for risk infrastructure team by gathering requirements directly from internal teams",
					achievements: [
						"Built custom dashboards using AngularJS to provide actionable insights for service-level monitoring",
					],
				},
			],
			education: [
				{
					institution: "UC Berkeley, Haas School of Business",
					degree: "MBA",
					field: "Business Administration",
					year: "2023",
				},
				{
					institution: "Arizona State University",
					degree: "MS",
					field: "Computer Science",
					year: "2014",
				},
			],
			skills: {
				technical: ["System Architecture", "AI/ML", "Enterprise SaaS", "API Development", "Cloud Services"],
				product: ["Product Strategy", "User Research", "Market Analysis", "OKR Planning"],
				methodologies: ["Agile & Scrum", "JIRA", "Figma", "A/B Testing", "Product Analytics"],
				certifications: ["Product Management - Indian School of Business", "Machine Learning - DeepLearning.AI & Stanford"],
			},
			projects: [
				{
					name: "Apple Business Essentials",
					description: "Enterprise device management solution for Apple customers",
					technologies: ["iOS", "macOS", "Enterprise APIs", "Device Management"],
					company: "Apple",
				},
				{
					name: "PayPal OneTouch",
					description: "Frictionless login experience for PayPal mobile applications",
					technologies: ["Mobile APIs", "Authentication", "A/B Testing"],
					company: "PayPal",
				},
			],
		};
	}

	private generateSummary(resumeData: any): string {
		const yearsOfExperience = resumeData.experience.length;
		const topSkills = resumeData.skills.technical.slice(0, 5).join(", ");
		const currentRole = resumeData.experience.find((exp: any) => exp.current);

		return `📋 Resume Summary:
		
👤 ${resumeData.personalInfo.name}
📧 ${resumeData.personalInfo.email}
📍 ${resumeData.personalInfo.location}

💼 Current Role: ${currentRole ? `${currentRole.position} at ${currentRole.company}` : "Not specified"}
🎓 Education: ${resumeData.education[0]?.degree} in ${resumeData.education[0]?.field} from ${resumeData.education[0]?.institution}
⭐ Top Skills: ${topSkills}
🏆 Experience: ${yearsOfExperience} positions listed

📄 Summary: ${resumeData.summary}`;
	}

	private searchResumeContent(resumeData: any, query: string): string {
		const results: string[] = [];
		const searchTerm = query.toLowerCase();

		// Search in experience
		resumeData.experience.forEach((exp: any, index: number) => {
			if (
				exp.company.toLowerCase().includes(searchTerm) ||
				exp.position.toLowerCase().includes(searchTerm) ||
				exp.description.toLowerCase().includes(searchTerm)
			) {
				results.push(
					`🏢 Experience ${index + 1}: ${exp.position} at ${exp.company} - ${exp.description}`,
				);
			}
			exp.achievements?.forEach((achievement: string) => {
				if (achievement.toLowerCase().includes(searchTerm)) {
					results.push(`🎯 Achievement: ${achievement}`);
				}
			});
		});

		// Search in skills
		resumeData.skills.technical.forEach((skill: string) => {
			if (skill.toLowerCase().includes(searchTerm)) {
				results.push(`🛠️ Technical Skill: ${skill}`);
			}
		});

		// Search in projects
		resumeData.projects?.forEach((project: any, index: number) => {
			if (
				project.name.toLowerCase().includes(searchTerm) ||
				project.description.toLowerCase().includes(searchTerm)
			) {
				results.push(`🚀 Project ${index + 1}: ${project.name} - ${project.description}`);
			}
		});

		if (results.length === 0) {
			return `No results found for "${query}" in the resume.`;
		}

		return `Found ${results.length} results for "${query}":\n\n${results.join("\n\n")}`;
	}
}

// Create the main Hono app
const app = new Hono<{ Bindings: Bindings }>();

// Apply CORS middleware
app.use(
	cors({
		origin: "*",
		allowHeaders: ["Content-Type", "Authorization", "mcp-protocol-version"],
		maxAge: 86400,
	}),
);

// OAuth routes handler
const handleOAuthRoute = async (c: Context) => {
	const provider = new DescopeMcpProvider({}, { env: c.env });
	const router = descopeMcpAuthRouter(provider);
	return router.fetch(c.req.raw, c.env, c.executionCtx);
};

// OAuth routes
app.use("/.well-known/oauth-authorization-server", handleOAuthRoute);
app.all("/authorize", handleOAuthRoute);
app.use("/register", handleOAuthRoute);

// Protected MCP routes
app.use("/sse/*", descopeMcpBearerAuth());
app.route(
	"/sse",
	new Hono().mount("/", (req, env, ctx) => {
		const authHeader = req.headers.get("authorization");
		ctx.props = {
			bearerToken: authHeader,
		};
		return ResumeMCP.mount("/sse").fetch(req, env, ctx);
	}),
);

export default app;
