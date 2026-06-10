// Figma plugin main thread — runs INSIDE Figma Desktop, so locally-installed
// fonts (MaruBuriOTF, Pretendard, ...) are loadable and writes go to the real file.
// No eval (Figma sandbox blocks it): fixed RPC command set instead.

figma.showUI(__html__, { width: 320, height: 200 });

function hexToRgb(hex) {
  const h = String(hex).replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return {
    r: parseInt(n.slice(0, 2), 16) / 255,
    g: parseInt(n.slice(2, 4), 16) / 255,
    b: parseInt(n.slice(4, 6), 16) / 255,
  };
}

async function handle(command, a) {
  a = a || {};
  switch (command) {
    case 'ping':
      return { pong: true };

    case 'fonts': {
      const all = await figma.listAvailableFontsAsync();
      const q = (a.query || '').toLowerCase();
      const fams = {};
      for (const f of all) {
        const fam = f.fontName.family;
        if (q && !fam.toLowerCase().includes(q)) continue;
        (fams[fam] = fams[fam] || []).push(f.fontName.style);
      }
      return { families: fams };
    }

    case 'loadFont': {
      await figma.loadFontAsync({ family: a.fontFamily, style: a.fontStyle || 'Regular' });
      return { loaded: { family: a.fontFamily, style: a.fontStyle || 'Regular' } };
    }

    case 'meta': {
      const n = await figma.getNodeByIdAsync(a.nodeId);
      if (!n) throw new Error('node not found: ' + a.nodeId);
      const o = { id: n.id, name: n.name, type: n.type, x: n.x, y: n.y, width: n.width, height: n.height };
      if (n.type === 'TEXT') {
        o.characters = n.characters;
        o.fontName = n.fontName;
        o.fontSize = n.fontSize;
      }
      return o;
    }

    case 'setText': {
      const n = await figma.getNodeByIdAsync(a.nodeId);
      if (!n || n.type !== 'TEXT') throw new Error('not a text node: ' + a.nodeId);
      // Load the node's current fonts (needed to mutate existing characters)…
      const len = Math.max(1, n.characters.length);
      const cur = n.getRangeAllFontNames(0, len);
      for (const fn of cur) await figma.loadFontAsync(fn);
      // …and the target font if we're switching.
      let target = null;
      if (a.fontFamily) {
        target = { family: a.fontFamily, style: a.fontStyle || 'Regular' };
        await figma.loadFontAsync(target);
      }
      if (target) n.fontName = target;
      if (a.characters != null) n.characters = a.characters;
      if (a.fontSize != null) n.fontSize = a.fontSize;
      if (a.letterSpacing != null) n.letterSpacing = { unit: 'PERCENT', value: a.letterSpacing };
      if (a.fills) n.fills = a.fills;
      if (a.color) n.fills = [{ type: 'SOLID', color: typeof a.color === 'string' ? hexToRgb(a.color) : a.color }];
      if (a.x != null) n.x = a.x;
      if (a.y != null) n.y = a.y;
      return { id: n.id, characters: n.characters, fontName: n.fontName, fontSize: n.fontSize, x: n.x, y: n.y, width: n.width, height: n.height };
    }

    case 'createText': {
      const t = figma.createText();
      const font = { family: a.fontFamily || 'Inter', style: a.fontStyle || 'Regular' };
      await figma.loadFontAsync(font);
      t.fontName = font;
      t.characters = a.characters || '';
      if (a.fontSize != null) t.fontSize = a.fontSize;
      if (a.letterSpacing != null) t.letterSpacing = { unit: 'PERCENT', value: a.letterSpacing };
      if (a.textAlign) t.textAlignHorizontal = a.textAlign;
      if (a.color) t.fills = [{ type: 'SOLID', color: typeof a.color === 'string' ? hexToRgb(a.color) : a.color }];
      let parent = figma.currentPage;
      if (a.parentId) { const p = await figma.getNodeByIdAsync(a.parentId); if (p) parent = p; }
      parent.appendChild(t);
      if (a.width != null) { t.textAutoResize = 'HEIGHT'; t.resize(a.width, t.height); }
      if (a.x != null) t.x = a.x;
      if (a.y != null) t.y = a.y;
      return { id: t.id, characters: t.characters, x: t.x, y: t.y, width: t.width, height: t.height };
    }

    case 'setProps': {
      const n = await figma.getNodeByIdAsync(a.nodeId);
      if (!n) throw new Error('node not found: ' + a.nodeId);
      const p = a.props || {};
      for (const k of ['name', 'visible', 'opacity']) if (p[k] != null) n[k] = p[k];
      if (p.width != null || p.height != null) n.resize(p.width != null ? p.width : n.width, p.height != null ? p.height : n.height);
      if (p.x != null) n.x = p.x;
      if (p.y != null) n.y = p.y;
      return { id: n.id, x: n.x, y: n.y, width: n.width, height: n.height };
    }

    case 'export': {
      const n = await figma.getNodeByIdAsync(a.nodeId);
      if (!n) throw new Error('node not found: ' + a.nodeId);
      const bytes = await n.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: a.scale || 1 } });
      return { base64: figma.base64Encode(bytes), width: n.width, height: n.height };
    }

    case 'delete': {
      const n = await figma.getNodeByIdAsync(a.nodeId);
      if (n) n.remove();
      return { removed: a.nodeId };
    }

    default:
      throw new Error('unknown command: ' + command);
  }
}

figma.ui.onmessage = async (msg) => {
  if (!msg || msg.type !== 'exec') return;
  try {
    const result = await handle(msg.command, msg.args);
    figma.ui.postMessage({ type: 'result', id: msg.id, ok: true, result });
  } catch (e) {
    figma.ui.postMessage({ type: 'result', id: msg.id, ok: false, error: String((e && e.message) || e) });
  }
};
