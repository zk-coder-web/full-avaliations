const debug = require('../debug');

async function painelEstaAberto(page) {
    return page.isVisible('h1.DUwDvf').catch(() => false);
}

async function selecionarEmpresa(page, indice = null) {
    debug.fluxo('meio', 'meio/acoes.js', `selecionando empresa indice=${indice ?? 'primeira'}`);

    const isPainelDireto = await painelEstaAberto(page);
    const primeiroResultado = await page.$('.hfpxzc');

    if (indice !== null && !isPainelDireto) {
        const seletorAlvo = `.hfpxzc >> nth=${indice}`;
        await page.locator(seletorAlvo).scrollIntoViewIfNeeded();
        await page.click(seletorAlvo);
        await page.waitForSelector('h1.DUwDvf', { timeout: 20000 });
        return;
    }

    if (primeiroResultado && !isPainelDireto) {
        await primeiroResultado.click();
        await page.waitForSelector('h1.DUwDvf', { timeout: 8000 }).catch(() => {
            debug.fluxo('meio', 'meio/acoes.js', 'painel demorou, seguindo com extracao forcada');
        });
        return;
    }

    if (isPainelDireto) {
        const btnPesquisar = await page.$('button#searchbox-searchbutton, button[aria-label="Pesquisar"]');
        if (btnPesquisar) await btnPesquisar.click();
    }
}

async function abrirAvaliacoes(page) {
    debug.fluxo('meio', 'meio/acoes.js', 'abrindo avaliacoes');

    await page.waitForTimeout(5000);
    const btnAvaliacoes = await page.$('button[aria-label*="Avalia"], button[aria-label*="Avaliações"], .F7nice');

    if (btnAvaliacoes) {
        await btnAvaliacoes.click().catch(() => {
            debug.fluxo('meio', 'meio/acoes.js', 'nao foi possivel clicar nas avaliacoes');
        });
    }

    await page.waitForTimeout(2000);
}

module.exports = {
    selecionarEmpresa,
    abrirAvaliacoes
};
