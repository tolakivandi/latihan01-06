const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const connection = require("../config/db.js");
const { body, validationResult } = require("express-validator");
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("jenis file tidak diizinkan"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/", function (req, res) {
  connection.query(
    " SELECT mahasiswa.nama, jurusan.nama_jurusan " +
      " from mahasiswa join jurusan " +
      " ON mahasiswa.id_jurusan=jurusan.id_j order by mahasiswa.id_m desc",
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server failed",
          error: err,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data mahasiswa",
          data: rows,
        });
      }
    }
  );
});

router.post(
  "/store",
  upload.fields([
    { name: "gambar", maxCount: 1 },
    { name: "swa_foto", maxCount: 1 },
  ]),
  [
    body("nama").notEmpty(),
    body("nrp").notEmpty(),
    body("id_jurusan").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let Data = {
      nama: req.body.nama,
      nrp: req.body.nrp,
      id_jurusan: req.body.id_jurusan,
      gambar: req.files.gambar[0].filename,
      swa_foto: req.files.swa_foto[0].filename,
    };
    connection.query(
      "insert into mahasiswa set ? ",
      Data,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "server failed",
            error: err,
          });
        } else {
          return res.status(201).json({
            status: true,
            message: "Success",
            data: rows[0],
          });
        }
      }
    );
  }
);

router.get("/(:id)", function (req, res) {
  let id = req.params.id;
  connection.query(
    `select * from mahasiswa where id_m = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      }
      if (rows.length <= 0) {
        return res.status(404).json({
          status: false,
          message: "Not Found",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "data mahasiswa",
          data: rows[0],
        });
      }
    }
  );
});

router.patch(
  "/update/:id",
  upload.fields([
    { name: "gambar", maxCount: 1 },
    { name: "swa_foto", maxCount: 1 },
  ]),
  [
    body("nama").notEmpty(),
    body("nrp").notEmpty(),
    body("id_jurusan").notEmpty(),
  ],
  (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
    let id = req.params.id;
    let gambar = req.files["gambar"] ? req.files["gambar"][0].filename : null;
    let swa_foto = req.files["swa_foto"]
      ? req.files["swa_foto"][0].filename
      : null;

    connection.query(
      `select * from mahasiswa where id_m = ${id}`,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "server error",
          });
        }
        if (rows.length === 0) {
          return res.status(404).json({
            status: false,
            message: "not found",
          });
        }
        const gambarLama = rows[0].gambar;
        const swa_fotoLama = rows[0].swa_foto;

        if (gambarLama && gambar) {
          const pathgambar = path.join(
            __dirname,
            "../public/image",
            gambarLama
          );
          if (fs.existsSync(pathgambar)) {
            fs.unlinkSync(pathgambar);
          }
        }
        if (swa_fotoLama && swa_foto) {
          const pathSwafoto = path.join(
            __dirname,
            "../public/image",
            swa_fotoLama
          );
          if (fs.existsSync(pathSwafoto)) {
            fs.unlinkSync(pathSwafoto);
          }
        }
        let Data = {
          nama: req.body.nama,
          nrp: req.body.nrp,
          id_jurusan: req.body.id_jurusan,
          gambar: gambar,
          swa_foto: swa_foto,
        };
        connection.query(
          `update mahasiswa set ? where id_m = ${id}`,
          Data,
          function (err, rows) {
            if (err) {
              return res.status(500).json({
                status: false,
                message: "Server Error",
              });
            } else {
              return res.status(200).json({
                status: true,
                message: "Update berhasil..!",
              });
            }
          }
        );
      }
    );
  }
);


router.delete("/delete/(:id)", function (req, res) {
  let id = req.params.id;

  connection.query(
    `select * from mahasiswa where id_m = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      }
      if (rows.length === 0) {
        return res.status(404).json({
          status: false,
          message: "not found",
        });
      }
      const namaFileLama = rows[0].gambar;
      if (namaFileLama) {
        const patchFileLama = path.join(
          __dirname,
          "../public/images",
          namaFileLama
        );
        fs.unlinkSync(patchFileLama);
      }
      connection.query(
        `delete from mahasiswa where id_m = ${id}`,
        function (err, rows) {
          if (err) {
            return res.status(500).json({
              status: false,
              message: "server error",
              error: err,
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "data berhasil dihapus",
            });
          }
        }
      );
    }
  );
});

module.exports = router;
