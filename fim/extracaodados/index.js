const debug = require('../../debug');
const { extrairNome } = require('./nome');
const { extrairFotoEmpresa } = require('./fotoEmpresa');
const { extrairNota } = require('./nota');
const { extrairNumeroAvaliacoes } = require('./numero');
const { extrairEndereco } = require('./endereco');
const { extrairTelefone } = require('./telefone');
const { extrairStatus } = require('./status');

async function extrairDados(page) {
    debug.fluxo('fim', 'fim/extracaodados/index.js', 'extraindo dados finais');

    const [
        estabelecimento,
        nota,
        totalAvaliacoes,
        endereco,
        telefone,
        status_empresa,
        foto_original,
        link_maps
    ] = await Promise.all([
        extrairNome(page),
        extrairNota(page),
        extrairNumeroAvaliacoes(page),
        extrairEndereco(page),
        extrairTelefone(page),
        extrairStatus(page),
        extrairFotoEmpresa(page),
        page.evaluate(() => window.location.href)
    ]);

    return {
        estabelecimento,
        nota,
        totalAvaliacoes,
        endereco,
        telefone,
        status_empresa,
        foto_original,
        link_maps
    };
}

module.exports = {
    extrairDados
};
