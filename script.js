/**
 * BVaaS - Main JavaScript File
 * Contains all interactive components for the investment platform
 */

const firebaseConfig = {
  apiKey: "AIzaSyB-B95F56p2Bt_gPCqOylI8eHbqsXykx8Q",
  authDomain: "bvaas-a8e2a.firebaseapp.com",
  projectId: "bvaas-a8e2a",
  storageBucket: "bvaas-a8e2a.firebasestorage.app",
  messagingSenderId: "67529406573",
  appId: "1:67529406573:web:c3b516b49e502e5ca8a764",
  measurementId: "G-LG68D058SN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


document.addEventListener('DOMContentLoaded', function() {
    // Feature tabs functionality
    const featureTabs = document.querySelectorAll('.feature-tab');
    const featurePanels = document.querySelectorAll('.feature-panel');

    featureTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panels
            featureTabs.forEach(t => t.classList.remove('active'));
            featurePanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding panel
            const tabId = this.getAttribute('data-tab');
            const panelToShow = document.getElementById(`${tabId}-panel`);
            if (panelToShow) {
                panelToShow.classList.add('active');
            }
        });
    });

    // Initialize first tab as active if none are active
    if (document.querySelectorAll('.feature-tab.active').length === 0 && featureTabs.length > 0) {
        featureTabs[0].classList.add('active');
        const firstTabId = featureTabs[0].getAttribute('data-tab');
        document.getElementById(`${firstTabId}-panel`).classList.add('active');
    }
});

// Waitlist Form Submission with Firebase
document.addEventListener('DOMContentLoaded', function() {
    const waitlistForm = document.getElementById('waitlistForm');
    
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(waitlistForm);
            const data = {
                name: formData.get('name'),
                whatsapp: formData.get('whatsapp'),
                email: formData.get('email').toLowerCase(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending',
                source: 'website'
            };
            
            // Show loading state
            const submitBtn = waitlistForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            try {
                // Check if email already exists
                const emailQuery = await db.collection('waitlist')
                    .where('email', '==', data.email)
                    .limit(1)
                    .get();
                
                if (!emailQuery.empty) {
                    // Email already exists
                    showWaitlistMessage('You\'re already on our waitlist!', 'success');
                    return;
                }
                
                // Check if WhatsApp number already exists
                const whatsappQuery = await db.collection('waitlist')
                    .where('whatsapp', '==', data.whatsapp)
                    .limit(1)
                    .get();
                
                if (!whatsappQuery.empty) {
                    // WhatsApp number already exists
                    showWaitlistMessage('This WhatsApp number is already registered.', 'info');
                    return;
                }
                
                // Add new waitlist entry
                await db.collection('waitlist').add(data);
                
                // Show success message
                showWaitlistMessage('You\'re on the list! We\'ll notify you when we launch.', 'success');
                
            } catch (error) {
                console.error('Error adding to waitlist:', error);
                showWaitlistMessage('Something went wrong. Please try again.', 'error');
                submitBtn.innerHTML = '<span class="btn-text">Join Waitlist</span><span class="btn-icon"><i class="fas fa-arrow-right"></i></span>';
                submitBtn.disabled = false;
            }
        });
    }
});

function showWaitlistMessage(message, type = 'success') {
    const waitlistForm = document.getElementById('waitlistForm');
    const formContainer = document.querySelector('.waitlist-form-container');
    
    if (!waitlistForm || !formContainer) return;
    
    // Hide the form
    waitlistForm.style.display = 'none';
    
    // Determine icon and color based on message type
    let icon, color;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            color = '#25D366';
            break;
        case 'info':
            icon = 'fa-info-circle';
            color = '#FFC107';
            break;
        case 'error':
            icon = 'fa-exclamation-circle';
            color = '#FF6B6B';
            break;
        default:
            icon = 'fa-check-circle';
            color = '#25D366';
    }
    
    // Create success message HTML
    const messageHTML = `
        <div class="form-message" style="text-align: center;">
            <i class="fas ${icon}" style="font-size: 3rem; color: ${color}; margin-bottom: 1.5rem;"></i>
            <h3 style="color: white; margin-bottom: 1rem;">${message}</h3>
            <button onclick="location.reload()" class="submit-btn" style="margin-top: 2rem;">
                <span class="btn-text">Done</span>
            </button>
        </div>
    `;
    
    // Remove any existing message
    const existingMessage = formContainer.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add new message
    formContainer.insertAdjacentHTML('beforeend', messageHTML);
}



document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initTestimonials();
    initCounters();
    initRevenueCircle();
    initAnimations();
    initFinancialChart();
    addSVGGradients();
    showPieChart();
    tabSection();

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
});