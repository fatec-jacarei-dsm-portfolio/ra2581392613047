/* ==========================================================================
   Página inicial — monta Apresentação, Projetos (Acadêmicos / Profissionais /
   Pessoais) e Informações complementares a partir de assets/js/dados/*.js
   ========================================================================== */
(function (P) {
  'use strict';
  const { h, $, num } = P.utils;
  const perfil = P.perfil || {};
  const destaques = (P.projetos || []).slice();
  const repos = (P.repositorios || []).slice();
  const externo = { target: '_blank', rel: 'noopener noreferrer' };

  const CATEGORIAS = [
    { id: 'academico', ancora: 'academicos', titulo: 'Acadêmicos', icone: 'camadas',
      descricao: 'Projetos Integradores (ABP) e trabalhos das disciplinas do curso de DSM na Fatec Jacareí.' },
    { id: 'profissional', ancora: 'profissionais', titulo: 'Profissionais', icone: 'ferramenta',
      descricao: 'Experiência como desenvolvedor e projetos feitos em contexto profissional.' },
    { id: 'pessoal', ancora: 'pessoais', titulo: 'Pessoais', icone: 'lampada',
      descricao: 'Estudos e ideias próprias, feitos por conta própria para aprender e experimentar.' },
  ];
  const AREAS = { web: 'Web', mobile: 'Mobile', backend: 'Back-end', dados: 'Dados', iot: 'IoT', devops: 'DevOps', estudos: 'Estudos', outro: 'Ferramentas' };

  /* ---------- Peças reutilizáveis ---------- */
  const techList = (itens) => (itens && itens.length
    ? h('ul', { class: 'tech-list', 'aria-label': 'Tecnologias utilizadas' }, itens.map((t) => h('li', { class: 'tech' }, t)))
    : null);

  const contribBox = (texto) => (texto
    ? h('div', { class: 'contrib-box' }, h('b', null, P.icone('alvo'), 'Minha contribuição'), h('p', null, texto))
    : null);

  const linkRepo = (url, nome) => h('a', { href: url, ...externo },
    P.icone('github'), 'Repositório', h('span', { class: 'sr-only' }, ` de ${nome} no GitHub (abre em nova aba)`));

  /* ---------- Apresentação ---------- */
  const ap = $('#apresentacao');
  if (ap) (perfil.apresentacao || []).forEach((p) => ap.append(h('p', null, p)));
  const obj = $('#objetivo');
  if (obj) obj.textContent = perfil.objetivo || '';
  const ints = $('#interesses');
  if (ints) {
    (perfil.interesses || []).forEach((i) => ints.append(
      h('li', null, h('span', { class: 'interest-icon' }, P.icone(i.icone || 'alvo')),
        h('div', null, h('b', null, i.titulo), i.descricao ? h('span', null, i.descricao) : null)),
    ));
  }

  const stats = $('#hero-stats');
  if (stats) {
    const abps = destaques.filter((p) => p.abp).length;
    const commits = destaques.reduce((a, p) => a + ((p.estatisticas && p.estatisticas.commits) || 0), 0);
    [
      [destaques.length + repos.length, 'projetos'],
      [abps, abps === 1 ? 'ABP em destaque' : 'ABPs em destaque'],
      [num(commits), 'commits nos destaques'],
    ].forEach(([v, r]) => stats.append(h('div', null, h('dt', null, r), h('dd', null, String(v)))));
  }

  /* ---------- Cards de projeto ---------- */
  function cardDestaque(p) {
    const url = `projeto.html?p=${encodeURIComponent(p.slug)}`;
    const e = p.estatisticas || {};
    const stat = (valor, rotulo) => (valor || valor === 0
      ? h('div', null, h('dt', null, rotulo), h('dd', null, num(valor))) : null);
    return h('article', { class: 'feature', 'data-cor': p.cor, 'aria-labelledby': `t-${p.slug}` },
      h('a', { class: 'feature-media', href: url, tabindex: '-1', 'aria-hidden': 'true' },
        p.capa ? h('img', {
          src: p.capa.mini || p.capa.src, alt: '', width: p.capa.largura, height: p.capa.altura, loading: 'lazy', decoding: 'async',
          srcset: p.capa.mini ? `${p.capa.mini} 640w, ${p.capa.src} ${p.capa.largura}w` : null,
          sizes: '(min-width: 900px) 600px, 100vw',
          style: p.capa.posicao ? { 'object-position': p.capa.posicao } : null,
        }) : null,
        (p.capa && p.capa.semSelo) ? null : h('span', { class: 'media-tag' }, p.abp ? 'Projeto Integrador · ABP' : (p.rotuloCapa || 'Estudo de caso'))),
      h('div', { class: 'feature-body' },
        h('div', { class: 'badges' },
          h('span', { class: 'badge is-solid' }, p.semestre),
          p.status ? h('span', { class: 'status', 'data-status': p.status.tipo }, p.status.rotulo) : null,
          p.repo.privado ? h('span', { class: 'badge' }, 'Repositório privado') : null),
        h('h5', { id: `t-${p.slug}` }, h('a', { href: url }, p.nome)),
        h('p', { class: 'feature-tagline' }, p.tagline),
        contribBox(p.contribuicaoResumo),
        h('dl', { class: 'feature-stats' },
          stat(e.commits, 'commits meus'),
          stat(e.prs, e.prs === 1 ? 'pull request' : 'pull requests'),
          stat(p.pessoas, p.pessoas === 1 ? 'pessoa' : 'pessoas na equipe')),
        techList(p.tecnologiasPrincipais),
        h('div', { class: 'feature-actions' },
          h('a', { class: 'btn btn-primary btn-sm', href: url }, 'Ver estudo de caso', P.icone('seta')),
          h('a', { class: 'btn btn-ghost btn-sm', href: p.repo.url, ...externo }, P.icone('github'), 'Repositório',
            h('span', { class: 'sr-only' }, ' (abre em nova aba)'))),
      ));
  }

  function cardRepo(r, i, nivel = 'h4') {
    return h('article', { class: 'proj-card', style: { '--i': i } },
      h('div', { class: 'proj-top' },
        h('span', { class: 'badge' }, r.semestre),
        h('span', { class: 'proj-area' }, AREAS[r.area] || '')),
      h(nivel, null, r.nome),
      r.contexto ? h('p', { class: 'proj-context' }, r.contexto) : null,
      h('p', { class: 'proj-desc' }, r.descricao),
      contribBox(r.contribuicao),
      techList(r.tecnologias),
      h('div', { class: 'proj-links' },
        linkRepo(P.github.urlRepo(r.repo), r.nome),
        r.demo ? h('a', { href: r.demo, ...externo }, P.icone('demo'), 'Ver online', h('span', { class: 'sr-only' }, ' (abre em nova aba)')) : null),
    );
  }

  function cardExperiencia(e, nivel = 'h4') {
    return h('article', { class: 'proj-card exp-card' },
      h('div', { class: 'proj-top' }, h('span', { class: 'badge is-solid' }, e.periodo || 'Atual'), h('span', { class: 'proj-area' }, 'Experiência')),
      h(nivel, null, e.cargo),
      e.empresa ? h('p', { class: 'proj-context' }, e.empresa) : null,
      h('p', { class: 'proj-desc' }, e.descricao),
      techList(e.tecnologias),
    );
  }

  /* ---------- Lista por categoria ---------- */
  const ordemSemestre = (s) => {
    // "4DSM – 2º Sem. 2026" ou "2º Sem. 2026" → 20262 (para ordenar do mais recente ao mais antigo)
    const m = /(\d)º Sem\. (\d{4})/.exec(s || '');
    return m ? Number(m[2]) * 10 + Number(m[1]) : 0;
  };
  const porRecencia = (a, b) => ordemSemestre(b.semestre) - ordemSemestre(a.semestre) || (b.destaque || 0) - (a.destaque || 0);

  const lista = $('#projetos-lista');
  const navCat = $('#proj-nav');
  if (lista) {
    CATEGORIAS.forEach((cat) => {
      const feats = destaques.filter((p) => p.categoria === cat.id)
        .sort((a, b) => (b.abp === true) - (a.abp === true) || porRecencia(a, b));
      const outros = repos.filter((r) => r.categoria === cat.id).sort(porRecencia);
      const exps = cat.id === 'profissional' ? (perfil.experiencias || []) : [];
      const total = feats.length + outros.length;

      if (navCat) {
        navCat.append(h('a', { class: 'chip', href: `#${cat.ancora}` }, cat.titulo, h('span', { class: 'count' }, String(total + exps.length))));
      }

      const grupo = h('section', { class: 'proj-group', id: cat.ancora, 'aria-labelledby': `cat-${cat.id}` },
        h('header', { class: 'proj-group-head' },
          h('h3', { id: `cat-${cat.id}` }, P.icone(cat.icone), cat.titulo),
          h('p', null, cat.descricao)));

      const abps = feats.filter((p) => p.abp);
      const outrosDestaques = feats.filter((p) => !p.abp);
      if (abps.length) {
        grupo.append(h('h4', { class: 'subgroup' }, 'Projetos Integradores (ABP)'),
          h('div', { class: 'features' }, abps.map(cardDestaque)));
      }
      if (outrosDestaques.length) {
        grupo.append(h('h4', { class: 'subgroup' }, cat.id === 'academico' ? 'Projeto em destaque' : 'Em destaque'),
          h('div', { class: 'features' }, outrosDestaques.map(cardDestaque)));
      }
      if (exps.length || outros.length) {
        if (feats.length) grupo.append(h('h4', { class: 'subgroup' }, cat.id === 'academico' ? 'Trabalhos das disciplinas' : 'Outros projetos'));
        // com rótulo de subgrupo (h4) acima, os cards são h5; sem ele, h4
        const nivel = feats.length ? 'h5' : 'h4';
        grupo.append(h('div', { class: 'proj-grid stagger' },
          exps.map((e) => cardExperiencia(e, nivel)), outros.map((r, i) => cardRepo(r, i, nivel))));
      }
      if (!total && !exps.length) {
        grupo.append(h('p', { class: 'empty-state' }, 'Em breve.'));
      }
      lista.append(grupo);
    });
    lista.append(h('div', { class: 'section-foot' },
      h('a', { class: 'btn btn-ghost', href: (perfil.githubUrl || 'https://github.com/MyNameisNunes') + '?tab=repositories', ...externo },
        P.icone('github'), 'Ver todos no GitHub', h('span', { class: 'sr-only' }, ' (abre em nova aba)'))));
  }

  /* ---------- Informações complementares ---------- */
  const grid = $('#complementares-grid');
  if (grid) {
    const card = (titulo, icone, conteudo, classe) => (conteudo
      ? h('article', { class: 'info-card' + (classe ? ' ' + classe : '') }, h('h3', null, P.icone(icone), titulo), conteudo)
      : null);

    const formacao = (perfil.formacao || []).length
      ? h('ul', { class: 'info-list' }, perfil.formacao.map((f) => h('li', null,
        h('b', null, f.curso), h('span', null, f.instituicao), f.periodo ? h('small', null, f.periodo) : null,
        f.status ? h('span', { class: 'status', 'data-status': f.statusTipo || 'andamento' }, f.status) : null)))
      : null;

    const conhecimentos = (perfil.conhecimentos || []).length
      ? h('div', { class: 'skill-groups' }, perfil.conhecimentos.map((g) => h('div', { class: 'skill-group' },
        h('h4', null, g.categoria), techList(g.itens))))
      : null;

    const cursos = (perfil.cursos || []).length
      ? h('ul', { class: 'info-list' }, perfil.cursos.map((c) => h('li', null,
        c.url ? h('b', null, h('a', { href: c.url, ...externo }, c.nome)) : h('b', null, c.nome),
        c.instituicao ? h('span', null, c.instituicao) : null, c.detalhe ? h('small', null, c.detalhe) : null)))
      : null;

    const idiomas = (perfil.idiomas || []).length
      ? h('ul', { class: 'info-list' }, perfil.idiomas.map((i) => h('li', null, h('b', null, i.idioma), h('span', null, i.nivel))))
      : null;

    const hobbies = (perfil.hobbies || []).length ? techList(perfil.hobbies) : null;

    [
      card('Formação acadêmica', 'camadas', formacao),
      card('Cursos e estudos', 'lampada', cursos),
      card('Conhecimentos técnicos', 'codigo', conhecimentos, 'is-wide'),
      card('Idiomas', 'pessoas', idiomas),
      card('Hobbies e interesses', 'alvo', hobbies),
    ].forEach((c) => { if (c) grid.append(c); });
  }

  P.hidratarIcones();
  if (P.reveal) P.reveal();
})(window.PORTFOLIO);
