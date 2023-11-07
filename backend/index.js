const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());

const path = require("path");
app.use("/static", express.static(path.join(__dirname, "public/images")));

const mhsRouter = require("./router/mahasiswa.js");
const jurusanRouter = require("./router/jurusan.js");

const bodyPs = require("body-parser");
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());

app.use("/api/mhs", mhsRouter);
app.use("/api/jurusan", jurusanRouter);

const auth = require("./router/auth/auth");
app.use("/api/auth", auth);

app.listen(port, () => {
  console.log(`aplikasi berjalan di http::/localhost:${port}`);
});
