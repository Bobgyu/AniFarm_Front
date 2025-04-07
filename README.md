# 농산물 가격 정보 웹 서비스 프론트엔드

농산물 가격 정보 및 예측, 커뮤니티 기능을 제공하는 웹 서비스의 프론트엔드 프로젝트입니다.

## 배포 URL

- 프론트엔드: https://anifarm-dusky.vercel.app
- 백엔드: https://backend.jjiwon.site

## 프로젝트 구조

```
front/
├── src/               # 소스 코드
│   ├── components/    # 리액트 컴포넌트
│   ├── redux/         # Redux 상태 관리
│   ├── data/          # 데이터 관련 파일
│   ├── hooks/         # 커스텀 훅
│   ├── assets/        # 이미지, 폰트 등 리소스
│   ├── utils/         # 유틸리티 함수
│   ├── App.js         # 메인 애플리케이션
│   └── index.js       # 진입점
├── public/           # 정적 파일
└── node_modules/     # 의존성 패키지
```

## 기술 스택

- React 19
- Redux & Redux Toolkit
- Material-UI
- Tailwind CSS
- 차트 라이브러리
  - Highcharts
  - Recharts
  - AMCharts 5
- Framer Motion (애니메이션)
- GSAP (고급 애니메이션)
- Axios (HTTP 클라이언트)
- React Router DOM
- SweetAlert2 (알림)

## 주요 기능

### 1. 농산물 정보

- 도시별 날씨 정보 조회
- 농산물 질병 예측 (이미지 업로드)
- 작물 가격 예측 차트
- 실시간 농산물 가격 정보
- 시장 정보 조회

### 2. 사용자 관리

- 회원가입
- 로그인/로그아웃 (JWT 인증)
- 사용자 프로필 관리
- 성장 캘린더 관리

### 3. 커뮤니티

- 게시글 작성/조회/수정/삭제
- 댓글 작성/조회
- 카테고리별 게시판
  - 텃밭 정보
  - 농산물 마켓
  - 자유게시판

### 4. 추가 기능

- 챗봇 서비스
- 유튜브 연동
- 애니메이션 효과

## 시작하기

### 사전 요구사항

- Node.js 14.0.0 이상
- npm 6.0.0 이상

### 설치 및 실행

1. 의존성 설치

```

```
