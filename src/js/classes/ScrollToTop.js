class ScrollToTop {
    constructor(options = {}) {
        this.root = options.root || document.body;
        this.threshold = options.threshold || 200;

        this.button = null;
        this.progressCircle = null;
        this.circumference = 0;

        this.ticking = false;
        this.onScroll = this.requestTick.bind(this);
        this.onResize = this.requestTick.bind(this);
        this.onClick = this.scrollToTop.bind(this);
    }

    init() {
        if (!this.root) return;
        if (this.button) return;

        this.createButton();
        this.setupRing();

        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onResize);
        this.button.addEventListener('click', this.onClick);

        this.update();
    }

    createButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'spc-scroll-top';
        button.setAttribute('aria-label', 'Scroll to top');

        button.innerHTML = [
            '<svg class="spc-scroll-top__ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false">',
            '  <circle class="spc-scroll-top__ring-track" cx="24" cy="24" r="20"></circle>',
            '  <circle class="spc-scroll-top__ring-progress" cx="24" cy="24" r="20"></circle>',
            '</svg>',
            '<svg class="spc-scroll-top__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">',
            '  <path d="M10 4 L4 10 H8 V16 H12 V10 H16 Z"></path>',
            '</svg>'
        ].join('');

        this.root.appendChild(button);
        this.button = button;
        this.progressCircle = button.querySelector('.spc-scroll-top__ring-progress');
    }

    setupRing() {
        if (!this.progressCircle) return;

        const radius = Number(this.progressCircle.getAttribute('r'));
        this.circumference = 2 * Math.PI * radius;

        this.progressCircle.style.strokeDasharray = `${this.circumference}`;
        this.progressCircle.style.strokeDashoffset = `${this.circumference}`;
    }

    requestTick() {
        if (this.ticking) return;

        this.ticking = true;
        window.requestAnimationFrame(() => {
            this.update();
            this.ticking = false;
        });
    }

    update() {
        if (!this.button || !this.progressCircle) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        let progress = 0;
        if (maxScroll > 0) {
            progress = scrollTop / maxScroll;
        }

        progress = Math.max(0, Math.min(progress, 1));

        const dashOffset = this.circumference * (1 - progress);
        this.progressCircle.style.strokeDashoffset = `${dashOffset}`;

        if (scrollTop > this.threshold) {
            this.button.classList.add('is-visible');
        } else {
            this.button.classList.remove('is-visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    destroy() {
        if (!this.button) return;

        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
        this.button.removeEventListener('click', this.onClick);
        this.button.remove();

        this.button = null;
        this.progressCircle = null;
    }
}

export default ScrollToTop;