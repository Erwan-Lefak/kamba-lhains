import ImageHero from './ImageHero';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section
      className={styles.hero}
      aria-label="Hero section"
      role="banner"
    >
      <ImageHero imageSrc="/images/hero-shooting.jpg" />
    </section>
  );
};

export default Hero;