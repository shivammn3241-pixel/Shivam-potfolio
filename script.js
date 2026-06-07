/* ==========================================================================
   Shivam Sharma - Portfolio JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Components
    initThemeToggle();
    initMobileNav();
    initTypingAnimation();
    initScrollReveal();
    initStatsCounter();
    initActiveNavScroll();
    initContactForm();
    initWelcomeToast();
});

/* ==========================================================================
   Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    // Default to Dark if no theme is saved
    if (currentTheme) {
        document.body.classList.toggle('light-theme', currentTheme === 'light');
        toggleSwitch.checked = (currentTheme === 'light');
    } else {
        // Optional: Detect user's OS preference
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        document.body.classList.toggle('light-theme', prefersLight);
        toggleSwitch.checked = prefersLight;
    }

    // Toggle theme callback
    toggleSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* ==========================================================================
   Mobile Menu Navigation
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const menuIcon = toggleBtn.querySelector('i');

    toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        
        // Toggle Font Awesome Icons between bars and close X
        if (navLinks.classList.contains('open')) {
            menuIcon.className = 'fas fa-xmark';
        } else {
            menuIcon.className = 'fas fa-bars';
        }
    });

    // Close menu when clicking on any nav link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuIcon.className = 'fas fa-bars';
        });
    });
}

/* ==========================================================================
   Typing Animation (Hero Section)
   ========================================================================== */
function initTypingAnimation() {
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = [
        "Cyber Security Student",
        "Android Developer",
        "Ethical Hacker",
        "AI Security Researcher"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newTextDelay = 2000; // Delay between titles
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    // Start typing on load
    if (textArray.length) setTimeout(type, 1000);
}

/* ==========================================================================
   Scroll Reveal Animations
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing after animate
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

/* ==========================================================================
   Statistics Counters Animation
   ========================================================================== */
function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-num');
    const statsSection = document.getElementById('about');

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const updateCount = () => {
                const count = +counter.innerText;
                // Determine speed relative to target (so they finish at similar times)
                const increment = Math.max(1, Math.ceil(target / 100));

                if (count < target) {
                    counter.innerText = count + increment;
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Trigger counters when About Section is reached
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    if (statsSection && counters.length) {
        observer.observe(statsSection);
    }
}

/* ==========================================================================
   Active Navbar Link Highlighting
   ========================================================================== */
function initActiveNavScroll() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Offset to toggle before the section is strictly at top (85px is header height)
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   Contact Form Validation & Mock Submit
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Extra Validation
        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all details before submitting.', 'error');
            return;
        }

        // Disable submit button and show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Security Handshake...';

        // Mock AJAX Send delay
        setTimeout(() => {
            showStatus(`Thank you, ${name}! Your transmission has been securely dispatched.`, 'success');
            form.reset();
            
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }, 1800);
    });

    function showStatus(msg, type) {
        status.textContent = msg;
        status.className = `form-status ${type}`;
        status.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            status.style.display = 'none';
        }, 6000);
    }
}

/* ==========================================================================
   Welcome Toast Function
   ========================================================================== */
function initWelcomeToast() {
    const toast = document.getElementById('welcome-toast');
    if (!toast) return;

    // Slide in the toast notification after 1.5 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
    }, 1500);

    // Slide the toast notification away after 6 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(150px)';
    }, 7500);
}
