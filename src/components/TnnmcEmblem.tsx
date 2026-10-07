import React from 'react';

export interface TnnmcEmblemProps {
  className?: string;
  size?: number;
  alt?: string;
}

/**
 * Official Nightingale chatbot Logo
 * Transparent-background PNG that works correctly in both Light and Dark themes.
 */
export const TnnmcEmblem: React.FC<TnnmcEmblemProps> = ({
  className = '',
  size = 44,
  alt = 'Nightingale chatbot logo',
}) => {
  return (
    <img
      src="/logo.png"
      alt={alt}
      width={size}
      height={size}
      className={`shrink-0 object-contain aspect-square select-none ${className}`}
      style={{
        width: size ? `${size}px` : undefined,
        height: size ? `${size}px` : undefined,
      }}
    />
  );
};

export const Logo = TnnmcEmblem;
export default TnnmcEmblem;
