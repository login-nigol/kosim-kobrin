/* ===== ГЛАВНЫЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ ===== */
// Собираем все секции лендинга по порядку
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Portfolio from "./components/Portfolio/Portfolio";
import Pricing from "./components/Pricing/Pricing";
import Contacts from "./components/Contacts/Contacts";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Pricing />
      <Contacts />
      <Footer />
    </div>
  );
}

export default App;