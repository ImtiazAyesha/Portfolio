import Hero from "@/src/components/Hero/Hero";
import Expertise from "@/src/components/Expertise/Expertise";
import Projects from "@/src/components/Projects/Projects";
import Experience from "@/src/components/Experience/Experience";

export default function Home() {
  return (
    <main className="flex flex-col w-full relative">
      <Hero />
      <Expertise />
      <Experience />
      <Projects />
    </main>
  );
}
