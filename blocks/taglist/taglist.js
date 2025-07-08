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
            const isActive = this.classList.contains('active');
            // Remove all active classes
            allTag.forEach((tag) => tag.querySelector('li').classList.remove('active'));
            let listByTagName;
            if (isActive) {
              // If already active, reload default list (or empty list based on your logic)
              listByTagName = await getListByTagName(''); // Or pass null/undefined if needed
              listByTagName.sort((ele1, ele2) => ele2.lastModified - ele1.lastModified);
            } else {
              // Set clicked tag active and get its data
              this.classList.add('active');
              listByTagName = await getListByTagName(this.dataset.tagName);
            }
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
