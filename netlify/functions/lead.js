// Saytdagi ariza formasidan kelgan lidni Telegram botga va Google Sheets'ga yuboradi.
const esc = (s) => String(s || '').slice(0, 200).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const reply = (code, obj) => ({ statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return reply(405, { ok: false });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
  if ((!token || !chatId) && !sheetsUrl) return reply(500, { ok: false, error: 'Sozlanmagan' });

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

  const lead = { name: String(b.name).slice(0, 200), phone: String(b.phone).slice(0, 40), goal: String(b.goal || '').slice(0, 200), format: String(b.format || '').slice(0, 200) };
  const jobs = [];
  if (token && chatId) {
    jobs.push(fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    }).then((r) => r.ok));
  }
  if (sheetsUrl) {
    jobs.push(fetch(sheetsUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(lead), redirect: 'manual' }).then((r) => r.status < 400));
  }
  const results = await Promise.all(jobs.map((j) => j.catch(() => false)));
  return results.some(Boolean) ? reply(200, { ok: true }) : reply(502, { ok: false });
};
 
