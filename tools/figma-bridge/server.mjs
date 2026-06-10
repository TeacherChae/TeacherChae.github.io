// Bridge relay: HTTP in (from the agent via curl) → WebSocket → Figma plugin → back.
// Runs in WSL; the Figma Desktop plugin (Windows) connects over mirrored localhost.
import http from 'node:http';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT || 8787);
let plugin = null;
const pending = new Map();
let seq = 0;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/cmd') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      if (!plugin || plugin.readyState !== 1) {
        res.writeHead(503, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'plugin not connected (open the Local Write Bridge plugin in Figma Desktop)' }));
        return;
      }
      let cmd;
      try { cmd = JSON.parse(body); } catch { res.writeHead(400); res.end('{"ok":false,"error":"bad json"}'); return; }
      const id = 'r' + ++seq;
      const to = setTimeout(() => {
        if (pending.has(id)) { pending.delete(id); res.writeHead(504, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: 'timeout' })); }
      }, 30000);
      pending.set(id, { res, to });
      plugin.send(JSON.stringify({ id, command: cmd.command, args: cmd.args }));
    });
    return;
  }
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ ok: true, pluginConnected: !!(plugin && plugin.readyState === 1) }));
});

const wss = new WebSocketServer({ server });
wss.on('connection', (socket) => {
  plugin = socket;
  console.log('plugin connected');
  socket.on('message', (data) => {
    let m;
    try { m = JSON.parse(data.toString()); } catch { return; }
    const p = pending.get(m.id);
    if (!p) return;
    clearTimeout(p.to);
    pending.delete(m.id);
    p.res.writeHead(200, { 'content-type': 'application/json' });
    p.res.end(JSON.stringify(m));
  });
  socket.on('close', () => { if (plugin === socket) plugin = null; console.log('plugin disconnected'); });
});

server.listen(PORT, () => console.log('figma-bridge listening on http://localhost:' + PORT));
