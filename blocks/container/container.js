function appendNextElements(container, nextElement) {
  container.append(nextElement);
}
export default function decorate(block) {
  block.innerHTML = '';
  const blockWrapper = block.parentElement;
  let nextElement = blockWrapper.nextElementSibling;
  while (nextElement && (!nextElement.classList.contains('container-wrapper'))) {
    appendNextElements(block, nextElement);
    nextElement = blockWrapper.nextElementSibling;
  }
}
