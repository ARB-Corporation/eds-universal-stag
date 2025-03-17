import { fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const [klaviyoClass , klaviyoContent] = block.children;
  const className = klaviyoClass.textContent.trim() || placeholders.klaviyoClassName.trim();
  klaviyoClass.remove();
  className && block.classList.add(className);
  // block.textContent = '';
}

document.addEventListener('click',(event)=>{
  if (window.innerWidth <= 768) { // will only get in mobile view
    if(event.target.closest('.klaviyo-form-VTMbFv')){
      // document.querySelector('.kl-private-reset-css-Xuajs1').classList.remove('dsp-none');
      if(document.querySelector('.kl-private-reset-css-Xuajs1').classList.contains('dsp-block')){
        document.querySelector('.klaviyo-script').classList.add('closed');
        document.querySelector('.klaviyo-script').classList.remove('open');
        document.querySelector('.kl-private-reset-css-Xuajs1').classList.remove('dsp-block');
      } else{
        document.querySelector('.klaviyo-script').classList.remove('closed');
        document.querySelector('.klaviyo-script').classList.add('open');
        document.querySelector('.kl-private-reset-css-Xuajs1').classList.add('dsp-block');
      }
    }
  }
});

// if (window.innerWidth <= 768) {
//   document.querySelector('.kl-private-reset-css-Xuajs1').classList.add('dsp-none');
//   document.querySelector('.klaviyo-script').classList.add('closed');
// }

