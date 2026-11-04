/* ==========================================================================
   PERFIL — dados pessoais e profissionais exibidos no portfólio
   --------------------------------------------------------------------------
   Regras da orientação oficial (Fatec Jacareí · DSM):
   • Contatos: APENAS redes profissionais (GitHub, LinkedIn).
     Não coloque e-mail, telefone ou outros dados pessoais aqui.
   • Listas vazias ([]) não aparecem no site — preencha quando quiser exibir.
   ========================================================================== */
window.PORTFOLIO = window.PORTFOLIO || {};

PORTFOLIO.perfil = {
  nome: 'Thiago Nunes',
  nomeCompleto: 'Thiago Nunes Alves do Prado',
  githubUrl: 'https://github.com/MyNameisNunes',
  // Contas do GitHub usadas nos projetos (marcam "(eu)" na lista de equipe)
  githubContas: ['MyNameisNunes', 'tnunes-kz'],

  /* ---------- Apresentação ---------- */
  apresentacao: [
    'Sou Thiago Nunes Alves do Prado, estudante do 4º semestre de Desenvolvimento de Software Multiplataforma (DSM) na Fatec Jacareí, e trabalho como desenvolvedor web.',
    'Gosto de construir sistemas de ponta a ponta. Nos Projetos Integradores (ABP) atuei no front-end web e mobile, no back-end e no banco de dados, sempre em equipe e com metodologias ágeis. No projeto de IoT do 4º semestre, fui do firmware do ESP32 ao dashboard web.',
    'Fora das entregas do curso, mantenho projetos pessoais para estudar tecnologias novas, como React com TypeScript, Socket.IO e extensões para o VS Code.',
  ],
  objetivo: 'Evoluir como desenvolvedor full stack, criando produtos web e mobile que se conectam ao mundo físico (IoT), com código bem testado e entrega contínua.',
  interesses: [
    { titulo: 'Desenvolvimento web full stack', descricao: 'React, TypeScript, Node.js e APIs REST', icone: 'tela' },
    { titulo: 'Apps multiplataforma', descricao: 'Flutter e Dart para Android e web', icone: 'celular' },
    { titulo: 'Internet das Coisas', descricao: 'ESP32, sensores e telemetria em tempo real', icone: 'chip' },
    { titulo: 'DevOps e qualidade', descricao: 'Docker, testes automatizados e CI', icone: 'ferramenta' },
  ],

  /* ---------- Contatos (somente redes profissionais) ---------- */
  redes: [
    { id: 'github', rotulo: 'GitHub', usuario: '@MyNameisNunes', url: 'https://github.com/MyNameisNunes', icone: 'github' },
    { id: 'linkedin', rotulo: 'LinkedIn', usuario: 'in/thhiagon', url: 'https://www.linkedin.com/in/thhiagon/', icone: 'linkedin' },
  ],

  /* ---------- Experiência profissional (aparece em Projetos › Profissionais) ---------- */
  experiencias: [
    {
      cargo: 'Desenvolvedor Web',
      empresa: '',            // opcional: nome da empresa
      periodo: 'Atual',       // ex.: 'Desde mar. 2026'
      descricao: 'Atuação profissional como desenvolvedor web. Os repositórios da empresa são privados, por isso não aparecem aqui.',
      tecnologias: [],        // ex.: ['PHP', 'JavaScript', 'MySQL']
    },
  ],

  /* ---------- Informações complementares ---------- */
  formacao: [
    {
      curso: 'Tecnologia em Desenvolvimento de Software Multiplataforma',
      instituicao: 'Fatec Jacareí',
      periodo: 'Ingresso em 2026 · cursando o 4º semestre (2º Sem. 2026)',
      status: 'Em andamento',
      statusTipo: 'andamento',
    },
  ],
  cursos: [
    {
      nome: 'The Odin Project',
      instituicao: 'Trilha online de desenvolvimento web',
      detalhe: 'Exercícios práticos de HTML, CSS e JavaScript (ex.: Biblioteca de Livros).',
      url: 'https://www.theodinproject.com/',
    },
  ],
  conhecimentos: [
    { categoria: 'Front-end', itens: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind CSS', 'Vite'] },
    { categoria: 'Back-end', itens: ['Node.js', 'Express', 'Prisma', 'Python', 'FastAPI', 'PHP', 'Socket.IO', 'APIs REST', 'JWT'] },
    { categoria: 'Mobile', itens: ['Flutter', 'Dart', 'SQLite'] },
    { categoria: 'Bancos de dados', itens: ['MySQL', 'PostgreSQL', 'MongoDB'] },
    { categoria: 'IoT e hardware', itens: ['ESP32', 'C++', 'Raspberry Pi', 'MQTT'] },
    { categoria: 'DevOps e ferramentas', itens: ['Git', 'GitHub', 'Docker', 'GitHub Actions', 'Jest', 'Scrum'] },
  ],
  idiomas: [
    // { idioma: 'Português', nivel: 'Nativo' },
    // { idioma: 'Inglês', nivel: 'Intermediário' },
  ],
  hobbies: [
    // 'Games', 'Música',
  ],
};
