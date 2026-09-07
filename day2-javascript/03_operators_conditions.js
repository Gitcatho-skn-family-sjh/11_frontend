const pieces = 17;
const boxSize = 5;
console.log("나눗셈:", pieces / boxSize);
console.log("나머지:", pieces % boxSize);
let count = 2;
count++;
console.log("하나 증가:", count);
// ***** TODO 1. 복합 대입 연산자로 count에 3 더하기 *****
count += 3;
// **************************************************************
console.log("세 개 추가:", count);
count--;
console.log("하나 감소:", count);
console.log("계산 순서:", 2 + 3 * 4, (2 + 3) * 4);

const amount = 30000;
const canDeliver = true;
const hasCoupon = false;
const isMember = true;
let canUseFreeShipping;
// ***** TODO 2. 금액 기준과 배송 가능 여부를 모두 만족하는 조건 대입하기 *****
canUseFreeShipping = amount >= 30000 && canDeliver;
// **************************************************************
console.log("무료 배송 적용:", canUseFreeShipping);
console.log("자료형까지 같은가:", "30000" === 30000);
console.log("서로 다른가:", "30000" !== 30000);
console.log("쿠폰 또는 멤버십:", hasCoupon || isMember);
console.log("배송 불가인가:", !canDeliver);

const items = [];
let hasItems;
// ***** TODO 3. items의 길이가 0보다 큰지 비교해 hasItems에 대입하기 *****
hasItems = items.length > 0;
// **************************************************************
console.log("0·빈 문자열·null:", Boolean(0), Boolean(""), Boolean(null));
console.log("문자열 0·false·공백:", Boolean("0"), Boolean("false"), Boolean(" "));
console.log("빈 배열·빈 객체:", Boolean(items), Boolean({}));
console.log("실제로 항목이 있는가:", hasItems);
console.log("빈 문자열 OR 기본값:", "" || "기본 이름");
console.log("이름 AND 표시값:", "민지" && "이름 있음");

const remainingSeats = 2;
let notice = "";
// ***** TODO 4. 0자리·2자리 이하·그 밖을 if / else if / else로 구분하기 *****
if (remainingSeats === 0) {
  notice = "마감";
} else if (remainingSeats <= 2) {
  notice = "마감 임박";
} else {
  notice = "예약 가능";
}
// **************************************************************
console.log("남은 좌석:", remainingSeats);
console.log("좌석 안내:", notice);

let labelWithIf = "";
if (canUseFreeShipping) {
  labelWithIf = "무료 배송";
} else {
  labelWithIf = "배송 조건 확인";
}
let labelWithConditional = "";
// ***** TODO 5. 삼항 연산자로 무료 배송 여부에 맞는 문자열 선택하기 *****
labelWithConditional = canUseFreeShipping ? "무료 배송" : "배송 조건 확인";
// **************************************************************
console.log("if로 선택한 값:", labelWithIf);
console.log("삼항으로 선택한 값:", labelWithConditional);
