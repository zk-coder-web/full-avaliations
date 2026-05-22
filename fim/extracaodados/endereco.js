async function extrairEndereco(page) {
    return page.evaluate(() => {
        const limparTexto = (texto) => texto ? texto.replace(/[^\S\r\n]+/g, ' ').trim().replace(/\n/g, ' ') : null;
        const seletores = [
            'button[data-item-id="address"]',
            '[aria-label*="Endereco"]',
            '[aria-label*="Endereço"]',
            '.Io6YTe.fontBodyMedium.kR99db'
        ];

        const elEndereco = seletores.map((seletor) => document.querySelector(seletor)).find(Boolean);
        return limparTexto(elEndereco?.innerText);
    });
}

module.exports = {
    extrairEndereco
};
