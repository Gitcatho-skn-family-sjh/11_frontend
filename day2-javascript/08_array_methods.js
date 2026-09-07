const basket = ["우유", "빵"];
let newLength;
// ***** TODO 1. basket 끝에 사과를 추가하고 새 길이 저장하기 *****
newLength = basket.push("사과");
// **************************************************************
console.log("push 반환값:", newLength);
console.log("push 뒤 원본:", basket);
const removedItem = basket.pop();
console.log("pop 반환값:", removedItem);
console.log("pop 뒤 원본:", basket);
console.log("우유 포함:", basket.includes("우유"));
console.log("빈 배열의 pop:", [].pop());

const books = [
  { title: "작은 숲", available: true },
  { title: "도시 산책", available: false },
  { title: "바다 일기", available: true }
];
const forEachResult = books.forEach(function (book) {
  console.log("항목별 출력:", book.title);
});
console.log("forEach 반환값:", forEachResult);

let foundBook;
let availableBooks = [];
let titleLines = [];
// ***** TODO 2. 제목이 도시 산책인 첫 객체를 찾는 메서드를 골라 작성하기 *****
foundBook = books.find((book) => book.title === "도시 산책");
// **************************************************************
// ***** TODO 3. 대출 가능한 객체만 담는 메서드를 골라 작성하기 *****
availableBooks = books.filter((book) => book.available === true);
// **************************************************************
// ***** TODO 4. 각 객체를 제목 문자열로 바꾸는 메서드를 골라 작성하기 *****
titleLines = books.map((book) => `제목: ${book.title}`);
// **************************************************************
console.log("find 결과:", foundBook);
console.log("filter 결과:", availableBooks);
console.log("map 결과:", titleLines);
console.log("없는 제목의 find:", books.find((book) => book.title === "없는 제목"));
console.log("없는 제목의 filter:", books.filter((book) => book.title === "없는 제목"));
console.log("원본 첫 제목:", books[0].title);

const originalItems = [{ title: "연필", quantity: 1 }];
const pickedItems = originalItems.filter(() => true);
console.log("같은 배열인가:", originalItems === pickedItems);
console.log("첫 객체는 같은가:", originalItems[0] === pickedItems[0]);
pickedItems[0].quantity = 2;
console.log("원본 객체의 수량:", originalItems[0].quantity);
pickedItems.push({ title: "지우개", quantity: 1 });
console.log("각 배열의 길이:", originalItems.length, pickedItems.length);

const selectedTitles = ["작은 숲", "바다 일기"];
let selectedBooks = [];
// ***** TODO 5. 선택 제목에 포함되는 책 객체만 새 배열로 고르기 *****
selectedBooks = books.filter((book) => selectedTitles.includes(book.title));
// **************************************************************
selectedBooks.forEach(function (book) {
  console.log("선택한 책:", book.title);
});
function makeAvailabilityMessage(allItems, availableItems) {
  if (allItems.length === 0) {
    return "등록된 책이 없습니다.";
  }
  return `${allItems.length}권 중 ${availableItems.length}권을 대출할 수 있습니다.`;
}
console.log("대출 안내:", makeAvailabilityMessage(books, availableBooks));
console.log("빈 목록 안내:", makeAvailabilityMessage([], []));
