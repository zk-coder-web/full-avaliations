const express = require('express');
const cors = require('cors');
const path = require('path');

const scrape = require('./final');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/scrape', async (req, res) => {
    try {
        const { termo } = req.body;
        if (!termo) return res.status(400).json({ erro: 'Campo termo é obrigatório' });
        const result = await scrape(termo);
        res.json(result);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// Também aceita GET para facilitar testes rápidos: /api/scrape?termo=...
app.get('/api/scrape', async (req, res) => {
    try {
        const termo = req.query.termo;
        if (!termo) return res.status(400).json({ erro: 'Parâmetro termo é obrigatório' });
        const result = await scrape(termo);
        res.json(result);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor rodando na rede local');
});