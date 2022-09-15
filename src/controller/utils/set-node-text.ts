import { getNodeSelected } from './get-node-selected';

export function setNodeText(data: string): void {
  const node = getNodeSelected();
  if (!node || node.type !== 'TEXT' || node.hasMissingFont) {
    return;
  }

  const font = node.fontName as { family: string; style: string };
  figma.loadFontAsync({ family: font.family, style: font.style }).then(() => {
    node.characters = data;
  });
}
