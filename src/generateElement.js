export default function generateElement(msg){
  let errorNode = document.createElement("div");
  errorNode.innerHTML = `${msg}`;
  return errorNode;
}