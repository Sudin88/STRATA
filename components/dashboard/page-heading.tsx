import { Container } from "@/components/ui/container";

/*
 * A thin title bar for each dashboard content page. Sign-out and navigation
 * live in the sidebar now; this is just the page's heading, an optional
 * one-line description, and an optional actions slot (e.g. Export CSV).
 */
export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Container className="pt-8 pb-2 sm:pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-heading text-xl font-semibold text-fg">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-mut">{description}</p>
          )}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </Container>
  );
}
