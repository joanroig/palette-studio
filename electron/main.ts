import { app, BrowserWindow, dialog, ipcMain, Menu, nativeTheme, shell } from "electron";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { MENU_LABELS, resolveMenuLanguage, type MenuLanguage } from "./menu-labels.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);

const APP_LINKS = {
  webApp: "https://palettes.web.app/",
  releases: "https://github.com/joanroig/palette-studio/releases",
  repo: "https://github.com/joanroig/palette-studio",
  issues: "https://github.com/joanroig/palette-studio/issues",
};

const THEME_BACKGROUNDS: Record<string, string> = {
  studio: "#eef1f7",
  dawn: "#f7f3ef",
  flora: "#eef8f3",
  noir: "#0f111a",
  graphite: "#141822",
  aurora: "#0b1321",
};

const getThemeBackground = (theme = "system") =>
  THEME_BACKGROUNDS[theme] ?? (nativeTheme.shouldUseDarkColors ? THEME_BACKGROUNDS.noir : THEME_BACKGROUNDS.studio);

const isAuthPopupUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();
    if (host === "accounts.google.com") {
      return true;
    }
    if ((host.endsWith(".firebaseapp.com") || host.endsWith(".web.app")) && path.startsWith("/__/auth/")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const getWindowIcon = () => {
  if (process.platform === "darwin") {
    return undefined;
  }
  const rootPath = app.isPackaged ? app.getAppPath() : process.cwd();
  const preferred = path.join(rootPath, "assets", process.platform === "win32" ? "icon.ico" : "icon.png");
  if (existsSync(preferred)) {
    return preferred;
  }
  const fallback = path.join(rootPath, "assets", "icon.png");
  return existsSync(fallback) ? fallback : undefined;
};

const openExternal = (url: string) => {
  void shell.openExternal(url);
};

const openModal = (channel: "open-legal") => {
  const targetWindow = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
  if (!targetWindow) {
    return;
  }
  if (targetWindow.isMinimized()) {
    targetWindow.restore();
  }
  targetWindow.show();
  targetWindow.focus();

  if (targetWindow.webContents.isLoadingMainFrame()) {
    targetWindow.webContents.once("did-finish-load", () => {
      targetWindow.webContents.send(channel);
    });
    return;
  }

  targetWindow.webContents.send(channel);
};

let menuLanguage: MenuLanguage = "en";

const showAboutDialog = async () => {
  const labels = MENU_LABELS[menuLanguage];
  await dialog.showMessageBox({
    type: "info",
    title: labels.about,
    message: labels.aboutAppName,
    detail: labels.aboutDetail.replace("{version}", app.getVersion()),
    buttons: [labels.ok],
  });
};

const createAppMenu = () => {
  const isMac = process.platform === "darwin";
  const labels = MENU_LABELS[menuLanguage];
  const menuTemplate = [
    {
      label: labels.file,
      submenu: [
        {
          label: labels.openWebApp,
          click: () => openExternal(APP_LINKS.webApp),
        },
        {
          label: labels.downloadDesktop,
          click: () => openExternal(APP_LINKS.releases),
        },
        {
          label: labels.viewSource,
          click: () => openExternal(APP_LINKS.repo),
        },
        { type: "separator" },
        ...(isMac
          ? [{ role: "hide" }, { role: "hideOthers" }, { role: "unhide" }, { type: "separator" }, { role: "quit" }]
          : [{ role: "quit", label: labels.quit }]),
      ],
    },
    {
      label: labels.edit,
      submenu: [
        { role: "undo", label: labels.undo },
        { role: "redo", label: labels.redo },
        { type: "separator" },
        { role: "cut", label: labels.cut },
        { role: "copy", label: labels.copy },
        { role: "paste", label: labels.paste },
        { role: "selectAll", label: labels.selectAll },
      ],
    },
    {
      label: labels.view,
      submenu: [
        { role: "reload", label: labels.reload },
        { role: "forceReload", label: labels.forceReload },
        { role: "toggleDevTools", label: labels.toggleDevTools },
        { type: "separator" },
        { role: "minimize", label: labels.minimize },
        { type: "separator" },
        { role: "resetZoom", label: labels.resetZoom },
        { role: "zoomIn", label: labels.zoomIn },
        { role: "zoomOut", label: labels.zoomOut },
        { type: "separator" },
        { role: "togglefullscreen", label: labels.toggleFullScreen },
      ],
    },
    {
      label: labels.help,
      submenu: [
        {
          label: labels.about,
          click: () => void showAboutDialog(),
        },
        {
          label: labels.reportIssue,
          click: () => openExternal(APP_LINKS.issues),
        },
        {
          label: labels.legal,
          click: () => openModal("open-legal"),
        },
      ],
    },
  ] as Electron.MenuItemConstructorOptions[];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
};

const createWindow = () => {
  const windowIcon = getWindowIcon();
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: getThemeBackground(),
    ...(windowIcon ? { icon: windowIcon } : {}),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    void win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(app.getAppPath(), "dist-web", "index.html");
    void win.loadFile(indexPath);
  }

  const devOrigin = process.env.VITE_DEV_SERVER_URL ? new URL(process.env.VITE_DEV_SERVER_URL).origin : null;
  const isExternalUrl = (url: string) => {
    if (url.startsWith("file://")) {
      return false;
    }
    if (devOrigin) {
      try {
        return new URL(url).origin !== devOrigin;
      } catch {
        return true;
      }
    }
    return true;
  };

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isAuthPopupUrl(url)) {
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          parent: win,
          modal: true,
          width: 520,
          height: 640,
          resizable: false,
          backgroundColor: "#ffffff",
          ...(windowIcon ? { icon: windowIcon } : {}),
          webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
          },
        },
      };
    }
    if (isExternalUrl(url)) {
      void shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (isExternalUrl(url)) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });
};

app.whenReady().then(() => {
  menuLanguage = resolveMenuLanguage(undefined, app.getLocale());
  createAppMenu();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("save-zip", async (_event, options: { fileName: string; data: Uint8Array }) => {
  const result = await dialog.showSaveDialog({
    defaultPath: options.fileName || "swatches-ase.zip",
    filters: [{ name: "Zip", extensions: ["zip"] }],
  });
  if (result.canceled || !result.filePath) {
    return { saved: false };
  }
  await fs.writeFile(result.filePath, options.data);
  return { saved: true, path: result.filePath };
});

ipcMain.on("set-theme", (event, theme: unknown) => {
  const targetWindow = BrowserWindow.fromWebContents(event.sender);
  if (!targetWindow) {
    return;
  }
  targetWindow.setBackgroundColor(getThemeBackground(typeof theme === "string" ? theme : "system"));
});

// The web UI reports its language once it has loaded and whenever the user changes it.
ipcMain.on("set-language", (_event, language) => {
  const next = resolveMenuLanguage(language, app.getLocale());
  if (next === menuLanguage) {
    return;
  }
  menuLanguage = next;
  createAppMenu();
});
