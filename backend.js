PORT = 3000                                                    // Define a porta onde o servidor vai escutar as requisições

const express = require('express')                             // Framework para criar o servidor e gerenciar rotas
const cors = require('cors')                                   // Middleware para permitir requisições de outras origens (CORS)
const mongoose = require('mongoose')                           // Biblioteca para conectar e interagir com o MongoDB
const uniqueValidator = require('mongoose-unique-validator')   // Plugin para validar campos únicos no banco de dados
const bcrypt = require('bcrypt')                               // Biblioteca para criptografar senhas
const jwt = require('jsonwebtoken')                            // Biblioteca para criar e validar JSON Web Tokens para autenticação

const app = express()                                          // Cria uma instância do aplicativo Express

app.use(express.json())                                        // Permite o back-end processar dados em formato JSON recebidos em requisições
app.use(cors())                                                // Habilita o CORS, permitindo acesso ao back-end de outras origens (ex., outro domínio ou porta)


// Conecta ao MongoDB usando o Mongoose
async function conectarAoMongoDB() {
    await mongoose.connect(`mongodb+srv://cururu995:1234@cluster0.vlxky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);   // String de conexão para o MongoDB
}


// Define o modelo Filme com campos título e sinopse | Schema
const Filme = mongoose.model("Filme", mongoose.Schema({
    titulo: { type: String },
    sinopse: { type: String }
}));


// Define o modelo Usuario com campos login e senha | Schema
const usuarioSchema = mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
usuarioSchema.plugin(uniqueValidator);                      // Aplica um plugin para garantir unicidade do login
const Usuario = mongoose.model("Usuario", usuarioSchema);


// Rota GET /filmes que responde com a lista de todos os filmes no banco de dados
app.get("/filmes", async (req, res) => {
    const filmes = await Filme.find();                            // Usa o modelo Filme para buscar todos os registros na coleção de filmes
    res.json(filmes);                                             // Envia a lista de filmes como uma resposta JSON para o frontend
});


// Rota POST /filmes que permite ao frontend adicionar um novo filme ao banco de dados
app.post("/filmes", async (req, res) => {
    // Extrai os dados do título e sinopse enviados pelo frontend no corpo da requisição
    const titulo = req.body.titulo;
    const sinopse = req.body.sinopse;

    const filme = new Filme({ titulo: titulo, sinopse: sinopse }); // Cria uma nova instância do modelo Filme com o título e sinopse fornecidos
    await filme.save();                                            // Salva o novo filme no banco de dados

    const filmes = await Filme.find();                             // Após salvar, busca novamente todos os filmes no banco de dados para retornar a lista atualizada
    res.json(filmes);                                              // Envia a lista de filmes como resposta JSON para o frontend, incluindo o novo filme
});


// Endpoint para cadastrar novos usuários
app.post('/signup', async (req, res) => {
    try {
        const login = req.body.login;
        const password = req.body.password;
        
        const criptografada = await bcrypt.hash(password, 10);   // Criptografa a senha com bcrypt

        const usuario = new Usuario({                            // Cria uma nova instância do modelo Usuario
            login: login,
            password: criptografada
        });
        
        const respMongo = await usuario.save();                  // Salva o usuário no MongoDB
        console.log(respMongo);

        res.status(201).end();                                   // Responde com status 201 indicando sucesso
    } catch (error) {
        console.log(error);
        res.status(409).end();                                   // Responde com status 409 indicando conflito (usuário já existe)
    }
});


// Endpoint para autenticar usuários
app.post('/login', async (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    const u = await Usuario.findOne({ login: req.body.login });        // Busca o usuário pelo login
    if (!u) {
        return res.status(401).json({ mensagem: "login inválido" });   // Responde com erro se o login não existe
    }

    const senhaValida = await bcrypt.compare(password, u.password);    // Compara a senha fornecida com a senha armazenada
    if (!senhaValida) {
        return res.status(401).json({ mensagem: "senha inválida" });   // Responde com erro se a senha está incorreta
    }

    const token = jwt.sign(                                            // Gera um token JWT válido por 1 hora
        { login: login }, 
        "chave-secreta", 
        { expiresIn: "1h" }
    );
    res.status(200).json({ token: token });                            // Responde com o token de autenticação
});


// Inicia o servidor na porta definida | Função de calback: função que é executada sempre que um evento acontece
app.listen(PORT, () => {
    try {
        conectarAoMongoDB();             // Conecta ao MongoDB ao iniciar o servidor
        console.log("up and running");   // Confirma que o servidor está em execução
    } catch (e) {
        console.log('Erro', e);          // Exibe erro caso falhe ao conectar ao banco
    }
});

