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

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'releases.json');
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
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

    if (req.url === '/api/releases/refresh' && req.method === 'POST') {
        try {
            const data = await updateReleases();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch(e) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error fetching releases');
        }
        return;
    }

    if (req.url === '/api/releases') {
        if (fs.existsSync(DATA_FILE)) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            fs.createReadStream(DATA_FILE).pipe(res);
        } else {
            try {
                const data = await updateReleases();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch(e) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error fetching releases');
            }
        }
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
