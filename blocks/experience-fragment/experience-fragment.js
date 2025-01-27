import { getFetchAPI } from '../../scripts/common.js';

export async function appendXF(block, xfPath) {
  const resp = await getFetchAPI(xfPath, 'text');
  if (resp.ok) {
    let str = await resp.text();
    const { location } = window;
    if (location.href.includes('localhost') || location.href.includes('.aem.live')) {
      str = str.replaceAll(
        '/etc.clientlibs/',
        'https://publish-p144166-e1487988.adobeaemcloud.com/etc.clientlibs/',
      );
      str = str.replaceAll(
        '/content/',
        'https://publish-p144166-e1487988.adobeaemcloud.com/content/',
      );
    }
    const div = document.createElement('div');
    div.innerHTML = str;
    div.querySelectorAll('link').forEach((link) => {
      try {
        const newLink = document.createElement('link');
        newLink.href = link.href.replace('http://localhost:3000', 'https://publish-p144166-e1487988.adobeaemcloud.com');
        newLink.rel = 'stylesheet';
        document.head.append(newLink);
      } catch (error) {
        console.error(error); // eslint-disable-line
      }
    });
    block.append(div.querySelector('.root'));
    div.querySelectorAll('script').forEach((link) => {
      const exculdeLink = [
        '/clientlibs/granite/',
        '/foundation/clientlibs',
      ];
      // debugger;
      if (!exculdeLink.filter((clientLib) => link.src.includes(clientLib)).length) {
        try {
          const newScript = document.createElement('script');
          newScript.src = link.src.replace('http://localhost:3000', 'https://publish-p144166-e1487988.adobeaemcloud.com');
          newScript.type = 'text/javascript';

          document.body.append(newScript);
        } catch (error) {
          console.error(error); // eslint-disable-line
        }
      }
    });

    if (window.isLast) {
      setTimeout(() => {
        const event = new Event('DOMContentLoaded');
        // Dispatch the event
        document.dispatchEvent(event);
      }, 1000);
    }
    window.isLast = true;
  }
  return block;
}

export default async function decorate(block) {
  try {
    const xfPath = block.querySelector('a')?.href;
    block.innerHTML = '';
    await appendXF(block, xfPath);
  } catch (error) {
    console.warn(error); // eslint-disable-line
  }
}
