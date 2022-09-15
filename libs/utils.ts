function multip(number){
  return (input)=>{
    return input*number;
  }
}

const multip255 = multip(255);

export const convertColor = ({r, g, b}, a) => {
  return `rgba(${multip255(r)},${multip255(g)},${multip255(b)}, ${a})`
}
 
export default {
  convertColor
}