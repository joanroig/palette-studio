/**
 * Labels for the native application menu and About dialog.
 *
 * The menu lives in the main process, which cannot read the web UI's translation files, so it keeps
 * its own small dictionary for the same languages. Role items (Undo, Copy, Zoom In…) get explicit
 * labels too: Electron only ships English defaults for them.
 */

export const MENU_LANGUAGES = ["en", "es", "zh"] as const;
export type MenuLanguage = (typeof MENU_LANGUAGES)[number];

export type MenuLabels = {
  file: string;
  openWebApp: string;
  downloadDesktop: string;
  viewSource: string;
  quit: string;
  edit: string;
  undo: string;
  redo: string;
  cut: string;
  copy: string;
  paste: string;
  selectAll: string;
  view: string;
  reload: string;
  forceReload: string;
  toggleDevTools: string;
  minimize: string;
  resetZoom: string;
  zoomIn: string;
  zoomOut: string;
  toggleFullScreen: string;
  help: string;
  about: string;
  reportIssue: string;
  legal: string;
  aboutAppName: string;
  aboutDetail: string;
  ok: string;
};

export const MENU_LABELS: Record<MenuLanguage, MenuLabels> = {
  en: {
    file: "File",
    openWebApp: "Open Web App",
    downloadDesktop: "Download Desktop",
    viewSource: "View Source on GitHub",
    quit: "Quit",
    edit: "Edit",
    undo: "Undo",
    redo: "Redo",
    cut: "Cut",
    copy: "Copy",
    paste: "Paste",
    selectAll: "Select All",
    view: "View",
    reload: "Reload",
    forceReload: "Force Reload",
    toggleDevTools: "Toggle Developer Tools",
    minimize: "Minimize",
    resetZoom: "Actual Size",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    toggleFullScreen: "Toggle Full Screen",
    help: "Help",
    about: "About Palette Studio",
    reportIssue: "Report an Issue",
    legal: "Legal",
    aboutAppName: "Palette Studio",
    aboutDetail: "Version {version}\nImport, edit, and export palettes across Procreate, Adobe, and GIMP formats.",
    ok: "OK",
  },
  es: {
    file: "Archivo",
    openWebApp: "Abrir la app web",
    downloadDesktop: "Descargar la versión de escritorio",
    viewSource: "Ver el código en GitHub",
    quit: "Salir",
    edit: "Editar",
    undo: "Deshacer",
    redo: "Rehacer",
    cut: "Cortar",
    copy: "Copiar",
    paste: "Pegar",
    selectAll: "Seleccionar todo",
    view: "Ver",
    reload: "Recargar",
    forceReload: "Forzar recarga",
    toggleDevTools: "Herramientas de desarrollo",
    minimize: "Minimizar",
    resetZoom: "Tamaño real",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    toggleFullScreen: "Pantalla completa",
    help: "Ayuda",
    about: "Acerca de Palette Studio",
    reportIssue: "Informar de un problema",
    legal: "Información legal",
    aboutAppName: "Palette Studio",
    aboutDetail: "Versión {version}\nImporta, edita y exporta paletas en formatos de Procreate, Adobe y GIMP.",
    ok: "Aceptar",
  },
  zh: {
    file: "文件",
    openWebApp: "打开网页版",
    downloadDesktop: "下载桌面版",
    viewSource: "在 GitHub 查看源代码",
    quit: "退出",
    edit: "编辑",
    undo: "撤销",
    redo: "重做",
    cut: "剪切",
    copy: "复制",
    paste: "粘贴",
    selectAll: "全选",
    view: "视图",
    reload: "重新加载",
    forceReload: "强制重新加载",
    toggleDevTools: "开发者工具",
    minimize: "最小化",
    resetZoom: "实际大小",
    zoomIn: "放大",
    zoomOut: "缩小",
    toggleFullScreen: "切换全屏",
    help: "帮助",
    about: "关于画板配色中心",
    reportIssue: "报告问题",
    legal: "法律信息",
    aboutAppName: "画板配色中心",
    aboutDetail: "版本 {version}\n在 Procreate、Adobe 和 GIMP 格式之间导入、编辑和导出调色板。",
    ok: "确定",
  },
};

/**
 * The menu language: the one the web UI reports once it has loaded, or the system locale before
 * that (and for anything the menu has no labels for), falling back to English.
 */
export const resolveMenuLanguage = (requested: unknown, systemLocale: string): MenuLanguage => {
  const candidates = [typeof requested === "string" ? requested : "", systemLocale];
  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    const match = MENU_LANGUAGES.find((language) => normalized === language || normalized.startsWith(`${language}-`));
    if (match) {
      return match;
    }
  }
  return "en";
};
