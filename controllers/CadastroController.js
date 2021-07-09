const {Promotora, Participante, Entidade} = require("../models");
const bcrypt = require('bcrypt');

module.exports = {

    // Controller de acesso à página cadastro do participante
    cadastroParticipante: (req, res) => {
        let mensagemFeedback = "inicio"
        res.render("cadastroParticipante", {mensagemFeedback});
    },

    // Controller de acesso à página cadastro da promotora
    cadastroPromotora: (req, res) => {

        res.render("cadastroPromotora");

    },

    // Controller de cadastro do participante
    cadastroParticipanteForm: async (req, res) => {

        // Valores recuparados do Formulário
        const nome = req.body.nome;
        const cpf = req.body.cpf;
        const telefone = req.body.telefone;
        const cep = req.body.cep;
        const e_mail = req.body.email;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        const Staff = false;
        const Palestrante = false;
        const Ouvinte = true;
        const Organizador = false;
        const Ministrante_tutoria = false;
        const Instrutor = false;
        const Avaliador = false;
        const Autor_Artigo = false;
        let mensagemFeedback = "";
        
        if(await Participante.findOne({where:{cpf:cpf}}) != null){
            mensagemFeedback = "Já existe um usuário com o CPF informado."
        }
        
        if(await Participante.findOne({where:{e_mail:e_mail}}) != null){
            mensagemFeedback = "Já existe um usuário com o e-mail informado."
        }
        
        //criptografa a senha com bcrypt
        let senhaCriptografada = bcrypt.hashSync(password, 10);

        // Se não existem erros, cria um novo participante com os dados informados
        if(mensagemFeedback == ""){
            
            // Faz o cadastro do participante no banco de dados
            let novoParticipante = await Participante.create({
                cpf,
                nome,
                cep,
                e_mail,
                telefone,
                senha: senhaCriptografada,
                Staff,
                Palestrante,
                Ouvinte,
                Organizador,
                Ministrante_tutoria,
                Instrutor,
                Avaliador, 
                Autor_Artigo
            });
            
            mensagemFeedback = "Cadastro realizado com sucesso!"

            // redireciona a página de login
            res.render("login", {mensagemFeedback});

        //se existe algum erro
        }else{
            console.log("**************************")
            console.log(mensagemFeedback)
            res.render("cadastroParticipante", {mensagemFeedback});
        }

    },

    // Controller de cadastro da promotora
    cadastroPromotoraForm: async (req, res) => {

        // Valores recuparados do Formulário
        const cnpj = req.body.cnpj;
        const nome_entidade = req.body.nome;
        const end_estado = req.body.estado;
        const end_cidade = req.body.cidade;
        const end_cep = req.body.cep;
        const end_logradouro = req.body.logradouro;
        const end_numero = req.body.numero;
        const email = req.body.email;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        const PromotoraBanco = true;
        const Patrocinadora = false;
        const Organizadora = false;

        //criptografa a senha com bcrypt
        let senhaCriptografada = bcrypt.hashSync(password, 10);

        // compara se as senhas são iguais
        if(bcrypt.compareSync(confirmpassword, senhaCriptografada)){
            
            // Faz o cadastro da promotora no banco de dados
            await Entidade.create({
                cnpj,
                nome_entidade,
                end_estado,
                end_cidade,
                end_cep,
                senha: senhaCriptografada,
                end_logradouro,
                end_numero,
                email,
                Promotora:PromotoraBanco,
                Patrocinadora,
                Organizadora
            });

            await Promotora.create({
                cnpj
            });

            // redireciona a página de login
            res.redirect("/login");

        //se não são iguais, redireciona ao cadastro novamente
        }else{
            res.redirect("/cadastroPromotora");
        }

    }

}