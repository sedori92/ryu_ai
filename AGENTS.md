# AGENTS.md

## 프로젝트명
HTML/CSS/JavaScript 기반 감성 분석 서비스

## 에이전트 작업 목적
이 문서는 Antigravity AI 코딩 에이전트가 프로젝트를 구현할 때 반드시 지켜야 할 작업 규칙이다. 에이전트는 임의로 기능을 확장하지 말고, docs 폴더의 문서를 기준으로 구현한다.

## 기본 작업 원칙
1. 먼저 문서를 읽고 구현 범위를 확인한다.
2. OpenAI API Key는 절대 프론트엔드 코드에 작성하지 않는다.
3. 프론트엔드는 Node.js 백엔드 API만 호출한다.
4. 감성 분석 결과는 반드시 JSON 형식으로 처리한다.
5. Supabase 저장 기능은 백엔드에서만 수행한다.
6. 사용자가 빈 텍스트를 입력하면 API를 호출하지 않고 안내 메시지를 보여준다.
7. UI는 첨부 이미지의 분위기를 참고하되 그대로 복제하지 않는다.
8. 비전공자도 이해할 수 있도록 파일명과 코드 주석을 명확히 작성한다.

## 작업 순서
1. docs/PRD.md 확인
2. docs/01_project_overview.md 확인
3. docs/02_ui_ux_guide.md 확인
4. docs/03_feature_spec.md 확인
5. docs/04_api_backend_spec.md 확인
6. docs/05_database_supabase_spec.md 확인
7. docs/06_deployment_vercel_spec.md 확인
8. 실제 파일 구현
9. 테스트 및 검증

## 완료 기준
- 사용자가 텍스트를 입력할 수 있다.
- 분석 버튼 클릭 시 백엔드 API가 호출된다.
- OpenAI API를 통해 긍정/부정/중립 결과가 반환된다.
- 신뢰도, 분석 이유가 화면에 표시된다.
- 오류 발생 시 오류 메시지가 표시된다.
- 분석 결과가 Supabase에 저장된다.
- Vercel 배포가 가능한 구조다.
