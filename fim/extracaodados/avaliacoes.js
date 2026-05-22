async function extrairAvaliacoes(page) {
    return page.evaluate(() => {
        const cards = document.querySelectorAll('.jftiEf, .tBizfc, .W67uab');

        return Array.from(cards)
            .map((card) => {
                const foto = card.querySelector('img.NBa79c, .j9899e img')?.src;

                return {
                    autor: card.querySelector('.d4r55, .TSr3u')?.innerText || 'Usuario',
                    comentario: card.querySelector('.wiI7eb, .K70oYd')?.innerText || '',
                    foto_autor: foto ? `${foto.split('=')[0]}=s100` : null
                };
            })
            .filter((avaliacao) => avaliacao.comentario.length > 1)
            .slice(0, 5);
    });
}

module.exports = {
    extrairAvaliacoes
};
