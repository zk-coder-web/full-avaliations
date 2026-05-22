async function extrairTelefone(page) {
    return page.evaluate(() => {
        const limparTexto = (texto) => texto ? texto.replace(/[^\S\r\n]+/g, ' ').trim().replace(/\n/g, ' ') : null;
        const seletores = [
            'button[data-item-id^="phone"]',
            '[aria-label*="Telefone"]',
            '.QS5gu.sy7re'
        ];

        const elTelefone = seletores.map((seletor) => document.querySelector(seletor)).find(Boolean);
        return limparTexto(elTelefone?.innerText);
    });
}

module.exports = {
    extrairTelefone
};
