document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const rtlToggle = document.getElementById('rtl-toggle');
    const html = document.documentElement;
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('nav');
    const navActions = document.querySelector('.nav-actions');

    // Theme Management
    const initTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    };

    const toggleTheme = () => {
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    };

    function updateThemeIcon(theme) {
        document.querySelectorAll('#theme-toggle i').forEach(icon => {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // RTL Management
    const initRTL = () => {
        const currentDir = localStorage.getItem('dir') || 'ltr';
        html.setAttribute('dir', currentDir);
    };

    const toggleRTL = () => {
        const newDir = html.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
        html.setAttribute('dir', newDir);
        localStorage.setItem('dir', newDir);
    };

    if (rtlToggle) rtlToggle.addEventListener('click', toggleRTL);

    initTheme();
    initRTL();

    // Mobile Menu & Side Drawer
    if (menuToggle && navMenu) {

        // Create Mobile Actions Container
        const mobileActions = document.createElement('div');
        mobileActions.className = 'mobile-nav-actions';

        // Clone action buttons for mobile — exclude menu-toggle to avoid duplicate hamburger
        if (navActions) {
            const clones = navActions.cloneNode(true);
            const clonedToggle = clones.querySelector('.menu-toggle');
            if (clonedToggle) clonedToggle.remove();
            mobileActions.appendChild(clones);

            // Re-attach listeners to clones
            const mThemeToggle = clones.querySelector('#theme-toggle');
            const mRtlToggle   = clones.querySelector('#rtl-toggle');
            if (mThemeToggle) mThemeToggle.addEventListener('click', toggleTheme);
            if (mRtlToggle)   mRtlToggle.addEventListener('click', toggleRTL);
        }

        navMenu.appendChild(mobileActions);

        // Backdrop: above header (z 900) but below nav (z 1100)
        const backdrop = document.createElement('div');
        backdrop.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'background:rgba(0,0,0,0.5);z-index:1050;display:none;';
        document.body.appendChild(backdrop);

        // Open / close the nav drawer
        const openMenu = () => {
            navMenu.classList.add('active');
            document.body.classList.add('nav-active');
            backdrop.style.display = 'block';
            menuToggle.classList.remove('fa-bars');
            menuToggle.classList.add('fa-times');
        };

        const closeMenu = () => {
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-active');
            backdrop.style.display = 'none';
            menuToggle.classList.remove('fa-times');
            menuToggle.classList.add('fa-bars');
        };

        const toggleMenu = () => {
            navMenu.classList.contains('active') ? closeMenu() : openMenu();
        };

        menuToggle.addEventListener('click', toggleMenu);
        backdrop.addEventListener('click', closeMenu);

        // Nav link taps — close menu first, then navigate explicitly
        // (iOS/Android can suppress default link behavior inside overflow:auto containers)
        navMenu.querySelectorAll('ul li a').forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Anchor-only links (#) handled by smooth scroll below — skip
                if (!href || href === '#') {
                    closeMenu();
                    return;
                }

                // Page navigation links — explicitly navigate after closing menu
                e.preventDefault();
                closeMenu();
                setTimeout(() => {
                    window.location.href = href;
                }, 50);
            });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

    // Reveal Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .section-title, .hero-content').forEach(el => observer.observe(el));
});
