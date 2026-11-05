# KAAYBA saytini Netlify'da ishga tushirish va lidlarni Telegram botga ulash

Muhim: Netlify'ning "papkani sudrab tashlash" (Netlify Drop) usuli botga ulanadigan funksiyani ishga tushirmaydi. Shuning uchun sayt **GitHub orqali** ulanadi. Bu bir marta qilinadi, keyin hammasi avtomatik.

Papkadagi fayllar: `index.html`, `img/`, `netlify.toml`, `netlify/functions/lead.js` (oxirgi ikkitasiga tegmang).

## 1-qadam. Telegram bot (5 daqiqa)
1. **@BotFather** → `/newbot` → nom va username (oxiri `bot`, masalan `kaayba_ariza_bot`).
2. Bergan **token**ni saqlang. Hech kimga bermang.

## 2-qadam. Guruh va chat ID (5 daqiqa)
1. Yangi guruh: Nazokat opa, Ozod va botni qo'shing.
2. Guruhga `salom` deb yozing.
3. Brauzerda oching: `https://api.telegram.org/botTOKEN/getUpdates` (TOKEN o'rniga tokeningiz).
4. `"chat":{"id":-100...` dagi raqamni minus bilan birga saqlang. Bo'sh `[]` chiqsa, guruhga yana yozib sahifani yangilang.

## 3-qadam. GitHub'ga yuklash (10 daqiqa)
1. github.com → ro'yxatdan o'ting → **+ → New repository** → nom `kaayba-sayt` → **Private** → **Create repository**.
2. **uploading an existing file** havolasini bosing.
3. Zip'ni oching va ichidagi **hamma narsani** (`index.html`, `netlify.toml`, `img` va `netlify` papkalari) sudrab tashlang → **Commit changes**.
   - Tekshiring: repo'da `netlify/functions/lead.js` fayli ko'rinishi kerak.

## 4-qadam. Netlify'ga ulash (5 daqiqa)
1. app.netlify.com → **Add new project → Import an existing project → GitHub**.
2. GitHub'ga ruxsat bering va `kaayba-sayt` ni tanlang.
3. Sozlamalarni o'zgartirmang (ular `netlify.toml` dan o'qiladi) → **Deploy**.

## 5-qadam. Bot ma'lumotlarini kiritish
1. Netlify → loyihangiz → **Project configuration → Environment variables → Add a variable**.
2. Ikkita o'zgaruvchi qo'shing:
   | Key | Value |
   |---|---|
   | `TELEGRAM_BOT_TOKEN` | 1-qadamdagi token |
   | `TELEGRAM_CHAT_ID` | 2-qadamdagi ID (minus bilan) |
3. **Deploys → Trigger deploy → Deploy project** bosing (o'zgaruvchilar faqat yangi deploy'dan keyin ishlaydi).

## 6-qadam. Tekshirish
1. Netlify bergan manzilni oching (masalan `kaayba-sayt.netlify.app`).
2. Formaga test ism va raqam yozib yuboring. Guruhga "Yangi ariza — KAAYBA sayti" tushishi kerak.
3. Tushmasa: Environment variables to'g'riligini tekshiring va yana **Trigger deploy** qiling. Logs → Functions → `lead` bo'limida xato ko'rinadi.

## 7-qadam. Domen (ixtiyoriy)
Netlify → **Domain management → Add a domain** → domenni yozing → Netlify ko'rsatgan DNS yozuvini domen sotib olingan joyda qo'shing.

## 8-qadam. Meta Pixel
GitHub'da `index.html` → qalam (Edit) → eng pastdagi qator:
`var CONFIG = { leadEndpoint: "/api/lead", pixelId: "" };`
`pixelId: ""` ichiga Pixel ID ni yozing → **Commit changes**. Netlify 1 daqiqada saytni yangilaydi.

Keyinchalik matn yoki rasmni GitHub'da o'zgartirsangiz, sayt avtomatik yangilanadi.
