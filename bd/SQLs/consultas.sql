/*
Consulta 1
A organizadora está trabalhando na divulgação de um grande evento que ocorrerá no mês de maio do próximo ano. Para isso, já está fazendo levantamentos sobre qual é a melhor rede social que deve apostar em anúncios pagos e, assim, otimizar o retorno financeiro e o gasto com esse tipo de divulgação. Os responsáveis estão em busca das redes sociais utilizadas em evento(s) razoavelmente custosos (mais de R$5.000) e com notas emitidas no mês do abril, período em que a divulgação está mais forte. 
Nomes das redes sociais que promoveram eventos com custo superior a 5.000 reais e que tiveram notas emitidas no mês de abril.

Algebra Relacional:
Joins <- Rede_Social ⋈(Rede_Social.id_evento = Evento.id_evento) 
Evento ⋈(Evento.id_evento = Movimentacao_Financeira.id_evento) 
Movimentacao_Financeira ⋈(Movimentacao_Financeira.codigo_movimentacao = Nota_Fiscal.codigo_movimentacao) Nota_Fiscal 
Resposta <- π(nome σ(valor > 5000 AND data_emissao like '%-04-%'))(Joins)
*/
SELECT Rede_Social.nome FROM Rede_Social
INNER JOIN Evento ON Rede_Social.id_evento = Evento.id_evento 
INNER JOIN Movimentacao_Financeira ON Evento.id_evento = Movimentacao_Financeira.id_evento 
INNER JOIN Nota_Fiscal ON Movimentacao_Financeira.codigo_movimentacao = Nota_Fiscal.codigo_movimentacao
WHERE Nota_Fiscal.valor > 5.000 AND Nota_Fiscal.data_emissao like '%-04-%'


/*
Consulta 2
Para conferir se o empréstimo de equipamentos está correto, a organizadora está fazendo um levantamento de atividades que possuam mais 
de 10 participantes ouvintes. Isso se deve ao fato de que, a partir de 11 participantes, será necessário um microfone e um sistema de som 
para que nenhum ouvinte se sinta prejudicado e para que o indivíduo que esteja apresentando também não fique prejudicado por falar muito alto.

Liste as atividades que possuam  mais de 10 ouvintes inscritos. 

Algebra Relacional:
Joins <- atividade ⋈(atividade.codigo_atividade = INSCREVE.codigo_atividade) INSCREVE
Count <- codigo_atividade ℱ(CONTA cpf)(Joins)
Resposta <- π(nome, Count σ(Count > 10))(Joins)
*/
SELECT atividade.nome, COUNT(*) as participantes FROM atividade 
INNER JOIN INSCREVE ON atividade.codigo_atividade = INSCREVE.codigo_atividade
GROUP BY INSCREVE.codigo_atividade HAVING COUNT(*) > 10;


/*
Consulta 3
A empresa NOSSODINHEIRO está expandindo os negócios e abrirá uma filial no Nordeste, mais especificamente no Ceará. 
Para divulgar mais a empresa e atrair bons funcionários locais, a NOSSODINHEIRO está fazendo levantamento sobre eventos 
técnicos-científicos sediados no Nordeste para que possam atuar como patrocinadores. Além disso, a empresa também 
gostaria da informação sobre quais desses eventos possuem menos de 3 patrocinadores. 

Quais os nomes dos eventos que ocorrem presencialmente no Ceará e que possuem menos de 3 patrocinadores?

Algebra Relacional:
J <- evento ⋈(evento.id_evento = PATROCINA.id_evento) PATROCINA
Joins <- evento ⋈(evento.id_evento = FAZ_LOCACAO.id_evento) FAZ_LOCACAO ⋈(FAZ_LOCACAO.id_local = Local_presencial.id_local) Local_presencial 
Count <- id_evento ℱ(CONTA cnpj)(J)
Resposta <- π(id_evento, nome σ(Count < 3 AND end_estado like '%Ceará%'))(Joins)
*/
SELECT DISTINCT Evento.id_evento, Evento.nome from evento 
INNER JOIN FAZ_LOCACAO ON evento.id_evento = FAZ_LOCACAO.id_evento
INNER JOIN Local_presencial on FAZ_LOCACAO.id_local = Local_presencial.id_local
INNER JOIN PATROCINA on PATROCINA.id_evento = evento.id_evento
where Local_presencial.end_estado like '%Ceará%'
GROUP BY PATROCINA.id_evento HAVING COUNT(*)<3;


/*
Consulta 4
Um dos participantes do evento foi inscrito de maneira incorreta no banco de dados, pois ele deveria ser apenas um ministrante_tutoria, mas foi 
inscrito também como palestrante. O problema, é que não se sabe quem era esse participante, apenas sabe-se que o seu sobrenome é “Pereira”. 
Então é necessário saber qual participante é um ministrante_tutoria, tem sobrenome “Pereira” e é também um palestrante, a fim de resolver essa 
incoerência no banco de dados.

Qual o nome completo e o cpf do participante que é um ministrante_tutoria, possui “Pereira” no seu nome e é também um palestrante?

Algebra Relacional:
J <- participante ⋈(participante.cpf = ministrante_tutoria.cpf) ministrante_tutoria 
Joins <- J ⋈(J.cpf = palestrante.cpf) palestrante
Resposta <- π(nome σ(nome like '%Pereira%'))(Joins)
*/
SELECT ministrante.nome, ministrante.cpf from participante as ministrante
INNER JOIN ministrante_tutoria on ministrante.cpf = ministrante_tutoria.cpf
INNER JOIN palestrante on palestrante.cpf = ministrante.cpf
WHERE nome like '%Pereira%';


