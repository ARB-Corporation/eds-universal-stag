import { fetchPlaceholders, getMetadata, toClassName } from './aem.js';
import Category from './category.js';
import Tag from './tag.js';

const proxy = {
  queryList: '',
  list: '',
};

export const loadedAssets = [];

export async function getQueryList() {
  if (proxy.queryList) {
    return proxy.queryList;
  }
  const resp = await fetch('/query-index.json');
  const jsonData = await resp.json();
  const { data } = jsonData;
  proxy.queryList = data;
  return proxy.queryList;
}
export async function getList() {
  if (proxy.list) {
    return proxy.list;
  }
  const data = await getQueryList();
  const list = [];
  const parentToLeaves = {};
  data.forEach((eachData, index) => {
    const { path } = eachData;
    const parentPath = path.split('/').slice(3, -1).join('/');
    if (!parentToLeaves[parentPath]) {
      parentToLeaves[parentPath] = [];
    }
    parentToLeaves[parentPath].push(path);

    const rawTags = eachData.tag ? eachData.tag.trim().split(',') : [];
    rawTags.forEach((eachRawTag) => {
      const category = eachRawTag.split('/')[0].split(':')[1];
      const categoryPath = `${path.split('/').slice(0, -2).join('/')}\\${toClassName(category)}`;
      const tag = eachRawTag.split('/')[1];
      const tagObj = new Tag(tag);
      const categoryObj = new Category(category, tagObj, categoryPath, index);
      const isCategoryExit = list.filter((listData) => listData.category === categoryObj.category);
      if (isCategoryExit.length) {
        const currentCategory = isCategoryExit[0];
        // currentCategory.count = currentCategory.position ?  : index;
        if (currentCategory.position !== index) currentCategory.count += 1;
        const currentTags = currentCategory.tags;
        const isTagExit = currentTags.filter((tagData) => tagData.tag === tagObj.tag);
        if (!isTagExit.length) currentCategory.tags.push(tagObj);
      } else {
        list.push(categoryObj);
      }
    });
  });
  list.forEach((item) => {
    if (parentToLeaves[item.category]) {
      item.leaves = parentToLeaves[item.category].length;
    } else {
      item.leaves = 0;
    }
  });
  proxy.list = list;
  return proxy.list;
}

async function buildBreadcrumbsFromNavTree() {
  const crumbs = [];

  const currentUrl = new URL(window.location.href);
  const currentPath = currentUrl.pathname;
  const queryList = await getQueryList();
  const placeholders = await fetchPlaceholders();
  const homePlaceholder = placeholders.breadcrumbsHomeLabel || 'Home';

  // Only include true parent paths in the breadcrumb trail
  const breadcrumbsList = queryList.filter((eachlist) => {
    if (eachlist.breadcrumbshide === 'true') return false;
    if (eachlist.path === '/') return true;
    if (currentPath === eachlist.path) return true;
    if (currentPath.startsWith(eachlist.path)) {
      // Ensure next char is / or end of string
      const nextChar = currentPath.charAt(eachlist.path.length);
      return nextChar === '/' || nextChar === '';
    }
    return false;
  });

  breadcrumbsList
    .sort((a, b) => a.path.split('/').length - b.path.split('/').length)
    .forEach((link) => {
      if (link.path === '/') {
        crumbs.push({ title: homePlaceholder, url: link.path });
      } else {
        crumbs.push({ title: link.breadcrumbstitle, url: link.path });
      }
    });

  return crumbs;
}

async function buildBreadcrumbs() {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';

  const crumbs = await buildBreadcrumbsFromNavTree(document.querySelector('.nav-sections'), document.location.href);

  const ol = document.createElement('ol');
  ol.append(...crumbs.map((item) => {
    const li = document.createElement('li');
    if (item['aria-current']) li.setAttribute('aria-current', item['aria-current']);
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.append(a);
    } else {
      li.textContent = item.title;
    }
    return li;
  }));

  breadcrumbs.append(ol);
  return breadcrumbs;
}

export async function autoBlockBreadcrumb() {
  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    const section = document.querySelector('main .section');
    if (section && !section.dataset.breadcrumbsStatus) {
      section.dataset.breadcrumbsStatus = 'initialized';
      const block = await buildBreadcrumbs();
      section.prepend(block);
    }
  }
}

export async function getFetchAPI(url) {
  // const myHeaders = new Headers();
  // myHeaders.append('Authorization', 'Basic YWRtaW46RGVwdEBhcmI=');

  // const requestOptions = {
  //   method: 'GET',
  //   headers: myHeaders,
  //   redirect: 'follow',
  // };

  try {
    const resp = await fetch(url);
    // const text = type === 'json' ? await resp.json() : await resp.text();
    return resp;
  } catch (error) {
    return error;
  }
}
