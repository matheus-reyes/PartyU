const {Ingresso, Participante, Evento} = require("../models");
const bcrypt = require("bcrypt");

module.exports = {

    inicio: async (req, res) => {
        let feedback = "inicio";

        // Salva todos os eventos
        const eventos = await Evento.findAll();

        res.render("participante/inicio", {eventos, feedback});

    },

    todosEventosParticipante: async (req, res) => {
        let feedback = "inicio";
        // Salva todos os eventos
        const eventos = await Evento.findAll();

        res.render("participante/inicio", {eventos, feedback});

    },

    eventosParticipante: async (req, res) => {

        //Pega os dados do participante pela session
        const usuario = req.session.usuario;

        //Dados do participante e dos eventos que ele faz parte
        const participanteEventos = await Participante.findByPk(usuario.cpf, {
            include:{
                model: Evento,
                as:'eventos'
            }
        });

        res.render("participante/eventos", {eventos: participanteEventos.eventos});

    },

    contaParticipante: (req, res) => {

        const usuario = req.session.usuario;

        res.render("participante/conta", {usuario});

    },

    inscricaoEvento: async (req, res) => {

        //Pega os dados do participante pela session
        const usuario = req.session.usuario;
        const idEvento = req.body.idEvento;
        const forma_pagamento = "cartão";
        const data = "2020-12-01";
        const desconto = 10.00;
        const numero_lote = 1;

        //Insere os dados na tabela Ingresso
        await Ingresso.create({
            cpf: usuario.cpf,
            id_evento: idEvento,
            forma_pagamento,
            data,
            desconto,
            numero_lote
        });

        //Dados do participante e dos eventos que ele faz parte
        const participanteEventos = await Participante.findByPk(usuario.cpf, {
            include:{
                model: Evento,
                as:'eventos'
            }
        });

        res.render("participante/eventos", {eventos: participanteEventos.eventos});

    },

    editarNome: async (req, res) => {
        const nome = req.body.nome;
        const cpf = req.session.usuario.cpf;

        await Participante.update({
            nome
        },
        {
            where:{
                cpf
            }
        });

        let feedback = "Nome alterado com sucesso!";

        req.session.usuario.nome = nome;

        const eventos = await Evento.findAll();

        res.render("participante/inicio", {eventos, feedback});

    },

    editarEmail: async (req, res) => {
        const e_mail = req.body.email;
        const password = req.body.senhaEmail;
        const cpf = req.session.usuario.cpf;
        let feedback = "";

        if(bcrypt.compareSync(password, req.session.usuario.senha)){
            await Participante.update({
                e_mail
            },
            {
                where:{
                    cpf
                }
            });
            feedback = "E-mail alterado com sucesso!";
        } else {
            feedback = "Senha incorreta!";
        }

        req.session.usuario.e_mail = e_mail;

        const eventos = await Evento.findAll();

        res.render("participante/inicio", {eventos, feedback});
    },

    editarSenha: async (req, res) => {
        const senhaAntiga = req.body.senhaAntiga;
        const senhaNova = req.body.senhaNova;
        const cpf = req.session.usuario.cpf;
        let feedback = "";

        if(bcrypt.compareSync(senhaAntiga, req.session.usuario.senha)){
            await Participante.update({
                senha: bcrypt.hashSync(senhaNova, 10)
            },
            {
                where:{
                    cpf
                }
            });
            feedback = "Senha alterado com sucesso!";
        } else {
            feedback = "Senha incorreta!";
        }

        req.session.usuario.senha = senhaNova;

        const eventos = await Evento.findAll();

        res.render("participante/inicio", {eventos, feedback});
    },

    apagarParticipante: async (req,res) => {

        const usuario = req.session.usuario;

        //apaga os ingressos do Participante
        await Ingresso.destroy({
			where:{
				cpf:usuario.cpf,
			}
        });

        //apaga o participante
        await Participante.destroy({
			where:{
				cpf:usuario.cpf,
			}
        });
        
        res.render("login");

    }

}