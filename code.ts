"use strict";

// This file holds the main code for the plugin. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).

 
// Runs this code if the plugin is run in Figma
if (figma.editorType === 'figma') {

  figma.showUI(__html__,{
    width:640,
    height:700,
  });

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

  figma.ui.onmessage = msg => {
    

    figma.closePlugin();
  };
}



function convert(node){

  if(!node) return;

  const {children, name, componentPropertyDefinitions, type} = node;
  let props;

  console.log(type,'=====type')

  if(type === 'TEXT') return `${name}`


  // switch(type){

  //   case 'TEXT':
  //     break;
  //   default:



  // }



  if(componentPropertyDefinitions){
    props = '{';
    for(let item in componentPropertyDefinitions){
      props += `${item.split('#')[0]}='${componentPropertyDefinitions[item].defaultValue}',`
    }
    props+='}'
  }


  console.log('children', children)

let component = `
export default function ${name.replace(/[0-9]/ig,'').toLocaleLowerCase()} (${props}){
  return (<>
    ${renderChildren(children, '')}
  </>)
}`;
  return component;
}


function renderComponent(node){
  const {children, type, name} = node;


  if(type === 'TEXT') return `<Text>${name}</Text>`;

   
  return (`<div className={'${name.replace(/[0-9]/ig,'').toLocaleLowerCase()}'}>
          ${renderChildren(children, '')}
        </div>`)
}


function renderChildren(children, css){
  if(!children || !children.length) return '';

  return children.map((item) => {
    return(`<div>
  ${renderComponent(item)}
</div>`)
  })
}