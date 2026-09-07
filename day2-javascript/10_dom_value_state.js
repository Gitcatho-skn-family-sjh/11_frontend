const nameInput = document.querySelector("#name-input");
const greeting = document.querySelector("#greeting");
let rawName = "";
let name = "";

// 이 파일은 페이지를 열 때 한 번 실행된다. 아직 이벤트를 등록하지 않는다.
// ***** TODO 1. 입력칸의 현재 value를 읽고 앞뒤 공백을 제거한 name 만들기 *****
rawName = nameInput.value;
name = rawName.trim();
// **************************************************************

if (name !== "") {
  // ***** TODO 2. name을 포함한 인사 문장을 greeting의 textContent에 넣기 *****
  greeting.textContent = name + "님, 반갑습니다.";
  // **************************************************************
}

const quantityInput = document.querySelector("#quantity-input");
const totalPrice = document.querySelector("#total-price");
const unitPrice = 3000;

// value의 "2"를 숫자 2로 바꾸어 가격 계산에 사용한다.
// ***** TODO 3. 현재 수량을 Number로 변환하고 총 가격 문장 표시하기 *****
const quantity = Number(quantityInput.value);
const total = unitPrice * quantity;
totalPrice.textContent = quantity + "장 × " + unitPrice + "원 = " + total + "원";
// **************************************************************

const notice = document.querySelector("#notice");
const confirmButton = document.querySelector("#confirm-notice");
const state = document.querySelector("#state");
let level = "";

// ***** TODO 4. dataset의 안내 수준을 읽고 important class와 aria-label 설정하기 *****
level = notice.dataset.level;
notice.classList.add("important");
notice.setAttribute("aria-label", "준비물 안내 " + level);
// **************************************************************

// disabled에는 문자열 "false"가 아니라 불리언 false를 대입한다.
// ***** TODO 5. confirmButton의 disabled를 false로 바꾸어 버튼 활성화하기 *****
confirmButton.disabled = false;
// **************************************************************

if (level !== "") {
  state.textContent = level + " 안내를 강조했다. 버튼의 disabled 값: " + confirmButton.disabled;
}
