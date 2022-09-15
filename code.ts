
// "use strict";
import './test'
// import utils from './libs/utils'

// This file holds the main code for the plugin. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).



var parentId;

// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {
  figma.showUI(__html__,{
    width:640,
    height:700,
  });

  // console.log('figma.currentPage.selection', figma)
  var rootId;
  figma.on('selectionchange', () => {
    const item = figma.currentPage.selection[0]
    try{
      console.log(item.id,'root');
      rootId = item.id;
      let _json = convert(item);
      // let _html = convertHtml(_json);
      // console.log("_html", _html)

      figma.ui.postMessage(JSON.stringify(_json));
    }catch(e){
      console.log('错误', e)
    }
  })

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-shapes') {
      const nodes: SceneNode[] = [];
      for (let i = 0; i < msg.count; i++) {
        const rect = figma.createRectangle();
        rect.x = i * 150;
        rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
        // console.log(rect.height,'-----', rect.x)
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
      }
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    }

    figma.closePlugin();
  };
}







function convert(node){
  const {children, x,y, backgroundColor, fontSize, fillGeometry, fills, effects,strokes, rotation, name, characters, width,height, type, id} = node;

  console.log(type,node);


  let result = {
    type,
    css: {
      background: backgroundColor,
      'font-size': fontSize +'px',
      width:width+'px',
      height:height+'px',
      left: id == rootId ? 0 : Math.max(x,0)+'px',
      top: id == rootId ? 0 : Math.max(y,0)+'px',
      transform: rotation ? `rotate(${-rotation}deg)` : '',
    },
    data: {
      type,
      fillGeometry,
      fills,
      effects,
      strokes
    },
    text: type === 'TEXT' ? (characters || name) : ''
    // keys: node.getPluginDataKeys()
  };

  if(children && children.length){
    result['children'] = children.map(item => {
      return convert(item);
    })
  }
  // html+=`</div>`;
  return result;
}