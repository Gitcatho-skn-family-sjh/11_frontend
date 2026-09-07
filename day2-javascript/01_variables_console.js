// ***** TODO 1. const로 cafeName을 선언하고 카페 이름 출력하기 *****
const cafeName = "느린 오후 카페";
console.log("카페 이름:", cafeName);
// **************************************************************
const orderNumber = 17;
console.log("주문 번호:", orderNumber);

let quantity = 2;
console.log("변경 전 수량:", quantity);
// ***** TODO 2. quantity에 새 수량 3을 대입하기 *****
quantity = 3;
// **************************************************************
console.log("변경 후 수량:", quantity);
const savedQuantity = quantity;
quantity = 4;
console.log("현재 수량:", quantity);
console.log("앞서 저장한 수량:", savedQuantity);

// 이 문장은 실행되지 않는 한 줄 주석이다.
let message = "";
/* 안내 문장을 먼저 만들고,
   그 문장을 출력하여 현재 상태를 확인한다. */
// ***** TODO 3. message에 주문 확인 완료 안내 문자열 대입하기 *****
message = "주문 확인 완료";
// **************************************************************
console.log("처리 상태:", message);
console.log("마지막 줄까지 실행했습니다.");
