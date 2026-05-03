
document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.spc-x');
    if (!root) return;

    // =========================================================
    // Add body class for WordPress header overlay styling
    // =========================================================
    document.body.classList.add('spc-page-overlay-header');

    // =========================================================
    // Mobile video source swap (9:16 vs 16:9)
    // =========================================================
    const video = root.querySelector('.hero-bg video');
    const source = video ? video.querySelector('source') : null;

    const DESKTOP_VIDEO = 'assets/media/vid/hero-background.mp4';
    const MOBILE_VIDEO = 'assets/media/vid/hero-background-mobile.mp4';
    const MOBILE_POSTER = 'assets/media/hero-background-poster.webp';

    if (video && source) {
        const setSourceForViewport = () => {
            const isMobile = window.innerWidth <= 920;
            const newSrc = isMobile ? MOBILE_VIDEO : DESKTOP_VIDEO;

            // Set mobile poster if available (not placeholder)
            if (isMobile && MOBILE_POSTER && !MOBILE_POSTER.includes('REPLACE_')) {
                video.setAttribute('poster', MOBILE_POSTER);
            }

            // Skip if mobile URL is still placeholder
            if (newSrc.includes('REPLACE_')) return;

            // Swap source if changed
            if (source.getAttribute('src') !== newSrc) {
                source.setAttribute('src', newSrc);
                video.load();
                const playPromise = video.play();
                if (playPromise && playPromise.catch) {
                    playPromise.catch(() => {});
                }
            }
        };

        setSourceForViewport();
    }

    // =========================================================
    // Intersection Observer for reveal animations
    // =========================================================
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        // Elements that should reveal on scroll
        root.querySelectorAll('.day, .section-head, .whatis .grid, .included-grid, .fit-grid, .hero-meta').forEach((el) => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    // =========================================================
    // Video controls killswitch
    // Strips native controls via event listeners and polling
    // =========================================================
    if (video) {
        const killControls = () => {
            video.removeAttribute('controls');
            video.controls = false;
            video.setAttribute('tabindex', '-1');
        };

        killControls();

        // Kill controls on every state change
        const events = [
            'loadedmetadata',
            'loadeddata',
            'play',
            'playing',
            'pause',
            'timeupdate',
            'canplay',
            'canplaythrough',
            'suspend'
        ];

        events.forEach((evt) => {
            video.addEventListener(evt, killControls);
        });

        // Polling fallback (20 checks at 250ms intervals = 5s total)
        let checkCount = 0;
        const pollInterval = setInterval(() => {
            killControls();
            checkCount++;
            if (checkCount > 20) clearInterval(pollInterval);
        }, 250);
    }
});
