import Image from 'next/image';
import styles from '../styles/HomePage.module.css';

interface CollectionHeaderProps {
  collection: 'exclusivites' | 'aube' | 'zenith' | 'crepuscule';
  title?: string;
  description?: string;
  imagePath?: string;
  galleryImages?: string[];
  customImagePath?: string;
}

const collectionData = {
  exclusivites: {
    title: 'Exclusivités',
    description: 'Nos exclusivités sont des pièces conçues en exemplaire unique.\nChaque création est réalisée dans une taille spécifique, à partir de tissus en quantité très limitée : fins de rouleaux, stocks restants ou chutes revalorisées, ainsi que des collaborations spontanées avec divers créatifs.',
    imagePath: '/exclu2.jpg',
    galleryImages: [
      'IMG_2885.jpeg', 'IMG_2917.jpeg', 'IMG_2918.jpeg', 'IMG_2919.jpeg',
      'IMG_2920.jpeg', 'IMG_2921.jpeg', 'IMG_2922.jpeg', 'IMG_2923.jpeg'
    ]
  },
  aube: {
    title: 'Aube',
    description: 'L\'Aube représente le début d\'une nouvelle journée, un moment de renouveau et de promesse. Cette collection capture l\'essence de ces premiers instants lumineux, où la lumière naissante révèle la beauté du monde qui s\'éveille.',
    imagePath: '/aube.jpg',
    galleryImages: [
      'IMG_3036.jpeg', 'IMG_3046.jpeg', 'IMG_3047.jpeg', 'IMG_3048.jpeg',
      'IMG_3049.jpeg', 'IMG_3050.jpeg', 'IMG_3051.jpeg', 'IMG_3052.jpeg'
    ]
  },
  zenith: {
    title: 'Zénith',
    description: 'Le Zénith marque l\'apogée, le point culminant où la lumière atteint son intensité maximale. Cette collection incarne l\'excellence et la sophistication, révélant des pièces qui brillent par leur raffinement et leur caractère unique.',
    imagePath: '/zenith.jpg',
    galleryImages: [
      'IMG_3054.jpeg', 'IMG_3055.jpeg', 'IMG_3056.jpeg', 'IMG_3057.jpeg',
      'IMG_2864.jpeg', 'IMG_2865.jpeg', 'IMG_2866.jpeg', 'IMG_2867.jpeg'
    ]
  },
  crepuscule: {
    title: 'Crépuscule',
    description: 'Le Crépuscule évoque ces moments suspendus entre jour et nuit, où la lumière se teinte de nuances dorées et pourpres. Cette collection capture la poésie de ces instants privilégiés, révélant des créations empreintes de mystère et d\'élégance.',
    imagePath: '/crepuscule.jpg',
    galleryImages: [
      'IMG_2868.jpeg', 'IMG_2869.jpeg', 'IMG_2870.jpeg', 'IMG_2871.jpeg',
      'IMG_2872.jpeg', 'IMG_2873.jpeg', 'IMG_2877.jpeg', 'IMG_2879.jpeg'
    ]
  }
};

export default function CollectionHeader({ collection, customImagePath }: { collection: 'exclusivites' | 'aube' | 'zenith' | 'crepuscule'; customImagePath?: string }) {
  const data = collectionData[collection];

  return (
    <>
      {/* Section Introduction */}
      <section className={styles.newCollectionSection}>
        <div className={styles.textSection}>
          <h1 
            style={{ 
              fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: '#000000',
              textShadow: 'none',
              boxShadow: 'none',
              textTransform: 'uppercase',
              marginBottom: '15px',
              textAlign: 'center',
              width: '100%'
            }}
          >
            {data.title}
          </h1>
          <p className={styles.collectionDescription}>
            {data.description}
          </p>
        </div>
        
        <div className={styles.mediaSection}>
          <div className={styles.imageContainer}>
            <Image
              src={customImagePath || data.imagePath}
              alt={`Collection ${data.title} - Kamba Lhains`}
              width={1200}
              height={800}
              className={styles.collectionImage}
              quality={95}
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        </div>
      </section>

    </>
  );
}