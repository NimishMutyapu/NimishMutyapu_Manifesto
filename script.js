// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Page navigation
    function showPage(targetPage) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetElement = document.getElementById(targetPage);
        if (targetElement) {
            targetElement.classList.add('active');
            targetElement.classList.add('fade-in');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                targetElement.classList.remove('fade-in');
            }, 500);
        }

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-page="${targetPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            
            // Update URL hash
            window.location.hash = targetPage;
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showPage(hash);
        } else {
            showPage('about'); // Default to about page
        }
    });

    // Initialize page based on URL hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        showPage(initialHash);
    } else {
        showPage('about'); // Default to about page
        window.location.hash = 'about';
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Validate required fields
            const requiredFields = ['name', 'email', 'subject', 'message'];
            let isValid = true;
            let errorMessage = '';

            requiredFields.forEach(field => {
                if (!data[field] || data[field].trim() === '') {
                    isValid = false;
                    errorMessage = `Please fill in the ${field.charAt(0).toUpperCase() + field.slice(1)} field.`;
                }
            });

            // Validate email format
            if (isValid && data.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            }

            // Remove any existing messages
            const existingMessages = contactForm.querySelectorAll('.success-message, .error-message');
            existingMessages.forEach(msg => msg.remove());

            if (isValid) {
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! I will get back to you within 24 hours.';
                
                // Insert message at the top of the form
                contactForm.insertBefore(successMessage, contactForm.firstChild);
                
                // Reset form
                contactForm.reset();
                
                // Log form data (in a real application, you would send this to a server)
                console.log('Form submitted with data:', data);
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
            } else {
                // Create error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = errorMessage;
                
                // Insert message at the top of the form
                contactForm.insertBefore(errorDiv, contactForm.firstChild);
                
                // Scroll to error message
                errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // Smooth scrolling for anchor links within pages
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#/')) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add intersection observer for animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat-card, .value-card, .goal-item, .reason-card, .endorsement-card').forEach(el => {
        observer.observe(el);
    });

    // Add loading states and error handling for form submission
    function showLoadingState(button) {
        button.disabled = true;
        button.textContent = 'Sending...';
    }

    function hideLoadingState(button) {
        button.disabled = false;
        button.textContent = 'Send Message';
    }

    // Enhanced mobile menu animation
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = this.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.transition = 'all 0.3s ease';
            if (this.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu on escape
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Add focus management for accessibility
    navLinks.forEach(link => {
        link.addEventListener('focus', function() {
            // Ensure focused links are visible in mobile menu
            if (window.innerWidth <= 768 && !navMenu.classList.contains('active')) {
                hamburger.click();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile menu on larger screens
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger bars
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    });
});

// Utility functions
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

// Add smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = 'smooth';
