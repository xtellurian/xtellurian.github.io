interface Env {
    AI: Ai;
    CHAT_SESSIONS: KvNamespace;
    ASSETS: Fetcher;
}

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: number;
}

interface ChatSession {
    messages: ChatMessage[];
    createdAt: number;
    lastActivity: number;
}

interface ChatRequest {
    message: string;
    sessionId?: string;
}

interface ChatResponse {
    response: string;
    sessionId: string;
    error?: string;
}

interface HistoryResponse {
    messages: ChatMessage[];
    error?: string;
}

// System prompt with chaotic lawful personality and blog context
const SYSTEM_PROMPT = `You are a chaotic lawful AI assistant trained on xtellurian's blog posts. Your personality is witty, slightly chaotic, and you love making unexpected connections between topics.

Key characteristics:
- You're jocular and creative with occasional well-placed puns
- You have deep knowledge of dotnet, Blazor, Cloudflare, and web development
- You make unexpected but relevant connections between different topics
- You're ultimately helpful and accurate, just with creative flair
- You love discussing technology with enthusiasm and insight

Blog context areas you know well:
- Blazor development and C# web applications
- Cloudflare Pages and Workers deployment
- Static site generators and web performance
- Modern web development trends and best practices
- Blogging platforms and content management

When responding:
1. Be creative and engaging, but ensure technical accuracy
2. Add unexpected insights or connections when relevant
3. Use humor appropriately without being overwhelming
4. If asked about topics beyond the blog content, creatively redirect to relevant areas
5. Keep responses concise but comprehensive
6. Feel free to use emojis sparingly for emphasis

Remember: You're chaotic lawful - you play by the rules, but with style and creativity!`;

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

// Rate limiting configuration
const RATE_LIMIT_REQUESTS = 50; // requests per hour per IP
const RATE_LIMIT_WINDOW = 3600; // 1 hour in seconds

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);
        
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Route handling
        try {
            if (url.pathname === '/api/chat' && request.method === 'POST') {
                return handleChat(request, env);
            }
            
            if (url.pathname === '/api/history' && request.method === 'GET') {
                return handleHistory(request, env);
            }

            // Serve static assets
            if (url.pathname === '/widget.js') {
                return handleAsset(request, env, 'widget.js', 'application/javascript');
            }
            
            if (url.pathname === '/styles.css') {
                return handleAsset(request, env, 'styles.css', 'text/css');
            }

            // Default response
            return new Response(JSON.stringify({ 
                message: 'AI Chatbot Worker - Use /api/chat for conversations',
                endpoints: {
                    chat: 'POST /api/chat',
                    history: 'GET /api/history?sessionId=xxx',
                    widget: 'GET /widget.js',
                    styles: 'GET /styles.css'
                }
            }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });

        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ 
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    },
};

async function handleChat(request: Request, env: Env): Promise<Response> {
    try {
        // Rate limiting check
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        const rateLimitKey = `rate_limit:${clientIP}`;
        const currentCount = await env.CHAT_SESSIONS.get(rateLimitKey);
        
        if (currentCount && parseInt(currentCount) >= RATE_LIMIT_REQUESTS) {
            return new Response(JSON.stringify({ 
                error: 'Rate limit exceeded',
                message: 'Too many requests. Please try again later.'
            }), {
                status: 429,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        // Parse request
        const body: ChatRequest = await request.json();
        const { message, sessionId: incomingSessionId } = body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return new Response(JSON.stringify({ 
                error: 'Invalid message',
                message: 'Message is required and must be non-empty.'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        if (message.length > 2000) {
            return new Response(JSON.stringify({ 
                error: 'Message too long',
                message: 'Message must be less than 2000 characters.'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        // Retrieve or create session
        let session: ChatSession;
        let sessionId: string;
        
        if (incomingSessionId) {
            sessionId = incomingSessionId;
            const sessionData = await env.CHAT_SESSIONS.get(sessionId, 'json');
            session = sessionData as ChatSession || createNewSession();
        } else {
            sessionId = crypto.randomUUID();
            session = createNewSession();
        }

        // Update session
        session.messages.push({ 
            role: 'user', 
            content: message.trim(),
            timestamp: Date.now()
        });
        session.lastActivity = Date.now();

        // Prepare messages for AI (keep last 10 messages for context)
        const messages: ChatMessage[] = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...session.messages.slice(-10)
        ];

        // Call Workers AI
        const aiResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            max_tokens: 400,
            temperature: 0.8, // Slightly higher for more creativity
            stream: false
        });

        const assistantMessage = aiResponse.response as string;
        
        // Add assistant response to session
        session.messages.push({ 
            role: 'assistant', 
            content: assistantMessage,
            timestamp: Date.now()
        });

        // Save session with 7-day expiration
        await env.CHAT_SESSIONS.put(sessionId, JSON.stringify(session), {
            expirationTtl: 7 * 24 * 3600 // 7 days
        });

        // Update rate limit counter
        const newCount = (parseInt(currentCount || '0') + 1).toString();
        await env.CHAT_SESSIONS.put(rateLimitKey, newCount, {
            expirationTtl: RATE_LIMIT_WINDOW
        });

        const response: ChatResponse = {
            response: assistantMessage,
            sessionId
        };

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

    } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        // Handle specific AI errors
        if (errorMessage.includes('neurons')) {
            return new Response(JSON.stringify({ 
                error: 'Neuron limit exceeded',
                message: 'AI processing limit reached. Please try again later.'
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        return new Response(JSON.stringify({ 
            error: 'Chat processing failed',
            message: errorMessage
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}

async function handleHistory(request: Request, env: Env): Promise<Response> {
    try {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('sessionId');

        if (!sessionId) {
            return new Response(JSON.stringify({ 
                error: 'Missing session ID',
                message: 'Session ID is required.'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        const sessionData = await env.CHAT_SESSIONS.get(sessionId, 'json');
        
        if (!sessionData) {
            return new Response(JSON.stringify({ 
                error: 'Session not found',
                message: 'No session found with the provided ID.'
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        const session = sessionData as ChatSession;
        const response: HistoryResponse = {
            messages: session.messages || []
        };

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

    } catch (error) {
        console.error('History error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to load history',
            message: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}

async function handleAsset(
    request: Request, 
    env: Env, 
    filename: string, 
    contentType: string
): Promise<Response> {
    try {
        // Try to get from assets binding first
        const assetResponse = await env.ASSETS.fetch(new Request(`${new URL(request.url).origin}/${filename}`));
        
        if (assetResponse.ok) {
            return new Response(assetResponse.body, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=3600',
                    ...corsHeaders
                }
            });
        }

        // Fallback: read from file system
        const asset = await env.ASSETS.fetch(new Request(filename));
        if (asset.ok) {
            return new Response(asset.body, {
                headers: {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=3600',
                    ...corsHeaders
                }
            });
        }

        return new Response('Asset not found', { status: 404 });

    } catch (error) {
        console.error(`Asset error for ${filename}:`, error);
        return new Response('Failed to load asset', { status: 500 });
    }
}

function createNewSession(): ChatSession {
    return {
        messages: [],
        createdAt: Date.now(),
        lastActivity: Date.now()
    };
}