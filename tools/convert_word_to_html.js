const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

const root = path.resolve(__dirname, "..");
const wordDir = path.join(root, "word-source");
const publicManualDir = path.join(root, "public", "manuals");
const output = path.join(root, "src", "data", "manualIndex.js");

const docs = [
  ["1", "001.docx"],
  ["10", "002.docx"],
  ["3-1", "003.docx"],
  ["2-1", "004.docx"],
  ["2-2", "005.docx"],
  ["5-1", "006.docx"],
  ["5-10ingai", "007.docx"],
  ["3-2", "008.docx"],
  ["4", "009.docx"],
  ["5-11ingai", "010.docx"],
  ["5-12ingai", "011.docx"],
  ["5-14ingai", "012.docx"],
  ["5-13ingai", "013.docx"],
  ["5-2ingai", "014.docx"],
  ["5-3ingai", "015.docx"],
  ["5-5ingai", "016.docx"],
  ["5-7ingai", "017.docx"],
  ["5-4ingai", "018.docx"],
  ["5-8ingai", "019.docx"],
  ["5-6ingai", "020.docx"],
  ["6-1", "021.docx"],
  ["6-3", "022.docx"],
  ["6-4", "023.docx"],
  ["6-2", "024.docx"],
  ["7-1", "025.docx"],
  ["5-9ingai", "026.docx"],
  ["8ingai", "027.docx"],
  ["11", "028.docx"],
  ["12", "029.docx"],
  ["9", "031.docx"],
  ["7-2", "032.docx"]
];

const htmlStyles = `
  :root {
    color-scheme: light;
    font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", "YuGothic", "Noto Sans JP", sans-serif;
    background: #f5f8f7;
    color: #172626;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 14px;
    background: #f5f8f7;
    font-size: 16px;
    line-height: 1.72;
    word-break: normal;
    overflow-wrap: anywhere;
  }
  .manual-body {
    max-width: 920px;
    margin: 0 auto 28px;
    background: #fff;
    border: 1px solid #dce7e4;
    border-radius: 8px;
    padding: 16px;
  }
  h1, h2, h3, h4 {
    color: #143f3b;
    line-height: 1.35;
    margin: 1.15em 0 .55em;
  }
  h1 { font-size: 24px; }
  h2 { font-size: 21px; border-left: 5px solid #0f766e; padding-left: 10px; }
  h3 { font-size: 18px; }
  h4 { font-size: 16px; }
  p { margin: .55em 0; }
  ul, ol { padding-left: 1.35em; margin: .55em 0; }
  li { margin: .25em 0; }
  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 12px auto;
    border-radius: 6px;
  }
  table {
    display: block;
    width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 14px;
    line-height: 1.55;
  }
  tr { break-inside: avoid; }
  td, th {
    border: 1px solid #c9d8d4;
    padding: 7px 8px;
    vertical-align: top;
    min-width: 72px;
  }
  th { background: #e3f1ee; }
  strong, b { color: #102f2c; }
`;

function normalizeText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t\u3000]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function resetDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function extensionFor(contentType) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/svg+xml") return "svg";
  if (contentType === "image/tiff") return "tiff";
  return "bin";
}

function htmlPage(body) {
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3">
<style>${htmlStyles}</style>
</head>
<body>
<main class="manual-body">${body}</main>
</body>
</html>`;
}

async function convertOne(id, filename, manifest) {
  const input = path.join(wordDir, filename);
  const assetsDir = path.join(publicManualDir, "assets", id);
  fs.mkdirSync(assetsDir, { recursive: true });

  const manifestRow = manifest.find((line) => line.startsWith(`${filename}\t`));
  const sourceName = manifestRow?.split("\t")[1] ?? filename;
  let imageCount = 0;

  const htmlResult = await mammoth.convertToHtml(
    { path: input },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        imageCount += 1;
        const buffer = await image.read();
        const ext = extensionFor(image.contentType);
        const imageName = `image-${String(imageCount).padStart(3, "0")}.${ext}`;
        fs.writeFileSync(path.join(assetsDir, imageName), buffer);
        return {
          src: `assets/${id}/${imageName}`
        };
      }),
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='Heading 1'] => h2:fresh",
        "p[style-name='Heading 2'] => h3:fresh",
        "p[style-name='Heading 3'] => h4:fresh"
      ]
    }
  );
  const rawText = await mammoth.extractRawText({ path: input });
  fs.writeFileSync(path.join(publicManualDir, `${id}.html`), htmlPage(htmlResult.value), "utf8");

  return {
    id,
    filename,
    sourceName,
    htmlPath: `/manuals/${id}.html`,
    searchText: normalizeText(rawText.value),
    imageCount,
    tableCount: (htmlResult.value.match(/<table/g) || []).length,
    warnings: htmlResult.messages.map((message) => message.message)
  };
}

async function main() {
  const manifestPath = path.join(wordDir, "manifest.tsv");
  const manifest = fs.existsSync(manifestPath)
    ? fs.readFileSync(manifestPath, "utf8").split(/\r?\n/)
    : [];
  const contents = {};

  resetDir(publicManualDir);
  for (const [id, filename] of docs) {
    contents[id] = await convertOne(id, filename, manifest);
    console.log(`converted ${filename} -> ${id}`);
  }

  fs.writeFileSync(
    output,
    [
      "// Generated by tools/convert_word_to_html.js",
      "// Do not edit this file by hand. Update Word files and regenerate instead.",
      `export const manualIndex = ${JSON.stringify(contents, null, 2)};`,
      ""
    ].join("\n"),
    "utf8"
  );
  console.log(`wrote ${output}`);
  console.log(`wrote ${publicManualDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
