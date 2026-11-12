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
    'Sou Thiago Nunes Alves do Prado, estudante do 4º semestre de Desenvolvimento de Software Multiplataforma (DSM) na Fatec Jacareí, e trabalho como desenvolvedor full stack na 1000 Valle Multimarcas. Antes, fui responsável pelo Portal de Negócios da Prefeitura de Jacareí.',
    'Gosto de construir sistemas de ponta a ponta. Nos Projetos Integradores (ABP) atuei no front-end web e mobile, no back-end e no banco de dados, sempre em equipe e com metodologias ágeis. No projeto de IoT do 4º semestre, fui do firmware do ESP32 ao dashboard web.',
    'Fora das entregas do curso, mantenho projetos pessoais para estudar tecnologias novas, como React com TypeScript, Socket.IO e extensões para o VS Code, incluindo uma que integra IA ao editor.',
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

  /* ---------- Experiência profissional (aparece em Projetos › Profissionais) ----------
     Da mais recente para a mais antiga. contribuicao aparece no quadro
     "Minha contribuição", igual aos projetos. */
  experiencias: [
    {
      cargo: 'Desenvolvedor Full Stack',
      empresa: '1000 Valle Multimarcas',
      periodo: 'abr. 2026 – atual',
      descricao: 'Desenvolvimento do sistema CRM da revendedora de veículos, da interface web ao banco de dados. A empresa também foi a parceira do ABP do 3º semestre.',
      contribuicao: 'Crio telas e componentes em React com Tailwind CSS e cuido do back-end com Prisma e SQL: modelagem das tabelas, consultas e regras de negócio, levando cada funcionalidade da interface até o banco.',
      tecnologias: ['React', 'Tailwind CSS', 'Prisma', 'SQL'],
    },
    {
      cargo: 'Desenvolvedor Web',
      empresa: 'Prefeitura de Jacareí',
      periodo: 'nov. 2025 – abr. 2026',
      descricao: 'Portal de Negócios: plataforma B2G (governo para empresas) que aproxima microempreendedores individuais (MEIs) de empresas locais para fechar negócios e atribuir serviços.',
      contribuicao: 'Fui responsável pela aplicação do portal: desenvolvi as telas em Vue.js com Tailwind CSS e o back-end em PHP com banco SQL, incluindo a integração entre os cadastros de MEIs e de empresas e o fluxo de negócios e atribuições entre eles.',
      tecnologias: ['Vue.js', 'Tailwind CSS', 'PHP', 'SQL'],
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
    { categoria: 'Front-end', itens: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Vite'] },
    { categoria: 'Back-end', itens: ['Node.js', 'Express', 'Prisma', 'Python', 'FastAPI', 'PHP', 'Socket.IO', 'APIs REST', 'JWT'] },
    { categoria: 'Mobile', itens: ['Flutter', 'Dart', 'SQLite'] },
    { categoria: 'Bancos de dados', itens: ['MySQL', 'PostgreSQL', 'MongoDB'] },
    { categoria: 'IoT e hardware', itens: ['ESP32', 'C++', 'Raspberry Pi', 'MQTT'] },
    { categoria: 'DevOps e ferramentas', itens: ['Git', 'GitHub', 'Docker', 'GitHub Actions', 'Jest', 'Vitest', 'Playwright', 'Scrum'] },
  ],
  idiomas: [
    // { idioma: 'Português', nivel: 'Nativo' },
    // { idioma: 'Inglês', nivel: 'Intermediário' },
  ],
  hobbies: [
    // 'Games', 'Música',
  ],
};
