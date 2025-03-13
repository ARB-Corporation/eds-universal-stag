import { fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const [klaviyoClass , klaviyoContent] = block.children;
  const className = klaviyoClass.textContent.trim() || placeholders.klaviyoClassName.trim();
  klaviyoClass.remove();
  className && block.classList.add(className);
  // block.textContent = '';
}
