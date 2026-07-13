/* ===== ПОДВАЛ САЙТА ===== */
// Копирайт, короткая ссылка на соцсеть/контакт, год — динамически
import { CONTACTS } from "../../config/siteData";
import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.text}>
          © {currentYear} КосимКобрин. Усе правы абаронены.
        </p>
        <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className={styles.link}>
          Telegram
        </a>
      </div>
    </footer>
  );
}

export default Footer;