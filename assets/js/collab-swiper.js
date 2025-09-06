    const swiper = new Swiper(".mySwiper", {
        loop: true,
        effect: 'slide',
        autoplay: {
            delay: 5000,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true, // Dots are clickable
        },
        keyboard: {
            enabled: true,   // Enable keyboard navigation
            onlyInViewport: true, // Only when swiper is in viewport
        },
    });