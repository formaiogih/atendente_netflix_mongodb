import express from 'express';
import { connect, Schema, model } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
// const pag = express()
// pag.use(cors())
// import axios from 'axios';
// import mongoose from 'mongoose';

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());
// app.use(json());
// const uri = 'mongodb+srv://Giovanna:megsnoop23@netflixai.muxslkg.mongodb.net/netflixaiDB?retryWrites=true&w=majority'
const uri = "mongodb+srv://Giovanna:megsnoop23@cluster0.iuxuair.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

connect(uri)
    .then(() => {
        console.log('Conectado ao MongoDB Atlas');
    })
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

    console.log ("COnectado na porta:" +port);
const chatSchema = new Schema({
    user: String,
    message: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatHistory = model('ChatHistory', chatSchema);
app.get('/api/saveChatHistory', async (req, res) => {});
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


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });

// import express from 'express';
// import { connect, Schema, model } from 'mongoose';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import mongoose from 'mongoose';

// const app = express();
// const port = 3000;

// const uri = "mongodb+srv://Giovanna:megsnoop23@cluster0.iuxuair.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//  connect(uri)
//      .then(() => {
//          console.log('Conectado ao MongoDB Atlas');
//      })
//      .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// // Esquemas
// const conversationSchema = new mongoose.Schema({
//   userId: String,
//   message: String,
//   timestamp: { type: Date, default: Date.now }
// });

// const loginSchema = new mongoose.Schema({
//   userId: String,
//   ip: String,
//   timestamp: { type: Date, default: Date.now }
// });

// const Conversation = mongoose.model('Conversation', conversationSchema);
// const Login = mongoose.model('Login', loginSchema);

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Endpoints
// app.post('/api/conectar', async (req, res) => {
//   const { userId } = req.body;
//   // Lógica para conectar o usuário (por exemplo, criar um novo usuário ou verificar se já existe)
//   res.json({ message: 'Usuário conectado' });
// });

// app.post('/api/logAcesso', async (req, res) => {
//   const { userId, ip } = req.body;
//   const newLogin = new Login({ userId, ip });
//   await newLogin.save();
//   res.json({ message: 'Acesso registrado' });
// });

// app.post('/api/logConversa', async (req, res) => {
//   const { userId, message } = req.body;
//   const newConversation = new Conversation({ userId, message });
//   await newConversation.save();
//   res.json({ message: 'Mensagem salva' });
// });


// // const chatSchema = new Schema({
// //         user: String,
// //         message: String,
// //         timestamp: {
// //             type: Date,
// //             default: Date.now
// //         }
// //     });

// // const ChatHistory = model('ChatHistory', chatSchema);

// app.get('/api/saveChatHistory', async (req, res) => {});

// app.post('/api/saveChatHistory', async (req, res) => {
//     try {
//         const { user, message } = req.body;

//         const chatEntry = new ChatHistory({
//             user,
//             message
//         });

//         await chatEntry.save();

//         res.status(200).send('Histórico salvo com sucesso!');
//     } catch (error) {
//         console.error('Erro ao salvar o histórico:', error);
//         res.status(500).send('Erro ao salvar o histórico');
//     }
// });

// app.listen(port, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });
