import { Container } from "@/components/ui/container";

/** Shown while a route's server components stream in. */
export default function Loading() {
  return (
    <div className="pt-32 pb-24 sm:pt-40">
      <Container>
        <div className="space-y-5" role="status" aria-label="Loading page">
          <div className="skeleton h-3 w-28 rounded-full" />
          <div className="skeleton h-11 w-full max-w-2xl rounded-xl" />
          <div className="skeleton h-11 w-full max-w-md rounded-xl" />
          <div className="skeleton mt-4 h-4 w-full max-w-lg rounded-full" />
          <div className="skeleton h-4 w-full max-w-sm rounded-full" />
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="skeleton h-56 rounded-card" />
          ))}
        </div>
      </Container>
    </div>
  );
}
