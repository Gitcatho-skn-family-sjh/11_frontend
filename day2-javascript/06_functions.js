function calculateTotal(unitPrice, count) {
  // ***** TODO 1. 수량이 0 이하이면 0을 반환하고 종료하기 *****
  if (count <= 0) {
    return 0;
  }
  // **************************************************************
  const calculation = unitPrice * count;
  // ***** TODO 2. 계산한 금액을 호출한 자리로 반환하기 *****
  return calculation;
  // **************************************************************
}
const coffeeTotal = calculateTotal(3200, 2);
const breadTotal = calculateTotal(4500, 3);
console.log("커피 주문 금액:", coffeeTotal);
console.log("빵 주문 금액:", breadTotal);
console.log("두 주문 합계:", coffeeTotal + breadTotal);
console.log("수량 0:", calculateTotal(3200, 0));
console.log("음수 수량:", calculateTotal(3200, -1));

function printTotal(unitPrice, count) {
  console.log("함수 안 출력:", unitPrice * count);
}
const printedResult = printTotal(3200, 2);
const returnedResult = calculateTotal(3200, 2);
console.log("출력 함수의 반환값:", printedResult);
console.log("계산 함수의 반환값:", returnedResult);
console.log("반환값에 1000 더하기:", returnedResult + 1000);

const message = "함수 밖 문장";
function makeGreeting(name = "방문자") {
  const message = `안녕하세요, ${name}님.`;
  // ***** TODO 3. 함수 안에서 만든 인사 문장을 반환하기 *****
  return message;
  // **************************************************************
}
console.log("이름 전달:", makeGreeting("하늘"));
console.log("인수 생략:", makeGreeting());
console.log("undefined 전달:", makeGreeting(undefined));
console.log("빈 문자열 전달:", makeGreeting(""));
console.log("바깥 문장 유지:", message);

let applyDiscount;
// ***** TODO 4. 금액에서 1000을 뺀 값을 반환하는 함수 표현식 저장하기 *****
applyDiscount = function (amount) {
  return amount - 1000;
};
// **************************************************************
if (typeof applyDiscount === "function") {
  const savedFunction = applyDiscount;
  const discountedAmount = applyDiscount(5000);
  console.log("함수 자체의 자료형:", typeof savedFunction);
  console.log("호출 결과의 자료형:", typeof discountedAmount);
  console.log("할인한 금액:", discountedAmount);
  console.log("저장한 함수 호출:", savedFunction(8000));
} else {
  console.log("할인 함수 값:", applyDiscount);
}
