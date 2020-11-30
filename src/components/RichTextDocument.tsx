import Image from 'next/image';
import { Node, Document, BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import type { Image as ImageType } from '../lib/api';
import { FunctionComponent } from 'react';

const ImageNode = ({ node, images }: { node: Node; images: ImageType[] }) => {
  const image = images.find((d) => d.id === node.data?.target?.sys?.id);

  if (!image) {
    return null;
  }

  return (
    <div className='relative w-full flex justify-center py-4'>
      <Image
        src={image.url}
        alt={image.title}
        width={image.width}
        height={image.height}
      />
    </div>
  );
};

export const RichTextDocument: FunctionComponent<{
  document: Document;
  images: ImageType[];
}> = ({ document, images }) => {
  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => (
        <ImageNode node={node} images={images} />
      ),
    },
  };

  return <>{documentToReactComponents(document, renderOptions)}</>;
};
