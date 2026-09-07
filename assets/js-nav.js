/* 제공용 목차: 실습 app.js와 분리하며 Day 1의 탐색 스타일을 재사용한다. */
(() => {
  const main = document.querySelector("#lesson-content");
  const track = document.body.dataset.lessonTrack;
  if (!main || !track || document.querySelector(".day1-sidebar")) return;

  const courseRoot = new URL("../", document.currentScript.src);
  const groups = {
    day2: {
      title: "DAY 2 · JAVASCRIPT",
      directory: "day2-javascript",
      pages: [
        ["01","실행과 변수","01_variables_console.html"],
        ["02","자료형과 형 변환","02_data_types.html"],
        ["03","연산자와 조건문","03_operators_conditions.html"],
        ["04","객체와 배열","04_objects_arrays.html"],
        ["05","반복문","05_loops.html"],
        ["06","함수","06_functions.html"],
        ["07","화살표 함수와 콜백","07_arrow_callbacks.html"],
        ["08","배열 메서드","08_array_methods.html"],
        ["09","DOM 선택과 글자 변경","09_dom_select.html"],
        ["10","입력값과 화면 상태","10_dom_value_state.html"],
        ["11","클릭과 입력 이벤트","11_events.html"],
        ["12","폼 제출과 검증","12_form_submit.html"],
      ],
    },
    day3: {
      title: "DAY 3 · DOM & AJAX",
      directory: "day3-async-api",
      pages: [
        ["00", "폼 제출과 입력 검증", "00_form_submit/index.html"],
        ["01", "DOM 카드 생성·삭제", "01_create_append/index.html"],
        ["02", "표·검색·이벤트 위임", "02_render_list/index.html"],
        ["03", "Promise와 async / await", "03_async_await/index.html"],
        ["04", "AJAX와 text / JSON", "04_fetch_json/index.html"],
        ["05", "폼과 POST 검색", "05_form_api/index.html"],
        ["06", "OpenWeather API", "06_weather_api/index.html"],
        ["07", "OpenAI API", "07_openai_api/index.html"],
      ],
    },
  };
  const group = groups[track];
  if (!group) return;
  const aside = document.createElement("aside");
  aside.className = "day1-sidebar";
  aside.setAttribute("aria-label", group.title + " 목차");
  const panel = document.createElement("details");
  panel.className = "day1-nav-panel";
  const summary = document.createElement("summary");
  summary.textContent = group.title;
  panel.append(summary);

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "주제별 파일 이동");
  const caption = document.createElement("p");
  caption.className = "day1-nav-caption";
  caption.textContent = "주제별 파일 이동";
  const list = document.createElement("ol");
  list.className = "day1-nav-list";
  for (const [number, title, file] of group.pages) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const target = new URL(group.directory + "/" + file, courseRoot);
    link.href = target.href;
    const badge = document.createElement("span");
    badge.className = "day1-nav-number";
    badge.textContent = number;
    const label = document.createElement("span");
    label.textContent = title;
    link.append(badge, label);
    if (target.pathname === window.location.pathname) link.setAttribute("aria-current", "page");
    item.append(link);
    list.append(item);
  }
  nav.append(caption, list);
  panel.append(nav);

  const sections = document.createElement("nav");
  sections.className = "day1-current-sections";
  sections.setAttribute("aria-label", "현재 페이지 내용");
  const sectionTitle = document.createElement("p");
  sectionTitle.className = "day1-nav-caption";
  sectionTitle.textContent = "이 페이지에서";
  const sectionList = document.createElement("ul");
  sectionList.className = "day1-section-list";
  for (const [index, section] of [...main.querySelectorAll(":scope > .lesson-section")].entries()) {
    const heading = section.querySelector("h2");
    if (!heading) continue;
    if (!section.id) section.id = "js-section-" + (index + 1);
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#" + section.id;
    link.textContent = heading.textContent.replace(/\s+/g, " ").trim();
    item.append(link);
    sectionList.append(item);
  }
  sections.append(sectionTitle, sectionList);
  panel.append(sections);

  aside.append(panel);
  main.before(aside);
  main.setAttribute("tabindex", "-1");
  document.body.classList.add("day1-nav-ready");
  const wideScreen = window.matchMedia("(min-width: 1180px)");
  panel.open = wideScreen.matches;
  wideScreen.addEventListener("change", (event) => { panel.open = event.matches; });

  for (const table of main.querySelectorAll("table")) {
    if (table.parentElement.classList.contains("day1-table-scroll")) continue;
    const wrapper = document.createElement("div");
    wrapper.className = "day1-table-scroll";
    wrapper.tabIndex = 0;
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "표 내용, 좁은 화면에서 가로 스크롤 가능");
    table.before(wrapper);
    wrapper.append(table);
  }
})();
