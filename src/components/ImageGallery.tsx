import { FunctionComponent, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

import type { Image as ImageType } from '../lib/api';

type State = 'A_VISIBLE' | 'B_VISIBLE' | 'A_FADING_IN' | 'B_FADING_IN';

const NEXT_IMAGE_MS = 6000;
const FADE_TRANSITION_MS = 1000;
const VISIBLE_CLASSES = 'transition-opacity opacity-100 duration-1000';
const INVISIBLE_CLASSES = 'transition-opacity opacity-0 duration-1000';

export const ImageGallery: FunctionComponent<{ images: ImageType[] }> = ({
  images,
}) => {
  const [state, setState] = useState<State>('A_FADING_IN');

  const [aIndex, setAIndex] = useState(0);
  const [bIndex, setBIndex] = useState(0);

  const aImage = images[aIndex];
  const bImage = images[bIndex];

  const isAVisible = state === 'A_FADING_IN' || state === 'A_VISIBLE';
  const isBVisible = state === 'B_FADING_IN' || state === 'B_VISIBLE';

  const incIndex = useCallback((i: number) => (i + 1) % images.length, [
    images.length,
  ]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    switch (state) {
      case 'A_FADING_IN': {
        timeout = setTimeout(() => {
          setState('A_VISIBLE');
        }, FADE_TRANSITION_MS);

        break;
      }

      case 'A_VISIBLE': {
        setBIndex(incIndex(aIndex));

        timeout = setTimeout(() => {
          setState('B_FADING_IN');
        }, NEXT_IMAGE_MS);

        break;
      }

      case 'B_FADING_IN': {
        timeout = setTimeout(() => {
          setState('B_VISIBLE');
        }, FADE_TRANSITION_MS);

        break;
      }

      case 'B_VISIBLE': {
        setAIndex(incIndex(bIndex));

        timeout = setTimeout(() => {
          setState('A_FADING_IN');
        }, NEXT_IMAGE_MS);

        break;
      }

      default: {
        const unexpectedState: never = state;
        throw new Error(`unexpected state "${unexpectedState as string}"`);
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [state, aIndex, bIndex, incIndex]);

  return (
    <div className='relative w-full aspect-video'>
      <Image
        className={isAVisible ? VISIBLE_CLASSES : INVISIBLE_CLASSES}
        src={aImage.url}
        alt={aImage.title}
        fill
        style={{ objectFit: 'cover' }}
        priority={true}
        role='presentation'
      />
      <Image
        className={isBVisible ? VISIBLE_CLASSES : INVISIBLE_CLASSES}
        src={bImage.url}
        alt={bImage.title}
        fill
        style={{ objectFit: 'cover' }}
        priority={true}
        role='presentation'
      />
    </div>
  );
};