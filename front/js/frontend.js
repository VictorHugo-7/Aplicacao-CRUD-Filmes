const baseURL = 'http://localhost:3000';

// Função assíncrona que obtém a lista de filmes do backend e exibe na página
async function obterFilmes() {
    const filmesEndpoint = '/filmes';                            // Define o endpoint da API para obter filmes
    const URLCompleta = baseURL + filmesEndpoint;                // Constrói a URL completa para o endpoint usando a baseURL

    const filmes = (await axios.get(URLCompleta)).data;          // Faz uma requisição GET ao backend usando Axios e espera a resposta com a lista de filmes

    let tabela = document.querySelector('.filmes');              // Seleciona a tabela na página onde os filmes serão exibidos
    let corpoTabela = tabela.getElementsByTagName('tbody')[0];   // Obtém o corpo da tabela (<tbody>) onde cada linha será adicionada

    for (let filme of filmes) {                                  // Itera sobre cada filme na lista obtida do backend
        let linha = corpoTabela.insertRow(0);                    // Cria uma nova linha na tabela para o filme atual

        let celulaTitulo = linha.insertCell(0);                  // Cria duas células na linha: uma para o título e outra para a sinopse
        let celulaSinopse = linha.insertCell(1);

        // Preenche as células com os dados do filme atual
        celulaTitulo.innerHTML = filme.titulo;                   // Exibe o título do filme
        celulaSinopse.innerHTML = filme.sinopse;                 // Exibe a sinopse do filme
    }
}
/* 
O Axios age como o “mensageiro” entre o frontend e o backend. 
No exemplo, a chamada axios.get(URLCompleta) do frontend envia uma solicitação HTTP GET ao backend. 
A URL /filmes mapeada no backend responde com a lista de filmes em JSON, e o Axios então entrega essa resposta ao frontend, que a processa e exibe na página. 
*/

// Função assíncrona que cadastra um novo filme no backend e atualiza a tabela na página
async function cadastrarFilme() {
    const filmesEndpoint = '/filmes';                                             // Define o endpoint da API para cadastrar filmes
    const URLCompleta = baseURL + filmesEndpoint;                                 // Constrói a URL completa para o endpoint usando a baseURL

    let tituloInput = document.querySelector('#tituloInput');                     // Seleciona os campos de entrada (input) onde o usuário insere o título e a sinopse do filme
    let sinopseInput = document.querySelector('#sinopseInput');
    let titulo = tituloInput.value;                                               // Obtém os valores inseridos nos campos de título e sinopse
    let sinopse = sinopseInput.value;

    if (titulo && sinopse) {                                                      // Verifica se ambos os campos foram preenchidos antes de enviar a requisição
        tituloInput.value = "";                                                   // Limpa os campos de entrada após obter os valores
        sinopseInput.value = "";

        const filmes = (await axios.post(URLCompleta, { titulo, sinopse })).data; // Faz uma requisição POST ao backend usando Axios para enviar os dados do novo filme

        let tabela = document.querySelector('.filmes');                           // Seleciona a tabela onde os filmes serão exibidos
        let corpoTabela = tabela.getElementsByTagName('tbody')[0];                // Acessa o corpo da tabela (<tbody>) para poder adicionar ou atualizar as linhas

        corpoTabela.innerHTML = "";                                               // Limpa o conteúdo atual do corpo da tabela para atualizar com os dados mais recentes

        for (let filme of filmes) {                                               // Itera sobre a lista de filmes retornada pelo backend (incluindo o novo filme)
            let linha = corpoTabela.insertRow(0);                                 // Cria uma nova linha para cada filme na tabela

            let celulaTitulo = linha.insertCell(0);                               // Cria duas células na linha: uma para o título e outra para a sinopse
            let celulaSinopse = linha.insertCell(1);

            // Preenche as células com os dados do filme atual
            celulaTitulo.innerHTML = filme.titulo;                                // Exibe o título do filme
            celulaSinopse.innerHTML = filme.sinopse;                              // Exibe a sinopse do filme
        }
        exibirAlerta('.alert-filme', 'Filme cadastrado com sucesso', ['show', 'alert-success'], ['d-none'], 2000);   // Chama a função para exibir uma mensagem de sucesso ao usuário
    } else {
        exibirAlerta('.alert-filme', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none'], 2000);        // Caso os campos estejam vazios, exibe uma mensagem de erro
    }
}


// Função assíncrona que cadastra um novo usuário no backend
async function cadastrarUsuario() {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput');
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput');
    let usuarioCadastro = usuarioCadastroInput.value;
    let passwordCadastro = passwordCadastroInput.value;

    if (usuarioCadastro && passwordCadastro) {                                                       // Verifica se os campos não estão vazios
        try {
            const cadastroEndpoint = '/signup';                                                      // Define o endpoint de cadastro
            const URLCompleta = baseURL + cadastroEndpoint;                                          // Constrói a URL completa
 
            await axios.post(URLCompleta, { login: usuarioCadastro, password: passwordCadastro });   // Faz uma requisição POST para cadastrar o usuário no backend

            usuarioCadastroInput.value = "";                                                         // Limpa o campo de usuário
            passwordCadastroInput.value = "";                                                        // Limpa o campo de senha

            exibirAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000);   // Exibe um alerta de sucesso ao usuário
            ocultarModal('#modalCadastro', 2000);                                                                                                    // Oculta o modal após o cadastro
        } catch (error) {
            exibirAlerta('.alert-modal-cadastro', 'Erro ao cadastrar usuário', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000);         // Exibe um alerta de erro se o cadastro falhar
            ocultarModal('#modalCadastro', 2000);
        }
    } else {
        exibirAlerta('.alert-modal-cadastro', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000);              // Alerta se o usuário não preencheu todos os campos
    }
}


// Função assíncrona que faz login do usuário no backend
const fazerLogin = async () => {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput');
    let passwordLoginInput = document.querySelector('#passwordLoginInput');

    let usuarioLogin = usuarioLoginInput.value;
    let passwordLogin = passwordLoginInput.value;

    if (usuarioLogin && passwordLogin) {                                                                        // Verifica se ambos os campos foram preenchidos
        try {
            const loginEndpoint = '/login';                                                                     // Define o endpoint de login
            const URLCompleta = baseURL + loginEndpoint;                                                        // Constrói a URL completa

            const response = await axios.post(URLCompleta, { login: usuarioLogin, password: passwordLogin });   // Faz uma requisição POST para autenticar o usuário no backend
            console.log(response.data);                                                                         // Exibe o token de autenticação no console

            usuarioLoginInput.value = "";                                                                       // Limpa o campo de usuário
            passwordLoginInput.value = "";                                                                      // Limpa o campo de senha

            exibirAlerta('.alert-modal-login', "Login efetuado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000);   // Exibe uma mensagem de sucesso e oculta o modal
            ocultarModal('#modalLogin', 2000);
            
            const loginLink = document.querySelector('#loginLink');                                                                           // Altera o texto do link de login para "Logout" e habilita o botão de cadastrar filme
            loginLink.innerHTML = "Logout";

            const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton');
            cadastrarFilmeButton.disabled = false;

        } catch (error) {
            exibirAlerta('.alert-modal-login', "Erro ao fazer login", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000);    // Exibe um alerta de erro em caso de falha no login
        }
    } else {
        exibirAlerta('.alert-modal-login', 'Preencha todos os campos', ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000);   // Alerta caso o usuário não tenha preenchido todos os campos
    }
};


// Alerta - Exibir
function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)   // Seleciona o elemento do alerta com base no seletor fornecido
    alert.innerHTML = innerHTML                   // Define o conteúdo HTML do alerta

    alert.classList.add(...classesToAdd)          // Adiciona as classes CSS fornecidas em classesToAdd ao alerta
    alert.classList.remove(...classesToRemove)    // Remove as classes CSS listadas em classesToRemove do alerta

    setTimeout(() => {                            // Define um temporizador para ocultar o alerta após um período
        alert.classList.remove('show')            // Remove a classe 'show' para ocultar o alerta                             | show..: Torna o elemento visível quando usado em certos componentes, como collapse ou modal.
        alert.classList.add('d-none')             // Adiciona a classe 'd-none' para garantir que o alerta desapareça da tela | d-none: Oculta o elemento (aplica display: none).
    }, timeout)                                   // Tempo (em milissegundos) até o alerta ser ocultado
}


// Modal - Ocultar
function ocultarModal(seletor, timeout) {
    setTimeout(() => {                                                             // Define um temporizador para aguardar antes de ocultar o modal
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))   // Obtém a instância do modal usando Bootstrap
        modal.hide()                                                               // Oculta o modal chamando o método 'hide' do Bootstrap
    }, timeout)                                                                    // Tempo (em milissegundos) antes de o modal ser ocultado
}




