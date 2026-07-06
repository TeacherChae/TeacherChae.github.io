import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// CARTO 무료 타일(키 불필요). 스타일을 바꾸려면 TILE_URL만 교체하면 된다.
//   Positron(밝은 회색·미니멀): light_all  ·  라벨 제거: light_nolabels
//   Dark Matter(다크):          dark_all   ·  라벨 제거: dark_nolabels
//   Voyager(은은한 컬러):        rastertiles/voyager  ·  라벨 제거: rastertiles/voyager_nolabels
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

export default function VenueMap({ lat, lng, name }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return undefined;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: false, // 페이지 스크롤 가로채지 않도록 휠 줌은 끔(터치 핀치/더블탭 줌은 유지)
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, subdomains: 'abcd', maxZoom: 20 }).addTo(map);

    // 잉크 톤 커스텀 마커 — 기본 핀 이미지(번들 경로 깨짐) 의존성 회피.
    const icon = L.divIcon({
      className: '',
      html:
        '<span style="display:block;width:10px;height:10px;border-radius:9999px;' +
        'background:rgb(var(--color-ink));box-shadow:0 0 0 3px rgb(var(--color-ink)/0.18)"></span>',
      iconSize: [10, 10],
      iconAnchor: [5, 5],
    });
    L.marker([lat, lng], { icon, title: name, keyboard: false }).addTo(map);

    // 레이아웃 확정 후 타일 크기 재계산(리빌 애니메이션 중 초기화 보정).
    const t = setTimeout(() => map.invalidateSize(), 0);

    return () => {
      clearTimeout(t);
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, name]);

  return <div ref={containerRef} className="h-full w-full" role="img" aria-label={`${name} 위치 지도`} />;
}
