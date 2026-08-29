import React from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

export function OptimizedImage({ src, alt, className, style, fill, priority, loading, ...props }: OptimizedImageProps) {
  // If the image is remote, a data URI, or an API route, we use the standard Next.js Image component
  if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('/api/'))) {
    return (
      <Image
        src={src}
        alt={alt || ''}
        className={className}
        style={style}
        fill={fill}
        priority={priority}
        loading={loading}
        {...(props as any)}
      />
    );
  }

  // Handle local images
  // For a local image like '/midnight-cycling/IMG_1.jpg'
  // the script generated: '/midnight-cycling/low/IMG_1.webp' and '/midnight-cycling/medium/IMG_1.webp'
  
  let basePath = '';
  let filename = '';
  
  let srcString = typeof src === 'string' ? src : (src && typeof src === 'object' && 'src' in src ? (src as any).src : '');
  
  if (srcString) {
    // Decode first in case the consumer already called encodeURI
    try {
      srcString = decodeURI(srcString);
    } catch (e) {
      // Ignore malformed URI
    }
    
    const lastSlashIndex = srcString.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      basePath = srcString.substring(0, lastSlashIndex);
      filename = srcString.substring(lastSlashIndex + 1);
    } else {
      filename = srcString;
    }
  }

  // Remove the extension and add .webp
  const filenameWithoutExt = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  const webpFilename = `${filenameWithoutExt}.webp`;
  
  const lowUrl = encodeURI(`${basePath}/low/${webpFilename}`);
  const mediumUrl = encodeURI(`${basePath}/medium/${webpFilename}`);

  // When fill is used in Next.js Image, it automatically adds styles for position: absolute, width: 100%, height: 100%
  // We need to replicate that if fill is true.
  const imgStyle: React.CSSProperties = {
    ...style,
  };

  if (fill) {
    imgStyle.position = 'absolute';
    imgStyle.top = 0;
    imgStyle.left = 0;
    imgStyle.width = '100%';
    imgStyle.height = '100%';
    if (!imgStyle.objectFit) {
      imgStyle.objectFit = 'cover';
    }
  } else {
    // If not using fill, try to use width/height if provided, else auto
    if (props.width) imgStyle.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
    if (props.height) imgStyle.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  }

  return (
    <picture>
      <source media="(max-width: 768px)" srcSet={lowUrl} />
      <img
        src={mediumUrl}
        alt={alt || ''}
        className={className}
        style={imgStyle}
        loading={priority ? "eager" : (loading || "lazy")}
      />
    </picture>
  );
}
