// import { isDesktop } from '../header/header.js';

/* eslint-disable */ 
function initPagination(element) {
  const items = Array.from(document.querySelectorAll('.blog-card')); // 50 items
  const itemsPerPage = 4; // Show 4 items per page
  let currentPage = 1;

  // Function to render items for the current page
  function renderItems() {
    const carousel = document.querySelectorAll('.blog-card');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.length);

    const itemsToShow = items.slice(startIndex, endIndex); // Get items for the current page
    carousel.forEach(function (el) {
      // Hide all items first
      el.classList.add('blog-display-none');
      el.classList.remove('blog-display-flex');
    });

    itemsToShow.forEach(function (el) {
      // Show only the items for the current page
      el.classList.add('blog-display-flex');
      el.classList.remove('blog-display-none');
    });
  }

  // Function to create ellipsis
  function createEllipsis(container) {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.className = 'ellipsis';
    container.appendChild(ellipsis);
  }

  // Function to render the pagination buttons
  function renderPagination() {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const pageNumbersContainer = element.querySelector('#pageNumbers');
    pageNumbersContainer.innerHTML = ''; // Clear previous pagination

    // Number of pages to show before and after the current page (1 page before and after)
    const visiblePages = 1; // 1 page before and after the current page
    const startPage = Math.max(1, currentPage - visiblePages);
    const endPage = Math.min(totalPages, currentPage + visiblePages);

    // Show the first page and ellipsis if necessary (only if currentPage is > 3)
    if (currentPage > visiblePages + 2) {
      createPageButton(1, pageNumbersContainer);
      createEllipsis(pageNumbersContainer);
    }

    // Show the current page and its neighbors
    for (let i = startPage; i <= endPage; i++) {
      createPageButton(i, pageNumbersContainer);
    }

    // Show the last page and ellipsis if necessary
    if (currentPage < totalPages - visiblePages - 2) {
      createEllipsis(pageNumbersContainer);
      createPageButton(totalPages, pageNumbersContainer);
    }

    // Update prev/next buttons
    element.querySelector('#prevBtn').disabled = currentPage === 1;
    element.querySelector('#nextBtn').disabled = currentPage === totalPages;
  }

  // Function to create a page number button
  function createPageButton(page, container) {
    const pageNumberBtn = document.createElement('button');
    pageNumberBtn.textContent = page;
    pageNumberBtn.className = `page-btn ${page === currentPage ? 'active' : ''}`;
    pageNumberBtn.addEventListener('click', () => goToPage(page));
    container.appendChild(pageNumberBtn);
  }

  // Function to handle page navigation
  function goToPage(page) {
    currentPage = page;
    renderPagination();
    renderItems();
  }

  // Event listeners for prev/next buttons
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
  const items = Array.from(document.querySelectorAll('.blog-card')); 
  if (items.length < 4) {
    block.innerHTML = `
    <div class="pagination">
    </div>
  `;
    return
  }
  block.innerHTML = `
    <div class="pagination">
        <button class="page-btn prev-btn" id="prevBtn"><img src="../../icons/pagi-next-arrow.svg" alt="pagi-next-arrow" width="24" height="24"/></button>
        <div id="pageNumbers"></div>
        <button class="page-btn next-btn" id="nextBtn"><img src="../../icons/pagi-next-arrow.svg" alt="pagi-next-arrow" width="24" height="24"/></button>
    </div>
  `;

  initPagination(block);
}