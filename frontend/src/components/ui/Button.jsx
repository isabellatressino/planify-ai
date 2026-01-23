export default function Button({
  as: asProp = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const Component = asProp;
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "bg-primary text-background hover:bg-primary-hover",
    outline:
      "border border-text-body/30 text-text-titles hover:border-primary hover:text-primary",
    ghost: "text-text-body hover:text-text-titles hover:bg-surface/70",
    red: "text-text-titles bg-red-700 hover:bg-red-600 border border-red-700 hover:border hover:border-red-700"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-3 text-sm",
  };

  return (
    <Component
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    />
  );
}
