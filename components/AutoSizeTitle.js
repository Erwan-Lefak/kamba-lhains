import { useState, useEffect, useRef } from 'react';

const AutoSizeTitle = ({ title, className, maxWidth }) => {
  const [fontSize, setFontSize] = useState(24); // 1.5rem = 24px
  const titleRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current || !maxWidth) return;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;
    const context = canvas.getContext('2d');
    
    // Set font properties to match CSS
    const fontWeight = '300';
    const fontFamily = "'Manrope', 'Helvetica Neue', Arial, sans-serif";
    const letterSpacing = '1px';

    let testFontSize = 24; // Start at 1.5rem
    let textWidth = 0;

    // Binary search for optimal font size
    let minSize = 8;
    let maxSize = 24;

    while (maxSize - minSize > 0.5) {
      testFontSize = (minSize + maxSize) / 2;
      context.font = `${fontWeight} ${testFontSize}px ${fontFamily}`;
      
      // Measure text width (approximating letter-spacing)
      const metrics = context.measureText(title);
      textWidth = metrics.width + (title.length - 1) * 1; // approximate letter-spacing
      
      if (textWidth <= maxWidth - 40) { // 40px for padding
        minSize = testFontSize;
      } else {
        maxSize = testFontSize;
      }
    }

    setFontSize(Math.floor(minSize));
  }, [title, maxWidth]);

  return (
    <h1 
      ref={titleRef}
      className={className}
      style={{
        fontSize: `${fontSize}px`,
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      {title}
    </h1>
  );
};

export default AutoSizeTitle;