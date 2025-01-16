import {
  a, div, li, ul, span,
} from '../../scripts/dom-helpers.js';
import { getList } from '../../scripts/common.js';
import decorateAccordion from '../accordion/accordion.js';

export function capitalizeEveryWord(str) {
  if (str?.length === 0) return str;
  return str ? str.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
}

export default async function decorate(block) {
  const list = await getList();

  block.firstElementChild.append(
    div(
      ul(
        ...list.map((eachData) => li(a({ href: (`/${eachData.path.split('/')[1]}`) }, capitalizeEveryWord((`${eachData.category}`))), span(`${eachData.count}`))),
      ),
    ),
  );

  if (window.innerWidth < 769) {
    decorateAccordion(block);
  }
}
