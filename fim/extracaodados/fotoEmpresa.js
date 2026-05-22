async function extrairFotoEmpresa(page) {
    return page.evaluate(() => {
        const seletores = [
            'button.aoRNLd img',
            '[jsaction*="heroHeaderImage"] img',
            '.hfpxzc img',
            'img[src*="googleusercontent.com/p/"]',
            '.Tf9s6e img',
            '.AeaYub img',
            'img[alt*="Foto"]',
            'img[alt*="Interior"]',
            'img[alt*="Exterior"]'
        ];

        const elFoto = seletores.map((seletor) => document.querySelector(seletor)).find((el) => el?.src);
        return elFoto?.src ? `${elFoto.src.split('=')[0]}=s2048` : null;
    });
}

module.exports = {
    extrairFotoEmpresa
};
