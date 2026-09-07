/* 제공용 탐색 기능: 수업에서 작성할 실습 코드와 분리한다. */
(() => {
  const main = document.querySelector("#lesson-content");
  if (!main || document.querySelector(".day1-sidebar")) return;

  const pages = [
    ["01", "문서 골격", "01-html-document.html"],
    ["02", "텍스트와 목록", "02-text-list-tree.html"],
    ["03", "시맨틱 구조", "03-semantic-layout.html"],
    ["04", "입력 양식", "04-form-input.html"],
    ["05", "CSS 선택자", "05-css-link-selectors.html"],
    ["06", "Cascade와 상속", "06-css-cascade.html"],
    ["07", "박스 모델", "07-cascade-box-type.html"],
    ["08", "Flex와 두 축", "08-flex-layout.html"],
    ["09", "반응형 배치", "09-responsive-profile.html"],
  ];
  const currentFile = window.location.pathname.split("/").pop();
  const aside = document.createElement("aside");
  aside.className = "day1-sidebar";
  aside.setAttribute("aria-label", "Day 1 목차");
  const panel = document.createElement("details");
  panel.className = "day1-nav-panel";
  const summary = document.createElement("summary");
  summary.textContent = "DAY 1 · HTML & CSS";
  panel.append(summary);

  const caption = document.createElement("p");
  caption.className = "day1-nav-caption";
  caption.textContent = "주제별 파일 이동";
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Day 1 파일 이동");
  const list = document.createElement("ol");
  list.className = "day1-nav-list";
  for (const [number, title, file] of pages) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = file;
    const badge = document.createElement("span");
    badge.className = "day1-nav-number";
    badge.textContent = number;
    const label = document.createElement("span");
    label.textContent = title;
    link.append(badge, label);
    if (file === currentFile) link.setAttribute("aria-current", "page");
    item.append(link);
    list.append(item);
  }
  nav.append(caption, list);
  panel.append(nav);

  const sectionNav = document.createElement("nav");
  sectionNav.className = "day1-current-sections";
  sectionNav.setAttribute("aria-label", "현재 페이지 내용");
  const sectionTitle = document.createElement("p");
  sectionTitle.className = "day1-nav-caption";
  sectionTitle.textContent = "이 페이지에서";
  const sectionList = document.createElement("ul");
  sectionList.className = "day1-section-list";
  for (const [index, section] of [...main.querySelectorAll(":scope > .lesson-section")].entries()) {
    const heading = section.querySelector(".section-heading h2");
    if (!heading) continue;
    if (!section.id) section.id = `day1-section-${index + 1}`;
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${section.id}`;
    link.textContent = heading.textContent.replace(/\s+/g, " ").trim();
    item.append(link);
    sectionList.append(item);
  }
  sectionNav.append(sectionTitle, sectionList);
  panel.append(sectionNav);
  aside.append(panel);
  main.before(aside);
  main.setAttribute("tabindex", "-1");
  document.body.classList.add("day1-nav-ready");

  const wideScreen = window.matchMedia("(min-width: 1180px)");
  panel.open = wideScreen.matches;
  wideScreen.addEventListener("change", (event) => { panel.open = event.matches; });

  for (const table of main.querySelectorAll("table")) {
    const wrapper = document.createElement("div");
    wrapper.className = "day1-table-scroll";
    wrapper.tabIndex = 0;
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", "표 내용, 좁은 화면에서 가로 스크롤 가능");
    table.before(wrapper);
    wrapper.append(table);
  }

  // main을 포함하는 전체 HTML 예시는 중첩된 main이 아닌 독립 문서로 표시한다.
  // template의 정적 소스는 해당 HTML 안에 그대로 남겨 편집할 수 있게 한다.
  for (const template of main.querySelectorAll("template[data-day1-document]")) {
    const frame = document.createElement("iframe");
    frame.className = "day1-document-preview";
    frame.title = template.dataset.day1Document;
    frame.srcdoc = '<!doctype html><html lang="ko"><head><meta charset="UTF-8"><style>body{margin:0;padding:2px;font:16px/1.65 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",sans-serif;color:#142023;word-break:keep-all}header,main,footer{padding:12px;border:1px solid #b8b8af}article{padding:10px;margin:8px 0;background:#e4efff}h3{margin:8px 0}p{margin:0}</style></head><body></body></html>';
    frame.addEventListener("load", () => {
      const previewBody = frame.contentDocument.body;
      previewBody.append(template.content.cloneNode(true));
      const updateHeight = () => {
        frame.style.height = `${previewBody.scrollHeight + 8}px`;
      };
      updateHeight();
      new ResizeObserver(updateHeight).observe(previewBody);
    }, { once: true });
    template.after(frame);
  }
})();
