const { ipcRenderer } = require("electron");

// setInterval(() => {
//   console.log("preload.js loaded");
//   const poi = localStorage.getItem("poiPrintTemplates");
//
//   ipcRenderer.send("message-from-renderer", {
//     cookie: document.cookie,
//     poi
//   });
// }, 1000);

setTimeout(() => {
  // 这里上传测试数据
  ipcRenderer.send("message-from-webview", {
    cookie:
      '',
    poi: []
  });
}, 2000);
