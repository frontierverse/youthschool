// Seed data only: this is imported by prisma/seed.ts to import the 26
// original youthschool.co.kr posts into the database. The live site reads
// from the database via src/lib/resource-queries.ts, not from this file.
export type ResourcePost = {
  idx: number;
  title: string;
  date: string;
  body: string[];
  attachments?: string[];
  sourceHref: string;
};

export type ResourceCategory = {
  id: string;
  label: string;
  posts: ResourcePost[];
};

function sourceUrl(board: 38 | 40, idx: number): string {
  return `https://youthschool.co.kr/${board}/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=${idx}&t=board`;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: "notice",
    label: "알려드립니다",
    posts: [
      {
        idx: 167117114,
        title: "2025년 8월 이사회 개최 공고",
        date: "2025-07-30",
        body: [
          "사회적협동조합 청소년자립학교에서 이사회를 개최합니다.",
          "일시: 2025년 8월 8일(금) 16:00",
          "장소: 청소년자립학교 사무국(청년식당, 무왕로 7길 38)",
          "참석자: 법인 이사",
          "이사회 안건",
          "· 법인 신규사업장(카페) 개소 관련 논의",
          "· 바자울청소년회복지원시설 3분기 예산추가경정",
        ],
        sourceHref: sourceUrl(38, 167117114),
      },
      {
        idx: 160250671,
        title: "먹거리돌봄센터 센터장 임명 공고",
        date: "2025-03-31",
        body: [
          "사회적협동조합 청소년자립학교에서 먹거리돌봄센터의 센터장 임명을 공지합니다.",
          "임명 대상자",
          "· 소속: 먹거리돌봄센터",
          "· 직위: 센터장",
          "· 임용일: 2025년 4월 5일",
          "문서 발행인: 사회적협동조합 청소년자립학교 이사장",
        ],
        sourceHref: sourceUrl(38, 160250671),
      },
      {
        idx: 159227629,
        title: "2025년 임시총회 개최 공고(2025.2.28일)",
        date: "2025-03-24",
        body: [
          "이 공고는 첨부 이미지로 안내되었습니다. 임시총회 관련 상세 내용은 첨부파일을 확인해 주세요.",
        ],
        attachments: ["d4d976f2d2ae1.png"],
        sourceHref: sourceUrl(38, 159227629),
      },
      {
        idx: 158950179,
        title: "2025 사회적협동조합 청소년자립학교 공고",
        date: "2025-03-21",
        body: ["이 공고는 첨부 이미지로 안내되었습니다. 자세한 내용은 첨부파일을 확인해 주세요."],
        attachments: ["de0108311c4d5.png"],
        sourceHref: sourceUrl(38, 158950179),
      },
      {
        idx: 158378870,
        title: "청년다다름사업 선정 결과 안내",
        date: "2025-03-17",
        body: [
          "전북제작소 신청자 중 청년다다름사업에 선정된 참여자를 안내합니다.",
          "선정자 명단(성명·생년월일)은 개인정보 보호를 위해 일부만 공개되며, 총 21명이 선정되었습니다.",
        ],
        sourceHref: sourceUrl(38, 158378870),
      },
      {
        idx: 123438518,
        title:
          "사회적협동조합 청소년자립학교 임시총회 의결공고 및 출자감소 의결에 대한 이의신청 안내",
        date: "2024-10-25",
        body: [
          "공고번호: [자립]-2024-02",
          "공고일자: 2024년 9월 10일",
          "임시총회 주요 의결사항",
          "· 이사장 변경: 안윤숙 이사장이 2024년 8월 31일 사임하고, 김흥주 이사가 이사장으로 위임됨",
          "· 주사무소 주소지 변경: 전북특별자치도 익산시 무왕로7길 38",
          "· 출자금액 변경: 출자 1좌당 500,000원을 100,000원으로 변경",
          "· 임원수 증원: 이사 정원 확대",
          "조합원은 출자 감소에 관해 2024년 9월 10일부터 10월 10일까지 서면으로 이의신청할 수 있습니다.",
        ],
        sourceHref: sourceUrl(38, 123438518),
      },
      {
        idx: 40311208,
        title: "2024년도 협동조합의 날 기념 유공자 표창(부총리상)",
        date: "2024-07-12",
        body: ["이 게시물은 별도의 본문 텍스트 없이 현장 사진으로 안내되었습니다."],
        attachments: [
          "b0cd936f2d523.jpg",
          "0dba3b5b6adc1.jpg",
          "86a7dc95a5c02.jpg",
          "16eccb5dc4b05.jpg",
        ],
        sourceHref: sourceUrl(38, 40311208),
      },
      {
        idx: 20435321,
        title: "청소년자립학교 사회복지사 채용 공고",
        date: "2024-04-24",
        body: [
          "공고번호: 자립 제 2024-01 호",
          "직급: 사회복지사",
          "업무: 청년고독사 예방을 위한 사회건강안전망구축사업 관련 복지사업",
          "고용형태: 계약직 / 급여: 최저시급 이상",
          "자격: 사회복지 전문자격 소지자(1급 우대)",
          "지원 절차",
          "· 서류접수: 2024.04.24 ~ 04.29",
          "· 제출서류: 이력서, 자기소개서, 개인정보활용동의서",
          "· 접수방법: 이메일(200233sook@naver.com)",
          "· 심사: 서류심사 후 면접",
          "결격사유: 아동·청소년 성보호법, 아동복지법 위반자 등 제외",
        ],
        attachments: ["20240424 사회복지사 채용공고 및 지원서류.hwp"],
        sourceHref: sourceUrl(38, 20435321),
      },
      {
        idx: 15349547,
        title:
          "[전북문화관광재단 웹진 <마중> 1호] 사회적협동조합 청소년자립학교 '안윤숙' 이사장을 만나다",
        date: "2023-06-05",
        body: [
          "전북문화관광재단 웹진 <마중> 1호에 실린 안윤숙 이사장 인터뷰 기사입니다.",
          "자세한 내용은 첨부 이미지를 확인해 주세요.",
        ],
        attachments: ["18480ac8d7969.png"],
        sourceHref: sourceUrl(38, 15349547),
      },
      {
        idx: 15348044,
        title: '청소년자립학교, 기획재정부 "이달의 협동조합(5월)" 선정',
        date: "2023-06-05",
        body: [
          "기획재정부가 2023년 5월의 협동조합으로 사회적협동조합 청소년자립학교를 선정했습니다.",
          "학교·가정 밖 청소년의 자립을 지원하며, 주거지원·대안교육·취창업 지원 등의 사업을 수행하고 있습니다.",
          "2019년 조합원 8명이 450만 원을 출자해 설립되었으며, 청년식당·청년카페 운영, 먹거리 돌봄망 구축, 청년 고독사 예방 사업 등을 진행하고 있습니다. 2023년 연간 매출액은 약 2.7억 원입니다.",
          "출처: 이로운넷(김성환 기자)",
        ],
        attachments: ["2488f9e4e9a95.png"],
        sourceHref: sourceUrl(38, 15348044),
      },
      {
        idx: 11671966,
        title: "2022년 6월 임시총회 공고",
        date: "2022-05-27",
        body: [
          "정관 제31조 1항에 따라 이사회를 개최합니다.",
          "일시: 2022년 6월 7일(화) 14:00~16:00",
          "방식: 대면회의(회의자료집은 이메일로 안내 예정)",
          "참석: 임원 8명",
          "안건",
          "· 제1호: 청년카페 개소 승인",
          "· 제2호: 청년카페 예산 승인",
        ],
        attachments: ["2022년 6월 이사회 공고.pdf"],
        sourceHref: sourceUrl(38, 11671966),
      },
      {
        idx: 8764576,
        title: "청년식당 2호점 개소",
        date: "2021-11-07",
        body: ["청년식당 2호점 개소 소식을 사진으로 전해드립니다."],
        attachments: [
          "9682958bc6b82.jpg",
          "9184e98e2fc78.jpg",
          "b7494e6130dca.jpg",
          "402dbd7d6f6e0.png",
        ],
        sourceHref: sourceUrl(38, 8764576),
      },
      {
        idx: 5630947,
        title: "청년식당 집밥 도시락 배달",
        date: "2021-01-10",
        body: [
          "사회적협동조합 청년식당은 예비사회적기업 청소년자립학교가 운영하는 착한식당입니다.",
          "청년식당 도시락은 친환경쌀과 동네 어르신이 담그신 장류로 준비되며, 판매 수익의 일부는 끼니를 해결하지 못하는 아동과 청소년을 위한 무료 식사 제공에 쓰입니다.",
          "주요 서비스",
          "· 5인 이상 도시락 무료배달",
          "· 맞춤형 도시락 배달: 평일 정기도시락 5,000원부터(기업·단체·학교 등), 주말 도시락 6인 이상, 10인 이상 맞춤 메뉴 가능",
          "· 배달앱 이용: 1인 도시락 가능(배달료 있음), 5인 이상 무료배달",
          "· 영양과 맛을 함께 고려한 식단 구성",
        ],
        attachments: ["청소년식당_홍보.jpg"],
        sourceHref: sourceUrl(38, 5630947),
      },
      {
        idx: 5630927,
        title: "0819 청년 도시락 배달",
        date: "2021-01-10",
        body: [
          "청년 도시락 배달 현장 소식을 사진으로 전해드립니다. 자세한 서비스 안내는 '청년식당 집밥 도시락 배달' 게시물을 참고해 주세요.",
        ],
        attachments: ["27a6e49492714.jpeg"],
        sourceHref: sourceUrl(38, 5630927),
      },
    ],
  },
  {
    id: "info",
    label: "청소년 자립 정보",
    posts: [],
  },
  {
    id: "archive",
    label: "청소년자립학교 자료실",
    posts: [
      {
        idx: 171576923,
        title: "2025년 공익법인 결산자료공시",
        date: "2026-06-01",
        body: [
          "2025년 공익법인 결산자료(재무상태표, 기부금품의 모집 및 지출명세서)를 첨부와 같이 공시합니다.",
        ],
        attachments: ["2025년 재무상태표.pdf", "2025년 기부금품의모집및지출명세서.pdf"],
        sourceHref: sourceUrl(40, 171576923),
      },
      {
        idx: 171280404,
        title: "후원자 모집 안내",
        date: "2026-05-14",
        body: [
          "2026년도 바자울청소년회복지원시설의 후원자를 모집합니다.",
          "지인들에게 바자울이 수행하는 사업을 소개해 주시고, 후원이 필요한 청소년들에게 관심을 전해 주세요.",
        ],
        attachments: ["e1cd3e1313d64.png"],
        sourceHref: sourceUrl(40, 171280404),
      },
      {
        idx: 163528714,
        title: "사회적협동조합 청소년자립학교 2024년 공익법인 결산자료 공시",
        date: "2025-05-09",
        body: [
          "2024년 공익법인 결산자료(재무제표 및 기부금품의 모집 및 지출명세서)를 첨부와 같이 공시합니다.",
        ],
        attachments: [
          "2024년 재무제표(청소년자립학교).pdf",
          "기부금품의모집및지출명세서 (3).pdf",
        ],
        sourceHref: sourceUrl(40, 163528714),
      },
      {
        idx: 22861513,
        title: "2023년 공익법인 결산자료",
        date: "2024-05-20",
        body: [
          "2023년 공익법인 결산자료(재무제표 및 기부금품의 모집 및 지출명세서)를 첨부와 같이 공시합니다.",
        ],
        attachments: ["2023 재무제표(청소년자립학교).pdf", "2023 기부금품의모집및지출명세서.pdf"],
        sourceHref: sourceUrl(40, 22861513),
      },
      {
        idx: 15153122,
        title: "2022년 재무제표 및 합계잔액시산표",
        date: "2023-05-15",
        body: ["2022년 재무제표 및 합계잔액시산표를 첨부와 같이 공시합니다."],
        attachments: ["2022년재무제표_사회적협동조합 청소년자립학교(통합).pdf"],
        sourceHref: sourceUrl(40, 15153122),
      },
      {
        idx: 15153000,
        title: "2022년 기부금 모금액 및 활용실적 명세",
        date: "2023-05-15",
        body: ["2022년 기부금 모금액 및 활용실적 명세를 첨부와 같이 공시합니다."],
        attachments: ["2022년 기부금품의 수입 및 지출명세서.pdf"],
        sourceHref: sourceUrl(40, 15153000),
      },
      {
        idx: 11621040,
        title: "2020/2021 공익목적사업 세부현황",
        date: "2022-05-23",
        body: ["2020년, 2021년 공익목적사업 세부현황을 첨부와 같이 공시합니다."],
        attachments: ["2020_공익목적사업 세부현황.xls", "2021_공익목적사업 세부현황.xls"],
        sourceHref: sourceUrl(40, 11621040),
      },
      {
        idx: 11079660,
        title: "2021년 기부금 모금액 및 활용실적 명세",
        date: "2022-03-31",
        body: ["2021년 기부금 모금액 및 활용실적 명세를 첨부와 같이 공시합니다."],
        attachments: ["2021년기부금모금액 및 활용실적명세 (2).pdf"],
        sourceHref: sourceUrl(40, 11079660),
      },
      {
        idx: 7444318,
        title: "2020년도 사업결산 보고서",
        date: "2021-08-05",
        body: ["2020년도 청소년자립학교 사업결산 보고서를 첨부와 같이 공시합니다."],
        attachments: ["2020년 정기총회 보고서.pdf"],
        sourceHref: sourceUrl(40, 7444318),
      },
      {
        idx: 7444301,
        title: "청소년 자립학교 정관",
        date: "2021-08-05",
        body: ["청소년자립학교 정관을 첨부와 같이 공시합니다."],
        attachments: ["1. 청소년자립학교_정관.pdf"],
        sourceHref: sourceUrl(40, 7444301),
      },
      {
        idx: 7444277,
        title: "2020년도 공익법인 결산서류 등의 공시",
        date: "2021-08-05",
        body: [
          "당 조합의 2020년도 결산서류 등을 첨부와 같이 공시합니다.",
          "그동안 기관을 지지해 주신 모든 분들께 감사드립니다.",
        ],
        attachments: ["재무재표(국세청).pdf"],
        sourceHref: sourceUrl(40, 7444277),
      },
      {
        idx: 6165341,
        title: "공개 보고서 기부금모금액 및 활용실적명세",
        date: "2021-03-31",
        body: ["공개 보고서 기부금모금액 및 활용실적명세를 첨부와 같이 공시합니다."],
        attachments: ["공개 보고서 기부금모금액 및 활용실적명세.pdf"],
        sourceHref: sourceUrl(40, 6165341),
      },
    ],
  },
];

export function getCategory(categoryId: string): ResourceCategory | undefined {
  return RESOURCE_CATEGORIES.find((c) => c.id === categoryId);
}

export function getPost(categoryId: string, idx: number): ResourcePost | undefined {
  return getCategory(categoryId)?.posts.find((p) => p.idx === idx);
}
