'use client';

import Image from 'next/image';
import { getCategoryIcon, getCategoryEmoji } from '@/lib/category-icon-mapper';

interface CategoryIconProps {
  categoryName: string;
  size?: number;
  className?: string;
  showEmoji?: boolean;
  fill?: boolean;
}

export default function CategoryIcon({ 
  categoryName, 
  size = 32,
  className = '',
  showEmoji = true,
  fill = false
}: CategoryIconProps) {
  const iconPath = getCategoryIcon(categoryName);
  const emoji = getCategoryEmoji(categoryName);
  
  if (iconPath) {
    if (fill) {
      return (
        <div 
          className={`inline-block ${className}`}
          style={{ 
            width: '100%', 
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'inherit',
          }}
          title={categoryName}
        >
          <Image
            src={iconPath}
            alt={categoryName}
            fill
            sizes={`${size}px`}
            className="object-cover"
            priority={false}
            style={{
              transition: 'transform 0.3s ease',
            }}
          />
        </div>
      );
    }
    
    return (
      <div 
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        title={categoryName}
      >
        <Image
          src={iconPath}
          alt={categoryName}
          width={size}
          height={size}
          className="object-contain"
          priority={false}
          style={{ 
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            transition: 'transform 0.2s ease',
          }}
        />
      </div>
    );
  }
  
  if (showEmoji && emoji) {
    return (
      <span 
        className={`inline-flex items-center justify-center ${className}`}
        style={{ 
          fontSize: size * 0.8,
          lineHeight: 1,
        }}
        title={categoryName}
      >
        {emoji}
      </span>
    );
  }
  
  return null;
}