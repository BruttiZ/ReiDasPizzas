export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4Z" />
      <path d="m8.2 7.5 1.4 2.6-1 1.1c.8 1.7 2 2.9 3.9 3.6l1.1-1.2 2.8 1.3c-.2 1.6-1.5 2.2-2.8 1.8-3.8-1-6.7-3.9-7.1-6.5-.2-1.3.4-2.3 1.7-2.7Z" />
    </svg>
  );
}
