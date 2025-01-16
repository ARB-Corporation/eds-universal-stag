import { getQueryList } from '../../scripts/common.js';
import {
  a, div, li, ul, img, h5, p,
} from '../../scripts/dom-helpers.js';
import { capitalizeEveryWord } from '../categories/categories.js';

// const domain = ['localhost', 'main--'];
// async function getBlogList() {
//   const resp = await fetch('/query-index.json');
//   const jsonData = await resp.json();
//   const { data } = jsonData;
//   const list = [];
//   data.forEach(elem=>{
//     if(elem.tag!==""){
//         l.push(e)
//     }})
//   return list;
// }

export default async function decorate(block) {
  // document.addEventListener('update-blog-list', (e) => {
  const url = new URL(window.location.href);
  const list = await getQueryList();
  //   console.log(list);
  const path = url.pathname.replace('/', '');
  const items = list
    .filter((eachList) => (!eachList.path.endsWith(path) && eachList.tag.includes(path)));

  // const { data } = e.detail;
  // debugger;
  block.querySelectorAll('.blog-card').forEach((element) => element.remove());
  block.firstElementChild.append(
    ...items.map((eachData) => {
      const imgSrc = window.location.href.includes(url.origin) ? eachData.image.replace('/content/dam/arb-blogs/', '/images/') : eachData.image;
      return div(
        { class: 'blog-card' },
        div({ class: 'blog-card-img' }, img({ src: imgSrc })),
        div(
          { class: 'blog-card-content' },
          div(
            div(
              { class: 'blog-card-tags' },
              ul(...eachData.tag.split(',').map((eachTag) => (li(capitalizeEveryWord(eachTag.split('/')[1]))))),
            ),
            div({ class: 'blog-card-description' }, h5(eachData.title || '-'), p(eachData.description)),
          ),
          div({ class: 'blog-card-btn' }, a({ href: eachData.path }, 'Read More')),
        ),
      );
    }),
  );
  // });
  return block;
}
