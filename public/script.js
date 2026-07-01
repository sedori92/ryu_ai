document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const charCount = document.getElementById('charCount');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const errorBox = document.getElementById('errorBox');
  const resultCard = document.getElementById('resultCard');
  const sentimentBadge = document.getElementById('sentimentBadge');
  const confidenceScore = document.getElementById('confidenceScore');
  const reasonText = document.getElementById('reasonText');

  // 글자 수 업데이트
  inputText.addEventListener('input', () => {
    const length = inputText.value.length;
    charCount.textContent = length;
    
    if (length > 1000) {
      inputText.value = inputText.value.substring(0, 1000);
      charCount.textContent = 1000;
    }
  });

  // 에러 메시지 표시
  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
    resultCard.classList.add('hidden');
  }

  // 에러 메시지 숨기기
  function hideError() {
    errorBox.classList.add('hidden');
  }

  // 분석 버튼 클릭 이벤트
  analyzeBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();

    // 유효성 검사
    if (!text) {
      showError('분석할 문장을 입력해주세요.');
      return;
    }

    if (text.length > 1000) {
      showError('문장은 1,000자 이내로 입력해주세요.');
      return;
    }

    // 로딩 상태 처리
    hideError();
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '분석 중...';
    resultCard.classList.add('hidden');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.message || '분석 중 오류가 발생했습니다.');
      }

      // 결과 렌더링
      renderResult(data);

    } catch (error) {
      showError(error.message);
    } finally {
      // 로딩 상태 해제
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = '분석하기';
    }
  });

  // 결과 화면 렌더링
  function renderResult(data) {
    const { sentiment, label, confidence, reason } = data;

    // 배지 업데이트
    sentimentBadge.textContent = label;
    sentimentBadge.className = `badge ${sentiment}`; // badge positive, badge negative, badge neutral

    // 신뢰도 업데이트
    confidenceScore.textContent = `신뢰도: ${confidence}%`;

    // 이유 업데이트
    reasonText.textContent = reason;

    // 결과 카드 표시
    resultCard.classList.remove('hidden');
  }
});
