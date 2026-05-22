async function extrairNumeroAvaliacoes(page) {
    return page.evaluate(() => {
        const seletores = [
            '.F7nice span[aria-label*="avalia"]',
            '.fontBodyMedium span[aria-label*="avalia"]',
            '.jANv6b'
        ];

        const elTotal = seletores.map((seletor) => document.querySelector(seletor)).find(Boolean);
        const totalRaw = elTotal?.ariaLabel || elTotal?.innerText || '';
        const apenasNumeros = totalRaw.replace(/\D/g, '');

        return apenasNumeros ? parseInt(apenasNumeros, 10) : null;
    });
}

module.exports = {
    extrairNumeroAvaliacoes
};
