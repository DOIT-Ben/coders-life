import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';

type ModalShellProps = {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  close?: () => void;
  title: string;
  wide?: boolean;
};

export default function ModalShell({ actions, children, className = '', close, title, wide }: ModalShellProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && close) {
      event.preventDefault();
      close();
    }
  }

  return (
    <div className="modal-overlay open">
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={`modal${wide ? ' wide-modal' : ''}${className ? ` ${className}` : ''}`}
        onKeyDown={handleKeyDown}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-head">
          <div className="modal-title" id={titleId}>{title}</div>
          {close ? <button aria-label={`关闭${title}`} onClick={close} type="button">×</button> : null}
        </div>
        {children}
        {actions}
      </div>
    </div>
  );
}
