export default function Input({ className = "", ...props }) {
  const base =
    "w-full rounded-xl border border-text-body/30 bg-surface px-4 py-3 text-sm text-text-titles placeholder:text-text-body/70 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60";

  return <input className={`${base} ${className}`} {...props} />;
}
