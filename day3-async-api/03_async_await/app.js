const runButton = document.querySelector("#run-async");
const mode = document.querySelector("#async-mode");
const directOutput = document.querySelector("#direct-output");
const promiseOutput = document.querySelector("#promise-output");
const awaitedOutput = document.querySelector("#awaited-output");
const returnOutput = document.querySelector("#return-output");
const logList = document.querySelector("#async-log");
const counterButton = document.querySelector("#count-click");
const counter = document.querySelector("#click-count");
let clickCount = 0;

async function compareValues(shouldFail) {
  runButton.disabled = true;
  logList.replaceChildren();
  showValue(awaitedOutput, "아직 결과를 기다리는 중이다.");

  // ***** TODO 1. 즉시 사용할 수 있는 일반 문자열을 화면에 출력하기 *****
  const directValue = "바로 받은 문자열";
  showValue(directOutput, directValue);
  // **************************************************************

  let promise;
  // ***** TODO 2. requestMessage가 즉시 반환한 Promise 객체 확인하기 *****
  promise = requestMessage(shouldFail);
  showValue(promiseOutput, promise);
  // **************************************************************
  if (!(promise instanceof Promise)) {
    showValue(awaitedOutput, "TODO 2를 먼저 완성한다.");
    runButton.disabled = false;
    return;
  }

  appendLine(logList, "1. Promise를 받았다. 아직 결과 문자열은 아니다.");

  try {
    // ***** TODO 3. Promise의 완료 결과를 await로 받아 화면에 출력하기 *****
    const message = await promise;
    showValue(awaitedOutput, message);
    // **************************************************************
    appendLine(logList, "3. await 다음 줄이 실행되었다.");
  } catch (error) {
    // ***** TODO 4. 실패하면 error.message를 결과 칸에 출력하기 *****
    showValue(awaitedOutput, error.message);
    // **************************************************************
    appendLine(logList, "3. catch가 실패 결과를 처리했다.");
  } finally {
    runButton.disabled = false;
    appendLine(logList, "4. finally가 버튼을 다시 사용할 수 있게 했다.");
  }
}

// ***** TODO 5. 실행 버튼에서 async 함수를 호출하고 반환값도 Promise인지 확인하기 *****
runButton.addEventListener("click", function () {
  const returnedPromise = compareValues(mode.value === "error");
  showValue(returnOutput, returnedPromise instanceof Promise);
});
// **************************************************************

// 제공 연결 코드: await 중에도 다른 클릭 이벤트는 처리된다.
counterButton.addEventListener("click", function () {
  clickCount += 1;
  counter.textContent = String(clickCount);
});
