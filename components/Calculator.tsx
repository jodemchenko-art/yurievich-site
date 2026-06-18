'use client';

import { useState, useMemo } from 'react';
import { SITE } from '@/lib/site';

// === Параметры расчёта ===
type SizeKey = '6x6' | '7x8' | '8x10' | '9x10' | '9x12' | '10x10' | '10x12' | '12x12';
type Storeys = 1 | 1.5 | 2;
type Ground = 'pesok' | 'suglinok' | 'glina' | 'torf' | 'boloto';
type Material = 'gazobeton' | 'karkas' | 'brus' | 'kirpich';

const SIZE_AREA: Record<SizeKey, number> = {
  '6x6': 36,
  '7x8': 56,
  '8x10': 80,
  '9x10': 90,
  '9x12': 108,
  '10x10': 100,
  '10x12': 120,
  '12x12': 144,
};

const GROUND_LABEL: Record<Ground, { name: string; multiplier: number; note: string }> = {
  pesok: { name: 'Песок / супесь', multiplier: 1.0, note: 'Идеальный грунт. Стандартная подушка 200 мм.' },
  suglinok: { name: 'Суглинок', multiplier: 1.08, note: 'Сильнопучинистый. Обязательна утеплённая отмостка.' },
  glina: { name: 'Глина', multiplier: 1.12, note: 'Пучение, дренаж нужен. Подушка ПГС 400 мм.' },
  torf: { name: 'Торф 1-2 м', multiplier: 1.42, note: 'Выторфовка + замена грунта песком (Куп≥0.95).' },
  boloto: { name: 'Болото / торф 2-4 м', multiplier: 1.85, note: 'Очень сложно. Часто свая-плита, а не моноплита.' },
};

const MATERIAL_LOAD: Record<Material, { name: string; thicknessMM: number; pricePerM2: number }> = {
  gazobeton: { name: 'Газобетон ЛСР D500', thicknessMM: 300, pricePerM2: 5500 },
  karkas: { name: 'Каркас (СИП/брус)', thicknessMM: 250, pricePerM2: 5200 },
  brus: { name: 'Брус / клееный брус', thicknessMM: 280, pricePerM2: 5400 },
  kirpich: { name: 'Кирпич / монолит', thicknessMM: 350, pricePerM2: 6200 },
};

const STOREY_LOAD_MULTIPLIER: Record<Storeys, number> = {
  1: 1.0,
  1.5: 1.08,
  2: 1.18,
};

function fmt(n: number): string {
  return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
}

type CalculatorProps = {
  defaultGround?: Ground;
  defaultSize?: SizeKey;
  defaultMaterial?: Material;
  regionLabel?: string; // если задано — пробрасывается в submit() как контекст
};

export default function Calculator({
  defaultGround = 'suglinok',
  defaultSize = '10x10',
  defaultMaterial = 'gazobeton',
  regionLabel,
}: CalculatorProps = {}) {
  const [size, setSize] = useState<SizeKey>(defaultSize);
  const [storeys, setStoreys] = useState<Storeys>(2);
  const [ground, setGround] = useState<Ground>(defaultGround);
  const [material, setMaterial] = useState<Material>(defaultMaterial);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const result = useMemo(() => {
    const area = SIZE_AREA[size];
    const mat = MATERIAL_LOAD[material];
    const groundData = GROUND_LABEL[ground];
    const storeyMult = STOREY_LOAD_MULTIPLIER[storeys];

    const basePricePerM2 = mat.pricePerM2 * storeyMult * groundData.multiplier;
    const totalPrice = basePricePerM2 * area;

    // Расчёт по позициям (примерно)
    const concrete = Math.round(area * mat.thicknessMM / 1000 * 4800); // м³ × цена бетона
    const rebar = Math.round(area * mat.thicknessMM / 1000 * 130 * 90); // прим. кг арматуры × цена
    const labor = Math.round(area * 1800); // работа за м²
    const formwork = Math.round(area * 450); // опалубка
    const podpushka = Math.round(area * (groundData.multiplier > 1.3 ? 1400 : 600)); // подушка ПГС
    const extras = Math.round(totalPrice - concrete - rebar - labor - formwork - podpushka);

    return {
      area,
      thickness: mat.thicknessMM,
      pricePerM2: basePricePerM2,
      totalPrice,
      groundNote: groundData.note,
      breakdown: {
        concrete,
        rebar,
        labor,
        formwork,
        podpushka,
        extras: Math.max(0, extras),
      },
    };
  }, [size, storeys, ground, material]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: regionLabel ? `calculator-${regionLabel}` : 'calculator',
          answers: [
            ...(regionLabel ? [{ q: 'Район', a: regionLabel }] : []),
            { q: 'Размер дома', a: size },
            { q: 'Этажность', a: `${storeys} этажа` },
            { q: 'Грунт', a: GROUND_LABEL[ground].name },
            { q: 'Материал стен', a: MATERIAL_LOAD[material].name },
            { q: 'Расчёт калькулятора', a: `${fmt(result.totalPrice)} ₽ (${fmt(result.pricePerM2)} ₽/м² × ${result.area} м²)` },
          ],
          contact: { name, phone },
        }),
      }).catch(() => null);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-brand-line">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-extrabold">Заявка принята!</h3>
        <p className="mt-3 text-brand-mute">
          Юрий перезвонит в ближайший час с точным расчётом по позициям.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
      {/* Left: inputs */}
      <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-brand-line">
        <h3 className="text-2xl font-extrabold mb-6">Параметры дома</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-brand-ink mb-2">Размер дома (м × м)</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(SIZE_AREA) as SizeKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSize(k)}
                  className={`rounded-xl border-2 py-3 text-sm font-bold transition ${
                    size === k ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-line hover:border-brand-ink/40'
                  }`}
                >
                  {k.replace('x', '×')}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-brand-mute">Площадь: {SIZE_AREA[size]} м²</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-ink mb-2">Этажность</label>
            <div className="grid grid-cols-3 gap-2">
              {([1, 1.5, 2] as Storeys[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStoreys(s)}
                  className={`rounded-xl border-2 py-3 text-sm font-bold transition ${
                    storeys === s ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-line hover:border-brand-ink/40'
                  }`}
                >
                  {s === 1 ? '1 этаж' : s === 1.5 ? '1,5 (мансарда)' : '2 этажа'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-ink mb-2">Материал стен</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(MATERIAL_LOAD) as Material[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMaterial(m)}
                  className={`rounded-xl border-2 py-3 px-4 text-left text-sm transition ${
                    material === m ? 'border-brand-ink bg-brand-sand' : 'border-brand-line hover:border-brand-ink/40'
                  }`}
                >
                  <div className="font-bold">{MATERIAL_LOAD[m].name}</div>
                  <div className="text-xs text-brand-mute mt-0.5">плита {MATERIAL_LOAD[m].thicknessMM} мм</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-ink mb-2">Грунт на участке</label>
            <div className="space-y-2">
              {(Object.keys(GROUND_LABEL) as Ground[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGround(g)}
                  className={`w-full rounded-xl border-2 py-3 px-4 text-left transition ${
                    ground === g ? 'border-brand-ink bg-brand-sand' : 'border-brand-line hover:border-brand-ink/40'
                  }`}
                >
                  <div className="font-bold text-sm">{GROUND_LABEL[g].name}</div>
                  <div className="text-xs text-brand-mute mt-0.5">{GROUND_LABEL[g].note}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: result */}
      <div className="lg:col-span-2">
        <div className="bg-brand-ink text-white rounded-3xl p-6 md:p-8 shadow-xl sticky top-24">
          <div className="text-sm uppercase tracking-widest text-white/60 font-semibold mb-2">
            Ваш плитный фундамент
          </div>
          <div className="text-4xl md:text-5xl font-extrabold leading-tight mb-1">
            ~{fmt(result.totalPrice)} <span className="text-2xl text-white/70">₽</span>
          </div>
          <div className="text-sm text-white/70 mb-6">
            ({fmt(result.pricePerM2)} ₽/м² × {result.area} м², толщина плиты {result.thickness} мм)
          </div>

          <div className="border-t border-white/20 pt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Бетон М300 W6 F150</span>
              <span className="font-bold">{fmt(result.breakdown.concrete)} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Арматура А500С</span>
              <span className="font-bold">{fmt(result.breakdown.rebar)} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Работа бригады</span>
              <span className="font-bold">{fmt(result.breakdown.labor)} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Опалубка</span>
              <span className="font-bold">{fmt(result.breakdown.formwork)} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Подушка ПГС</span>
              <span className="font-bold">{fmt(result.breakdown.podpushka)} ₽</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Доставка, доп. работы</span>
              <span className="font-bold">{fmt(result.breakdown.extras)} ₽</span>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 pt-6 border-t border-white/20">
            <p className="text-xs text-white/70 mb-3 leading-relaxed">
              Это предварительный расчёт. Юрий перезвонит и пришлёт <strong>точную смету по позициям</strong> под ваш участок и геологию.
            </p>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-white focus:outline-none mb-3"
            />
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 ___ ___-__-__"
              className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-white focus:outline-none mb-3"
            />
            <button
              type="submit"
              disabled={loading || !name.trim() || !phone.trim()}
              className="w-full rounded-xl bg-white text-brand-ink py-4 font-bold text-base hover:bg-brand-sand transition disabled:opacity-50"
            >
              {loading ? 'Отправляем…' : 'Получить точный расчёт'}
            </button>
            <p className="mt-3 text-xs text-white/50 text-center">
              ★ 5.0 · 35 отзывов · Гарантия {SITE.warrantyYears} лет
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
