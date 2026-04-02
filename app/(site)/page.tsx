import Hero from "@/src/components/Hero/Hero";
import About from "@/src/components/About/About";
import Experience from "@/src/components/Experience/Experience";
import FeaturedProducts from "@/src/components/FeaturedProducts/FeaturedProducts";
import LiveDemos from "@/src/components/LiveDemos/LiveDemos";
import Footer from "@/src/components/Footer/Footer";

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

