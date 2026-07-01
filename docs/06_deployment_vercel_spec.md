# 06_deployment_vercel_spec.md

## 배포 대상
Vercel에 배포한다.

## 배포 전 준비
1. GitHub 저장소 생성
2. 프로젝트 파일 업로드
3. Vercel 프로젝트 연결
4. 환경변수 등록

## Vercel 환경변수
```text
OPENAI_API_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## 배포 검증 절차
1. Vercel 배포 URL 접속
2. 문장 입력
3. 분석 버튼 클릭
4. 결과 표시 확인
5. Supabase 테이블 저장 확인
6. 빈 입력 오류 확인
7. 긴 문장 오류 확인

## 완료 기준
- 배포 URL에서 서비스가 열린다.
- 감성 분석 결과가 정상 표시된다.
- API Key가 브라우저 개발자 도구에 노출되지 않는다.
- Supabase에 분석 이력이 저장된다.

## 주의사항
- .env 파일은 GitHub에 올리지 않는다.
- .env.example 파일만 GitHub에 올린다.
- 배포 후 오류가 나면 Vercel Functions 로그를 확인한다.
