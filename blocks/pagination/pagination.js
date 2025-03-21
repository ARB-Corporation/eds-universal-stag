import { isDesktop } from '../header/header.js';

/* eslint-disable */ 
function initPagination(element) {
  const items = Array.from(document.querySelectorAll('.blog-card')); // 50 items
  const itemsPerPage = 4; // Show 4 items per page
  let currentPage = 1;

  function renderItems() {
    const carousel = document.querySelectorAll('.blog-card');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);

    const itemsToShow = items.slice(startIndex, endIndex); // Get items for the current page
    carousel.forEach(function (el,index) {
      // el.style.display = 'none';
      el.classList.add('blog-display-none');
      el.classList.remove('blog-display-flex');
    })
    itemsToShow.forEach(function (el,index) {
      // el.style.display = 'flex';
      el.classList.add('blog-display-flex');
      el.classList.remove('blog-display-none');
    })
    // carousel.innerHTML = itemsToShow
    //   .map((item) => `<div class="carousel-item">${item}</div>`)
    //   .join('');
  }

  function createEllipsis(container) {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.className = 'ellipsis';
    container.appendChild(ellipsis);
  }

  function renderPagination() {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pageNumbersContainer = element.querySelector('#pageNumbers');
    pageNumbersContainer.innerHTML = '';

    // Always show the first page
      // if (currentPage > 4) {
      //   createPageButton(1, pageNumbersContainer);
      // createEllipsis(pageNumbersContainer);
      // }

    // Show 3 siblings before and after the current page
    let number = 3
    if(!isDesktop.matches){
       number = 1
    }
    const startPage = Math.max(1, currentPage - number);
    const endPage = Math.min(totalPages, currentPage + number);

    for (let i = startPage; i <= endPage; i++) {
      createPageButton(i, pageNumbersContainer);
    }

    // Always show the last page
    if (currentPage < totalPages - number) {
      createEllipsis(pageNumbersContainer);
      createPageButton(totalPages, pageNumbersContainer);
    }

    // Update prev/next buttons
    element.querySelector('#prevBtn').disabled = currentPage === 1;
    element.querySelector('#nextBtn').disabled = currentPage === totalPages;
  }
  function createPageButton(page, container) {
    const pageNumberBtn = document.createElement('button');
    pageNumberBtn.textContent = page;
    pageNumberBtn.className = `page-btn ${page === currentPage ? 'active' : ''}`;
    pageNumberBtn.addEventListener('click', () => goToPage(page));
    container.appendChild(pageNumberBtn);
  }
  function goToPage(page) {
    currentPage = page;
    renderPagination();
    renderItems();
  }

  // Add event listeners for prev/next buttons
  element.querySelector('#prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });

  element.querySelector('#nextBtn').addEventListener('click', () => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  });
  // Initial render
  renderItems();
  renderPagination();
}
export default function decorate(block) {
  block.innerHTML = `
    <div class="pagination">
        <button class="page-btn prev-btn" id="prevBtn"><img src="../../icons/pagi-next-arrow.svg" alt="pagi-next-arrow" width="24" height="24"/></button>
        <div id="pageNumbers"></div>
        <button class="page-btn next-btn" id="nextBtn"><img src="../../icons/pagi-next-arrow.svg" alt="pagi-next-arrow" width="24" height="24"/></button>
    </div>
  `;

  initPagination(block);
}