// ============================================================
// Vercel Serverless Function - 감성 분석 API
// ============================================================
// - API Key는 Vercel 환경변수에서만 읽습니다 (process.env.OPENAI_API_KEY)
// - 외부 npm 패키지 없이 Node.js 18 내장 fetch를 사용합니다
// ============================================================

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (브라우저 사전 요청)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: 'Method Not Allowed' });
  }

  try {
    const { text } = req.body;

    // 입력값 검증
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: true, message: '분석할 문장을 입력해주세요.' });
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: true, message: '문장은 1,000자 이내로 입력해주세요.' });
    }

    // 환경변수 확인
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: true, message: 'OpenAI API 키가 설정되지 않았습니다. Vercel 환경변수를 확인해주세요.' });
    }

    // ✅ OpenAI API 호출 (Node.js 18 내장 fetch 사용 - 외부 패키지 불필요)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `다음 문장의 감성을 분석해주세요. 결과는 positive, negative, neutral 중 하나로 선택하고, 신뢰도는 0~100 사이의 숫자로 반환하며, 이유는 한국어로 한두 문장으로 설명해주세요. 반드시 JSON 형태로 반환해주세요.

문장: "${text}"

원하는 JSON 형식:
{
  "sentiment": "positive",
  "confidence": 88,
  "reason": "긍정적인 기대와 만족을 나타내는 표현이 있습니다."
}`
        }],
        response_format: { type: 'json_object' }
      })
    });

    // OpenAI 응답 오류 처리
    if (!openaiResponse.ok) {
      const errData = await openaiResponse.json();
      throw new Error(`OpenAI 오류: ${errData.error?.message || openaiResponse.status}`);
    }

    // 응답 파싱
    const openaiData = await openaiResponse.json();
    const aiResponse = JSON.parse(openaiData.choices[0].message.content);

    // 감성 레이블 한국어 변환
    const labelMap = {
      positive: '긍정',
      negative: '부정',
      neutral: '중립'
    };

    const sentiment = aiResponse.sentiment;
    const label = labelMap[sentiment] || '알 수 없음';
    const confidence = aiResponse.confidence;
    const reason = aiResponse.reason;

    const resultData = { sentiment, label, confidence, reason };

    // ✅ Supabase 저장 (REST API 직접 호출 - 외부 패키지 불필요)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/sentiment_logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            input_text: text,
            sentiment,
            label,
            confidence,
            reason
          })
        });

        if (!supabaseResponse.ok) {
          console.error('Supabase 저장 실패:', await supabaseResponse.text());
        }
      } catch (dbError) {
        // DB 저장 실패해도 분석 결과는 사용자에게 정상 반환
        console.error('Supabase 저장 에러:', dbError);
      }
    }

    return res.status(200).json(resultData);

  } catch (error) {
    console.error('서버 에러:', error);
    return res.status(500).json({
      error: true,
      message: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
};
