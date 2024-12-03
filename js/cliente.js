import readline from 'readline';
import axios from 'axios';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const userId = 'unique_user_id';

async function getHistory() {
    try {
        const response = await axios.get(`http://localhost:3000/api/getHistory/${userId}`);
        return response.data;
    } catch (error) {
        console.log('Nenhum histórico encontrado. Iniciando uma nova conversa.');
        return [];
    }
}

async function saveMessage(message, sender) {
    try {
        await axios.post('http://localhost:3000/api/saveHistory', { userId, message, sender });
    } catch (error) {
        console.error('Erro ao salvar mensagem:', error.message);
    }
}

async function startChat() {
    const history = await getHistory();

    if (history.length > 0) {
        console.log('\nHistórico da conversa:');
        history.forEach(({ sender, text }) => {
            console.log(`${sender === 'user' ? 'Você' : 'Bot'}: ${text}`);
        });
    }

    console.log('\nIniciando o chat...');

    async function askQuestion() {
        rl.question('Você: ', async (userMessage) => {
            if (userMessage.toLowerCase() === 'sair') {
                console.log('Encerrando conversa.');
                rl.close();
                return;
            }

            await saveMessage(userMessage, 'user');

            // Simula a resposta do bot (pode ser substituído por chamada a um modelo de IA)
            const botMessage = `Resposta simulada para: "${userMessage}"`;
            console.log(`Bot: ${botMessage}`);
            await saveMessage(botMessage, 'bot');

            askQuestion();
        });
    }

    askQuestion();
}

startChat();
