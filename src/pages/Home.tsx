import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTitle } from "@/components/ui/PageTitle";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { TechCard } from "@/components/ui/TechCard";
import { getAssetPath } from "@/utils/assets";

export const Home: React.FC = () => {
  const animationVideoRef = useRef<HTMLVideoElement>(null);
  const presentationVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (animationVideoRef.current) {
      animationVideoRef.current.play().catch(() => {});
    }
  }, []);

  const technologies = [
    { name: "React 19", desc: "Framework JavaScript moderno" },
    { name: "TypeScript", desc: "Tipagem estática" },
    { name: "Google Gemini AI", desc: "IA Generativa" },
    { name: "Web Audio API", desc: "Áudio procedural" },
    { name: "Vite", desc: "Build tool rápido" },
    { name: "Tailwind CSS", desc: "Estilização moderna" },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <PageTitle>EduVoice Interactive</PageTitle>

        <div className="flex justify-center mb-8">
          <img
            key="hero-image"
            src={getAssetPath("assets/imagem-vetorial.jpeg")}
            alt="EduVoice Interactive - Ilustração"
            className="max-w-md w-full rounded-2xl shadow-2xl border-4 border-blue-500/30"
            loading="eager"
          />
        </div>

        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto text-center">
          Uma plataforma educacional imersiva que utiliza Inteligência
          Artificial para criar quizzes dinâmicos sobre qualquer assunto,
          narrados por voz neural sintética.
        </p>

        <div className="flex justify-center mb-16">
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Começar Quiz
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        <section className="mb-16">
          <SectionTitle>Sobre o Projeto</SectionTitle>
          <Card>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <video
                  ref={animationVideoRef}
                  key="animation-video"
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full max-w-sm rounded-lg shadow-lg border-2 border-blue-500/30"
                >
                  <source
                    src={getAssetPath("assets/animation.mp4")}
                    type="video/mp4"
                  />
                  Seu navegador não suporta vídeos em loop.
                </video>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  O EduVoice Interactive é uma plataforma inovadora que combina
                  tecnologia de ponta com educação, oferecendo uma experiência
                  de aprendizado única e envolvente.
                </p>
                <h3 className="text-xl font-semibold text-blue-400 mb-3">
                  🚀 Funcionalidades Principais:
                </h3>
                <ul className="text-slate-300 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Geração de Quizzes via IA:</strong> Cria perguntas,
                    respostas e explicações detalhadas sobre qualquer tema
                    usando Google Gemini
                  </li>
                  <li>
                    <strong>Narrador Neural (TTS):</strong> Voz sintética
                    natural para ler perguntas e feedbacks
                  </li>
                  <li>
                    <strong>Motor de Áudio Híbrido:</strong> Trilhas
                    procedurais, e upload de arquivos locais
                  </li>
                  <li>
                    <strong>Controles Avançados:</strong> Mixer independente
                    para volume de música e voz
                  </li>
                  <li>
                    <strong>Interface Reativa:</strong> Design moderno e
                    responsivo com visualizadores de áudio
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-16">
          <SectionTitle>Vídeo de Apresentação</SectionTitle>
          <Card className="p-4">
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
              <video
                ref={presentationVideoRef}
                key="presentation-video"
                controls
                preload="metadata"
                className="w-full h-full"
              >
                <source
                  src={getAssetPath("assets/video.mp4")}
                  type="video/mp4"
                />
                Seu navegador não suporta a reprodução de vídeo.
              </video>
            </div>
          </Card>
        </section>

        <section className="mb-16">
          <SectionTitle>Áudio de Apresentação</SectionTitle>
          <Card>
            <div className="flex flex-col items-center justify-center">
              <div className="mb-6 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-slate-300 mb-4">
                  Ouça a apresentação do projeto
                </p>
              </div>
              <audio
                ref={audioRef}
                key="intro-audio"
                controls
                preload="metadata"
                className="w-full max-w-md"
              >
                <source
                  src={getAssetPath("assets/intro.ogg")}
                  type="audio/ogg"
                />
                Seu navegador não suporta a reprodução de áudio.
              </audio>
            </div>
          </Card>
        </section>

        <section>
          <SectionTitle>Tecnologias Utilizadas</SectionTitle>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech) => (
              <TechCard
                key={tech.name}
                name={tech.name}
                description={tech.desc}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
