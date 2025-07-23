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
            // Toggle the active state of the clicked tag
            this.classList.toggle('active');

            // Get all currently active tags
            const activeTags = Array.from(document.querySelectorAll('li.active'))
              .map((tag) => tag.dataset.tagName);

            let listByTagName;

            if (activeTags.length === 0) {
              // No tags selected – show default list (e.g. all or none)
              listByTagName = await getListByTagName('');
            } else {
              // Fetch blog lists for all selected tags
              const allTagLists = await Promise.all(
                activeTags.map((tag) => getListByTagName(tag)),
              );

              // Merge and remove duplicates (assuming each item has unique id or slug)
              const seen = new Set();
              listByTagName = allTagLists
                .flat()
                .filter((item) => {
                  const uniqueKey = item.id || item.slug || JSON.stringify(item);
                  if (seen.has(uniqueKey)) return false;
                  seen.add(uniqueKey);
                  return true;
                });
            }

            // Sort by most recent modification
            listByTagName.sort((postA, postB) => postB.lastModified - postA.lastModified);

            renderBlockList(blogListBlock, listByTagName);
            pagination(document.querySelector('.pagination'));

            // Scroll to top of blog list on mobile
            if (window.innerWidth <= 768) {
              blogListBlock.scrollIntoView({ behavior: 'smooth' });
            }
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
