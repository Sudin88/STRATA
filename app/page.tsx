import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { Services } from "@/components/services";
import { WhyAI } from "@/components/why-ai";
import { Work } from "@/components/work";
import { Metrics } from "@/components/metrics";
import { Cta } from "@/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services
        limit={3}
        viewAll={{ label: "View all seven services", href: "/services" }}
      />
      <WhyAI />
      <Work viewAll={{ label: "More about our work", href: "/work" }} />
      <Metrics />
      <Cta />
    </>
  );
}
