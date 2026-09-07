const services = [
  { id: 101, name: "문서 요약", category: "업무", status: "운영 중", updatedAt: "09-04", description: "긴 문서를 핵심 문장으로 정리한다." },
  { id: 102, name: "이미지 분류", category: "분석", status: "점검 중", updatedAt: "09-03", description: "업로드한 이미지를 정해진 항목으로 분류한다." },
  { id: 103, name: "회의록 검색", category: "업무", status: "운영 중", updatedAt: "09-02", description: "회의록에서 질문과 관련된 내용을 찾는다." },
  { id: 104, name: "리뷰 감성 분석", category: "분석", status: "중지", updatedAt: "08-29", description: "리뷰 문장을 긍정과 부정으로 구분한다." },
  { id: 105, name: "FAQ 도우미", category: "고객 지원", status: "운영 중", updatedAt: "08-27", description: "자주 묻는 질문에 등록된 답변을 보여 준다." }
];

const searchInput = document.querySelector("#service-search");
const statusSelect = document.querySelector("#status-filter");
const tableBody = document.querySelector("#service-table-body");
const resultCount = document.querySelector("#result-count");
const detailTitle = document.querySelector("#detail-title");
const detailMeta = document.querySelector("#detail-meta");
const detailDescription = document.querySelector("#detail-description");

function renderTable(items) {
  // ***** TODO 1. 이전 행을 지우고 검색 결과 건수 표시하기 *****
  tableBody.replaceChildren();
  resultCount.textContent = "검색 결과 " + items.length + "건";
  // **************************************************************

  if (items.length === 0) {
    // ***** TODO 2. 검색 결과가 없다는 한 칸짜리 행 만들기 *****
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 5;
    emptyCell.textContent = "조건에 맞는 서비스가 없다.";
    emptyRow.append(emptyCell);
    tableBody.append(emptyRow);
    // **************************************************************
    return;
  }

  items.forEach(function (service) {
    let row = null;
    let nameCell = null;
    let categoryCell = null;
    let statusCell = null;
    let updatedCell = null;
    let actionCell = null;
    let detailButton = null;

    // ***** TODO 3. 서비스 한 건을 표시할 tr·td·button 요소 만들기 *****
    row = document.createElement("tr");
    nameCell = document.createElement("td");
    categoryCell = document.createElement("td");
    statusCell = document.createElement("td");
    updatedCell = document.createElement("td");
    actionCell = document.createElement("td");
    detailButton = document.createElement("button");
    // **************************************************************

    if (!row || !nameCell || !categoryCell || !statusCell || !updatedCell || !actionCell || !detailButton) return;

    // ***** TODO 4. 셀 내용과 버튼의 data-id를 설정한 뒤 행을 tbody에 붙이기 *****
    nameCell.textContent = service.name;
    categoryCell.textContent = service.category;
    statusCell.textContent = service.status;
    updatedCell.textContent = service.updatedAt;
    detailButton.textContent = "상세 보기";
    detailButton.type = "button";
    detailButton.dataset.id = String(service.id);
    actionCell.append(detailButton);
    row.append(nameCell, categoryCell, statusCell, updatedCell, actionCell);
    tableBody.append(row);
    // **************************************************************
  });
}

function applyFilters() {
  let filteredServices = services;

  // ***** TODO 5. 검색어와 상태 조건에 맞는 서비스만 filter로 고르기 *****
  const query = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusSelect.value;
  filteredServices = services.filter(function (service) {
    const matchesQuery = service.name.toLowerCase().includes(query)
      || service.category.toLowerCase().includes(query);
    const matchesStatus = selectedStatus === "전체"
      || service.status === selectedStatus;
    return matchesQuery && matchesStatus;
  });
  // **************************************************************

  renderTable(filteredServices);
}

function showServiceDetail(event) {
  let detailButton = null;

  // ***** TODO 6. 실제 클릭 지점에서 가장 가까운 data-id 버튼 찾기 *****
  detailButton = event.target.closest("button[data-id]");
  // **************************************************************

  if (!detailButton || !tableBody.contains(detailButton)) return;

  const serviceId = Number(detailButton.dataset.id);
  const selectedService = services.find(function (service) {
    return service.id === serviceId;
  });
  if (!selectedService) return;

  // ***** TODO 7. 찾은 객체의 내용을 상세 패널에 표시하기 *****
  detailTitle.textContent = selectedService.name;
  detailMeta.textContent = selectedService.category + " · "
    + selectedService.status + " · 최근 변경 " + selectedService.updatedAt;
  detailDescription.textContent = selectedService.description;
  // **************************************************************
}

// ***** TODO 8. input·change·tbody click 이벤트 등록하기 *****
searchInput.addEventListener("input", applyFilters);
statusSelect.addEventListener("change", applyFilters);
tableBody.addEventListener("click", showServiceDetail);
// **************************************************************

renderTable(services);
