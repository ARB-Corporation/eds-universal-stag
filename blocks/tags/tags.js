import { getMetadata } from '../../scripts/aem.js';
import { li, ul } from '../../scripts/dom-helpers.js';
import { capitalizeFirstLet } from '../taglist/taglist.js';

export default function decorate(block) {
  const cqtags = getMetadata('cq-tags');
  const rawTags = cqtags ? cqtags.trim().split(',') : [];
  const ulElement = ul();
  rawTags.forEach((eachRawTag) => {
    const tag = eachRawTag.split('/')[1];
    ulElement.append(li(capitalizeFirstLet(tag)));
  });
  block.firstElementChild.append(ulElement);
}
