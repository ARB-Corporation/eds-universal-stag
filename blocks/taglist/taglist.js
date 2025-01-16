import { div, li, ul } from '../../scripts/dom-helpers.js';
import decorateAccordion from '../accordion/accordion.js';
import { getList } from '../../scripts/common.js';

export function capitalizeFirstLet(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default async function decorate(block) {
  const list = await getList();
  block.firstElementChild.append(
    div(
      ul(
        ...list[0].tags.map((eachData) => li(capitalizeFirstLet(eachData.tag))),
      ),
    ),
  );

  if (window.innerWidth < 769) {
    decorateAccordion(block);
  }
}
