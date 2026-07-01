// 수업용 예제: OpenAI API를 fetch로 호출하는 구조를 이해합니다.
// 실제 서비스에서는 API Key를 브라우저 코드에 직접 넣으면 안 됩니다.
const recommendBtn = document.querySelector("#recommendBtn");
const movieTitleInput = document.querySelector("#movieTitle");
const aiResult = document.querySelector("#aiResult");

// ⚠️ API Key는 절대 여기에 직접 쓰지 마세요!
// 실제 서비스에서는 백엔드 서버의 환경변수(.env)에서 관리해야 합니다.
// 수업 실습용: 로컬 테스트 시에만 임시로 사용하고, GitHub에는 올리지 마세요.
const OPENAI_API_KEY = "여기에_직접_입력하지_마세요";
const OPENAI_URL = "https://api.openai.com/v1/responses";

recommendBtn.addEventListener("click", async function () {
  const movieTitle = movieTitleInput.value;


  if (movieTitle === "") {
    alert("영화 제목을 입력하세요.");
    return;
  }

  aiResult.textContent = "AI가 추천 문구를 만드는 중입니다.";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // 실습 1: Authorization 헤더에 API 키를 넣습니다.
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-5.5",

      // 실습 2: 사용자가 입력한 영화 제목을 프롬프트에 넣습니다.
      input: `${movieTitle} 영화를 소개하는 짧은 추천 문구를 한국어로 2문장 작성해줘.`
    })
  });

  const data = await response.json();
  console.log(data.output[0].content[0].text);


  // 실습 3: AI 응답 텍스트를 화면에 출력합니다.
  aiResult.textContent = data.output[0].content[0].text;
});
