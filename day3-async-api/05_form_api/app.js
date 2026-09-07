const form = document.querySelector("#book-search-form");
const queryInput = document.querySelector("#query");
const mode = document.querySelector("#request-mode");
const submitButton = document.querySelector("#search-button");
const results = document.querySelector("#search-results");
const statusMessage = document.querySelector("#search-status");
let inFlight = false;

function setBusy(busy) {
  inFlight = busy;
  submitButton.disabled = busy;
  queryInput.disabled = busy;
  mode.disabled = busy;
  form.setAttribute("aria-busy", String(busy));
}

function setSearchState(state, message) {
  showStatus(statusMessage, message, state);
  results.dataset.state = state;
}

function validateQuery() {
  // ***** TODO 1. 입력값의 앞뒤 공백을 제거해 반환하기 *****
  return queryInput.value.trim();
  // **************************************************************
}

function createRequestOptions(query) {
  // ***** TODO 2. POST 메서드, JSON 헤더, JSON 문자열 본문 만들기 *****
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, mode: mode.value }),
  };
  // **************************************************************
}

async function requestBooks(options) {
  let response;
  let data;

  // ***** TODO 3. lessonApiUrl로 책 검색 API 주소를 만들고 options로 요청하기 *****
  const endpoint = lessonApiUrl("/api/books/search");
  response = await fetch(endpoint, options);
  // **************************************************************
  if (response === undefined) return undefined;

  // ***** TODO 4. HTTP 성공을 검사한 뒤 응답 JSON 읽기 *****
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  data = await response.json();
  // **************************************************************

  if (data === undefined) return undefined;
  requireBookItems(data);
  return data.items;
}

function renderSearchResults(query, books) {
  results.replaceChildren();

  // ***** TODO 5. 0건과 검색 성공 상태를 나누어 카드 출력하기 *****
  if (books.length === 0) {
    setSearchState("empty", `“${query}” 검색 결과가 없다.`);
    return;
  }
  renderBookCards(results, books);
  setSearchState("success", `“${query}” 검색 결과 ${books.length}건을 표시했다.`);
  // **************************************************************
}

async function handleSubmit(event) {
  // ***** TODO 6. 기본 폼 제출을 막아 페이지 새로고침 방지하기 *****
  event.preventDefault();
  // **************************************************************

  const query = validateQuery();
  if (query === undefined) return;

  if (query === "") {
    results.replaceChildren();
    queryInput.setAttribute("aria-invalid", "true");
    setSearchState("error", "검색어를 입력한다. 요청은 보내지 않았다.");
    queryInput.focus();
    return;
  }

  if (inFlight || !requireHttp(statusMessage)) return;
  queryInput.removeAttribute("aria-invalid");
  results.replaceChildren();
  setBusy(true);
  setSearchState("loading", "검색 응답을 기다리는 중이다.");

  try {
    const options = createRequestOptions(query);
    if (options === undefined) return;

    const books = await requestBooks(options);
    if (books === undefined) return;

    renderSearchResults(query, books);
  } catch (error) {
    results.replaceChildren();
    setSearchState("error", describeError(error));
  } finally {
    setBusy(false);
  }
}

form.addEventListener("submit", handleSubmit);
requireHttp(statusMessage);
