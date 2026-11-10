import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktopApi", {
  saveZip: (options: { fileName: string; data: Uint8Array }) => ipcRenderer.invoke("save-zip", options),
  setTheme: (theme: string) => ipcRenderer.send("set-theme", theme),
  setLanguage: (language: string) => ipcRenderer.send("set-language", language),
  onOpenLegal: (handler: () => void) => {
    ipcRenderer.on("open-legal", () => handler());
  },
});
