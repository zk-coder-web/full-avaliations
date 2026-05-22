const debug = require('../debug');

function limparTexto(valor) {
    if (valor === null || valor === undefined) return null;

    return String(valor)
        .normalize('NFKC')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
        .replace(/[^\p{L}\p{N}\s.,:/()@+\-]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function limparNumero(valor) {
    if (typeof valor === 'number') return valor;

    const numero = parseInt(String(valor || '').replace(/\D/g, ''), 10);
    return Number.isNaN(numero) ? null : numero;
}

function limparUrl(valor) {
    if (!valor) return null;

    return String(valor)
        .normalize('NFKC')
        .replace(/[\u0000-\u001F\u007F-\u009F\s]/g, '')
        .trim();
}

function limparDados(dados) {
    debug.fluxo('fim', 'fim/limpeza.js', 'limpando dados estruturados');

    return {
        foto_original: limparUrl(dados.foto_original),
        estabelecimento: limparTexto(dados.estabelecimento),
        endereco: limparTexto(dados.endereco),
        telefone: limparTexto(dados.telefone),
        status_empresa: limparTexto(dados.status_empresa),
        nota: limparTexto(dados.nota),
        totalAvaliacoes: limparNumero(dados.totalAvaliacoes),
        link_maps: limparUrl(dados.link_maps)
    };
}

module.exports = {
    limparDados
};
