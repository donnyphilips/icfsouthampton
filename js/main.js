// Aggressively force scroll to top on reload to prevent GSAP calculation bugs
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

document.addEventListener("DOMContentLoaded", function () {
    // 0. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    window.scrollTo(0, 0);
    setTimeout(() => {
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });
    }, 100);

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // =========================================
    // HIGH-END MOTION GRAPHICS SYSTEM
    // =========================================

    // A. Custom Magnetic Cursor
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        // Initial setup
        gsap.set(cursor, {xPercent: -50, yPercent: -50});
        
        // Fast quickTo setters for high performance
        let xTo = gsap.quickTo(cursor, "x", {duration: 0.4, ease: "power3"}),
            yTo = gsap.quickTo(cursor, "y", {duration: 0.4, ease: "power3"});
            
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

        window.addEventListener("mousemove", e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            xTo(mouseX);
            yTo(mouseY);
        });

        // Add magnetic scale effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .thumbnail-item, .glass-card, .btn');
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => cursor.classList.add("active"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
        });
    }

    // B. Ambient Canvas Real-Time Rendering (Fluid Gradients)
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency to background
        let width, height;
        let blobs = [];

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Create 3 premium, slow-moving fluid blobs
        const colors = [
            'rgba(26, 35, 66, 0.4)',    // Navy Light
            'rgba(212, 175, 55, 0.08)', // Gold very subtle
            'rgba(10, 17, 40, 0.6)'     // Deep Navy
        ];

        for(let i = 0; i < 3; i++) {
            blobs.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 400 + 400, // Large blobs
                color: colors[i]
            });
        }

        let mouseCanvasX = width / 2;
        let mouseCanvasY = height / 2;

        window.addEventListener('mousemove', (e) => {
            mouseCanvasX = e.clientX;
            mouseCanvasY = e.clientY;
        });

        function renderCanvas() {
            // Fill background with core black
            ctx.fillStyle = '#050505'; 
            ctx.fillRect(0, 0, width, height);
            
            ctx.globalCompositeOperation = 'screen';

            blobs.forEach((blob) => {
                // Subtle magnetic attraction to mouse
                const dx = mouseCanvasX - blob.x;
                const dy = mouseCanvasY - blob.y;
                blob.vx += dx * 0.000005; 
                blob.vy += dy * 0.000005;

                // Friction & velocity limits to keep it elegant and slow
                blob.vx *= 0.99;
                blob.vy *= 0.99;

                blob.x += blob.vx;
                blob.y += blob.vy;

                // Soft bounds checking
                if(blob.x < -blob.radius * 2) blob.vx += 0.01;
                if(blob.x > width + blob.radius * 2) blob.vx -= 0.01;
                if(blob.y < -blob.radius * 2) blob.vy += 0.01;
                if(blob.y > height + blob.radius * 2) blob.vy -= 0.01;

                const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
                gradient.addColorStop(0, blob.color);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Reset composition for next frame
            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(renderCanvas);
        }
        renderCanvas();
    }

    // =========================================
    // END HIGH-END MOTION
    // =========================================

    // 1. Sticky Header Functionality

    const header = document.getElementById('header');

    lenis.on('scroll', (e) => {
        if (e.scroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle logic - refined
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            if (isOpen) {
                lenis.stop();
            } else {
                lenis.start();
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                lenis.start();
            });
        });
    }

    // 2. Initial Loader / Hero Animations
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl.to('.fade-up', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        delay: 0.2
    });

    // 3. Sound Toggle & Cinematic Mode
    const soundToggle = document.getElementById('sound-toggle');
    const heroVideo = document.querySelector('.hero-video');
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (soundToggle && heroVideo) {
        soundToggle.addEventListener('click', () => {
            if (heroVideo.muted) {
                // Unmute video and hide content
                heroVideo.muted = false;
                soundToggle.querySelector('.icon').textContent = '🔊';
                heroContent.classList.add('content-hidden');
                scrollIndicator.style.opacity = '0';
            } else {
                // Mute video and show content
                heroVideo.muted = true;
                soundToggle.querySelector('.icon').textContent = '🔇';
                heroContent.classList.remove('content-hidden');
                scrollIndicator.style.opacity = '1';
            }
        });

        // Auto-mute on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                if (!heroVideo.muted) {
                    heroVideo.muted = true;
                    soundToggle.querySelector('.icon').textContent = '🔇';
                    heroContent.classList.remove('content-hidden');
                    scrollIndicator.style.opacity = '1';
                }
            }
        });
    }

    // 4. Highlight active nav link based on scroll
    const sections = document.querySelectorAll('section, .horizontal-panel');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            
            // If it's a horizontal panel, it moves horizontally! Check its X boundaries if it's currently pinned in the viewport's Y.
            if (section.classList.contains('horizontal-panel')) {
                // If the container is in the Y viewport middle, check X bounds
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    if (rect.left <= window.innerWidth / 2 && rect.right >= window.innerWidth / 2) {
                        const id = section.getAttribute('id');
                        if (id) current = id;
                    }
                }
            } else {
                // Regular vertical section
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    const id = section.getAttribute('id');
                    if (id) current = id;
                }
            }
        });

        if (current) {
            navItems.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === `#${current}`) {
                    a.classList.add('active');
                }
            });
        }
    });

    // 5. High-End Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('section:not(.horizontal-panel) [class*="reveal-"], footer [class*="reveal-"]');
    
    revealElements.forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            onEnter: () => el.classList.add('active'),
            onLeaveBack: () => el.classList.remove('active'), // Optional: reverse on scroll up
            toggleActions: "play none none reverse"
        });
    });

    // Parallax Effect for Images
    const parallaxImages = document.querySelectorAll('.parallax-img');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            y: "10%",
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // C. Custom Kinetic Text Splitter
    function initTextSplits() {
        const splitElements = document.querySelectorAll('section:not(.horizontal-panel) .split-text');

        splitElements.forEach(el => {
            // Simple robust word splitter (assumes no complex inner HTML structure)
            const text = el.innerText;
            const words = text.split(' ');
            el.innerHTML = '';
            
            words.forEach((word, i) => {
                const lineWrapper = document.createElement('span');
                lineWrapper.className = 'split-line';
                
                const wordSpan = document.createElement('span');
                wordSpan.className = 'split-word';
                wordSpan.innerHTML = word + (i < words.length - 1 ? '&nbsp;' : '');
                
                lineWrapper.appendChild(wordSpan);
                el.appendChild(lineWrapper);
            });

            const wordNodes = el.querySelectorAll('.split-word');
            gsap.fromTo(wordNodes, 
                { 
                    y: "110%", 
                    rotationZ: 4,
                    opacity: 0,
                    transformOrigin: "bottom left"
                },
                {
                    y: "0%",
                    rotationZ: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.04,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // Initialize custom kinetic text
    setTimeout(() => {
        initTextSplits();
        ScrollTrigger.refresh();
    }, 100);

    // 6. Horizontal Scroll Storytelling Logic
    // Apply horizontal pin logic on all screen sizes to support minimized browsers.
    let mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
        const sectionsContainer = document.querySelector(".horizontal-scroll-wrapper");
        const morphBg = document.querySelector(".morph-bg");
        const pinWrap = document.querySelector(".pin-wrap");
        const horizontalPanels = gsap.utils.toArray(".horizontal-panel");

        // --- Bridge: clear any stale clip-path on the horizontal wrapper ---
        gsap.set(sectionsContainer, { clearProps: "clipPath" });

        let scrollTween = gsap.to(pinWrap, {
            x: () => -(pinWrap.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: sectionsContainer,
                pin: true,
                scrub: 1,
                snap: {
                    snapTo: (progress) => {
                        const totalScroll = pinWrap.scrollWidth - window.innerWidth;
                        // Calculate the normalized offset (0 to 1) for each real content panel
                        const offsets = horizontalPanels.map(panel => panel.offsetLeft / totalScroll);
                        // Find and return the closest panel offset to the current progress
                        return offsets.reduce((prev, curr) => 
                            Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
                        );
                    },
                    duration: { min: 0.1, max: 0.4 },
                    delay: 0,
                    ease: "power2.inOut"
                },
                start: "top top",
                end: () => "+=" + (pinWrap.scrollWidth - window.innerWidth),
                invalidateOnRefresh: true,
                // On mobile we might want to disable horizontal scroll if it feels bad
                // but for now let's keep it and optimize.
            }
        });

        // Use Lenis for smooth anchor scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Check if the target is inside the horizontal scroll
                    const isInsideHorizontal = pinWrap.contains(targetElement);
                    
                    if (isInsideHorizontal) {
                        // Calculate horizontal offset
                        const panelIndex = horizontalPanels.indexOf(targetElement);
                        const totalScrollable = pinWrap.scrollWidth - window.innerWidth;
                        const horizontalProgress = panelIndex / (horizontalPanels.length - 1);
                        
                        // We need to scroll the vertical scrollbar to the point where the horizontal tween is at this progress
                        const st = ScrollTrigger.getById(sectionsContainer.id) || scrollTween.scrollTrigger;
                        const scrollPos = st.start + (st.end - st.start) * horizontalProgress;
                        
                        lenis.scrollTo(scrollPos, { duration: 1.5 });
                    } else {
                        lenis.scrollTo(targetElement, { duration: 1.5 });
                    }
                }
            });
        });

        // 6.5 Horizontal Panel Premium Effects
        horizontalPanels.forEach((panel, i) => {
            const content = panel.querySelector('.content');
            const visual = panel.querySelector('.visual');
            const image = panel.querySelector('.glass-card img');

            // --- 2. Enhanced Reveal Animations (Horizontal) ---
            const reveals = panel.querySelectorAll('[class*="reveal-"]');
            const splitTextElements = panel.querySelectorAll('.split-text');

            // Apply text splitting to horizontal texts
            splitTextElements.forEach(el => {
                const text = el.innerText;
                const words = text.split(' ');
                el.innerHTML = '';
                words.forEach((word, index) => {
                    const lineWrapper = document.createElement('span');
                    lineWrapper.className = 'split-line';
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'split-word';
                    wordSpan.innerHTML = word + (index < words.length - 1 ? '&nbsp;' : '');
                    lineWrapper.appendChild(wordSpan);
                    el.appendChild(lineWrapper);
                });
            });

            if (i === 0) { 
                // First panel triggers as you scroll down vertically into it
                reveals.forEach(reveal => {
                    ScrollTrigger.create({
                        trigger: sectionsContainer,
                        start: "top 60%", // Triggers vertically as the wrapper enters
                        onEnter: () => reveal.classList.add('active'),
                        onLeaveBack: () => reveal.classList.remove('active'),
                        toggleActions: "play none none reverse"
                    });
                });

                splitTextElements.forEach(el => {
                    const wordNodes = el.querySelectorAll('.split-word');
                    gsap.fromTo(wordNodes, 
                        { y: "110%", rotationZ: 4, opacity: 0, transformOrigin: "bottom left" },
                        {
                            y: "0%", rotationZ: 0, opacity: 1, duration: 1.2, stagger: 0.04, ease: "power4.out",
                            scrollTrigger: {
                                trigger: sectionsContainer,
                                start: "top 60%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                });

                // Adjust the parallax image to just subtly zoom/move on vertical scroll for the first panel
                if (image) {
                    gsap.to(image, {
                        y: "10%",
                        scale: 1.05,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionsContainer,
                            start: "top bottom",
                            end: "top top",
                            scrub: true
                        }
                    });
                }
            } else {
                // Subsequent panels trigger horizontally
                reveals.forEach(reveal => {
                    ScrollTrigger.create({
                        trigger: panel,
                        containerAnimation: scrollTween,
                        start: "left 75%",
                        onEnter: () => reveal.classList.add('active'),
                        onLeaveBack: () => reveal.classList.remove('active'),
                        toggleActions: "play none none reverse"
                    });
                });

                splitTextElements.forEach(el => {
                    const wordNodes = el.querySelectorAll('.split-word');
                    gsap.fromTo(wordNodes, 
                        { y: "110%", rotationZ: 4, opacity: 0, transformOrigin: "bottom left" },
                        {
                            y: "0%", rotationZ: 0, opacity: 1, duration: 1.2, stagger: 0.04, ease: "power4.out",
                            scrollTrigger: {
                                trigger: panel,
                                containerAnimation: scrollTween,
                                start: "left 75%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                });

                // Horizontal Parallax
                if (image) {
                    gsap.to(image, {
                        x: "25%",
                        scale: 1.1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: panel,
                            containerAnimation: scrollTween,
                            start: "left right",
                            end: "right left",
                            scrub: true
                        }
                    });
                }
            }

            // --- 3. Mouse Proximity Wiggle/Tilt ---
            const glassCard = panel.querySelector('.glass-card');
            if (glassCard) {
                panel.addEventListener('mousemove', (e) => {
                    const rect = glassCard.getBoundingClientRect();
                    const cardCenterX = rect.left + rect.width / 2;
                    const cardCenterY = rect.top + rect.height / 2;
                    
                    // Distance from mouse to center
                    const dx = e.clientX - cardCenterX;
                    const dy = e.clientY - cardCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Only active within a certain range
                    if (distance < 600) {
                        const tiltX = (dy / rect.height) * 15; // Max 15 deg
                        const tiltY = -(dx / rect.width) * 15; // Max 15 deg
                        
                        gsap.to(glassCard, {
                            rotateX: tiltX,
                            rotateY: tiltY,
                            duration: 0.5,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    } else {
                        gsap.to(glassCard, {
                            rotateX: 0,
                            rotateY: 0,
                            duration: 0.5,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }
                });

                panel.addEventListener('mouseleave', () => {
                    gsap.to(glassCard, {
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.3)",
                        overwrite: "auto"
                    });
                });
            }
        });
    });

    // 7. YouTube Gallery Logic
    const mainPlayer = document.getElementById('main-youtube-player');
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    const fallbackLink = document.getElementById('youtube-fallback-link');

    if (mainPlayer && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const videoId = thumbnail.getAttribute('data-video-id');
                
                // Update main player source with nocookie domain and origin parameter
                const origin = window.location.origin;
                mainPlayer.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&origin=${origin}&enablejsapi=1&rel=0`;
                
                // Update fallback link for direct YouTube viewing
                if (fallbackLink) {
                    fallbackLink.href = `https://www.youtube.com/watch?v=${videoId}`;
                }
                
                // Update active state
                thumbnails.forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
                
                // Scroll to player smoothly
                mainPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    /*
    // 8. Statement of Faith Puzzle Animation
    const faithSection = document.querySelector('.faith-section');
    if (faithSection) {
        const puzzleCards = gsap.utils.toArray('.faith-section .faith-card');

        const puzzleStarts = [
            { x: -300, y: -200, rotation: -45 },
            { x: 0, y: -300, rotation: 25 },
            { x: 300, y: -200, rotation: 45 },
            { x: -300, y: 200, rotation: -30 },
            { x: 0, y: 300, rotation: -20 },
            { x: 300, y: 200, rotation: 30 }
        ];

        const puzzleTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".faith-grid",
                start: "top 90%",
                end: "center 55%",
                scrub: 1.5
            }
        });

        puzzleCards.forEach((card, i) => {
            const startNode = puzzleStarts[i % puzzleStarts.length];

            gsap.set(card, {
                x: startNode.x,
                y: startNode.y,
                rotationZ: startNode.rotation,
                opacity: 0,
                scale: 0.8
            });

            puzzleTl.to(card, {
                x: 0,
                y: 0,
                rotationZ: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power2.out"
            }, 0);
        });
    }
    */

    // 8. About Section Apple-Style Scroll Storytelling
    const aboutSection = document.querySelector('.about-section');
    const aboutHeading = document.querySelector('.about-heading');
    const aboutReveal = document.querySelector('.about-reveal-content');

    if (aboutSection && aboutHeading && aboutReveal) {
        const offset = aboutReveal.offsetHeight / 2;
        gsap.set(aboutHeading, { y: offset, scale: 1 });
        gsap.set('.about-item', { opacity: 0, y: 30 });

        // 3-phase timeline: reveal → read → linger
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutSection,
                start: "top top",
                end: "+=200%", // Adjusted since 4th phase is removed
                pin: true,
                scrub: 1.5,
                refreshPriority: 10,
                invalidateOnRefresh: true
            }
        });

        // Phase 1: Heading shrinks and moves up (0 → 1.2)
        aboutTl.to(aboutHeading, {
            y: 0,
            scale: 0.65,
            transformOrigin: "center top",
            duration: 1.2,
            ease: "sine.inOut"
        }, 0);

        // Phase 2: Reveal container fades in (0.25 → 0.55)
        aboutTl.to(aboutReveal, {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.3,
            ease: "none"
        }, 0.25);

        // Phase 3: Items stagger upward into view (0.45 → 1.7)
        aboutTl.to('.about-item', {
            y: 0,
            opacity: 1,
            stagger: 0.25,
            duration: 1,
            ease: "power2.out"
        }, 0.45);
        
        // Phase 4 removed to let the horizontal scroll wrapper slide in naturally and preserve the DOM layout flow.
    }

    // 12. Cinematic Contact Reveal
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const heroCard = contactSection.querySelector('.contact-hero-card');
        const placeholder = contactSection.querySelector('.location-tile-placeholder');
        const largeText = contactSection.querySelector('.hero-large-text');
        const smallContent = contactSection.querySelector('.hero-small-content');
        const headerText = contactSection.querySelector('.contact-header-text');
        const bentoTiles = contactSection.querySelectorAll('.bento-tile:not(.location-tile-placeholder)');

        if (heroCard && placeholder && bentoTiles.length > 0) {
            // Strip out default stagger classes so our custom timeline takes absolute control
            bentoTiles.forEach(tile => {
                tile.className = tile.className.replace(/stagger-\d/g, '').replace('reveal-slide-up', '').trim();
            });
            if (headerText) headerText.className = headerText.className.replace('reveal-slide-up', '').trim();

            // Prepare starting states
            gsap.set(bentoTiles, { opacity: 0, scale: 0.95, y: 30 });
            gsap.set(headerText, { opacity: 0, y: -20 });

            // Create pinned timeline
            let contactTl = gsap.timeline({
                scrollTrigger: {
                    trigger: contactSection,
                    start: "top top", // Pin immediately upon reaching the section
                    end: "+=150%", // Scrub distance
                    pin: true,
                    scrub: 1.2,
                    invalidateOnRefresh: true // extremely critical for responsive bounds recalculation
                }
            });

            // Master FLIP-style structural shrink
            contactTl.to(heroCard, {
                top: () => {
                    const cRect = contactSection.getBoundingClientRect();
                    const tRect = placeholder.getBoundingClientRect();
                    return tRect.top - cRect.top;
                },
                left: () => {
                    const cRect = contactSection.getBoundingClientRect();
                    const tRect = placeholder.getBoundingClientRect();
                    return tRect.left - cRect.left;
                },
                width: () => placeholder.offsetWidth,
                height: () => placeholder.offsetHeight,
                borderRadius: "20px",
                ease: "power2.inOut",
                duration: 1.2
            }, 0);

            // Crossfade typography
            contactTl.to(largeText, {
                opacity: 0,
                scale: 0.9,
                ease: "power1.inOut",
                duration: 0.4
            }, 0);

            contactTl.to(smallContent, {
                opacity: 1,
                ease: "power1.out",
                duration: 0.4
            }, 0.8); // Fades in as shrink concludes

            // Reveal the rest of the Bento Grid & Header
            contactTl.to(headerText, {
                opacity: 1,
                y: 0,
                ease: "power3.out",
                duration: 0.5
            }, 0.7);

            contactTl.to(bentoTiles, {
                opacity: 1,
                scale: 1,
                y: 0,
                ease: "back.out(1.2)", // Nice subtle bounce
                duration: 0.6,
                stagger: 0.15
            }, 0.75);
        }
    }
    
    // 13. Image Sequence Scrollytelling
    const initSequence = () => {
        const canvas = document.getElementById("sequence-canvas");
        const context = canvas.getContext("2d");
        const section = document.getElementById("sequence-section");
        const title = section.querySelector(".sequence-title");

        const frameCount = 240;
        const currentFrame = (index) => (
            `images/gif/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
        );

        const images = [];
        const sequenceState = {
            frame: 0
        };

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        const render = () => {
            const img = images[sequenceState.frame];
            if (!img) return;

            // Set high-quality smoothing before every draw
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';

            // Simple center-cover logic for canvas
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.width;
            const imgHeight = img.height;

            const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
            const newWidth = imgWidth * ratio;
            const newHeight = imgHeight * ratio;
            const x = (canvasWidth - newWidth) / 2;
            const y = (canvasHeight - newHeight) / 2;

            context.clearRect(0, 0, canvasWidth, canvasHeight);
            context.drawImage(img, x, y, newWidth, newHeight);
        };

        const resizeCanvas = () => {
            // High-DPI support: multiply internal dimensions by dpr
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            
            // Sync CSS dimensions for crisp display
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            
            render();
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // SCROLL ANIMATION
        gsap.to(sequenceState, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5 // Subtle lag for buttery smooth interpolation
            },
            onUpdate: render
        });
    };

    // if (document.getElementById("sequence-section") && window.matchMedia("(min-width: 769px)").matches) {
    if (document.getElementById("sequence-section")) {
        initSequence();
    }

    // Add a final safeguard refresh to ensure all dynamically sized elements recalculate correctly
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
