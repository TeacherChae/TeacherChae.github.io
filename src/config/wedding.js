// 청첩장에 표시되는 공개 콘텐츠의 single source of truth.
// Vite 클라이언트 번들에 포함되는 값이므로 비밀 정보는 넣지 않는다.
// 배포 환경별 설정이 필요한 Supabase URL/key만 .env.local에서 관리한다.

const groomNameKo = '채건희';
const groomNameEn = 'KeonHee';
const groomFullNameEn = 'KeonHee Chae';
const groomFather = '채문식';
const groomMother = '박미용';
// 한 측에 여러 계좌 — role(신랑/혼주 등)로 구분. 실제 은행/번호/예금주는 여기서 채운다.
const groomBankAccounts = [
  { role: '혼주', bank: '은행명', number: '000000000000', holder: groomFather },
  { role: '혼주', bank: '은행명', number: '000000000000', holder: groomMother },
  // { role: '신랑', bank: '은행명', number: '000000000000', holder: groomNameKo },
];

const brideNameKo = '이주경';
const brideNameEn = 'JuGyeong';
const brideFullNameEn = 'JuGyeong Lee';
const brideFather = '이병연';
const brideMother = '문숙희';
const brideBankAccounts = [
  { role: '혼주', bank: '은행명', number: '000000000000', holder: brideFather },
  { role: '혼주', bank: '은행명', number: '000000000000', holder: brideMother },
  // { role: '신부', bank: '은행명', number: '000000000000', holder: brideNameKo },
];

const weddingDateIso = '2026-09-05T11:00';
const weddingEndIso = '2026-09-05T13:00';
const weddingDayKo = '2026년 9월 5일 토요일 오전 11시';
const weddingDayEn = 'Saturday, September 5, 2026';
const weddingShort = '2026.09.05';
const weddingTime = '11:00 AM';

const venueName = '남산 한남 웨딩가든';
const venueAddress = '서울특별시 용산구 소월로 323';

export const wedding = {
  groom: {
    nameKo: groomNameKo,
    nameEn: groomNameEn,
    fullNameEn: groomFullNameEn,
    father: groomFather,
    mother: groomMother,
    bankAccounts: groomBankAccounts,
  },
  bride: {
    nameKo: brideNameKo,
    nameEn: brideNameEn,
    fullNameEn: brideFullNameEn,
    father: brideFather,
    mother: brideMother,
    bankAccounts: brideBankAccounts,
  },
  date: {
    iso: weddingDateIso,
    endIso: weddingEndIso,
    dayKo: weddingDayKo,
    dayEn: weddingDayEn,
    short: weddingShort,
    time: weddingTime,
  },
  venue: {
    name: venueName,
    address: venueAddress,
    naverMapUrl: 'https://naver.me/FAPXf05C',
    kakaoMapUrl: 'https://place.map.kakao.com/1728121058',
    googleMapUrl: 'https://maps.app.goo.gl/Bwii6TsPW3YResi97',
    lat: 37.541488,
    lng: 126.997052,
    access: [
      {
        title: '셔틀 버스 안내',
        items: [
          '한강진역 2번 출구 앞 임시 승차장에서 셔틀버스가 운행됩니다.',
          '예식 1시간 전부터 10분 간격으로 출발합니다.',
          '예식 후에는 식장 정문 앞에서 한강진역 방향으로 순환 운행됩니다.',
        ],
      },
      {
        title: '대중 교통 안내',
        items: [
          '지하철 6호선 한강진역 2번 출구에서 도보 약 12분 거리입니다.',
          '버스 이용 시 한남동 주민센터 정류장 하차 후 도보로 이동해 주세요.',
          '언덕길이 있어 어르신께서는 택시 또는 셔틀 이용을 권장드립니다.',
        ],
      },
      {
        title: '공영 주차장 안내',
        items: [
          '한남동 공영주차장을 이용하실 수 있습니다.',
          '주차장에서 식장까지 도보 약 7분 소요됩니다.',
          '주차 공간이 제한적이니 가급적 대중교통과 셔틀을 이용해 주세요.',
        ],
      },
    ],
  },
  scripture: {
    ref: 'MARK 10:7-9',
    lines: [
      '사람이 그 부모를 떠나서 그 둘이 한몸이 될지니라.',
      '이러한즉 이제 둘이 아니요 한몸이니',
      '그러므로 하나님이 짝지어 주신 것을 사람이 나누지 못할지니라.',
    ],
  },
  greeting: [
    `${groomFather}·${groomMother}의 장남 ${groomNameKo}와`,
    `${brideFather}·${brideMother}의 장녀 ${brideNameKo}이`,
    '귀한 만남의 결실을 맺어',
    '새로운 가정을 이루는 믿음의 약속을 합니다.',
    '',
    '서로의 돕는 배필이 되어',
    '하나님께 기쁨이 되고 사랑을 나누겠습니다.',
    '',
    '그 첫 발걸음을 내딛는 결혼예배에',
    '귀한 마음으로 함께해 주시기 바랍니다.',
  ],
  images: {
    hero: '/images/hero.jpg',
    share: '/images/share-thumb.jpg',
  },
  gallery: [
    { src: '/images/gallery-01.jpg', alt: '야외에서 함께 선 두 사람' },
    { src: '/images/gallery-02.jpg', alt: '잔디 위에서 함께한 웨딩 사진' },
    { src: '/images/gallery-03.jpg', alt: '넓은 잔디 위의 두 사람' },
    { src: '/images/gallery-04.jpg', alt: '스파클러를 든 두 사람' },
    { src: '/images/gallery-05.jpg', alt: '밤 풍경 속 두 사람' },
    { src: '/images/gallery-06.jpg', alt: '도시 야경 속 두 사람' },
    { src: '/images/gallery-07.jpg', alt: '불꽃 아래의 두 사람' },
  ],
  share: {
    title: `${brideNameKo} & ${groomNameKo} 결혼합니다`,
    description: `${weddingShort} · 토요일 오전 11시 · ${venueName}`,
    image: '/images/share-thumb.jpg',
  },
  rsvp: {
    notice: '식장이 협소하여 화환은 정중히 사양하오니 양해 부탁드립니다.',
  },
  motif: {
    footer: ['Arise My Love,', 'My Fair One,', 'and Come Away'],
  },
};
