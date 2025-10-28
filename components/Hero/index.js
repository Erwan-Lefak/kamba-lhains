import VideoHero from './VideoHero';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section 
      className={styles.hero}
      aria-label="Hero section"
      role="banner"
    >
      <VideoHero videoSrc="/Kambaween_rotation.MOV" />
    </section>
  );
};

export default Hero;