const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

// 환경 변수 검증
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 클라이언트 초기화 (필요한 경우에만)
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) 
  : null;

module.exports = async (req, res) => {
  // CORS 처리 (필요시)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: 'Method Not Allowed' });
  }

  try {
    const { text } = req.body;

    // 검증 로직
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: true, message: '분석할 문장을 입력해주세요.' });
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: true, message: '문장은 1,000자 이내로 입력해주세요.' });
    }

    if (!openai) {
      return res.status(500).json({ error: true, message: 'OpenAI API 키가 설정되지 않았습니다.' });
    }

    // OpenAI 요청
    const prompt = `다음 문장의 감성을 분석해주세요. 결과는 positive, negative, neutral 중 하나로 선택하고, 신뢰도는 0~100 사이의 숫자로 반환하며, 이유는 한국어로 한두 문장으로 설명해주세요. 반드시 JSON 형태로 반환해주세요.

문장: "${text}"

원하는 JSON 형식:
{
  "sentiment": "positive",
  "confidence": 88,
  "reason": "긍정적인 기대와 만족을 나타내는 표현이 있습니다."
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    // 응답 구성
    const labelMap = {
      positive: '긍정',
      negative: '부정',
      neutral: '중립'
    };

    const sentiment = aiResponse.sentiment;
    const label = labelMap[sentiment] || '알 수 없음';
    const confidence = aiResponse.confidence;
    const reason = aiResponse.reason;

    const resultData = {
      sentiment,
      label,
      confidence,
      reason
    };

    // Supabase에 저장
    if (supabase) {
      const { error: dbError } = await supabase
        .from('sentiment_logs')
        .insert([{
          input_text: text,
          sentiment: sentiment,
          label: label,
          confidence: confidence,
          reason: reason
        }]);

      if (dbError) {
        console.error('Supabase DB 저장 실패:', dbError);
        // 저장에 실패해도 사용자에게는 정상 결과를 반환함 (기획서 명시)
      }
    }

    return res.status(200).json(resultData);

  } catch (error) {
    console.error('서버 에러:', error);
    return res.status(500).json({ error: true, message: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
};
