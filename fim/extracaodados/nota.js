async function extrairNota(page) {
    return page.evaluate(() => {
        const seletores = [
            '.fontDisplayLarge',
            '.F7nice span[aria-hidden="true"]',
            '[aria-label*="estrelas"]'
        ];

        const elNota = seletores.map((seletor) => document.querySelector(seletor)).find(Boolean);
        return elNota?.innerText || elNota?.ariaLabel?.split(' ')[0] || 'S/N';
    });
}

module.exports = {
    extrairNota
};
