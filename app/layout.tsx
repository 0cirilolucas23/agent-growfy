// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Importa a fonte Inter do Google Fonts
import "./globals.css"; // Importa seu arquivo CSS global

// Define a fonte Inter. Isso a carrega e a torna disponível para uso.
// 'subsets: ["latin"]' é importante para incluir os caracteres latinos.
const inter = Inter({ subsets: ["latin"] });

// Metadados para o seu aplicativo (título da aba do navegador, descrição, etc.)
// Isso é importante para SEO e para o navegador exibir informações corretas.
export const metadata: Metadata = {
  title: "Agent Games | Assistente de IA para Games e Negócios", // Título que aparece na aba do navegador
  description: "Seu assistente de IA para estratégias de jogos e insights de negócios, impulsionado por Gemini.", // Descrição para motores de busca
};

// Este é o componente de layout principal do seu aplicativo.
// Ele envolve todas as suas páginas.
export default function RootLayout({
  children, // 'children' representa o conteúdo das suas páginas (como app/page.tsx)
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR"> {/* A tag <html> do seu documento, com idioma português */}
      {/* A tag <body>. A classe da fonte 'inter.className' aplica a fonte Inter ao body e seus filhos. */}
      <body className={inter.className}>
        {children} {/* Aqui é onde o conteúdo da sua página (app/page.tsx) será renderizado */}
      </body>
    </html>
  );
}