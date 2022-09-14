
// "use strict";

// import * as test from './test'

// This file holds the main code for the plugin. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

 
// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {

  figma.showUI(__html__,{
    width:640,
    height:700,
  });

  // console.log(test);
  // console.log('figma.currentPage.selection', figma)

  figma.on('selectionchange', () => {
    const item = figma.currentPage.selection[0]
    // try{
      let _json = convert(item);
      figma.ui.postMessage(_json);
    // }catch(e){
    //   console.log('---', e)
    // }
    
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
  const {children, name, componentPropertyDefinitions, type} = node;
  let props;
  console.log(type,'------');
  if(componentPropertyDefinitions){
    props = '{';
    for(let item in componentPropertyDefinitions){
      props += `${item.split('#')[0]}='${componentPropertyDefinitions[item].defaultValue}',`
    }
    props+='}'
  }


  let component = `
    export default function ${name} (${props}){
      return (<div>
        ${renderChildren(children, '')}
      </div>)
    }
  `;
  return component;
}


function renderComponent(node){
  const {children, name} = node;
  return `<div className={${name}}>
    ${renderChildren(children, '')}
  </div>`
}


function renderChildren(children, css){
  if(!children || !children.length) return '';
  children.map((item) => {
    return `
      <div>
       ${renderComponent(item)}
      </div>
    `
  })
}