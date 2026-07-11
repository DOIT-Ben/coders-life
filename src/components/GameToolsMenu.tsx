import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { GameModal } from './gameUiTypes';

export type GameToolsMenuProps = {
  openModal: (modal: GameModal) => void;
  onSave: () => void;
  onChangeCharacter: () => void;
};

export default function GameToolsMenu({ openModal, onSave, onChangeCharacter }: GameToolsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstCommandRef = useRef<HTMLButtonElement>(null);
  const commands: Array<{ label: string; run: () => void; danger?: boolean }> = [
    { label: '成就', run: () => openModal('ach') },
    { label: '商店', run: () => openModal('shop') },
    { label: '脚本', run: () => openModal('script') },
    { label: '收藏', run: () => openModal('bookmark') },
    { label: '保存', run: onSave },
    { label: '换角色', run: onChangeCharacter, danger: true },
  ];

  useEffect(() => {
    if (open) firstCommandRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [open]);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const items = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    if (items.length === 0) return;
    event.preventDefault();
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : event.key === 'ArrowDown'
          ? (currentIndex + 1 + items.length) % items.length
          : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  function runCommand(command: { run: () => void }) {
    setOpen(false);
    command.run();
  }

  return (
    <div className="game-tools" onKeyDown={handleKeyDown} ref={rootRef}>
      <button
        aria-controls="game-tools-menu"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="打开人生工具"
        className="btn-h game-tools-trigger"
        onClick={() => setOpen(current => !current)}
        ref={triggerRef}
        title="人生工具"
        type="button"
      >
        ⋯
      </button>
      {open ? (
        <div className="game-tools-menu" id="game-tools-menu" role="menu">
          {commands.map((command, index) => (
            <button
              className={command.danger ? 'game-tools-command danger' : 'game-tools-command'}
              data-command={command.label}
              key={command.label}
              onClick={() => runCommand(command)}
              ref={index === 0 ? firstCommandRef : undefined}
              role="menuitem"
              type="button"
            >
              {command.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
