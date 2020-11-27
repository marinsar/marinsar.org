import { FunctionComponent, useEffect, useState } from 'react';
import Image from 'next/image';

import { ImageMetadata } from '../lib/api';

const TRANSITION_MS = 6000;

export const ImageGallery: FunctionComponent<{ images: ImageMetadata[] }> = ({
  images,
}) => {
  const [index, setIndex] = useState(0);
  const nextIndex = (index + 1) % images.length;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex(nextIndex);
    }, TRANSITION_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [nextIndex, setIndex, images]);

  const visibleImage = images[index];
  const nextImage = images[nextIndex];

  return (
    <div className='relative w-full h-full'>
      <div className='hidden'>
        <Image
          className='object-cover'
          src={nextImage.url}
          alt={nextImage.title}
          width={nextImage.width}
          height={nextImage.height}
          layout='responsive'
        />
      </div>
      <Image
        className='object-cover'
        src={visibleImage.url}
        alt={visibleImage.title}
        width={visibleImage.width}
        height={visibleImage.height}
        layout='responsive'
      />
    </div>
  );
};
