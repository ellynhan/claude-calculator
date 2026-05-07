# Claude Calculator

> PRD 기반 멀티 에이전트 파이프라인으로 개발된 웹 계산기

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)

---

## 프로젝트 소개

사칙연산(+, -, ×, ÷)을 지원하는 웹 기반 계산기입니다.  
HTML5 / CSS3 / Vanilla JavaScript(ES6+)만으로 구현되었으며, 빌드 도구 없이 브라우저에서 바로 실행됩니다.

이 프로젝트는 **Claude Code의 멀티 에이전트 파이프라인**을 활용해 개발되었습니다.
PRD 문서 작성 → 정합성 검증 → 코드 구현 → 병렬 품질 검증의 전 과정을 자동화된 에이전트가 수행했습니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 사칙연산 | 더하기, 빼기, 곱하기, 나누기 |
| 소수점 입력 | 피연산자당 소수점 1회 허용 |
| 연속 계산 | 결과값을 다음 연산의 첫 번째 피연산자로 자동 사용 |
| 전체 초기화 | `C` 버튼으로 모든 입력 리셋 |
| 한 글자 삭제 | `⌫` 버튼으로 마지막 입력 문자 삭제 |
| 0 나누기 처리 | `Error` 메시지 표시 |
| 키보드 지원 | 숫자, 연산자, Enter, Backspace, Escape 모두 지원 |
| 반응형 레이아웃 | 320px 이상 모든 화면 크기 대응 |

---

## 실행 방법

### 브라우저에서 바로 실행

빌드 도구가 필요 없습니다. `index.html`을 브라우저로 열면 바로 실행됩니다.

```bash
# 저장소 클론
git clone https://github.com/ellynhan/claude-calculator.git
cd claude-calculator
```

이후 `index.html` 파일을 크롬, 파이어폭스, 엣지 등 브라우저로 드래그하거나 더블클릭하면 됩니다.

### Live Server 사용 (VS Code)

VS Code의 [Live Server 확장](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)을 사용하면 파일 변경 시 자동 새로고침이 됩니다.

1. VS Code에서 프로젝트 폴더 열기
2. `index.html` 파일에서 우클릭 → `Open with Live Server`

### Python 간이 서버

```bash
# Python 3
python -m http.server 3000
# 브라우저에서 http://localhost:3000 접속
```

---

## 키보드 단축키

| 키 | 동작 |
|----|------|
| `0` ~ `9` | 숫자 입력 |
| `.` | 소수점 입력 |
| `+` `-` `*` `/` | 사칙연산 선택 |
| `Enter` 또는 `=` | 계산 실행 |
| `Backspace` | 마지막 문자 삭제 |
| `Escape` | 전체 초기화 |

---

## 테스트 실행

Jest를 사용한 단위 테스트가 포함되어 있습니다.

```bash
# 의존성 설치 (최초 1회)
npm install

# 테스트 실행
npx jest calculator.test.js

# 커버리지 포함 실행
npx jest --coverage
```

### 테스트 구성 (총 62개)

| 그룹 | 설명 | 테스트 수 |
|------|------|-----------|
| `computeResult` | 순수 사칙연산 함수 | 16개 |
| `formatResult` | 숫자 → 문자열 포맷 | 7개 |
| `appendNumber` | 숫자/소수점 입력 상태 | 9개 |
| `setOperator` | 연산자 선택 및 체이닝 | 4개 |
| `calculate` | `=` 버튼 동작 | 11개 |
| `clearAll` | `C` 버튼 동작 | 2개 |
| `backspace` | `⌫` 버튼 동작 | 6개 |
| `chained calculation` | 연속 계산 (FR-05) | 3개 |
| `edge cases` | 경계값 및 엣지 케이스 | 4개 |

---

## 프로젝트 구조

```
claude-calculator/
├── index.html           # 마크업 + 진입점
├── style.css            # CSS Grid 기반 스타일, 반응형 포함
├── calculator.js        # 계산 로직 (순수 함수 + 상태 관리)
├── calculator.test.js   # Jest 단위 테스트 (62개)
├── PRD.md               # 제품 요구사항 문서
└── .claude/
    └── agents/          # Claude Code 멀티 에이전트 정의
        ├── consistency-verifier.md  # PRD 정합성 검증
        ├── ai-action.md             # 코드 구현
        ├── test-verifier.md         # 테스트 품질 검증
        └── compliance-verifier.md   # 요구사항 준수 검증
```

---

## 기술 스택

| 구분 | 선택 | 비고 |
|------|------|------|
| 마크업 | HTML5 | 시맨틱 태그, ARIA 접근성 속성 |
| 스타일 | CSS3 | CSS Grid, Flexbox, 미디어쿼리 |
| 로직 | Vanilla JS (ES6+) | 외부 라이브러리 없음 |
| 테스트 | Jest | 순수 함수 단위 테스트 |
| 빌드 | 없음 | 단일 파일, 즉시 실행 |

---

## 개발 워크플로우 (멀티 에이전트 파이프라인)

이 프로젝트는 Claude Code의 서브에이전트 시스템을 활용해 다음 순서로 개발되었습니다.

```
[Step 1] consistency-verifier
         PRD 내부 정합성 검증 (섹션 간 모순/누락 탐지)
              ↓ PASS
[Step 2] ai-action
         PRD 기반 코드 구현 + 테스트 자동 생성
              ↓
[Step 3] test-verifier ──────┐  병렬 실행
         compliance-verifier ┘
         코드 품질 및 요구사항 준수 검증
              ↓ 양쪽 모두 PASS → 완료
```

### 에이전트별 역할

| 에이전트 | 역할 | 실행 시점 |
|----------|------|-----------|
| `consistency-verifier` | PRD 문서의 내부 정합성 검증 (US↔FR, FR↔DoD, UI↔FR) | 구현 전 품질 게이트 |
| `ai-action` | 코드 구현 및 Jest 테스트 생성 | 검증 PASS 후 |
| `test-verifier` | 테스트 완전성, 엣지 케이스 커버리지, 코드 품질 점검 | 구현 후 병렬 |
| `compliance-verifier` | FR/비기능/DoD 항목 코드 1:1 대조 | 구현 후 병렬 |

에이전트 정의 파일은 `.claude/agents/` 디렉토리에서 확인할 수 있습니다.

---

## 브라우저 호환성

| 브라우저 | 지원 여부 |
|----------|-----------|
| Chrome (최신) | ✅ |
| Firefox (최신) | ✅ |
| Edge (최신) | ✅ |
| Safari (최신) | ✅ |
| 모바일 (320px+) | ✅ |

---

## 라이선스

MIT
