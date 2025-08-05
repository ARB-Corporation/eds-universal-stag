import { getMetadata } from '../../scripts/aem.js';
import { getFetchAPI } from '../../scripts/common.js';

const xfDomain = getMetadata('xf-domain') ? new URL(getMetadata('xf-domain'))?.origin : window.location.origin;

const checkIfLoaded = ({ script, link }) => {
  if (script) {
    const allScripts = document.querySelectorAll('script');
    for (let i = 0; i < allScripts.length; i += 1) {
      const scriptAlreadyExists = allScripts[i].src === script.src;
      if (scriptAlreadyExists) {
        return true;
      }
    }
    return false;
  }

  if (link) {
    const allLinks = document.querySelectorAll('link');
    for (let i = 0; i < allLinks.length; i += 1) {
      const linkAlreadyExists = allLinks[i].href === link.href;
      if (linkAlreadyExists) {
        return true;
      }
    }
    return false;
  }
  return false;
};

export async function appendXF(block, xfPath) {
  const resp = await getFetchAPI(xfPath);
  if (resp.ok) {
    let str = await resp.text();
    const { location } = window;
    if (location.href.includes('localhost') || location.href.includes('.aem.live') || location.href.includes('.aem.page')) {
      str = str.replaceAll(
        '/etc.clientlibs/',
        `${xfDomain}/etc.clientlibs/`,
      );
      str = str.replaceAll(
        '/content/',
        `${xfDomain}/content/`,
      );
    }
    const div = document.createElement('div');
    div.innerHTML = str;
    div.querySelectorAll('link').forEach((link) => {
      try {
        const newLink = document.createElement('link');
        newLink.href = link.href.replace('http://localhost:3000', xfDomain);
        newLink.rel = 'stylesheet';
        if (!checkIfLoaded({ link: newLink })) {
          document.head.append(newLink);
        }
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
          newScript.src = link.src.replace('http://localhost:3000', `${xfDomain}`);
          newScript.type = 'text/javascript';
          if (!checkIfLoaded({ script: newScript })) {
            document.body.append(newScript);
          }
        } catch (error) {
          console.error(error); // eslint-disable-line
        }
      }
    });
    if (window.isLast) {
      setTimeout(() => {
        const event = new Event('CustomDOMContentLoaded');
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
