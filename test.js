const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// 1. .env 파일 수동 로드 (dotenv 패키지 없이 로드하는 로직)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    // 주석이나 빈 줄이 아닌 경우에만 파싱
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      // 따옴표 제거
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/(^"|"$)/g, '').replace(/\\n/g, '\n');
      } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
        value = value.replace(/(^'|'$)/g, '');
      }
      process.env[key] = value;
    }
  });
  console.log('✅ .env 파일을 성공적으로 불러왔습니다.');
} else {
  console.log('⚠️ .env 파일을 찾을 수 없습니다.');
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ 에러: OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
  process.exit(1);
}

// 2. OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// 3. 테스트 요청 함수
async function testOpenAI() {
  console.log('🔄 OpenAI API에 연결을 시도합니다...');
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "안녕하세요! API 연결 테스트 중입니다. 짧게 인사해주세요." }
      ],
    });

    const responseText = completion.choices[0].message.content;
    console.log('\n✨ [성공] API가 정상적으로 연결되었습니다!');
    console.log('🤖 AI의 응답:');
    console.log('-----------------------------------');
    console.log(responseText);
    console.log('-----------------------------------');

  } catch (error) {
    console.error('\n❌ [실패] OpenAI API 호출 중 오류가 발생했습니다:');
    console.error(error.message);
    if (error.status === 401) {
      console.error('👉 API 키가 올바른지 다시 확인해주세요.');
    } else if (error.status === 429) {
      console.error('👉 API 한도가 초과되었거나 잔액이 부족합니다.');
    }
  }
}

// 실행
testOpenAI();
