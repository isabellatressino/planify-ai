export default function Card({ as: asProp = "div", className = "", ...props }) {
  const Component = asProp;
  return (
    <Component
      className={`rounded-2xl border border-text-body/30 bg-surface p-5 shadow-xl shadow-black/20 backdrop-blur-sm ${className}`}
      {...props}
    />
  );
}
