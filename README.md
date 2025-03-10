# 농산물 가격 정보 웹 서비스

농산물 가격 정보 및 예측, 커뮤니티 기능을 제공하는 웹 서비스의 프론트엔드 프로젝트입니다.

## 기술 스택

- React.js
- TypeScript
- Tailwind CSS
- Chart.js (데이터 시각화)
- Axios (HTTP 클라이언트)

## 시작하기

### 사전 요구사항

- Node.js 14.0.0 이상
- npm 6.0.0 이상

### 설치

1. 프로젝트 클론

```bash
git clone [repository-url]
cd front
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm start
```

서버는 기본적으로 http://localhost:3000 에서 실행됩니다.

## 사용 가능한 스크립트

### `npm start`

개발 모드로 앱을 실행합니다.\
브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속할 수 있습니다.

코드를 수정하면 페이지가 자동으로 새로고침됩니다.\
콘솔에서 린트 오류를 확인할 수 있습니다.

### `npm test`

테스트 러너를 실행합니다.\
자세한 내용은 [테스트 실행하기](https://facebook.github.io/create-react-app/docs/running-tests)를 참조하세요.

### `npm run build`

프로덕션용 앱을 `build` 폴더에 빌드합니다.\
React를 프로덕션 모드로 번들링하고 최적화하여 최상의 성능을 제공합니다.

빌드된 파일은 최소화되며 파일 이름에 해시가 포함됩니다.

## 주요 기능

### 1. 농산물 정보

- 도시별 날씨 정보 조회
- 참외 질병 예측 (이미지 업로드)
- 작물 가격 예측 차트
- 위성 이미지 뷰어
- 실시간 농산물 가격 정보
- 시장 정보 조회

### 2. 사용자 관리

- 회원가입
- 로그인/로그아웃
- 사용자 프로필 관리

### 3. 커뮤니티

- 게시글 작성/조회/수정/삭제
- 댓글 작성/조회
- 카테고리별 게시판
  - 텃밭 정보
  - 농산물 마켓
  - 자유게시판

## 프로젝트 구조

```
front/
├── src/               # 소스 코드
│   ├── components/    # 리액트 컴포넌트
│   ├── pages/        # 페이지 컴포넌트
│   ├── api/          # API 통신
│   ├── hooks/        # 커스텀 훅
│   ├── store/        # 상태 관리
│   ├── types/        # TypeScript 타입 정의
│   └── utils/        # 유틸리티 함수
├── public/           # 정적 파일
├── chartdata/        # 차트 데이터
└── tailwind.config.js # Tailwind CSS 설정
```

## 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 설정하세요:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_BACKEND_URL=http://localhost:8080
```

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 백엔드 연동

이 프로젝트는 FastAPI 백엔드 서버와 연동됩니다. 백엔드 서버 설정에 대한 자세한 내용은 `back/README.md`를 참조하세요.

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
