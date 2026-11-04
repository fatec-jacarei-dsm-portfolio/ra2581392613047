/* ==========================================================================
   ESTUDO DE CASO · CRM de Gestão de Leads (3DSM – 1º Sem. 2026)
   Carregado só em projeto.html?p=abp-3dsm-2026-1. O resumo (nome, semestre, capa,
   contribuição resumida, estatísticas) fica em dados/projetos.js.

   Evidências das contribuições (texto simples, viram links para o GitHub):
     'c808945' → commit · 'PR #1' → pull request · 'issue #6' → issue
     'pasta/arquivo.ext' → arquivo · 'docs/' → pasta · 'branch:caminho' → outra branch
     'https://…' → link completo (ex.: commit no fork pessoal)
   ========================================================================== */
window.PORTFOLIO = window.PORTFOLIO || {};
PORTFOLIO.estudos = PORTFOLIO.estudos || {};

PORTFOLIO.estudos['abp-3dsm-2026-1'] = {
  resumo: [
    'Sistema web de gestão de leads com dashboard analítico, desenvolvido na ABP do 3º semestre para a 1000 Valle Multimarcas, revendedora de veículos com várias lojas.',
    'A plataforma organiza o funil de vendas em um Kanban, diferencia o acesso por perfil (Atendente, Gerente, Gerente Geral e Administrador) e calcula indicadores de conversão, origem e desempenho por atendente.',
  ],
  problema: 'A revendedora recebe contatos de potenciais compradores por vários canais (loja, telefone, WhatsApp, Instagram e formulários) e tinha dificuldade para associar leads a lojas e atendentes, acompanhar as negociações e consolidar indicadores gerenciais. O desafio pedia um sistema feito do zero, com modelagem relacional, regras de negócio explícitas e controle de acesso hierárquico validado no back-end.',
  solucao: 'Aplicação web full stack em TypeScript: uma SPA React (Vite + Tailwind CSS) consome uma API REST Express em camadas (rotas, middlewares, controllers, services e repositories) com Prisma e PostgreSQL, e o ambiente sobe via Docker Compose. Os leads percorrem um Kanban de seis estágios com arrastar-e-soltar, podem ser delegados e são arquivados ao final do funil; dashboards por perfil calculam KPIs e gráficos com filtros de período, e operações em leads e colaboradores geram uma trilha de auditoria.',
  funcionalidades: [
    {
      titulo: 'Autenticação com JWT',
      descricao: 'Login por e-mail e senha com hash bcrypt e token JWT com expiração; no front, contexto de autenticação e rotas protegidas.',
      estado: 'implementado',
    },
    {
      titulo: 'Pipeline de leads em Kanban',
      descricao: 'Seis estágios (Novo, Em atendimento, Agendado, Em negociação, Vendido e Perdido) com arrastar-e-soltar, importância, origem, responsável e contadores por etapa.',
      estado: 'implementado',
    },
    {
      titulo: 'Delegação de leads',
      descricao: 'Gestores escolhem o novo responsável entre os usuários atribuíveis e reatribuem o lead pelo modal de delegação (a restrição por perfil ficou só no front).',
      estado: 'implementado',
    },
    {
      titulo: 'Arquivamento e histórico',
      descricao: 'Leads vendidos ou perdidos são arquivados em lote, consultados numa visão de arquivados filtrada por perfil e podem voltar ao funil.',
      estado: 'implementado',
    },
    {
      titulo: 'Dashboards gerenciais por perfil',
      descricao: 'KPIs (total, leads quentes, vendas e conversão), gráficos por origem, status e mês e ranking por atendente, com filtros de semana, mês, ano e período.',
      estado: 'implementado',
    },
    {
      titulo: 'Relatório de vendas',
      descricao: 'Totais, convertidos, taxa de conversão e leads em aberto, com filtros por situação e intervalo de datas.',
      estado: 'implementado',
    },
    {
      titulo: 'Gestão de colaboradores',
      descricao: 'Busca, filtro por perfil, paginação, edição inline e exclusão bloqueada enquanto o colaborador tiver leads atribuídos.',
      estado: 'implementado',
    },
    {
      titulo: 'Logs de auditoria',
      descricao: 'Operações em leads e colaboradores ficam registradas para o Administrador, com busca e filtro; login e outras entidades ainda não geram log.',
      estado: 'parcial',
    },
    {
      titulo: 'Controle de acesso por perfil (RBAC)',
      descricao: 'A listagem de leads é filtrada por perfil e menu e rotas são filtrados no front, mas parte das rotas do back-end ainda não checa o perfil.',
      estado: 'parcial',
    },
    {
      titulo: 'Indicadores avançados e filtros validados',
      descricao: 'Validação do período no back-end, motivos de finalização e tempo médio de atendimento ficaram no backlog.',
      estado: 'planejado',
    },
  ],
  arquitetura: {
    visaoGeral: 'Monorepo com o front-end React em public/ e a API REST Node.js/Express em server/, ambos em TypeScript, com PostgreSQL acessado via Prisma. O back-end segue camadas (rotas → middlewares de autenticação e autorização → controllers → services com validação Zod → repositories Prisma) e usa os padrões Singleton (PrismaClient) e Decorator (log de hash de senha e JWT). No front, rotas protegidas por permissão e hooks como o useLeads concentram o consumo da API. O Docker Compose sobe banco, API, front e pgAdmin numa rede própria.',
    componentes: [
      {
        nome: 'SPA React',
        tecnologia: 'React · TypeScript · Vite · Tailwind CSS · Recharts · dnd-kit',
        responsabilidade: 'Kanban de leads, dashboards, relatório, colaboradores e logs, com rotas protegidas e filtradas por permissão.',
      },
      {
        nome: 'Camada de dados do front',
        tecnologia: 'fetch + JWT · mock em localStorage · hooks',
        responsabilidade: 'Cliente HTTP autenticado, atualização otimista e alternância para um mock da API por configuração.',
      },
      {
        nome: 'API REST',
        tecnologia: 'Node.js · Express · TypeScript',
        responsabilidade: 'Endpoints de autenticação, leads, colaboradores, auditoria, documentos, financeiro e agenda.',
      },
      {
        nome: 'Serviços e domínio',
        tecnologia: 'Services · contratos de repositório · Zod',
        responsabilidade: 'Visibilidade de leads por perfil, delegação, arquivamento, gestão de colaboradores e auditoria.',
      },
      {
        nome: 'Persistência',
        tecnologia: 'Prisma ORM · PostgreSQL',
        responsabilidade: 'Usuários, perfis e equipes, leads com enum de status e arquivamento, logs de auditoria e demais módulos.',
      },
      {
        nome: 'Infraestrutura local',
        tecnologia: 'Docker Compose · pgAdmin',
        responsabilidade: 'Ambiente padronizado com volumes persistentes para banco, API e front.',
      },
    ],
  },
  stack: [
    {
      categoria: 'Front-end',
      itens: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router', 'Recharts', 'dnd-kit'],
    },
    { categoria: 'Back-end', itens: ['Node.js', 'Express', 'TypeScript', 'Zod', 'JWT', 'bcrypt'] },
    { categoria: 'Banco de dados', itens: ['PostgreSQL', 'Prisma ORM'] },
    { categoria: 'Infraestrutura', itens: ['Docker', 'Docker Compose', 'pgAdmin'] },
    {
      categoria: 'Processo e ferramentas',
      itens: ['Scrum', 'BDD (critérios de aceite)', 'Git e GitHub', 'Figma', 'ESLint'],
    },
  ],
  linguagens: { TypeScript: 576456, CSS: 1604, JavaScript: 880, Dockerfile: 655, HTML: 362 },
  linguagensData: '2026-11-03',
  contribuicoes: [
    {
      area: 'Front-end',
      titulo: 'Kanban de leads com arrastar-e-soltar',
      descricao: 'Desenvolvi a tela de Leads: quadro Kanban de seis estágios com arrastar-e-soltar (dnd-kit), cards com importância, origem e responsável, formulário de cadastro, modais de edição e de delegação, contadores por etapa e visão de arquivados. Criei o hook useLeads, que centraliza as chamadas à API com atualização otimista, recarga em caso de erro e sincronização a cada 5 s, pausada durante o arraste.',
      evidencias: [
        '0898269',
        '89ff629',
        'PR #28',
        'public/src/pages/LeadsPage.tsx',
        'public/src/hooks/useLeads.ts',
        'public/src/components/Lead/DelegationManager.tsx',
      ],
    },
    {
      area: 'Back-end',
      titulo: 'API de leads em camadas (Express + Prisma)',
      descricao: 'Criei o módulo de leads seguindo a arquitetura do projeto (contrato LeadRepository, PrismaLeadRepository, LeadService com validação Zod e LeadController), com listagem filtrada por perfil, criação, edição, troca de status, delegação e lista de usuários atribuíveis. As regras de delegação por perfil da versão original se perderam num merge de junho e não voltaram na reescrita do serviço.',
      evidencias: [
        '89ff629',
        '1b89d46',
        'server/src/services/LeadService.ts',
        'server/src/repositories/PrismaLeadRepository.ts',
        'server/src/controllers/LeadController.ts',
      ],
    },
    {
      area: 'Back-end · Banco',
      titulo: 'Arquivamento do funil e status como enum',
      descricao: 'Implementei o arquivamento de ponta a ponta: arquivar vendidos e perdidos em lote (restrito a gestores), listar arquivados respeitando o perfil e devolver ao funil, com botão e visão no front. Escrevi a migration que cria o enum LeadStatus convertendo a coluna de texto sem perder dados, com índice no arquivamento.',
      evidencias: [
        '1bcba49',
        '1b89d46',
        'PR #44',
        'server/prisma/migrations/20260608120000_sprint2_lead_status_enum_archive/migration.sql',
        'docs/SPRINT2_PROGRESS.md',
      ],
    },
    {
      area: 'Front-end · Dados',
      titulo: 'Dashboards gerenciais com dados reais',
      descricao: 'Conectei à API os dashboards do Gerente de Loja e do Gerente Geral, cujos layouts iniciais (de um colega) usavam números fixos: introduzi o Recharts e passei a calcular KPIs, gráficos por origem, status e mês, distribuição por importância e ranking por atendente, com filtros de período. Também criei a aba de Relatórios.',
      evidencias: [
        'f7874ec',
        'de9b424',
        'PR #35',
        'public/src/components/DashboardGerenteGeral/DashboardGerenteGeral.tsx',
        'public/src/components/DashboardGerenteLoja/DashboardGerenteLoja.tsx',
      ],
    },
    {
      area: 'Full stack',
      titulo: 'Colaboradores, permissões no front e auditoria',
      descricao: 'Criei o PermissionRoute e o hook usePermissions e defini as restrições por perfil sobre o mapa de permissões de um colega. Reestruturei a página de Colaboradores (busca, filtro, paginação e edição inline) e criei a tela de Logs do Administrador, ligada ao back-end de auditoria. No back-end, adicionei a exclusão de colaborador com bloqueio 409 para quem ainda tem leads e deixei de expor o hash de senha nos logs.',
      evidencias: [
        '89ff629',
        '1ee128d',
        '3bad18b',
        'public/src/components/Auth/PermissionRoute.tsx',
        'public/src/pages/LogsPage.tsx',
        'server/src/services/CollaboratorService.ts',
      ],
    },
    {
      area: 'UI · Front-end',
      titulo: 'Protótipo no Figma e telas da aplicação',
      descricao: 'Fui responsável pela história do protótipo no Figma. Configurei o Tailwind CSS, criei os componentes iniciais (MetricCard, LeadCard, LeadForm, Navbar) e as telas de landing page, unidades, catálogo, configurações, notificações e recuperação de senha, e estilizei as telas de login e cadastro. Parte dessas telas segue com dados de exemplo.',
      evidencias: [
        'c7b230b',
        '63247e0',
        'b50425b',
        'PR #13',
        'docs/assets/frontend-figma.pdf',
        'public/src/pages/HomePage.tsx',
      ],
    },
    {
      area: 'DX',
      titulo: 'Mock da API, seeds e CORS',
      descricao: 'Criei um mock da API persistido em localStorage, com as mesmas assinaturas do cliente HTTP e ativado por variável de ambiente, para testar as telas com os quatro perfis sem back-end, alimentado pelo CSV de leads fictícios da equipe. Ampliei o seed com equipes e usuários de cada perfil e configurei o CORS para o front em Docker e no Vite local.',
      evidencias: ['dff8da8', '31cd92a', '9270726', 'public/src/services/mockApi.ts', 'server/src/seed.ts'],
    },
    {
      area: 'Front-end · Back-end',
      titulo: 'Evolução no meu fork (não integrada)',
      descricao: 'Depois do fim da Sprint 3, deixei no meu fork uma evolução que não chegou ao repositório da equipe: painel de leads arquivados com métricas e arquivamento automático de perdidos após 30 dias, cadastro único de origens com ícones e cores, e a correção das migrations que estavam inconsistentes com o schema.',
      evidencias: [
        'https://github.com/MyNameisNunes/3DSM-ABP-2026-1/commit/437e97f',
        'https://github.com/MyNameisNunes/3DSM-ABP-2026-1/blob/dev-thiago/public/src/components/Lead/ArchiveLeads.tsx',
        'https://github.com/MyNameisNunes/3DSM-ABP-2026-1/blob/dev-thiago/public/src/lib/leadOrigins.tsx',
      ],
    },
  ],
  metodologia: 'Scrum com 3 sprints definidas no cronograma do desafio, com Product Owner e Scrum Master. O product backlog foi organizado em épicos e histórias com critérios de aceite em BDD (Dado/Quando/Então), sprint backlog, Definition of Done, burndown e retrospectivas. No GitHub, cada integrante trabalhou na própria branch (a minha: dev-thiago) e integrou por pull request: foram 46 PRs, 41 mesclados.',
  sprints: [
    {
      nome: 'Sprint 1 · Fundação e autenticação',
      periodo: '24 mar. – 14 abr. 2026',
      objetivo: 'Arquitetura base em containers, modelagem inicial e ciclo de autenticação.',
      entregas: [
        'Docker Compose com PostgreSQL, back-end e front-end',
        'Login com JWT e bcrypt e rotas privadas no front',
        'Protótipo de alta fidelidade no Figma e configuração do Tailwind com as primeiras telas (Thiago)',
      ],
    },
    {
      nome: 'Sprint 2 · Gestão de leads',
      periodo: '15 abr. – 21 maio 2026',
      objetivo: 'Funil de vendas com controle de estágios e isolamento de dados por perfil.',
      entregas: [
        'Cadastro e gerenciamento de leads e controle de acesso por perfil',
        'Kanban com arrastar-e-soltar, API de leads e dashboards ligados à API (Thiago)',
        'Gestão de estágios, status e importância (história sob minha responsabilidade)',
      ],
    },
    {
      nome: 'Sprint 3 · Análise e auditoria',
      periodo: '22 maio – 11 jun. 2026',
      objetivo: 'Indicadores, trilha de auditoria e fechamento dos artefatos UML.',
      entregas: [
        'Artefatos UML e documentação arquitetural',
        'Arquivamento de leads, tela de logs e exclusão segura de colaboradores (Thiago, PR #44)',
        'Módulos de agenda, documentos e financeiro (Davi)',
      ],
    },
  ],
  equipe: [
    {
      nome: 'Thiago Nunes Alves do Prado',
      github: 'MyNameisNunes',
      papel: 'Dev Team · front-end e módulo de leads',
    },
    { nome: 'Vinícius de Oliveira', github: 'ViniciusLedro', papel: 'Product Owner' },
    { nome: 'Márcio Bueno', github: 'marcinbuenoo', papel: 'Scrum Master' },
    { nome: 'Davi Snaider', github: 'davisnaider06', papel: 'Dev Team' },
    { nome: 'Eric França', github: 'Ericfranca90', papel: 'Dev Team' },
    { nome: 'Pedro Rosa', github: 'PedHr', papel: 'Dev Team' },
  ],
  desafios: [
    {
      desafio: 'Manter o Kanban consistente ao arrastar cards (problema registrado na retrospectiva da Sprint 2).',
      abordagem: 'No hook useLeads, a mudança de estágio é aplicada de forma otimista no estado local, com recarga em caso de erro e sincronização a cada 5 s, pausada durante o arraste.',
    },
    {
      desafio: 'Padronizar os estágios do funil, antes gravados como texto livre.',
      abordagem: 'Migration que cria o enum LeadStatus e converte a coluna com ALTER COLUMN … USING, sem recriar a coluna, espelhada nos schemas Zod do serviço.',
    },
    {
      desafio: 'Excluir colaboradores sem apagar seus leads em cascata.',
      abordagem: 'A exclusão conta os leads atribuídos e responde 409 pedindo reatribuição; no mesmo commit, os logs deixaram de expor o hash de senha.',
    },
    {
      desafio: 'Integrar o arquivamento, desenvolvido sobre uma base desatualizada e em duas máquinas.',
      abordagem: 'O merge deixou o schema com o modelo Lead duplicado e o serviço de leads vazio; reescrevi schema e serviço e sincronizei com a main. A reconstrução, porém, não reaplicou as regras de delegação por perfil, e essa lacuna ficou na versão final.',
    },
    {
      desafio: 'Testar as telas com os quatro perfis e um volume realista de leads sem depender do back-end.',
      abordagem: 'Mock da API com as mesmas assinaturas do cliente HTTP, persistido em localStorage, ativado por variável de ambiente e semeado com o CSV de leads fictícios da equipe.',
    },
    {
      desafio: 'O front no container (porta 3002) e no Vite local (5173) era bloqueado por CORS.',
      abordagem: 'CORS com lista de origens permitidas, aceitando requisições sem origem (como health checks) e com credentials habilitado.',
    },
  ],
  aprendizados: [
    'Depois de resolver um merge, comparar o resultado com a main (schema, services e rotas) evita regressões silenciosas, como a perda de regras de autorização.',
    'Autorização precisa ser garantida no back-end em todas as rotas: esconder ações no front não basta.',
    'Mudanças de tipo no banco devem vir em migrations que preservem os dados e ser espelhadas na validação da aplicação.',
    'Schema e migrations precisam evoluir juntos; alterar o schema sem gerar migration impede recriar o banco do zero.',
    'Um mock com as mesmas assinaturas da API facilita testar perfis e fluxos e permite trocar a fonte de dados por configuração.',
  ],
  galeria: [
    {
      src: 'assets/img/projetos/abp-3dsm-2026-1/diagrama-componentes-g.webp',
      mini: 'assets/img/projetos/abp-3dsm-2026-1/diagrama-componentes-m.webp',
      largura: 1800,
      altura: 1632,
      alt: 'Diagrama de componentes do fluxo de autenticação',
      legenda: 'Diagrama de componentes da autenticação: serviço, repositório e infraestrutura de segurança.',
    },
    {
      src: 'assets/img/projetos/abp-3dsm-2026-1/diagrama-sequencia-login-g.webp',
      mini: 'assets/img/projetos/abp-3dsm-2026-1/diagrama-sequencia-login-m.webp',
      largura: 1800,
      altura: 1355,
      alt: 'Diagrama de sequência do login',
      legenda: 'Diagrama de sequência do login: busca do usuário, comparação do hash e geração do token.',
    },
    {
      src: 'assets/img/projetos/abp-3dsm-2026-1/diagrama-classes-g.webp',
      mini: 'assets/img/projetos/abp-3dsm-2026-1/diagrama-classes-m.webp',
      largura: 1400,
      altura: 2489,
      alt: 'Diagrama de classes do modelo conceitual',
      legenda: 'Diagrama de classes do modelo conceitual inicial: usuário, equipe, líder de equipe, vendedor, carro, origem do lead, lead e venda.',
    },
    {
      src: 'assets/img/projetos/abp-3dsm-2026-1/burndown-sprint1-g.webp',
      mini: 'assets/img/projetos/abp-3dsm-2026-1/burndown-sprint1-m.webp',
      largura: 602,
      altura: 381,
      alt: 'Gráfico de burndown da Sprint 1',
      legenda: 'Burndown da Sprint 1: de 61 pontos no dia 0 a zero no dia 12, com o realizado acompanhando o estimado.',
    },
  ],
  links: [
    {
      rotulo: 'README do projeto',
      url: 'https://github.com/CRIMS0NC0DE/3DSM-ABP-2026-1/blob/main/README.md',
      icone: 'arquivo',
      destaque: true,
    },
    {
      rotulo: 'Documentação (docs/)',
      url: 'https://github.com/CRIMS0NC0DE/3DSM-ABP-2026-1/tree/main/docs',
      icone: 'camadas',
    },
    {
      rotulo: 'Meu fork (branch dev-thiago)',
      url: 'https://github.com/MyNameisNunes/3DSM-ABP-2026-1/tree/dev-thiago',
      icone: 'fork',
    },
  ],
  comoRodar: [
    '# Banco, API, front e pgAdmin (Docker)',
    'docker compose -f docker-compose.dev.yml up --build',
    '# → API em http://localhost:3001 · front em http://localhost:3002 · pgAdmin em http://localhost:5050',
  ],
};
