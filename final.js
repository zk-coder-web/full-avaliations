const readline = require('readline');
const debug = require('./debug');
const { iniciarBrowser, abrirBuscaMaps, fecharBrowser } = require('./inicio/browser');
const { capturarEmpresas } = require('./meio/capturarEmpresas');
const { selecionarEmpresa } = require('./meio/acoes');
const { extrairDados } = require('./fim/extracaodados');
const { limparDados } = require('./fim/limpeza');

async function scrapeGoogleMapsBruto(termo, indice = null) {
    debug.fluxo('inicio', 'final.js', 'iniciando extracao completa');

    let browser = null;

    try {
        const sessao = await iniciarBrowser({ headless: true });
        browser = sessao.browser;
        const { page } = sessao;

        await abrirBuscaMaps(page, termo);

        debug.fluxo('meio', 'final.js', 'executando acoes no navegador');
        await selecionarEmpresa(page, indice);

        debug.fluxo('fim', 'final.js', 'coletando dados extraidos');
        const dadosBrutos = await extrairDados(page);
        const resultado = limparDados(dadosBrutos);

        debug.resultado('RESULTADO FINAL', resultado);
        return resultado;
    } catch (error) {
        debug.erro('final', 'final.js', error);
        return { erro: error.message };
    } finally {
        await fecharBrowser(browser);
    }
}

async function listarEmpresas(termo) {
    debug.fluxo('inicio', 'final.js', 'iniciando listagem de empresas');

    let browser = null;

    try {
        const sessao = await iniciarBrowser({ headless: true });
        browser = sessao.browser;
        const { page } = sessao;

        await abrirBuscaMaps(page, termo);

        debug.fluxo('meio', 'final.js', 'capturando empresas para selecao');
        const empresas = await capturarEmpresas(page);

        debug.resultado('EMPRESAS ENCONTRADAS', empresas);
        return empresas;
    } catch (error) {
        debug.erro('meio', 'final.js', error);
        return { erro: error.message };
    } finally {
        await fecharBrowser(browser);
    }
}

function question(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(query, (ans) => {
            rl.close();
            resolve(ans);
        });
    });
}

async function scrapeGoogleMapsInterativo(termo) {
    const empresas = await listarEmpresas(termo);
    let indice = 0;

    if (Array.isArray(empresas) && empresas.length > 1) {
        empresas.forEach((empresa) => {
            console.log(`${empresa.id + 1}. ${empresa.nome} - ${empresa.endereco}`);
        });

        const resposta = await question('\nDigite o numero da empresa correta: ');
        indice = parseInt(resposta, 10) - 1;
    }

    return scrapeGoogleMapsBruto(termo, Number.isInteger(indice) ? indice : 0);
}

module.exports = {
    scrapeGoogleMapsBruto,
    scrapeGoogleMapsInterativo,
    listarEmpresas
};
