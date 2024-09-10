import express from 'express';
import { connect, Schema, model } from 'mongoose';
import pkg from 'body-parser';
// import cors from 'cors';
// const pag = express()
// pag.use(cors())
// import axios from 'axios';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

app.use(json());

connect('mongodb+srv://Giovanna:megsnoop23@netflixai.muxslkg.mongodb.net/netflixaiDB?retryWrites=true&w=majority')
    .then(() => {
        console.log('Conectado ao MongoDB Atlas');
    })
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

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
        res.status(500).send('Erro ao salvar o histórico');
    }
});