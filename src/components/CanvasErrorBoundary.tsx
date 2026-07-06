"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches failures from the 3D Canvas (e.g. WebGL unavailable / context lost).
 * On error it calls onError (used to release the loading screen) and renders
 * nothing — the page's dark background remains and the HTML content stays usable.
 */
export default class CanvasErrorBoundary extends Component<
  { children: ReactNode; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
