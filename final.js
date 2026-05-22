
const { firefox } = require('playwright');

async function scrapeGoogleMapsCompleto(termo) {
    console.clear();
    console.log('====================================');
    console.log(' GOOGLE MAPS - DADOS + FOTOS RESUMO');
    console.log('====================================\n');

    const browser = await firefox.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' });

    try {
        const url = `https://www.google.com/maps/search/${encodeURIComponent(termo)}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(4000);

        // --- PASSO 1: DETECÇÃO E SINCRONIZAÇÃO ---
        const isPainelDireto = await page.isVisible('h1.DUwDvf');
        if (isPainelDireto) {
            await page.click('button#searchbox-searchbutton, button[aria-label="Pesquisar"]');
        } else {
            await page.click('.m6QErb.DxyBCb.kA9KIf.dS8AEf.XiKgde.ecceSd a.hfpxzc');
        }

        console.log('[INFO] Sincronizando e carregando dados (Aguardando 8s)...');
        await page.waitForTimeout(8000);

        // --- PASSO 2: EXTRAÇÃO DOS DADOS PRINCIPAIS ---
        const dadosPrincipais = await page.evaluate(() => {
            const notaContainer = document.querySelector('.fontDisplayLarge')?.parentElement?.innerText || "";
            let total = null;
            if (notaContainer && notaContainer.includes('avalia')) {
                const found = notaContainer.split('\n').find(p => /\d/.test(p) && p.toLowerCase().includes('avalia')) || notaContainer;
                const digits = found?.replace(/[^0-9]/g, '') || null;
                total = digits ? parseInt(digits, 10) : null;
            }

            return {
                estabelecimento: document.querySelector('h1.DUwDvf')?.innerText || "Não encontrado",
                nota: document.querySelector('.fontDisplayLarge')?.innerText || "S/N",
                totalAvaliacoes: total,
                endereco: document.querySelector('button[data-item-id="address"]')?.innerText?.replace(/[]/g, '').trim(),
                telefone: document.querySelector('button[data-item-id^="phone"]')?.innerText?.replace(/[]/g, '').trim()
            };
        });

        const imgElement = await page.$('button.aoRNLd img, button[jsaction*="heroHeaderImage"] img');
        let fotoOriginal = null;
        if (imgElement) {
            fotoOriginal = await imgElement.evaluate(node => node.src);
            if (fotoOriginal) {
                fotoOriginal = fotoOriginal.split('=')[0];
            }
        }

        const linkPagina = page.url();

        // --- PASSO 3: EXTRAÇÃO DOS RESUMOS (FOTO + COMENTÁRIO) ---
        // Faz uma rolagem leve para garantir que os resumos e fotos carreguem
        await page.evaluate(() => {
            const painel = document.querySelector('.m6QErb.WNBkOb.XiKgde');
            if (painel) painel.scrollTop = 800;
        });
        await page.waitForTimeout(2000);

        const resumos = await page.evaluate(() => {
            const cards = document.querySelectorAll('.tBizfc');
            const listaResumos = [];

            cards.forEach(card => {
                const anchor = card.querySelector('a.B8AOT');
                if (!anchor) return;

                // Extrai a URL da imagem de perfil do autor
                const style = anchor.getAttribute('style') || "";
                const match = style.match(/url\(["']?([^"']+)["']?\)/);
                
                if (match && match[1]) {
                    let imgUrl = match[1].replace(/["']/g, '');
                    if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
                    // Limpa e melhora a resolução da imagem
                    const fotoLink = imgUrl.replace(/=w\d+-h\d+/, '=s150');

                    listaResumos.push({
                        foto: fotoLink,
                        comentario: card.innerText.trim().replace(/\n/g, ' ')
                    });
                }
            });

            return listaResumos;
        });

        // --- RESULTADO FINAL ---
        const resultadoFinal = {
            ...dadosPrincipais,
            foto_original: fotoOriginal,
            link_maps: linkPagina,
            resumo_com_foto: resumos
        };

        console.log('\n====================================');
        console.log(JSON.stringify(resultadoFinal, null, 2));
        console.log('====================================');

        // Retorna o resultado para quem chamar a função
        return resultadoFinal;

    } catch (err) {
        console.error("\n[ERRO]:", err.message);
        return { erro: err.message };
    } finally {
        await browser.close();
    }
}

module.exports = scrapeGoogleMapsCompleto;