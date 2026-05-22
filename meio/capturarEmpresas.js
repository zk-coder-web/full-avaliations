const debug = require('../debug');

async function capturarEmpresas(page) {
    debug.fluxo('meio', 'meio/capturarEmpresas.js', 'capturando empresas da lista');

    const empresas = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.hfpxzc'));

        return cards.map((card, i) => {
            const pai = card.closest('.nv2yud') || card.parentElement;
            const linhas = (pai?.innerText || '')
                .split('\n')
                .map((texto) => texto.trim())
                .filter((texto) => texto.length > 5);

            return {
                id: i,
                nome: card.ariaLabel || `Empresa ${i + 1}`,
                endereco: linhas.slice(1, 3).join(' | ')
            };
        });
    });

    debug.fluxo('meio', 'meio/capturarEmpresas.js', `${empresas.length} empresas encontradas`);
    return empresas;
}

module.exports = {
    capturarEmpresas
};
