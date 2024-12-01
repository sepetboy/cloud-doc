const { app, BrowserWindow } = require("electron");
const { initialize, enable } = require("@electron/remote/main");
const Store = require("electron-store");
Store.initRenderer();

const createWindow = () => {
  // require("devtron").install();
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // window.require可以按照node解析代码
      contextIsolation: false, // https://blog.csdn.net/weixin_42386379/article/details/115250912
    },
  });

  // 打开调试模式
  win.webContents.openDevTools();
  const isDev = getEnv();
  const urlLocation = isDev ? "http://localhost:3000" : "url";
  win.loadURL(urlLocation);
  initialize();
  enable(win.webContents);
};
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

function getEnv() {
  const { env } = process;
  const isEnvSet = "ELECTRON_IS_DEV" in env;
  const getFromEnv = Number.parseInt(env.ELECTRON_IS_DEV, 10) === 1;
  const isDev = isEnvSet ? getFromEnv : !app.isPackaged;
  return isDev;
}
