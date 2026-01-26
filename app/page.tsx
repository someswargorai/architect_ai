import FeatureSection from "./components/home/feature-section";
import Footer from "./components/home/Footer";
import Header from "./components/home/Header";
import Hero from "./components/home/Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-500/30">
      <Header />

      <main className="flex-grow">
        <>
          <Hero />
          <FeatureSection />
        </>
      </main>

      <Footer />
    </div>
  );
}
