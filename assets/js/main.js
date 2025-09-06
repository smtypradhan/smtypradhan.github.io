// This file is intentionally left blank.// Tailwind custom config
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                'ms-black': '#000000',
                'ms-darkgray': '#222222',
                'ms-gray': '#737373',
                'ms-light-gray': '#f2f2f2',
                'ms-darkblue': '#003366',
                'ms-blue': '#00A3EE',
                'ms-light-blue': '#50e6ff',
            }
        }
    }
};

// Simple Animation with JSON
document.addEventListener('DOMContentLoaded', function() {
    // Animation data in JSON format
    const animationData = {
        "animationTargets": [
            {
                "selector": ".project-card",
                "animationType": "fadeIn",
                "duration": 800,
                "delay": 100
            },
            {
                "selector": ".bg-ms-blue",
                "animationType": "pulse",
                "duration": 1500,
                "delay": 0
            }
        ]
    };
    
    // Apply animations based on JSON data
    animationData.animationTargets.forEach(target => {
        const elements = document.querySelectorAll(target.selector);
        elements.forEach((el, index) => {
            // Add initial opacity for fade-in effect
            if (target.animationType === 'fadeIn') {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.transition = `opacity ${target.duration}ms ease-in-out`;
                    el.style.opacity = '1';
                }, target.delay * index);
            }
            
            // Add pulse animation
            if (target.animationType === 'pulse') {
                el.style.transition = `transform ${target.duration}ms ease-in-out`;
                setInterval(() => {
                    el.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        el.style.transform = 'scale(1)';
                    }, target.duration / 2);
                }, target.duration + 1000);
            }
        });
    });
});
