const memoInput = document.querySelector("#memo-input");
const count = document.querySelector("#count");
const preview = document.querySelector("#preview");
const copyButton = document.querySelector("#copy-button");

function updateCount() {
  const characterCount = memoInput.value.length;
  // ***** TODO 1. 입력 길이를 count의 textContent에 표시하기 *****
  count.textContent = characterCount + " / 30";
  // **************************************************************
}

// 화살표 함수도 값이므로 변수에 저장하고 이벤트에 전달할 수 있다.
const copyMemo = () => {
  // ***** TODO 2. 현재 입력값을 읽고 확인한 메모 문장으로 출력하기 *****
  const memo = memoInput.value;
  preview.textContent = "확인한 메모: " + memo;
  // **************************************************************
};

// 함수 이름만 전달하면 브라우저가 이벤트 발생 시 호출한다.
// ***** TODO 3. memoInput의 input 이벤트에 updateCount 함수 등록하기 *****
memoInput.addEventListener("input", updateCount);
// **************************************************************

// ***** TODO 4. copyButton의 click 이벤트에 copyMemo 함수 등록하기 *****
copyButton.addEventListener("click", copyMemo);
// **************************************************************

// 괄호가 있으므로 지금 바로 실행해 최초 화면의 길이도 맞춘다.
updateCount();
