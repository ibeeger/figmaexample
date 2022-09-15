const fillNodeTypes = ['RECTANGLE', 'ELLIPSE', 'POLYGON', 'FRAME', 'VECTOR'];

export type FillableNode = RectangleNode | EllipseNode | PolygonNode | FrameNode | VectorNode;

export function isFillNode(node: SceneNode): boolean {
  return fillNodeTypes.includes(node.type);
}
