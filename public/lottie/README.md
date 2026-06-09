# Hero Lottie 에셋 두는 곳

LottieFiles 등에서 받은 손글씨/캘리그래피 애니메이션 파일을 여기에 넣으면
Hero 가 자동으로 그걸 재생한다. (파일이 없으면 기존 SVG 손글씨로 fallback)

## 파일명 규칙

아래 둘 중 **아무 거나** 이 폴더에 두면 된다 (HeroLottie 가 순서대로 찾는다):

1. `hero.lottie`  ← 권장 (dotLottie, 압축 포맷)
2. `hero.json`    ← Bodymovin/Lottie JSON 도 그대로 지원

예) 다운로드한 파일이 `wedding-calligraphy.json` 이면 → `hero.json` 으로 이름 바꿔서 이곳에 복사.

## 다른 경로/파일명을 쓰고 싶으면

`src/components/editorial/HeroLottie.jsx` 의 `DEFAULT_SOURCES` 배열만 바꾸면 된다.
