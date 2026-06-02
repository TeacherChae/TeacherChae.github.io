// 주경 청첩장 — 로컬 변수를 레포의 tokens.json 형식으로 내보내는 Figma 플러그인.
// Color/Spacing/Type 컬렉션을 읽어 UI 로 넘기면, UI 에서 복사/다운로드한다.
(async () => {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const vars = await figma.variables.getLocalVariablesAsync();

  const byId = {};
  for (const c of collections) byId[c.id] = c;

  const round = (n) => Math.round(n * 255);
  const toHex = (c) =>
    '#' + [c.r, c.g, c.b].map((x) => round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
  const channels = (c) => `${round(c.r)} ${round(c.g)} ${round(c.b)}`;

  // Figma 컬렉션 이름 → tokens.json 버킷
  const bucketMap = { Color: 'color', Spacing: 'spacing', Type: 'fontSize', Font: 'fontFamily' };

  const out = {
    _source: 'Figma local variables — exported by 주경 토큰 내보내기 플러그인',
    _note: 'Figma가 source of truth. 직접 수정 금지. 이 파일을 src/design/tokens.json 에 저장 후 `npm run tokens:build`.',
    color: {},
    spacing: {},
    fontSize: {},
    fontFamily: {},
  };

  for (const v of vars) {
    const coll = byId[v.variableCollectionId];
    const bucket = bucketMap[coll && coll.name];
    if (!bucket) continue; // 알 수 없는 컬렉션은 건너뜀
    const modeId = coll.modes[0].modeId;
    const val = v.valuesByMode[modeId];
    const key = v.name.includes('/') ? v.name.split('/').slice(1).join('/') : v.name;

    if (v.resolvedType === 'COLOR') {
      out[bucket][key] = {
        hex: toHex(val),
        channels: channels(val),
        alpha: val.a == null ? 1 : Math.round(val.a * 100) / 100,
      };
    } else {
      out[bucket][key] = val;
    }
  }

  figma.showUI(__html__, { width: 440, height: 480, title: '토큰 내보내기' });
  figma.ui.postMessage(out);
})();
