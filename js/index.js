const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

app.use(express.json());

const uri = 'mongodb://Giovanna:megsnoop23@host:port/dbname';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Conexão com o MongoDB foi estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
    }
}

connectToMongoDB();

// app.post('/messages', async (req, res) => {
//     const { user, assistant } = req.body;
//     try {
//         const db = client.db('netflixai.Enviados');
//         const collection = db.collection('messages');
//         await collection.insertOne({ user, assistant });
//         res.status(200).send('Mensagem salva com sucesso');
//     } catch (error) {
//         console.error('Erro ao salvar mensagem:', error);
//         res.status(500).send('Erro ao salvar mensagem');
//     }
// });

// app.listen(port, () => {
//     console.log(`Servidor rodando em http://localhost:${port}`);
// });