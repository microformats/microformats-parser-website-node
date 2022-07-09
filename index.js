const express = require("express");
const mf2 = require("microformat-node");
const undici = require("undici");
const querystring = require("querystring");
const pkg = require("./package.json");
const app = express();
const port = process.env.PORT || 9000;

function htmlToMf2(url, html, res) {
  mf2.get({ baseUrl: url, html }, (err, data) => {
    const body = err || data;
    res
      .header("content-type", "application/json; charset=UTF-8")
      .send(JSON.stringify(body, null, 2));
  });
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
      version: `${pkg.version} (lib: ${mf2.version})`,
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
