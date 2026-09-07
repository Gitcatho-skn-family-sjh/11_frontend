const serviceForm = document.querySelector("#service-form");
const serviceNameInput = document.querySelector("#service-name");
const serviceCategorySelect = document.querySelector("#service-category");
const serviceDescriptionInput = document.querySelector("#service-description");
const serviceList = document.querySelector("#service-list");
const serviceMessage = document.querySelector("#service-message");
let nextServiceId = 1;

function addServiceCard(event) {
  let serviceName = "";
  let category = "";
  let description = "";

  // ***** TODO 1. 기본 제출을 막고 폼 입력값 세 개 읽기 *****
  event.preventDefault();
  serviceName = serviceNameInput.value.trim();
  category = serviceCategorySelect.value;
  description = serviceDescriptionInput.value.trim();
  // **************************************************************

  if (serviceName === "" || description === "") {
    serviceMessage.textContent = "서비스 이름과 설명을 모두 입력한다.";
    (serviceName === "" ? serviceNameInput : serviceDescriptionInput).focus();
    return;
  }

  let card = null;
  let badge = null;
  let title = null;
  let descriptionText = null;
  let deleteButton = null;

  // ***** TODO 2. 카드에 필요한 다섯 요소 만들기 *****
  card = document.createElement("article");
  badge = document.createElement("span");
  title = document.createElement("h3");
  descriptionText = document.createElement("p");
  deleteButton = document.createElement("button");
  // **************************************************************

  if (!card || !badge || !title || !descriptionText || !deleteButton) return;

  // ***** TODO 3. 사용자 입력을 각 요소의 textContent에 넣기 *****
  badge.textContent = category;
  title.textContent = serviceName;
  descriptionText.textContent = description;
  deleteButton.textContent = "카드 삭제";
  // **************************************************************

  // ***** TODO 4. class와 data 속성으로 요소의 역할 기록하기 *****
  card.classList.add("service-card");
  badge.classList.add("service-badge");
  card.dataset.serviceId = String(nextServiceId);
  deleteButton.classList.add("service-delete-button");
  deleteButton.dataset.action = "delete";
  deleteButton.type = "button";
  // **************************************************************

  // ***** TODO 5. 자식 요소를 카드에 붙이고 카드를 목록에 붙이기 *****
  card.append(badge, title, descriptionText, deleteButton);
  serviceList.append(card);
  // **************************************************************

  // ***** TODO 6. 삭제 버튼을 누르면 현재 카드 제거하기 *****
  deleteButton.addEventListener("click", function () {
    card.remove();
    serviceMessage.textContent = serviceName + " 카드를 삭제했다.";
    serviceNameInput.focus();
  });
  // **************************************************************

  nextServiceId += 1;
  serviceForm.reset();
  serviceMessage.textContent = serviceName + " 카드를 추가했다.";
  serviceNameInput.focus();
}

// ***** TODO 7. form의 submit 이벤트에 addServiceCard 함수 등록하기 *****
serviceForm.addEventListener("submit", addServiceCard);
// **************************************************************
