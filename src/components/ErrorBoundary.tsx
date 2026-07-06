import { Component, type ReactNode } from 'react';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('游戏运行异常：', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="screen active error-screen">
        <div className="error-title">这段人生遇到了意外中断</div>
        <div className="error-copy">
          你的进度会随每次行动自动保存在本机。重新加载后可以从最近一次记录继续，不会丢失存档。
        </div>
        <button className="btn-continue" onClick={() => window.location.reload()}>重新加载</button>
      </div>
    );
  }
}
