import assert from "node:assert/strict";
import { test } from "node:test";

import { MENU_LABELS, MENU_LANGUAGES, resolveMenuLanguage } from "../../electron/menu-labels.ts";

test("every menu language has every label", () => {
  const keys = Object.keys(MENU_LABELS.en).sort();
  for (const language of MENU_LANGUAGES) {
    assert.deepEqual(Object.keys(MENU_LABELS[language]).sort(), keys, language);
  }
});

test("the menu follows the web UI language, then the system locale", () => {
  assert.equal(resolveMenuLanguage("zh", "en-US"), "zh");
  assert.equal(resolveMenuLanguage("system", "zh-CN"), "zh");
  assert.equal(resolveMenuLanguage(undefined, "es-419"), "es");
  assert.equal(resolveMenuLanguage(undefined, "fr-FR"), "en");
  assert.equal(resolveMenuLanguage("english", "en"), "en");
});
