import React from "react";
import { PageTitle } from "@/components/ui/PageTitle";
import { TeamMemberCard } from "@/components/ui/TeamMemberCard";
import { Card } from "@/components/ui/Card";

interface TeamMember {
  name: string;
  matricula: string;
  photo: string;
}

export const Team: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Emanuel Ernesto",
      matricula: "01614951",
      photo: "assets/foto-emanuel.enc",
    },
    {
      name: "Thiago Oliveira",
      matricula: "01089643",
      photo: "assets/foto-thiago.enc",
    },
    {
      name: "Wesley Ruan",
      matricula: "01555915",
      photo: "assets/foto-ruan.enc",
    },
    {
      name: "Guilherme de Luna",
      matricula: "01615925",
      photo: "assets/foto-guilherme.enc",
    },
    {
      name: "Antônio Henrique",
      matricula: "01647043",
      photo: "assets/foto-antonio.enc",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <PageTitle subtitle="Conheça as pessoas por trás do EduVoice Interactive">
          Nossa Equipe
        </PageTitle>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.matricula}
              name={member.name}
              matricula={member.matricula}
              photo={member.photo}
            />
          ))}
        </div>

        <Card className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            Faça Parte da Equipe
          </h2>
          <p className="text-slate-300 mb-6">
            Este é um projeto de código aberto. Contribuições são bem-vindas!
          </p>
          <a
            href="https://github.com/EmanuelErnesto/eduvoice"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            Ver no GitHub
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </Card>
      </div>
    </div>
  );
};
