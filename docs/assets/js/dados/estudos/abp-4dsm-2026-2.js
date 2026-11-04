/* ==========================================================================
   ESTUDO DE CASO · Passe: Controle de Acesso (4DSM – 2º Sem. 2026)
   Carregado só em projeto.html?p=abp-4dsm-2026-2. O resumo (nome, semestre, capa,
   contribuição resumida, estatísticas) fica em dados/projetos.js.

   Evidências das contribuições (texto simples, viram links para o GitHub):
     'c808945' → commit · 'PR #1' → pull request · 'issue #6' → issue
     'pasta/arquivo.ext' → arquivo · 'docs/' → pasta · 'branch:caminho' → outra branch
     'https://…' → link completo (ex.: commit no fork pessoal)
   ========================================================================== */
window.PORTFOLIO = window.PORTFOLIO || {};
PORTFOLIO.estudos = PORTFOLIO.estudos || {};

PORTFOLIO.estudos['abp-4dsm-2026-2'] = {
  resumo: [
    'O Passe é um sistema de controle de acesso: o morador abre a catraca lendo no celular um QR Code dinâmico exibido no terminal da catraca (ESP32 ou simulador web), ou aproximando uma tag NFC. A API decide cada tentativa, conferindo a autorização, o horário, o limite de usos e se a pessoa está perto da catraca.',
    'Feito em equipe na ABP do 4º semestre, o projeto junta app Flutter, API Node.js/TypeScript com Prisma e PostgreSQL, mensageria MQTT, firmware ESP32 e CI/CD no GitHub Actions. Está em desenvolvimento neste semestre.',
  ],
  problema: 'Prédios e condomínios precisam controlar quem passa em cada catraca, em que horário, quantas vezes e se a pessoa está mesmo no local. Hoje isso depende de portaria manual ou de crachás, que podem ser emprestados.',
  solucao: 'Toda a decisão fica na API. O terminal (ESP32 ou simulador web) exibe um QR assinado com HMAC, de uso único, trocado a cada 10 s; o app Flutter lê o código e envia o token, a localização do celular e o JWT do usuário. A API confere assinatura, validade, cadastro, autorização (período, horário e usos) e distância, registra o evento e manda ABRIR ou NEGAR ao terminal por MQTT, com consulta HTTP de reserva. A tag NFC passa pelas mesmas regras.',
  funcionalidades: [
    {
      titulo: 'Login por e-mail ou CPF',
      descricao: 'Sessão com JWT guardado em armazenamento seguro; o app restaura a sessão ao abrir e leva cada perfil ao seu menu.',
      estado: 'implementado',
    },
    {
      titulo: 'Menus e permissões por perfil',
      descricao: 'Administrador, controlador de acesso, morador e visitante, com as rotas da equipe protegidas na API.',
      estado: 'implementado',
    },
    {
      titulo: 'Acesso por QR Code dinâmico',
      descricao: 'Token curto assinado com HMAC-SHA256, de uso único e trocado a cada 10 s; o app mostra liberado ou negado com o motivo vindo da API.',
      estado: 'implementado',
    },
    {
      titulo: 'Checagem de proximidade',
      descricao: 'A API nega quem está além do raio da catraca (100 m por padrão, configurável) ou não enviou a localização.',
      estado: 'implementado',
    },
    {
      titulo: 'Acesso por tag NFC',
      descricao: 'O terminal envia o UID da tag e recebe ABRIR ou NEGAR, com as mesmas regras do QR Code.',
      estado: 'implementado',
    },
    {
      titulo: 'Decisão em tempo real via MQTT',
      descricao: 'A API publica a decisão no tópico do terminal (QoS 1); se o broker cair, o terminal consulta a decisão por HTTP.',
      estado: 'implementado',
    },
    {
      titulo: 'Histórico de tentativas',
      descricao: 'Cada tentativa, liberada ou negada, vira um evento com método, motivo e distância, filtrável por período, resultado, usuário e catraca.',
      estado: 'implementado',
    },
    {
      titulo: 'Identidade visual acessível',
      descricao: 'Tema Material 3 claro e escuro com paleta ajustada para contraste WCAG AA, fonte Inter embutida, botões de 56 dp e telas de resultado em tela cheia.',
      estado: 'implementado',
    },
    {
      titulo: 'Simulador web do terminal',
      descricao: 'Páginas servidas pela API que fazem o papel da catraca e das telas do app, para testar o fluxo sem hardware e sem rodar o Flutter.',
      estado: 'implementado',
    },
    {
      titulo: 'Gestão pela equipe no app',
      descricao: 'Painel, usuários, locais, autorizações, histórico e terminais integrados à API pelo menu do administrador; a versão para o controlador de acesso está na branch dev-thiago.',
      estado: 'parcial',
    },
    {
      titulo: 'Área do morador e do visitante',
      descricao: 'Minhas autorizações, histórico, acessos negados, perfil, minha tag NFC e ajuda, feitas na branch dev-thiago e ainda sem PR para a main.',
      estado: 'parcial',
    },
    {
      titulo: 'Terminal físico ESP32',
      descricao: 'Firmware que desenha o QR, lê NFC e aciona relé, LEDs e buzzer; compila no CI, mas a montagem e o teste no hardware estão pendentes (o fluxo foi validado com o simulador web).',
      estado: 'parcial',
    },
    {
      titulo: 'CI/CD e deploy na nuvem',
      descricao: 'GitHub Actions com lint, checagem de tipos e testes da API, análise e testes do app, build do firmware e da imagem Docker; a API é publicada no Render.',
      estado: 'implementado',
    },
  ],
  arquitetura: {
    visaoGeral: 'O app Flutter fala com a API REST usando JWT, e a API persiste os dados no PostgreSQL via Prisma. Cada decisão (ABRIR ou NEGAR) é publicada no broker MQTT, que o terminal ESP32 ou o simulador web escuta. Toda a regra de negócio fica no back-end: o terminal só exibe o código e obedece. No app, o código está dividido em views, controllers, services e models; na API, os módulos têm controller e service, e os repositórios são interfaces com implementação em Prisma (produção) e em memória (testes).',
    componentes: [
      {
        nome: 'App móvel',
        tecnologia: 'Flutter · Dart · Material 3 · mobile_scanner · geolocator',
        responsabilidade: 'Interface por perfil, sessão JWT, leitura do QR da catraca e envio da localização para a decisão.',
      },
      {
        nome: 'API REST',
        tecnologia: 'Node.js · TypeScript · Express · zod · JWT',
        responsabilidade: 'Módulos de autenticação, usuários, locais, autorizações, acesso, eventos e terminais, com um validador único para QR e NFC.',
      },
      {
        nome: 'Persistência',
        tecnologia: 'Prisma · PostgreSQL',
        responsabilidade: 'Usuários, tags NFC, locais (edifício, portaria, porta e catraca), terminais, autorizações, eventos e tokens de QR já usados.',
      },
      {
        nome: 'Mensageria',
        tecnologia: 'MQTT · Mosquitto (local) · EMQX Cloud',
        responsabilidade: 'Entrega ABRIR ou NEGAR no tópico de cada terminal (QoS 1), com consulta HTTP como reserva.',
      },
      {
        nome: 'Terminal IoT',
        tecnologia: 'ESP32 · C++/Arduino (PlatformIO) · MFRC522 · display',
        responsabilidade: 'Busca e desenha o QR a cada 10 s, lê tags NFC, aciona relé, LEDs e buzzer e envia heartbeat.',
      },
      {
        nome: 'Simulador e console web',
        tecnologia: 'HTML · CSS · JavaScript',
        responsabilidade: 'Simulam a catraca e as telas do app para testar o fluxo sem hardware e sem rodar o Flutter.',
      },
      {
        nome: 'CI/CD',
        tecnologia: 'GitHub Actions · Docker · GHCR · Render',
        responsabilidade: 'Lint, tipos, testes, teste de fumaça, build do firmware e da imagem Docker; a API roda no Render.',
      },
    ],
  },
  stack: [
    {
      categoria: 'Mobile',
      itens: ['Flutter', 'Dart', 'Material 3', 'flutter_secure_storage', 'mobile_scanner', 'geolocator'],
    },
    { categoria: 'Back-end', itens: ['Node.js', 'TypeScript', 'Express', 'Prisma', 'zod', 'JWT'] },
    { categoria: 'Banco de dados', itens: ['PostgreSQL'] },
    {
      categoria: 'IoT e mensageria',
      itens: ['ESP32', 'PlatformIO', 'MFRC522 (NFC)', 'MQTT', 'Mosquitto', 'EMQX Cloud'],
    },
    { categoria: 'Testes e qualidade', itens: ['flutter_test', 'Vitest', 'Supertest', 'ESLint'] },
    { categoria: 'DevOps', itens: ['Docker', 'Docker Compose', 'GitHub Actions', 'Render'] },
  ],
  linguagens: {
    Dart: 357004,
    TypeScript: 128078,
    JavaScript: 68104,
    C: 66165,
    'C++': 40666,
    CMake: 19825,
    CSS: 9907,
    HTML: 7046,
    PowerShell: 2904,
    Swift: 2534,
    Shell: 2374,
    Dockerfile: 1291,
    Kotlin: 124,
    'Objective-C': 38,
  },
  linguagensData: '2026-11-03',
  contribuicoes: [
    {
      area: 'Mobile · UI',
      titulo: 'Base do app Flutter e identidade visual',
      descricao: 'Organizei a estrutura do app em views, controllers, services e models. Criei o tema Material 3 claro e escuro com paleta ajustada para contraste WCAG AA, fonte Inter embutida e botões de 56 dp, além dos componentes reutilizáveis (menu em grade por perfil, botões, campos e tela de carregamento).',
      evidencias: [
        'b793cfc',
        'fa56c6d',
        '3be594b',
        'frontend/lib/core/theme/app_theme.dart',
        'frontend/lib/views/widgets/menu_grade.dart',
      ],
    },
    {
      area: 'Mobile',
      titulo: 'Login e menus por perfil',
      descricao: 'Criei a tela de login e os menus de administrador, controlador de acesso, morador e visitante, cada um com testes de widget. As primeiras versões usavam contas em memória; na integração, o login por e-mail ou CPF passou a usar a API.',
      evidencias: [
        'e0b7f6e',
        'fd578aa',
        'a80a755',
        'frontend/lib/views/user/login_view.dart',
        'frontend/test/views/user/login_view_test.dart',
      ],
    },
    {
      area: 'Integração',
      titulo: 'Integração do app com a API REST',
      descricao: 'Troquei as contas em memória por chamadas reais à API: o ApiClient envia o JWT, usa timeout de 10 s e transforma o erro padrão da API em mensagens para a tela; o SessaoService guarda e restaura a sessão. Para os testes, criei uma API falsa com o mesmo contrato do back-end e testes contra a API real.',
      evidencias: [
        'a80a755',
        'frontend/lib/services/api_client.dart',
        'frontend/lib/services/sessao_service.dart',
        'docs/integracao-frontend-backend.md',
      ],
    },
    {
      area: 'Funcionalidade principal',
      titulo: 'Fluxo de acesso por QR Code no app',
      descricao: 'Entreguei a história da issue #6 no PR #17, revisado e aprovado por um colega: scanner com lanterna que ignora QR que não é de catraca, captura da posição com limite de 8 s e chamada à API, telas de acesso liberado e negado com os 13 motivos vindos do back-end e estados para câmera ou localização negadas e falta de internet, com testes do modelo, do controller e das telas.',
      evidencias: [
        'PR #17',
        'issue #6',
        '4721075',
        'frontend/lib/views/user/scanner_qr_view.dart',
        'frontend/lib/controllers/acesso_qr_controller.dart',
      ],
    },
    {
      area: 'Mobile',
      titulo: 'Telas do morador, do visitante e da equipe',
      descricao: 'Na branch dev-thiago (ainda sem PR para a main), fiz 18 telas novas: do morador e do visitante (autorizações, histórico, acessos negados, perfil, tag NFC e ajuda) e da equipe (painel, usuários, autorizações, locais, tags e terminais), com CI verde.',
      evidencias: [
        'f974edf',
        'a33595e',
        'dev-thiago:frontend/lib/views/teams/',
        'dev-thiago:frontend/lib/views/shared/historico_view.dart',
      ],
    },
    {
      area: 'Back-end',
      titulo: 'Correções e novas rotas na API',
      descricao: 'Na branch dev-thiago (ainda sem PR), corrigi falhas na API, duas delas encontradas rodando o sistema completo: usuário desativado continuava acessando e o painel contava autorizações agendadas ou esgotadas. Também fiz os eventos trazerem o texto do motivo e criei a rota para o morador bloquear a própria tag. Na main, criei o estágio dev do Dockerfile, porque o estágio de build apagava as devDependencies e o seed falhava no container.',
      evidencias: ['42a1e8f', 'ba5fe87', 'a7326bb', 'dev-thiago:backend/src/shared/http/auth.ts'],
    },
    {
      area: 'Documentação',
      titulo: 'Documentação, backlog e apresentação',
      descricao: 'Versionei os artefatos de design e arquitetura (Design.pdf, Fluxo.pdf e diagramas de sequência e ER), escrevi a revisão de integração front × back e, na dev-thiago, o backlog da sprint com estimativas e decisões e o guia de apresentação da validação por QR.',
      evidencias: [
        'a594c99',
        'docs/integracao-frontend-backend.md',
        'dev-thiago:docs/backlog-sprint.md',
        'dev-thiago:docs/apresentacao-validacao-qr.md',
      ],
    },
  ],
  metodologia: 'Trabalho ágil em sprints com Sprint Review. As histórias de usuário viram issues do GitHub ("Como… quero… para…"), com tasks e critérios de aceite. Escrevi o backlog da sprint, com uma sugestão de divisão em frentes e estimativas P/M/G. Pela política do README, cada pessoa trabalha na sua branch (a minha: dev-thiago) e abre PR para a main com o CI verde. Alguns commits, meus e de um colega, registram coautoria de assistente de IA (Claude).',
  sprints: [
    {
      nome: 'Sprint 1',
      periodo: 'out. 2026',
      objetivo: 'Base do sistema: API com validador de acesso, banco, MQTT, simulador do terminal, CI/CD, ambiente Docker e app com login, sessão e menus por perfil.',
      entregas: [
        'App Flutter com login, sessão e os 4 menus por perfil (Thiago)',
        'Back-end com 7 módulos e testes automatizados, banco com Prisma e notificador MQTT (Davi)',
        'CI/CD no GitHub Actions (Davi) e ambiente Docker (Márcio e Davi, com o estágio dev criado por Thiago)',
      ],
    },
    {
      nome: 'Sprint 2',
      periodo: 'a partir de 26 out. 2026 · em andamento',
      objetivo: 'Completar as telas do app que já têm back-end e corrigir pendências da API.',
      entregas: [
        'Telas de administração no app e build iOS de teste no CI (Davi)',
        'Telas do morador, do visitante e da equipe e correções no back-end (Thiago, branch dev-thiago)',
      ],
    },
  ],
  equipe: [
    {
      nome: 'Thiago Nunes Alves do Prado',
      github: 'MyNameisNunes',
      papel: 'App Flutter (base visual, integração e fluxo de QR) e correções na API',
    },
    {
      nome: 'Davi Snaider Mendoza',
      github: 'davisnaider06',
      papel: 'API, banco, MQTT, firmware ESP32, CI/CD, deploy e telas de administração',
    },
    {
      nome: 'Márcio Roberto Bueno Júnior',
      github: 'marcinbuenoo',
      papel: 'Configuração inicial do repositório e ambiente Docker',
    },
  ],
  desafios: [
    {
      desafio: 'Impedir o uso do QR Code por foto ou à distância.',
      abordagem: 'As regras ficam na API e foram feitas pelo Davi: o QR é de uso único, vale cerca de 30 s e troca a cada 10 s, e a API confere o raio da catraca com a posição do celular. No app, eu pego a posição antes de enviar, com limite de 8 s porque o QR expira; sem localização, a tentativa é enviada mesmo assim para ficar registrada com o motivo.',
    },
    {
      desafio: 'Testar telas que dependem de câmera, GPS e API.',
      abordagem: 'Controllers e serviços recebem as dependências por injeção, e uma API falsa segue o mesmo contrato do back-end: o texto do QR escolhe a resposta (liberado, cada motivo de negação ou sessão expirada). Câmera e GPS reais ficam para o teste manual no celular.',
    },
    {
      desafio: 'O seed e o npm run dev falhavam no container com "spawn tsx ENOENT".',
      abordagem: 'O estágio de build do Dockerfile apagava as devDependencies. Criei um estágio dev com elas e o docker-compose passou a usá-lo, sem mudar a imagem de produção.',
    },
    {
      desafio: 'Um usuário desativado continuava usando a API até o JWT vencer (8 h).',
      abordagem: 'O middleware passou a consultar o usuário a cada requisição e responder CADASTRO_DESATIVADO; a rota de acesso continua aceitando a tentativa para que ela fique registrada como negada. A correção está na branch dev-thiago, ainda sem PR.',
    },
    {
      desafio: 'Integrar 18 telas novas sem quebrar o CI.',
      abordagem: 'Dois commits falharam no CI (análise estática do Flutter e, em um deles, testes da API); ajustei imports, testes e contratos até todos os jobs ficarem verdes na dev-thiago (a33595e).',
    },
  ],
  aprendizados: [
    'Manter a regra de negócio no servidor e deixar o app só ler, enviar e mostrar simplifica o app, o terminal e a manutenção.',
    'Tratar sessão vencida, falta de conexão e erros por campo num lugar só evita repetir código em cada tela.',
    'Testar a interface com dependências injetadas e uma API falsa com o mesmo contrato do back-end, e completar com testes contra a API real.',
    'Rodar o sistema completo (API, banco, broker e app) revela bugs que os testes não pegam.',
    'Pensar acessibilidade desde o tema: contraste WCAG AA e alvos de toque de 56 dp.',
  ],
  galeria: [
    {
      src: 'assets/img/projetos/abp-4dsm-2026-2/prototipo-fluxo-g.webp',
      mini: 'assets/img/projetos/abp-4dsm-2026-2/prototipo-fluxo-m.webp',
      largura: 1500,
      altura: 883,
      alt: 'Protótipo: login, início, scanner de QR Code e validação',
      legenda: 'Protótipo do fluxo principal: login → início → scanner de QR → validação.',
    },
    {
      src: 'assets/img/projetos/abp-4dsm-2026-2/prototipo-resultado-g.webp',
      mini: 'assets/img/projetos/abp-4dsm-2026-2/prototipo-resultado-m.webp',
      largura: 1500,
      altura: 883,
      alt: 'Protótipo das telas de acesso liberado e negado',
      legenda: 'Protótipo das telas de resultado: acesso liberado ou negado com o motivo.',
    },
    {
      src: 'assets/img/projetos/abp-4dsm-2026-2/prototipo-admin-g.webp',
      mini: 'assets/img/projetos/abp-4dsm-2026-2/prototipo-admin-m.webp',
      largura: 1500,
      altura: 883,
      alt: 'Protótipo das telas do administrador: painel, menu e usuários',
      legenda: 'Protótipo da área do administrador: painel, menu e usuários.',
    },
    {
      src: 'assets/img/projetos/abp-4dsm-2026-2/prototipo-terminal-g.webp',
      mini: 'assets/img/projetos/abp-4dsm-2026-2/prototipo-terminal-m.webp',
      largura: 1500,
      altura: 912,
      alt: 'Protótipo do terminal com QR Code e resultado em tela cheia',
      legenda: 'Protótipo do terminal: QR Code que troca a cada 10 s e resultado em tela cheia.',
    },
    {
      src: 'assets/img/projetos/abp-4dsm-2026-2/diagrama-sequencia-qr-g.webp',
      mini: 'assets/img/projetos/abp-4dsm-2026-2/diagrama-sequencia-qr-m.webp',
      largura: 907,
      altura: 636,
      alt: 'Diagrama de sequência do acesso por QR Code',
      legenda: 'Diagrama de sequência do acesso por QR Code (versão inicial).',
    },
    {
      src: 'assets/img/projetos/abp-4dsm-2026-2/modelo-er-g.webp',
      mini: 'assets/img/projetos/abp-4dsm-2026-2/modelo-er-m.webp',
      largura: 891,
      altura: 600,
      alt: 'Modelo entidade-relacionamento inicial',
      legenda: 'Modelo entidade-relacionamento inicial: usuário, tag NFC, autorização e locais.',
    },
    {
      src: 'assets/img/projetos/abp-4dsm-2026-2/logo-passe-g.webp',
      mini: 'assets/img/projetos/abp-4dsm-2026-2/logo-passe-m.webp',
      largura: 1024,
      altura: 1024,
      alt: 'Logotipo do Passe',
      legenda: 'Logotipo do Passe.',
    },
  ],
  links: [
    {
      rotulo: 'PR #17: QR Code no app',
      url: 'https://github.com/CRIMS0NC0DE/4DSM-ABP-2026-2/pull/17',
      icone: 'pr',
      destaque: true,
    },
    {
      rotulo: 'README do projeto',
      url: 'https://github.com/CRIMS0NC0DE/4DSM-ABP-2026-2/blob/main/README.md',
      icone: 'arquivo',
    },
    {
      rotulo: 'Design das telas (PDF)',
      url: 'https://github.com/CRIMS0NC0DE/4DSM-ABP-2026-2/blob/main/docs/Design.pdf',
      icone: 'celular',
    },
    {
      rotulo: 'Integração front × back',
      url: 'https://github.com/CRIMS0NC0DE/4DSM-ABP-2026-2/blob/main/docs/integracao-frontend-backend.md',
      icone: 'codigo',
    },
    {
      rotulo: 'Terminal IoT',
      url: 'https://github.com/CRIMS0NC0DE/4DSM-ABP-2026-2/blob/main/docs/terminal-iot.md',
      icone: 'chip',
    },
    {
      rotulo: 'Branch dev-thiago',
      url: 'https://github.com/CRIMS0NC0DE/4DSM-ABP-2026-2/tree/dev-thiago',
      icone: 'fork',
    },
  ],
  comoRodar: [
    '# API, banco e broker (Docker)',
    'docker compose -f docker-compose.dev.yml up --build database mqtt backend',
    '# → API em http://localhost:3000 (migrations e seed automáticos)',
    '',
    '# App Flutter',
    'cd frontend && flutter run -d chrome --dart-define=API_URL=http://localhost:3000',
    '',
    '# Sem hardware: simulador do terminal em /simulador/ e console web em /console/',
    '# Testes',
    'npm run lint && npm run typecheck && npm test    # back-end',
    'flutter analyze && flutter test                 # app',
  ],
};
