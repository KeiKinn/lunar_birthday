# 🏮 Lunar Birthday Calendar | 中国农历生日助手

> An English-first, bilingual web application tailored for global friends to track and celebrate Chinese friends' Lunar Birthdays (农历生日). Automatically projects 20 years of Gregorian (Solar) dates and integrates seamlessly with Google Calendar, Apple Calendar, and Outlook.

---

## ✨ Features (功能特性)

- 🌙 **Lunar & Solar Dual-Input (农历/阳历双向录入)**:
  - Input directly by Lunar Month (1–12), Lunar Day (1–30), with Leap Month (闰月) support.
  - Or convert from any known Gregorian (Solar) date with real-time conversion.
- 📅 **20-Year Solar Date Projection (未来 20 年阳历推算)**:
  - Since Chinese Lunar birthdays shift on the solar calendar every year, this app accurately computes the exact Gregorian date, weekday, and age for the next 20 years.
- 📆 **Google Calendar & iCal Integration (Google 日历与 .ics 深度集成)**:
  - **One-Click Add to Google Calendar**: Directly opens Google Calendar web with pre-filled event details for the upcoming birthday.
  - **20-Year .ics Export**: Download standard RFC 5545 `.ics` calendar files for single friends or batch export all friends (compatible with Google Calendar, Apple Calendar, Outlook).
- 🌐 **English-First & Bilingual (中英双语切换)**:
  - Default clean English UI with friendly cultural explanations (explaining Lunar Calendar, Leap Months, and Chinese Zodiac).
  - One-click toggle between English and Simplified Chinese (中文).
- 🐉 **Chinese Zodiac & Age (十二生肖与实岁计算)**:
  - Automatically calculates the Chinese Zodiac animal (鼠牛虎兔龙蛇马羊猴鸡狗猪) and age based on birth year.
- 🔒 **Zero Server & 100% Privacy-Friendly (纯本地存储与零服务器运维)**:
  - Stored securely in browser `localStorage`.
  - JSON backup export and import.
  - Preloaded with 3 friendly demo friends for immediate trial, with a one-click "Clear Samples" button.

---

## 🚀 Local Preview (本地预览)

Since this is a lightweight static web app with zero dependencies and no build step required:

### Method 1: Python HTTP Server (Recommended)
In the project directory, run:
```bash
python3 -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Method 2: Direct File Open
You can also directly double-click `index.html` in Finder to open it in Chrome, Safari, or Edge.

---

## ☁️ Deploying to Cloudflare Pages (部署到 Cloudflare Pages)

This project is built to deploy onto Cloudflare Pages in seconds. You can choose any of the three methods below:

### Option A: Cloudflare Pages Dashboard (Git Integration)
1. Push this repository to GitHub or GitLab.
2. Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. In the build settings:
   - **Framework preset**: `None`
   - **Build command**: *(Leave empty)*
   - **Build output directory**: `.` (or root directory)
5. Click **Save and Deploy**. Cloudflare will deploy your site globally on its edge CDN!

### Option B: Cloudflare Direct Upload (Drag & Drop, No Git Needed)
1. In Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages** > **Upload assets**.
2. Create a project name (e.g. `lunar-birthday-calendar`).
3. Drag and drop the `cn-birthday` folder into the upload box.
4. Click **Deploy site**. It goes live instantly!

### Option C: Cloudflare Wrangler CLI
If you have `wrangler` installed:
```bash
npx wrangler pages deploy . --project-name=lunar-birthday
```

---

## 📁 Project Structure (目录结构)

```
cn-birthday/
├── index.html            # Main HTML structure with Tailwind CSS & Lucide icons
├── lunar.js              # High-accuracy Chinese lunar calculation engine
├── styles.css            # Custom animations, card hover effects & theme styling
├── js/
│   ├── app.js            # Main application controller, UI event loop, modal handling
│   ├── lunar-calc.js     # Solar/Lunar conversions, leap month fallback, 20-year projection
│   ├── ics-export.js     # RFC 5545 iCalendar (.ics) generator and Google Calendar URL builder
│   ├── i18n.js           # Bilingual translations (EN / ZH) & cultural guides
│   └── storage.js        # LocalStorage persistence, demo friends data, JSON backup/restore
├── wrangler.toml         # Optional Cloudflare Pages configuration
└── README.md             # Project documentation and deployment guide
```

---

## 📜 License
MIT License.
