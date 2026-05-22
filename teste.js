
const { firefox } = require('playwright');
const readline = require('readline');

// Função para ler entrada do usuário no console
function question(query) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(query, ans => { rl.close(); resolve(ans); }));
}

async function scrapeGoogleMapsInterativo(termo) {
    console.clear();
    console.log('====================================');
    console.log(' GOOGLE MAPS - SELEÇÃO INTERATIVA');
    console.log('====================================\n');

    const browser = await firefox.launch({ headless: false }); // Headless false para você ver o que está acontecendo
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.setExtraHTTPHeaders({ 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' });

    try {
        const url = `https://www.google.com/maps/search/${encodeURIComponent(termo)}`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(4000);

        // --- PASSO 1: DETECTAR MÚLTIPLOS RESULTADOS ---
        const resultados = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.hfpxzc'));
            return cards.map((card, i) => {
                const pai = card.closest('.nv2yud') || card.parentElement;
                return {
                    id: i + 1,
                    nome: card.ariaLabel,
                    // Tenta pegar o endereço/cidade que geralmente fica em uma div específica na lista
                    info: pai.innerText.split('\n').filter(t => t.length > 5).slice(1, 3).join(' | ')
                };
            });
        });

        let indexEscolhido = 0;

        if (resultados.length > 1) {
            console.log(`[!] Encontrei ${resultados.length} empresas. Escolha uma:`);
            resultados.forEach(r => console.log(`${r.id}. ${r.nome} - ${r.info}`));
            
            const resposta = await question('\nDigite o número da empresa correta: ');
            indexEscolhido = parseInt(resposta) - 1;
        }

        // --- PASSO 2: CLICAR NO RESULTADO ESCOLHIDO (COM SCROLL) ---
        if (resultados.length > 0) {
            const seletorAlvo = `.hfpxzc >> nth=${indexEscolhido}`;
            
            // Garante que o elemento está visível (faz scroll se necessário)
            await page.locator(seletorAlvo).scrollIntoViewIfNeeded();
            await page.click(seletorAlvo);
            
            console.log(`[INFO] Abrindo: ${resultados[indexEscolhido]?.nome}...`);
            await page.waitForSelector('h1.DUwDvf', { timeout: 10000 });
        }

        // Sincronização e Clicar nas Avaliações
        await page.waitForTimeout(3000);
        const btnAval = await page.$('button[aria-label*="Avaliações"], .F7nice');
        if (btnAval) await btnAval.click().catch(() => {});
        await page.waitForTimeout(2000);

        // --- PASSO 3: EXTRAÇÃO BRUTA (3 CAMADAS) ---
        const resultadoFinal = await page.evaluate(() => {
            const limpar = (t) => t ? t.replace(/[]/g, '').trim().replace(/\n/g, ' ') : null;
            const capturar = (tentativas) => {
                for (let sel of tentativas) {
                    let el = document.querySelector(sel);
                    if (el && (el.innerText || el.src)) return el;
                }
                return null;
            };

            const nome = capturar(['h1.DUwDvf', '.DUwDvf'])?.innerText || "Não encontrado";
            const nota = capturar(['.fontDisplayLarge', '.F7nice span[aria-hidden="true"]'])?.innerText || "S/N";
            
            const elTotal = capturar(['.F7nice span[aria-label*="avalia"]', '.jANv6b']);
            const totalNum = elTotal?.ariaLabel?.replace(/\D/g, '') || elTotal?.innerText?.replace(/\D/g, '');

            let foto = capturar(['button.aoRNLd img', '[jsaction*="heroHeaderImage"] img', 'img[src*="googleusercontent.com/p/"]'])?.src;
            if (foto) foto = foto.split('=')[0] + '=s2048';

            const cards = document.querySelectorAll('.jftiEf, .tBizfc');
            const listaAvaliacoes = Array.from(cards).map(card => ({
                autor: card.querySelector('.d4r55')?.innerText || "Usuário",
                comentario: card.querySelector('.wiI7eb')?.innerText || "",
                foto_autor: card.querySelector('img.NBa79c')?.src?.split('=')[0] + '=s100'
            })).filter(a => a.comentario.length > 2).slice(0, 5);

            return {
                estabelecimento: nome,
                nota: nota,
                totalAvaliacoes: totalNum ? parseInt(totalNum) : null,
                endereco: limpar(document.querySelector('button[data-item-id="address"]')?.innerText),
                telefone: limpar(document.querySelector('button[data-item-id^="phone"]')?.innerText),
                foto_original: foto,
                link_maps: window.location.href,
                resumo_avaliacoes: listaAvaliacoes
            };
        });

        console.log('\n====================================');
        console.log(JSON.stringify(resultadoFinal, null, 2));
        console.log('====================================');

        return resultadoFinal;

    } catch (err) {
        console.error("\n[ERRO]:", err.message);
    } finally {
        await browser.close();
        process.exit();
    }
}

// Execução
scrapeGoogleMapsInterativo('Burger King');