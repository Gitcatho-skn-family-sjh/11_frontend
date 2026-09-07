const weatherForm = document.querySelector("#weather-form");
const citySelect = document.querySelector("#city");
const modeSelect = document.querySelector("#weather-mode");
const weatherButton = document.querySelector("#weather-button");
const weatherStatus = document.querySelector("#weather-status");
const weatherCard = document.querySelector("#weather-card");
const rawOutput = document.querySelector("#weather-raw");

function setWeatherBusy(busy) {
  citySelect.disabled = busy;
  modeSelect.disabled = busy;
  weatherButton.disabled = busy;
  weatherForm.setAttribute("aria-busy", String(busy));
}

function renderWeather(data) {
  // ***** TODO 1. 장소와 날씨 설명을 카드의 요소에 표시하기 *****
  document.querySelector("#weather-place").textContent = data.place;
  document.querySelector("#weather-description").textContent = data.description;
  // **************************************************************

  // ***** TODO 2. 숫자 값에 단위를 붙여 기온·습도·풍속 표시하기 *****
  document.querySelector("#weather-temperature").textContent = `${data.temperature} ℃`;
  document.querySelector("#weather-feels-like").textContent = `${data.feelsLike} ℃`;
  document.querySelector("#weather-humidity").textContent = `${data.humidity} %`;
  document.querySelector("#weather-wind").textContent = `${data.windSpeed} m/s`;
  // **************************************************************

  document.querySelector("#weather-source").textContent = data.source;
  document.querySelector("#weather-fetched-at").textContent = data.fetchedAt;
  weatherCard.hidden = false;
}

async function handleWeatherSubmit(event) {
  event.preventDefault();
  if (weatherButton.disabled || !requireHttp(weatherStatus)) return;

  weatherCard.hidden = true;
  rawOutput.textContent = "응답을 기다리는 중이다.";
  setWeatherBusy(true);
  showStatus(weatherStatus, "날씨 응답을 기다리는 중이다.", "loading");

  try {
    let url;
    // ***** TODO 3. 좌표를 나누고 lessonApiUrl로 GET 요청 URL 만들기 *****
    const [lat, lon] = citySelect.value.split(",");
    const params = new URLSearchParams({ lat, lon, mode: modeSelect.value });
    url = lessonApiUrl(`/api/weather?${params}`);
    // **************************************************************
    if (url === undefined) {
      showStatus(weatherStatus, "요청 URL 작성 대기 상태이다.", "idle");
      return;
    }

    let response;
    // ***** TODO 4. 날씨 API를 요청하고 HTTP 실패를 오류로 바꾸기 *****
    response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    // **************************************************************
    if (response === undefined) {
      showStatus(weatherStatus, "날씨 요청 작성 대기 상태이다.", "idle");
      return;
    }

    // ***** TODO 5. JSON을 해석해 카드와 원본 보기 갱신하기 *****
    const data = await response.json();
    renderWeather(data);
    rawOutput.textContent = JSON.stringify(data, null, 2);
    showStatus(weatherStatus, `${data.place} 날씨를 표시했다.`, "success");
    // **************************************************************
  } catch (error) {
    weatherCard.hidden = true;
    rawOutput.textContent = "응답을 표시할 수 없다.";
    showStatus(weatherStatus, describeError(error), "error");
  } finally {
    setWeatherBusy(false);
  }
}

weatherForm.addEventListener("submit", handleWeatherSubmit);
requireHttp(weatherStatus);
