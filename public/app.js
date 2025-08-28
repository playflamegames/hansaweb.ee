// HansaWeb JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initPricingCalculator();
    initContactForm();
    initAnimations();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on links
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                scrollToSection(targetId.substring(1));
            }
        });
    });
    
    // Add event listeners for CTA buttons
    initCTAButtons();
}

// Initialize CTA button functionality
function initCTAButtons() {
    // "SAA TASUTA NÄIDIS" button
    const sampleButton = document.querySelector('.btn-mega');
    if (sampleButton) {
        sampleButton.addEventListener('click', function() {
            scrollToSection('contact');
        });
    }
    
    // "Arvuta hind" button in hero
    const priceButton = document.querySelector('.hero-cta .btn-secondary');
    if (priceButton) {
        priceButton.addEventListener('click', function() {
            scrollToSection('pricing');
        });
    }
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            scrollToSection('services');
        });
    }
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('nav').offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Pricing Calculator
function initPricingCalculator() {
    const form = document.getElementById('pricing-form');
    const priceDisplay = document.querySelector('.price-amount');
    const languageRadios = document.querySelectorAll('input[name="languages"]');
    const languageCountGroup = document.getElementById('language-count-group');
    const freeSampleCheckbox = document.querySelector('input[name="freeSample"]');
    const freeSampleFields = document.getElementById('free-sample-fields');
    
    if (!form || !priceDisplay) return;
    
    // Toggle language count field
    languageRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'multi') {
                languageCountGroup.style.display = 'block';
                document.getElementById('language-count').setAttribute('required', 'required');
            } else {
                languageCountGroup.style.display = 'none';
                document.getElementById('language-count').removeAttribute('required');
            }
            calculatePrice();
        });
    });
    
    // Toggle free sample fields
    if (freeSampleCheckbox && freeSampleFields) {
        freeSampleCheckbox.addEventListener('change', function() {
            if (this.checked) {
                freeSampleFields.style.display = 'block';
            } else {
                freeSampleFields.style.display = 'none';
            }
        });
    }
    
    // Add event listeners for price calculation
    const formElements = form.querySelectorAll('select, input[type="radio"], input[type="checkbox"], input[type="number"]');
    formElements.forEach(element => {
        element.addEventListener('change', calculatePrice);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePricingSubmission(this);
    });
    
    // Initial price calculation
    calculatePrice();
}

// Calculate price based on form inputs
function calculatePrice() {
    const form = document.getElementById('pricing-form');
    const priceDisplay = document.querySelector('.price-amount');
    
    if (!form || !priceDisplay) return;
    
    const formData = new FormData(form);
    const data = {
        websiteType: formData.get('websiteType'),
        languages: formData.get('languages'),
        languageCount: parseInt(formData.get('languageCount')) || 2,
        deadline: formData.get('deadline'),
        features: formData.getAll('features'),
        maintenance: formData.get('maintenance')
    };
    
    // Show custom message if "Muu" is selected
    if (data.websiteType === 'custom') {
        priceDisplay.textContent = 'Võta ühendust';
        return;
    }
    
    // Pricing configuration
    const config = {
        basePrice: 500,
        websiteTypeMultiplier: {
            single_page: 1.0,
            multi_page: 1.5,
            large_site: 2.5,
            ecommerce: 4.0
        },
        languageMultiplier: {
            single: 1.0,
            multi: {
                2: 1.3,
                3: 1.6,
                4: 1.9,
                5: 2.2
            }
        },
        deadlineMultiplier: {
            fast: 1.5,
            normal: 1.0,
            flexible: 0.9
        },
        featurePrices: {
            contact_form: 50,
            gallery: 100,
            blog: 200,
            booking: 300,
            other: 0
        }
    };
    
    let price = config.basePrice;
    
    // Apply website type multiplier
    if (data.websiteType && config.websiteTypeMultiplier[data.websiteType]) {
        price *= config.websiteTypeMultiplier[data.websiteType];
    }
    
    // Apply language multiplier
    if (data.languages === 'multi' && data.languageCount) {
        const langMultiplier = config.languageMultiplier.multi[data.languageCount] || 2.2;
        price *= langMultiplier;
    }
    
    // Apply deadline multiplier
    if (data.deadline && config.deadlineMultiplier[data.deadline]) {
        price *= config.deadlineMultiplier[data.deadline];
    }
    
    // Add feature prices
    if (data.features && Array.isArray(data.features)) {
        data.features.forEach(feature => {
            if (config.featurePrices[feature]) {
                price += config.featurePrices[feature];
            }
        });
    }
    
    // Round to nearest 50
    price = Math.round(price / 50) * 50;
    
    // Update display
    priceDisplay.textContent = price + '€';
}

// Handle pricing form submission
async function handlePricingSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Show loading state
        submitBtn.textContent = 'Saadan...';
        submitBtn.disabled = true;
        form.classList.add('loading');
        
        const formData = new FormData(form);
        const data = {
            websiteType: formData.get('websiteType'),
            languages: formData.get('languages'),
            languageCount: parseInt(formData.get('languageCount')) || 2,
            deadline: formData.get('deadline'),
            features: formData.getAll('features'),
            maintenance: formData.get('maintenance'),
            freeSample: formData.get('freeSample') === 'yes',
            companyName: formData.get('companyName'),
            businessField: formData.get('businessField'),
            preferences: formData.get('preferences'),
            type: 'pricing'
        };
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('success', result.message || 'Hinnapäring on edukalt saadetud! Võtame teiega varsti ühendust.');
            form.reset();
            calculatePrice(); // Reset price display
        } else {
            showMessage('error', result.message || 'Viga päringu saatmisel. Palun proovige hiljem uuesti.');
        }
        
    } catch (error) {
        console.error('Pricing submission error:', error);
        showMessage('error', 'Viga päringu saatmisel. Palun proovige hiljem uuesti.');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    }
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    const freeSampleCheckbox = document.querySelector('input[name="contactFreeSample"]');
    const freeSampleFields = document.getElementById('contact-free-sample-fields');
    
    if (!form) return;
    
    // Toggle free sample fields
    if (freeSampleCheckbox && freeSampleFields) {
        freeSampleCheckbox.addEventListener('change', function() {
            if (this.checked) {
                freeSampleFields.style.display = 'block';
            } else {
                freeSampleFields.style.display = 'none';
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactSubmission(this);
    });
}

// Handle contact form submission
async function handleContactSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        // Show loading state
        submitBtn.textContent = 'Saadan...';
        submitBtn.disabled = true;
        form.classList.add('loading');
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            company: formData.get('company'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            freeSample: formData.get('contactFreeSample') === 'yes',
            companyName: formData.get('contactCompanyName'),
            businessField: formData.get('contactBusinessField'),
            preferences: formData.get('contactPreferences'),
            type: 'contact'
        };
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('success', result.message || 'Sõnum on edukalt saadetud! Võtame teiega varsti ühendust.');
            form.reset();
        } else {
            showMessage('error', result.message || 'Viga sõnumi saatmisel. Palun proovige hiljem uuesti.');
        }
        
    } catch (error) {
        console.error('Contact submission error:', error);
        showMessage('error', 'Viga sõnumi saatmisel. Palun proovige hiljem uuesti.');
    } finally {
        // Reset button state  
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    }
}

// Show message function
function showMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    // Insert at the top of the form
    const activeForm = document.querySelector('#pricing-form.loading, #contact-form.loading') || 
                      document.querySelector('#pricing-form, #contact-form');
    
    if (activeForm) {
        activeForm.insertBefore(messageEl, activeForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Animations on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .about-feature, .contact-info-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('et-EE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Global function for hero CTA button
window.scrollToSection = scrollToSection;