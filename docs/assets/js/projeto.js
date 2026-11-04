/* ==========================================================================
   projeto.js — estudo de caso (projeto.html?p=<slug>)
   1. Lightbox da galeria   2. Montagem da página a partir de
      dados/projetos.js (resumo) + dados/estudos/<slug>.js (conteúdo completo)
   ========================================================================== */

/* ---------- 1. Lightbox (usa <dialog> nativo: Esc fecha, foco fica preso no modal) ---------- */
(function (P) {
  'use strict';
  const { h } = P.utils;
  let dialog, img, legenda, contador, lista = [], atual = 0, origem = null;

  function criar() {
    img = h('img', { alt: '' });
    legenda = h('figcaption');
    contador = h('span', { class: 'lb-count', 'aria-live': 'polite' });
    const btn = (classe, rotulo, icone, acao) =>
      h('button', { type: 'button', class: classe, 'aria-label': rotulo, onclick: acao }, P.icone(icone));

    dialog = h('dialog', { class: 'lightbox', 'aria-label': 'Imagem ampliada' },
      btn('lb-close', 'Fechar', 'fechar', fechar),
      btn('lb-nav lb-prev', 'Imagem anterior', 'esquerda', () => mostrar(atual - 1)),
      btn('lb-nav lb-next', 'Próxima imagem', 'direita', () => mostrar(atual + 1)),
      h('figure', null, img, legenda, contador),
    );
    // Clique fora da imagem (no fundo) fecha
    dialog.addEventListener('click', (e) => { if (e.target === dialog || e.target.tagName === 'FIGURE') fechar(); });
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
    dialog.addEventListener('close', () => { if (origem) origem.focus(); });
    // Gesto de deslizar no celular
    let x0 = null;
    dialog.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
    document.body.append(dialog);
  }

  function mostrar(i) {
    if (!lista.length) return;
    atual = (i + lista.length) % lista.length;
    const item = lista[atual];
    img.src = item.src;
    img.alt = item.alt || '';
    legenda.textContent = item.legenda || '';
    contador.textContent = lista.length > 1 ? `${atual + 1} de ${lista.length}` : '';
    dialog.querySelectorAll('.lb-nav').forEach((b) => { b.hidden = lista.length < 2; });
  }

  function abrir(itens, indice = 0) {
    if (!dialog) criar();
    origem = document.activeElement;
    lista = itens;
    mostrar(indice);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else window.open(lista[atual].src, '_blank', 'noopener'); // navegadores muito antigos
  }

  function fechar() { if (dialog && dialog.open) dialog.close(); }

  P.lightbox = { abrir, fechar };
})(window.PORTFOLIO);

/* ---------- 2. Estudo de caso ---------- */
(function (P) {
  'use strict';
  const { h, $, num, data, iniciais, linguagensPct } = P.utils;
  const projetos = P.projetos || [];
  const raiz = $('#case');
  const externo = { target: '_blank', rel: 'noopener noreferrer' };
  const novaAba = () => h('span', { class: 'sr-only' }, ' (abre em nova aba)');

  const slug = new URLSearchParams(window.location.search).get('p');
  const indice = projetos.findIndex((p) => p.slug === slug);
  const resumo = projetos[indice];

  if (!resumo) {
    document.title = 'Projeto não encontrado · Thiago Nunes';
    raiz.replaceChildren(h('div', { class: 'section' }, h('div', { class: 'panel not-found' },
      h('p', { class: 'el-tag' }, 'Estudo de caso'),
      h('h1', null, 'Projeto não encontrado'),
      h('p', null, 'O link pode estar incompleto. Escolha um dos projetos abaixo:'),
      h('ul', { class: 'link-list' }, projetos.map((x) => h('li', null,
        h('a', { class: 'btn btn-ghost btn-sm', href: `projeto.html?p=${encodeURIComponent(x.slug)}` }, x.nome)))),
      h('a', { class: 'btn btn-primary', href: 'index.html#projetos' }, P.icone('voltar'), 'Voltar aos projetos'),
    )));
    return;
  }

  /* ---------- Tema do projeto (já com o resumo, antes do conteúdo completo) ---------- */
  document.title = `${resumo.nome} · Estudo de caso · Thiago Nunes`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', `${resumo.nome} — ${resumo.tagline}`);
  document.body.dataset.el = resumo.cor || 'terra';
  document.body.dataset.cor = resumo.cor || 'terra';

  /* ---------- Conteúdo completo sob demanda: dados/estudos/<slug>.js ----------
     Só o estudo aberto é baixado (a página inicial não carrega nenhum). */
  function carregarEstudo(r) {
    return new Promise((ok, falha) => {
      if (P.estudos && P.estudos[r.slug]) { ok(P.estudos[r.slug]); return; }
      const s = document.createElement('script');
      s.src = `assets/js/dados/estudos/${encodeURIComponent(r.slug)}.js`;
      s.onload = () => ((P.estudos || {})[r.slug] ? ok(P.estudos[r.slug]) : falha(new Error('estudo vazio')));
      s.onerror = () => falha(new Error('estudo não encontrado'));
      document.head.append(s);
    });
  }
  carregarEstudo(resumo)
    .then((estudo) => montar({
      ...resumo, ...estudo,
      comoRodar: Array.isArray(estudo.comoRodar) ? estudo.comoRodar.join('\n') : estudo.comoRodar,
    }))
    .catch(() => montar(resumo)); // se o arquivo faltar, mostra pelo menos o resumo

  function montar(p) {
    const full = p.repo.full;
    const techList = (itens) => h('ul', { class: 'tech-list' }, (itens || []).map((t) => h('li', { class: 'tech' }, t)));
    const secao = (id, titulo, eyebrow, ...conteudo) => h('section', { class: 'panel case-section reveal', id, 'aria-labelledby': `h-${id}` },
      h('header', null, eyebrow ? h('p', { class: 'el-tag' }, eyebrow) : null, h('h2', { id: `h-${id}` }, titulo)),
      ...conteudo);

    /* ---------- Cabeçalho ---------- */
    const capa = p.capa || (p.galeria && p.galeria[0]);
    const galeria = (p.galeria || []).map((g) => ({ src: g.src, alt: g.alt, legenda: g.legenda }));
    const abrirGaleria = (i) => P.lightbox && P.lightbox.abrir(galeria, i);

    const fatos = [
      ['Semestre', p.semestre],
      ['Período', p.periodo],
      ['Meu papel', p.papel],
      ['Equipe', p.equipe && p.equipe.length ? `${p.equipe.length} ${p.equipe.length === 1 ? 'pessoa' : 'pessoas'}` : ''],
      [p.parceiro ? 'Parceiro' : 'Contexto', p.parceiro || p.contexto],
    ].filter(([, v]) => v);

    const hero = h('div', { class: 'section' }, h('div', { class: 'panel case-hero reveal' },
      h('div', { class: 'case-intro' },
        h('a', { class: 'crumb', href: 'index.html#projetos' }, P.icone('voltar'), 'Todos os projetos'),
        h('div', { class: 'badges' },
          h('span', { class: 'badge is-solid' }, p.semestre),
          p.abp ? h('span', { class: 'badge' }, 'Projeto Integrador · ABP') : null,
          p.status ? h('span', { class: 'status', 'data-status': p.status.tipo }, p.status.rotulo) : null),
        h('h1', null, p.nome),
        h('p', { class: 'case-tagline' }, p.tagline),
        h('div', { class: 'case-actions' },
          h('a', { class: 'btn btn-primary', href: p.repo.url, ...externo }, P.icone('github'), 'Repositório', novaAba()),
          (p.links || []).filter((l) => l.destaque).map((l) =>
            h('a', { class: 'btn btn-ghost', href: l.url, ...externo }, P.icone(l.icone || 'externo'), l.rotulo, novaAba()))),
        p.repo.privado ? h('p', { class: 'repo-note' }, P.icone('cadeado'), 'Repositório privado: para ver o código e as evidências, peça acesso pelo LinkedIn (seção Contato).') : null,
      ),
      capa ? h('figure', { class: 'case-cover' },
        h('button', {
          type: 'button', 'aria-label': `Ampliar imagem: ${capa.alt}`,
          onclick: () => {
            const i = galeria.findIndex((g) => g.src === capa.src);
            // Capa que não faz parte da galeria (ex.: capa ilustrativa) abre sozinha
            if (i >= 0) abrirGaleria(i);
            else if (P.lightbox) P.lightbox.abrir([{ src: capa.src, alt: capa.alt, legenda: capa.legenda }], 0);
          },
        },
          h('img', {
            src: capa.src, alt: capa.alt, width: capa.largura, height: capa.altura, fetchpriority: 'high', decoding: 'async',
            srcset: capa.mini ? `${capa.mini} 640w, ${capa.src} ${capa.largura}w` : null,
            sizes: capa.mini ? '(min-width: 1000px) 560px, 100vw' : null,
            style: capa.posicao ? { 'object-position': capa.posicao } : null,
          })),
        capa.legenda ? h('figcaption', null, capa.legenda) : null) : null,
      h('dl', { class: 'case-facts' }, fatos.map(([k, v]) => h('div', null, h('dt', null, k), h('dd', null, v)))),
    ));

    /* ---------- Seções ---------- */
    const secoes = [];

    // 1. Visão geral
    secoes.push(['visao', 'Visão geral', secao('visao', 'Visão geral', p.contexto,
      h('div', { class: 'prose' }, (Array.isArray(p.resumo) ? p.resumo : [p.resumo]).map((t) => h('p', null, t))),
      (p.problema || p.solucao) ? h('div', { class: 'duo' },
        p.problema ? h('div', null, h('h3', null, P.icone('alvo'), 'Problema'), h('p', null, p.problema)) : null,
        p.solucao ? h('div', null, h('h3', null, P.icone('lampada'), 'Solução'), h('p', null, p.solucao)) : null) : null,
    )]);

    // 2. Minha contribuição (item mais importante)
    const e = p.estatisticas || {};
    const stat = (rotulo, valor, extra) => (valor || valor === 0 ? h('div', { class: 'stat' }, h('dt', null, rotulo), h('dd', null, valor, extra ? h('small', null, extra) : null)) : null);
    // Evidência como texto: 'c808945' → commit · 'PR #1' → pull request · 'issue #8' → issue
    // · 'backend/main.py' → arquivo · 'docs/' → pasta · 'dev-thiago:frontend/lib' → arquivo em outra branch
    const normalizar = (ev) => {
      if (typeof ev !== 'string') return ev;
      const s = ev.trim();
      let m;
      if (/^https:\/\//.test(s)) {
        // URL completa (ex.: commit no fork pessoal): rótulo = final do caminho
        const partes = s.replace(/\/$/, '').split('/');
        const fim = partes[partes.length - 1];
        return { tipo: partes.includes('commit') ? 'commit' : 'arquivo', url: s, rotulo: partes.includes('commit') ? fim.slice(0, 7) : fim };
      }
      if (/^[0-9a-f]{7,40}$/i.test(s)) return { tipo: 'commit', ref: s };
      if ((m = /^PR\s*#(\d+)$/i.exec(s))) return { tipo: 'pr', ref: m[1] };
      if ((m = /^issues?\s*#(\d+)$/i.exec(s))) return { tipo: 'issue', ref: m[1], rotulo: `issue #${m[1]}` };
      if ((m = /^([\w./-]+):(.+)$/.exec(s)) && !s.includes('://')) return { tipo: 'arquivo', ref: m[2], branch: m[1], rotulo: s };
      return { tipo: 'arquivo', ref: s };
    };
    const linkEvid = (bruto) => {
      const ev = normalizar(bruto);
      const icone = { commit: 'commit', pr: 'pr', arquivo: 'arquivo', issue: 'pr' }[ev.tipo] || 'externo';
      const rotulo = ev.rotulo || (ev.tipo === 'commit' ? String(ev.ref).slice(0, 7) : ev.tipo === 'pr' ? `PR #${ev.ref}` : ev.ref);
      const url = ev.url || (ev.tipo === 'commit' ? P.github.urlCommit(full, ev.ref)
        : ev.tipo === 'pr' ? P.github.urlPR(full, ev.ref)
          : ev.tipo === 'issue' ? P.github.urlIssue(full, ev.ref)
            : ev.tipo === 'arquivo' ? P.github.urlArquivo(full, ev.ref, ev.branch) : null);
      return h('li', null, url
        ? h('a', { href: url, ...externo, title: ev.titulo || null }, P.icone(icone), rotulo, novaAba())
        : h('span', null, P.icone(icone), rotulo));
    };
    secoes.push(['contribuicao', 'Minha contribuição', secao('contribuicao', 'Minha contribuição', 'Contribuição pessoal',
      p.contribuicaoResumo ? h('div', { class: 'contrib-highlight' }, h('p', null, p.contribuicaoResumo)) : null,
      p.repo.privado ? h('p', { class: 'repo-note' }, P.icone('cadeado'), 'As evidências abaixo apontam para um repositório privado: o acesso é liberado sob solicitação.') : null,
      h('dl', { class: 'stats' },
        stat('Commits meus', num(e.commits), e.commitsObs),
        stat('Pull requests', num(e.prs)),
        (e.linhasAdicionadas || e.linhasRemovidas) ? h('div', { class: 'stat' }, h('dt', null, 'Linhas alteradas'),
          h('dd', null, h('span', { class: 'add' }, `+${num(e.linhasAdicionadas || 0)}`), ' ', h('span', { class: 'del' }, `−${num(e.linhasRemovidas || 0)}`),
            h('small', null, 'sem contar arquivos gerados'))) : null,
        (e.primeiroCommit && e.ultimoCommit) ? stat('Atividade', `${data(e.primeiroCommit)}`, `até ${data(e.ultimoCommit)}`) : null,
        (e.extras || []).map((x) => stat(x.rotulo, x.valor, x.obs))),
      h('ol', { class: 'contrib-list' }, (p.contribuicoes || []).map((c) => h('li', { class: 'contrib' },
        h('div', { class: 'contrib-top' }, c.area ? h('span', { class: 'area' }, c.area) : null, h('h3', null, c.titulo)),
        h('p', null, c.descricao),
        (c.evidencias && c.evidencias.length) ? h('ul', { class: 'evidence', 'aria-label': 'Evidências no GitHub' }, c.evidencias.map(linkEvid)) : null,
      ))),
      e.fonte ? h('p', { class: 'muted', style: { 'font-size': '13px' } }, e.fonte) : null,
    )]);

    // 3. Funcionalidades
    if ((p.funcionalidades || []).length) {
      const rotuloEstado = { implementado: 'Implementado', parcial: 'Parcial', planejado: 'Planejado' };
      secoes.push(['funcionalidades', 'Funcionalidades', secao('funcionalidades', 'Funcionalidades', 'O que o sistema faz',
        h('ul', { class: 'func-grid' }, p.funcionalidades.map((f) => h('li', { class: 'func' },
          h('span', { class: 'state', 'data-state': f.estado }, rotuloEstado[f.estado] || f.estado),
          h('h3', null, f.titulo), h('p', null, f.descricao)))),
      )]);
    }

    // 4. Arquitetura e tecnologias
    const langs = linguagensPct(p.linguagens);
    secoes.push(['arquitetura', 'Arquitetura e tecnologias', secao('arquitetura', 'Arquitetura e tecnologias', 'Como foi construído',
      p.arquitetura && p.arquitetura.visaoGeral ? h('div', { class: 'prose' }, h('p', null, p.arquitetura.visaoGeral)) : null,
      p.arquitetura && (p.arquitetura.componentes || []).length ? h('ol', { class: 'arch' }, p.arquitetura.componentes.map((c) => h('li', null,
        h('b', null, c.nome), h('span', { class: 'tech-inline' }, c.tecnologia), h('p', null, c.responsabilidade)))) : null,
      (p.stack || []).length ? h('div', { class: 'stack-groups' }, p.stack.map((g) => h('div', { class: 'stack-group' }, h('h3', null, g.categoria), techList(g.itens)))) : null,
      langs.length ? h('div', { class: 'lang-box' },
        h('h3', null, 'Linguagens do repositório'),
        h('div', { class: 'lang-bar', role: 'img', 'aria-label': langs.map((l) => `${l.nome} ${l.pct.toFixed(1)}%`).join(', ') },
          langs.map((l) => h('span', { style: { width: `${l.pct}%`, '--lang': l.cor }, title: `${l.nome} ${l.pct.toFixed(1)}%` }))),
        h('ul', { class: 'lang-legend' }, langs.map((l) => h('li', { style: { '--lang': l.cor } }, h('span', { class: 'dot' }), h('b', null, l.nome), `${l.pct.toFixed(1)}%`))),
        h('p', { class: 'fonte' }, `Dados do GitHub (repositório inteiro, todos os autores)${p.linguagensData ? ` · ${data(p.linguagensData)}` : ''}.`)) : null,
    )]);

    // 5. Processo e equipe
    if (p.metodologia || (p.sprints || []).length || (p.equipe || []).length) {
      const eu = (login) => (P.perfil && (P.perfil.githubContas || []).map((x) => x.toLowerCase()).includes(String(login).toLowerCase()));
      secoes.push(['processo', 'Processo e equipe', secao('processo', 'Processo e equipe', 'Como trabalhamos',
        p.metodologia ? h('div', { class: 'prose' }, h('p', null, p.metodologia)) : null,
        (p.sprints || []).length ? h('ol', { class: 'timeline' }, p.sprints.map((s) => h('li', null,
          h('span', { class: 'when' }, [s.nome, s.periodo].filter(Boolean).join(' · ')),
          s.objetivo ? h('b', null, s.objetivo) : null,
          (s.entregas || []).length ? h('ul', null, s.entregas.map((x) => h('li', null, x))) : null))) : null,
        (p.equipe || []).length ? h('div', null,
          h('h3', { style: { 'margin-bottom': '10px' } }, 'Equipe'),
          h('ul', { class: 'team-grid' }, p.equipe.map((m) => h('li', { class: 'member' + (eu(m.github) ? ' is-me' : '') },
            h('span', { class: 'avatar', 'aria-hidden': 'true' }, iniciais(m.nome)),
            h('div', null,
              h('b', null, m.nome + (eu(m.github) ? ' (eu)' : '')),
              m.papel ? h('small', null, m.papel) : null,
              m.github ? h('a', { href: P.github.urlPerfil(m.github), ...externo }, '@' + m.github, novaAba()) : null))))) : null,
      )]);
    }

    // 6. Desafios e aprendizados
    if ((p.desafios || []).length || (p.aprendizados || []).length) {
      secoes.push(['desafios', 'Desafios e aprendizados', secao('desafios', 'Desafios e aprendizados', 'O que aprendi',
        (p.desafios || []).length ? h('ul', { class: 'challenge-list' }, p.desafios.map((d) => h('li', { class: 'challenge' },
          h('h3', null, d.desafio), h('p', null, d.abordagem)))) : null,
        (p.aprendizados || []).length ? h('div', null, h('h3', { style: { 'margin-bottom': '8px' } }, 'Aprendizados'),
          h('ul', { class: 'learn-list' }, p.aprendizados.map((a) => h('li', null, a)))) : null,
      )]);
    }

    // 7. Galeria
    if (galeria.length) {
      secoes.push(['galeria', 'Galeria', secao('galeria', 'Galeria', 'Telas e registros',
        h('ul', { class: 'gallery' }, (p.galeria || []).map((g, i) => h('li', null,
          h('button', { type: 'button', onclick: () => abrirGaleria(i) }, h('span', { class: 'sr-only' }, 'Ampliar imagem: '),
            h('img', { src: g.mini || g.src, alt: g.alt, width: g.largura, height: g.altura, loading: 'lazy', decoding: 'async' }),
            g.legenda ? h('span', null, g.legenda) : null)))),
      )]);
    }

    // 8. Como executar e links
    if (p.comoRodar || (p.links || []).length) {
      secoes.push(['executar', 'Como executar', secao('executar', 'Como executar e links', 'Para testar',
        p.comoRodar ? h('pre', { class: 'code-block', tabindex: '0', 'aria-label': 'Comandos para executar o projeto' }, h('code', null, p.comoRodar)) : null,
        h('ul', { class: 'link-list' },
          h('li', null, h('a', { class: 'btn btn-ghost btn-sm', href: p.repo.url, ...externo }, P.icone('github'), 'Código-fonte', novaAba())),
          (p.links || []).map((l) => h('li', null, h('a', { class: 'btn btn-ghost btn-sm', href: l.url, ...externo }, P.icone(l.icone || 'externo'), l.rotulo, novaAba())))),
      )]);
    }

    /* ---------- Índice + navegação entre projetos ---------- */
    const toc = h('aside', { class: 'case-toc' },
      h('p', { class: 'el-tag toc-title' }, 'Nesta página'),
      h('nav', { 'aria-label': 'Seções do estudo de caso' }, secoes.map(([id, titulo]) => h('a', { href: `#${id}` }, titulo))));

    toc.querySelector('nav').addEventListener('focusin', (e) => {
      if (e.target.matches('a')) e.target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });

    const anterior = projetos[(indice - 1 + projetos.length) % projetos.length];
    const proximo = projetos[(indice + 1) % projetos.length];
    const nav = projetos.length > 1 ? h('div', { class: 'section' }, h('nav', { class: 'case-nav', 'aria-label': 'Outros estudos de caso' },
      anterior !== p ? h('a', { href: `projeto.html?p=${encodeURIComponent(anterior.slug)}` }, h('small', null, '← Anterior'), h('b', null, anterior.nome)) : null,
      proximo !== p && proximo !== anterior ? h('a', { class: 'next', href: `projeto.html?p=${encodeURIComponent(proximo.slug)}` }, h('small', null, 'Próximo →'), h('b', null, proximo.nome)) : null,
    )) : null;

    raiz.replaceChildren(
      hero,
      h('div', { class: 'section' }, h('div', { class: 'case-layout' }, toc, h('div', { class: 'case-content' }, secoes.map(([, , el]) => el)))),
      nav,
    );

    /* ---------- Destaca a seção atual no índice ----------
       Seção ativa = a última cujo topo já passou de 40% da altura da tela;
       no topo da página (ainda no cabeçalho do projeto) nenhuma fica marcada. */
    const linksToc = [...toc.querySelectorAll('a')];
    const alvos = secoes.map(([id]) => document.getElementById(id)).filter(Boolean);
    let ativoAtual = null;
    let agendado = false;
    function marcarSecao() {
      agendado = false;
      const limite = window.innerHeight * 0.4;
      let ativo = null;
      for (const el of alvos) if (el.getBoundingClientRect().top <= limite) ativo = el.id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && alvos.length) ativo = alvos[alvos.length - 1].id;
      if (ativo === ativoAtual) return;
      ativoAtual = ativo;
      linksToc.forEach((a) => {
        const sim = a.getAttribute('href') === `#${ativo}`;
        a.classList.toggle('is-active', sim);
        if (sim) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(marcarSecao); } }, { passive: true });
    window.addEventListener('resize', marcarSecao, { passive: true });
    marcarSecao();

    // Âncora na URL (ex.: projeto.html?p=x#galeria) depois de montar a página
    if (window.location.hash) {
      const alvo = document.getElementById(window.location.hash.slice(1));
      if (alvo) requestAnimationFrame(() => alvo.scrollIntoView());
    }
    if (P.reveal) P.reveal(raiz);
  }
})(window.PORTFOLIO);
