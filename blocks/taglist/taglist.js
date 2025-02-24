import {
  a, div, li, ul,
} from '../../scripts/dom-helpers.js';
import decorateAccordion from '../accordion/accordion.js';
import { getList, getQueryList } from '../../scripts/common.js';
import { renderBlockList } from '../blog-list/blog-list.js';
import pagination from '../pagination/pagination.js';

export function capitalizeFirstLet(str) {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getListByTagName(tagName) {
  const list = await getQueryList();
  return list.filter((eachList) => eachList.tag?.includes(tagName));
}

export default async function decorate(block) {
  const list = await getList();
  const allTag = [];
  list.forEach((eachList) => eachList.tags.forEach((eachData) => {
    if (window.location.pathname.includes(eachList.path.split('/').slice(0, -1).join('/'))) {
      allTag.push(a({
        href: 'javascript:void(0)', // eslint-disable-line
      }, li({
        'data-tag-name': eachData.tag,
        async onClick() {
          const blogListBlock = document.querySelector('.blog-list');
          if (blogListBlock) {
            allTag.forEach((tag) => tag.querySelector('li').classList.remove('active'));
            this.classList.add('active');
            const listByTagName = await getListByTagName(this.dataset.tagName);
            renderBlockList(blogListBlock, listByTagName);
            pagination(document.querySelector('.pagination'));
          }
        },
      }, capitalizeFirstLet(eachData.tag))));
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
