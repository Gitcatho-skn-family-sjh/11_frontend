# Day 3 · DOM·이벤트에서 AJAX·외부 API까지

폼 제출과 입력 검증을 00에서 먼저 보강한다. 이어서 JavaScript 문법을 브라우저 화면에 연결해 폼 입력으로 카드를 만들고 객체 배열을 검색 가능한 표로 렌더링한다. Promise와 `async/await`를 눈으로 비교한 뒤에는 Fetch로 text·JSON·POST 응답을 받아 실제 화면을 갱신한다.

외부 API 예제는 기본적으로 결정적인 mock 응답을 사용한다. OpenWeather와 OpenAI의 live 호출은 선택 실습이며, 키와 인터넷이 없어도 8개 핵심 페이지를 모두 진행할 수 있다.

## 파일과 학습 순서

| 순서 | 주제 | 직접 연결할 핵심 | 화면에서 확인할 결과 | TODO |
| ---: | --- | --- | --- | ---: |
| 00 | [폼 제출과 입력 검증](00_form_submit/index.html) | submit, preventDefault, value, trim, 조건 분기, focus, aria-invalid | 이름 한 칸 검증을 익힌 뒤 회원가입 폼의 첫 오류를 찾아 안내한다. | 9 |
| 01 | [폼 입력으로 카드 생성·삭제](01_create_append/index.html) | submit, value, createElement, textContent, classList, dataset, append, click, remove | 입력한 서비스가 3열 카드로 추가되고 선택한 카드만 삭제된다. | 7 |
| 02 | [배열을 검색 가능한 표로 렌더링](02_render_list/index.html) | tbody, forEach, filter, find, input/change/click, closest | 객체 5개가 표가 되고 검색·상태 필터·상세 보기가 함께 동작한다. | 8 |
| 03 | [Promise와 async/await](03_async_await/index.html) | Promise 객체, async 반환값, await 결과, try/catch/finally | 일반 값·기다리는 객체·완료 값을 다른 칸에서 비교한다. | 5 |
| 04 | [AJAX와 text/JSON](04_fetch_json/index.html) | fetch, Response, ok/status, text(), json() | 페이지를 새로 열지 않고 문자열 또는 표만 바뀌며 404도 구분한다. | 5 |
| 05 | [폼과 POST 검색](05_form_api/index.html) | preventDefault, JSON.stringify, POST, 요청 상태, 결과 카드 | 검색어를 보내고 0건·성공·느림·오류 상태를 화면에 표시한다. | 6 |
| 06 | [OpenWeather 응답으로 날씨 카드](06_weather_api/index.html) | URLSearchParams, GET, JSON 속성, API 프록시 | 도시별 mock 또는 live 날씨 JSON이 카드와 원본 보기에 표시된다. | 5 |
| 07 | [OpenAI 응답을 text/JSON으로 활용](07_openai_api/index.html) | POST JSON, 응답 형식 분기, 서버의 API 키 관리 | 같은 AI 답변을 text와 JSON으로 각각 읽고 화면에 배치한다. | 6 |

총 51개 TODO이다. 각 HTML에서 완성 코드와 화면을 먼저 확인한 뒤, 같은 폴더의 `app.js`에서 TODO 시작·끝 주석 사이만 작성한다. 긴 데이터·반복 출력 helper·서버 구현·공통 스타일은 제공되어 있다.

## 먼저 이해할 AJAX

AJAX는 특정 라이브러리 이름이 아니라, 페이지 전체를 다시 불러오지 않고 JavaScript가 서버와 데이터를 주고받아 필요한 화면 일부만 바꾸는 방식이다. 이름에는 XML이 들어가지만 현재는 JSON을 흔히 사용한다.

```text
이벤트 → fetch 요청 → Response 확인 → 본문을 text/JSON으로 읽기 → DOM 갱신
```

- `fetch()`가 완료되면 곧바로 최종 데이터가 아니라 `Response` 객체를 받는다.
- 404·500도 응답 자체는 도착했으므로 `response.ok`를 직접 검사한다.
- 본문은 약속된 형식에 따라 `response.text()` 또는 `response.json()` 중 하나로 한 번만 읽는다.
- 네트워크가 끝나는 동안 브라우저 전체가 멈추지 않으므로 로딩 상태와 중복 제출 방지가 필요하다.

## 실행

HTML은 VS Code Live Server의 5500 포트로 열고, API는 Python 서버의 8001 포트로 실행한다. 배포받은 `03_shared` 폴더에서 터미널을 열고 제공 서버를 실행한다. Python 3.9 이상만 필요하며 npm·pip 설치는 필요하지 않다.

```bash
python3 day3-async-api/server.py --port 8001
```

서버의 기본 포트도 8001이므로 `python3 day3-async-api/server.py`만 실행해도 같은 결과가 나온다. 터미널에 `API 주소=http://127.0.0.1:8001/api/`가 출력된 상태로 유지한다.

VS Code에서 `day3-async-api/00_form_submit/index.html`을 우클릭하고 `Open with Live Server`를 선택한다. 주소가 `http://127.0.0.1:5500` 또는 `http://localhost:5500`으로 시작하는지 확인한 뒤 왼쪽 목차로 00~07을 이동한다. 수업이 끝나면 API 서버 터미널에서 `Ctrl+C`를 누른다.

5500과 8001은 포트가 달라 서로 다른 출처이다. 제공 서버는 두 Live Server 주소만 CORS로 허용하고 JSON POST의 `OPTIONS` 사전 요청도 처리한다. `provided.js`의 `lessonApiUrl()`이 `/api/...` 경로 앞에 8001 서버 주소를 붙이므로, 04~07에서는 예제와 같은 방식으로 요청 주소를 만든다.

## 개발자 도구에서 볼 것

- Elements: JavaScript가 만든 article, tr, td와 data 속성
- Console: 처리되지 않은 JavaScript 오류가 없는지
- Network: 요청 URL, GET/POST, 상태 코드, Request Payload, Response
- 화면: loading·success·empty·error 상태와 이전 결과 제거

## 제공 API 계약

| 메서드와 경로 | 요청 | 응답 | 확인할 점 |
| --- | --- | --- | --- |
| `GET /api/demo/text` | 없음 | `text/plain` | `response.text()`의 결과는 문자열이다. |
| `GET /api/demo/json` | 없음 | 객체 배열 JSON | `response.json()`의 결과를 표로 렌더링한다. |
| `GET /api/demo/missing` | 없음 | HTTP 404 JSON | Fetch는 HTTP 오류를 자동으로 throw하지 않는다. |
| `POST /api/books/search` | `{"query":"화면","mode":"success"}` | `{"query":"화면","items":[...]}` | POST 본문과 검색 결과 카드를 확인한다. |
| `GET /api/weather?lat=...&lon=...&mode=mock` | URL 검색 매개변수 | 정리된 날씨 JSON | 외부 응답을 화면에 필요한 구조로 사용한다. |
| `POST /api/openai/text` | `{"prompt":"...","mode":"mock"}` | `text/plain` | 문자열 응답을 확인한다. |
| `POST /api/openai/json` | `{"prompt":"...","mode":"mock"}` | `{"text":"...","source":"...","model":"..."}` | 답변과 metadata를 다른 요소에 표시한다. |

## 실습 확인 순서

1. 00의 첫 예제에서 공백만 제출하면 오류 문장·aria-invalid·입력 포커스가 함께 적용되는지 확인한다.
2. 00의 회원가입 폼은 이름 → 이메일 → 비밀번호 순서에서 첫 번째 오류만 안내하고 해당 입력칸에 초점을 두는지 확인한다.
3. 00의 회원가입 폼에 정상 값을 제출하면 이름·이메일만 확인 문장에 표시되고 비밀번호는 출력되지 않는지 확인한다.
4. 01에서 `<strong>요약기</strong>`를 이름으로 입력하면 태그가 아니라 문자 그대로 표시되는지 확인한다.
5. 02에서 검색어와 상태 필터를 반복해도 행이 누적되지 않고 결과 건수가 맞는지 확인한다.
6. 02에서 동적으로 생성된 상세 버튼을 눌러 설명이 표시되는지 확인한다.
7. 03에서 Promise 자체와 await가 돌려준 문자열이 다른 칸에 표시되는지 확인한다.
8. 03의 await 대기 중에도 독립 카운터 버튼이 동작하는지 확인한다.
9. 04에서 text와 JSON 응답이 각각 문단과 표로 표시되는지 확인한다.
10. 04에서 404가 error 상태가 된 뒤 다른 정상 요청을 다시 실행할 수 있는지 확인한다.
11. 05에서 공백 입력 시 Network에 새 POST가 생기지 않는지 확인한다.
12. 05에서 `화면`, 존재하지 않는 단어, 느림, 오류를 차례로 확인한다.
13. 06·07은 먼저 mock으로 완성한다. live 실행 조건이 없을 때는 키를 요구하는 안전한 안내가 나오는지 확인한다.
14. 성공 뒤 실패 요청을 보내도 이전 결과가 남지 않고, 키보드로 폼·필터·목차를 사용할 수 있는지 확인한다.

## live API는 강사 안내가 있을 때만

실제 OpenWeather·OpenAI 호출은 서버의 `--allow-live-api` 옵션과 환경변수 키가 모두 있어야 동작한다. 키는 HTML·JavaScript·Git에 기록하지 않는다. live AI 응답은 수업용으로 최대 출력 토큰을 300으로 제한한다. live 응답은 네트워크·계정·한도·서비스 상태에 따라 달라지고 비용이 발생할 수 있으므로 mock 결과가 기본 실습이다.

## 다음 백엔드 수업과 연결

이 단원의 공통 흐름은 `사용자 이벤트 → 요청 데이터 → 백엔드 → 응답 데이터 → DOM`이다. 이후 Django나 FastAPI가 `server.py`의 자리를 대신한다.

- 서버가 새 HTML 문서 전체를 반환하는 일반 폼 제출도 사용할 수 있다.
- 검색 결과처럼 화면 일부만 바꿀 때 Fetch 기반 AJAX를 사용할 수 있다.
- URL·메서드·요청 JSON·응답 JSON은 프런트엔드와 백엔드가 공유하는 약속이다.
- 외부 API 키는 브라우저가 아니라 백엔드 환경변수에 둔다.

## 참고 문서

- [MDN: AJAX](https://developer.mozilla.org/en-US/docs/Glossary/AJAX)
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [OpenWeather: Current weather data](https://openweathermap.org/api/current)
- [OpenAI: Developer quickstart](https://platform.openai.com/docs/quickstart)
- [OpenAI: API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
