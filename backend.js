PORT = 3000
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(cors())


// Conecta ao MongoDB usando o Mongoose
async function conectarAoMongoDB() {
    await mongoose.connect(`mongodb+srv://cururu995:1234@cluster0.vlxky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);   
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
usuarioSchema.plugin(uniqueValidator);                     
const Usuario = mongoose.model("Usuario", usuarioSchema);


// Rota GET /filmes que responde com a lista de todos os filmes no banco de dados
app.get("/filmes", async (req, res) => {
    const filmes = await Filme.find();
    res.json(filmes);
});


// Rota POST /filmes que permite ao frontend adicionar um novo filme ao banco de dados
app.post("/filmes", async (req, res) => {
    const titulo = req.body.titulo;
    const sinopse = req.body.sinopse;

    const filme = new Filme({ titulo: titulo, sinopse: sinopse });
    await filme.save();

    const filmes = await Filme.find();
    res.json(filmes);
});


// Endpoint para cadastrar novos usuários
app.post('/signup', async (req, res) => {
    try {
        const login = req.body.login;
        const password = req.body.password;
        
        const criptografada = await bcrypt.hash(password, 10);   

        const usuario = new Usuario({                            
            login: login,
            password: criptografada
        });
        
        const respMongo = await usuario.save();                  
        console.log(respMongo);

        res.status(201).end();                                  
    } catch (error) {
        console.log(error);
        res.status(409).end();                                   
    }
});


// Endpoint para autenticar usuários
app.post('/login', async (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    const u = await Usuario.findOne({ login: req.body.login });
    if (!u) {
        return res.status(401).json({ mensagem: "login inválido" });
    }

    const senhaValida = await bcrypt.compare(password, u.password);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: "senha inválida" });
    }

    const token = jwt.sign(
        { login: login }, 
        "chave-secreta", 
        { expiresIn: "1h" }
    );
    res.status(200).json({ token: token });
});


// Inciciar Servidro
app.listen(PORT, () => {
    try {
        conectarAoMongoDB();             
        console.log(`Servidor rodando na porta ${PORT}`);   
    } catch (e) {
        console.log('Erro', e);          
    }
});

