const baseURL = 'http://localhost:3000';



// FUNÇÃO - Obter Filmes | Função assíncrona que obtém a lista de filmes do backend e exibe na página
async function obterFilmes() {
    const filmesEndpoint = '/filmes';
    const URLCompleta = baseURL + filmesEndpoint;
    const filmes = (await axios.get(URLCompleta)).data;

    let tabela = document.querySelector('.filmes');
    let corpoTabela = tabela.getElementsByTagName('tbody')[0];

    for (let filme of filmes) {
        let linha = corpoTabela.insertRow(0);
        let celulaTitulo = linha.insertCell(0);
        let celulaSinopse = linha.insertCell(1);
        
        celulaTitulo.innerHTML = filme.titulo;
        celulaSinopse.innerHTML = filme.sinopse;
    }
}

// FUNÇÃO - Cadastrar Filmes | Função assíncrona que cadastra um novo filme no backend e atualiza a tabela na página
async function cadastrarFilme() {
    const filmesEndpoint = '/filmes';
    const URLCompleta = baseURL + filmesEndpoint;

    let tituloInput = document.querySelector('#tituloInput');
    let sinopseInput = document.querySelector('#sinopseInput');
    let titulo = tituloInput.value;
    let sinopse = sinopseInput.value;

    if (titulo && sinopse) {
        tituloInput.value = "";
        sinopseInput.value = "";

        const filmes = (await axios.post(URLCompleta, { titulo, sinopse })).data;

        let tabela = document.querySelector('.filmes');
        let corpoTabela = tabela.getElementsByTagName('tbody')[0];

        corpoTabela.innerHTML = "";

        for (let filme of filmes) {
            let linha = corpoTabela.insertRow(0);
            let celulaTitulo = linha.insertCell(0);
            let celulaSinopse = linha.insertCell(1);

            celulaTitulo.innerHTML = filme.titulo;
            celulaSinopse.innerHTML = filme.sinopse;
        }
        exibirAlerta('.alert-filme', 'Filme cadastrado com sucesso', ['show', 'alert-success'], ['d-none'], 2000);
    } else {
        exibirAlerta('.alert-filme', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none'], 2000);
    }
}



// FUNÇÃO - Cadastrar Usuários |Função assíncrona que cadastra um novo usuário no backend
async function cadastrarUsuario() {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput');
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput');
    let usuarioCadastro = usuarioCadastroInput.value;
    let passwordCadastro = passwordCadastroInput.value;

    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroEndpoint = '/signup';
            const URLCompleta = baseURL + cadastroEndpoint;

            await axios.post(URLCompleta, { login: usuarioCadastro, password: passwordCadastro });

            usuarioCadastroInput.value = "";
            passwordCadastroInput.value = "";

            exibirAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000);
            ocultarModal('#modalCadastro', 2000);
        } catch (error) {
            exibirAlerta('.alert-modal-cadastro', 'Erro ao cadastrar usuário', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000);
            ocultarModal('#modalCadastro', 2000);
        }
    } else {
        exibirAlerta('.alert-modal-cadastro', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000);
    }
}

// FUNÇÃO - Fazer Login | Função assíncrona que faz login do usuário no backend
const fazerLogin = async () => {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput');
    let passwordLoginInput = document.querySelector('#passwordLoginInput');

    let usuarioLogin = usuarioLoginInput.value;
    let passwordLogin = passwordLoginInput.value;

    if (usuarioLogin && passwordLogin) {
        try {
            const loginEndpoint = '/login';
            const URLCompleta = baseURL + loginEndpoint;

            const response = await axios.post(URLCompleta, { login: usuarioLogin, password: passwordLogin });
            console.log(response.data);

            usuarioLoginInput.value = "";
            passwordLoginInput.value = "";

            exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000);
            ocultarModal('#modalLogin', 2000);
            
            const loginLink = document.querySelector('#loginLink');
            loginLink.innerHTML = "Logout";

            const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton');
            cadastrarFilmeButton.disabled = false;

        } catch (error) {
            exibirAlerta('.alert-modal-login', "Erro ao fazer login", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000);
        }
    } else {
        exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000);
    }
};



// Alerta - Exibir
function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)   
    alert.innerHTML = innerHTML                   

    alert.classList.add(...classesToAdd)          
    alert.classList.remove(...classesToRemove)    

    setTimeout(() => {                            
        alert.classList.remove('show')            
        alert.classList.add('d-none')             
    }, timeout)                                   
}

// Modal - Ocultar
function ocultarModal(seletor, timeout) {
    setTimeout(() => {                                                             
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))   
        modal.hide()                                                               
    }, timeout)                                                                    
}


