// ============================================================
// 수업용 예제: OpenAI API 호출 구조 이해하기
// ============================================================
//
// ✅ 올바른 방식 (이 파일이 사용하는 방식):
//    브라우저(프론트엔드) → 백엔드 서버(/api/analyze) → OpenAI API
//    API Key는 백엔드의 .env 파일에서만 관리합니다.
//
// ❌ 절대 하면 안 되는 방식 (참고용):
//    const OPENAI_API_KEY = "sk-xxxx..."; // ← 이렇게 직접 쓰면 안 됩니다!
//    fetch("https://api.openai.com/...", {
//      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } // ← 키가 외부에 노출됨
//    });
//
// 이유: 브라우저 소스코드는 누구나 볼 수 있어서 API Key가 도용될 수 있습니다.
// ============================================================

const recommendBtn = document.querySelector("#recommendBtn");
const movieTitleInput = document.querySelector("#movieTitle");
const aiResult = document.querySelector("#aiResult");

// ✅ API Key는 이 파일에 쓰지 않습니다.
// API Key는 서버의 .env 파일에서 process.env.OPENAI_API_KEY 로 읽습니다.
// 이 파일은 백엔드 서버의 /api/analyze 엔드포인트를 호출합니다.

recommendBtn.addEventListener("click", async function () {
  const movieTitle = movieTitleInput.value.trim();

  // 빈 텍스트 입력 방지
  if (movieTitle === "") {
    alert("영화 제목을 입력하세요.");
    return;
  }

  aiResult.textContent = "AI가 추천 문구를 만드는 중입니다...";

  try {
    // ✅ 백엔드 API를 호출합니다. (API Key는 서버에서 처리)
    // 참고: OpenAI를 직접 호출하는 것이 아니라, 우리 서버(/api/analyze)를 호출합니다.
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: movieTitle, // 서버로 전달할 텍스트
      }),
    });

    // 서버 응답이 실패한 경우 처리
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "서버 오류가 발생했습니다.");
    }

    // 서버에서 받은 JSON 결과 파싱
    const data = await response.json();
    console.log("서버 응답 결과:", data);

    // 화면에 결과 출력
    aiResult.textContent = JSON.stringify(data, null, 2);

  } catch (error) {
    console.error("오류 발생:", error);
    aiResult.textContent = `오류: ${error.message}`;
  }
});
