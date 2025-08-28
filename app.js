// HansaWeb JavaScript Functions

// Global configuration
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    debounceDelay: 100
};

// Explicit green text CSS rule
const style = document.createElement('style');
style.textContent = `
.text-green-400 { 
    color: #4ade80 !important; 
}
.scroll-indicator {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.scroll-indicator.fade {
    opacity: 0.3;
}
`;
document.head.appendChild(style);

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function smoothScrollTo(target, offset = CONFIG.scrollOffset) {
    const element = document.querySelector(target);
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Scroll to Contact Form
window.scrollToContact = function() {
    smoothScrollTo('#contact', CONFIG.scrollOffset);
};

// Scroll to Pricing Calculator
window.scrollToPricing = function() {
    smoothScrollTo('#pricing', CONFIG.scrollOffset);
};

// Mobile Menu Functions
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            if (target === '#') return;
            
            smoothScrollTo(target);
        });
    });
    
    // Initialize CTA buttons
    initCTAButtons();
}

// CTA Button Event Listeners
function initCTAButtons() {
    // Hero section CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta .btn');
    
    ctaButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (index === 0) {
                // First button - "SAA TASUTA NÄIDIS" - scroll to contact form
                window.scrollToContact();
            } else if (index === 1) {
                // Second button - "Arvuta hind" - scroll to pricing calculator
                window.scrollToPricing();
            }
        });
    });
}

// Scroll Indicator Functions
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    // Click handler
    scrollIndicator.addEventListener('click', () => {
        smoothScrollTo('#services');
    });
    
    // Fade effect on scroll
    const handleScroll = debounce(() => {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (scrolled > windowHeight * 0.1) {
            scrollIndicator.classList.add('fade');
        } else {
            scrollIndicator.classList.remove('fade');
        }
    }, CONFIG.debounceDelay);
    
    window.addEventListener('scroll', handleScroll);
}

// Pricing Calculator Functions
function initPricingCalculator() {
    const form = document.getElementById('pricing-form');
    const priceDisplay = document.querySelector('#price-display .price-amount');
    const languageRadios = document.querySelectorAll('input[name="languages"]');
    const languageCountGroup = document.getElementById('language-count-group');
    const freeSampleCheckbox = document.querySelector('input[name="freeSample"]');
    const freeSampleFields = document.getElementById('free-sample-fields');
    
    if (!form || !priceDisplay) return;
    
    let pricingConfig = null;
    
    // Load pricing configuration
    fetch('/pricing-config.json')
        .then(response => response.json())
        .then(config => {
            pricingConfig = config;
            calculatePrice(); // Calculate initial price
        })
        .catch(error => {
            console.error('Error loading pricing config:', error);
            // Fallback to hardcoded values if config fails to load
            pricingConfig = {
                basePrice: { single_page: 500, multi_page: 800, large_site: 1200, ecommerce: 2000, custom: 1500 },
                languageMultiplier: { single: 1, multi: 0.3 },
                deadlineModifier: { fast: 1.5, normal: 1, flexible: 0.9 },
                features: { contact_form: 100, gallery: 200, blog: 300, booking: 500, other: 250 },
                maintenanceSetupFee: 200,
                currency: '€',
                roundTo: 50
            };
            calculatePrice();
        });
    
    // Language selection handler
    languageRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'multi') {
                languageCountGroup.style.display = 'block';
            } else {
                languageCountGroup.style.display = 'none';
            }
            calculatePrice();
        });
    });
    
    // Free sample checkbox handler
    if (freeSampleCheckbox && freeSampleFields) {
        freeSampleCheckbox.addEventListener('change', (e) => {
            freeSampleFields.style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    // Form change handler for price calculation
    const formInputs = form.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('change', calculatePrice);
    });
    
    // Price calculation function using config
    function calculatePrice() {
        if (!pricingConfig) return;
        
        const formData = new FormData(form);
        
        // Website type pricing
        const websiteType = formData.get('websiteType');
        let basePrice = pricingConfig.basePrice[websiteType] || pricingConfig.basePrice.single_page;
        
        // Language multiplier
        const languages = formData.get('languages');
        if (languages === 'multi') {
            const languageCount = parseInt(formData.get('languageCount')) || 2;
            basePrice *= (1 + (languageCount - 1) * pricingConfig.languageMultiplier.multi);
        }
        
        // Deadline modifier
        const deadline = formData.get('deadline') || 'normal';
        basePrice *= pricingConfig.deadlineModifier[deadline] || 1;
        
        // Features
        const features = formData.getAll('features');
        features.forEach(feature => {
            if (pricingConfig.features[feature]) {
                basePrice += pricingConfig.features[feature];
            }
        });
        
        // Maintenance package
        const maintenance = formData.get('maintenance');
        if (maintenance === 'yes') {
            basePrice += pricingConfig.maintenanceSetupFee;
        }
        
        // Round to specified increment
        const finalPrice = Math.round(basePrice / pricingConfig.roundTo) * pricingConfig.roundTo;
        
        // Update display
        priceDisplay.textContent = `${finalPrice}${pricingConfig.currency}`;
    }
    
    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Get multi-select values
        data.features = formData.getAll('features');
        
        // Store in localStorage for contact form
        localStorage.setItem('pricingData', JSON.stringify(data));
        
        // Scroll to contact form
        smoothScrollTo('#contact');
        
        // Show success message
        showNotification('Hinnapakkumine arvutatud! Täitke kontaktvorm täpse pakkumise saamiseks.', 'success');
    });
}

// Contact Form Functions
function initContactForm() {
    const form = document.getElementById('contact-form');
    const freeSampleCheckbox = document.querySelector('input[name="contactFreeSample"]');
    const freeSampleFields = document.getElementById('contact-free-sample-fields');
    
    if (!form) return;
    
    // Free sample checkbox handler
    if (freeSampleCheckbox && freeSampleFields) {
        freeSampleCheckbox.addEventListener('change', (e) => {
            freeSampleFields.style.display = e.target.checked ? 'block' : 'none';
        });
    }
    
    // Load pricing data if available
    const pricingData = localStorage.getItem('pricingData');
    if (pricingData) {
        const data = JSON.parse(pricingData);
        
        // Pre-fill message with pricing info
        const messageField = form.querySelector('[name="message"]');
        if (messageField && !messageField.value) {
            let message = 'Tere, soovin saada hinnapakkumist veebilehe loomiseks.\n\n';
            message += `Veebilehe tüüp: ${data.websiteType || 'Määramata'}\n`;
            message += `Keeled: ${data.languages === 'multi' ? `Mitmekeelne (${data.languageCount || 2} keelt)` : 'Ühekeelne'}\n`;
            message += `Tähtaeg: ${data.deadline || 'Tavaline'}\n`;
            
            if (data.features && data.features.length > 0) {
                message += `Lisafunktsioonid: ${data.features.join(', ')}\n`;
            }
            
            messageField.value = message;
        }
        
        // Clear stored data
        localStorage.removeItem('pricingData');
    }
    
    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            showNotification('Palun täitke kõik nõutud väljad!', 'error');
            return;
        }
        
        // Email validation
        const emailField = form.querySelector('[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField && !emailRegex.test(emailField.value)) {
            showNotification('Palun sisestage kehtiv e-maili aadress!', 'error');
            emailField.classList.add('error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saadan...';
        
        setTimeout(() => {
            showNotification('Tänan! Teie sõnum on saadetud. Võtame Teiega ühendust 24h jooksul.', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 2000);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        max-width: 400px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#059669';
            break;
        case 'error':
            notification.style.background = '#dc2626';
            break;
        default:
            notification.style.background = '#2563eb';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Scroll Effects
function initScrollEffects() {
    const handleScroll = debounce(() => {
        // Add scroll effects here if needed
    }, CONFIG.debounceDelay);
    
    window.addEventListener('scroll', handleScroll);
}

// Animation on Scroll
function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .stat-card, .about-text, .contact-info-item'
    );
    
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Initialize All Functions
function init() {
    try {
        initMobileMenu();
        initSmoothScroll();
        initScrollIndicator();
        initPricingCalculator();
        initContactForm();
        initScrollEffects();
        initAnimationsOnScroll();
        
        console.log('HansaWeb: All scripts initialized successfully');
    } catch (error) {
        console.error('HansaWeb: Initialization error:', error);
    }
}

// DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}