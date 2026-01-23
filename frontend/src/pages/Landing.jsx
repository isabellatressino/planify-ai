import CTA from "../components/landing/CTA.jsx";
import Features from "../components/landing/Features.jsx";
import Footer from "../components/landing/Footer.jsx";
import Hero from "../components/landing/Hero.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";

export default function Landing() {
  return (
    <main className="">
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
