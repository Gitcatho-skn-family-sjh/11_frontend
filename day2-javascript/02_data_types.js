const amount = 4500;
const amountText = "4500";
const isTakeout = true;
let numberKind = "";
let stringKind = "";
// ***** TODO 1. amount와 amountText의 자료형 이름을 각각 대입하기 *****
numberKind = typeof amount;
stringKind = typeof amountText;
// **************************************************************
console.log("숫자 값과 종류:", amount, numberKind);
console.log("문자열 값과 종류:", amountText, stringKind);
console.log("불리언 값과 종류:", isTakeout, typeof isTakeout);
console.log("소수의 종류:", typeof 2.5);
console.log("소수 계산:", 0.1 + 0.2);

let pendingCount;
let selectedItem;
// ***** TODO 2. 선택된 항목이 없음을 selectedItem에 null로 표현하기 *****
selectedItem = null;
// **************************************************************
console.log("아직 받지 않은 값:", pendingCount, typeof pendingCount);
console.log("선택된 항목 없음:", selectedItem);
console.log("null의 typeof 예외:", typeof selectedItem);
console.log("정확히 null인가:", selectedItem === null);
let dynamicValue = "3";
console.log("변경 전 자료형:", typeof dynamicValue);
dynamicValue = 3;
console.log("변경 후 자료형:", typeof dynamicValue);

const rawCount = " 3 ";
const countText = rawCount.trim();
let countNumber;
// ***** TODO 3. 정리된 countText를 숫자로 변환해 countNumber에 대입하기 *****
countNumber = Number(countText);
// **************************************************************
console.log("원래 문자열:", `[${rawCount}]`);
console.log("정리한 문자열:", `[${countText}]`);
console.log("문자열 연결:", countText + 1);
console.log("숫자 덧셈:", countNumber + 1);
console.log("숫자를 문자열로:", String(countNumber), typeof String(countNumber));
console.log("빈 문자열·공백의 숫자 변환:", Number(""), Number("   "));
console.log("빈 문자열의 불리언:", Boolean(""));
console.log("문자열 false의 불리언:", Boolean("false"));

const badInput = "세 잔";
const convertedBad = Number(badInput);
let conversionFailed;
// ***** TODO 4. 변환한 값 자체가 NaN인지 검사해 conversionFailed에 대입하기 *****
conversionFailed = Number.isNaN(convertedBad);
// **************************************************************
console.log("변환 결과와 자료형:", convertedBad, typeof convertedBad);
console.log("숫자 변환 실패:", conversionFailed);
console.log("NaN의 동등 비교:", NaN === NaN);
console.log("문자열 자체가 NaN인가:", Number.isNaN(badInput));
console.log("문자열을 숫자로 바꾸면 NaN인가:", isNaN(badInput));
console.log("유한한 숫자인가:", Number.isFinite(convertedBad));

let originalCount = 2;
let copiedCount = originalCount;
copiedCount = 3;
console.log("원시값 원본과 변경값:", originalCount, copiedCount);

const profile = { name: "민지" };
const sharedProfile = profile;
// ***** TODO 5. sharedProfile의 name 속성을 서연으로 변경하기 *****
sharedProfile.name = "서연";
// **************************************************************
console.log("원본 이름으로 읽은 속성:", profile.name);
console.log("다른 이름으로 읽은 속성:", sharedProfile.name);
console.log("같은 객체인가:", profile === sharedProfile);
