// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// const uri = "mongodb+srv://Giovanna:megsnoop23@cluster0.iuxuair.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
// connect(uri)
//     .then(() => console.log('Conectado ao MongoDB Atlas'))
//     .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// const chatSchema = new Schema({
//     user: String,
//     message: String,
//     timestamp: { type: Date, default: Date.now },
//     ip: String,
//     city: String,
//     state: String,
//     country: String 
// });
// const ChatHistory = model('ChatHistory', chatSchema);

// app.get('/api/userInfo', async (req, res) => {
//     try {
//         const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '8.8.8.8'; // IP fixo para teste
//         console.log(`IP detectado: ${userIp}`);

//         const geoResponse = await axios.get(`https://ipinfo.io/${userIp}/json?token=97ca822c411899`);
//         const { city, region: state, country } = geoResponse.data;

//         res.status(200).json({
//             ip: userIp,
//             city: city || 'Desconhecido',
//             state: state || 'Desconhecido',
//             country: country || 'Desconhecido'
//         });
//     } catch (error) {
//         console.error('Erro ao obter informações do usuário:', error.response?.data || error.message);
//         res.status(500).send('Erro ao obter informações do usuário');
//     }
// });


// app.get('/', async (req, res) => {
//         res.status(200).send('Enviado com sucesso');
// });



// app.post('/api/saveChatHistory', async (req, res) => {
//     try {
//         console.log('Dados recebidos:', req.body);

//         const { user, message, userInfo } = req.body;

//         if (!user || !message) {
//             return res.status(400).send('Os campos "user" e "message" são obrigatórios.');
//         }

//         const { ip = 'N/A', city = 'N/A', state = 'N/A', country = 'N/A' } = userInfo || {};

//         const chatEntry = new ChatHistory({
//             user,
//             message,
//             ip,
//             city,
//             state,
//             country
//         });

//         await chatEntry.save();
//         res.status(200).send('Histórico salvo com sucesso!');
//     } catch (error) {
//         console.error('Erro ao salvar o histórico:', error);
//         res.status(500).send('Erro ao salvar o histórico');
//     }
// });


// // Endpoint para recuperar o histórico de chat
// app.get('/api/chatHistory', async (req, res) => {
//     try {
//         const chatHistories = await ChatHistory.find({}, 'user message timestamp ip city state country') // Retornar todos os campos desejados
//             .sort({ timestamp: -1 }); // Ordenar do mais recente para o mais antigo
//         res.json(chatHistories);
//         // chatHistories.forEach(history => {
//         //     const formattedTimestamp = new Date(history.timestamp).toLocaleString();
//         //     console.log(`Mensagem enviada em: ${formattedTimestamp}`);
//         //   });
//     } catch (error) {
//         console.error('Erro ao recuperar o histórico:', error);
//         res.status(500).send('Erro ao recuperar o histórico');
//     }

// });

// // Iniciar o servidor
// app.listen(port, () => {
//     console.log(`Servidor rodando na porta ${port}`);
// });
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import axios from 'axios';

const app = express();
const port = 3000;

// Configuração de CORS
app.use(cors({
    origin: '*', // Permite requisições de qualquer origem. Ajuste conforme necessidade.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configuração de body-parser para lidar com JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://Giovanna:megsnoop23@cluster0.iuxuair.mongodb.net/chatbot?retryWrites=true&w=majority')
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Definição do esquema e modelo do MongoDB
const chatSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    messages: [
        {
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        }
    ]
});

const ChatHistory = mongoose.model('ChatHistory', chatSchema);

// Função para obter o IP do usuário, considerando o ambiente local
const getUserIp = (req) => {
    let userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (userIp === '::1') {
        userIp = '127.0.0.1'; // Para ambiente local, converte o IP IPv6 ::1 para IPv4
    }
    return userIp;
};

// Endpoint para salvar histórico de chat
app.post('/api/saveHistory', async (req, res) => {
    try {
        const { userId, message } = req.body;

        // Log para ver os dados recebidos
        console.log('Dados recebidos:', req.body);

        // Validação de entrada
        // if (!message || !userId) {
        //     return res.status(400).send('Campos obrigatórios: userId, message');
        // }

        // Obtém o IP do usuário
        const userIp = getUserIp(req);

        // Obtém informações de geolocalização do IP
        let geoInfo = { city: 'Desconhecido', state: 'Desconhecido', country: 'Desconhecido' };
        try {
            const response = await axios.get(`https://ipinfo.io/${userIp}/json?token=97ca822c411899`);
            geoInfo = response.data || geoInfo;
        } catch (error) {
            console.error('Erro ao obter informações de IP:', error);
        }

        // Verifica se o usuário já tem um histórico
        let chat = await ChatHistory.findOne({ userId });
        if (!chat) {
            chat = new ChatHistory({ userId, messages: [] });
        }

        // Adiciona a mensagem ao histórico
        chat.messages.push({ text: message });
        await chat.save();

        res.status(200).send('Histórico salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar o histórico:', error);
        res.status(500).send('Erro ao salvar o histórico');
    }
});


// Endpoint para recuperar o histórico de chat
app.get('/api/getHistory/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verifica se o userId foi fornecido
        if (!userId) {
            return res.status(400).send('userId é obrigatório');
        }

        // Recupera o histórico de chat do usuário
        const chat = await ChatHistory.findOne({ userId });
        if (!chat) {
            return res.status(404).send('Histórico não encontrado');
        }

        res.status(200).json(chat.messages);
    } catch (error) {
        console.error('Erro ao recuperar o histórico:', error);
        res.status(500).send('Erro ao recuperar o histórico');
    }
});
// Endpoint para obter informações de geolocalização do usuário
app.get('/api/userInfo', async (req, res) => {
    try {
        
        const userIp = getUserIp(req); // Obtém o IP do usuário
        console.log(`IP detectado: ${userIp}`);

        // Simula uma resposta de geolocalização ou usa a API real
        const geoResponse = await axios.get(`https://ipinfo.io/${userIp}/json?token=97ca822c411899`);
        const { city, region: state, country } = geoResponse.data;
        let geoInfo = { city: 'Desconhecido', state: 'Desconhecido', country: 'Desconhecido' };

axios.get(`https://ipinfo.io/${userIp}/json?token=97ca822c411899`)
    .then(response => {
        geoInfo = response.data || geoInfo;  // Atribui os dados obtidos da API ao geoInfo
    })
    .catch(error => {
        console.error('Erro ao obter informações de IP:', error);
        // Em caso de erro, geoInfo ficará com o valor padrão 'Desconhecido'
    });

        res.status(200).json({
            ip: userIp,
            city: city || 'Desconhecido',
            state: state || 'Desconhecido',
            country: country || 'Desconhecido'
        });
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error.message);
        res.status(500).send('Erro ao obter informações do usuário');
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
