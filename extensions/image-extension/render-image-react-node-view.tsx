import React, { useEffect, useState } from 'react';

import type { RenderReactNodeView } from '@bangle.io/extension-registry';
import { getFile, useWorkspaceContext } from '@bangle.io/slice-workspace';
import { useDestroyRef } from '@bangle.io/utils';
import { isValidFileWsPath, parseLocalFilePath } from '@bangle.io/ws-path';

import {
  calcImageDimensions,
  imageDimensionFromWsPath,
} from './image-file-helpers';

interface ImageNodeAttrs {
  src: string;
  alt?: string;
}
export const renderImageReactNodeView: RenderReactNodeView = {
  image: ({ nodeViewRenderArg }) => {
    let { src, alt } = nodeViewRenderArg.node.attrs;

    return <ImageComponent nodeAttrs={{ src, alt }} />;
  },
};

const isOtherSources = (src?: string) => {
  return (
    !src ||
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:image/')
  );
};

export function ImageComponent({ nodeAttrs }: { nodeAttrs: ImageNodeAttrs }) {
  const { src: inputSrc, alt } = nodeAttrs;
  const [imageSrc, updateImageSrc] = useState<string | null>(null);
  const {
    openedWsPaths: { primaryWsPath },
    bangleStore,
  } = useWorkspaceContext();
  const imageWsPath =
    primaryWsPath && !isOtherSources(inputSrc)
      ? parseLocalFilePath(inputSrc, primaryWsPath)
      : undefined;

  const [dim, updateDimensions] = useState(() => {
    if (imageWsPath) {
      return imageDimensionFromWsPath(imageWsPath);
    }

    return undefined;
  });
  let height: number | undefined, width: number | undefined;

  if (dim) {
    ({ height, width } = dim);
  }
  const destroyRef = useDestroyRef();

  useEffect(() => {
    let objectUrl: string | null = null;

    if (primaryWsPath) {
      if (isOtherSources(inputSrc)) {
        updateImageSrc(inputSrc);
      } else {
        if (isValidFileWsPath(inputSrc)) {
          throw new Error('Image source cannot be a wsPath');
        }

        if (imageWsPath) {
          getFile(imageWsPath)(
            bangleStore.state,
            bangleStore.dispatch,
            bangleStore,
          )
            .then((file) => {
              if (!file) {
                return;
              }
              objectUrl = window.URL.createObjectURL(file);

              if (!width) {
                calcImageDimensions(objectUrl).then((dim) => {
                  if (!destroyRef.current) {
                    updateDimensions({ height: dim.height, width: dim.width });
                  }
                });
              }

              if (!destroyRef.current) {
                updateImageSrc(objectUrl);
              }
            })
            .catch((error) => {
              // silence the error in case we were not able
              // to get the image
            });
        }
      }
    }

    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [inputSrc, primaryWsPath, bangleStore, destroyRef, imageWsPath, width]);

  let newWidth = width;
  let newHeight = height;

  if (alt) {
    if (width && height && /.*scale\d.\d\d$/.test(alt)) {
      const scaled = alt.split('scale')[1];

      if (scaled) {
        const perc = parseFloat(scaled);

        newWidth = perc * width;
        newHeight = perc * height;
      }
    }
  }

  return (
    // DONOT make this img `lazy` as it causes memory leak where
    // editor is persisted forever.
    <img
      src={imageSrc || '/404.png'}
      alt={alt || inputSrc}
      width={newWidth}
      height={newHeight}
    />
  );
}
