#!/usr/bin/env node
// opportunity-miner.js — SEO-разведка: что почти в топе и куда дожать.
//
// Реализует пункты #1, #2, #39, #41, #42, #91, #92 из SEO_YANDEX_100_AVTOPILOT.txt:
//   - search-queries → позиции / CTR / показы
//   - запросы на позициях 11-30 ("почти топ") → backlog на дожатие
//   - URL с показами >100 и CTR <2% → очередь рефреша Title/Description
//   - запросы с показами, но без целевой страницы → упущенный спрос
//   - сравнение скользящих окон (decay-детектор)
//
// Env: YANDEX_WEBMASTER_OAUTH_TOKEN, YANDEX_WEBMASTER_USER_ID, YANDEX_WEBMASTER_HOST_ID
//
// Записывает: data/opportunities.json, data/position-history.json (накопительный)

const fs = require('fs');
const path = require('path');

const TOKEN = process.env.YANDEX_WEBMASTER_OAUTH_TOKEN;
const USER_ID = process.env.YANDEX_WEBMASTER_USER_ID;
const HOST_ID = process.env.YANDEX_WEBMASTER_HOST_ID;
if (!TOKEN || !USER_ID || !HOST_ID) {
  console.error('ERR: missing YANDEX_WEBMASTER_* env vars');
  process.exit(1);
}

const BASE = `https://api.webmaster.yandex.net/v4/user/${USER_ID}/hosts/${encodeURIComponent(HOST_ID)}`;
const SITE_ROOT = process.cwd();

async function yapi(url) {
  const res = await fetch(url, {
    headers: { Authorization: `OAuth ${TOKEN}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Y.API ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function fetchHostStatus() {
  // Проверка host_data_status (NOT_LOADED / LOADED) — флаг готовности данных
  const data = await yapi(`${BASE}/`);
  return data.host_data_status || 'UNKNOWN';
}

async function fetchSearchQueries() {
  // search-queries за последние 7 дней, топ-1000 по показам
  // Документация: /v4/user/{user-id}/hosts/{host-id}/search-queries/popular/
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const dateFrom = date.toISOString().split('T')[0];
  const url = `${BASE}/search-queries/popular/?order_by=TOTAL_SHOWS&query_indicator=TOTAL_SHOWS&query_indicator=TOTAL_CLICKS&query_indicator=AVG_SHOW_POSITION&query_indicator=AVG_CLICK_POSITION&date_from=${dateFrom}`;

  const data = await yapi(url);
  return data.queries || [];
}

async function fetchIndexingSamples() {
  // indexing-samples → знаем какие URL индексированы
  const url = `${BASE}/indexing/samples/?limit=100`;
  try {
    const data = await yapi(url);
    return (data.samples || []).map((s) => s.url).filter(Boolean);
  } catch (e) {
    console.warn('indexing-samples not available:', e.message);
    return [];
  }
}

function loadPublished() {
  const p = path.join(SITE_ROOT, 'data/published.json');
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function loadHistory() {
  const p = path.join(SITE_ROOT, 'data/position-history.json');
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function saveHistory(history) {
  const p = path.join(SITE_ROOT, 'data/position-history.json');
  fs.writeFileSync(p, JSON.stringify(history, null, 2));
}

function loadBacklog() {
  const p = path.join(SITE_ROOT, 'data/seo-backlog.json');
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function saveOpportunities(opps) {
  const p = path.join(SITE_ROOT, 'data/opportunities.json');
  fs.writeFileSync(p, JSON.stringify(opps, null, 2));
}

// Сохранённый last-known host_data_status (для алерта при смене состояния)
function loadHostStatus() {
  const p = path.join(SITE_ROOT, 'data/host-status.json');
  if (!fs.existsSync(p)) return { status: 'UNKNOWN', changed_at: null };
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}
function saveHostStatus(s) {
  fs.writeFileSync(path.join(SITE_ROOT, 'data/host-status.json'), JSON.stringify(s, null, 2));
}

(async () => {
  console.log('=== Opportunity Miner ===');

  // === Проверка host_data_status (#1 из 5 новых задач) ===
  // Когда статус сменится с NOT_LOADED на LOADED — это значит Я.Вебмастер
  // начал собирать данные позиций. Это сигнал юзеру что SEO «ожило».
  try {
    const currentStatus = await fetchHostStatus();
    const lastKnown = loadHostStatus();
    console.log(`Host data status: ${currentStatus} (предыдущее: ${lastKnown.status})`);
    if (currentStatus !== lastKnown.status) {
      saveHostStatus({ status: currentStatus, changed_at: new Date().toISOString() });
      if (currentStatus === 'LOADED' && lastKnown.status !== 'LOADED') {
        // Создаём alert-файл — daily-routine.sh подхватит и пошлёт в TG
        fs.writeFileSync('/tmp/host-loaded-alert.txt',
          `🎉 Я.Вебмастер начал собирать данные сайта!\n\n` +
          `host_data_status: NOT_LOADED → LOADED\n\n` +
          `Это значит:\n` +
          `• С завтра — реальные позиции по запросам\n` +
          `• Появится opportunity-miner: «почти топ», CTR-проблемы, упущенный спрос\n` +
          `• Через 1-2 недели — первые показы в выдаче`);
      }
    }
  } catch (e) {
    console.warn('host_data_status не получен:', e.message.slice(0, 200));
  }

  console.log('Тянем search-queries за последние 7 дней...');
  let queries = [];
  try {
    queries = await fetchSearchQueries();
  } catch (e) {
    if (/HOST_NOT_LOADED|not loaded/i.test(e.message)) {
      console.log('Я.Вебмастер ещё не агрегировал данные для сайта (свежая регистрация).');
      console.log('Это нормально — будем пробовать каждый день. Пишем пустые opportunities.');
      saveOpportunities({
        generated_at: new Date().toISOString(),
        status: 'host_not_loaded_yet',
        almost_top: [], ctr_problems: [], missing_demand: [], decay: [],
        summary: { total_queries: 0, almost_top_count: 0, ctr_problems_count: 0, missing_demand_count: 0, decay_count: 0 },
      });
      process.exit(0);
    }
    throw e;
  }
  console.log(`Получено ${queries.length} запросов`);

  // Я.Webmaster возвращает агрегированные индикаторы. Извлекаем:
  // query.query — текст запроса
  // query.indicators — { TOTAL_SHOWS: N, TOTAL_CLICKS: N, AVG_SHOW_POSITION: N }
  const enriched = queries.map((q) => {
    const ind = q.indicators || {};
    const shows = ind.TOTAL_SHOWS || 0;
    const clicks = ind.TOTAL_CLICKS || 0;
    const pos = ind.AVG_SHOW_POSITION || 999;
    const ctr = shows > 0 ? (clicks / shows) * 100 : 0;
    return { query: q.query, shows, clicks, pos: Math.round(pos * 10) / 10, ctr: Math.round(ctr * 100) / 100 };
  });

  // === #92 ALMOST-TOP: позиции 11-30, есть показы ≥10 ===
  const almostTop = enriched
    .filter((q) => q.pos >= 11 && q.pos <= 30 && q.shows >= 10)
    .sort((a, b) => b.shows - a.shows)
    .slice(0, 50);
  console.log(`#92 Almost-top (поз. 11-30, ≥10 показов): ${almostTop.length}`);

  // === #41/#42 CTR-проблема: топ-10, показы ≥50, CTR <2% ===
  const ctrProblems = enriched
    .filter((q) => q.pos <= 10 && q.shows >= 50 && q.ctr < 2)
    .sort((a, b) => b.shows - a.shows)
    .slice(0, 30);
  console.log(`#41 CTR-проблемы (топ-10, ≥50 показов, CTR <2%): ${ctrProblems.length}`);

  // === #39 УПУЩЕННЫЙ СПРОС: показы ≥30, нет статьи под запрос ===
  const published = loadPublished();
  const publishedQueries = new Set(
    published.map((p) => (p.primary_query || '').trim().toLowerCase())
  );
  // Простая эвристика: статья "соответствует" запросу если содержит ≥2 ключевых слова из 3+
  function hasArticleFor(query) {
    const qWords = query.toLowerCase().split(/\s+/).filter((w) => w.length >= 4);
    if (qWords.length < 2) return false;
    for (const pq of publishedQueries) {
      const pqWords = pq.split(/\s+/);
      const overlap = qWords.filter((w) => pqWords.some((p) => p.includes(w) || w.includes(p))).length;
      if (overlap >= Math.min(2, qWords.length - 1)) return true;
    }
    return false;
  }
  const missingDemand = enriched
    .filter((q) => q.shows >= 30 && q.pos > 10 && !hasArticleFor(q.query))
    .sort((a, b) => b.shows - a.shows)
    .slice(0, 40);
  console.log(`#39 Упущенный спрос (≥30 показов, нет статьи): ${missingDemand.length}`);

  // === #91 DECAY: сравнение с историей (если есть) ===
  const history = loadHistory();
  const today = new Date().toISOString().split('T')[0];
  const previousSnapshot = history.length > 0 ? history[history.length - 1] : null;
  const decayed = [];
  if (previousSnapshot) {
    const prevMap = new Map(previousSnapshot.queries.map((q) => [q.query, q]));
    for (const q of enriched) {
      const prev = prevMap.get(q.query);
      if (prev && prev.pos <= 15 && q.pos - prev.pos >= 5) {
        decayed.push({
          query: q.query,
          posBefore: prev.pos,
          posNow: q.pos,
          drop: q.pos - prev.pos,
          shows: q.shows,
        });
      }
    }
    decayed.sort((a, b) => b.drop - a.drop);
  }
  console.log(`#91 Decay-детектор (просадки ≥5 позиций): ${decayed.length}`);

  // === Сохраняем результаты ===
  const opportunities = {
    generated_at: new Date().toISOString(),
    almost_top: almostTop,
    ctr_problems: ctrProblems,
    missing_demand: missingDemand,
    decay: decayed,
    summary: {
      total_queries: enriched.length,
      almost_top_count: almostTop.length,
      ctr_problems_count: ctrProblems.length,
      missing_demand_count: missingDemand.length,
      decay_count: decayed.length,
    },
  };
  saveOpportunities(opportunities);

  // История позиций (накопительная, держим последние 12 недель)
  history.push({
    date: today,
    queries: enriched.map((q) => ({ query: q.query, pos: q.pos, shows: q.shows, clicks: q.clicks })),
  });
  while (history.length > 12) history.shift();
  saveHistory(history);

  // === ТОП-N упущенного спроса → в backlog для следующих статей ===
  if (missingDemand.length > 0) {
    const backlog = loadBacklog();
    const backlogQueries = new Set(backlog.map((b) => (b.query || '').toLowerCase()));
    const newToBacklog = missingDemand
      .filter((m) => !backlogQueries.has(m.query.toLowerCase()))
      .slice(0, 20)
      .map((m) => ({
        query: m.query,
        intent: 'informational',
        freq_estimate: `${m.shows} показов за 7 дней (Я.Вебмастер real-data)`,
        competition: m.pos > 50 ? 'low' : 'medium',
        priority_score: 9,
        target_pain: `Yandex показывает наш сайт ${m.shows}× по этому запросу (поз. ${m.pos}), но конкретной страницы под него нет. Дожать дописыванием или новой статьёй.`,
        segment: 'Я.Вебмастер: упущенный спрос (auto)',
        source: 'opportunity-miner',
        detected_at: today,
      }));
    if (newToBacklog.length > 0) {
      backlog.push(...newToBacklog);
      fs.writeFileSync(path.join(SITE_ROOT, 'data/seo-backlog.json'), JSON.stringify(backlog, null, 2));
      console.log(`→ Добавлено в backlog: ${newToBacklog.length} новых тем`);
    } else {
      console.log('→ Backlog: всё уже учтено');
    }
  }

  console.log('\n✅ Opportunity miner завершён');
  console.log(`opportunities.json: ${almostTop.length} almost-top, ${ctrProblems.length} ctr-prob, ${missingDemand.length} missing, ${decayed.length} decay`);
})().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(2);
});
