// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add specific animations for stat cards
            if (entry.target.classList.contains('stat-card')) {
                animateCounter(entry.target);
            }
            
            // Animate dial charts
            if (entry.target.classList.contains('dial')) {
                animateDial(entry.target);
            }
        }
    });
}, observerOptions);

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.stat-card, .chart-container, .insight-item, .app-card, .dial');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Initialize dials with custom colors
    initializeDials();
});

// Initialize dial charts with colors and animations
function initializeDials() {
    const dials = document.querySelectorAll('.dial');
    
    dials.forEach(dial => {
        const percentage = dial.getAttribute('data-percentage');
        const color = dial.getAttribute('data-color');
        
        // Set custom color if specified
        if (color) {
            dial.style.background = `conic-gradient(${color} 0% 0%, rgba(255, 255, 255, 0.1) 0% 100%)`;
        }
        
        // Set initial state
        dial.style.setProperty('--percentage', '0%');
    });
}

// Animate dial progression
function animateDial(dial) {
    const percentage = dial.getAttribute('data-percentage');
    const color = dial.getAttribute('data-color') || '#667eea';
    
    let currentPercentage = 0;
    const targetPercentage = percentage + '%';
    const duration = 1500;
    const startTime = performance.now();
    
    function updateDial(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentPercentage = easeOut * percentage;
        dial.style.setProperty('--percentage', currentPercentage + '%');
        
        // Update background with current progress
        dial.style.background = `conic-gradient(${color} 0% ${currentPercentage}%, rgba(255, 255, 255, 0.1) ${currentPercentage}% 100%)`;
        
        if (progress < 1) {
            requestAnimationFrame(updateDial);
        } else {
            // Ensure final state
            dial.style.background = `conic-gradient(${color} 0% ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}% 100%)`;
            dial.style.setProperty('--percentage', targetPercentage);
        }
    }
    
    requestAnimationFrame(updateDial);
}

// Animate number counters
function animateCounter(statCard) {
    const numberElement = statCard.querySelector('.stat-number');
    const originalText = numberElement.textContent;
    
    // Only animate if it's a percentage or time number
    if (originalText.includes('%') || originalText.includes('h')) {
        const value = parseFloat(originalText);
        const suffix = originalText.replace(/[0-9.]/g, '');
        
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = start + (value - start) * easeOut;
            
            if (suffix === '%') {
                numberElement.textContent = Math.round(currentValue) + suffix;
            } else {
                numberElement.textContent = currentValue.toFixed(1) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
}

// Add resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Re-trigger animations if needed
    const animatedElements = document.querySelectorAll('.stat-card, .chart-container, .insight-item, .app-card, .dial');
    animatedElements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('visible');
        }
    });
});