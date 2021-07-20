const {Entidade, Ingresso, Participante, Evento, Promotora} = require("../models");
const bcrypt = require("bcrypt");

module.exports = {

    inicio: async (req, res) => {
        let feedback = "inicio"
        //Pega os dados da promotora pela session
        const usuario = req.session.usuario;

        //Dados dos eventos da promotora
        const eventos = await Evento.findAll({
            where: {
                PRO_cnpj:usuario.cnpj
            }
		});
        res.render("promotora/inicio", {eventos, feedback});

    },

    eventosPromotora: async (req, res) => {
        let feedback = "inicio"
        //Pega os dados da promotora pela session
        const usuario = req.session.usuario;

        //Dados dos eventos da promotora
        const eventos = await Evento.findAll({
            where: {
                PRO_cnpj:usuario.cnpj
            }
		});

        res.render("promotora/inicio", {eventos, feedback});

    },

    criarEventoPromotora: (req, res) => {

        res.render("promotora/criarEvento");

    },

    cadastroEvento: async (req, res) => {
        let feedback = "Evento criado com sucesso!";
        const usuario = req.session.usuario;
        
        // Dados do formulário
        const nome = req.body.nome;
        const tema = req.body.tema;
        const edicao = req.body.edicao;
        const data_inicio = req.body.data_inicio;
        const data_fim = req.body.data_fim;
        const cnpj = '7755256000158';

        //Insere os dados na tabela Ingresso
        await Evento.create({
            nome,
            tema,
            edicao,
            data_inicio,
            data_fim,
            cnpj,
            PRO_cnpj: usuario.cnpj
        });

        //Dados dos eventos da promotora
        const eventos = await Evento.findAll({
            where: {
                PRO_cnpj:usuario.cnpj
            }
		});

        res.render("promotora/inicio", {eventos, feedback});

    },

    editarEvento: async (req, res) => {
        let feedback = "Evento editado com sucesso!";
        const usuario = req.session.usuario;

        // Dados do formulário
        const id_evento = req.body.id_eventoEditar;
        const nome = req.body.nome;
        const tema = req.body.tema;
        const edicao = req.body.edicao;
        const data_inicio = req.body.data_inicio;
        const data_fim = req.body.data_fim;

        //Faz a alteração do evento
        await Evento.update({
            nome,
            tema,
            edicao,
            data_inicio,
            data_fim
        },
        {
            where:{
                id_evento
            }
        });

        //Dados dos eventos da promotora
        const eventos = await Evento.findAll({
            where: {
                PRO_cnpj:usuario.cnpj
            }
		});

        res.render("promotora/inicio", {eventos, feedback});

    },


    apagarEvento: async (req, res) => {
        let feedback = "Evento apagado com sucesso!";
        const usuario = req.session.usuario;

        const id_evento = req.body.id_eventoApagar;

        //apaga os ingressos do Evento
        await Ingresso.destroy({
			where:{
				id_evento
			}
        });

        //apaga o evento
        await Evento.destroy({
			where:{
				id_evento,
			}
        });

        //Dados dos eventos da promotora
        const eventos = await Evento.findAll({
            where: {
                PRO_cnpj:usuario.cnpj
            }
		});

        res.render("promotora/inicio", {eventos, feedback});
    },

    editarNome: async (req, res) => {
        const nome_entidade = req.body.nome;
        //Pega os dados da promotora pela session
        const usuario = req.session.usuario;

        //Dados dos eventos da promotora
        const eventos = await Evento.findAll({
            where: {
                PRO_cnpj:usuario.cnpj
            }
        });

        await Entidade.update({
            nome_entidade
        },
        {
            where:{
                cnpj:usuario.cnpj
            }
        });

        let feedback = "Nome alterado com sucesso!";

        req.session.usuario.nome_entidade = nome_entidade;

        res.render("promotora/inicio", {eventos, feedback});

    },

    editarEmail: async (req, res) => {
        const email = req.body.email;
        const password = req.body.senhaEmail;
        const usuario = req.session.usuario;
        let feedback = "";

        //Dados dos eventos da promotora
        const eventos = await Evento.findAll({
            where: {
                PRO_cnpj:usuario.cnpj
            }
        });

        if(bcrypt.compareSync(password, req.session.usuario.senha)){
            await Entidade.update({
                email
            },
            {
                where:{
                    cnpj:usuario.cnpj
                }
            });
            feedback = "E-mail alterado com sucesso!";
        } else {
            feedback = "Senha incorreta!";
        }

        req.session.usuario.email = email;

        res.render("promotora/inicio", {eventos, feedback});
    },

    editarSenha: async (req, res) => {
        const senhaAntiga = req.body.senhaAntiga;
        const senhaNova = req.body.senhaNova;
        const usuario = req.session.usuario;
        let feedback = "";

        //Dados dos eventos da promotora
        const eventos = await Evento.findAll({
            where: {
                PRO_cnpj:usuario.cnpj
            }
        });

        if(bcrypt.compareSync(senhaAntiga, req.session.usuario.senha)){
            await Entidade.update({
                senha: bcrypt.hashSync(senhaNova, 10)
            },
            {
                where:{
                    cnpj:usuario.cnpj
                }
            });
            feedback = "Senha alterado com sucesso!";
        } else {
            feedback = "Senha incorreta!";
        }

        req.session.usuario.senha = senhaNova;

        res.render("promotora/inicio", {eventos, feedback});
    },

    apagarPromotora: async (req, res) => {

        const usuario = req.session.usuario;

        //apaga os eventos da promotora
        await Evento.destroy({
			where:{
				PRO_cnpj:usuario.cnpj
			}
        });

        //apaga a promotora
        await Promotora.destroy({
			where:{
				cnpj:usuario.cnpj
			}
        });

        //apaga a entidade
        await Entidade.destroy({
            where:{
                cnpj:usuario.cnpj
            }
        });

        res.render("login");

    }

}