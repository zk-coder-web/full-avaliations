const form = document.getElementById('form');
const termoInput = document.getElementById('termo');
const status = document.getElementById('status');
const resultado = document.getElementById('resultado');
const estabelecimentoEl = document.getElementById('estabelecimento');
const galeria = document.getElementById('galeria');
const empresaFoto = document.getElementById('empresaFoto');
const empresaNomeTop = document.getElementById('empresaNomeTop');
const empresaLink = document.getElementById('empresaLink');
const empresaNome = document.getElementById('empresaNome');
const enderecoVal = document.getElementById('enderecoVal');
const telefoneVal = document.getElementById('telefoneVal');
const notaVal = document.getElementById('notaVal');
const avaliacoesVal = document.getElementById('avaliacoesVal');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const termo = termoInput.value.trim();
  if (!termo) return;

  status.textContent = 'Buscando...';
  resultado.classList.add('hidden');
  galeria.innerHTML = '';

  try {
    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ termo })
    });

    if (!res.ok) throw new Error('Erro na requisição');

    const data = await res.json();

    if (data.erro) {
      status.textContent = 'Erro: ' + data.erro;
      return;
    }

    status.textContent = '';
    renderResultado(data);

  } catch (err) {
    status.textContent = 'Erro: ' + err.message;
  }
});

function renderResultado(data) {
  resultado.classList.remove('hidden');
  estabelecimentoEl.textContent = data.estabelecimento || '—';
  empresaNomeTop.textContent = data.estabelecimento || '—';
  empresaFoto.src = data.foto_original || '';
  empresaFoto.alt = data.estabelecimento || 'Foto da empresa';
  empresaLink.href = data.link_maps || '#';
  empresaLink.textContent = data.link_maps ? 'Abrir no Maps' : 'Link indisponível';

  empresaNome.textContent = data.estabelecimento || '—';
  enderecoVal.textContent = data.endereco || '—';
  telefoneVal.textContent = data.telefone || '—';

  notaVal.textContent = data.nota || '—';
  if (typeof data.totalAvaliacoes === 'number') {
    const formatted = new Intl.NumberFormat('pt-BR').format(data.totalAvaliacoes);
    avaliacoesVal.textContent = `${formatted} avaliações`;
  } else if (data.totalAvaliacoes) {
    avaliacoesVal.textContent = `${data.totalAvaliacoes} avaliações`;
  } else {
    avaliacoesVal.textContent = '';
  }

  const items = data.resumo_com_foto || data.comentarios || [];
  if (items.length === 0) {
    galeria.innerHTML = '<p class="muted">Sem resumos com foto</p>';
    return;
  }
  galeria.innerHTML = '';
  items.forEach(it => {
    const row = document.createElement('div');
    row.className = 'card-item row';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.src = it.foto || it.Foto || '';
    img.alt = '';

    const right = document.createElement('div');
    right.className = 'right';
    const p = document.createElement('div');
    p.className = 'comment single';
    // evita quebra de linha: truncamento por elipse
    const text = (it.comentario || it.Comentario || '').trim();
    p.textContent = text.length > 300 ? text.slice(0, 297) + '...' : text;

    right.appendChild(p);
    row.appendChild(img);
    row.appendChild(right);
    galeria.appendChild(row);
  });
}
