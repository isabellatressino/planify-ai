export default function Badge({ className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-primary/30 bg-primary/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary ${className}`}
      {...props}
    />
  );
}
