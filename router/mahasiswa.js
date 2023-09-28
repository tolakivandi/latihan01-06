// const express = require("express");
// const router = express.Router();

// const { body, validationResult } = require(`express-validator`);

// const connection = require("../config/db");
// // const { status } = require("express/lib/response");

// router.get("/", function (req, res) {
//   connection.query(
//     "select * from mahasiswa order by id_m desc",
//     function (err, rows) {
//       if (err) {
//         return res.status(500).json({
//           status: false,
//           message: "server failed",
//         });
//       } else {
//         return res.status(200).json({
//           status: true,
//           message: "Data mahasiswa",
//           data: rows,
//         });
//       }
//     }
//   );
// });

// router.post(
//   "/store",
//   [
//     // connection.query(
//     body("nama").notEmpty(),
//     body("nrp").notEmpty(),
//   ],
//   (req, res) => {
//     const error = validationResult(req);
//     if (!error.isEmpty()) {
//       return res.status(422).json({
//         error: error.array(),
//       });
//     }
//     let Data = {
//       nama: req.body.nama,
//       nrp: req.body.nrp,
//     };
//     connection.query(`insert into mahasiswa set ?`, Data, function (err, rows) {
//       if (err) {
//         return res.status(500).json({
//           status: false,
//           message: "server error",
//         });
//       } else {
//         return res.status(500).json({
//           status: true,
//           message: "success..!",
//           data: rows[0],
//         });
//       }
//     });
//   }
// );


// router.post('/store',)

// router.get('/(:id)', function (req, res) {
//   let id = req.params.id;
//   connection.query(`select * from  mahasiswa where id_m = ${id}`, function (err, rows) {
//     if (err) {
//       return res.status(500).json({
//         status: false,
//         message: 'server error',
//       })
//   } 
//     if (rows.length <= 0){
//     return res.status(404).json({
//       status: false,
//       message: 'not Found',
//       })
//     }
//     else {
//       return res.status(200).json({
//         status: true,
//         message: 'Data mahasiswa',
//         data: rows[0]
//       })
//     }
//   })
// })

// router.patch('/update/:id', [
//   body('nama').notEmpty(),
//     body('nrp').notEmpty()
// ], (req, res) => {
//   const error = validationResult(req);
//   if (!error.isEmpty()){
//     return res.status(422).json({
//       error: error.array()
//     });
//   }
//   let id = req.params.id;
//   let Data = {
//     nama: req.body.nama,
//     nrp: req.body.nrp
//   }
//   connection.query(`update mahasiswa set ? where id_m = ${id}`, Data, function (err, rows) {
//     if (err) {
//       return res.status(500).json({
//         status: false,
//         message: 'server error',
//       })
//     } else {
//       return res.status(200).json({
//         status: true,
//         message: 'update Success..!'
//       })
//     }
//   })
// })n

// router.delete("/delete/:id", function (req, res) {
//   let id = req.params.id;
//   connection.query(
//     `delete from mahasiswa where id_m = ${id}`,
//     function (err, rows) {
//       if (err) {
//         return res.status(500).json({
//           status: false,
//           message: "Server failed",
//         });
//       } else {
//         return res.status(200).json({
//           status: true,
//           message: "Data Berhasil Dihapus",
//         });
//       }
//     }
//   );
// });

const express = require("express");
const router = express.Router();

const connection = require("../config/db.js");
const { body, validationResult } = require("express-validator");

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
    };
    connection.query(
      "insert into mahasiswa set ? ",
      Data,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "server failed",
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
    let data = {
      nama: req.body.nama,
      nrp: req.body.nrp,
      id_jurusan: req.body.id_jurusan,
    };
    connection.query(
      `update mahasiswa set ? where id_m = ${id}`,
      data,
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: "server error",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "update",
          });
        }
      }
    );
  }
);

router.delete("/delete/(:id)", function (req, res) {
  let id = req.params.id;
  connection.query(
    `delete from mahasiswa where id_m = ${id}`,
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: "server error",
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Data di hapus",
        });
      }
    }
  );
});

module.exports = router;
