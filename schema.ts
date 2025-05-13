import {z} from "zod"

const optionalUrl = z.url().optional()
const accountName = z.string().max(12).regex(new RegExp("^[.12345a-z]+$"))
const nodeTypes = z.enum(["producer", "query", "seed"]);
const location = z.object({
    name: z.string().describe("Location in human readable format [City, State]"),
    country: z.string().describe("Country in ISO 3166-1 alpha-2 format [XX]"),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional()
});
const username = z.string().regex(new RegExp("^[\\w_\\-.]*$"));
const usernameSlash = z.string().regex(new RegExp("^[\\w_\\-./]*$"));

// Regular expression for validating a standard hostname.
// This regex allows for domain names with letters, numbers, and hyphens,
// separated by dots, and ending with a top-level domain of at least two characters.
const hostnameRegex = new RegExp('^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$');

const hostPortSchemaNative = z.string().refine((value) => {
    const parts = value.split(':');
    if (parts.length !== 2) {
        return false;
    }
    const host = parts[0];
    const portStr = parts[1];
    const isIp = z.union([z.ipv4(), z.ipv6()]).safeParse(host).success;
    const isHostname = hostnameRegex.test(host);
    if (!isIp && !isHostname) {
        return false;
    }
    const port = parseInt(portStr, 10);
    return !(isNaN(port) || port < 0 || port > 65535);
}, {
    message: 'Invalid host:port format. Must be in the format "host:port" where host is a valid IP address or hostname and port is a number between 0 and 65535.',
});

export const BPInfoSchema = z.object({
    producer_account_name: accountName.describe("Producer account name"),
    org: z.object({
        location: location.describe("Organization location"),
        candidate_name: z.string().describe("Producer/organization name"),
        website: optionalUrl.describe("Organization website"),
        code_of_conduct: optionalUrl.describe("Link to Code of Conduct"),
        ownership_disclosure: optionalUrl.describe("Link to company ownership disclosure"),
        email: z.email().describe("Organization email").optional(),
        github_user: z.union([
            z.array(z.string().regex(new RegExp("^[\\w_\\-.]*$"))),
            z.string().regex(new RegExp("^[\\w_\\-.]*$"))
        ]).describe("Operational github username").optional(),
        branding: z.object({
            logo_256: optionalUrl.describe("Link to Organization logo [PNG format, 256x256]"),
            logo_1024: optionalUrl.describe("Link to Organization logo [PNG format, 1024x1024]"),
            logo_svg: optionalUrl.describe("Link to Organization logo [SVG format]")
        }).optional(),
        social: z.object({
            facebook: usernameSlash.describe("group/page address only, not the entire url").optional(),
            github: username.describe("username only").optional(),
            keybase: username.describe("username only").optional(),
            reddit: username.describe("username only").optional(),
            hive: username.describe("username only, WITHOUT @").optional(),
            telegram: username.describe("username only").optional(),
            twitter: username.describe("username only").optional(),
            wechat: username.describe("username only").optional(),
            youtube: usernameSlash.describe("channel address only").optional(),
            medium: username.describe("medium username only").optional(),
            discord: username.describe("discord").optional()
        }).optional(),
        chain_resources: optionalUrl.describe("URL with chain snapshots and other downloads"),
        other_resources: z.array(optionalUrl).describe("URLs to other relevant resources").optional()
    }),
    nodes: z.array(z.object({
        location: location.describe("Node location").optional(),
        node_type: z.union([z.array(nodeTypes), nodeTypes]).describe("Type of service"),
        full: z.boolean().describe("Provides full data history"),
        p2p_endpoint: hostPortSchemaNative.describe("Leap P2P endpoint (host:port)").optional(),
        api_endpoint: z.url().describe("Service HTTP endpoint (http://host:port)").optional(),
        ssl_endpoint: z.string().describe("Service HTTPS endpoint (https://host:port)").optional(),
        features: z.array(z.any()).optional(),
        metadata: z.record(z.string(), z.any()).optional()
    }).refine(
        (node) => {
            // If node_type is "seed" or includes "seed", p2p_endpoint must be provided
            const isSeedNode = 
                node.node_type === "seed" || 
                (Array.isArray(node.node_type) && node.node_type.includes("seed"));

            // If it's a seed node, p2p_endpoint must be defined
            return !isSeedNode || (isSeedNode && node.p2p_endpoint !== undefined);
        },
        {
            message: "p2p_endpoint is required for seed nodes",
            path: ["p2p_endpoint"] // This will make the error appear on the p2p_endpoint field
        }
    ).refine(
        (node) => {
            // If node_type is "query" or includes "query", either api_endpoint or ssl_endpoint must be provided
            const isQueryNode = 
                node.node_type === "query" || 
                (Array.isArray(node.node_type) && node.node_type.includes("query"));

            // If it's a query node, either api_endpoint or ssl_endpoint must be defined
            return !isQueryNode || (isQueryNode && (node.api_endpoint !== undefined || node.ssl_endpoint !== undefined));
        },
        {
            message: "Either api_endpoint or ssl_endpoint is required for query nodes",
            path: ["api_endpoint"] // This will make the error appear on the api_endpoint field
        }
    ))
}).strict().describe("Information about a block producer on AntelopeIO blockchains")
