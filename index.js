const express = require("express");
const { mf2 } = require("microformats-parser");
const undici = require("undici");
const querystring = require("querystring");
const pkg = require("./package.json");
const app = express();
const port = process.env.PORT || 9000;

function getDependencyVersion(dependencyName) {
  const fs = require('fs');
  const lockfile = require('@yarnpkg/lockfile');
  const parsed = lockfile.parse(fs.readFileSync("./yarn.lock", "utf-8"));
  if (parsed.type !== "success") return "unknown";
  const dependency = parsed.object[`${dependencyName}@${pkg.dependencies[dependencyName]}`];
  if (dependency === undefined) return "unknown";
  return dependency.version;
}
const mf2version = getDependencyVersion("microformats-parser");

function htmlToMf2(url, html, res) {
  const body = mf2(html, { baseUrl: url });
  res
    .header("content-type", "application/json; charset=UTF-8")
    .send(JSON.stringify(body, null, 2));
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", async (req, res) => {
  if (req.query.url) {
    const url = req.query.url;
    const { body } = await undici.request(url, {
      maxRedirections: 2,
      headers: {
        accept: "text/html, text/mf2+html",
      },
      method: "GET",
    });
    const text = await body.text();
    htmlToMf2(url, text, res);
  } else {
    res.render("index.html.ejs", {
      version: `${pkg.version} (lib: ${mf2version})`,
    });
  }
});
app.post("/", (req, res) => {
  const qsBody = querystring.parse(req.body);
  htmlToMf2(qsBody.url, qsBody.html, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
