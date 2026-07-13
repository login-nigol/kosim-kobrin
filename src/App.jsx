/* ===== ГЛАВНЫЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ ===== */
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Portfolio from "./components/Portfolio/Portfolio";
import Pricing from "./components/Pricing/Pricing";
import Contacts from "./components/Contacts/Contacts";
import Footer from "./components/Footer/Footer";
import GrassDivider from "./components/GrassDivider/GrassDivider";
import FAQSection from "./components/FAQ/FAQ";

function App() {
  return (
    <div className={styles.app}>
      <Header />

      {/* ===== КОНТЕНТНЫЕ СЕКЦИИ С ОТСТУПОМ ПО БОКАМ ===== */}
      <div className={styles.content}>
        <Hero />
        <GrassDivider />
        <About />
        <GrassDivider />
        <FAQSection />
        <GrassDivider />
        <Services />
        <GrassDivider />
        <Portfolio />
        <GrassDivider />
        <Pricing />
        <GrassDivider />
        <Contacts />
      </div>

      <Footer />
    </div>
  );
}

export default App;