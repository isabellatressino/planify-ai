export default function PageHeader({ title, subtitle, actions, icon: Icon }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {Icon ? (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-text-titles">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-text-body">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
