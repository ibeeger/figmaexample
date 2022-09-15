
// "use strict";
// import * as test from './test'

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
      let _html = convertHtml(_json);
      // console.log("_html", _html)
      figma.ui.postMessage(_html);
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




function convertCssToString(json){
  let css = `position: absolute;`;
  for(let item in json){
    if(typeof json[item] !== 'object' && item !='type' && item !=='text'){
      css+= json[item] ? `${item}: ${json[item]};` : ''
    }
  }
  return css;
}




function convertHtml(json){
  let {type, data, css} = json;
  let html = `<div data-t="${type}" style="${convertCssToString(css)}">`;
  if(type === 'TEXT'){
    html+=(json['text'].replace(/\n/g,'<br />'));
  }else if(data.fillGeometry && data.fillGeometry.length){
      html+=`<svg viewBox="0 0 ${css['width'].replace('px','')} ${css['height'].replace('px','')}">
      <path d="${data.fillGeometry[0]['data']}" style="stroke: black; fill: ${css['background-color'] || 'none'};"/>
      </svg>`
    }
  if(json['children']){
    json['children'].forEach(item => {
      html+=convertHtml(item);
    })
  }
  html+='</div>'
  return html;
}




function convertEffectToCss(effects, fills){
   var css = {};
   effects.forEach(({type,...other}, index) => {
      if(type === 'LAYER_BLUR'){
        let {color, opacity} = fills[index];
        css = Object.assign(css,{
          "background-color":`rgba(${Math.floor(color.r*255)},${Math.floor(color.g*255)},${Math.floor(color.b*255)},${opacity})`,
          filter: `blur(${other.radius}px)`,
        })
      }else if(type === 'IMAGE'){
        console.log("Image", figma.getImageByHash(other.imageHash))
       css = Object.assign(css,{
        'background-image': figma.getImageByHash(other.imageHash)
       }) 
      }
   });
   return css;
}


function convert(node){
  const {children, x,y, backgroundColor, fontSize, fillGeometry, fills, effects, rotation, name, characters, width,height, type, id} = node;
 
  console.log(type, node);

  // console.log('effects',convertEffectToCss(effects, fills),)
  
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
      ...convertEffectToCss(effects, fills),
      // ...convertFillToCss(fills)
    },
    data: {
      type,
      fillGeometry
    },
    text: type === 'TEXT' ? (characters || name) : ''
    // keys: node.getPluginDataKeys()
  };

  // let html = `<div style="${convertCss(result)}">`;

  if(children && children.length){
    result['children'] = children.map(item => {
      return convert(item);
    })
  }
  // html+=`</div>`;
  return result;
}