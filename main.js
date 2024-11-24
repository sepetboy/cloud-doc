const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  // require("devtron").install();
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // 打开调试模式
  win.webContents.openDevTools();
  const isDev = getEnv();
  const urlLocation = isDev ? "http://localhost:3000" : "url";
  win.loadURL(urlLocation);
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
