/* ==========================================================================
   site.js — núcleo comum às duas páginas (namespace window.PORTFOLIO)
   Scripts clássicos com defer: funcionam no GitHub Pages e abrindo o arquivo
   direto no navegador (file://), sem servidor e sem etapa de build.
   Ordem de carga no HTML: dados/*.js → site.js → home.js ou projeto.js
   ========================================================================== */

window.PORTFOLIO = window.PORTFOLIO || {};

/* ---------- Utilitários (h(), datas, cores de linguagens) ---------- */
(function (P) {
  'use strict';

  /**
   * Cria um elemento DOM de forma segura (textos sempre como texto — nunca innerHTML).
   * Ex.: h('a', { href: '#', class: 'btn' }, 'Texto', outroNode)
   */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k === 'style' && typeof v === 'object') {
          for (const [prop, val] of Object.entries(v)) el.style.setProperty(prop, val);
        } else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : String(v));
      }
    }
    for (const c of [children].flat(Infinity)) {
      if (c == null || c === false || c === '') continue;
      el.append(c instanceof Node ? c : document.createTextNode(String(c)));
    }
    return el;
  }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Formatação ---------- */
  const fmtNum = new Intl.NumberFormat('pt-BR');
  const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

  function parseData(iso) {
    if (!iso) return null;
    // "2026-06-11" é tratado como data local (evita voltar um dia por fuso horário)
    const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(iso + 'T12:00:00') : new Date(iso);
    return isNaN(d) ? null : d;
  }
  /** "2026-06-11" → "11 jun. 2026" */
  function data(iso) {
    const d = parseData(iso);
    return d ? `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}` : '';
  }
  /** "2026-06-11" → "jun. 2026" */
  function mesAno(iso) {
    const d = parseData(iso);
    return d ? `${MESES[d.getMonth()]} ${d.getFullYear()}` : '';
  }
  const num = (n) => (typeof n === 'number' ? fmtNum.format(n) : '');

  /** Iniciais para o avatar em CSS: "Davi Snaider Mendoza" → "DM" */
  function iniciais(nome) {
    const partes = String(nome || '?').trim().split(/\s+/).filter((p) => p.length > 2 || /^[A-ZÁÉÍÓÚ]/.test(p));
    const lista = partes.length ? partes : [String(nome || '?')];
    const primeira = lista[0][0] || '?';
    const ultima = lista.length > 1 ? lista[lista.length - 1][0] : '';
    return (primeira + ultima).toUpperCase();
  }

  /* ---------- Cores de linguagens (padrão do GitHub Linguist) ---------- */
  const CORES = {
    TypeScript: '#3178C6', JavaScript: '#F1E05A', Dart: '#00B4AB', Python: '#3572A5',
    'C++': '#F34B7D', C: '#555555', HTML: '#E34C26', CSS: '#663399', SCSS: '#C6538C',
    Shell: '#89E051', PowerShell: '#012456', Dockerfile: '#384D54', PLpgSQL: '#336790',
    CMake: '#DA3434', Swift: '#F05138', Kotlin: '#A97BFF', 'Objective-C': '#438EFF',
    PHP: '#4F5D95', Blade: '#F7523F', Vue: '#41B883', Java: '#B07219', 'C#': '#178600',
    Go: '#00ADD8', Rust: '#DEA584', Ruby: '#701516', SQL: '#E38C00', Batchfile: '#C1F12E',
  };
  const corLinguagem = (nome) => CORES[nome] || '#B58B5A';

  /** {Linguagem: bytes} → [{nome, pct, cor}] em ordem decrescente; as menores viram "Outras". */
  function linguagensPct(bytes, minPct = 1.5) {
    const total = Object.values(bytes || {}).reduce((a, b) => a + b, 0);
    if (!total) return [];
    const lista = Object.entries(bytes)
      .map(([nome, b]) => ({ nome, pct: (b / total) * 100, cor: corLinguagem(nome) }))
      .sort((a, b) => b.pct - a.pct);
    const grandes = lista.filter((l) => l.pct >= minPct);
    const resto = lista.filter((l) => l.pct < minPct).reduce((a, l) => a + l.pct, 0);
    if (resto > 0) grandes.push({ nome: 'Outras', pct: resto, cor: '#C9A872' });
    return grandes;
  }

  const reduzMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  P.utils = { h, $, $$, data, mesAno, num, iniciais, parseData, corLinguagem, linguagensPct, reduzMovimento };
})(window.PORTFOLIO);

/* ---------- Ícones SVG ---------- */
(function (P) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';

  // [viewBox, preenchido?, ...paths]
  const ICONES = {
    github: ['0 0 16 16', true, 'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z'],
    linkedin: ['0 0 24 24', true, 'M4.98 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM.4 8.1h4.9V24H.4V8.1Zm7.9 0h4.7v2.2h.07c.65-1.24 2.25-2.54 4.63-2.54 4.95 0 5.87 3.26 5.87 7.5V24h-4.9v-7.75c0-1.85-.03-4.23-2.58-4.23-2.58 0-2.97 2.01-2.97 4.1V24H8.3V8.1Z'],
    instagram: ['0 0 24 24', false, 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z', 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z', 'M17.5 6.5h.01'],
    email: ['0 0 24 24', false, 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'm22 6-10 7L2 6'],
    externo: ['0 0 24 24', false, 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6', 'M15 3h6v6', 'M10 14 21 3'],
    seta: ['0 0 24 24', false, 'M5 12h14', 'm12 5 7 7-7 7'],
    voltar: ['0 0 24 24', false, 'M19 12H5', 'm12 19-7-7 7-7'],
    estrela: ['0 0 24 24', false, 'm12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z'],
    fork: ['0 0 24 24', false, 'M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M12 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M6 9v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9', 'M12 12v3'],
    commit: ['0 0 24 24', false, 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'M2 12h6', 'M16 12h6'],
    pr: ['0 0 24 24', false, 'M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z', 'M6 9v12', 'M13 6h3a2 2 0 0 1 2 2v7'],
    arquivo: ['0 0 24 24', false, 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6'],
    relogio: ['0 0 24 24', false, 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 6v6l4 2'],
    copiar: ['0 0 24 24', false, 'M9 9h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
    fechar: ['0 0 24 24', false, 'M18 6 6 18', 'm6 6 12 12'],
    esquerda: ['0 0 24 24', false, 'm15 18-6-6 6-6'],
    direita: ['0 0 24 24', false, 'm9 18 6-6-6-6'],
    demo: ['0 0 24 24', false, 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
    codigo: ['0 0 24 24', false, 'm16 18 6-6-6-6', 'm8 6-6 6 6 6'],
    tela: ['0 0 24 24', false, 'M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'M8 22h8', 'M12 18v4'],
    celular: ['0 0 24 24', false, 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z', 'M12 18h.01'],
    servidor: ['0 0 24 24', false, 'M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z', 'M4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z', 'M6 6h.01', 'M6 18h.01'],
    banco: ['0 0 24 24', false, 'M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3Z', 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3', 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5'],
    chip: ['0 0 24 24', false, 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'M9 9h6v6H9z', 'M9 1v3', 'M15 1v3', 'M9 20v3', 'M15 20v3', 'M20 9h3', 'M20 14h3', 'M1 9h3', 'M1 14h3'],
    nuvem: ['0 0 24 24', false, 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z'],
    ferramenta: ['0 0 24 24', false, 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z'],
    pessoas: ['0 0 24 24', false, 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
    alvo: ['0 0 24 24', false, 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z', 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z'],
    lampada: ['0 0 24 24', false, 'M9 18h6', 'M10 22h4', 'M12 2a7 7 0 0 0-4 12.74V17h8v-2.26A7 7 0 0 0 12 2Z'],
    cadeado: ['0 0 24 24', false, 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z', 'M7 11V7a5 5 0 0 1 10 0v4'],
    pausa: ['0 0 24 24', false, 'M8 5v14', 'M16 5v14'],
    play: ['0 0 24 24', false, 'M7 4.5v15l12-7.5-12-7.5Z'],
    camadas: ['0 0 24 24', false, 'm12 2 10 5-10 5L2 7l10-5Z', 'm2 17 10 5 10-5', 'm2 12 10 5 10-5'],
  };

  function icone(nome, extraClass) {
    const def = ICONES[nome];
    if (!def) return document.createTextNode('');
    const [viewBox, solido, ...paths] = def;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', 'icon' + (solido ? ' is-solid' : '') + (extraClass ? ' ' + extraClass : ''));
    for (const d of paths) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      svg.append(p);
    }
    return svg;
  }

  /** Troca <span data-icon="nome"></span> pelo SVG correspondente. */
  function hidratarIcones(root = document) {
    root.querySelectorAll('[data-icon]').forEach((el) => {
      el.replaceWith(icone(el.dataset.icon, el.className));
    });
  }

  P.icone = icone;
  P.hidratarIcones = hidratarIcones;
})(window.PORTFOLIO);

/* ---------- Links para o GitHub (sem requisições de rede) ---------- */
(function (P) {
  'use strict';
  const enc = encodeURIComponent;
  const caminho = (p) => String(p).split('/').map(enc).join('/');

  P.github = {
    urlRepo: (full) => `https://github.com/${full}`,
    urlCommit: (full, sha) => `https://github.com/${full}/commit/${enc(sha)}`,
    urlPR: (full, n) => `https://github.com/${full}/pull/${enc(n)}`,
    urlIssue: (full, n) => `https://github.com/${full}/issues/${enc(n)}`,
    // Pastas (terminadas em "/") abrem em /tree; arquivos em /blob
    urlArquivo: (full, p, ref = 'main') =>
      `https://github.com/${full}/${String(p).endsWith('/') ? 'tree' : 'blob'}/${caminho(ref)}/${caminho(String(p).replace(/\/$/, ''))}`,
    urlPerfil: (login) => `https://github.com/${enc(login)}`,
  };
})(window.PORTFOLIO);

/* ---------- Cabeçalho, menu mobile e redes profissionais ---------- */
(function (P) {
  'use strict';
  const { h, $, $$ } = P.utils;
  const perfil = P.perfil || {};

  /* ---------- Redes profissionais (fonte única: assets/js/dados/perfil.js) ----------
     Regra do portfólio Fatec: apenas redes profissionais (GitHub, LinkedIn) —
     nada de e-mail, telefone ou outros dados pessoais. */
  const redes = (perfil.redes || []).filter((r) => r && r.url);
  const atributosExternos = { target: '_blank', rel: 'noopener noreferrer' };

  // Botões redondos: <span class="nav-social" data-redes="github linkedin">
  $$('[data-redes]').forEach((alvo) => {
    alvo.dataset.redes.split(/\s+/).forEach((id) => {
      const r = redes.find((x) => x.id === id);
      if (!r) return;
      alvo.append(h('a', {
        class: 'icon-btn', href: r.url, title: r.rotulo,
        'aria-label': `${r.rotulo} de ${perfil.nome} (abre em nova aba)`, ...atributosExternos,
      }, P.icone(r.icone)));
    });
  });

  // Cartões com rótulo (seção de contato): <div data-contato>
  $$('[data-contato]').forEach((alvo) => {
    redes.forEach((r) => {
      alvo.append(h('a', { class: 'contact-link', href: r.url, ...atributosExternos },
        h('span', { class: 'icon-wrap' }, P.icone(r.icone)),
        h('span', null, h('b', null, r.rotulo), h('em', null, r.usuario)),
        h('span', { class: 'sr-only' }, ' (abre em nova aba)'),
      ));
    });
  });

  // Links simples com href vindo do perfil: <a data-link="github">
  $$('a[data-link]').forEach((a) => {
    const r = redes.find((x) => x.id === a.dataset.link);
    if (r) a.href = r.url;
  });

  $$('[data-ano]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  P.hidratarIcones();

  /* ---------- Pausar animações (WCAG 2.2.2) ----------
     Botão no cabeçalho; a escolha fica guardada neste navegador. Quem já pede
     "menos movimento" no sistema não vê o botão (as animações já ficam desligadas). */
  const alvoPausa = $('.site-header .nav-social');
  if (alvoPausa && !P.utils.reduzMovimento()) {
    const CHAVE = 'portfolio:sem-animacao';
    let pausado = false;
    try { pausado = localStorage.getItem(CHAVE) === '1'; } catch (e) { /* armazenamento indisponível */ }
    const btnPausa = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Pausar animações', title: 'Pausar animações' });
    const aplicarPausa = () => {
      document.documentElement.classList.toggle('sem-animacao', pausado);
      btnPausa.setAttribute('aria-pressed', String(pausado));
      btnPausa.replaceChildren(P.icone(pausado ? 'play' : 'pausa'));
    };
    btnPausa.addEventListener('click', () => {
      pausado = !pausado;
      try { localStorage.setItem(CHAVE, pausado ? '1' : '0'); } catch (e) { /* armazenamento indisponível */ }
      aplicarPausa();
    });
    alvoPausa.prepend(btnPausa);
    aplicarPausa();
  }

  /* ---------- Cabeçalho: fundo ao rolar + parallax do fundo ---------- */
  const header = $('.site-header');
  const bg = $('#bg');
  const reduz = P.utils.reduzMovimento();
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (header) header.classList.toggle('is-scrolled', y > 20);
      if (bg && !reduz) bg.style.transform = `translate3d(0, ${-Math.min(y * 0.04, window.innerHeight * 0.03)}px, 0) scale(1.06)`;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const toggle = $('.menu-toggle');
  const menu = $('#menu');
  if (header && toggle && menu) {
    const setMenu = (aberto) => {
      header.classList.toggle('is-open', aberto);
      toggle.setAttribute('aria-expanded', String(aberto));
      toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    };
    toggle.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    header.addEventListener('focusout', (e) => {
      if (header.classList.contains('is-open') && !header.contains(e.relatedTarget)) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
    });
    const desktop = window.matchMedia('(min-width: 861px)');
    const aoMudar = (e) => { if (e.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', aoMudar);
  }

  /* ---------- Link ativo no menu conforme a seção visível (página inicial) ----------
     Ativa = a última seção cujo topo passou da metade da tela; no fim da página, a última. */
  const linksInternos = $$('.site-nav .nav-link[href^="#"]');
  const secoesMenu = linksInternos.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  if (secoesMenu.length) {
    let agendadoMenu = false;
    let atualMenu;
    const marcarMenu = () => {
      agendadoMenu = false;
      let ativo = null;
      for (const sec of secoesMenu) if (sec.getBoundingClientRect().top <= window.innerHeight * 0.5) ativo = sec.id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) ativo = secoesMenu[secoesMenu.length - 1].id;
      if (ativo === atualMenu) return;
      atualMenu = ativo;
      linksInternos.forEach((a) => {
        const sim = a.getAttribute('href') === `#${ativo}`;
        a.classList.toggle('is-active', sim);
        if (sim) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', () => { if (!agendadoMenu) { agendadoMenu = true; requestAnimationFrame(marcarMenu); } }, { passive: true });
    window.addEventListener('resize', marcarMenu, { passive: true });
    marcarMenu();
  }
})(window.PORTFOLIO);

/* ---------- Elementos (Ar, Terra, Fogo, Água): partículas e troca por seção ---------- */
(function (P) {
  'use strict';
  const { $, $$ } = P.utils;
  const reduz = P.utils.reduzMovimento();
  const pequeno = window.matchMedia('(max-width: 760px)').matches;

  /* ---------- Partículas ---------- */
  function particulas(alvo, qtd, classe, props) {
    if (!alvo || reduz) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < qtd; i++) {
      const s = document.createElement('span');
      s.className = classe;
      const valores = props(i);
      for (const k in valores) s.style.setProperty(k, valores[k]);
      frag.append(s);
    }
    alvo.append(frag);
  }

  const coresFolha = ['var(--terra)', 'var(--ar)', '#8A8640', 'var(--fogo)'];
  particulas($('#leaves'), pequeno ? 6 : 10, 'leaf', (i) => ({
    '--x': Math.random() * 70 + '%',
    '--d': 16 + Math.random() * 14 + 's',
    '--delay': -Math.random() * 30 + 's',
    '--c': coresFolha[i % coresFolha.length],
  }));
  particulas($('#embers'), pequeno ? 14 : 26, 'ember', () => ({
    '--x': Math.random() * 100 + '%',
    '--s': 3 + Math.random() * 5 + 'px',
    '--sw': Math.random() * 120 - 60 + 'px',
    '--d': 5 + Math.random() * 6 + 's',
    '--delay': -Math.random() * 10 + 's',
  }));
  particulas($('#bubbles'), pequeno ? 8 : 14, 'bubble', () => ({
    '--x': Math.random() * 100 + '%',
    '--s': 8 + Math.random() * 20 + 'px',
    '--d': 12 + Math.random() * 10 + 's',
    '--delay': -Math.random() * 20 + 's',
  }));

  /* ---------- Elemento ativo por seção ---------- */
  if (document.body.hasAttribute('data-el-fixo')) return;

  const etapas = $$('[data-el]:is(section, footer)');
  const trilho = $$('.rail a');
  if (!etapas.length) return;

  let atual = '';
  let ticking = false;
  function definirElemento() {
    ticking = false;
    const noFim = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let el = etapas[0].dataset.el;
    for (const s of etapas) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.5) el = s.dataset.el;
    }
    if (noFim) el = etapas[etapas.length - 1].dataset.el;
    if (el === atual) return;
    atual = el;
    document.body.dataset.el = el;
    trilho.forEach((a) => {
      const ativo = a.dataset.el === el;
      a.classList.toggle('is-active', ativo);
      if (ativo) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(definirElemento); }
  }, { passive: true });
  window.addEventListener('resize', definirElemento, { passive: true });
  definirElemento();
})(window.PORTFOLIO);

/* ---------- Revelar ao rolar ---------- */
(function (P) {
  'use strict';
  const suportado = 'IntersectionObserver' in window && !P.utils.reduzMovimento();
  let io = null;

  if (suportado) {
    document.documentElement.classList.add('has-reveal');
    io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
  }

  /** Observa elementos .reveal (inclusive os criados depois, via JS). */
  function observar(root = document) {
    const els = root.matches && root.matches('.reveal') ? [root] : [...root.querySelectorAll('.reveal')];
    els.forEach((el) => { if (io) io.observe(el); else el.classList.add('is-in'); });
  }

  observar();
  P.reveal = observar;
})(window.PORTFOLIO);
