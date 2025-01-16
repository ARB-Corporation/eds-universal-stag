import Category from './category.js';
import Tag from './tag.js';

const proxy = {
  queryList: '',
  list: '',
};
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
  data.forEach((eachData, index) => {
    const rawTags = eachData.tag ? eachData.tag.trim().split(',') : [];
    rawTags.forEach((eachRawTag) => {
      const category = eachRawTag.split('/')[0].split(':')[1];
      const tag = eachRawTag.split('/')[1];
      const tagObj = new Tag(tag);
      const categoryObj = new Category(category, tagObj, eachData.path, index);
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
      // if (list[category]) list[category].push(tag);
      // else list[category] = [tag];
    });
  });
  // console.log(list);
  proxy.list = list;
  return proxy.list;
}
