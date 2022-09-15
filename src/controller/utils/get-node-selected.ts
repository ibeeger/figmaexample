export function getNodeSelected(): SceneNode | null {
  const node = figma.currentPage.selection[0];
  if (!node?.id) {
    return;
  }

  return node;
}
