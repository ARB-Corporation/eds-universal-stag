import { fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const className = block.textContent.trim() || placeholders.klaviyoClassName.trim();
  block.classList.add(className);
  block.textContent = '';
}
