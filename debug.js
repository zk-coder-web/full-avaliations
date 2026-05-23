function agora() {
    return new Date().toLocaleTimeString('pt-BR', { hour12: false });
}

function fluxo(etapa, arquivo, mensagem = '') {
    const texto = mensagem ? ` - ${mensagem}` : '';
    console.log(`[${agora()}] fluxo ${etapa}: ${arquivo}${texto}`);
}

function erro(etapa, arquivo, error) {
    console.error(`[${agora()}] erro ${etapa}: ${arquivo} - ${error.message}`);
}

function aviso(etapa, arquivo, mensagem = '') {
    console.warn(`[${agora()}] aviso ${etapa}: ${arquivo} - ${mensagem}`);
}

function resultado(titulo, dados) {
    console.log('\n====================================');
    console.log(titulo);
    console.log('====================================');
    console.log(JSON.stringify(dados, null, 2));
    console.log('====================================\n');
}

module.exports = {
    fluxo,
    erro,
    aviso,
    resultado
};
