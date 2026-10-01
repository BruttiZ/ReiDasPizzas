import { Check, X } from 'lucide-react';
export function Announcement({
  announcement,
  onDismiss,
}: {
  announcement: string;
  onDismiss: () => void;
}) {
  return (
    <>
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
      {announcement && (
        <div className="toast" aria-hidden="true">
          <Check size={17} />
          {announcement}
          <button className="icon-button" onClick={onDismiss} aria-label="Fechar aviso">
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
