import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  if (getMetadata('is-kalviyo-script') === 'false') {
    block.textContent = '';
    return block;
  }
  const placeholders = await fetchPlaceholders();
  const [klaviyoClass] = block.children;
  const className = klaviyoClass.textContent.trim() || placeholders.klaviyoClassName.trim();
  klaviyoClass.remove();
  if (className) {
    block.classList.add(className);
  }
  // block.textContent = '';
  block.addEventListener('click', () => {
    if (window.innerWidth <= 768) { // will only get in mobile view
      // if (this.classList.contains('.klaviyo-form-VTMbFv')) {
      if (block.querySelector('.kl-private-reset-css-Xuajs1').classList.contains('dsp-block')) {
        block.classList.add('closed');
        block.classList.remove('open');
        block.querySelector('.kl-private-reset-css-Xuajs1').classList.remove('dsp-block');
      } else {
        block.classList.remove('closed');
        block.classList.add('open');
        block.querySelector('.kl-private-reset-css-Xuajs1').classList.add('dsp-block');
      }
      // }
    }
  });

  return block;
}
