const textButton = document.querySelector("#fetch-text");
const jsonButton = document.querySelector("#fetch-json");
const missingButton = document.querySelector("#fetch-missing");
const statusMessage = document.querySelector("#fetch-status");
const textOutput = document.querySelector("#text-output");
const tableBody = document.querySelector("#json-output");
const steps = document.querySelectorAll("[data-fetch-step]");
const initialStepTexts = [
  "fetch 요청 전이다.",
  "Response 확인 전이다.",
  "본문 읽기 전이다.",
  "DOM 출력 전이다.",
];

function resetOutput() {
  textOutput.textContent = "아직 받은 텍스트가 없다.";
  tableBody.replaceChildren();
  steps.forEach(function (step, index) {
    step.removeAttribute("data-done");
    step.textContent = initialStepTexts[index];
  });
}

function completeStep(number, text) {
  const step = document.querySelector(`[data-fetch-step="${number}"]`);
  step.dataset.done = "true";
  step.textContent = text;
}

function setButtonsDisabled(disabled) {
  textButton.disabled = disabled;
  jsonButton.disabled = disabled;
  missingButton.disabled = disabled;
}

async function loadResource(endpoint, format) {
  if (!requireHttp(statusMessage)) return;
  resetOutput();
  setButtonsDisabled(true);
  showStatus(statusMessage, "요청을 보내는 중이다.", "loading");
  let response;
  let data;

  try {
    // ***** TODO 1. 선택한 주소에 GET 요청을 보내 Response 받기 *****
    response = await fetch(endpoint);
    // **************************************************************
    if (response === undefined) return;
    completeStep(1, `fetch로 ${endpoint}에 요청했다.`);
    completeStep(2, `Response를 받았다. 상태 코드는 ${response.status}이다.`);

    // ***** TODO 2. response.ok가 false이면 HTTP 오류 만들기 *****
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    // **************************************************************

    // ***** TODO 3. 형식에 따라 본문을 text 또는 json으로 한 번만 읽기 *****
    data = format === "text"
      ? await response.text()
      : await response.json();
    // **************************************************************
    if (data === undefined) return;
    completeStep(3, `response.${format}()으로 본문을 한 번 읽었다.`);

    // ***** TODO 4. 텍스트는 문단에, JSON items는 표에 출력하기 *****
    if (format === "text") {
      textOutput.textContent = data;
    } else {
      requireDemoItems(data);
      renderDemoRows(tableBody, data);
    }
    // **************************************************************
    completeStep(4, "받은 데이터로 현재 페이지의 DOM만 바꾸었다.");
    showStatus(
      statusMessage,
      `${format.toUpperCase()} 응답을 화면에 표시했다.`,
      "success",
    );
  } catch (error) {
    showStatus(statusMessage, describeError(error), "error");
  } finally {
    setButtonsDisabled(false);
  }
}

// ***** TODO 5. lessonApiUrl로 8001 주소를 만들고 세 버튼의 click 이벤트 연결하기 *****
textButton.addEventListener("click", function () {
  loadResource(lessonApiUrl("/api/demo/text"), "text");
});
jsonButton.addEventListener("click", function () {
  loadResource(lessonApiUrl("/api/demo/json"), "json");
});
missingButton.addEventListener("click", function () {
  loadResource(lessonApiUrl("/api/demo/missing"), "json");
});
// **************************************************************

requireHttp(statusMessage);
