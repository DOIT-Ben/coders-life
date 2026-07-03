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
      <div className="screen active" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>这段人生遇到了意外中断</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', maxWidth: 420, lineHeight: 1.6 }}>
          你的进度会随每次行动自动保存在本机。重新加载后可以从最近一次记录继续，不会丢失存档。
        </div>
        <button className="btn-continue" onClick={() => window.location.reload()}>重新加载</button>
      </div>
    );
  }
}
