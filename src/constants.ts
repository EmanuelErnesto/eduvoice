import { Question, AudioConfig } from "./types";

export const ERROR_CODES = {
  IMPROPER_CONTENT: "CONTEUDO_IMPROPRIO",
  CONTENT_BLOCKED: "CONTEUDO_BLOQUEADO",
  INVALID_FORMAT: "FORMATO_INVALIDO",
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "O que é um sistema multimídia?",
    options: ["Um sistema que usa apenas texto", "Um sistema que integra diferentes tipos de mídia", "Um sistema operacional", "Um tipo de hardware"],
    correctIndex: 1,
    explanation: "Sistemas multimídia integram texto, áudio, vídeo, animação e imagens para criar experiências ricas e interativas."
  },
  {
    id: 2,
    text: "Qual formato de áudio oferece compressão com perda de qualidade?",
    options: ["WAV", "FLAC", "MP3", "AIFF"],
    correctIndex: 2,
    explanation: "MP3 é um formato de áudio com compressão lossy (com perda), reduzindo o tamanho do arquivo removendo dados menos perceptíveis ao ouvido humano."
  },
  {
    id: 3,
    text: "O que significa 'streaming' em sistemas multimídia?",
    options: ["Baixar o arquivo completamente antes de reproduzir", "Reproduzir conteúdo enquanto ele está sendo transferido", "Comprimir arquivos de vídeo", "Editar áudio em tempo real"],
    correctIndex: 1,
    explanation: "Streaming permite a reprodução de conteúdo multimídia enquanto ele está sendo transmitido, sem necessidade de download completo."
  },
  {
    id: 4,
    text: "Qual a taxa de quadros padrão para vídeos em países que usam PAL?",
    options: ["24 fps", "25 fps", "30 fps", "60 fps"],
    correctIndex: 1,
    explanation: "O sistema PAL, usado na Europa e outros países, opera a 25 quadros por segundo (fps)."
  },
  {
    id: 5,
    text: "O que é resolução de imagem?",
    options: ["A cor da imagem", "O número de pixels em uma imagem", "O tamanho do arquivo", "O formato do arquivo"],
    correctIndex: 1,
    explanation: "Resolução de imagem refere-se ao número de pixels que compõem a imagem, geralmente expressa como largura × altura."
  },
  {
    id: 6,
    text: "Qual codec de vídeo é conhecido por sua alta eficiência de compressão?",
    options: ["MJPEG", "H.264", "DV", "Cinepak"],
    correctIndex: 1,
    explanation: "H.264 (também conhecido como AVC) é amplamente usado por sua excelente compressão e qualidade, sendo padrão em muitas plataformas."
  },
  {
    id: 7,
    text: "O que é taxa de amostragem em áudio digital?",
    options: ["Volume do áudio", "Frequência com que o sinal analógico é medido", "Qualidade do microfone", "Duração do arquivo"],
    correctIndex: 1,
    explanation: "Taxa de amostragem (sample rate) é a frequência com que amostras do sinal analógico são capturadas por segundo, medida em Hz."
  },
  {
    id: 8,
    text: "Qual formato de imagem suporta transparência?",
    options: ["JPEG", "PNG", "BMP", "TIFF sem alfa"],
    correctIndex: 1,
    explanation: "PNG suporta canal alfa para transparência, permitindo imagens com áreas transparentes ou semi-transparentes."
  },
  {
    id: 9,
    text: "O que significa RGB em sistemas de cores?",
    options: ["Red, Green, Blue", "Really Good Brightness", "Render Graphics Basic", "Resolution Grade Base"],
    correctIndex: 0,
    explanation: "RGB representa as cores primárias aditivas: Red (Vermelho), Green (Verde) e Blue (Azul), usadas em displays digitais."
  },
  {
    id: 10,
    text: "Qual a taxa de amostragem padrão para áudio de CD?",
    options: ["22.05 kHz", "44.1 kHz", "48 kHz", "96 kHz"],
    correctIndex: 1,
    explanation: "CDs de áudio usam taxa de amostragem de 44.1 kHz, que segundo o teorema de Nyquist, permite capturar frequências até 22.05 kHz."
  },
  {
    id: 11,
    text: "O que é bitrate em multimídia?",
    options: ["Taxa de bits por segundo", "Qualidade da imagem", "Resolução do vídeo", "Volume do áudio"],
    correctIndex: 0,
    explanation: "Bitrate é a quantidade de dados processados por unidade de tempo, geralmente medida em bits por segundo (bps)."
  },
  {
    id: 12,
    text: "Qual tecnologia permite interação em sistemas multimídia?",
    options: ["Codecs", "Interface de usuário", "Compressão", "Renderização"],
    correctIndex: 1,
    explanation: "A interface de usuário permite interação, possibilitando que usuários controlem e naveguem pelo conteúdo multimídia."
  },
  {
    id: 13,
    text: "O que é um codec?",
    options: ["Um tipo de arquivo", "Software que codifica/decodifica dados", "Um formato de vídeo", "Um dispositivo de hardware"],
    correctIndex: 1,
    explanation: "Codec (codificador-decodificador) é um software ou hardware que comprime e descomprime dados multimídia."
  },
  {
    id: 14,
    text: "Qual formato é vetorial?",
    options: ["JPEG", "PNG", "SVG", "GIF"],
    correctIndex: 2,
    explanation: "SVG (Scalable Vector Graphics) é um formato vetorial que usa equações matemáticas, permitindo redimensionamento sem perda de qualidade."
  },
  {
    id: 15,
    text: "O que é sincronização em multimídia?",
    options: ["Backup de arquivos", "Coordenação temporal entre diferentes mídias", "Compressão de dados", "Edição de vídeo"],
    correctIndex: 1,
    explanation: "Sincronização é a coordenação temporal entre diferentes elementos multimídia, como áudio e vídeo, para reprodução coerente."
  },
  {
    id: 16,
    text: "Qual a profundidade de cor comum em imagens digitais?",
    options: ["8 bits", "16 bits", "24 bits", "32 bits"],
    correctIndex: 2,
    explanation: "24 bits (8 bits por canal RGB) é comum em imagens digitais, permitindo cerca de 16,7 milhões de cores."
  },
  {
    id: 17,
    text: "O que é latência em streaming?",
    options: ["Qualidade do vídeo", "Atraso entre transmissão e recepção", "Taxa de quadros", "Resolução"],
    correctIndex: 1,
    explanation: "Latência é o atraso temporal entre o momento que o conteúdo é transmitido e quando é recebido e reproduzido."
  },
  {
    id: 18,
    text: "Qual formato de vídeo é nativo da web?",
    options: ["AVI", "WebM", "MOV", "WMV"],
    correctIndex: 1,
    explanation: "WebM foi desenvolvido especificamente para a web, com codecs abertos e otimizado para streaming na internet."
  },
  {
    id: 19,
    text: "O que é MIDI?",
    options: ["Formato de áudio comprimido", "Protocolo de comunicação de instrumentos musicais", "Tipo de microfone", "Editor de vídeo"],
    correctIndex: 1,
    explanation: "MIDI (Musical Instrument Digital Interface) é um protocolo que permite comunicação entre instrumentos musicais eletrônicos e computadores."
  },
  {
    id: 20,
    text: "Qual a resolução do Full HD?",
    options: ["1280x720", "1920x1080", "2560x1440", "3840x2160"],
    correctIndex: 1,
    explanation: "Full HD (1080p) tem resolução de 1920x1080 pixels, oferecendo 2.073.600 pixels totais."
  },
  {
    id: 21,
    text: "O que é antialiasing em gráficos?",
    options: ["Aumento de resolução", "Técnica para suavizar bordas serrilhadas", "Compressão de imagem", "Ajuste de cor"],
    correctIndex: 1,
    explanation: "Antialiasing é uma técnica que suaviza bordas serrilhadas em gráficos digitais, melhorando a aparência visual."
  },
  {
    id: 22,
    text: "Qual é a função do buffer em streaming?",
    options: ["Comprimir dados", "Armazenar temporariamente dados antes da reprodução", "Editar vídeo", "Aumentar resolução"],
    correctIndex: 1,
    explanation: "Buffer armazena temporariamente dados de streaming para garantir reprodução suave, compensando variações na velocidade de rede."
  },
  {
    id: 23,
    text: "O que é HDR em vídeo?",
    options: ["High Definition Rate", "High Dynamic Range", "Hard Drive Recording", "High Data Resolution"],
    correctIndex: 1,
    explanation: "HDR (High Dynamic Range) aumenta o contraste e a gama de cores, mostrando mais detalhes em áreas claras e escuras."
  },
  {
    id: 24,
    text: "Qual formato suporta animação?",
    options: ["JPEG", "PNG", "GIF", "BMP"],
    correctIndex: 2,
    explanation: "GIF suporta múltiplos frames, permitindo animações simples, sendo amplamente usado para animações curtas na web."
  },
  {
    id: 25,
    text: "O que é renderização 3D?",
    options: ["Captura de vídeo", "Processo de criar imagem 2D de modelo 3D", "Edição de áudio", "Compressão de dados"],
    correctIndex: 1,
    explanation: "Renderização 3D é o processo computacional de gerar uma imagem 2D a partir de um modelo tridimensional."
  },
  {
    id: 26,
    text: "Qual protocolo é usado para streaming de vídeo ao vivo?",
    options: ["HTTP", "RTMP", "FTP", "SMTP"],
    correctIndex: 1,
    explanation: "RTMP (Real-Time Messaging Protocol) foi desenvolvido para streaming de áudio e vídeo de baixa latência em tempo real."
  },
  {
    id: 27,
    text: "O que é uma paleta de cores?",
    options: ["Ferramenta de edição", "Conjunto limitado de cores disponíveis", "Tipo de monitor", "Formato de arquivo"],
    correctIndex: 1,
    explanation: "Paleta de cores é um conjunto limitado de cores disponíveis para uso em uma imagem ou sistema gráfico."
  },
  {
    id: 28,
    text: "Qual a diferença entre áudio mono e estéreo?",
    options: ["Qualidade do som", "Mono tem 1 canal, estéreo tem 2", "Taxa de amostragem", "Formato de arquivo"],
    correctIndex: 1,
    explanation: "Áudio mono usa um canal, enquanto estéreo usa dois canais (esquerdo e direito), criando sensação espacial de som."
  },
  {
    id: 29,
    text: "O que é compressão lossless?",
    options: ["Compressão sem perda de dados", "Compressão com perda mínima", "Tipo de codec", "Formato de vídeo"],
    correctIndex: 0,
    explanation: "Compressão lossless (sem perda) reduz tamanho do arquivo mantendo todos os dados originais, permitindo recuperação perfeita."
  },
  {
    id: 30,
    text: "O que é aspect ratio?",
    options: ["Taxa de quadros", "Relação entre largura e altura", "Resolução", "Qualidade da imagem"],
    correctIndex: 1,
    explanation: "Aspect ratio é a proporção entre largura e altura de uma imagem ou tela, como 16:9 (widescreen) ou 4:3 (tradicional)."
  }
];

export const INITIAL_AUDIO_CONFIG: AudioConfig = {
  musicVolume: 0.3,
  voiceVolume: 1.0,
  isMuted: false,
  activeTrack: "voz-violao",
  customFileBlobUrl: "",
  customFileName: "",
};
