// Vanta Background
let vantaEffect = null;

function initVanta(theme = 'red') {
    // Keep background color dynamic for White theme, but fix globe colors
    const backgroundColor = theme === 'white' ? 0xffffff : 0x0;
    const globeColor = 0x00d2ff;
    const globeColor2 = 0xffffff;

    if (vantaEffect) vantaEffect.destroy();

    try {
        vantaEffect = VANTA.GLOBE({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: globeColor,
            color2: globeColor2,
            backgroundColor: backgroundColor,
            size: 1.20
        });
    } catch (err) {
        console.error("Vanta initialization failed:", err);
    }
}

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

// Theme Switcher Logic
function setTheme(themeName) {
    // Remove all theme classes
    document.body.classList.remove('theme-red', 'theme-green', 'theme-blue', 'theme-white');
    
    // Add new theme class
    if (themeName !== 'red') {
        document.body.classList.add(`theme-${themeName}`);
    }
    
    // Update active button state
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(themeName)) {
            btn.classList.add('active');
        }
    });

    // Save to localStorage
    localStorage.setItem('portfolio-theme', themeName);

    // Update Vanta
    if (typeof VANTA !== 'undefined') {
        initVanta(themeName);
    }
}

// Load saved theme
const savedTheme = localStorage.getItem('portfolio-theme') || 'red';
// Initialize theme and Vanta after a small delay to ensure DOM is ready
setTimeout(() => {
    setTheme(savedTheme);
}, 100);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
});

// Typed.js Animation
var typed = new Typed('.typing', {
    strings: ['Developer', 'Designer', 'Problem Solver', 'Gamer'],
    typeSpeed: 100,
    backSpeed: 60,
    loop: true
});

// Navigation Active State
const sections = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    if (window.innerWidth <= 768) {
        navMenu.style.background = 'var(--bg-dark)';
        navMenu.style.border = '2px solid var(--primary-color)';
        navMenu.style.boxShadow = '0 0 20px var(--primary-glow)';
    }
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Section Entrance Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Animate progress bars when skills section appears
            if (entry.target.id === 'skills') {
                const progressBars = document.querySelectorAll('.progress');
                progressBars.forEach(bar => {
                    bar.style.width = bar.style.width; // Trigger animation
                });
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Contact Form Submission
// Check for Auth Token on load
let userToken = localStorage.getItem('userToken');
let userName = localStorage.getItem('userName');

if (userToken) {
    document.body.classList.add('user-logged-in');
    document.getElementById('login-btn').innerText = `Logout (${userName})`;
}

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!userToken) {
        alert('Please login first to send a message.');
        openAuthModal();
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    try {
        const response = await fetch('/api/auth/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message, token: userToken })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.msg);
            contactForm.reset();
        } else {
            alert(data.msg);
        }
    } catch (err) {
        alert('Error sending message. Please try again.');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add parallax effect and header shrink to home section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.fixed-header');
    
    // Header shrink effect
    if (scrolled > 50) {
        header.classList.add('shrink');
    } else {
        header.classList.remove('shrink');
    }

    const homeSection = document.getElementById('home');
    if (homeSection) {
        const blob = homeSection.querySelector('.blob');
        const profileImg = homeSection.querySelector('.profile-img');
        if (blob && profileImg) {
            blob.style.transform = `translateY(${scrolled * 0.1}px)`;
            profileImg.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    }
});

// Add hover effect for project items
const projectItems = document.querySelectorAll('.project-item');
projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transition = 'all 0.3s ease';
    });
    
    // Mobile tap to show overlay
    item.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            // Check if we clicked the 'View Project' button
            if (e.target.classList.contains('btn')) {
                return; // Let the button click proceed
            }
            
            // If it's the image link, prevent default to show overlay first
            if (item.contains(e.target) && !item.classList.contains('active')) {
                e.preventDefault();
            }

            // Toggle active class for other items
            projectItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        }
    });
});

// Initialize all animations on page load
window.addEventListener('load', () => {
    // Add active class to home section
    document.getElementById('home').classList.add('active');
    
    // Initialize Vanta if not already done
    if (!vantaEffect && typeof VANTA !== 'undefined') {
        initVanta(localStorage.getItem('portfolio-theme') || 'red');
    }
    
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        bar.style.width = bar.style.width;
    });

    // Fix for missing photos: Add 'loaded' class to images once they are loaded
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.classList.add('loaded'); 
            });
        }
    });
});

// AUTH FUNCTIONS
function openAuthModal() {
    if (userToken) {
        // Logout if already logged in
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        window.location.reload();
        return;
    }
    document.getElementById('auth-modal').classList.add('show');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('show');
}

function toggleAuth(type) {
    document.getElementById('login-box').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('signup-box').style.display = type === 'signup' ? 'block' : 'none';
    document.getElementById('otp-box').style.display = 'none';
}

// Signup Logic
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.msg);
            document.getElementById('otp-email').value = email;
            document.getElementById('signup-box').style.display = 'none';
            document.getElementById('otp-box').style.display = 'block';
        } else {
            alert(data.msg);
        }
    } catch (err) {
        alert('Server Error');
    }
});

// OTP Verification Logic
document.getElementById('otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('otp-email').value;
    const otp = document.getElementById('otp-input').value;

    try {
        const res = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.msg);
            toggleAuth('login');
        } else {
            alert(data.msg);
        }
    } catch (err) {
        alert('Server Error');
    }
});

// Login Logic
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userName', data.name);
            window.location.reload();
        } else {
            alert(data.msg);
        }
    } catch (err) {
        alert('Server Error');
    }
});