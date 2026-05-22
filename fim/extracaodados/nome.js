async function extrairNome(page) {
    return page.evaluate(() => {
        const seletores = ['h1.DUwDvf', '.DUwDvf', '.lMbq3e h1'];
        const elNome = seletores.map((seletor) => document.querySelector(seletor)).find(Boolean);
        return elNome?.innerText || 'Nao encontrado';
    });
}

module.exports = {
    extrairNome
};
