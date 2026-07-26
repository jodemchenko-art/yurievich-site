/**
 * Единая модель цены плитного фундамента.
 *
 * Раньше эти константы жили внутри `components/Calculator.tsx`. Вынесены сюда,
 * чтобы таблица цен на посадочной странице и калькулятор считали ОДИНАКОВО.
 * Если цифры разъедутся — клиент увидит в таблице одно, в калькуляторе другое,
 * и первое же расхождение убивает доверие к смете.
 *
 * ⚠️ Все суммы — ориентировочные, до выезда инженера. Так и подписаны на странице.
 * Базовая ставка (PRICES.plita.from = 5 500 ₽/м²) = газобетон, 1 этаж, песок.
 */

export type SizeKey = '6x6' | '7x8' | '8x10' | '9x10' | '9x12' | '10x10' | '10x12' | '12x12';
export type Storeys = 1 | 1.5 | 2;
export type Ground = 'pesok' | 'suglinok' | 'glina' | 'torf' | 'boloto';
export type Material = 'gazobeton' | 'karkas' | 'brus' | 'kirpich';

export const SIZE_AREA: Record<SizeKey, number> = {
  '6x6': 36,
  '7x8': 56,
  '8x10': 80,
  '9x10': 90,
  '9x12': 108,
  '10x10': 100,
  '10x12': 120,
  '12x12': 144,
};

export const GROUND_LABEL: Record<Ground, { name: string; multiplier: number; note: string }> = {
  pesok: { name: 'Песок / супесь', multiplier: 1.0, note: 'Идеальный грунт. Стандартная подушка 200 мм.' },
  suglinok: { name: 'Суглинок', multiplier: 1.08, note: 'Сильнопучинистый. Обязательна утеплённая отмостка.' },
  glina: { name: 'Глина', multiplier: 1.12, note: 'Пучение, дренаж нужен. Подушка ПГС 400 мм.' },
  torf: { name: 'Торф 1-2 м', multiplier: 1.42, note: 'Выторфовка + замена грунта песком (Куп≥0.95).' },
  boloto: { name: 'Болото / торф 2-4 м', multiplier: 1.85, note: 'Очень сложно. Часто свая-плита, а не моноплита.' },
};

export const MATERIAL_LOAD: Record<Material, { name: string; thicknessMM: number; pricePerM2: number }> = {
  gazobeton: { name: 'Газобетон ЛСР D500', thicknessMM: 300, pricePerM2: 5500 },
  karkas: { name: 'Каркас (СИП/брус)', thicknessMM: 250, pricePerM2: 5200 },
  brus: { name: 'Брус / клееный брус', thicknessMM: 280, pricePerM2: 5400 },
  kirpich: { name: 'Кирпич / монолит', thicknessMM: 350, pricePerM2: 6200 },
};

export const STOREY_LOAD_MULTIPLIER: Record<Storeys, number> = {
  1: 1.0,
  1.5: 1.08,
  2: 1.18,
};

/** Цена за м² и полная сумма по тем же правилам, что и в калькуляторе. */
export function calcPlita(params: {
  size: SizeKey;
  material: Material;
  ground: Ground;
  storeys: Storeys;
}) {
  const area = SIZE_AREA[params.size];
  const mat = MATERIAL_LOAD[params.material];
  const groundData = GROUND_LABEL[params.ground];
  const storeyMult = STOREY_LOAD_MULTIPLIER[params.storeys];

  const pricePerM2 = mat.pricePerM2 * storeyMult * groundData.multiplier;

  return {
    area,
    thicknessMM: mat.thicknessMM,
    pricePerM2: Math.round(pricePerM2),
    total: Math.round(pricePerM2 * area),
  };
}

/** «700 900» — неразрывные пробелы вместо запятых, как в остальном интерфейсе. */
export function fmtRub(n: number): string {
  return Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');
}

/**
 * Колонки таблицы цен на посадочной. Грунт зафиксирован = суглинок:
 * это самый частый грунт в Ленобласти, и он же указан на странице открытым текстом,
 * чтобы человек понимал, из чего сложилась сумма.
 */
export const PRICE_TABLE_GROUND: Ground = 'suglinok';

export const PRICE_TABLE_COLUMNS: Array<{
  key: string;
  label: string;
  sub: string;
  material: Material;
  storeys: Storeys;
}> = [
  { key: 'karkas-1', label: 'Каркас / брус', sub: '1 этаж · плита 250 мм', material: 'karkas', storeys: 1 },
  { key: 'gazo-1', label: 'Газобетон', sub: '1 этаж · плита 300 мм', material: 'gazobeton', storeys: 1 },
  { key: 'gazo-2', label: 'Газобетон', sub: '2 этажа · плита 300 мм', material: 'gazobeton', storeys: 2 },
  { key: 'kirpich-2', label: 'Кирпич / монолит', sub: '2 этажа · плита 350 мм', material: 'kirpich', storeys: 2 },
];

export const PRICE_TABLE_ROWS: SizeKey[] = [
  '6x6',
  '7x8',
  '8x10',
  '9x10',
  '10x10',
  '9x12',
  '10x12',
  '12x12',
];
