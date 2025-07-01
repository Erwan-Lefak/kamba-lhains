import VideoHero from './VideoHero';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './Hero.module.css';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section 
      className={styles.hero}
      aria-label="Hero section"
      role="banner"
    >
      <VideoHero
        videoSrc="/0629.mp4"
        posterSrc="/hero-poster.jpg"
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
      />
      
      {/* SEO Schema markup */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "KAMBA LHAINS Hero Video",
            "description": "Luxury fashion brand presentation video",
            "thumbnailUrl": "/hero-poster.jpg",
            "uploadDate": new Date().toISOString(),
            "duration": "PT30S",
            "contentUrl": "/0629.mp4",
            "embedUrl": typeof window !== 'undefined' ? window.location.href : "https://kambalahins.com",
            "publisher": {
              "@type": "Organization",
              "name": "KAMBA LHAINS",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            }
          })
        }}
      />
    </section>
  );
};

export default Hero;