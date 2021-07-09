let feedback = document.getElementById("feedback").value;
let mensagemFeedback = document.getElementById("mensagemFeedback");

function exibirFeedback(){
    if(feedback != "inicio"){
        $('#modal-feedback').modal('show');
        mensagemFeedback.innerText = feedback;
    }
}

exibirFeedback();