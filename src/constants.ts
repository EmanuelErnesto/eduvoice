import { Question, AudioConfig } from "./types";

export const ERROR_CODES = {
  IMPROPER_CONTENT: "CONTEUDO_IMPROPRIO",
  CONTENT_BLOCKED: "CONTEUDO_BLOQUEADO",
  INVALID_FORMAT: "FORMATO_INVALIDO",
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Qual planeta do nosso sistema solar é conhecido como o Planeta Vermelho?",
    options: ["Vênus", "Marte", "Júpiter", "Saturno"],
    correctIndex: 1,
    explanation:
      "Marte é chamado de Planeta Vermelho devido ao óxido de ferro predominante em sua superfície, que lhe confere uma aparência avermelhada.",
  },
  {
    id: 2,
    text: "Qual é o processo pelo qual as plantas convertem a luz solar em energia?",
    options: ["Respiração", "Fotossíntese", "Transpiração", "Germinação"],
    correctIndex: 1,
    explanation:
      "A fotossíntese é o processo utilizado por plantas para produzir seu próprio alimento usando luz solar, água e dióxido de carbono.",
  },
  {
    id: 3,
    text: "Quem pintou a famosa obra de arte 'Mona Lisa'?",
    options: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Claude Monet",
    ],
    correctIndex: 2,
    explanation:
      "Leonardo da Vinci, um polímata do Renascimento, pintou a Mona Lisa no início do século XVI.",
  },
];

export const INITIAL_AUDIO_CONFIG: AudioConfig = {
  musicVolume: 0.3,
  voiceVolume: 1.0,
  isMuted: false,
  activeTrack: "voz-violao",
  customFileBlobUrl: "",
  customFileName: "",
};
