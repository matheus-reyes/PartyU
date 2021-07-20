$('input#txt_consulta').quicksearch('div.card-busca');

let feedback = document.getElementById("feedbacks").value;
let mensagemFeedback = document.getElementById("mensagemFeedback");

function acessarClasseFeedback(){
    if(feedback != "inicio"){
        $('#modal-feedback').modal('show');
        mensagemFeedback.innerText = feedback;
    }
}

acessarClasseFeedback();