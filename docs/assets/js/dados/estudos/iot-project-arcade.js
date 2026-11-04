/* ==========================================================================
   ESTUDO DE CASO · Arcade Cloud Score (4DSM – 2º Sem. 2026)
   Carregado só em projeto.html?p=iot-project-arcade. O resumo (nome, semestre, capa,
   contribuição resumida, estatísticas) fica em dados/projetos.js.

   Evidências das contribuições (texto simples, viram links para o GitHub):
     'c808945' → commit · 'PR #1' → pull request · 'issue #6' → issue
     'pasta/arquivo.ext' → arquivo · 'docs/' → pasta · 'branch:caminho' → outra branch
     'https://…' → link completo (ex.: commit no fork pessoal)
   ========================================================================== */
window.PORTFOLIO = window.PORTFOLIO || {};
PORTFOLIO.estudos = PORTFOLIO.estudos || {};

PORTFOLIO.estudos['iot-project-arcade'] = {
  resumo: [
    'O Arcade Cloud Score transforma um fliperama caseiro (Raspberry Pi 4 com Batocera) em uma plataforma de jogadores conectada. Cada partida, o score lido da memória dos jogos mapeados e as conquistas do RetroAchievements seguem por MQTT com TLS até um back-end FastAPI com PostgreSQL.',
    'O dashboard web mostra o ranking ao vivo por WebSocket, o perfil de cada jogador com vitrine de conquistas e os saves sincronizados na nuvem. Um ESP32 com sensor DHT11, joystick e LEDs completa o lado IoT, com telemetria ao vivo e controle remoto dos LEDs.',
  ],
  problema: 'Num fliperama caseiro, as partidas não têm dono: os jogos retrô não informam a pontuação para fora do emulador, há um único save por jogo para todos os jogadores e as conquistas ficam presas a uma só conta. Além disso, o aparelho fica atrás de um roteador doméstico, sem IP público, com Wi-Fi instável e sem relógio com bateria.',
  solucao: 'Uma arquitetura orientada a eventos em três camadas: no Raspberry Pi, os ganchos do Batocera gravam partidas e conquistas numa fila em disco, e um daemon Python, que lê o score da RAM, envia essa fila por MQTT/TLS (cada item só sai após a confirmação do broker), sincroniza os saves e repassa ao vivo a telemetria do ESP32; na nuvem, um back-end FastAPI valida cada mensagem, grava no PostgreSQL com idempotência e empurra o ranking por WebSocket; na web, um dashboard sem build mostra ranking, perfil, conquistas, saves e o painel IoT.',
  funcionalidades: [
    {
      titulo: 'Contas de jogador',
      descricao: 'Cadastro com usuário, tag de placar (1 a 3 caracteres) e senha, com as mesmas regras na tela, no back-end e no banco. Senhas em scrypt e sessão de 30 dias em cookie HttpOnly.',
      estado: 'implementado',
    },
    {
      titulo: 'Login no fliperama por desafio-resposta',
      descricao: 'O fliperama calcula o scrypt localmente e envia só um HMAC com nonce de uso único (60 s): a senha nunca passa pelo broker.',
      estado: 'implementado',
    },
    {
      titulo: 'Tela "Login do Arcade" na TV',
      descricao: 'Entrada em pygame no Batocera para entrar, criar conta ou jogar como convidado, com teclado virtual para quem usa o controle.',
      estado: 'implementado',
    },
    {
      titulo: 'Registro automático de partidas',
      descricao: 'Os ganchos do Batocera registram jogo, jogador, início e fim; a ROM é identificada por hash MD5 e os eventos esperam numa fila offline até serem enviados.',
      estado: 'implementado',
    },
    {
      titulo: 'Score lido da memória do jogo',
      descricao: 'Leitura da RAM a cada 1 s via READ_CORE_RAM do RetroArch, com mapas verificados para Sonic 1, Sonic 2 e Super Mario World.',
      estado: 'implementado',
    },
    {
      titulo: 'Ranking ao vivo',
      descricao: 'Top 10 HIGH SCORES atualizado por WebSocket no instante em que um score é gravado, com indicador de conexão e reconexão automática.',
      estado: 'implementado',
    },
    {
      titulo: 'Perfil e conquistas',
      descricao: 'Estatísticas, recordes por jogo, últimas partidas e vitrine de conquistas do RetroAchievements com a raridade entre os jogadores do arcade.',
      estado: 'implementado',
    },
    {
      titulo: 'Saves por jogador na nuvem',
      descricao: 'Saves trocados por jogador no início e no fim da partida e sincronizados com a nuvem a cada 10 s, com verificação SHA-256.',
      estado: 'implementado',
    },
    {
      titulo: 'Painel IoT com ESP32',
      descricao: 'Temperatura, umidade e joystick ao vivo por WebSocket, gráfico de 1, 6 ou 24 h e controle remoto dos LEDs por jogadores logados.',
      estado: 'implementado',
    },
    {
      titulo: 'Operação offline e tolerância a falhas',
      descricao: 'A fila em disco só é esvaziada após a confirmação do broker, as sessões MQTT são persistentes e o banco é idempotente a reentregas.',
      estado: 'implementado',
    },
  ],
  arquitetura: {
    visaoGeral: 'O Raspberry Pi e o servidor nunca se conectam diretamente: os dois abrem conexões TLS de saída (porta 8883) para um broker MQTT na nuvem, então o fliperama funciona atrás de um roteador doméstico, sem IP público. No Pi, só o daemon usa a rede; ganchos e tela de login conversam com ele por arquivos JSON gravados de forma atômica. No servidor, um único processo Python é assinante MQTT, API REST/WebSocket e servidor do dashboard.',
    componentes: [
      {
        nome: 'Firmware do ESP32',
        tecnologia: 'C++ · Arduino-ESP32 · DHT11 · PWM',
        responsabilidade: 'Lê o DHT11 e o joystick (calibração, zona morta e filtro) e controla 3 LEDs por PWM. Conversa com o Pi pela serial USB.',
      },
      {
        nome: 'Cliente do fliperama',
        tecnologia: 'Raspberry Pi 4 · Batocera · Python · pygame',
        responsabilidade: 'Daemon com MQTT, fila em disco, leitura de score, sincronização de saves e correção do relógio; ganchos de jogo e tela de login.',
      },
      {
        nome: 'Broker MQTT',
        tecnologia: 'HiveMQ Cloud · MQTT 3.1.1 sobre TLS',
        responsabilidade: 'Canal entre aparelhos e back-end: QoS 1 com sessões persistentes para eventos e QoS 0 para telemetria ao vivo.',
      },
      {
        nome: 'Back-end',
        tecnologia: 'FastAPI · Uvicorn · Pydantic v2 · paho-mqtt',
        responsabilidade: 'Assina os tópicos, valida cada mensagem em modo estrito, responde logins e saves e expõe REST e WebSockets.',
      },
      {
        nome: 'Banco de dados',
        tecnologia: 'PostgreSQL (Supabase) · psycopg 3 · SQL',
        responsabilidade: '12 tabelas em 6 migrações versionadas, idempotência por UNIQUE/ON CONFLICT e consultas com CTEs.',
      },
      {
        nome: 'Integração RetroAchievements',
        tecnologia: 'RetroAchievements Web API · cache no banco',
        responsabilidade: 'Identifica o jogo pelo hash da ROM (lista oficial de hashes em cache por 7 dias) e grava no banco a lista de conquistas do jogo.',
      },
      {
        nome: 'Dashboard web',
        tecnologia: 'HTML · JavaScript · Tailwind CSS · WebSocket · SVG',
        responsabilidade: 'Ranking ao vivo, login e cadastro, perfil com conquistas e saves e painel IoT com gráfico em SVG.',
      },
    ],
  },
  stack: [
    { categoria: 'Back-end', itens: ['Python', 'FastAPI', 'Uvicorn', 'Pydantic v2', 'paho-mqtt'] },
    {
      categoria: 'Banco de dados',
      itens: ['PostgreSQL (Supabase)', 'psycopg 3', 'SQL com migrações', 'PL/pgSQL'],
    },
    { categoria: 'Front-end', itens: ['HTML5', 'JavaScript', 'Tailwind CSS', 'WebSocket', 'SVG'] },
    { categoria: 'IoT e borda', itens: ['Raspberry Pi 4', 'Batocera', 'RetroArch', 'pygame', 'evdev/uinput'] },
    {
      categoria: 'Microcontrolador',
      itens: ['ESP32 WROOM-32', 'C++ (Arduino)', 'DHT11', 'Joystick analógico', 'LEDs PWM'],
    },
    { categoria: 'Mensageria', itens: ['MQTT 3.1.1 + TLS', 'HiveMQ Cloud'] },
  ],
  linguagens: { Python: 118964, HTML: 39576, 'C++': 8461, Shell: 5427, PLpgSQL: 3435, JavaScript: 2155, CSS: 210 },
  linguagensData: '2026-11-03',
  contribuicoes: [
    {
      area: 'Back-end',
      titulo: 'Back-end FastAPI orientado a eventos MQTT',
      descricao: 'Escrevi o processo que assina os tópicos dos fliperamas (login, partidas, conquistas, saves e telemetria) e valida cada mensagem com Pydantic v2 em modo estrito. O mesmo processo expõe REST e WebSocket; integrei os callbacks do paho-mqtt, que rodam em thread própria, ao event loop do FastAPI com asyncio.run_coroutine_threadsafe e asyncio.to_thread.',
      evidencias: ['c808945', '6915be7', 'backend/main.py', 'backend/ra.py'],
    },
    {
      area: 'Segurança',
      titulo: 'Autenticação no site e no fliperama',
      descricao: 'Implementei contas com scrypt, sessão de 30 dias em cookie HttpOnly/SameSite=Lax (o banco guarda só o SHA-256 do token) e um login que não revela, pelo tempo de resposta, se o usuário existe. Para o fliperama, criei um protocolo de desafio-resposta via MQTT com HMAC e nonce de uso único: a senha nunca passa pelo broker.',
      evidencias: ['c808945', 'backend/auth.py', 'backend/migrations/002_auth_tokens.sql'],
    },
    {
      area: 'Banco de dados',
      titulo: 'Modelagem e camada de dados PostgreSQL',
      descricao: 'Modelei 12 tabelas em 6 migrações SQL aplicadas na subida, cada uma em uma transação. As reentregas do QoS 1 são absorvidas por UNIQUE/ON CONFLICT, um índice único parcial garante uma única sessão aberta por aparelho e os recordes e a raridade das conquistas usam CTEs e DISTINCT ON.',
      evidencias: ['c808945', '6915be7', 'backend/db.py', 'backend/migrations/001_initial.sql'],
    },
    {
      area: 'IoT · Borda',
      titulo: 'Cliente no Raspberry Pi com Batocera',
      descricao: 'Desenvolvi o daemon e os ganchos do Batocera: fila em disco com escrita atômica (só esvazia após o PUBACK), leitura do score da RAM com mapa por hash de ROM, troca e sincronização de saves por jogador com SHA-256, instalador via SSH e a tela "Login do Arcade" em pygame.',
      evidencias: ['c808945', 'edge/batocera/arcaded.py', 'edge/batocera/hook.py', 'edge/batocera/install.sh'],
    },
    {
      area: 'Firmware',
      titulo: 'Firmware do ESP32 e painel IoT',
      descricao: 'Escrevi o firmware em C++ (DHT11, joystick com calibração e filtro exponencial, 3 LEDs PWM e modo jogo), a ponte USB-serial no Pi e, no back-end, a telemetria: tabela, WebSocket /ws/iot e rotas /api/iot. Validei o fluxo ponta a ponta num ESP32 real.',
      evidencias: ['PR #1', '6915be7', 'edge/esp32/arcade_esp32/arcade_esp32.cpp', 'backend/static/iot.html'],
    },
    {
      area: 'Confiabilidade',
      titulo: 'Joystick como teclado e correção do relógio do Pi',
      descricao: 'Transformei o joystick nas setas de um teclado virtual (uinput) com histerese e corrigi um bug de relógio: sem RTC, partidas que atravessavam o acerto do ntpd chegavam a 519 h. O daemon passou a salvar a hora, segurar eventos até a hora ser confiável e corrigir horários pelo relógio monotônico.',
      evidencias: ['a5a3b40', 'edge/batocera/esp32.py', 'edge/batocera/arcaded.py'],
    },
    {
      area: 'Front-end',
      titulo: 'Dashboard web sem etapa de build',
      descricao: 'Construí o ranking ao vivo por WebSocket com reconexão, login e cadastro com validação que espelha o servidor e o perfil com conquistas, recordes, partidas e download de saves, com escape contra XSS nos textos vindos de fora.',
      evidencias: ['c808945', 'backend/static/index.html', 'backend/static/perfil.html', 'backend/static/arcade.js'],
    },
    {
      area: 'Documentação',
      titulo: 'Documentação técnica',
      descricao: 'Escrevi o README (contratos MQTT, decisões técnicas e limitações conhecidas) e sete documentos em docs/, com arquitetura em Mermaid, contratos REST/WebSocket/MQTT, diagrama ER e guia do Raspberry Pi. Também adicionei 21 capturas de tela em prints/.',
      evidencias: ['975874a', 'README.md', 'docs/', 'prints/'],
    },
  ],
  metodologia: 'Desenvolvimento individual, sem sprints documentadas: 6 commits entre 29/09 e 04/10/2026, começando pela importação do sistema base, seguida da documentação técnica, da primeira entrega do ESP32 (branch esp32-painel-iot, integrada pelo PR #1) e, direto na main, do joystick como teclado e da correção do relógio (a5a3b40). A validação foi manual e ponta a ponta em hardware real (ESP32 WROOM-32 e Raspberry Pi com Batocera). Dois commits registram coautoria do assistente de IA Claude, e o PR #1 foi gerado com o Claude Code.',
  sprints: [],
  equipe: [
    {
      nome: 'Thiago Nunes Alves do Prado',
      github: 'MyNameisNunes',
      papel: 'Firmware, borda, back-end, banco e dashboard',
    },
  ],
  desafios: [
    {
      desafio: 'O Batocera só abre o jogo depois que o gancho termina, e o Wi-Fi do fliperama é instável.',
      abordagem: 'Ganchos e tela de login só gravam JSON numa fila em disco (arquivo temporário + rename). Um daemon separado é o único a usar a rede, remove cada arquivo só após o PUBACK e reconecta sozinho, com espera de 1 a 60 s.',
    },
    {
      desafio: 'MQTT com QoS 1 entrega "pelo menos uma vez", e o evento de início de partida pode se perder.',
      abordagem: 'O play_uuid gerado no Pi é a chave de idempotência (UNIQUE + ON CONFLICT no PostgreSQL), o evento "stop" repete todos os dados e cria a partida sozinho, e os dois lados usam sessões persistentes.',
    },
    {
      desafio: 'O broker na nuvem não restringe tópicos por credencial: qualquer cliente autenticado poderia ler as mensagens de login.',
      abordagem: 'Login por desafio-resposta: o servidor envia salt e um nonce de uso único válido por 60 s, o Pi calcula o scrypt localmente e responde só um HMAC. A limitação que resta foi documentada no README.',
    },
    {
      desafio: 'Jogos retrô não informam o score para fora do emulador.',
      abordagem: 'Leitura da RAM pelo comando READ_CORE_RAM do RetroArch, com mapa indexado pelo hash da ROM, tratando BCD, endianness e os bytes trocados do Mega Drive e ignorando o modo demonstração.',
    },
    {
      desafio: 'O Raspberry Pi não tem relógio com bateria, e uma partida que atravessava o acerto do ntpd durava semanas (519 h no perfil).',
      abordagem: 'O daemon salva a hora a cada 10 min, segura partidas e conquistas até a hora ser confiável e corrige os horários enfileirados pelo relógio monotônico (commit a5a3b40).',
    },
    {
      desafio: 'Os callbacks do paho-mqtt rodam em thread própria, enquanto o WebSocket vive no event loop do FastAPI.',
      abordagem: 'O envio do ranking é agendado com asyncio.run_coroutine_threadsafe e as consultas ao banco saem do loop com asyncio.to_thread; um try/except no on_message impede que um payload inválido derrube o assinante.',
    },
  ],
  aprendizados: [
    'Projetar a borda IoT para operar offline: fila em disco com escrita atômica e confirmação do broker antes de descartar cada mensagem.',
    'Tratar a entrega "pelo menos uma vez" do MQTT com idempotência ponta a ponta (UUID gerado no dispositivo e UNIQUE/ON CONFLICT no banco).',
    'Desenhar autenticação quando o canal não é confidencial: desafio-resposta com scrypt e HMAC, nonce de uso único e respostas que não revelam quais contas existem.',
    'Integrar hardware e software: firmware C++ no ESP32, serial USB, teclado virtual via uinput e comandos de rede do RetroArch.',
    'Lidar com tempo em dispositivos sem RTC, separando relógio de parede e relógio monotônico, a partir de um bug real observado no perfil.',
  ],
  galeria: [
    {
      src: 'assets/img/projetos/iot-project-arcade/painel-iot-g.webp',
      mini: 'assets/img/projetos/iot-project-arcade/painel-iot-m.webp',
      largura: 1366,
      altura: 900,
      alt: 'Painel IoT com temperatura, joystick e LEDs do ESP32',
      legenda: 'Painel IoT com jogador logado: telemetria do ESP32 ao vivo e controle dos LEDs.',
    },
    {
      src: 'assets/img/projetos/iot-project-arcade/ranking-g.webp',
      mini: 'assets/img/projetos/iot-project-arcade/ranking-m.webp',
      largura: 1366,
      altura: 900,
      alt: 'Ranking HIGH SCORES com top 10 de jogadores',
      legenda: 'Ranking HIGH SCORES ao vivo: top 10 atualizado por WebSocket, com cores de pódio.',
    },
    {
      src: 'assets/img/projetos/iot-project-arcade/perfil-g.webp',
      mini: 'assets/img/projetos/iot-project-arcade/perfil-m.webp',
      largura: 1351,
      altura: 1150,
      alt: 'Perfil do jogador com estatísticas e conquistas',
      legenda: 'Perfil do jogador: partidas, tempo jogado e vitrine de conquistas do RetroAchievements.',
    },
    {
      src: 'assets/img/projetos/iot-project-arcade/tv-login-g.webp',
      mini: 'assets/img/projetos/iot-project-arcade/tv-login-m.webp',
      largura: 1600,
      altura: 900,
      alt: 'Tela Login do Arcade exibida na TV do fliperama',
      legenda: 'Tela "Login do Arcade" na TV do fliperama (pygame no Batocera).',
    },
    {
      src: 'assets/img/projetos/iot-project-arcade/grafico-24h-g.webp',
      mini: 'assets/img/projetos/iot-project-arcade/grafico-24h-m.webp',
      largura: 1366,
      altura: 1117,
      alt: 'Gráfico de temperatura de 24 horas e tabela de leituras',
      legenda: 'Painel IoT com gráfico de temperatura das últimas 24 h e tabela de leituras.',
    },
    {
      src: 'assets/img/projetos/iot-project-arcade/painel-celular-g.webp',
      mini: 'assets/img/projetos/iot-project-arcade/painel-celular-m.webp',
      largura: 780,
      altura: 1560,
      alt: 'Painel IoT na versão para celular',
      legenda: 'O mesmo painel IoT, responsivo, no celular.',
    },
    {
      src: 'assets/img/projetos/iot-project-arcade/cadastro-validacao-g.webp',
      mini: 'assets/img/projetos/iot-project-arcade/cadastro-validacao-m.webp',
      largura: 1366,
      altura: 900,
      alt: 'Formulário de cadastro com mensagens de validação',
      legenda: 'Cadastro com validação: as mesmas regras na tela, no back-end e no banco.',
    },
  ],
  links: [
    {
      rotulo: 'README do projeto',
      url: 'https://github.com/CRIMS0NC0DE/IoTProjectArcade/blob/main/README.md',
      icone: 'arquivo',
      destaque: true,
    },
    {
      rotulo: 'Arquitetura (Mermaid)',
      url: 'https://github.com/CRIMS0NC0DE/IoTProjectArcade/blob/main/docs/arquitetura.md',
      icone: 'camadas',
    },
    {
      rotulo: 'Contratos REST, WebSocket e MQTT',
      url: 'https://github.com/CRIMS0NC0DE/IoTProjectArcade/blob/main/docs/contratos.md',
      icone: 'codigo',
    },
    {
      rotulo: 'Banco de dados (ER)',
      url: 'https://github.com/CRIMS0NC0DE/IoTProjectArcade/blob/main/docs/banco-de-dados.md',
      icone: 'banco',
    },
    {
      rotulo: 'Firmware do ESP32',
      url: 'https://github.com/CRIMS0NC0DE/IoTProjectArcade/blob/main/edge/esp32/arcade_esp32/arcade_esp32.cpp',
      icone: 'chip',
    },
  ],
  comoRodar: [
    '# Back-end (Python), na raiz do projeto',
    'python3 -m venv .venv && source .venv/bin/activate',
    'pip install -r requirements.txt',
    'cp .env.example .env    # HiveMQ Cloud, PostgreSQL/Supabase e RetroAchievements',
    'cd backend && python -m uvicorn main:app    # dashboard em http://localhost:8000',
    '',
    '# Raspberry Pi com Batocera: em outro terminal, na raiz do projeto',
    '# (usa o .venv e o .env acima e a chave SSH ~/.ssh/arcade_pi; ver README)',
    'edge/batocera/install.sh <ip-do-pi> arcade-pi-01',
    '# score e conquistas: ativar o RetroAchievements no Batocera',
    '',
    '# ESP32: gravar edge/esp32/arcade_esp32/arcade_esp32.ino pela Arduino IDE',
    '# Teste sem o Pi',
    'python edge/publisher.py',
  ],
};
