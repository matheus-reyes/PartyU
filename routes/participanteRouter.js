const express = require("express");
const router = express.Router();

const controller = require("../controllers/ParticipanteController");

router.get("/inicioParticipante", controller.inicio);
router.get("/todosEventosParticipante", controller.todosEventosParticipante);
router.get("/eventosParticipante", controller.eventosParticipante);
router.get("/contaParticipante", controller.contaParticipante);
router.post("/inscricaoEvento", controller.inscricaoEvento);
router.post("/apagarParticipante", controller.apagarParticipante);
router.post("/editarNomeParticipante", controller.editarNome);
router.post("/editarEmailParticipante", controller.editarEmail);
router.post("/editarSenhaParticipante", controller.editarSenha);

module.exports = router;