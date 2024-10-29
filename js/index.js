import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connect, Schema, model } from 'mongoose';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const uri = "mongodb+srv://Giovanna:megsnoop23@cluster0.iuxuair.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
connect(uri)
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const chatSchema = new Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    ip: String,
    city: String,
    state: String,
    country: String 
});
const ChatHistory = model('ChatHistory', chatSchema);

app.get('/api/userInfo', async (req, res) => {
    try {
        const userIp = req.headers['x-forwarded-for'] || req.remoteAddress;
        const geoResponse = await axios.get(`https://ipinfo.io/${userIp}/json?token=97ca822c411899`);
        const { city, region: state, country } = geoResponse.data; 

        res.status(200).json({
            ip: userIp,
            city: city || 'Desconhecido',
            state: state || 'Desconhecido',
            country: country || 'Desconhecido' 
        });
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        res.status(500).send('Erro ao obter informações do usuário');
    }
});

app.get('/ ', async (req, res) => {
    res.status(200).send('Enviado com sucesso');
});


app.post('/api/saveChatHistory', async (req, res) => {
    try {
        console.log('Dados recebidos no corpo da requisição:', req.body);
        const { user, message, userInfo } = req.body; 
        if (!user || !message) {
            return res.status(400).send('User and message are required');
        }

        const chatEntry = new ChatHistory({
            user,
            message,
            ip: userInfo.ip,
            city: userInfo.city,
            state: userInfo.state,
            country: userInfo.country 
        });
        await chatEntry.save();

        res.status(200).send('Histórico salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar o histórico:', error);
        res.status(500).send('Erro ao salvar o histórico');
    }
});

app.get('/api/chatHistory', async (req, res) => {
    try {
        const chatHistories = await ChatHistory.find({}, 'user message timestamp ip city state country') 
            .sort({ timestamp: -1 }); 
        res.json(chatHistories);
    } catch (error) {
        console.error('Erro ao recuperar o histórico:', error);
        res.status(500).send('Erro ao recuperar o histórico');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
