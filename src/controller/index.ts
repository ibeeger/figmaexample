import { setNodeText } from './utils/set-node-text';
import { setNodeImage } from './utils/set-node-image';

figma.showUI(__html__, { width: 360, height: 400 });

figma.ui.onmessage = msg => {
  if (msg.type === 'set-text') {
    setNodeText(msg.data);
  } else if (msg.type === 'set-image') {
    setNodeImage(msg.data);
  }
};
