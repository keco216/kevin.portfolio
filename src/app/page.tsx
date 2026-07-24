import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { SystemMap } from "@/components/SystemMap";
import { Projects } from "@/components/Projects";
import { GitHubCallout } from "@/components/GitHubCallout";
import { Principles } from "@/components/Principles";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1 overflow-x-clip">
      <Hero />
      <About />
      <Skills />
      <SystemMap />
      <Projects />
      <GitHubCallout />
      <Principles />
      <Footer />
    </main>
  );
}
