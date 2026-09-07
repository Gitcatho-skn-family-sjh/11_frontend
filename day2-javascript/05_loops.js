let total = 0;
// ***** TODO 1. 1부터 3까지 반복하면서 현재 값과 누적 합계 출력하기 *****
for (let index = 1; index <= 3; index += 1) {
  total += index;
  console.log("현재 값:", index, "누적 합:", total);
}
// **************************************************************
console.log("최종 합계:", total);

let remaining = 3;
// ***** TODO 2. remaining이 양수인 동안 출력하고 1씩 줄이는 while 작성하기 *****
while (remaining > 0) {
  console.log("남은 횟수:", remaining);
  remaining -= 1;
}
// **************************************************************
console.log("반복 종료 후:", remaining);

const prices = [1200, 1800, 2000];
let priceTotal = 0;
// ***** TODO 3. for...of로 prices의 값을 하나씩 받아 합계에 더하기 *****
for (const price of prices) {
  priceTotal += price;
}
// **************************************************************
console.log("가격 합계:", priceTotal);

const numbers = [1, 2, 3, 4, 5];
for (const number of numbers) {
  if (number === 3) {
    // ***** TODO 4. 3을 만나면 현재 반복문 전체를 끝내기 *****
    break;
    // **************************************************************
  }
  console.log("break 예제:", number);
}

for (const number of numbers) {
  if (number === 3) {
    continue;
  }
  console.log("continue 예제:", number);
}
console.log("두 반복문 뒤 문장");
