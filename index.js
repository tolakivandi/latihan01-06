const express = require("express");
const app = express();
const port = 3000;

const mhsRouter = require("./router/mahasiswa.js");
const jurusanRouter = require("./router/jurusan.js");

const bodyPs = require("body-parser");
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());

app.use("/api/mhs", mhsRouter);
app.use("/api/jurusan", jurusanRouter);

app.listen(port, () => {
  console.log(`aplikasi berjalan di http::/localhost:${port}`);
});
