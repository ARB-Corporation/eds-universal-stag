import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';
import { div, p } from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  if (getMetadata('is-kalviyo-script') === 'false') {
    block.textContent = '';
    return block;
  }
  const placeholders = await fetchPlaceholders();
  const [klaviyoClass, klaviyoTitle] = block.children;
  const className = klaviyoClass.textContent.trim() || placeholders.klaviyoClassName.trim();
  const title = klaviyoTitle?.textContent?.trim() || placeholders.klaviyoTitle.trim();
  klaviyoClass.remove();
  if (className) {
    block.classList.add(className);
    if (getMetadata('kalviyo-title') === 'true' && (klaviyoTitle?.textContent?.trim() === '' || !klaviyoTitle)) block.appendChild(div(div(p(title))));
  }
  // block.textContent = '';
  block.addEventListener('click', (event) => {
    if (window.innerWidth <= 768) { // will only get in mobile view
      // if (this.classList.contains('.klaviyo-form-VTMbFv')) {
      const clickedId = event.target.id;
      const isButton = block.querySelector('button') === event.target;

      // Skip toggle if user clicks on inputs or button inside block
      if (
        clickedId === 'first_name_01JDTQRV0HNJ5DXHYY51XZAC50'
      || clickedId === 'last_name_01JDTQRV0HNJ5DXHYY51XZAC50'
      || clickedId === 'email_01JDTQRV0RGZ06H3H2MW0ZQZ1A'
      || isButton
      ) {
        return;
      }
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
  const divInsideBlock = block.querySelector('div');
  if (divInsideBlock && divInsideBlock.textContent.trim() === '') {
    divInsideBlock.classList.add('empty');
  }
  return block;
}
