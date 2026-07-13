import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Portfolio from "./components/Portfolio/Portfolio";
import Pricing from "./components/Pricing/Pricing";
import FAQSection from "./components/FAQ/FAQ";
import Contacts from "./components/Contacts/Contacts";
import Footer from "./components/Footer/Footer";
import GrassDivider from "./components/GrassDivider/GrassDivider";
import MowerEasterEgg from "./components/MowerEasterEgg/MowerEasterEgg"; {/* ← добавили */}
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <MowerEasterEgg /> {/* ← пасхалка, живёт поверх всей страницы */}

      <Header />

      <div className={styles.content}>
        <Hero />
        <GrassDivider />
        <About />
        <GrassDivider />
        <Services />
        <GrassDivider />
        <Portfolio />
        <GrassDivider />
        <Pricing />
        <GrassDivider />
        <FAQSection />
        <GrassDivider />
        <Contacts />
      </div>

      <Footer />
    </div>
  );
}

export default App;