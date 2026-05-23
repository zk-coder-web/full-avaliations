const express = require('express');
const cors = require('cors');
const path = require('path');
const debug = require('./debug');

const {
    scrapeGoogleMapsBruto,
    listarEmpresas
} = require('./final');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

function termoObrigatorio(res, rota, mensagem) {
    debug.aviso('server', 'server.js', `${rota} recusado: termo vazio`);
    return res.status(400).json({ erro: mensagem });
}

function responderErroDoFluxo(res, rota, result) {
    debug.aviso('server', 'server.js', `${rota} finalizado com erro: ${result.erro}`);
    return res.status(500).json(result);
}

app.post('/api/listar', async (req, res) => {
    const rota = 'POST /api/listar';

    try {
        const { termo } = req.body;
        debug.fluxo('server', 'server.js', `${rota} recebido termo="${termo || ''}"`);

        if (!termo) {
            return termoObrigatorio(res, rota, 'Campo termo e obrigatorio');
        }

        debug.fluxo('server', 'server.js', `${rota} iniciando listagem de empresas`);
        const result = await listarEmpresas(termo);

        if (result && result.erro) {
            return responderErroDoFluxo(res, rota, result);
        }

        if (!Array.isArray(result) || result.length === 0) {
            debug.aviso('server', 'server.js', `${rota} sem empresas encontradas termo="${termo}"`);
            return res.status(404).json({ erro: 'Nenhuma empresa encontrada' });
        }

        debug.fluxo('server', 'server.js', `${rota} encontrou ${result.length} empresas termo="${termo}"`);
        return res.json(result);
    } catch (err) {
        debug.erro('server', 'server.js', err);
        return res.status(500).json({ erro: err.message });
    }
});

app.get('/api/listar', async (req, res) => {
    const rota = 'GET /api/listar';

    try {
        const termo = req.query.termo;
        debug.fluxo('server', 'server.js', `${rota} recebido termo="${termo || ''}"`);

        if (!termo) {
            return termoObrigatorio(res, rota, 'Parametro termo e obrigatorio');
        }

        debug.fluxo('server', 'server.js', `${rota} iniciando listagem de empresas`);
        const result = await listarEmpresas(termo);

        if (result && result.erro) {
            return responderErroDoFluxo(res, rota, result);
        }

        if (!Array.isArray(result) || result.length === 0) {
            debug.aviso('server', 'server.js', `${rota} sem empresas encontradas termo="${termo}"`);
            return res.status(404).json({ erro: 'Nenhuma empresa encontrada' });
        }

        debug.fluxo('server', 'server.js', `${rota} encontrou ${result.length} empresas termo="${termo}"`);
        return res.json(result);
    } catch (err) {
        debug.erro('server', 'server.js', err);
        return res.status(500).json({ erro: err.message });
    }
});

app.post('/api/scrape', async (req, res) => {
    const rota = 'POST /api/scrape';

    try {
        const { termo, indice } = req.body;
        debug.fluxo('server', 'server.js', `${rota} recebido termo="${termo || ''}" indice=${indice ?? 'null'}`);

        if (!termo) {
            return termoObrigatorio(res, rota, 'Campo termo e obrigatorio');
        }

        debug.fluxo('server', 'server.js', `${rota} iniciando extracao da empresa`);
        const result = await scrapeGoogleMapsBruto(termo, indice);

        if (result && result.erro) {
            return responderErroDoFluxo(res, rota, result);
        }

        debug.fluxo('server', 'server.js', `${rota} finalizado com sucesso termo="${termo}"`);
        return res.json(result);
    } catch (err) {
        debug.erro('server', 'server.js', err);
        return res.status(500).json({ erro: err.message });
    }
});

app.get('/api/scrape', async (req, res) => {
    const rota = 'GET /api/scrape';

    try {
        const termo = req.query.termo;
        debug.fluxo('server', 'server.js', `${rota} recebido termo="${termo || ''}"`);

        if (!termo) {
            return termoObrigatorio(res, rota, 'Parametro termo e obrigatorio');
        }

        debug.fluxo('server', 'server.js', `${rota} iniciando extracao da empresa`);
        const result = await scrapeGoogleMapsBruto(termo);

        if (result && result.erro) {
            return responderErroDoFluxo(res, rota, result);
        }

        debug.fluxo('server', 'server.js', `${rota} finalizado com sucesso termo="${termo}"`);
        return res.json(result);
    } catch (err) {
        debug.erro('server', 'server.js', err);
        return res.status(500).json({ erro: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'preview.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
    debug.fluxo('server', 'server.js', `Servidor rodando na porta ${PORT}`);
});
