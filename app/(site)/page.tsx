import dynamic from "next/dynamic";
import Hero from "@/src/components/Hero/Hero";

const About = dynamic(() => import("@/src/components/About/About"));
const Experience = dynamic(() => import("@/src/components/Experience/Experience"));
const FeaturedProducts = dynamic(() => import("@/src/components/FeaturedProducts/FeaturedProducts"));
const LiveDemos = dynamic(() => import("@/src/components/LiveDemos/LiveDemos"));
const Footer = dynamic(() => import("@/src/components/Footer/Footer"));

export default function Home() {
  return (
    <main className="flex flex-col w-full relative">
      <Hero />
      <About />
      <Experience />
      <FeaturedProducts />
      <LiveDemos />
      <Footer />
    </main>
  );
}

