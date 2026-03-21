/**
* Template Name: AgriCulture
* Template URL: https://bootstrapmade.com/agriculture-bootstrap-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.body;
    const selectHeader = document.querySelector('#header');

    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;

    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Scroll up sticky header to headers with .scroll-up-sticky class
   */
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const selectHeader = document.querySelector('#header');
    if (!selectHeader || !selectHeader.classList.contains('scroll-up-sticky')) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > selectHeader.offsetHeight) {
      selectHeader.style.setProperty('position', 'sticky', 'important');
      selectHeader.style.top = `-${selectHeader.offsetHeight + 50}px`;
    } else if (scrollTop > selectHeader.offsetHeight) {
      selectHeader.style.setProperty('position', 'sticky', 'important');
      selectHeader.style.top = '0';
    } else {
      selectHeader.style.removeProperty('top');
      selectHeader.style.removeProperty('position');
    }

    lastScrollTop = scrollTop;
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (!scrollTop) return;
    window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS === 'undefined') return;

    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  window.addEventListener('load', aosInit);

  /**
   * Auto generate the carousel indicators
   */
  document.querySelectorAll('.carousel-indicators').forEach((carouselIndicator) => {
    const carousel = carouselIndicator.closest('.carousel');
    if (!carousel) return;

    carousel.querySelectorAll('.carousel-item').forEach((carouselItem, index) => {
      carouselIndicator.innerHTML += `<li data-bs-target="#${carousel.id}" data-bs-slide-to="${index}"${index === 0 ? ' class="active"' : ''}></li>`;
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;

    document.querySelectorAll('.init-swiper').forEach((swiperElement) => {
      const configNode = swiperElement.querySelector('.swiper-config');
      if (!configNode) return;

      const config = JSON.parse(configNode.innerHTML.trim());

      if (swiperElement.classList.contains('swiper-tab')) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener('load', initSwiper);

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Handle Add to Cart button clicks
   */
  document.addEventListener('click', (e) => {
    const button = e.target.closest('.btn-add-to-cart');
    if (button) {
      const product = {
        id: button.getAttribute('data-id'),
        name: button.getAttribute('data-name'),
        price: button.getAttribute('data-price')
      };
      
      if (window.cart) {
        window.cart.addItem(product);
      }
    }
  });

  // Ensure cart badge is updated on load
  window.addEventListener('load', () => {
    if (window.cart) {
      window.cart.updateCartBadge();
    }
  });
})();
