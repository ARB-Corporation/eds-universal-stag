import { div, li, ul } from '../../scripts/dom-helpers.js';
import decorateAccordion from '../accordion/accordion.js';
import { getList, getQueryList } from '../../scripts/common.js';
import { renderBlockList } from '../blog-list/blog-list.js';
import pagination from '../pagination/pagination.js';

export function capitalizeFirstLet(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default async function decorate(block) {
  const list = await getList();
  const allTag = [];
  list.map((eachList) => eachList.tags.map((eachData) => {
    if (eachList.path.includes(location.pathname)) {
      allTag.push(li({
        'data-tag-name': eachData.tag,
        async onClick(e) {
          const list = await getListByTagName(this.dataset.tagName);
          renderBlockList(document.querySelector('.blog-list'), list);
          pagination(document.querySelector('.pagination'));
        },
      }, capitalizeFirstLet(eachData.tag)));
    }
  }));

  block.firstElementChild.append(
    div(
      ul(
        ...allTag,
      ),
    ),
  );

  if (window.innerWidth < 769) {
    decorateAccordion(block);
  }
}

async function getListByTagName(tagName) {
  const list = await getQueryList();
  return list.filter((eachList) => eachList.tag?.includes(tagName));
}
