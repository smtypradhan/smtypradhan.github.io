// Portfolio JavaScript - Save as assets/js/portfolio.js

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // FEATURED PROJECTS CAROUSEL
    // ========================================
    const projectsTrack = document.getElementById('projectsTrack');
    const projectsPrev = document.getElementById('projectsPrev');
    const projectsNext = document.getElementById('projectsNext');
    const indicators = document.querySelectorAll('[data-index]');
    
    let currentSlide = 0;
    const totalSlides = 3;
    let autoPlayInterval;

    // Update carousel position and indicators
    function updateProjectsCarousel() {
        projectsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.remove('bg-gray-300');
                indicator.classList.add('bg-blue-600');
            } else {
                indicator.classList.remove('bg-blue-600');
                indicator.classList.add('bg-gray-300');
            }
        });
    }

    // Go to previous slide
    function goToPrevSlide() {
        currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
        updateProjectsCarousel();
    }

    // Go to next slide
    function goToNextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateProjectsCarousel();
    }

    // Event listeners for navigation buttons
    projectsPrev.addEventListener('click', () => {
        goToPrevSlide();
        resetAutoPlay();
    });

    projectsNext.addEventListener('click', () => {
        goToNextSlide();
        resetAutoPlay();
    });

    // Indicator click events
    indicators.forEach((indicator) => {
        indicator.addEventListener('click', () => {
            currentSlide = parseInt(indicator.dataset.index);
            updateProjectsCarousel();
            resetAutoPlay();
        });
    });

    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToNextSlide();
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Start auto-play on load
    startAutoPlay();

    // Pause auto-play on hover
    const carouselContainer = projectsTrack.parentElement.parentElement;
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            goToNextSlide();
            resetAutoPlay();
        }
    });

    // ========================================
    // VISUAL STORYTELLING SCROLL ANIMATIONS
    // ========================================
    const storyItems = document.querySelectorAll('[data-story-item]');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-5');
                entry.target.classList.add('opacity-100', 'translate-y-0');
            }
        });
    }, observerOptions);

    // Observe all story items
    storyItems.forEach(item => {
        storyObserver.observe(item);
    });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================
    // RESPONSIVE BEHAVIOR
    // ========================================
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateProjectsCarousel();
        }, 250);
    });

    // ========================================
    // INITIALIZE
    // ========================================
    updateProjectsCarousel();
    console.log('Portfolio initialized successfully!');
});