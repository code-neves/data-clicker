// js/config.js
console.log('Config module loaded');

export const locale = {
    gameTitle: "Data Clicker",
    totalData: "Total de Dados",
    generateData: "Gerar Dados",
    storageDevices: "Dispositivos de Armazenamento",
    upgrades: "Melhorias",
    achievements: "Conquistas",
    settings: "Configurações",
    owned: "Possui",
    transferAmount: "Total/Ciclo",
    cycleTime: "Tempo do Ciclo",
    cost: "Custo",
    noUpgradesAvailable: "Nenhuma melhoria disponível",
    saveGame: "Salvar Jogo",
    resetGame: "Resetar Jogo",
    gameSaved: "💾 Jogo Salvo!",
    settingsSaved: "⚙️ Configurações salvas!",
    upgradePurchased: "Melhoria comprada",
    achievementUnlocked: "🏆 Conquista Desbloqueada",
    
    // New strings
    autosaveReminder: "Não se preocupe, o jogo salva seu progresso automaticamente! 💾",
    offlineEarningsReport: (data, time) => `Bem-vindo de volta! Você gerou ${data} de dados enquanto esteve fora por ${time}.`,


    // Reset confirmation
    resetConfirmTitle: "Resetar Progresso?",
    resetConfirmText: "Você tem certeza que quer resetar seu progresso? Esta ação é permanente e não pode ser desfeita.",
    confirmAction: "Confirmar Reset",
    cancelAction: "Cancelar",

    // QoL Settings Labels
    settingVisualEffects: "Efeitos visuais (sombras)",
    settingFloatingText: "Animação de números",
    settingNumberFormat: "Formato dos números",
    settingAutosave: "Salvar automaticamente",
    numberFormatShort: "Abreviado (Padrão)",
    numberFormatLong: "Completo",
    autosaveInterval30s: "A cada 30 segundos",
    autosaveInterval1m: "A cada 1 minuto",
    autosaveInterval5m: "A cada 5 minutos",
    autosaveIntervalOff: "Nunca",
};

export const deviceDefinitions = {
    // Tier 1: Early Game
    punchCard:  { name: "📜 Cartão Perfurado",      cost: 15,       baseTime: 20.0, baseAmount: 80,       creator: "Herman Hollerith" },
    floppy:     { name: "💾 Disquete",             cost: 1000,     baseTime: 15.0, baseAmount: 2000,     creator: "Alan Shugart" },
    zipDrive:   { name: "💽 Zip Drive",           cost: 8e4,      baseTime: 12.0, baseAmount: 25000,    creator: "Iomega Corp" },
    
    // Tier 2: Mid Game
    hdd:        { name: "💿 Disco Rígido",          cost: 5e6,      baseTime: 8.0,  baseAmount: 2.5e5,    creator: "Reynold B. Johnson" },
    sata:       { name: "🔌 SSD SATA",             cost: 4e8,      baseTime: 4.0,  baseAmount: 5e6,      creator: "SATA-IO" },
    nvme:       { name: "⚡ SSD NVMe",             cost: 9e10,     baseTime: 2.5,  baseAmount: 1e8,      creator: "NVM Express Workgroup" },
    
    // Tier 3: Late Game / Endgame
    dataCenter: { name: "🏢 Data Center",          cost: 3e14,     baseTime: 1.0,  baseAmount: 5e9,      creator: "Uptime Institute" },
    cloudStorage:{ name: "☁️ Armazenamento em Nuvem",  cost: 8e18,     baseTime: 0.5,  baseAmount: 2e12,     creator: "J. C. R. Licklider" },
    quantumDrive:{ name: "⚛️ Drive Quântico",       cost: 2e24,     baseTime: 0.1,  baseAmount: 1e15,     creator: "David Deutsch" }
};


// Base names for procedurally generated upgrades.
export const upgradeNames = {
    punchCard:  { speed: "Mecanismo Acelerado", amount: "Cartões Maiores" },
    floppy:     { speed: "Motor Rápido", amount: "Setores Adicionais" },
    zipDrive:   { speed: "Atuador 'Voice Coil'", amount: "Partículas de Cobalto" },
    hdd:        { speed: "Aumento de RPM", amount: "Pratos Adicionais" },
    sata:       { speed: "Protocolo AHCI", amount: "Células MLC" },
    nvme:       { speed: "Controladora Phison", amount: "3D-NAND QLC" },
    dataCenter: { speed: "Rede 100GbE", amount: "Virtualização de Servidores" },
    cloudStorage:{ speed: "CDN Global", amount: "Armazenamento de Objetos" },
    quantumDrive:{ speed: "Correção de Erro Quântico", amount: "Superposição de Estados" }
};


export const achievementNames = {
    punchCard: ["Meu Primeiro Byte", "Operador de Tabuladora", "Programador de Cartão", "Arquivo de Cartões", "Lenda de Hollerith", "O Homem que Tinha Tudo"],
    floppy: ["Meu Primeiro Disquete", "Colecionador Amador", "Pilha de Disquetes", "Caixa de Sapatos", "Gabinete de Disquetes", "O Arquivista"],
    zipDrive: ["O Som do Click", "Entusiasta da Iomega", "Mochila de Discos", "Caso de Backup", "Coleção Multimídia", "Imperador do Zip"],
    hdd: ["Primeiro Giro", "Prateleira de HDs", "Gaveta de Servidor", "Terabyte Pessoal", "O Colecionador", "Data Hoarder"],
    sata: ["Velocidade da Luz", "Sem Partes Móveis", "Boot Instantâneo", "Array de Estado Sólido", "Fanático por IOPS", "Rei do Silício"],
    nvme: ["Direto na Placa-Mãe", "Latência Zero", "Campeão de Benchmarks", "RAID de NVMe", "Acelerador de Partículas de Dados", "Mestre do PCIe"],
    dataCenter: ["Meu Primeiro Servidor", "Rack Completo", "Corredor Frio", "Administrador de Data Center", "Arquiteto de Nuvem", "Proprietário da Internet"],
    cloudStorage: ["Primeiro Upload", "Escalabilidade Elástica", "Multi-Region", "Fornecedor de Nuvem", "Titã da Nuvem", "Nuvem Soberana"],
    quantumDrive: ["Qubit Inicial", "Entrelaçamento Quântico", "Computador Quântico Pessoal", "Supremacia Quântica", "Simulador Universal", "Deus da Informação"]
};

export const deviceInfoTexts = {
    punchCard: "O Cartão Perfurado foi uma das primeiras mídias de armazenamento de dados em massa, consistindo em um cartão de papel onde a presença ou ausência de furos representava dados binários. Desenvolvido por Herman Hollerith, foi crucial para o censo dos EUA de 1890. No Brasil, sua história está ligada à chegada dos primeiros mainframes. O primeiro computador da América Latina, um UNIVAC-1105, foi instalado no IBGE em 1961 no Rio de Janeiro para processar dados do censo, utilizando tecnologia de fita magnética, mas os cartões perfurados foram a porta de entrada para a computação em muitas universidades e empresas brasileiras nas décadas de 60 e 70, sendo usados para programação e entrada de dados em grandes computadores da IBM.",
    floppy: "O Disquete, ou Floppy Disk, revolucionou a computação pessoal ao oferecer um meio de armazenamento portátil e acessível. Consistia em um disco magnético flexível (daí o nome 'floppy') protegido por um invólucro plástico. Evoluiu de 8 polegadas para 5.25 e, finalmente, para o icônico formato de 3.5 polegadas com 1.44 MB. No Brasil, o disquete foi o protagonista da era da 'Reserva de Mercado' de informática (1984-1992). Era através dele que softwares, jogos e trabalhos eram distribuídos para os computadores nacionais, como os da Cobra, Prológica e Microdigital. Aprender a copiar e cuidar de disquetes foi um rito de passagem para toda uma geração de brasileiros.",
    zipDrive: "Lançado pela Iomega em 1994, o Zip Drive surgiu como um sucessor robusto para o disquete. Com uma capacidade inicial de 100 MB (equivalente a quase 70 disquetes), tornou-se a mídia preferida por profissionais que trabalhavam com arquivos grandes, como designers gráficos, músicos e editores. No Brasil, o Zip Drive chegou após o fim da reserva de mercado e era um item de alto custo, mas essencial em agências de publicidade e estúdios de design em cidades como São Paulo e Rio de Janeiro durante a segunda metade dos anos 90. Sua popularidade foi um passo intermediário importante antes da massificação dos gravadores de CD.",
    hdd: "O Disco Rígido (Hard Disk Drive ou HD) armazena dados em pratos magnéticos que giram em alta velocidade (RPM). Um braço mecânico com um cabeçote de leitura/gravação acessa os dados. Por décadas, foi o pilar do armazenamento digital devido ao seu baixo custo por megabyte e alta capacidade. No Brasil, a evolução do HD acompanhou a popularização do PC. Nos anos 90, um HD de 500 MB era um luxo. Hoje, HDs de múltiplos terabytes são comuns e fabricados na Zona Franca de Manaus. A queda de preços e o aumento de capacidade dos HDs foram fatores essenciais para a inclusão digital e a pirataria no país, permitindo que mais pessoas armazenassem vastas coleções de softwares, músicas e filmes.",
    sata: "O SSD (Solid-State Drive) com interface SATA representou um salto de performance ao substituir os pratos magnéticos dos HDs por chips de memória flash (NAND), eliminando partes móveis. Isso resultou em velocidades de acesso e taxas de transferência muito maiores, além de maior durabilidade e silêncio. No Brasil, os SSDs SATA chegaram como um produto de nicho e de alto custo, mas rapidamente se tornaram o upgrade de melhor custo-benefício para acelerar computadores e notebooks antigos. A interface SATA, apesar de mais lenta que as tecnologias mais novas, permitiu que milhões de brasileiros dessem uma nova vida a máquinas mais velhas, simplesmente trocando o HD principal por um SSD.",
    nvme: "NVMe (Non-Volatile Memory Express) é um protocolo moderno que permite que SSDs se comuniquem diretamente com o processador através do barramento PCIe, o mesmo usado por placas de vídeo. Isso elimina os gargalos da antiga interface SATA, resultando em velocidades de leitura e escrita absurdamente rápidas. No Brasil, os SSDs NVMe são o padrão ouro para entusiastas, gamers e profissionais de criação de conteúdo. Lojas de hardware especializadas, como Pichau e Kabum!, popularizaram a tecnologia. Montar um PC no Brasil hoje, para quem busca performance, quase sempre envolve um debate sobre o custo-benefício de um NVMe Gen3, Gen4 ou um SSD SATA para diferentes tipos de uso.",
    dataCenter: "Um Data Center é uma instalação industrial de grande escala que abriga a infraestrutura computacional (servidores, storage, redes) de empresas ou da própria internet. Exigem altíssima segurança, refrigeração e energia redundante. O Brasil tornou-se um hub estratégico de Data Centers na América Latina. Gigantes como Google, Microsoft, Amazon (AWS) e Oracle possuem grandes instalações, principalmente na região de Campinas (SP). Além disso, Fortaleza (CE) virou um ponto nevrálgico por ser o ponto de chegada de 18 cabos submarinos de fibra óptica que conectam o Brasil ao resto do mundo, garantindo baixa latência para o tráfego de dados nacional e internacional.",
    cloudStorage: "O Armazenamento em Nuvem é um serviço que permite guardar dados em uma rede de servidores de data centers remotos, acessíveis via internet. A grande vantagem é a elasticidade, durabilidade e acessibilidade de qualquer lugar. No Brasil, a nuvem transformou tanto o uso pessoal quanto o empresarial. Para o cidadão comum, ela guarda backups de fotos e arquivos. Para as empresas, a presença de data centers locais (as 'regiões de nuvem' de São Paulo e Rio de Janeiro) foi fundamental para reduzir a latência e para que empresas brasileiras, de fintechs a grandes varejistas, pudessem adotar a tecnologia em conformidade com a Lei Geral de Proteção de Dados (LGPD), que possui regras sobre onde os dados de cidadãos brasileiros podem ser armazenados.",
    quantumDrive: "Um Drive Quântico é, por enquanto, um conceito teórico de armazenamento de dados baseado na mecânica quântica. Em vez de bits (0 ou 1), ele usaria 'qubits', que podem existir em múltiplos estados simultaneamente (superposição), prometendo uma densidade de armazenamento exponencialmente maior que a de qualquer tecnologia atual. Embora um 'drive' ainda seja ficção científica, o Brasil participa ativamente da corrida pela computação quântica. Universidades como UNICAMP, USP e UFRJ possuem grupos de pesquisa na área, e o SENAI CIMATEC, na Bahia, adquiriu o primeiro computador quântico da América Latina para uso industrial, posicionando o país na vanguarda da pesquisa e desenvolvimento desta tecnologia disruptiva."
};

export const didYouKnowMessages = [
    "Você sabia que SSDs (Unidades de Estado Sólido) não possuem partes móveis, tornando-os mais rápidos e duráveis que HDs?",
    "Você sabia que o primeiro mouse de computador, inventado por Douglas Engelbart em 1964, era feito de madeira?",
    "Você sabia que a World Wide Web ('www') foi inventada por Tim Berners-Lee no CERN em 1989?",
    "Você sabia que o termo 'bug' de computador se originou de uma mariposa real encontrada presa em um relé do computador Harvard Mark II em 1947?",
    "Você sabia que o primeiro HD da IBM, em 1956, pesava mais de uma tonelada e armazenava apenas 5MB de dados?",
    "Você sabia que a linguagem de programação Python foi nomeada em homenagem ao grupo de comédia britânico Monty Python?",
    "Você sabia que o primeiro e-mail foi enviado por Ray Tomlinson em 1971? Ele também introduziu o uso do símbolo '@' em endereços de e-mail.",
    "Você sabia que o primeiro domínio de internet registrado foi 'symbolics.com' em 15 de março de 1985?",
    "Você sabia que a capacidade de um microchip de computador dobra aproximadamente a cada dois anos? Isso é conhecido como a Lei de Moore.",
    "Você sabia que o primeiro banner de anúncio na internet apareceu em 1994?",
    "Você sabia que o Google era originalmente chamado de 'Backrub'?",
    "Você sabia que mais de 5 bilhões de pessoas usam a internet hoje?",
    "Você sabia que o primeiro celular pesava 1.1 kg e tinha uma autonomia de bateria de apenas 30 minutos de conversação?",
    "Você sabia que a Finlândia foi o primeiro país a tornar o acesso à internet um direito legal em 2010?",
    "Você sabia que o primeiro vídeo enviado para o YouTube se chama 'Me at the zoo'?",
    "Você sabia que a QWERTY, disposição de teclado mais comum, foi projetada para diminuir a velocidade de digitação e evitar que as máquinas de escrever travassem?",
    "Você sabia que o Wi-Fi não é uma abreviação para 'Wireless Fidelity'? O nome foi criado por uma empresa de marketing e não significa nada.",
    "Você sabia que o primeiro computador eletrônico, o ENIAC, pesava mais de 27 toneladas e ocupava um espaço de 167 metros quadrados?",
    "Você sabia que o código CAPTCHA é um acrônimo para 'Completely Automated Public Turing test to tell Computers and Humans Apart'?",
    "Você sabia que a Amazon originalmente vendia apenas livros?",
    "Você sabia que o primeiro SMS foi enviado em 1992 com a mensagem 'Feliz Natal'?",
    "Você sabia que o logotipo original da Apple apresentava Isaac Newton sentado sob uma macieira?",
    "Você sabia que 90% dos dados do mundo foram criados nos últimos dois anos?",
    "Você sabia que o primeiro alarme de carro foi patenteado em 1918?",
    "Você sabia que o primeiro console de videogame doméstico foi o Magnavox Odyssey, lançado em 1972?",
    "Você sabia que o termo 'firewall' na computação é derivado do conceito de paredes físicas que impedem a propagação de incêndios em edifícios?",
    "Você sabia que o Bluetooth foi nomeado em homenagem a um rei viking do século X, Harald Bluetooth?",
    "Você sabia que o primeiro laptop comercial, o Osborne 1, pesava quase 11 kg?",
    "Você sabia que a primeira webcam foi criada na Universidade de Cambridge para monitorar uma cafeteira?",
    "Você sabia que o formato de imagem GIF foi desenvolvido em 1987 pela CompuServe?",
    "Você sabia que o primeiro processador de texto, chamado 'Electric Pencil', foi lançado em 1976?",
    "Você sabia que o primeiro robô industrial, o Unimate, começou a trabalhar em uma fábrica da General Motors em 1961?",
    "Você sabia que o primeiro 'vírus' de computador, o Creeper, foi criado em 1971 e apenas exibia a mensagem 'I'm the creeper: catch me if you can'?",
    "Você sabia que o primeiro CD (Compact Disc) comercialmente disponível foi lançado em 1982?",
    "Você sabia que o primeiro smartphone, o IBM Simon Personal Communicator, foi lançado em 1994 e tinha tela de toque e e-mail?",
    "Você sabia que a linguagem de programação Java foi originalmente chamada de 'Oak'?",
    "Você sabia que o primeiro tweet foi enviado por Jack Dorsey, co-fundador do Twitter, em 21 de março de 2006?",
    "Você sabia que o primeiro site do mundo ainda está online? Ele explica o que é a World Wide Web.",
    "Você sabia que a Nintendo foi fundada em 1889 como uma empresa de cartas de baralho?",
    "Você sabia que o primeiro HD com capacidade de 1 Gigabyte, o IBM 3380, foi lançado em 1980, tinha o tamanho de uma geladeira e custava $40.000?",
    "Você sabia que a palavra 'robô' vem da palavra checa 'robota', que significa 'trabalho forçado'?",
    "Você sabia que o primeiro emoticon :-) foi usado por Scott Fahlman em 1982?",
    "Você sabia que a primeira impressora 3D foi criada por Chuck Hull em 1984?",
    "Você sabia que o primeiro relógio de pulso digital da Pulsar, em 1972, custava $2.100, o mesmo que um carro na época?",
    "Você sabia que o primeiro podcasting foi desenvolvido no início dos anos 2000?",
    "Você sabia que o primeiro filme a usar imagens geradas por computador (CGI) foi 'Westworld' em 1973?",
    "Você sabia que o primeiro sistema operacional com interface gráfica (GUI) foi desenvolvido pela Xerox no seu centro de pesquisa PARC?",
    "Você sabia que o primeiro 'easter egg' em um software foi encontrado no jogo 'Adventure' para o Atari 2600 em 1979?",
    "Você sabia que a primeira foto postada na World Wide Web foi de uma banda de comédia chamada 'Les Horribles Cernettes'?",
    "Você sabia que o primeiro drone foi desenvolvido durante a Primeira Guerra Mundial?",
    "Você sabia que a primeira chamada de telefone celular foi feita em 1973 por Martin Cooper, um engenheiro da Motorola?",
    "Você sabia que a primeira bateria foi inventada por Alessandro Volta em 1800?",
    "Você sabia que o primeiro microfone foi inventado por Emile Berliner em 1877?",
    "Você sabia que o primeiro satélite artificial, o Sputnik 1, foi lançado pela União Soviética em 1957?",
    "Você sabia que o primeiro transistor, a base de toda a eletrônica moderna, foi inventado em 1947 no Bell Labs?",
    "Você sabia que a primeira calculadora de bolso, a 'Cal Tech', foi lançada em 1967?",
    "Você sabia que o primeiro LED (Diodo Emissor de Luz) foi inventado por Nick Holonyak Jr. em 1962?",
    "Você sabia que a primeira fibra óptica foi demonstrada em 1840, mas só se tornou prática para telecomunicações nos anos 70?",
    "Você sabia que o primeiro laser foi construído em 1960 por Theodore Maiman?",
    "Você sabia que a primeira tela de toque foi inventada por E.A. Johnson no Reino Unido nos anos 60?",
    "Você sabia que o primeiro chip de memória RAM (Random Access Memory) foi o Intel 1103, lançado em 1970, com capacidade de 1024 bits?",
    "Você sabia que o primeiro microprocessador, o Intel 4004, foi lançado em 1971?",
    "Você sabia que o primeiro modem de computador foi criado em 1958 para a Força Aérea dos EUA?",
    "Você sabia que o primeiro navegador web gráfico, o Mosaic, foi lançado em 1993 e popularizou a internet?",
    "Você sabia que o primeiro sistema de GPS (Global Positioning System) tornou-se totalmente operacional em 1995?",
    "Você sabia que a primeira câmera digital foi inventada em 1975 por Steven Sasson na Kodak? Ela pesava 3.6 kg.",
    "Você sabia que o primeiro computador pessoal 'em kit', o Altair 8800, inspirou Bill Gates e Paul Allen a fundar a Microsoft?",
    "Você sabia que a primeira versão do Windows, o Windows 1.0, foi lançada em 1985?",
    "Você sabia que o primeiro computador da Apple, o Apple I, era vendido como uma placa-mãe que o usuário precisava montar em um case?",
    "Você sabia que a primeira loja da Apple foi inaugurada em 2001?",
    "Você sabia que o primeiro iPod, lançado em 2001, podia armazenar 1.000 músicas?",
    "Você sabia que o primeiro iPhone, lançado em 2007, não tinha App Store?",
    "Você sabia que o primeiro dispositivo Android, o HTC Dream (ou T-Mobile G1), foi lançado em 2008?",
    "Você sabia que o primeiro tablet moderno, o iPad, foi lançado pela Apple em 2010?",
    "Você sabia que o primeiro 'wearable' (dispositivo vestível) comercial foi um relógio com calculadora nos anos 80?",
    "Você sabia que a primeira transmissão de rádio transatlântica foi realizada por Guglielmo Marconi em 1901?",
    "Você sabia que a primeira televisão eletrônica foi demonstrada por Philo Farnsworth em 1927?",
    "Você sabia que o primeiro controle remoto de TV, chamado 'Lazy Bones', foi introduzido em 1950 e era conectado à TV por um fio?",
    "Você sabia que o primeiro VCR (videocassete) foi lançado em 1971?",
    "Você sabia que o primeiro DVD (Digital Versatile Disc) foi lançado no Japão em 1996?",
    "Você sabia que o primeiro disco Blu-ray foi lançado em 2006?",
    "Você sabia que o primeiro e-reader, o Rocket eBook, foi lançado em 1998?",
    "Você sabia que o primeiro carro elétrico foi construído em 1832, muito antes dos carros a combustão?",
    "Você sabia que a primeira rede social, a SixDegrees.com, foi lançada em 1997?",
    "Você sabia que o Facebook foi originalmente limitado a estudantes da Universidade de Harvard?",
    "Você sabia que o LinkedIn foi lançado em 2003, antes do Facebook, MySpace e Twitter?",
    "Você sabia que o primeiro 'meme' da internet é frequentemente considerado o 'Dancing Baby', que se tornou popular em 1996?",
    "Você sabia que o primeiro 'vlog' (vídeo blog) foi postado na internet em 2000?",
    "Você sabia que o primeiro serviço de streaming de música, o Napster, foi lançado em 1999?",
    "Você sabia que o primeiro assistente de voz, o 'Speech Recognition System' da IBM, foi demonstrado em 1962?",
    "Você sabia que a primeira inteligência artificial a vencer um campeão mundial de xadrez foi o Deep Blue da IBM, que derrotou Garry Kasparov em 1997?",

];
