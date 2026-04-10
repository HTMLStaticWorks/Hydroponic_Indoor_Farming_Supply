document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('nav#main-nav');
    const navActions = document.querySelector('.nav-actions');

    function runLucide() {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    const initTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);
    };

    const toggleTheme = () => {
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    document.querySelectorAll('.theme-toggle-btn, #theme-toggle').forEach((btn) => {
        btn.addEventListener('click', toggleTheme);
    });

    initTheme();

    const initRTL = () => {
        const currentDir = localStorage.getItem('dir') || 'ltr';
        html.setAttribute('dir', currentDir);
    };

    const toggleRTL = () => {
        const newDir = html.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
        html.setAttribute('dir', newDir);
        localStorage.setItem('dir', newDir);
    };

    document.querySelectorAll('.rtl-toggle-btn, #rtl-toggle').forEach((btn) => {
        btn.addEventListener('click', toggleRTL);
    });

    initRTL();

    runLucide();

    function setMenuOpenVisual(open) {
        if (menuToggle) {
            if (open) {
                menuToggle.classList.replace('fa-bars', 'fa-times');
            } else {
                menuToggle.classList.replace('fa-times', 'fa-bars');
            }
        }
        runLucide();
    }

    if (menuToggle && navMenu) {
        const navIconMap = {
            'index.html': 'fa-home',
            'index2.html': 'fa-house-chimney',
            'products.html': 'fa-seedling',
            'about.html': 'fa-building',
            'solutions.html': 'fa-lightbulb',
            'applications.html': 'fa-th-large',
            'contact.html': 'fa-envelope'
        };

        // Mobile/Tablet: ensure only the requested primary links appear in the drawer
        try {
            if (window.matchMedia && window.matchMedia('(max-width: 992px)').matches) {
                navMenu.querySelectorAll('a[href="dashboard.html"]').forEach((a) => {
                    const li = a.closest('li');
                    if (li) li.remove();
                });
            }
        } catch (_) {
            // no-op
        }

        navMenu.querySelectorAll('ul li a').forEach((link) => {
            if (link.querySelector('i')) return;
            const href = link.getAttribute('href') || '';
            const iconClass = navIconMap[href];
            if (!iconClass) return;
            const icon = document.createElement('i');
            icon.className = `fas ${iconClass}`;
            icon.setAttribute('aria-hidden', 'true');
            link.prepend(icon);
        });

        const mobileActions = document.createElement('div');
        mobileActions.className = 'mobile-nav-actions';

        const container = document.createElement('div');
        container.className = 'mobile-nav-actions-container';

        if (navActions) {
            const items = navActions.querySelectorAll('a.icon-btn, button.icon-btn');
            items.forEach((item) => {
                if (item.classList.contains('menu-toggle') || item.id === 'menu-toggle') return;
                // Only keep Cart / Profile / Search actions inside the drawer
                const id = item.getAttribute('id') || '';
                if (id === 'theme-toggle' || id === 'rtl-toggle') return;
                const title = (item.getAttribute('title') || '').toLowerCase();
                if (title && !['cart', 'profile', 'search'].includes(title)) return;

                const clone = item.cloneNode(true);

                clone.removeAttribute('id'); // Prevent duplicate IDs
                container.appendChild(clone);
            });
        }

        mobileActions.appendChild(container);

        navMenu.appendChild(mobileActions);

        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);

        const openMenu = () => {
            navMenu.classList.add('active');
            document.body.classList.add('nav-active');
            backdrop.classList.add('is-visible');
            setMenuOpenVisual(true);
        };

        const closeMenu = () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-active');
            backdrop.classList.remove('is-visible');
            setMenuOpenVisual(false);
        };

        const toggleMenu = () => {
            if (navMenu.classList.contains('active')) closeMenu();
            else openMenu();
        };


        menuToggle.addEventListener('click', toggleMenu);
        backdrop.addEventListener('click', closeMenu);

        navMenu.querySelectorAll('ul li a').forEach((link) => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') {
                    closeMenu();
                    return;
                }
                if (href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        closeMenu();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                    return;
                }
                // For normal page navigations, allow the browser to handle navigation.
                // Only close the drawer immediately to avoid blocking the click.
                closeMenu();
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.card, .section-title, .hero-content').forEach((el) => observer.observe(el));

    // Back to Top Button Logic
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('title', 'Back to Top');
    backToTop.setAttribute('aria-label', 'Back to Top');
    document.body.appendChild(backToTop);

    const toggleBackToTop = () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleBackToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
