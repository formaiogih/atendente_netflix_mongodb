import express from 'express';
import { connect, Schema, model } from 'mongoose';
import pkg from 'body-parser';

const { json } = pkg;

const app = express();
const port = process.env.PORT || 3000;

app.use(json());

// import cors from 'cors'; 

// app.use(cors({
// origin: 'http://localhost:8080'
// }));


// Conectando ao MongoDB Atlas
connect('mongodb+srv://Giovanna:megsnoop23@netflixai.muxslkg.mongodb.net/netflixaiDB?retryWrites=true&w=majority&appName=Netflixai')
    .then(() => {
        console.log('Conectado ao MongoDB Atlas');

        // Teste de inserção simples para verificar a conectividade
        ChatHistory.create({ user: 'TestUser', message: 'TestMessage' })
            .then(() => console.log('Teste de inserção bem-sucedido'))
            .catch(err => console.error('Erro na inserção de teste:', err));
    })
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definindo o esquema e o modelo para histórico de chat
const chatSchema = new Schema({
    user: String,
    message: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatHistory = model('ChatHistory', chatSchema);

// Endpoint para salvar o histórico de chat
app.post('/api/saveChatHistory', async (req, res) => {
    try {
        const { user, message } = req.body;

        const chatEntry = new ChatHistory({
            user,
            message
        });

        await chatEntry.save();

        res.status(200).send('Histórico salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar o histórico:', error);
        res.status(500).send('Erro ao salvar o histórico:', error);
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Função para salvar o histórico de chat via requisição fetch
async function saveChatHistory(user, message) {
    try {
        const response = await fetch('http://localhost:3000/api/saveChatHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, message })
        });

        if (response.ok) {
            console.log('Histórico salvo com sucesso');
        } else {
            console.error('Falha ao salvar o histórico');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}
