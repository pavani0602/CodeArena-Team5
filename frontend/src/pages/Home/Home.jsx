import Hero from "../../components/Hero/Hero";
import Features from "../../components/Features/Features";
import Stats from "../../components/Stats/Stats";
import CTA from "../../components/CTA/CTA";

function Home () {
    return (
        <main className="home-page">
      <Hero />
      <Features />
      <Stats />
      <CTA />
    </main>
    );
}

export default Home;

