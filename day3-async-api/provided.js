//  Live Server(5500)에서 수업용 Python API 서버(8001)를 호출한다.
const LESSON_API_ORIGIN = "http://127.0.0.1:8001";

function lessonApiUrl(path) {
  return new URL(path, LESSON_API_ORIGIN).toString();
}

//  지연과 실패를 재현한다. 실제 서버나 임의의 네트워크 속도가 아니다.
function requestMessage(shouldFail) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (shouldFail) {
        reject(new Error("의도적으로 만든 실패이다."));
        return;
      }
      resolve("책 목록 준비 완료");
    }, 800);
  });
}

//  모든 외부 문자열을 태그가 아니라 문자로 출력한다.
function appendLine(list, text) {
  const item = document.createElement("li");
  item.textContent = text;
  list.append(item);
}

//  Promise 객체와 완료된 값을 서로 다른 칸에 안전하게 표시한다.
function showValue(element, value) {
  element.textContent = String(value);
}

//  JSON 배열을 표의 행으로 바꾼다.
function renderDemoRows(tableBody, items) {
  tableBody.replaceChildren();
  items.forEach(function (item) {
    const row = document.createElement("tr");
    const idCell = document.createElement("td");
    const titleCell = document.createElement("td");
    const categoryCell = document.createElement("td");

    idCell.textContent = String(item.id);
    titleCell.textContent = item.title;
    categoryCell.textContent = item.category;
    row.append(idCell, titleCell, categoryCell);
    tableBody.append(row);
  });
}

// 제공 코드: 검색 결과를 제목·저자·식별 정보가 있는 카드로 바꾼다.
function renderBookCards(container, books) {
  container.replaceChildren();
  books.forEach(function (book) {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const author = document.createElement("p");
    const description = document.createElement("p");

    card.className = "concept-card";
    title.textContent = book.title;
    author.textContent = `저자 · ${book.author}`;
    description.textContent = `도서 ID · ${book.id}`;
    card.append(title, author, description);
    container.append(card);
  });
}

function showStatus(element, text, state) {
  element.textContent = text;
  element.dataset.state = state;
}

// file://에서는 HTTP 요청 예제를 실행하지 않는다.
function requireHttp(element) {
  if (location.protocol === "http:" || location.protocol === "https:") {
    return true;
  }
  showStatus(element, "VS Code Live Server로 페이지를 열고 server.py를 8001 포트로 실행한다. 실행 방법은 README를 확인한다.", "error");
  return false;
}

function describeError(error) {
  if (error instanceof SyntaxError) {
    return "JSON 해석 실패: 응답 본문이 올바른 JSON인지 확인한다.";
  }
  if (error instanceof TypeError) {
    return "연결 또는 요청 처리 실패: 서버 실행 여부와 개발자 도구 Network를 확인한다.";
  }
  return error.message;
}

function requireBookItems(data) {
  if (!data || !Array.isArray(data.items)) {
    throw new Error("응답 형식 오류: items 배열이 필요하다.");
  }
}

function requireDemoItems(data) {
  if (!Array.isArray(data)) {
    throw new Error("응답 형식 오류: 객체 배열이 필요하다.");
  }
}
