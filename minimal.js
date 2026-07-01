// 실행 방법: OPENAI_API_KEY=발급받은키 node minimal.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // 환경변수에서 키를 읽어옵니다.
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "안녕?" }],
  });

  console.log(completion.choices[0].message.content);
}

main();
