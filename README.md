# EduVoice Interactive

**EduVoice Interactive** é uma plataforma educacional imersiva que utiliza Inteligência Artificial Generativa (Google Gemini) para criar quizzes dinâmicos sobre qualquer assunto, narrados por uma voz neural sintética e acompanhados por trilhas sonoras adaptativas ou músicas escolhidas pelo usuário.

## 🚀 Funcionalidades Principais

- **Geração de Quizzes via IA:** Cria perguntas, respostas e explicações detalhadas sobre qualquer tema solicitado, com filtros de segurança.
- **Narrador Neural (TTS):** Utiliza o modelo `gemini-2.5-flash-preview-tts` para ler perguntas e feedbacks com entonação natural.
- **Motor de Áudio Híbrido:**
  - **Procedural:** Trilhas "Zen", "Cosmos" e "Focus" geradas em tempo real via Web Audio API (Osciladores e LFOs).
  - **YouTube Integration:** Toca músicas do YouTube em background (com tratamento robusto para erros de copyright/embed).
  - **Upload Local:** Permite ao usuário carregar seus próprios arquivos de áudio (MP3/WAV) via Blob URLs.
- **Controles de Áudio Avançados:** Mixer independente para volume da música e da voz, com persistência de estado e lógica de não-interrupção (idempotência).
- **Interface Reativa:** Design moderno e responsivo com Tailwind CSS, incluindo visualizadores de espectro de áudio.

## 🛠 Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript.
- **Estilização:** Tailwind CSS (via CDN).
- **IA & Integração:** Google Generative AI SDK (`@google/generative-ai`).
- **Áudio:**
  - **Web Audio API:** Para síntese sonora procedural, manipulação de ganho e reprodução de arquivos locais (`MediaElementSource`).
  - **YouTube IFrame API:** Para streaming de áudio externo.
- **Build Tool:** Vite + TypeScript para desenvolvimento e build de produção.
- **Testes:** Vitest + Testing Library para testes unitários e de integração.

## 📂 Estrutura do Projeto

```bash
/
├── index.html              # Ponto de entrada, Import Maps e estilos globais
├── index.tsx               # Montagem da aplicação React na DOM
├── App.tsx                 # Componente raiz, orquestrador de estado e telas
├── types.ts                # Definições de tipos TypeScript (Interfaces de Quiz, Config de Áudio)
├── constants.ts            # Constantes globais e dados iniciais (Mock data)
├── env.ts                  # Validação e carregamento de variáveis de ambiente (API Key)
├── components/             # Componentes de Interface do Usuário
│   ├── AudioControls.tsx   # Painel flutuante de mixer, upload e seleção de trilhas
│   ├── GameScreen.tsx      # Tela principal do jogo (pergunta e progresso)
│   ├── IntroScreen.tsx     # Tela inicial com gerador de quiz e histórico
│   ├── Narrator.tsx        # Componente visual do "robô" narrador (visualizador de áudio)
│   ├── QuizCard.tsx        # Card da pergunta com lógica de feedback visual
│   ├── ResultScreen.tsx    # Tela de pontuação final
│   ├── Loader.tsx          # Componente de carregamento animado
│   ├── Button.tsx          # Componente de botão reutilizável
│   └── YouTubeAudio.tsx    # Player "headless" do YouTube com tratamento de erros
├── services/               # Camada de Serviços (Lógica de Negócios)
│   ├── audioService.ts     # Singleton para Web Audio API (Gerencia osciladores e arquivos locais)
│   ├── geminiService.ts    # Comunicação com Google Gemini (Geração de Quiz e TTS)
│   ├── storageService.ts   # Persistência de dados no LocalStorage
│   └── ttsService.ts       # Gerenciador de filas de Text-to-Speech
└── hooks/
    └── useGameLogic.ts     # Hook personalizado (Custom Hook) para a máquina de estados do jogo
```

## ⚙️ Configuração e Execução

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- Uma **API Key do Google Gemini** (obtenha em [Google AI Studio](https://aistudio.google.com/app/apikey))
- Navegador moderno com suporte a Web Audio API

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/EmanuelErnesto/eduvoice.git
    cd eduvoice
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure a API Key:**

    Copie o arquivo `.env.example` para `.env`:

    ```bash
    cp .env.example .env
    ```

    Em seguida, edite o arquivo `.env` e adicione sua chave da API do Google Gemini:

    ```
    GEMINI_API_KEY=sua_chave_api_aqui
    ```

### Executando o Projeto

**Modo de Desenvolvimento:**

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

**Build de Produção:**

```bash
npm run build
```

**Preview do Build:**

```bash
npm run preview
```

**Executar Testes:**

```bash
npm test
```

**Executar Testes com UI:**

```bash
npm run test:ui
```

### Solução de Problemas

**Erro: "API Key is missing"**

- Verifique se o arquivo `.env` existe na raiz do projeto
- Certifique-se de que a variável `GEMINI_API_KEY` está definida corretamente
- Reinicie o servidor de desenvolvimento após criar/modificar o arquivo `.env`

**Erro ao carregar dependências**

- Remova a pasta `node_modules` e o arquivo `package-lock.json`
- Execute `npm install` novamente

**Porta 3000 já em uso**

- Você pode alterar a porta no arquivo `vite.config.ts`
- Ou encerrar o processo que está usando a porta 3000

## 📝 Notas de Desenvolvimento

- O projeto utiliza **Vite** como bundler para desenvolvimento rápido e build otimizado
- As dependências são instaladas via **npm** e não mais carregadas via CDN
- Testes podem ser executados com **Vitest** - uma alternativa moderna ao Jest
- A API do Google Generative AI foi atualizada para usar o pacote oficial `@google/generative-ai`

## 🧠 Detalhes de Implementação de Áudio (`audioService.ts`)

O serviço de áudio implementa um padrão **Singleton** e utiliza o grafo de nós da Web Audio API:

1.  **Nodes:**

    - `OscillatorNode`: Para gerar sons procedurais (ondas senoidais/triangulares).
    - `GainNode`: Para controle de volume independente (Música vs SFX).
    - `MediaElementAudioSourceNode`: Para integrar o elemento `<audio>` HTML5 (usado nos uploads manuais) ao grafo de áudio, permitindo que o controle de volume mestre funcione também para arquivos locais.

2.  **Idempotência:**
    Ao alterar o volume no slider, o serviço verifica (`currentBlobUrl` ou `currentTrack`) se a fonte de áudio já é a correta. Se for, ele apenas ajusta o ganho (`GainNode`) sem reiniciar a reprodução, garantindo uma experiência suave e contínua.

3.  **Tratamento de Erros do YouTube:**
    O componente detecta códigos de erro 150/153 (restrição de reprodução em sites externos) e sugere ao usuário buscar versões "Lyric Video", que geralmente possuem menos restrições de direitos autorais para embed.

---

**EduVoice Interactive** - _Aprenda ouvindo._
