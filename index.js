const express = require("express");
const mf2 = require("microformat-node");
const undici = require("undici");
const app = express();
const port = 9000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", async (req, res) => {
  if (req.query.url) {
    const url = req.query.url;
    const { body } = await undici.request(url);
    mf2.get({ baseUrl: url, html: await body.text() }, (err, data) => {
      res.send(err || data);
    });
  } else {
    res.render("index.html.ejs", { version: "1.0.0" });
  }
});
app.post("/", (req, res) => {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
