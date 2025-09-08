# Resume MCP Server - Setup Guide

This guide will help you set up your own Resume MCP Server with your personal resume data.

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your Credentials

1. **Descope Account**: 
   - Sign up at [Descope](https://www.descope.com/)
   - Get your [Project ID](https://app.descope.com/settings/project)
   - Get your [Management Key](https://app.descope.com/settings/company/managementkeys)

2. **Resume PDF** (Optional):
   - Upload your resume PDF to any cloud storage (Google Drive, Dropbox, etc.)
   - Get a public URL to the PDF file

### Step 2: Configure Environment Variables

Update the `wrangler.jsonc` file with your credentials:

```jsonc
{
  "vars": {
    "DESCOPE_PROJECT_ID": "your_project_id_here",
    "DESCOPE_MANAGEMENT_KEY": "your_management_key_here", 
    "SERVER_URL": "https://your-worker-name.your-account.workers.dev",
    "RESUME_PDF_URL": "https://your-resume-pdf-url" // Optional
  }
}
```

### Step 3: Deploy

```bash
# Install dependencies
npm install

# Deploy to Cloudflare Workers
npm run deploy
```

## 📄 Resume Data Configuration

### Option 1: Use PDF URL (Recommended)
Set the `RESUME_PDF_URL` environment variable to point to your resume PDF. The server will automatically use your resume data.

### Option 2: Edit Code Directly
If you don't want to use a PDF, edit the `getActualResumeData()` method in `src/index.ts` with your information:

```typescript
private getActualResumeData() {
  return {
    personalInfo: {
      name: "Your Name",
      email: "your.email@example.com",
      phone: "+1 (555) 123-4567",
      location: "Your Location",
      linkedIn: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourusername",
      website: "https://yourwebsite.com",
    },
    summary: "Your professional summary here...",
    experience: [
      {
        company: "Your Company",
        position: "Your Position",
        startDate: "2020-01",
        current: true,
        location: "Location",
        description: "What you do...",
        achievements: [
          "Your key achievements...",
        ],
      },
    ],
    // ... add your education, skills, projects
  };
}
```

## 🔧 Local Development

```bash
# Create local environment file
cp .dev.vars.template .dev.vars

# Edit .dev.vars with your credentials
DESCOPE_PROJECT_ID="your_project_id"
DESCOPE_MANAGEMENT_KEY="your_management_key"
SERVER_URL="http://localhost:8787"
RESUME_PDF_URL="https://your-resume-pdf-url"

# Start development server
npm run dev
```

## 🌐 Using with Claude Web

1. Deploy your Resume MCP Server
2. In Claude Web, add your MCP server URL: `https://your-worker-name.your-account.workers.dev/sse`
3. Complete OAuth authentication when prompted
4. Start using resume tools: `getResume`, `getResumeSummary`, `searchResume`

## 🛠️ Available MCP Tools

- **`getResume`**: Get complete resume data in JSON format
- **`getResumeSummary`**: Get a formatted summary of the resume  
- **`searchResume`**: Search through resume content by keyword
- **`getAuthInfo`**: Get current authentication information
- **`ping`**: Test connectivity and server status

## 🔒 Security Notes

- Never commit your `.dev.vars` file (it's in `.gitignore`)
- Use Cloudflare Workers secrets for production: `wrangler secret put DESCOPE_MANAGEMENT_KEY`
- The `RESUME_PDF_URL` should point to a publicly accessible PDF

## 📚 Example Usage

```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector

# Connect to: https://your-worker-name.your-account.workers.dev/sse
```

## 🤝 Contributing

This repository is designed to be easily forkable and customizable. Feel free to:

1. Fork the repository
2. Update with your resume data
3. Deploy your own instance
4. Customize the MCP tools as needed

## 📞 Support

If you encounter issues:

1. Check the [troubleshooting section](README.md#troubleshooting) in the main README
2. Verify your Descope credentials are correct
3. Ensure your PDF URL is publicly accessible
4. Check Cloudflare Workers logs for errors

---

**That's it!** You now have your own personal Resume MCP Server that works with Claude Web and other MCP clients.