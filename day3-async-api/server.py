#!/usr/bin/env python3
"""프런트엔드 요청/응답 실습 전용 로컬 mock 서버이다.

학생이 작성할 백엔드 코드가 아니다. 데이터 저장/인증/배포 기능은 없다.
Python 표준 라이브러리만 사용하며 127.0.0.1에만 바인딩한다.
"""
import argparse
from http.client import HTTPException
import json
import os
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlsplit
from urllib.request import Request, urlopen

UNIT_ROOT = Path(__file__).resolve().parent
SERVE_ROOT = UNIT_ROOT.parent
BOOKS = json.loads((UNIT_ROOT / "data" / "books.json").read_text(encoding="utf-8"))["items"]
MAX_BODY_BYTES = 4096
UPSTREAM_LIMIT_BYTES = 1024 * 1024
WEATHER_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather"
OPENAI_ENDPOINT = "https://api.openai.com/v1/responses"
ALLOWED_ORIGINS = {
    "http://127.0.0.1:5500",
    "http://localhost:5500",
}

DEMO_JSON = [
    {"id": 1, "title": "DOM으로 만드는 화면", "category": "JavaScript"},
    {"id": 2, "title": "Fetch로 받는 데이터", "category": "HTTP"},
]

MOCK_WEATHER = {
    "place": "서울",
    "description": "맑음",
    "temperature": 23.4,
    "feelsLike": 22.8,
    "humidity": 48,
    "windSpeed": 2.1,
    "source": "mock",
    "fetchedAt": "수업용 고정 시각",
}
MOCK_CITIES = (
    ("서울", 37.5665, 126.9780),
    ("부산", 35.1796, 129.0756),
    ("제주", 33.4996, 126.5312),
)


class LessonHandler(SimpleHTTPRequestHandler):
    allow_live_api = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SERVE_ROOT), **kwargs)

    def end_headers(self):
        origin = self.headers.get("Origin")
        path = urlsplit(self.path).path
        if path.startswith("/api/") and origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        super().end_headers()

    def do_OPTIONS(self):
        origin = self.headers.get("Origin")
        path = urlsplit(self.path).path
        if not path.startswith("/api/") or origin not in ALLOWED_ORIGINS:
            self.send_response(403)
            self.end_headers()
            return
        self.send_response(204)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "600")
        self.end_headers()

    def send_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_text(self, status, text):
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def read_json_object(self):
        if self.headers.get_content_type() != "application/json":
            self.send_json(415, {"message": "Content-Type은 application/json이어야 한다."})
            return None
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= MAX_BODY_BYTES:
                self.send_json(413, {"message": "요청 본문의 허용 크기는 1~4096바이트이다."})
                return None
            data = json.loads(self.rfile.read(length))
        except (ValueError, UnicodeDecodeError):
            self.send_json(400, {"message": "올바른 JSON 본문이 필요하다."})
            return None
        if not isinstance(data, dict):
            self.send_json(400, {"message": "JSON 객체가 필요하다."})
            return None
        return data

    def read_upstream_json(self, request):
        with urlopen(request, timeout=8) as response:
            body = response.read(UPSTREAM_LIMIT_BYTES + 1)
        if len(body) > UPSTREAM_LIMIT_BYTES:
            raise ValueError("upstream response too large")
        return json.loads(body.decode("utf-8"))

    def send_external_failure(self, error=None):
        if isinstance(error, HTTPError):
            if error.code in (401, 403):
                message = "외부 API 인증 또는 사용 권한을 확인한다. 키 값은 서버에서만 점검한다."
            elif error.code == 429:
                message = "외부 API 요청 한도를 초과했다. 잠시 뒤 다시 시도한다."
            elif 500 <= error.code <= 599:
                message = "외부 API 서버가 요청을 처리하지 못했다. 잠시 뒤 다시 시도한다."
            else:
                message = "외부 API가 요청을 받지 않았다. 요청 조건을 확인한다."
        else:
            message = "외부 API 응답을 처리하지 못했다. 연결 상태를 확인하고 다시 시도한다."
        # 외부 응답 본문과 예외 문자열에는 키나 내부 정보가 섞일 수 있으므로 전달하지 않는다.
        self.send_json(502, {"message": message})

    def allowed_static_target(self, path):
        target = Path(self.translate_path(path)).resolve()
        if not target.is_relative_to(SERVE_ROOT) or target.is_dir():
            return False
        parts = target.relative_to(SERVE_ROOT).parts
        if any(part.startswith(".") for part in parts):
            return False
        return target.suffix.lower() in {
            ".html", ".css", ".js", ".json", ".txt",
            ".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".ico",
        }

    def do_GET(self):
        parsed = urlsplit(self.path)
        path = parsed.path
        if path == "/api/demo/text":
            self.send_text(200, "서버가 text/plain으로 보낸 짧은 문장이다.")
            return
        if path == "/api/demo/json":
            self.send_json(200, DEMO_JSON)
            return
        if path == "/api/weather":
            self.handle_weather(parse_qs(parsed.query))
            return
        if path.startswith("/api/"):
            self.send_json(404, {"message": "제공하지 않는 API 경로이다."})
            return
        # 실습 폴더 밖이나 심볼릭 링크를 통한 상위 파일 노출을 막는다.
        if not self.allowed_static_target(path):
            self.send_json(404, {"message": "허용된 실습 파일 경로를 지정해야 한다."})
            return
        super().do_GET()

    def do_HEAD(self):
        path = urlsplit(self.path).path
        if not self.allowed_static_target(path):
            self.send_error(404)
            return
        super().do_HEAD()

    def do_POST(self):
        path = urlsplit(self.path).path
        if path in ("/api/openai/text", "/api/openai/json"):
            self.handle_openai(path)
            return
        if path != "/api/books/search":
            self.send_json(404, {"message": "제공하지 않는 API 경로이다."})
            return
        data = self.read_json_object()
        if data is None:
            return
        query = data.get("query")
        mode = data.get("mode", "success")
        if not isinstance(query, str) or not query.strip() or len(query) > 120:
            self.send_json(400, {"message": "1~120자의 검색어가 필요하다."})
            return
        if mode not in ("success", "slow", "error"):
            self.send_json(400, {"message": "지원하지 않는 데모 모드이다."})
            return
        # 느림/실패는 수업용 제어이다. 실제 서버 성능을 흉내 낸 수치가 아니다.
        if mode == "slow":
            time.sleep(1.2)
        if mode == "error":
            self.send_json(503, {"message": "의도적으로 만든 서버 오류이다."})
            return
        normalized = query.strip().casefold()
        items = [
            book for book in BOOKS
            if normalized in (book["title"] + " " + book["author"]).casefold()
        ]
        self.send_json(200, {"query": query.strip(), "items": items})

    def handle_weather(self, params):
        mode = params.get("mode", ["mock"])[0]
        if mode not in ("mock", "live"):
            self.send_json(400, {"message": "mode는 mock 또는 live여야 한다."})
            return
        try:
            lat = float(params.get("lat", [""])[0])
            lon = float(params.get("lon", [""])[0])
        except (TypeError, ValueError):
            self.send_json(400, {"message": "lat와 lon은 숫자여야 한다."})
            return
        if not -90 <= lat <= 90 or not -180 <= lon <= 180:
            self.send_json(400, {"message": "위도는 -90~90, 경도는 -180~180 범위여야 한다."})
            return
        if mode == "mock":
            result = dict(MOCK_WEATHER)
            result["place"] = min(
                MOCK_CITIES,
                key=lambda city: abs(city[1] - lat) + abs(city[2] - lon),
            )[0]
            self.send_json(200, result)
            return
        api_key = os.environ.get("OPENWEATHER_API_KEY")
        if not self.allow_live_api or not api_key:
            self.send_json(503, {"message": "실제 날씨 API 사용이 허용되지 않았거나 서버 키가 설정되지 않았다."})
            return
        query = urlencode({
            "lat": lat,
            "lon": lon,
            "appid": api_key,
            "units": "metric",
            "lang": "kr",
        })
        request = Request(f"{WEATHER_ENDPOINT}?{query}", headers={"Accept": "application/json"})
        try:
            payload = self.read_upstream_json(request)
            weather_items = payload.get("weather")
            main = payload.get("main")
            wind = payload.get("wind", {})
            if not isinstance(weather_items, list) or not weather_items or not isinstance(main, dict):
                raise ValueError("unexpected weather response")
            result = {
                "place": str(payload.get("name") or "선택 위치"),
                "description": str(weather_items[0].get("description") or "설명 없음"),
                "temperature": float(main["temp"]),
                "feelsLike": float(main["feels_like"]),
                "humidity": int(main["humidity"]),
                "windSpeed": float(wind.get("speed", 0)),
                "source": "OpenWeather",
                "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }
        except HTTPError as error:
            self.send_external_failure(error)
            return
        except (URLError, HTTPException, OSError, ValueError, KeyError, TypeError):
            self.send_external_failure()
            return
        self.send_json(200, result)

    def handle_openai(self, path):
        data = self.read_json_object()
        if data is None:
            return
        prompt = data.get("prompt")
        mode = data.get("mode", "mock")
        if not isinstance(prompt, str) or not 1 <= len(prompt.strip()) <= 500:
            self.send_json(400, {"message": "prompt는 공백이 아닌 1~500자 문자열이어야 한다."})
            return
        if mode not in ("mock", "live"):
            self.send_json(400, {"message": "mode는 mock 또는 live여야 한다."})
            return
        model = os.environ.get("OPENAI_MODEL", "mock-model")
        if mode == "mock":
            answer = "mock 응답이다. 질문을 서버가 받아 정해진 문장을 돌려주었다."
            source = "mock"
            model = "mock-model"
        else:
            api_key = os.environ.get("OPENAI_API_KEY")
            configured_model = os.environ.get("OPENAI_MODEL")
            if not self.allow_live_api or not api_key or not configured_model:
                self.send_json(503, {"message": "실제 OpenAI API 사용이 허용되지 않았거나 서버 환경변수가 설정되지 않았다."})
                return
            request_body = json.dumps(
                {
                    "model": configured_model,
                    "input": prompt.strip(),
                    "max_output_tokens": 300,
                },
                ensure_ascii=False,
            ).encode("utf-8")
            request = Request(
                OPENAI_ENDPOINT,
                data=request_body,
                method="POST",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            )
            try:
                payload = self.read_upstream_json(request)
                parts = []
                for item in payload.get("output", []):
                    if not isinstance(item, dict):
                        continue
                    for content in item.get("content", []):
                        if isinstance(content, dict) and content.get("type") == "output_text":
                            text = content.get("text")
                            if isinstance(text, str) and text:
                                parts.append(text)
                answer = "\n".join(parts).strip()
                if not answer:
                    raise ValueError("missing output text")
            except HTTPError as error:
                self.send_external_failure(error)
                return
            except (URLError, HTTPException, OSError, ValueError, TypeError):
                self.send_external_failure()
                return
            source = "OpenAI Responses API"
            model = configured_model
        if path == "/api/openai/text":
            self.send_text(200, f"{answer}\n\n[출처: {source}]")
        else:
            self.send_json(200, {"text": answer, "source": source, "model": model})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8001)
    parser.add_argument(
        "--allow-live-api",
        action="store_true",
        help="환경변수에 설정한 외부 API 키를 사용하는 live 예제를 허용한다.",
    )
    args = parser.parse_args()
    LessonHandler.allow_live_api = args.allow_live_api
    server = ThreadingHTTPServer(("127.0.0.1", args.port), LessonHandler)
    print("프런트엔드 실습용 mock 서버이다. 운영 배포에 사용하지 않는다.", flush=True)
    print(f"API 주소=http://127.0.0.1:{server.server_port}/api/", flush=True)
    print("HTML은 VS Code Live Server의 5500 포트로 연다.", flush=True)
    print(
        "live 허용=" + str(args.allow_live_api)
        + ", OpenWeather 키 설정=" + str(bool(os.environ.get("OPENWEATHER_API_KEY")))
        + ", OpenAI 키 설정=" + str(bool(os.environ.get("OPENAI_API_KEY")))
        + ", OpenAI 모델 설정=" + str(bool(os.environ.get("OPENAI_MODEL"))),
        flush=True,
    )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료한다.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
