const { firefox } = require('playwright');
const debug = require('../debug');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36';

async function iniciarBrowser({ headless = false } = {}) {
    debug.fluxo('inicio', 'inicio/browser.js', `iniciando browser headless=${headless}`);

    const browser = await firefox.launch({ headless });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
        'User-Agent': USER_AGENT
    });

    return { browser, page };
}

async function abrirBuscaMaps(page, termo) {
    debug.fluxo('inicio', 'inicio/browser.js', `abrindo Google Maps para "${termo}"`);

    const url = `https://www.google.com/maps/search/${encodeURIComponent(termo)}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
}

async function fecharBrowser(browser) {
    if (!browser) return;

    debug.fluxo('inicio', 'inicio/browser.js', 'fechando browser');
    await browser.close();
}

module.exports = {
    iniciarBrowser,
    abrirBuscaMaps,
    fecharBrowser
};
