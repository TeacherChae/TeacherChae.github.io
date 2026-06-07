# BGM 파일

배경 음악은 **Supabase Storage** 의 공개 버킷 `assets` 에 둡니다 (repo에 넣지 않음).

## 올리는 법
1. Supabase 대시보드 → **Storage → `assets` 버킷**
2. 음악 파일을 **`bgm.mp3`** 이름으로 업로드 (드래그-드롭)
3. 끝. 사이트가 자동으로 불러옵니다.

- 공개 URL: `https://uoewipzfwsdijyrntreh.supabase.co/storage/v1/object/public/assets/bgm.mp3`
- 코드는 `App.jsx` 에서 `VITE_SUPABASE_URL` 로 위 URL을 조립 → `<Bgm src>` 로 전달
- 재생 로직: `src/components/editorial/Bgm.jsx`
- 다른 파일명을 쓰려면 `App.jsx` 의 `bgmSrc` 조립부 수정

## 권장 사양
- 포맷: **mp3** (전 브라우저 호환), 비트레이트 96~128kbps
- 길이: 루프되므로 1~3분, 자연스럽게 이어지는 구간
- 용량: **3~4MB 이하** 권장 (버킷 상한 15MB)
- 저작권: 공개 사이트이므로 **권리 보유 곡 또는 로열티프리/CC**만 사용
  - CC-BY 곡이면 푸터에 출처 표기 필요, CC0/퍼블릭도메인은 표기 불필요

> 참고: repo 안 `public/audio/bgm.mp3` 도 fallback 경로입니다(Supabase 미설정 시).
