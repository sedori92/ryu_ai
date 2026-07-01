# 01_project_overview.md

## 프로젝트 개요
이 프로젝트는 HTML, CSS, JavaScript 화면에서 사용자가 문장을 입력하면 Node.js 백엔드를 통해 OpenAI API에 감성 분석을 요청하고 결과를 보여주는 웹 서비스다.

## 전체 흐름
1. 사용자가 웹페이지에 텍스트를 입력한다.
2. 사용자가 분석 버튼을 클릭한다.
3. 프론트엔드 JavaScript가 Node.js API로 요청을 보낸다.
4. Node.js 백엔드가 OpenAI API에 감성 분석을 요청한다.
5. OpenAI가 감성 결과를 JSON으로 반환한다.
6. 백엔드는 결과를 Supabase에 저장한다.
7. 프론트엔드는 결과를 화면에 표시한다.

## 권장 폴더 구조
```text
sentiment-analysis-service/
├─ AGENTS.md
├─ package.json
├─ .env.example
├─ api/
│  └─ analyze.js
├─ public/
│  ├─ index.html
│  ├─ style.css
│  └─ script.js
└─ docs/
   ├─ PRD.md
   ├─ 01_project_overview.md
   ├─ 02_ui_ux_guide.md
   ├─ 03_feature_spec.md
   ├─ 04_api_backend_spec.md
   ├─ 05_database_supabase_spec.md
   └─ 06_deployment_vercel_spec.md
```

## 환경변수
```text
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## 중요한 보안 원칙
OpenAI API Key와 Supabase Service Role Key는 절대 public 폴더 안의 HTML, CSS, JS 파일에 작성하지 않는다.
