/**
 * Simplified Chinese color names.
 *
 * color-namer only ships English lists, so this names a color from its position in OKLCH instead
 * of looking it up in a table: a hue family, a lightness band and a chroma band. Working in OKLCH
 * keeps the bands perceptually even, so two colors that look clearly different (a mid blue and a
 * lighter, softer blue) land in different bands and get different names, while near-identical
 * colors still share one.
 *
 * Pure and framework-agnostic: takes a hex string, returns a name.
 */

type Oklch = { l: number; c: number; h: number };

const toLinear = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

export const hexToOklch = (hex: string): Oklch => {
  const clean = hex.replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean.slice(0, 6);
  const value = Number.parseInt(full, 16);
  const r = toLinear((value >> 16) & 255);
  const g = toLinear((value >> 8) & 255);
  const b = toLinear(value & 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bAxis = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  let hue = (Math.atan2(bAxis, a) * 180) / Math.PI;
  if (hue < 0) {
    hue += 360;
  }
  return { l: lightness, c: Math.hypot(a, bAxis), h: hue };
};

/** Hue families, by the upper bound of their OKLCH hue angle. Anything past the last wraps to the first. */
const HUE_FAMILIES = [
  { max: 12, key: "rose", base: "玫红" },
  { max: 33, key: "red", base: "红" },
  { max: 45, key: "vermilion", base: "橙红" },
  { max: 68, key: "orange", base: "橙" },
  { max: 92, key: "amber", base: "橙黄" },
  { max: 118, key: "yellow", base: "黄" },
  { max: 138, key: "lime", base: "黄绿" },
  { max: 162, key: "green", base: "绿" },
  { max: 185, key: "jade", base: "青绿" },
  { max: 215, key: "cyan", base: "青" },
  { max: 245, key: "sky", base: "天蓝" },
  { max: 275, key: "blue", base: "蓝" },
  { max: 300, key: "violet", base: "蓝紫" },
  { max: 322, key: "purple", base: "紫" },
  { max: 345, key: "magenta", base: "紫红" },
] as const;

type HueKey = (typeof HUE_FAMILIES)[number]["key"];
type ChromaBand = "muted" | "soft" | "vivid";

const getHueFamily = (hue: number) => HUE_FAMILIES.find((family) => hue < family.max) ?? HUE_FAMILIES[0];

/** 0 = darkest … 6 = lightest. */
const getLightnessBand = (lightness: number) => {
  const bounds = [0.3, 0.42, 0.54, 0.66, 0.78, 0.9];
  const index = bounds.findIndex((bound) => lightness < bound);
  return index === -1 ? 6 : index;
};

const getChromaBand = (chroma: number, lightnessBand: number): ChromaBand => {
  if (chroma < 0.07) {
    return "muted";
  }
  // Light colors cannot reach the chroma of mid tones, so "vivid" asks for less there… but the
  // very lightest still need a lot before they read as neon rather than pastel.
  const vividFrom = lightnessBand >= 6 ? 0.2 : lightnessBand >= 4 ? 0.16 : 0.13;
  return chroma < vividFrom ? "soft" : "vivid";
};

const LIGHTNESS_PREFIX = ["墨", "暗", "深", "", "亮", "浅", "淡"];
const MUTED_PREFIX = ["墨", "暗", "深", "", "亮", "浅", "淡"];
const VIVID_PREFIX = ["墨", "沉", "浓", "鲜", "艳", "明", "荧"];

/**
 * Names Chinese speakers reach for before a systematic "light orange-yellow": browns, beiges,
 * pinks, navy and so on. Keyed by `${hue}:${lightnessBand}:${chromaBand}`; `*` matches any band.
 */
const SPECIAL_NAMES: Record<string, string> = {
  // Reds and pinks
  "rose:4:vivid": "桃红",
  "rose:5:soft": "粉色",
  "rose:5:vivid": "亮粉",
  "rose:6:soft": "淡粉",
  "rose:6:vivid": "亮粉",
  "rose:5:muted": "灰粉",
  "rose:6:muted": "藕粉",
  "red:0:*": "墨红",
  "red:1:soft": "酒红",
  "red:1:vivid": "酒红",
  "red:1:muted": "褐红",
  "red:2:muted": "砖灰红",
  "red:4:soft": "鲑红",
  "red:5:soft": "粉红",
  "red:5:vivid": "珊瑚粉",
  "red:6:soft": "浅粉红",
  "red:5:muted": "灰粉红",
  "red:6:muted": "肉粉",
  "vermilion:1:*": "栗色",
  "vermilion:2:soft": "砖红",
  "vermilion:2:muted": "红褐",
  "vermilion:4:vivid": "珊瑚红",
  "vermilion:5:soft": "肉粉橙",
  // Oranges, browns and beiges
  "orange:0:*": "深咖啡",
  "orange:1:soft": "咖啡",
  "orange:1:vivid": "红棕",
  "orange:1:muted": "深褐",
  "orange:2:soft": "棕色",
  "orange:2:vivid": "赭石",
  "orange:2:muted": "褐色",
  "orange:3:muted": "灰棕",
  "orange:3:soft": "浅棕",
  "orange:5:soft": "杏色",
  "orange:6:soft": "浅杏",
  "orange:5:muted": "裸色",
  "orange:6:muted": "米杏",
  "amber:0:*": "深褐",
  "amber:1:*": "黄褐",
  "amber:2:soft": "棕黄",
  "amber:2:muted": "灰褐",
  "amber:3:soft": "土黄",
  "amber:3:muted": "深卡其",
  "amber:4:soft": "驼色",
  "amber:4:muted": "卡其",
  "amber:4:vivid": "橘黄",
  "amber:5:soft": "沙黄",
  "amber:5:muted": "浅卡其",
  "amber:5:vivid": "金黄",
  "amber:6:soft": "奶油",
  "amber:6:muted": "米色",
  // Yellows and olives
  "yellow:1:*": "暗橄榄",
  "yellow:2:*": "深橄榄",
  "yellow:3:soft": "橄榄",
  "yellow:3:vivid": "橄榄黄",
  "yellow:3:muted": "灰橄榄",
  "yellow:4:muted": "灰黄",
  "yellow:5:vivid": "明黄",
  "yellow:6:vivid": "柠檬黄",
  "yellow:6:soft": "淡黄",
  "yellow:6:muted": "象牙",
  "lime:1:*": "暗橄榄绿",
  "lime:2:*": "橄榄绿",
  "lime:3:muted": "灰橄榄绿",
  // Greens and teals
  "green:6:soft": "薄荷绿",
  "green:0:*": "墨绿",
  "jade:0:*": "墨绿",
  "jade:3:vivid": "翡翠绿",
  "jade:6:soft": "薄荷青",
  "cyan:2:soft": "水鸭青",
  "cyan:6:soft": "亮青",
  // Blues and purples
  "sky:6:soft": "淡天蓝",
  "sky:0:*": "墨蓝",
  "sky:1:muted": "暗青灰",
  "sky:2:muted": "青灰",
  "blue:0:*": "藏青",
  "blue:1:vivid": "海军蓝",
  "blue:2:vivid": "宝蓝",
  "blue:1:muted": "暗灰蓝",
  "violet:0:*": "墨紫",
  "violet:1:vivid": "靛蓝",
  "violet:3:vivid": "紫罗兰",
  "violet:6:muted": "薰衣草",
  "purple:1:vivid": "靛紫",
  "purple:6:muted": "淡雪青",
  "magenta:1:*": "暗紫红",
  "magenta:4:vivid": "品红",
  "magenta:5:soft": "粉紫",
  "magenta:6:soft": "淡粉紫",
};

const findSpecialName = (hue: HueKey, lightnessBand: number, chromaBand: ChromaBand) =>
  SPECIAL_NAMES[`${hue}:${lightnessBand}:${chromaBand}`] ?? SPECIAL_NAMES[`${hue}:${lightnessBand}:*`];

const NEUTRAL_CHROMA = 0.03;
const TINTED_CHROMA = 0.012;

const nameNeutral = ({ l, c, h }: Oklch) => {
  const warm = c >= TINTED_CHROMA && h >= 30 && h < 115;
  const cool = c >= TINTED_CHROMA && h >= 180 && h < 300;

  if (l < 0.2) {
    return "黑色";
  }
  if (l < 0.32) {
    return warm ? "暖炭黑" : cool ? "冷炭黑" : "炭黑";
  }
  if (l >= 0.985) {
    return "白色";
  }
  if (l >= 0.93) {
    return warm ? "米白" : cool ? "冷白" : "灰白";
  }
  const steps: Array<[number, string]> = [
    [0.45, "深"],
    [0.58, "中"],
    [0.7, ""],
    [0.82, "浅"],
    [0.93, "银"],
  ];
  const prefix = steps.find(([bound]) => l < bound)?.[1] ?? "";
  const tint = warm ? "暖" : cool ? "冷" : "";
  return prefix || tint ? `${prefix}${tint}灰` : "灰色";
};

const nameChromatic = (color: Oklch) => {
  const family = getHueFamily(color.h);
  const lightnessBand = getLightnessBand(color.l);
  const chromaBand = getChromaBand(color.c, lightnessBand);

  const special = findSpecialName(family.key, lightnessBand, chromaBand);
  if (special) {
    return special;
  }
  if (chromaBand === "muted") {
    return `${MUTED_PREFIX[lightnessBand]}灰${family.base}`;
  }
  if (chromaBand === "vivid") {
    return `${VIVID_PREFIX[lightnessBand]}${family.base}`;
  }
  const prefix = LIGHTNESS_PREFIX[lightnessBand];
  // A bare one-character hue ("红", "蓝") reads as unfinished; give it the 色 suffix.
  return prefix || family.base.length > 1 ? `${prefix}${family.base}` : `${family.base}色`;
};

/** Names a hex color (`#RRGGBB` or `#RGB`) in Simplified Chinese. */
export const nameColorZh = (hex: string) => {
  const color = hexToOklch(hex);
  return color.c < NEUTRAL_CHROMA ? nameNeutral(color) : nameChromatic(color);
};
