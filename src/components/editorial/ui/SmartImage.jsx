// AVIF 우선 + JPG 폴백 <picture>. `.jpg` 경로를 주면 같은 이름의 `.avif` 를 자동 사용한다.
// 미지원 브라우저는 자동으로 jpg 로 폴백. width/height 를 주면 레이아웃 흔들림(CLS)을 막는다.
export default function SmartImage({
  src,
  alt = '',
  className = '',
  width,
  height,
  sizes,
  eager = false,
  ...rest
}) {
  const avif = src.replace(/\.jpe?g$/i, '.avif');
  // picture 는 display:contents 로 레이아웃에서 투명하게 만들어,
  // img 의 h-full/w-full 등이 실제 컨테이너 기준으로 동작하게 한다.
  return (
    <picture className="contents">
      <source srcSet={avif} type="image/avif" />
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : undefined}
        draggable={false}
        {...rest}
      />
    </picture>
  );
}
