const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "dist-test", "index.html");

let html = fs.readFileSync(indexPath, "utf8");

const headTags = [
  '<html lang="en">',
  '<html lang="ja">',
  '<meta name="theme-color" content="#0F766E" />',
  '<link rel="manifest" href="/manifest.json" />',
  '<link rel="icon" href="/pwa-icon.svg" type="image/svg+xml" />',
  '<link rel="apple-touch-icon" href="/pwa-icon.svg" />',
  '<meta name="apple-mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-title" content="感染管理" />',
  '<meta name="apple-mobile-web-app-status-bar-style" content="default" />'
];

html = html.replace(headTags[0], headTags[1]);
if (!html.includes('rel="manifest"')) {
  html = html.replace("</head>", `${headTags.slice(2).join("\n    ")}\n  </head>`);
}

const registerScript = `
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  });
}
</script>`;

if (!html.includes("serviceWorker.register")) {
  html = html.replace("</body>", `${registerScript}\n</body>`);
}

fs.writeFileSync(indexPath, html, "utf8");
console.log("PWA metadata injected into dist-test/index.html");
