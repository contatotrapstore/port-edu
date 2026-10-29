"use client";

import { Component, type ReactNode } from "react";

/**
 * Se a cena 3D falhar (textura, shader, WebGL), a página volta ao pôster e o
 * case continua funcionando pela versão plana. Nada da navegação depende dela.
 */
export default class SceneBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
