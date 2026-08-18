'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils';

const DEFAULT_FALLBACK = '/assets/placeholder-product.jpg';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  placeholder = 'blur',
  blurDataURL,
  onError,
  className,
  ...props
}: SafeImageProps) {
  const initialSrc = src && typeof src === 'string' && src.trim().length > 0 ? src : fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);

  // Sync if prop changes
  useEffect(() => {
    const validSrc = src && typeof src === 'string' && src.trim().length > 0 ? src : fallbackSrc;
    setCurrentSrc(validSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      if (onError) {
        onError(e);
      }
    }
  };

  const defaultBlur = blurDataURL || `data:image/svg+xml;base64,${toBase64(shimmer(200, 200))}`;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || 'Product image'}
      placeholder={placeholder}
      blurDataURL={defaultBlur}
      onError={handleError}
      className={className}
    />
  );
}
