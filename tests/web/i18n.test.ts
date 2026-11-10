import assert from "node:assert/strict";
import { test } from "node:test";

import { getTranslationReport, normalizeLanguagePreference, resolveLanguage, setLanguagePreference, t } from "../../web/src/app/i18n.ts";

test("translations stay in sync across languages", () => {
  const report = getTranslationReport();
  assert.equal(report.baseLanguage, "en");
  assert.deepEqual(report.missing, {});
  assert.deepEqual(report.extra, {});
});

test("simplified chinese is a selectable language", () => {
  assert.equal(normalizeLanguagePreference("zh"), "zh");
  assert.equal(resolveLanguage("zh"), "zh");
  setLanguagePreference("zh", { apply: false });
  assert.equal(t("settings.language.zh"), "简体中文");
  setLanguagePreference("en", { apply: false });
  assert.equal(t("settings.language.zh"), "Simplified Chinese");
});
