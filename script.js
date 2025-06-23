/**
 * BVaaS - Main JavaScript File
 * Contains all interactive components for the investment platform
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initTestimonials();
    initCounters();
    initSharesCounter();
    initRevenueChart();
    initRevenueCircle();
    initAnimations();
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
 * Initialize testimonial carousel
 */
function initTestimonials() {
    const testimonials = [
        {
            image: 'https://i.pravatar.cc/150?img=5',
            text: '"The most compelling investment opportunity I\'ve seen in Nigeria\'s tech space."',
            name: 'Emmanuel Okafor',
            role: 'Serial Investor'
        },
        {
            image: 'https://i.pravatar.cc/150?img=3',
            text: '"BVaaS has consistently exceeded projections. Their credit system ensures sustainable growth."',
            name: 'Ibrahim Yusuf',
            role: 'Venture Capitalist'
        },
        {
            image: 'https://i.pravatar.cc/150?img=1',
            text: '"The first-mover advantage is real. I\'ve already seen 3x return on my investment."',
            name: 'Oluwaseun Adebayo',
            role: 'Angel Investor'
        }
    ];

    let currentTestimonial = 0;
    const testimonialContainer = document.querySelector('.testimonial-slider');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');

    // Create testimonial elements
    testimonials.forEach((testimonial, index) => {
        const testimonialEl = document.createElement('div');
        testimonialEl.className = `testimonial ${index === 0 ? 'active' : ''}`;
        testimonialEl.innerHTML = `
            <div class="testimonial-content">
                <p>${testimonial.text}</p>
                <div class="testimonial-author">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                    <div>
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.role}</p>
                    </div>
                </div>
            </div>
        `;
        testimonialContainer.appendChild(testimonialEl);
    });

    // Navigation controls
    prevButton.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        updateTestimonials();
    });

    nextButton.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonials();
    });

    // Auto-rotation
    const rotateInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        updateTestimonials();
    }, 5000);

    function updateTestimonials() {
        const testimonialsElements = document.querySelectorAll('.testimonial');
        testimonialsElements.forEach((testimonial, index) => {
            testimonial.classList.remove('active');
            if (index === currentTestimonial) {
                testimonial.classList.add('active');
            }
        });
    }
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
 * Initialize shares counter with manual control
 */
function initSharesCounter() {
    const config = {
        total: 200,
        sold: 153,
        updateInterval: 0 // Set to positive number to enable auto-update
    };

    const elements = {
        remaining: document.querySelector('.shares-remaining'),
        sold: document.querySelector('.shares-stats .stat-item:nth-child(2) .stat-number'),
        total: document.querySelector('.shares-stats .stat-item:first-child .stat-number'),
        progressBar: document.querySelector('.progress-bar')
    };

    let remaining = config.total - config.sold;
    let sold = config.sold;

    // Initial setup
    updateSharesDisplay();

    // Auto-update if enabled
    if (config.updateInterval > 0) {
        setInterval(() => {
            if (sold < config.total) {
                sold++;
                remaining = config.total - sold;
                updateSharesDisplay();
            }
        }, config.updateInterval);
    }

    // Manual control function
    window.updateSharesManually = (newSold, newRemaining = null) => {
        sold = Math.min(newSold, config.total);
        if (newRemaining !== null) {
            sold = config.total - newRemaining;
        }
        remaining = config.total - sold;
        updateSharesDisplay();
    };

    function updateSharesDisplay() {
        elements.total.textContent = config.total;
        elements.sold.textContent = sold;
        elements.remaining.textContent = remaining;
        
        // Update progress bar
        const percentage = Math.floor((sold / config.total) * 100);
        elements.progressBar.style.width = percentage + '%';
        elements.progressBar.querySelector('.progress-text').textContent = percentage + '% Funded';
        
        // Visual effects
        if (remaining <= 10) {
            elements.remaining.classList.add('blink');
            elements.remaining.classList.remove('pulse');
            document.querySelector('.shares-stats .stat-item.highlight .stat-number').classList.add('pulse');
        } else {
            elements.remaining.classList.remove('blink');
            elements.remaining.classList.add('pulse');
        }
    }
}

/**
 * Initialize revenue chart
 */
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart')?.getContext('2d');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3'],
            datasets: [{
                label: 'Projected Revenue (Millions)',
                data: [0.6, 2.4, 6],
                backgroundColor: 'rgba(108, 99, 255, 0.2)',
                borderColor: 'rgba(108, 99, 255, 1)',
                borderWidth: 3,
                tension: 0.4,
                pointBackgroundColor: 'rgba(255, 193, 7, 1)',
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255,255,255,0.9)',
                        font: {
                            family: 'Montserrat',
                            size: 14
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255,255,255,0.7)',
                        callback: function(value) {
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                }
            }
        }
    });
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