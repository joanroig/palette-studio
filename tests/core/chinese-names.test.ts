import assert from "node:assert/strict";
import { test } from "node:test";

import { hexToOklch, nameColorZh } from "../../src/core/chinese-names.ts";
import { getValidFormats } from "../../src/core/formats.ts";

test("chinese is a valid color name format", () => {
  assert.ok(getValidFormats().includes("chinese"));
});

test("oklch conversion matches reference values", () => {
  const red = hexToOklch("#FF0000");
  assert.ok(Math.abs(red.l - 0.628) < 0.005);
  assert.ok(Math.abs(red.c - 0.258) < 0.005);
  assert.ok(Math.abs(red.h - 29.2) < 0.5);
  assert.deepEqual(hexToOklch("#F00"), red);
});

test("names neutrals by lightness", () => {
  assert.equal(nameColorZh("#000000"), "黑色");
  assert.equal(nameColorZh("#FFFFFF"), "白色");
  assert.equal(nameColorZh("#808080"), "灰色");
  assert.equal(nameColorZh("#C0C0C0"), "浅灰");
});

test("names common colors the way Chinese speakers expect", () => {
  assert.equal(nameColorZh("#FF0000"), "鲜红");
  assert.equal(nameColorZh("#FFC0CB"), "粉色");
  assert.equal(nameColorZh("#8B4513"), "棕色");
  assert.equal(nameColorZh("#000080"), "藏青");
  assert.equal(nameColorZh("#E9C46A"), "沙黄");
  assert.equal(nameColorZh("#C3B091"), "卡其");
  assert.equal(nameColorZh("#808000"), "橄榄");
});

test("tells a mid blue from a lighter, softer blue", () => {
  assert.notEqual(nameColorZh("#3B82F6"), nameColorZh("#60A5FA"));
});

test("every name is non-empty Chinese text", () => {
  for (let r = 0; r < 256; r += 51) {
    for (let g = 0; g < 256; g += 51) {
      for (let b = 0; b < 256; b += 51) {
        const hex = `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
        assert.match(nameColorZh(hex), /^[一-鿿]+$/, hex);
      }
    }
  }
});
