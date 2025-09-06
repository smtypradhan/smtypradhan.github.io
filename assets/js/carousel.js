document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('carouselContainer');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carousel = document.querySelector('.carousel'); // Assuming carousel wrapper exists

    let currentIndex = 0;
    let autoPlayInterval = null;
    let isHovered = false;

    // Auto-play configuration
    const AUTOPLAY_DELAY = 8000; // 8 seconds
    const ENABLE_AUTOPLAY = true; // Set to false to disable auto-play

    const getItemsPerView = () => {
        const width = window.innerWidth;
        if (width >= 1024) return 6;
        if (width >= 768) return 3;
        if (width >= 640) return 2;
        return 1;
    };

    const getMaxIndex = () => {
        const itemsPerView = getItemsPerView();
        return Math.max(0, Math.ceil(items.length / itemsPerView) - 1);
    };

    const updateCarousel = () => {
        const offset = -100 * currentIndex;
        container.style.transform = `translateX(${offset}%)`;
    };

    const clampIndex = () => {
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    };

    // Enhanced navigation functions
    const goToPrevious = () => {
        const maxIndex = getMaxIndex();
        if (currentIndex === 0) {
            currentIndex = maxIndex; // Go to last page
        } else {
            currentIndex -= 1;
        }
        clampIndex();
        updateCarousel();
    };

    const goToNext = () => {
        const maxIndex = getMaxIndex();
        if (currentIndex === maxIndex) {
            currentIndex = 0; // Go to first page
        } else {
            currentIndex += 1;
        }
        clampIndex();
        updateCarousel();
    };

    // Auto-play functionality
    const startAutoPlay = () => {
        if (!ENABLE_AUTOPLAY || isHovered) return;
        
        stopAutoPlay(); // Clear any existing interval
        autoPlayInterval = setInterval(() => {
            if (!isHovered) {
                goToNext();
            }
        }, AUTOPLAY_DELAY);
    };

    const stopAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };

    const restartAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
    };

    // Manual navigation event listeners
    prevBtn.addEventListener('click', () => {
        goToPrevious();
        restartAutoPlay(); // Restart auto-play after manual interaction
    });

    nextBtn.addEventListener('click', () => {
        goToNext();
        restartAutoPlay(); // Restart auto-play after manual interaction
    });

    // Pause auto-play on hover (better UX)
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoPlay();
        });

        carousel.addEventListener('mouseleave', () => {
            isHovered = false;
            startAutoPlay();
        });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        // Reset to first page on resize to avoid showing empty space
        currentIndex = 0;
        clampIndex();
        updateCarousel();
        restartAutoPlay(); // Restart auto-play after resize
    });

    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else if (!isHovered) {
            startAutoPlay();
        }
    });

    // Initialize carousel
    updateCarousel();
    
    // Start auto-play
    if (ENABLE_AUTOPLAY) {
        startAutoPlay();
        console.log('Carousel auto-play started (4 second intervals)');
    }

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrevious();
            restartAutoPlay();
        } else if (e.key === 'ArrowRight') {
            goToNext();
            restartAutoPlay();
        }
    });
});