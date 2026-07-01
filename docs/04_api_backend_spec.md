# 04_api_backend_spec.md

## 백엔드 목적
프론트엔드에서 직접 OpenAI API를 호출하지 않도록 중간 서버 역할을 한다.

## API 엔드포인트
```text
POST /api/analyze
```

## 요청 형식
```json
{
  "text": "분석할 문장"
}
```

## 정상 응답 형식
```json
{
  "sentiment": "positive",
  "label": "긍정",
  "confidence": 92,
  "reason": "문장에 만족과 기쁨을 나타내는 표현이 포함되어 있습니다."
}
```

## 오류 응답 형식
```json
{
  "error": true,
  "message": "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
}
```

## OpenAI 요청 지침
OpenAI에는 다음 역할을 명확히 전달한다.

- 사용자의 문장을 감성 분석한다.
- 결과는 positive, negative, neutral 중 하나만 선택한다.
- confidence는 0~100 숫자로 반환한다.
- reason은 한국어 한두 문장으로 작성한다.
- 반드시 JSON만 반환한다.

## OpenAI 응답 예시
```json
{
  "sentiment": "positive",
  "confidence": 88,
  "reason": "긍정적인 기대와 만족을 나타내는 표현이 있습니다."
}
```

## 백엔드 검증 기준
- text가 없으면 400 오류를 반환한다.
- text가 1,000자를 초과하면 400 오류를 반환한다.
- OpenAI 오류가 발생하면 500 오류를 반환한다.
- 정상 분석 결과는 Supabase에 저장한다.
