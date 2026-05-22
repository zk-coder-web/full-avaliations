/**
 * Script para capturar o status atual da empresa.
 */
async function extrairStatus(page) {
    return page.evaluate(() => {
        const statusElement = document.querySelector('.ZDu9vd span') ||
            document.querySelector('.aIFcqe .ZDu9vd');

        if (statusElement) {
            const statusText = statusElement.innerText.trim();
            console.log('Status da empresa:', statusText);

            if (statusText.toLowerCase().includes('fechado')) {
                console.warn('Atencao: A empresa esta FECHADA no momento.');
            } else {
                console.info('A empresa esta ABERTA ou com outro status.');
            }

            return statusText;
        }

        console.error('Nao foi possivel encontrar o elemento de status. Verifique se o painel da empresa esta aberto.');
        return null;
    });
}

module.exports = {
    extrairStatus
};
