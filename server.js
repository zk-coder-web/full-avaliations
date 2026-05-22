const express = require('express');
const cors = require('cors');
const path = require('path');

const {
    scrapeGoogleMapsBruto,
    listarEmpresas
} = require('./final');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/scrape', async (req, res) => {
    try {
        const { termo, indice } = req.body;

        if (!termo) {
            return res.status(400).json({
                erro: 'Campo termo é obrigatório'
            });
        }

        const result = await scrapeGoogleMapsBruto(termo, indice);

        res.json(result);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

app.post('/api/listar', async (req, res) => {
    try {
        const { termo } = req.body;

        if (!termo) {
            return res.status(400).json({
                erro: 'Campo termo é obrigatório'
            });
        }

        const result = await listarEmpresas(termo);

        res.json(result);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

app.get('/api/scrape', async (req, res) => {
    try {
        const termo = req.query.termo;

        if (!termo) {
            return res.status(400).json({
                erro: 'Parâmetro termo é obrigatório'
            });
        }

        const result = await scrapeGoogleMapsBruto(termo);

        res.json(result);

    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'preview.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
