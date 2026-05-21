// 청첩장 한곳에서 관리하는 데이터.
// 실제 값으로 채울 때 이 파일만 수정하면 됨.

export const wedding = {
  groom: {
    nameKo: '채건회',
    nameEn: 'Brian Chae',
    father: '채○○',
    mother: '○○○',
    bankAccounts: [
      { label: '신랑', bank: '○○은행', number: '000-000-000000', holder: '채건회' },
      { label: '신랑 아버지', bank: '○○은행', number: '000-000-000000', holder: '채○○' },
      { label: '신랑 어머니', bank: '○○은행', number: '000-000-000000', holder: '○○○' },
    ],
  },
  bride: {
    nameKo: '○○○',
    nameEn: 'TBD',
    father: '○○○',
    mother: '○○○',
    bankAccounts: [
      { label: '신부', bank: '○○은행', number: '000-000-000000', holder: '○○○' },
      { label: '신부 아버지', bank: '○○은행', number: '000-000-000000', holder: '○○○' },
      { label: '신부 어머니', bank: '○○은행', number: '000-000-000000', holder: '○○○' },
    ],
  },
  date: {
    iso: '2026-06-14T13:00',
    dayKo: '2026년 6월 14일 일요일 오후 1시',
    dayEn: 'Sunday, June 14, 2026',
    short: '2026. 06. 14',
  },
  venue: {
    name: '○○컨벤션 그랜드홀',
    address: '서울특별시 ○○구 ○○로 000',
    hall: '5층 그랜드볼룸',
    tel: '02-0000-0000',
    naverMapUrl: 'https://map.naver.com/',
    kakaoMapUrl: 'https://map.kakao.com/',
    lat: 37.5665,
    lng: 126.978,
  },
  greeting: [
    '서로 다른 길을 걸어온 두 사람이',
    '이제 한 길을 함께 걷고자 합니다.',
    '귀한 발걸음으로 축복해 주시면 감사하겠습니다.',
  ],
  gallery: [
    // 이미지 경로는 /public/images/ 아래로 둘 예정
    // { src: '/images/01.jpg', alt: '본식 사진 1' },
  ],
  share: {
    title: 'Brian & ___ 결혼합니다',
    description: '2026. 06. 14 · 일요일 오후 1시',
    image: '/images/share-thumb.jpg',
  },
};
