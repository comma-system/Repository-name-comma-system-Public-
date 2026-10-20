# COMMA 365 · 앱 설치 안내 컴포넌트

첫 화면·로그인 후 메인·푸터 세 곳에 iPhone/안드로이드 앱 다운로드를 넣는 완성 코드입니다.
320px 휴대폰부터 1920px 모니터까지 가로 스크롤 없이 동작하는 것을 자동 검증했습니다.

## 파일

| 파일 | 용도 |
|---|---|
| `app-install.css` | 세 컴포넌트 공통 스타일 (다크 모드·큰 글씨·안전 영역 포함) |
| `app-install.js` | 순수 JS 버전: 기기 판별, 배지 표시, 띠 닫기 저장, QR |
| `snippets.html` | 순수 HTML 조각 3개 + 설정 예시 |
| `AppInstall.tsx` | Next.js(App Router)용 React 컴포넌트 4개 |
| `demo.html` | 세 컴포넌트가 실제 사이트 구조 안에서 어떻게 보이는지 시연 |

## 붙이는 위치

1. **첫 화면 `AppInstallHero`** — "가입·인증 → 무료 체험 → 메인 화면" 줄 **바로 아래**.
   무료 체험 버튼보다 눈에 덜 띄게 작게 들어갑니다. PC에서는 QR 코드가 함께 보입니다.
2. **로그인 후 메인 `AppInstallBanner`** — 지금 있는 "홈 화면에 추가" 안내 띠를 **이것으로 교체**.
   휴대폰에서만, 2번째 방문부터, 닫으면 30일간 안 보입니다. 앱(웹뷰)이나 홈 화면 앱으로 열면 안 보입니다.
3. **푸터 `AppInstallFooter`** — 사업자 정보 바로 위. 두 스토어 배지를 모두 보여줍니다.
4. **`/app` 페이지 `AppSmartLink`** — QR·공유용 주소. 휴대폰이면 기기에 맞는 스토어로 자동 이동.

## Next.js 적용 (권장)

```bash
npm i qrcode            # PC 첫 화면 QR 생성용 (서버·외부 요청 없음)
```

```tsx
// app/layout.tsx
import '@/components/app-install/app-install.css';

// app/page.tsx (첫 화면)
import { AppInstallHero, AppInstallFooter } from '@/components/app-install/AppInstall';
...
<HeroButtons />          {/* 무료 체험 시작 / 로그인 */}
<StepsLine />            {/* 가입·인증 → 무료 체험 → 메인 화면 */}
<AppInstallHero />
...
<AppInstallFooter />
<BusinessInfoFooter />

// app/(main)/layout.tsx (로그인 후)
import { AppInstallBanner } from '@/components/app-install/AppInstall';
<AppInstallBanner />     {/* 기존 "홈 화면에 추가" 띠 자리에 */}

// app/app/page.tsx
import { AppSmartLink } from '@/components/app-install/AppInstall';
export default function Page() { return <AppSmartLink />; }
```

`AppInstall.tsx` 맨 위 `STORE`에 스토어 주소를 넣습니다. **iPhone 앱이 아직 없으면 `ios`를 비워 두세요.**
그러면 iPhone에서는 "iPhone 앱 준비 중"으로 흐리게 표시되고 띠는 뜨지 않습니다.

## 순수 HTML 적용

`snippets.html`의 조각을 해당 위치에 붙이고, 페이지 끝에 설정 + `app-install.js`를 넣습니다.
QR이 필요한 첫 화면에만 `qrcodejs`를 같이 넣습니다.

## 앱(웹뷰) 안에서 숨기기

앱의 WebView User-Agent 끝에 `Comma365App`을 붙여 주세요.
(Capacitor: `appendUserAgent: 'Comma365App'`, Android WebView: `settings.userAgentString += " Comma365App"`)
그러면 세 컴포넌트가 모두 자동으로 숨겨집니다.

## 공식 배지로 바꾸기

지금 배지는 공식 배지와 같은 크기·검정 바탕으로 만든 자체 버튼입니다.
스토어 등록 후에는 공식 배지 이미지로 바꾸는 것을 권장합니다.

- Apple: https://developer.apple.com/app-store/marketing/guidelines/ (한국어 배지 "App Store에서 다운로드하기")
- Google: https://play.google.com/intl/ko/badges/

`.ai-badge` 안쪽을 `<img src="/badges/app-store-ko.svg" alt="App Store에서 다운로드" height="48">`로 바꾸면 됩니다.

## 검증한 해상도

320 · 360 · 390 · 414 · 768 · 1024 · 1280 · 1440 · 1920 px, 라이트/다크, 글씨 크기 "아주 크게"(125%).
모든 경우 가로 스크롤 0, 배지 최소 높이 48px(터치 기준) 유지.

## 주의

- 앱 안에서는 결제를 유도하지 마세요. 애플·구글 인앱결제 정책 대상이 됩니다. 결제 안내는 웹에서만.
- iPhone 푸시 알림은 네이티브 푸시(APNs)를 앱에 넣어야 동작합니다.
