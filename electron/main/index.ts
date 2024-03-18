import { join } from "node:path";
import { release } from "node:os";
import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  type MenuItem,
  type MenuItemConstructorOptions,
  shell
} from "electron";
import axios from "axios";
import AnyProxy from "anyproxy";
import tunnelP from "tunnel";
import XLSX from "xlsx";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;
// 是否为开发环境
const isDev = process.env["NODE_ENV"] === "development";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

// 创建菜单
function createMenu(label = "进入全屏幕") {
  const menu = Menu.buildFromTemplate(
    appMenu(label) as (MenuItemConstructorOptions | MenuItem)[]
  );
  Menu.setApplicationMenu(menu);
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1224,
    height: 768,
    minWidth: 1224,
    minHeight: 768,
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      webSecurity: false,
      devTools: true
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  createMenu();

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  // 窗口进入全屏状态时触发
  win.on("enter-full-screen", () => {
    createMenu("退出全屏幕");
  });

  // 窗口离开全屏状态时触发
  win.on("leave-full-screen", () => {
    createMenu();
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// 菜单栏 https://www.electronjs.org/zh/docs/latest/api/menu-item#%E8%8F%9C%E5%8D%95%E9%A1%B9
const appMenu = (fullscreenLabel: string) => {
  const menuItems = [
    { label: "关于", role: "about" },
    { label: "开发者工具", role: "toggleDevTools" },
    { label: "强制刷新", role: "forcereload" },
    { label: "退出", role: "quit" }
  ];
  // 生产环境删除开发者工具菜单
  if (!isDev) menuItems.splice(1, 1);
  const template = [
    {
      label: app.name,
      submenu: menuItems
    },
    {
      label: "编辑",
      submenu: [
        { label: "撤销", role: "undo" },
        {
          label: "重做",
          role: "redo"
        },
        { type: "separator" },
        { label: "剪切", role: "cut" },
        { label: "复制", role: "copy" },
        { label: "粘贴", role: "paste" },
        { label: "删除", role: "delete" },
        { label: "全选", role: "selectAll" }
      ]
    },
    {
      label: "显示",
      submenu: [
        { label: "加大", role: "zoomin" },
        {
          label: "默认大小",
          role: "resetzoom"
        },
        { label: "缩小", role: "zoomout" },
        { type: "separator" },
        {
          label: fullscreenLabel,
          role: "togglefullscreen"
        }
      ]
    }
  ];
  return template;
};

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.on("message-from-renderer", (event, message) => {
  console.log("Received message from renderer process: ", message);

  // Send a message back to the renderer process
  event.sender.send("message-from-main", "Hello from main process");
});

ipcMain.on("message-from-webview", (event, message) => {
  console.log("Received message from renderer process: ", message);
  win.webContents.send("login", message);
});

ipcMain.handle("fetch", async (e, config) => {
  config.httpsAgent = tunnelP.httpsOverHttp({
    rejectUnauthorized: false,
    proxy: {
      host: "localhost",
      port: 9000
    }
  });
  // set http proxy
  const r = await axios.request(config);

  return r && r.data;
});

ipcMain.on("open-proxy", (event, arg) => {
  const options = {
    port: 8003,
    rule: {
      async beforeSendResponse(req, res) {
        if (req.url.indexOf("wx-shangou.meituan.com") === -1) {
          return null;
        }

        console.log(req.url);
        if (req.url.indexOf("/mtweapp/v1/poi/sputag/products") !== -1) {
          const r = JSON.parse(Buffer.from(res.response.body).toString());
          const projectList = r.data.product_spu_list;
          win?.webContents.send("product-list", projectList);
          return null;
        }

        if (req.url.indexOf("/mtweapp/v1/poi/food") !== -1) {
          const r = JSON.parse(Buffer.from(res.response.body).toString());
          const tags = r.data.food_spu_tags;
          win?.webContents.send("tags", tags);
          return null;
        }

        return null;
      }
    },
    webInterface: {
      enable: true,
      webPort: 8004
    },
    forceProxyHttps: true,
    setGlobalProxy: true,
    wsIntercept: false, // 不开启websocket代理
    silent: true
  };

  const proxyServer = new AnyProxy.ProxyServer(options);
  proxyServer.start();
  /**
   *   networksetup -setwebproxy Wi-Fi 127.0.0.1 8003;
   *   networksetup -setsecurewebproxy Wi-Fi 127.0.0.1 8003;
   */
});

ipcMain.handle("download", async (e, products) => {
  console.log(products && products.length);
});

ipcMain.handle("generate-excel", async (event, products) => {
  console.log("file");
  // Create a new workbook

  const templatePath = join(process.env.PUBLIC, "./t.xls");

  const workBook = XLSX.readFile(templatePath);
  const json = XLSX.utils.sheet_to_json(
    workBook.Sheets[workBook.SheetNames[0]]
  );

  function removeSpecialCharactersAndEmojis(str) {
    // This regular expression matches most common Unicode emojis and special characters
    const regex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F780}-\u{1F7FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{0021}-\u{002F}\u{003A}-\u{0040}\u{005B}-\u{0060}\u{007B}-\u{007E}]/gu;
    return str.replace(regex, "");
  }

  products.forEach(p => {
    const sku = p.skus[0];
    if (!sku.upccode || !p.l1_tag || !p.l2_tag) {
      return;
    }
    const row = {
      __EMPTY: "",
      "条形码(upc/ean等)*": sku.upccode,
      "价格（元）*": sku.price,
      "库存*": sku.stock,
      "店内一级分类*": removeSpecialCharactersAndEmojis(p.l1_tag),
      店内二级分类: removeSpecialCharactersAndEmojis(p.l2_tag),
      "店内码/货号": "",
      "货架码/位置码": "",
      最小购买量: 0,
      售卖状态: 0,
      商品卖点: "",
      描述: "",
      app_food_code: ""
    };
    json.push(row);
  });

  const newWorkBook = XLSX.utils.book_new();
  const newSheet = XLSX.utils.json_to_sheet(json);
  XLSX.utils.book_append_sheet(newWorkBook, newSheet, "Sheet1");

  XLSX.writeFile(newWorkBook, join(process.env.PUBLIC, "t2.xls"), {
    bookType: "xls",
    bookSST: true,
    compression: true
  });

  // Send the data back to the renderer process
  event.sender.send("excel-data", []);
});
