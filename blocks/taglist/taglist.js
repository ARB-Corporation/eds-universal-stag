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

async function getListByTagName(tagNames) {
  const list = await getQueryList();

  // Normalize tag input
  const tags = Array.isArray(tagNames) ? tagNames : [tagNames];

  const url = new URL(window.location.href);
  const path = url.pathname.split('/').slice(3).join('').replace('/', '');

  // Return all items if no tags provided
  if (tags.length === 0 || (tags.length === 1 && tags[0] === '')) {
    const items = list.filter((eachList) => {
      const segments = eachList.path.split('/').filter(Boolean); // remove empty strings from slashes
      const thirdSegment = segments[2]; // index 2 gives the third section

      return (
        !eachList.path.endsWith(path)
        && thirdSegment === path
        && eachList.tag?.includes(path)
      );
    });
    return items.sort((x, y) => y.lastModified - x.lastModified);
  }

  const filtered = list.filter((eachList) => {
    const segments = eachList.path.split('/').filter(Boolean); // remove empty strings from slashes
    const thirdSegment = segments[2]; // index 2 gives the third section
    const itemTags = eachList.tag || [];
    return (
      !eachList.path.endsWith(path)
      && thirdSegment === path
      && tags.some((tag) => itemTags.includes(tag))
    );
  });

  // Sort by most recent
  return filtered.sort((s, t) => t.lastModified - s.lastModified);
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
            const activeTags = Array.from(document.querySelectorAll('li.active')).map((tag) => tag.dataset.tagName);

            let listByTagName;

            if (activeTags.length === 0) {
              // No tags selected – show default list (e.g. all or none)
              listByTagName = await getListByTagName('');
            } else {
              // Fetch blog lists for all selected tags
              listByTagName = await getListByTagName(activeTags);

              // Merge and remove duplicates (assuming each item has unique id or slug)
              const seen = new Set();
              listByTagName = listByTagName.filter((item) => {
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
