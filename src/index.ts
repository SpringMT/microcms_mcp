import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "microcms-js-sdk";
import { z } from "zod";

// 環境変数の取得
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY;
const MICROCMS_SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const MICROCMS_ENDPOINT = process.env.MICROCMS_ENDPOINT;

if (!MICROCMS_API_KEY) {
    console.error("Error: MICROCMS_API_KEY environment variable is not set");
    process.exit(1);
}

if (!MICROCMS_SERVICE_DOMAIN) {
    console.error("Error: MICROCMS_SERVICE_DOMAIN environment variable is not set");
    process.exit(1);
}

if (!MICROCMS_ENDPOINT) {
    console.error("Error: MICROCMS_ENDPOINT environment variable is not set");
    process.exit(1);
}

// MicroCMSクライアントの作成
const client = createClient({
    serviceDomain: MICROCMS_SERVICE_DOMAIN,
    apiKey: MICROCMS_API_KEY,
});

// Create server instance
const server = new McpServer({
    name: "microcms",
    version: "1.0.0",
});

// 検索ツールの実装
server.tool(
    "SearchMicroCMS",
    "Search content in MicroCMS",
    {
        q: z.string().describe("Search query"),
        limit: z.number().optional().describe("Maximum number of results to return"),
        offset: z.number().optional().describe("Number of items to skip"),
        fields: z.string().optional().describe("Comma-separated list of fields to return"),
        orders: z.string().optional().describe("Sort order (e.g., '-publishedAt')"),
        filters: z.string().optional().describe("Filters in the format 'field[operator]=value'"),
    },
    async ({ q, limit, offset, fields, orders, filters }) => {
        try {
            // 検索オプションの設定
            const queries: Record<string, any> = { q };
            
            if (limit) queries.limit = limit;
            if (offset) queries.offset = offset;
            if (fields) queries.fields = fields;
            if (orders) queries.orders = orders;
            if (filters) queries.filters = filters;
            
            const response = await client.getList({
                endpoint: MICROCMS_ENDPOINT,
                queries,
            });

            // 結果をJSON文字列に変換
            const resultJson = JSON.stringify(response, null, 2);
            
            return {
                content: [
                    { 
                        type: "text", 
                        text: resultJson
                    }
                ]
            };
        } catch (error: unknown) {
            console.error("Error searching MicroCMS:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    { 
                        type: "text", 
                        text: `Failed to search MicroCMS: ${errorMessage}`
                    }
                ]
            };
        }
    }
);

// コンテンツ取得ツールの実装
server.tool(
    "GetMicroCMSContent",
    "Get specific content from MicroCMS by ID",
    {
        endpoint: z.string().describe("API endpoint (e.g., 'blogs')"),
        contentId: z.string().describe("Content ID to retrieve"),
        fields: z.string().optional().describe("Comma-separated list of fields to return"),
        depth: z.number().optional().describe("Depth for expanding references"),
    },
    async ({ endpoint, contentId, fields, depth }) => {
        try {
            const queries: Record<string, any> = {};
            
            if (fields) queries.fields = fields;
            if (depth) queries.depth = depth;
            
            const response = await client.get({
                endpoint,
                contentId,
                queries,
            });
            
            // 結果をJSON文字列に変換
            const resultJson = JSON.stringify(response, null, 2);
            
            return {
                content: [
                    { 
                        type: "text", 
                        text: resultJson
                    }
                ]
            };
        } catch (error: unknown) {
            console.error("Error getting MicroCMS content:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    { 
                        type: "text", 
                        text: `Failed to get MicroCMS content: ${errorMessage}`
                    }
                ]
            };
        }
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MicroCMS MCP Server running on stdio");
}
  
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
