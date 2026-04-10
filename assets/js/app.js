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

    const menuIconOpen = menuToggle ? menuToggle.querySelector('.menu-icon-open') : null;
    const menuIconClose = menuToggle ? menuToggle.querySelector('.menu-icon-close') : null;

    function setMenuOpenVisual(open) {
        if (menuIconOpen) menuIconOpen.hidden = open;
        if (menuIconClose) menuIconClose.hidden = !open;
        runLucide();
    }

    if (menuToggle && navMenu) {
        const mobileActions = document.createElement('div');
        mobileActions.className = 'mobile-nav-actions';

        if (navActions) {
            const clones = navActions.cloneNode(true);
            const clonedMenuToggle = clones.querySelector('.menu-toggle');
            if (clonedMenuToggle) clonedMenuToggle.remove();
            clones.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
            clones.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
                btn.addEventListener('click', toggleTheme);
            });
            clones.querySelectorAll('.rtl-toggle-btn').forEach((btn) => {
                btn.addEventListener('click', toggleRTL);
            });
            mobileActions.appendChild(clones);
        }

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
                e.preventDefault();
                closeMenu();
                setTimeout(() => {
                    window.location.href = href;
                }, 50);
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
