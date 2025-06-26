/**
 * BVaaS - Main JavaScript File
 * Contains all interactive components for the investment platform
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initTestimonials();
    initCounters();
    initRevenueCircle();
    initAnimations();
    initFinancialChart();

});

// ==================== COMPONENT INITIALIZERS ==================== //

/**
 * Initialize navbar functionality
 */
function initNavbar() {
    // Scroll behavior
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            navbar.classList.add('hidden');
            navbar.classList.remove('visible');
        } else {
            navbar.classList.add('visible');
            navbar.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}


/**
 * Initialize testimonial carousel with auto-sliding
 */
function initTestimonials() {
    const carousel = document.querySelector('.testimonial-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 5000; // 5 seconds
    
    // Set card width based on viewport
    function setCardWidth() {
        const cardWidth = window.innerWidth <= 768 ? 
            (window.innerWidth <= 480 ? '100%' : '50%') : '33.333%';
        cards.forEach(card => {
            card.style.flex = `0 0 calc(${cardWidth} - 20px)`;
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = (index + cards.length) % cards.length;
        const scrollPosition = cards[currentIndex].offsetLeft - carousel.offsetLeft;
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        updateDots();
    }
    
    // Update active dot
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Start auto sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }
    
    // Stop auto sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });
    
    // Update current index on scroll
    carousel.addEventListener('scroll', () => {
        const scrollPosition = carousel.scrollLeft + carousel.offsetWidth / 2;
        cards.forEach((card, index) => {
            if (card.offsetLeft <= scrollPosition && 
                card.offsetLeft + card.offsetWidth > scrollPosition) {
                currentIndex = index;
                updateDots();
            }
        });
    });
    
    // Pause auto slide on hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // Initialize
    setCardWidth();
    startAutoSlide();
    
    // Handle window resize
    window.addEventListener('resize', setCardWidth);
}


/**
 * Initialize all animated counters
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter, .stat-number:not(.investor-counter)');
    
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(counter) {
        const target = +counter.getAttribute('data-target') || +counter.textContent.replace(/\D/g, '');
        const suffix = counter.getAttribute('data-suffix') || counter.textContent.replace(/^[0-9]+/, '');
        let count = 0;
        const duration = 2000; // Animation duration in ms
        const increment = target / (duration / 16); // 60fps
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.textContent = Math.min(Math.ceil(count), target) + suffix;
                requestAnimationFrame(updateCount);
            }
        };
        updateCount();
    }
}


/**
 * Initialize revenue circle visualization
 */
function initRevenueCircle() {
    const circle = document.querySelector('.revenue-circle');
    if (!circle) return;

    const segments = document.querySelectorAll('.circle-segment');
    
    segments.forEach(segment => {
        const percent = segment.getAttribute('data-percent');
        const angle = (percent / 100) * 360;
        
        // Set initial clip path
        segment.style.clipPath = `polygon(50% 50%, 50% 0%, ${50 + Math.sin(angle * Math.PI/180) * 50}% ${50 - Math.cos(angle * Math.PI/180) * 50}%, 50% 50%)`;
        
        // Hover interactions
        segment.addEventListener('mouseenter', () => {
            segment.querySelector('.segment-content').style.opacity = '1';
        });
        
        segment.addEventListener('mouseleave', () => {
            segment.querySelector('.segment-content').style.opacity = '0';
        });
    });
}

/**
 * Initialize scroll animations
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.opportunity-card, .revenue-item, .projection-card, ' +
        '.advantage-item, .team-card, .timeline-item'
    );
    
    const fadeInObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeInObserver.observe(element);
    });
}

// ==================== UTILITY FUNCTIONS ==================== //

/**
 * Format large numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Throttle function for performance
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Waitlist Form Submission with Google Sheets Integration
document.addEventListener('DOMContentLoaded', function() {
    const waitlistForm = document.getElementById('waitlistForm');
    
    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(waitlistForm);
        const data = {
            name: formData.get('name'),
            whatsapp: formData.get('whatsapp'),
            email: formData.get('email'),
            timestamp: new Date().toISOString()
        };
        
        // Show loading state
        const submitBtn = waitlistForm.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Replace with your Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbywen2YBofZH8XT_WH3QpI5AkpaAhTQQasRVnhMymJvxmxtEfuhO6ua6tNGQ1Q3QY0Lgg/exec';
        
        // Submit to Google Sheets
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            // Show success message
            waitlistForm.style.display = 'none';
            
            const successHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle"></i>
                    <h3>You're on the list!</h3>
                    <p>We'll notify you when we launch. Keep an eye on your inbox.</p>
                    <button onclick="location.reload()" class="submit-btn">
                        <span class="btn-text">Done</span>
                    </button>
                </div>
            `;
            
            document.querySelector('.waitlist-form-container').insertAdjacentHTML('beforeend', successHTML);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
            submitBtn.innerHTML = '<span class="btn-text">Join Waitlist</span><span class="btn-icon"><i class="fas fa-arrow-right"></i></span>';
            submitBtn.disabled = false;
        });
    });
});
// Add this to your script.js file
function initFinancialChart() {
    const ctx = document.getElementById('financialChart').getContext('2d');
    
    // Financial data for 5 years
    const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    const revenue = [606000, 2400000, 6000000, 12000000, 20000000];
    const costs = [424200, 1440000, 3000000, 5400000, 8000000];
    const profit = revenue.map((rev, i) => rev - costs[i]);
    
    // Calculate metrics for display
    const revenueGrowth = Math.round(((revenue[4] / revenue[0]) ** (1/4) - 1) * 100);
    const profitMargin = Math.round((profit[4] / revenue[4]) * 100);
    const totalRevenue = revenue.reduce((acc, curr) => acc + curr, 0);
    
    // Format total revenue for display
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenue,
                    backgroundColor: 'rgba(108, 99, 255, 0.8)',
                    borderColor: 'rgba(108, 99, 255, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderSkipped: false
                },
                {
                    label: 'Costs',
                    data: costs,
                    backgroundColor: 'rgba(255, 107, 107, 0.8)',
                    borderColor: 'rgba(255, 107, 107, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderSkipped: false
                },
                {
                    label: 'Profit',
                    data: profit,
                    backgroundColor: 'rgba(37, 211, 102, 0.8)',
                    borderColor: 'rgba(37, 211, 102, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: 'rgba(255,255,255,0.9)',
                        font: {
                            family: 'Montserrat',
                            size: 14
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 18, 28, 0.95)',
                    titleColor: 'rgba(255,255,255,0.9)',
                    bodyColor: 'rgba(255,255,255,0.8)',
                    borderColor: 'rgba(108, 99, 255, 0.5)',
                    borderWidth: 1,
                    padding: 15,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += formatter.format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.8)',
                        font: {
                            family: 'Montserrat',
                            weight: '600'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255,255,255,0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.8)',
                        font: {
                            family: 'Montserrat',
                            weight: '600'
                        },
                        callback: function(value) {
                            if (value >= 1000000) {
                                return '$' + (value / 1000000) + 'M';
                            } else if (value >= 1000) {
                                return '$' + (value / 1000) + 'K';
                            }
                            return '$' + value;
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                onComplete: function() {
                    // Update metric values with animation
                    animateValue(document.getElementById('revenueGrowth'), 0, revenueGrowth, 2000);
                    animateValue(document.getElementById('profitMargin'), 0, profitMargin, 2000);
                    animateValue(document.getElementById('totalRevenue'), 0, totalRevenue, 2000, formatter);
                }
            }
        }
    });
}

// Helper function to animate values
function animateValue(element, start, end, duration, formatter = null) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        if (formatter) {
            element.innerHTML = formatter.format(value);
        } else {
            element.innerHTML = value + '%';
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
