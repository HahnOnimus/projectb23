document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    addSVGGradients();
    initCountdown();
    showPieChart();
    tabSection();
});

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

function showPieChart(){
    const pieChart = document.getElementById('vcPieChart');
        if (pieChart) {
            pieChart.style.transform = 'scale(0)';
            setTimeout(() => {
                pieChart.style.transition = 'transform 1s ease-out';
                pieChart.style.transform = 'scale(1)';
            }, 500);
        }

        // Growth graph animation
        const growthGraph = document.getElementById('growthGraph');
        if (growthGraph) {
            // This would be replaced with a real chart library in production
            growthGraph.innerHTML = `
                <svg viewBox="0 0 500 300" width="100%" height="100%">
                    <path d="M0,250 L100,200 L200,150 L300,50 L400,100 L500,0" 
                          stroke="url(#growthGradient)" 
                          stroke-width="4" 
                          fill="none" 
                          stroke-linecap="round"
                          stroke-dasharray="1000"
                          stroke-dashoffset="1000" />
                    <defs>
                        <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#6C63FF" />
                            <stop offset="100%" stop-color="#FFC107" />
                        </linearGradient>
                    </defs>
                </svg>
            `;
            
            setTimeout(() => {
                const path = growthGraph.querySelector('path');
                path.style.transition = 'stroke-dashoffset 2s ease-out';
                path.style.strokeDashoffset = '0';
            }, 1000);
        }
}

function tabSection(){
    const tabBtns = document.querySelectorAll('.et-tab-btn');
        const examples = document.querySelectorAll('.et-example');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons and examples
                tabBtns.forEach(b => b.classList.remove('active'));
                examples.forEach(ex => ex.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding example
                const tabId = this.getAttribute('data-tab');
                document.getElementById(`${tabId}-example`).classList.add('active');
                
                // Animate bars
                animateBars();
            });
        });
        
        // Animate bars on load
        setTimeout(() => {
            animateBars();
        }, 500);
        
        function animateBars() {
            const activeExample = document.querySelector('.et-example.active');
            if (activeExample) {
                const bars = activeExample.querySelectorAll('.ete-bar');
                bars.forEach(bar => {
                    const height = bar.style.height;
                    bar.style.height = '0';
                    setTimeout(() => {
                        bar.style.transition = 'height 1s ease-out';
                        bar.style.height = height;
                    }, 100);
                });
            }
        }
}

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

// Countdown Timer
function initCountdown() {
    // Target date: August 25, 2025
    const targetDate = new Date('August 25, 2025 00:00:00').getTime();
    
    // Get countdown elements
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    const progressCircles = document.querySelectorAll('.circle-progress');
    
    // Calculate circumference for progress circles (2πr)
    const circumference = 2 * Math.PI * 45;
    
    // Update countdown every second
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display results
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Update progress circles
        const totalHoursInDay = 24;
        const totalMinutesInHour = 60;
        const totalSecondsInMinute = 60;
        
        // Calculate dash offsets based on time remaining
        progressCircles[0].style.setProperty('--dash-offset', circumference - (days % 100 / 100) * circumference);
        progressCircles[1].style.setProperty('--dash-offset', circumference - (hours / totalHoursInDay) * circumference);
        progressCircles[2].style.setProperty('--dash-offset', circumference - (minutes / totalMinutesInHour) * circumference);
        progressCircles[3].style.setProperty('--dash-offset', circumference - (seconds / totalSecondsInMinute) * circumference);
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdown);
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
        }
    }, 1000);
}

// Add SVG gradients (place this in your HTML before the closing </body> tag)
function addSVGGradients() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    
    // Gradient for days
    const gradient1 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient1.setAttribute("id", "gradient1");
    gradient1.setAttribute("x1", "0%");
    gradient1.setAttribute("y1", "0%");
    gradient1.setAttribute("x2", "100%");
    gradient1.setAttribute("y2", "100%");
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#6C63FF");
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#FFC107");
    
    gradient1.appendChild(stop1);
    gradient1.appendChild(stop2);
    
    // Gradient for hours
    const gradient2 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient2.setAttribute("id", "gradient2");
    gradient2.setAttribute("x1", "0%");
    gradient2.setAttribute("y1", "100%");
    gradient2.setAttribute("x2", "100%");
    gradient2.setAttribute("y2", "0%");
    
    const stop3 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop3.setAttribute("offset", "0%");
    stop3.setAttribute("stop-color", "#FFC107");
    
    const stop4 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop4.setAttribute("offset", "100%");
    stop4.setAttribute("stop-color", "#6C63FF");
    
    gradient2.appendChild(stop3);
    gradient2.appendChild(stop4);
    
    // Gradient for minutes
    const gradient3 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient3.setAttribute("id", "gradient3");
    gradient3.setAttribute("x1", "0%");
    gradient3.setAttribute("y1", "0%");
    gradient3.setAttribute("x2", "100%");
    gradient3.setAttribute("y2", "0%");
    
    const stop5 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop5.setAttribute("offset", "0%");
    stop5.setAttribute("stop-color", "#6C63FF");
    
    const stop6 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop6.setAttribute("offset", "100%");
    stop6.setAttribute("stop-color", "#25D366");
    
    gradient3.appendChild(stop5);
    gradient3.appendChild(stop6);
    
    // Gradient for seconds
    const gradient4 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient4.setAttribute("id", "gradient4");
    gradient4.setAttribute("x1", "100%");
    gradient4.setAttribute("y1", "0%");
    gradient4.setAttribute("x2", "0%");
    gradient4.setAttribute("y2", "100%");
    
    const stop7 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop7.setAttribute("offset", "0%");
    stop7.setAttribute("stop-color", "#25D366");
    
    const stop8 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop8.setAttribute("offset", "100%");
    stop8.setAttribute("stop-color", "#FFC107");
    
    gradient4.appendChild(stop7);
    gradient4.appendChild(stop8);
    
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.appendChild(gradient1);
    defs.appendChild(gradient2);
    defs.appendChild(gradient3);
    defs.appendChild(gradient4);
    svg.appendChild(defs);
    
    document.body.appendChild(svg);
}

// Initialize countdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addSVGGradients();
    initCountdown();
});