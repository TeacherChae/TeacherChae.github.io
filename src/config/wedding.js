// 청첩장 데이터의 single source of truth.
// 개인정보/표시 정보는 VITE_* 환경변수에서 읽는다.
// 주의: Vite 클라이언트 env는 브라우저 번들에 포함되므로 비밀값 저장용이 아니라
// git 소스에 개인정보를 하드코딩하지 않기 위한 용도다.

const env = import.meta.env;
const value = (key, fallback = '') => env[key] || fallback;
const number = (key, fallback) => Number(env[key] ?? fallback);

const groomNameKo = value('VITE_GROOM_NAME_KO', '신랑');
const groomNameEn = value('VITE_GROOM_NAME_EN', 'Groom');
const groomFullNameEn = value('VITE_GROOM_FULL_NAME_EN', groomNameEn);
const groomFather = value('VITE_GROOM_FATHER', '신랑 아버님');
const groomMother = value('VITE_GROOM_MOTHER', '신랑 어머님');
const groomBankAccount = {
  label: '신랑 측',
  bank: value('VITE_GROOM_BANK', '은행명'),
  number: value('VITE_GROOM_ACCOUNT_NUMBER', '000000000000'),
  holder: value('VITE_GROOM_ACCOUNT_HOLDER', groomNameKo),
};

const brideNameKo = value('VITE_BRIDE_NAME_KO', '신부');
const brideNameEn = value('VITE_BRIDE_NAME_EN', 'Bride');
const brideFullNameEn = value('VITE_BRIDE_FULL_NAME_EN', brideNameEn);
const brideFather = value('VITE_BRIDE_FATHER', '신부 아버님');
const brideMother = value('VITE_BRIDE_MOTHER', '신부 어머님');
const brideBankAccount = {
  label: '신부 측',
  bank: value('VITE_BRIDE_BANK', '은행명'),
  number: value('VITE_BRIDE_ACCOUNT_NUMBER', '000000000000'),
  holder: value('VITE_BRIDE_ACCOUNT_HOLDER', brideNameKo),
};

const weddingDateIso = value('VITE_WEDDING_DATE_ISO', '2026-09-05T11:00');
const weddingEndIso = value('VITE_WEDDING_END_ISO', '2026-09-05T13:00');
const weddingDayKo = value('VITE_WEDDING_DAY_KO', '2026년 9월 5일 토요일 오전 11시');
const weddingDayEn = value('VITE_WEDDING_DAY_EN', 'Saturday, September 5, 2026');
const weddingShort = value('VITE_WEDDING_DATE_SHORT', '2026.09.05');
const weddingTime = value('VITE_WEDDING_TIME', '11:00 AM');

const venueName = value('VITE_VENUE_NAME', '예식장');
const venueAddress = value('VITE_VENUE_ADDRESS', '예식장 주소');

export const wedding = {
  groom: {
    nameKo: groomNameKo,
    nameEn: groomNameEn,
    fullNameEn: groomFullNameEn,
    father: groomFather,
    mother: groomMother,
    bankAccount: groomBankAccount,
    bankAccounts: [groomBankAccount],
  },
  bride: {
    nameKo: brideNameKo,
    nameEn: brideNameEn,
    fullNameEn: brideFullNameEn,
    father: brideFather,
    mother: brideMother,
    bankAccount: brideBankAccount,
    bankAccounts: [brideBankAccount],
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
    tel: value('VITE_VENUE_TEL', '02-0000-0000'),
    naverMapUrl: value('VITE_NAVER_MAP_URL'),
    kakaoMapUrl: value('VITE_KAKAO_MAP_URL'),
    googleMapUrl: value('VITE_GOOGLE_MAP_URL'),
    lat: number('VITE_VENUE_LAT', 37.541488),
    lng: number('VITE_VENUE_LNG', 126.997052),
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
    '서로의 돕는 베필이 되어',
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
  motif: {
    footer: ['Arise My Love,', 'My Fair One,', 'and Come Away'],
  },
};
