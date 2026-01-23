import { Check } from "lucide-react";

export default function Checkbox({
  checked,
  onChange,
  id,
  disabled = false,
  className = "",
  children,
}) {
  return (
    <label
      htmlFor={id}
      className={`inline-flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-300 ease-out hover:bg-surface/60 ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-md border border-text-body/40 bg-background transition-all duration-300 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
          checked ? "border-primary bg-primary" : ""
        }`}
        aria-hidden="true"
      >
        {checked ? <Check size={14} className="text-background" /> : null}
      </span>
      <span className="text-text-titles">{children}</span>
    </label>
  );
}
