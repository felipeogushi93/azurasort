"use client";

import { Component, type ReactNode } from "react";

/**
 * Protege a revelação: se a animação (vídeo/3D) quebrar, não derruba a página
 * nem perde o resultado — mostra um fallback com botão para ver o resultado.
 */
export class RevealErrorBoundary extends Component<
  { children: ReactNode; onClose: () => void; label: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[reveal] erro na animação:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-void p-8 text-center">
          <span className="text-4xl">🎉</span>
          <p className="max-w-xs text-white/80">
            A animação não pôde ser carregada, mas o seu sorteio foi concluído normalmente.
          </p>
          <button
            onClick={this.props.onClose}
            className="rounded-full bg-gradient-to-r from-rose to-gold px-8 py-3 font-display font-bold text-white shadow-gold"
          >
            {this.props.label}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
