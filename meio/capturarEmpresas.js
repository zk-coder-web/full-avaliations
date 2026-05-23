const debug = require('../debug');
const path = require('path');

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

    if (empresas.length === 0) {
        const screenshotPath = path.join(__dirname, '..', 'public', 'screen.png');

        try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
            debug.aviso('meio', 'meio/capturarEmpresas.js', `nenhuma empresa encontrada; screenshot salvo em ${screenshotPath}`);
        } catch (error) {
            debug.erro('meio', 'meio/capturarEmpresas.js', error);
        }
    }

    return empresas;
}

module.exports = {
    capturarEmpresas
};
