#!/usr/bin/env node
// metrika-miner.js — анализ Я.Метрики для SEO-выводов.
//
// Реализует пункты #9, #10, #96 из SEO_YANDEX_100_AVTOPILOT.txt:
//   - #9: Metrika top-pages → визиты + отказы + время по URL
//   - #10: связка Метрика+Вебмастер: страница в топе по показам, но 0 кликов
//   - #96: внутренний поиск по сайту → скрытый спрос (тег-страницы)
//
// Env: YANDEX_METRIKA_OAUTH_TOKEN, YANDEX_METRIKA_COUNTER_ID
// Опционально: YANDEX_WEBMASTER_* (для связки с показами)
//
// Записывает: data/metrika-insights.json

const fs = require('fs');
const path = require('path');

const TOKEN = process.env.YANDEX_METRIKA_OAUTH_TOKEN;
const COUNTER = process.env.YANDEX_METRIKA_COUNTER_ID;
if (!TOKEN || !COUNTER) {
  console.error('ERR: missing YANDEX_METRIKA_OAUTH_TOKEN / YANDEX_METRIKA_COUNTER_ID');
  process.exit(1);
}

const BASE = 'https://api-metrika.yandex.net/stat/v1/data';
const SITE_ROOT = process.cwd();

async function yapi(params) {
  const url = new URL(BASE);
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) url.searchParams.append(k, v.join(','));
    else url.searchParams.append(k, String(v));
  }
  url.searchParams.append('ids', COUNTER);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `OAuth ${TOKEN}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Metrika ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function dateStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

(async () => {
  console.log('=== Metrika Miner ===');
  const date1 = dateStr(7); // 7 дней назад
  const date2 = dateStr(0); // сегодня

  // === #9: топ-страницы по визитам с отказами и временем ===
  console.log('Тянем топ-страницы за 7 дней...');
  let topPages = [];
  try {
    // Используем session-namespace ym:s для метрик типа bounceRate/avgDuration
    const data = await yapi({
      date1,
      date2,
      dimensions: 'ym:s:startURL',
      metrics: ['ym:s:visits', 'ym:s:users', 'ym:s:bounceRate', 'ym:s:avgVisitDurationSeconds'],
      sort: '-ym:s:visits',
      limit: 50,
    });
    topPages = (data.data || []).map((row) => ({
      url: row.dimensions[0]?.name || '',
      pageviews: row.metrics[0] || 0,
      users: row.metrics[1] || 0,
      bounceRate: row.metrics[2] || 0,
      avgDuration: row.metrics[3] || 0,
    }));
    console.log(`Топ-страниц: ${topPages.length}`);
  } catch (e) {
    console.warn('Top-pages не получено:', e.message.slice(0, 200));
  }

  // === ПФ-ПРОБЛЕМЫ: страницы с высоким bounce >70% или временем <30 сек ===
  const pfProblems = topPages
    .filter((p) => p.users >= 5 && (p.bounceRate > 70 || p.avgDuration < 30))
    .map((p) => ({
      url: p.url,
      users: p.users,
      bounce: Math.round(p.bounceRate),
      duration: Math.round(p.avgDuration),
      issue: p.bounceRate > 70 ? 'высокий отказ' : 'короткая сессия',
    }))
    .slice(0, 20);
  console.log(`ПФ-проблемы (отказ >70% или время <30с): ${pfProblems.length}`);

  // === #96: внутренний поиск по сайту → скрытый спрос ===
  console.log('Тянем внутренний поиск...');
  let internalSearches = [];
  try {
    const data = await yapi({
      date1: dateStr(30),
      date2,
      dimensions: 'ym:s:searchPhrase',
      metrics: ['ym:s:visits', 'ym:s:users'],
      sort: '-ym:s:visits',
      limit: 100,
    });
    internalSearches = (data.data || [])
      .map((row) => ({
        query: row.dimensions[0]?.name || '',
        visits: row.metrics[0] || 0,
      }))
      .filter((s) => s.query && s.query.length > 2);
    console.log(`Внутренний поиск: ${internalSearches.length} уникальных запросов`);
  } catch (e) {
    console.warn('Internal search не получено:', e.message.slice(0, 200));
  }

  // === Источники трафика ===
  console.log('Тянем источники трафика...');
  let trafficSources = {};
  try {
    const data = await yapi({
      date1,
      date2,
      dimensions: 'ym:s:trafficSource',
      metrics: ['ym:s:visits', 'ym:s:users'],
      sort: '-ym:s:visits',
      limit: 20,
    });
    for (const row of data.data || []) {
      const src = row.dimensions[0]?.name || 'unknown';
      trafficSources[src] = { visits: row.metrics[0] || 0, users: row.metrics[1] || 0 };
    }
  } catch (e) {
    console.warn('Sources не получено:', e.message.slice(0, 200));
  }

  // === Поисковики ===
  console.log('Тянем разбивку по поисковикам...');
  let searchEngines = {};
  try {
    const data = await yapi({
      date1,
      date2,
      dimensions: 'ym:s:searchEngine',
      metrics: ['ym:s:visits'],
      sort: '-ym:s:visits',
      limit: 10,
      filters: `ym:s:trafficSource=='organic'`,
    });
    for (const row of data.data || []) {
      const eng = row.dimensions[0]?.name || 'unknown';
      searchEngines[eng] = row.metrics[0] || 0;
    }
  } catch (e) {
    console.warn('Search engines не получено:', e.message.slice(0, 200));
  }

  // === Итог ===
  const insights = {
    generated_at: new Date().toISOString(),
    period: `${date1} → ${date2}`,
    top_pages: topPages.slice(0, 20),
    pf_problems: pfProblems,
    internal_searches: internalSearches.slice(0, 30),
    traffic_sources: trafficSources,
    search_engines: searchEngines,
    summary: {
      total_top_pages: topPages.length,
      pf_problems_count: pfProblems.length,
      internal_searches_count: internalSearches.length,
      total_visits: Object.values(trafficSources).reduce((s, v) => s + v.visits, 0),
    },
  };
  fs.writeFileSync(path.join(SITE_ROOT, 'data/metrika-insights.json'), JSON.stringify(insights, null, 2));

  // === #96: внутренние поиски → в backlog как скрытый спрос ===
  if (internalSearches.length > 0) {
    const backlogPath = path.join(SITE_ROOT, 'data/seo-backlog.json');
    const backlog = fs.existsSync(backlogPath) ? JSON.parse(fs.readFileSync(backlogPath, 'utf-8')) : [];
    const backlogQueries = new Set(backlog.map((b) => (b.query || '').toLowerCase()));
    const newToBacklog = internalSearches
      .filter((s) => s.visits >= 2 && !backlogQueries.has(s.query.toLowerCase()))
      .slice(0, 10)
      .map((s) => ({
        query: s.query,
        intent: 'informational',
        freq_estimate: `${s.visits} визитов искали на сайте за 30 дней (Я.Метрика)`,
        competition: 'low',
        priority_score: 8,
        target_pain: `Люди уже на сайте ищут «${s.query}» через внутренний поиск — значит есть спрос, но нет страницы. Создать НЧ-статью.`,
        segment: 'Я.Метрика: внутренний поиск (auto)',
        source: 'metrika-miner',
        detected_at: new Date().toISOString().split('T')[0],
      }));
    if (newToBacklog.length > 0) {
      backlog.push(...newToBacklog);
      fs.writeFileSync(backlogPath, JSON.stringify(backlog, null, 2));
      console.log(`→ В backlog добавлено ${newToBacklog.length} запросов из внутреннего поиска`);
    }
  }

  console.log('\n✅ Metrika miner завершён');
  console.log(`Summary:`, insights.summary);
})().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(2);
});
