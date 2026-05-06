class MobileMenu {
    constructor(options = {}) {
        this.header = options.header || document.querySelector('#masthead');
        this.toggleButton = null;
        this.mobileNav = null;
        this.closeButton = null;
        this.backdrop = null;

        this.isOpen = false;

        this.onToggle = this.handleToggle.bind(this);
        this.onClose = this.close.bind(this);
        this.onKeyDown = this.handleKeyDown.bind(this);
    }

    init() {
        if (!this.header) return;

        this.toggleButton = this.header.querySelector('.spc-header__menu-toggle');
        this.mobileNav = this.header.querySelector('.spc-mobile-nav');
        this.closeButton = this.header.querySelector('.spc-mobile-nav__close');
        this.backdrop = this.header.querySelector('.spc-mobile-nav-backdrop');

        if (!this.toggleButton || !this.mobileNav || !this.closeButton || !this.backdrop) return;

        this.toggleButton.addEventListener('click', this.onToggle);
        this.closeButton.addEventListener('click', this.onClose);
        this.backdrop.addEventListener('click', this.onClose);

        this.mobileNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', this.onClose);
        });

        document.addEventListener('keydown', this.onKeyDown);
    }

    handleToggle() {
        if (this.isOpen) {
            this.close();
            return;
        }

        this.open();
    }

    open() {
        this.isOpen = true;
        this.header.classList.add('is-mobile-menu-open');
        document.body.classList.add('spc-mobile-menu-open');

        this.toggleButton.setAttribute('aria-expanded', 'true');
        this.mobileNav.setAttribute('aria-hidden', 'false');

        this.closeButton.focus();
    }

    close() {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.header.classList.remove('is-mobile-menu-open');
        document.body.classList.remove('spc-mobile-menu-open');

        this.toggleButton.setAttribute('aria-expanded', 'false');
        this.mobileNav.setAttribute('aria-hidden', 'true');
        this.toggleButton.focus();
    }

    handleKeyDown(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }
}

export default MobileMenu;
