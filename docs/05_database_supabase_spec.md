# 05_database_supabase_spec.md

## DB 목적
감성 분석 이력을 저장하여 나중에 통계, 관리자 화면, 학습 자료로 활용할 수 있게 한다.

## 테이블명
```text
sentiment_logs
```

## 컬럼 구조
| 컬럼명 | 타입 | 설명 |
|---|---|---|
| id | uuid | 기본키 |
| input_text | text | 사용자가 입력한 문장 |
| sentiment | text | positive, negative, neutral |
| label | text | 긍정, 부정, 중립 |
| confidence | int | 신뢰도 0~100 |
| reason | text | 분석 이유 |
| created_at | timestamp | 생성 시각 |

## SQL 예시
```sql
create table sentiment_logs (
  id uuid primary key default gen_random_uuid(),
  input_text text not null,
  sentiment text not null,
  label text not null,
  confidence int not null,
  reason text,
  created_at timestamp with time zone default now()
);
```

## 저장 기준
- 분석 성공 시에만 저장한다.
- 저장 실패가 발생해도 사용자에게 분석 결과는 보여준다.
- 단, 콘솔 또는 서버 로그에는 저장 실패 사유를 남긴다.

## 보안 기준
- Supabase Service Role Key는 백엔드 환경변수에만 저장한다.
- 브라우저에 Service Role Key를 노출하지 않는다.
