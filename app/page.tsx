import { Header } from "@/components/site/header";
import { Hero } from "@/components/site/hero";
import { About, Skills, Curriculum, Projects, Contact } from "@/components/site/sections";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Curriculum />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
