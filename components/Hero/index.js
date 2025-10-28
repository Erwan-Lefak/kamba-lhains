import VideoHero from './VideoHero';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section 
      className={styles.hero}
      aria-label="Hero section"
      role="banner"
    >
      <VideoHero videoSrc="https://res.cloudinary.com/diibzuu9j/video/upload/v1761667241/Kambaween_rotation_rvbeqq.mov" />
    </section>
  );
};

export default Hero;