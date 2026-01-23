export default function IconButton({
  as: asProp = "button",
  size = "md",
  className = "",
  ...props
}) {
  const Component = asProp;
  const base =
    "inline-flex items-center justify-center rounded-full border border-surface text-text-body transition-all duration-300 ease-out hover:text-text-titles hover:bg-surface/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer disabled:cursor-not-allowed disabled:opacity-60";
  const sizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };

  return (
    <Component
      className={`${base} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    />
  );
}
