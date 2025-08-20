import VideoHero from './VideoHero';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section 
      className={styles.hero}
      aria-label="Hero section"
      role="banner"
    >
      <VideoHero videoSrc="https://res.cloudinary.com/diibzuu9j/video/upload/v1755520950/ACCUEIL_krmrok.mp4" />
    </section>
  );
};

export default Hero;