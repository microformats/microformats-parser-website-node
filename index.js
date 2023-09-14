const express = require("express");
const { mf2 } = require("microformats-parser");
const pkg = require("./package.json");
const app = express();
const port = process.env.PORT || 9000;

function getDependencyVersion(dependencyName) {
  const fs = require("fs");
  const lockfile = require("@yarnpkg/lockfile");
  const parsed = lockfile.parse(fs.readFileSync("./yarn.lock", "utf-8"));
  if (parsed.type !== "success") return "unknown";
  const dependency =
    parsed.object[`${dependencyName}@${pkg.dependencies[dependencyName]}`];
  if (dependency === undefined) return "unknown";
  return dependency.version;
}
const mf2version = getDependencyVersion("microformats-parser");

function htmlToMf2(url, html, res) {
  try {
    const body = mf2(html, { baseUrl: url });
    res
      .header("content-type", "application/json; charset=UTF-8")
      .send(JSON.stringify(body, null, 2));
  } catch (err) {
    res
      .header("content-type", "application/json; charset=UTF-8")
      .status(500)
      .send(JSON.stringify({ error: err.message }, null, 2));
  }
}

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", async (req, res) => {
  if (req.query.url) {
    const url = req.query.url;
    await fetch(url, {
      headers: {
        accept: "text/html, text/mf2+html",
      },
      method: "GET",
    }).then(async (response) => {
      const html = await response.text();
      htmlToMf2(url, html, res);
    });
  } else {
    res.render("index.html.ejs", {
      version: `${pkg.version} (lib: ${mf2version})`,
    });
  }
});
app.post("/", express.urlencoded({ extended: false }), (req, res) => {
  htmlToMf2(req.body.url, req.body.html, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
