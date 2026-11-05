// Saytdagi ariza formasidan kelgan lidni Telegram botga yuboradi.
// Netlify: Site configuration -> Environment variables bo'limida 2 ta o'zgaruvchi bo'lishi kerak:
//   TELEGRAM_BOT_TOKEN  - @BotFather bergan token
//   TELEGRAM_CHAT_ID    - lidlar tushadigan guruh ID si
const esc = (s) => String(s || '').slice(0, 200).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const reply = (code, obj) => ({ statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { ok: false });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return reply(500, { ok: false, error: 'Bot sozlanmagan' });

  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch (e) { b = {}; }
  const digits = String(b.phone || '').replace(/\D/g, '');
  if (!b.name || digits.length < 9) return reply(400, { ok: false, error: 'Ism yoki telefon yetishmaydi' });

  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
  const text = [
    '<b>Yangi ariza — KAAYBA sayti</b>',
    '',
    `👤 Ism: ${esc(b.name)}`,
    `📞 Telefon: ${esc(b.phone)}`,
    `🎯 Maqsad: ${esc(b.goal) || '—'}`,
    `📚 Kurs: ${esc(b.format) || '—'}`,
    `🕒 Vaqt: ${time}`,
  ].join('\n');

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    return r.ok ? reply(200, { ok: true }) : reply(502, { ok: false });
  } catch (e) {
    return reply(502, { ok: false });
  }
};
