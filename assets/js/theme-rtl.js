/**
* Theme & RTL System Logic
*/

(function() {
  "use strict";

  const root = document.documentElement;
  const body = document.body;

  function ensureDrawerControls() {
    document.querySelectorAll('.mobile-nav-drawer').forEach((drawer) => {
      if (drawer.querySelector('.mobile-drawer-controls')) return;

      const controls = document.createElement('div');
      controls.className = 'mobile-drawer-controls d-flex flex-column gap-2 mb-4';
      controls.innerHTML = `
        <button class="theme-toggle btn btn-link" aria-label="Toggle theme">
          <i class="bi bi-moon-fill"></i>
          <span>Theme</span>
        </button>
        <button class="rtl-toggle btn btn-sm btn-outline-secondary" aria-label="Toggle RTL">RTL</button>
        <a href="cart-page.html" class="drawer-cart-link btn btn-outline-success" aria-label="View Cart">
          <i class="bi bi-cart-fill"></i>
          <span>Cart</span>
          <span class="cart-badge">0</span>
        </a>
      `;

      const navList = drawer.querySelector('ul');
      if (navList) {
        drawer.insertBefore(controls, navList);
      } else {
        drawer.appendChild(controls);
      }
    });
  }

  function getThemeButtons() {
    return document.querySelectorAll('.theme-toggle');
  }

  function getRtlButtons() {
    return document.querySelectorAll('.rtl-toggle');
  }

  function getHamburgerIcons() {
    return document.querySelectorAll('.header-actions .mobile-nav-toggle, .mobile-nav-drawer .mobile-nav-toggle');
  }

  function getTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateThemeIcons(theme) {
    getThemeButtons().forEach((btn) => {
      let icon = btn.querySelector('i');
      if (!icon) {
        icon = document.createElement('i');
        btn.prepend(icon);
      }

      icon.classList.remove('bi-moon-fill', 'bi-sun-fill');
      icon.classList.add(theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcons(theme);
  }

  function getDir() {
    return localStorage.getItem('dir') || 'ltr';
  }

  function updateRtlButtons(dir) {
    getRtlButtons().forEach((btn) => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  }

  function setDir(dir) {
    root.setAttribute('dir', dir);
    localStorage.setItem('dir', dir);
    updateRtlButtons(dir);
  }

  function setMobileNavState(isOpen) {
    body.classList.toggle('mobile-nav-active', isOpen);

    getHamburgerIcons().forEach((icon) => {
      icon.classList.toggle('bi-list', !isOpen);
      icon.classList.toggle('bi-x', isOpen);
      icon.setAttribute('aria-expanded', String(isOpen));
    });
  }

  ensureDrawerControls();
  setTheme(getTheme());
  setDir(getDir());
  setMobileNavState(body.classList.contains('mobile-nav-active'));

  document.addEventListener('click', (event) => {
    const themeToggleBtn = event.target.closest('.theme-toggle');
    if (themeToggleBtn) {
      const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      return;
    }

    const rtlToggleBtn = event.target.closest('.rtl-toggle');
    if (rtlToggleBtn) {
      const nextDir = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      setDir(nextDir);
      return;
    }

    const mobileNavToggle = event.target.closest('.mobile-nav-toggle');
    if (mobileNavToggle) {
      event.preventDefault();
      setMobileNavState(!body.classList.contains('mobile-nav-active'));
      return;
    }

    if (event.target.closest('.mobile-nav-overlay')) {
      setMobileNavState(false);
      return;
    }

    if (event.target.closest('.mobile-nav-drawer a')) {
      setMobileNavState(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('mobile-nav-active')) {
      setMobileNavState(false);
    }
  });

  /**
   * Dashboard Sidebar Collapse
   */
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      if (window.innerWidth < 1200) {
        sidebar.classList.toggle('mobile-active');
      } else {
        sidebar.classList.toggle('collapsed');
      }
    });

    // Auto-close sidebar on mobile/tablet when clicking outside
    document.addEventListener('click', (event) => {
      if (window.innerWidth < 1200) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
          sidebar.classList.remove('mobile-active');
        }
      }
    });
  }

  /**
   * Dashboard Nav Switching
   */
  const navItems = document.querySelectorAll('.sidebar .nav-item[data-target]');
  const contentSections = document.querySelectorAll('main .content-section');
  const topBarTitle = document.querySelector('.top-bar h4');

  if (navItems.length > 0 && contentSections.length > 0) {
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        // Update active class on nav
        document.querySelectorAll('.sidebar .nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show target section
        const targetId = item.getAttribute('data-target');
        contentSections.forEach(section => {
          if (section.id === targetId) {
            section.classList.remove('d-none');
          } else {
            section.classList.add('d-none');
          }
        });

        // Update title
        const titleSpan = item.querySelector('span');
        if (topBarTitle && titleSpan) {
          topBarTitle.textContent = titleSpan.textContent;
        }

        // Auto close sidebar on mobile/tablet
        if (sidebar && window.innerWidth < 1200) {
          sidebar.classList.remove('mobile-active');
        }
      });
    });
  }
})();
