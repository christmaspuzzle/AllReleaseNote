const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env file (if it exists) without external packages
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, '');
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    });
}

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'releases.json');
const DATA_DIR = path.join(__dirname, 'data');
const INITIAL_DATA_FILE = path.join(__dirname, 'initial_data.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (fs.existsSync(INITIAL_DATA_FILE)) {
    try {
        const initContent = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
        let existingItems = [];
        if (fs.existsSync(DATA_FILE)) {
            existingItems = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        }
        
        const map = new Map();
        existingItems.forEach(item => map.set(item.guid || item.link, item));
        
        const initItems = JSON.parse(initContent);
        let addedCount = 0;
        initItems.forEach(item => {
            const key = item.guid || item.link;
            if (!map.has(key)) {
                map.set(key, item);
                addedCount++;
            }
        });
        
        if (addedCount > 0) {
            const merged = Array.from(map.values());
            merged.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
            fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), 'utf-8');
            console.log(`Merged ${addedCount} historical items from initial_data.json into volume.`);
        }
    } catch(err) {
        console.error("Error merging initial_data:", err);
    }
}


const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

function parseRSS(xmlStr) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xmlStr)) !== null) {
        const itemContent = match[1];
        const getTag = (tag) => {
            const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(itemContent);
            if (!m) return '';
            let text = m[1].trim();
            if (text.startsWith('<![CDATA[')) {
                text = text.substring(9, text.length - 3);
            }
            return text;
        };
        items.push({
            title: getTag('title'),
            link: getTag('link'),
            guid: getTag('guid'),
            pubDate: getTag('pubDate'),
            description: getTag('description')
        });
    }
    return items;
}

async function updateReleases() {
    return new Promise((resolve, reject) => {
        https.get('https://releasebot.io/feed/661ab83b-6255-4e1e-b9dc-a2ec9de2d42d.rss', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const newItems = parseRSS(data);
                    
                    let existingItems = [];
                    if (fs.existsSync(DATA_FILE)) {
                        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
                        if (fileContent) {
                            existingItems = JSON.parse(fileContent);
                        }
                    }

                    // Merge and deduplicate by guid or link
                    const map = new Map();
                    existingItems.forEach(item => {
                        const key = item.guid || item.link;
                        map.set(key, item);
                    });
                    
                    newItems.forEach(item => {
                        const key = item.guid || item.link;
                        map.set(key, item); // Overwrites with newer if exists
                    });

                    const merged = Array.from(map.values());
                    
                    // Sort by date descending
                    merged.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

                    fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2), 'utf-8');
                    console.log(`[${new Date().toISOString()}] Updated releases data. Total items: ${merged.length}`);
                    resolve(merged);
                } catch (err) {
                    console.error('Error parsing/saving RSS:', err);
                    reject(err);
                }
            });
        }).on('error', (err) => {
            console.error('Error fetching RSS:', err);
            reject(err);
        });
    });
}

async function translateText(text, targetLang = 'ko') {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('API key is missing');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const payload = JSON.stringify({
        contents: [{
            parts: [{
                text: `Translate the following release note to Korean (Target language code: ${targetLang}). Return only the translated text, preserving any HTML tags or markdown formatting if present.\n\nText to translate:\n${text}`
            }]
        }],
        generationConfig: {
            temperature: 0.3
        }
    });

    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode !== 200) {
                        return reject(new Error(`API Error: ${res.statusCode} ${json.error?.message || data}`));
                    }
                    if (!json.candidates || !json.candidates[0]) {
                        return reject(new Error('Unexpected API response structure'));
                    }
                    const translated = json.candidates[0].content.parts[0].text;
                    resolve(translated);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

// Initial fetch and set interval (every 1 hour)
updateReleases();
setInterval(updateReleases, 60 * 60 * 1000);

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Security Headers (Helmet equivalents)
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME-sniffing
    res.setHeader('X-Frame-Options', 'DENY'); // Prevent Clickjacking
    res.setHeader('X-XSS-Protection', '1; mode=block'); // Enable XSS filtering
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // Enforce HTTPS
    // Content Security Policy (CSP)
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com; img-src 'self' data: https://www.gstatic.com https://translate.google.com https://translate.googleapis.com; connect-src 'self' https://releasebot.io https://translate.googleapis.com");

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url.startsWith('/api/releases/refresh') && req.method === 'POST') {
        try {
            const data = await updateReleases();
            // If they want ko, we can just return it without translation and let them fetch /api/releases?lang=ko
            // but we'll let it return standard English for now.
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch(e) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error fetching releases');
        }
        return;
    }

    if (req.url.startsWith('/api/releases')) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        try {
            let items = [];
            if (fs.existsSync(DATA_FILE)) {
                items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            }
            
            const targetLang = urlObj.searchParams.get('lang');
            if (targetLang === 'ko') {
                const KO_DATA_FILE = path.join(DATA_DIR, 'releases_ko.json');
                let koItems = [];
                if (fs.existsSync(KO_DATA_FILE)) {
                    koItems = JSON.parse(fs.readFileSync(KO_DATA_FILE, 'utf-8'));
                }
                
                // Merge translated items with original to see what's missing
                const koMap = new Map(koItems.map(i => [i.guid || i.link, i]));
                
                // We will translate missing items in the background to avoid blocking the response for too long
                const missingItems = items.filter(i => !koMap.has(i.guid || i.link));
                if (missingItems.length > 0) {
                    // Background translation process
                    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
                    if (apiKey) {
                        (async () => {
                            try {
                                const batchSize = 10;
                                for (let i = 0; i < missingItems.length; i += batchSize) {
                                    const batch = missingItems.slice(i, i + batchSize);
                                    const textsToTranslate = batch.map(item => `TITLE: ${item.title}\nDESC: ${item.description}`);
                                    
                                    const prompt = `Translate the following array of release notes into Korean. Return a valid JSON array of strings in the exact same order. Do not return markdown code blocks, just the JSON array.
                                    Input:
                                    ${JSON.stringify(textsToTranslate)}`;
                                    
                                    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            contents: [{ parts: [{ text: prompt }] }],
                                            generationConfig: { responseMimeType: "application/json" }
                                        })
                                    });
                                    
                                    if (geminiRes.ok) {
                                        const data = await geminiRes.json();
                                        let resultText = data.candidates[0].content.parts[0].text.trim();
                                        if (resultText.startsWith('```json')) resultText = resultText.replace(/^```json/, '').replace(/```$/, '').trim();
                                        const translatedArray = JSON.parse(resultText);
                                        
                                        batch.forEach((item, idx) => {
                                            const translatedStr = translatedArray[idx] || "";
                                            const parts = translatedStr.split('DESC:');
                                            const titleKo = parts[0].replace('TITLE:', '').trim();
                                            const descKo = (parts[1] || "").trim();
                                            
                                            koItems.push({
                                                ...item,
                                                title: titleKo || item.title,
                                                description: descKo || item.description
                                            });
                                        });
                                        
                                        fs.writeFileSync(KO_DATA_FILE, JSON.stringify(koItems, null, 2), 'utf-8');
                                        await new Promise(r => setTimeout(r, 2000)); // sleep 2s to avoid rate limit
                                    }
                                }
                            } catch (err) {
                                console.error("Background translation error:", err);
                            }
                        })();
                    }
                    
                    // Return original items for those missing, translated for those available
                    items = items.map(item => koMap.get(item.guid || item.link) || item);
                } else {
                    items = koItems;
                }
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(items));
        } catch (err) {
            console.error('Error in /api/releases:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
        return;
    }

    if (req.url === '/api/translate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const bodyParsed = JSON.parse(body);
                const texts = Array.isArray(bodyParsed.texts) ? bodyParsed.texts : [bodyParsed.text];
                
                if (!texts || texts.length === 0 || !texts[0]) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Text or texts array is required' }));
                }

                // Translate all texts by joining them with a unique delimiter, or parallelizing
                // For simplicity and to avoid prompt injection with delimiters, we can do Promise.all
                // since Gemini 2.5 Flash handles concurrent requests well, but let's batch them into one prompt for efficiency.
                
                const prompt = `Translate the following array of release notes into Korean. Return a valid JSON array of strings in the exact same order. Do not return markdown code blocks, just the JSON array.
                
                Input:
                ${JSON.stringify(texts)}`;
                
                const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
                if (!apiKey) throw new Error('API key is missing');
                
                const geminiReq = https.request({
                    hostname: 'generativelanguage.googleapis.com',
                    path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                }, (geminiRes) => {
                    let data = '';
                    geminiRes.on('data', chunk => data += chunk);
                    geminiRes.on('end', () => {
                        if (geminiRes.statusCode >= 200 && geminiRes.statusCode < 300) {
                            try {
                                const parsed = JSON.parse(data);
                                let resultText = parsed.candidates[0].content.parts[0].text.trim();
                                if (resultText.startsWith('```json')) {
                                    resultText = resultText.replace(/^```json/, '').replace(/```$/, '').trim();
                                }
                                const translatedArray = JSON.parse(resultText);
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ translated: Array.isArray(bodyParsed.texts) ? translatedArray : translatedArray[0] }));
                            } catch (e) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Failed to parse Gemini response as JSON array' }));
                            }
                        } else {
                            res.writeHead(geminiRes.statusCode, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: `Gemini API Error: ${data}` }));
                        }
                    });
                });

                geminiReq.on('error', (e) => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: e.message }));
                });
                
                geminiReq.write(JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                }));
                geminiReq.end();
            } catch (e) {
                console.error('Translation error:', e);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message || 'Translation failed' }));
            }
        });
        return;
    }


    
    // Serve static files securely
    let requestUrl = req.url === '/' ? '/index.html' : req.url;
    // Strip query parameters for file lookup
    requestUrl = requestUrl.split('?')[0];
    
    let filePath = path.normalize(path.join(PUBLIC_DIR, requestUrl));
    
    // Prevent Directory Traversal by ensuring the resolved path is inside PUBLIC_DIR
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }
    
    let extname = path.extname(filePath);
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': MIME_TYPES[extname] || 'application/octet-stream' });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
