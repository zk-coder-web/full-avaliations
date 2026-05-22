function limparTexto(texto) {
    return texto
        ? texto.replace(/[^\S\r\n]+/g, ' ').trim().replace(/\n/g, ' ')
        : null;
}

function capturar(tentativas) {
    for (const seletor of tentativas) {
        const el = document.querySelector(seletor);
        if (el && (el.innerText || el.src || el.ariaLabel)) return el;
    }

    return null;
}

module.exports = {
    limparTexto,
    capturar
};
