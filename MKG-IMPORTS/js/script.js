const formulario = document.getElementById("registration-form");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const campoCategoria = document.getElementById("categoria");
const campoTermos = document.getElementById("termos");
const botaoMostrarSenha = document.getElementById("toggle-password");
const alertaSucesso = document.getElementById("success-alert");
const detalhesSucesso = document.getElementById("success-details");

let temporizadorSucesso;

function mostrarErro(campo, idErro, mensagem) {
    const elementoErro = document.getElementById(idErro);

    campo.classList.add("is-invalid");
    campo.setAttribute("aria-invalid", "true");
    elementoErro.textContent = mensagem;
}

function limparErro(campo, idErro) {
    const elementoErro = document.getElementById(idErro);

    campo.classList.remove("is-invalid");
    campo.removeAttribute("aria-invalid");
    elementoErro.textContent = "";
}

function limparErrosFormulario() {
    limparErro(campoNome, "nome-error");
    limparErro(campoEmail, "email-error");
    limparErro(campoSenha, "senha-error");
    limparErro(campoCategoria, "categoria-error");

    campoTermos.classList.remove("is-invalid");
    campoTermos.removeAttribute("aria-invalid");
    document.getElementById("termos-error").classList.remove("show");
    document.getElementById("termos-error").textContent = "";
}

function validarFormulario() {
    limparErrosFormulario();

    let formularioValido = true;
    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();

    if (nome === "") {
        mostrarErro(campoNome, "nome-error", "Informe seu nome completo.");
        formularioValido = false;
    }

    if (email === "" || !campoEmail.checkValidity()) {
        mostrarErro(campoEmail, "email-error", "Informe um e-mail válido.");
        formularioValido = false;
    }

    if (campoSenha.value.length < 8) {
        mostrarErro(campoSenha, "senha-error", "A senha deve ter no mínimo 8 caracteres.");
        formularioValido = false;
    }

    if (campoCategoria.value === "") {
        mostrarErro(campoCategoria, "categoria-error", "Selecione uma categoria.");
        formularioValido = false;
    }

    if (!campoTermos.checked) {
        campoTermos.classList.add("is-invalid");
        campoTermos.setAttribute("aria-invalid", "true");
        const erroTermos = document.getElementById("termos-error");
        erroTermos.textContent = "É necessário aceitar os termos de uso e a política de privacidade.";
        erroTermos.classList.add("show");
        formularioValido = false;
    }

    return formularioValido;
}

function mostrarMensagemSucesso(cadastro) {
    window.clearTimeout(temporizadorSucesso);

    detalhesSucesso.textContent =
        "Nome: " + cadastro.nome + "\n" +
        "E-mail: " + cadastro.email + "\n" +
        "Categoria: " + cadastro.categoria;

    alertaSucesso.classList.remove("d-none");

    temporizadorSucesso = window.setTimeout(function () {
        alertaSucesso.classList.add("d-none");
        detalhesSucesso.textContent = "";
    }, 7000);
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    alertaSucesso.classList.add("d-none");

    if (!validarFormulario()) {
        const primeiroCampoInvalido = formulario.querySelector(".is-invalid");
        if (primeiroCampoInvalido) {
            primeiroCampoInvalido.focus();
        }
        return;
    }

    const cadastro = {
        nome: campoNome.value.trim(),
        email: campoEmail.value.trim(),
        senha: campoSenha.value,
        categoria: campoCategoria.value,
        termosAceitos: campoTermos.checked
    };

    mostrarMensagemSucesso(cadastro);

    formulario.reset();
    limparErrosFormulario();

    campoSenha.type = "password";
    botaoMostrarSenha.setAttribute("aria-label", "Mostrar senha");
    botaoMostrarSenha.setAttribute("aria-pressed", "false");
});

botaoMostrarSenha.addEventListener("click", function () {
    const estaOculta = campoSenha.type === "password";

    campoSenha.type = estaOculta ? "text" : "password";
    botaoMostrarSenha.setAttribute("aria-label", estaOculta ? "Ocultar senha" : "Mostrar senha");
    botaoMostrarSenha.setAttribute("aria-pressed", String(estaOculta));
});

const nomesErros = {
    nome: "nome-error",
    email: "email-error",
    senha: "senha-error",
    categoria: "categoria-error"
};

[campoNome, campoEmail, campoSenha, campoCategoria].forEach(function (campo) {
    function validarCampoAlterado() {
        if (!campo.classList.contains("is-invalid")) {
            return;
        }

        const campoEstaValido =
            (campo === campoNome && campo.value.trim() !== "") ||
            (campo === campoEmail && campo.value.trim() !== "" && campo.checkValidity()) ||
            (campo === campoSenha && campo.value.length >= 8) ||
            (campo === campoCategoria && campo.value !== "");

        if (campoEstaValido) {
            limparErro(campo, nomesErros[campo.id]);
        }
    }

    campo.addEventListener("input", validarCampoAlterado);
    campo.addEventListener("change", validarCampoAlterado);
});

campoTermos.addEventListener("change", function () {
    if (campoTermos.checked) {
        campoTermos.classList.remove("is-invalid");
        campoTermos.removeAttribute("aria-invalid");
        document.getElementById("termos-error").classList.remove("show");
        document.getElementById("termos-error").textContent = "";
    }
});
