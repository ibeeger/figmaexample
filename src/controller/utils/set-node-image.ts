import { FillableNode, isFillNode } from '../types/fillable-node';
import { getNodeSelected } from './get-node-selected';

export function setNodeImage(value: Uint8Array): void {
  const node = getNodeSelected() as FillableNode;
  if (!node || !isFillNode(node)) {
    return;
  }

  if (!Array.isArray(node.fills)) {
    return;
  }

  const image = figma.createImage(value);
  const index = node.fills.findIndex((paint) => paint.type === 'IMAGE');

  // Override the current image
  if (index >= 0) {
    const newImagePaint = JSON.parse(JSON.stringify(node.fills[index]));
    newImagePaint.imageHash = image.hash;
    const fills = node.fills.slice();
    fills[index] = newImagePaint;
    node.fills = fills;
  // Create a new image
  } else {
    const fills = node.fills.slice();
    fills.push({
      type: 'IMAGE',
      imageHash: image.hash,
      scaleMode: 'FILL',
      blendMode: 'NORMAL',
    } as ImagePaint);
    node.fills = fills;
  }
}
