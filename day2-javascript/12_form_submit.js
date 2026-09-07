const joinForm = document.querySelector("#join-form");
const nameInput = document.querySelector("#applicant-name");
const formMessage = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-join");

function handleSubmit(event) {
  // 기본 제출은 먼저 막는다. 검증 여부와 관계없이 현재 화면에서 처리한다.
  event.preventDefault();
  let name = "";

  // ***** TODO 1. 현재 입력값의 앞뒤 공백을 제거해 name에 저장하기 *****
  name = nameInput.value.trim();
  // **************************************************************

  if (name === "") {
    // ***** TODO 2. aria-invalid를 true로 설정하고 빈 이름 오류 표시하기 *****
    nameInput.setAttribute("aria-invalid", "true");
    formMessage.textContent = "이름을 한 글자 이상 입력해 주세요.";
    // **************************************************************

    // 실패 시 여기서 끝내야 아래 성공 문장이 오류를 덮어쓰지 않는다.
    nameInput.focus();
    return;
  }

  // ***** TODO 3. 이전 오류 속성을 제거하고 신청 확인 문장 표시하기 *****
  nameInput.removeAttribute("aria-invalid");
  formMessage.textContent = name + "님의 신청을 확인했다.";
  // **************************************************************
}

// form에 등록하므로 제출 버튼과 Enter 입력을 같은 함수로 처리한다.
joinForm.addEventListener("submit", handleSubmit);

// ***** TODO 4. submitButton의 disabled를 false로 바꾸어 제출 버튼 활성화하기 *****
submitButton.disabled = false;
// **************************************************************
