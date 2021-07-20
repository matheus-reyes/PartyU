const express = require("express");
const router = express.Router();

const controller = require("../controllers/PromotoraController");

router.get("/inicioPromotora", controller.inicio);
router.get("/eventosPromotora", controller.eventosPromotora);
router.get("/criarEventoPromotora", controller.criarEventoPromotora);
router.get("/contaPromotora", controller.contaPromotora);
router.post("/cadastroEvento", controller.cadastroEvento);
router.post("/editarEvento", controller.editarEvento);
router.post("/apagarEvento", controller.apagarEvento);
router.post("/apagarPromotora", controller.apagarPromotora);
router.post("/editarNomePromotora", controller.editarNome);
router.post("/editarEmailPromotora", controller.editarEmail);
router.post("/editarSenhaPromotora", controller.editarSenha);

module.exports = router;