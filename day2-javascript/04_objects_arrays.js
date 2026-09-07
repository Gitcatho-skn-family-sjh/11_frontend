const library = {
  name: "햇살 도서관",
  address: { city: "서울", floor: 2 }
};
const key = "name";
let city = "";
// ***** TODO 1. 주소 객체의 city 속성을 city에 대입하기 *****
city = library.address.city;
// **************************************************************
console.log("점으로 읽은 이름:", library.name);
console.log("대괄호로 읽은 이름:", library["name"]);
console.log("변수로 고른 이름:", library[key]);
console.log("중첩 객체의 도시:", city);
console.log("없는 속성:", library.phone);

const titles = ["작은 숲", "도시 산책"];
let firstTitle = "";
// ***** TODO 2. titles의 첫 번째 항목을 firstTitle에 대입하기 *****
firstTitle = titles[0];
// **************************************************************
console.log("첫 번째 제목:", firstTitle);
console.log("마지막 제목:", titles[titles.length - 1]);
console.log("배열 길이:", titles.length);
console.log("없는 세 번째 항목:", titles[2]);
console.log("배열의 typeof:", typeof titles);
console.log("배열인가:", Array.isArray(titles));

library.address.floor = 3;
library.open = true;
// ***** TODO 3. titles의 두 번째 항목을 바다 일기로 갱신하기 *****
titles[1] = "바다 일기";
// **************************************************************
console.log("변경한 층:", library.address.floor);
console.log("추가한 운영 상태:", library.open);
console.log("변경한 두 번째 제목:", titles[1]);
console.log("갱신 후 배열 길이:", titles.length);

const books = [
  { title: "작은 숲", author: "김하늘", available: true },
  { title: "도시 산책", author: "이바다", available: false }
];
let secondAvailable;
// ***** TODO 4. 두 번째 책의 available 값을 secondAvailable에 대입하기 *****
secondAvailable = books[1].available;
// **************************************************************
console.log("첫 번째 책 제목:", books[0].title);
console.log("두 번째 책 저자:", books[1].author);
console.log("꺼내 저장한 상태:", secondAvailable);
// ***** TODO 5. 두 번째 책의 available 속성을 true로 갱신하기 *****
books[1].available = true;
// **************************************************************
console.log("현재 객체의 상태:", books[1].available);
console.log("앞서 저장한 불리언:", secondAvailable);
