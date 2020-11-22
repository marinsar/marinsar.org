import Image from 'next/image';
import { Node, Document, BLOCKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import type { Asset } from '../lib/api';

const ImageNode = ({ node, assets }: { node: Node; assets: Asset[] }) => {
  const asset = assets.find(
    (asset) => asset.sys?.id === node.data?.target?.sys?.id,
  );

  if (!asset) {
    return null;
  }

  const src = `http:${asset.fields.file?.url}`;
  const alt = asset.fields.title ?? '';
  const { width, height } = asset.fields.file?.details.image ?? {
    width: 0,
    height: 0,
  };

  return (
    <div className='relative w-full'>
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  );
};

export const RichTextDocument = ({
  document,
  assets,
}: {
  document: Document;
  assets: Asset[];
}) => {
  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => (
        <ImageNode node={node} assets={assets} />
      ),
    },
  };

  return (
    <div className='prose'>
      {documentToReactComponents(document, renderOptions)}
    </div>
  );
};
