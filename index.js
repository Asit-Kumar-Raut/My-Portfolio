// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

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
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    if (window.innerWidth <= 1000) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.right = '20px';
        navMenu.style.background = '#0c0c1a';
        navMenu.style.padding = '30px';
        navMenu.style.borderRadius = '10px';
        navMenu.style.border = '1px solid #f15a29';
    }
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1000) {
            navMenu.style.display = 'none';
        }
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
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name, email, subject, message });
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
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

// Add parallax effect to home section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
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
});

// Initialize all animations on page load
window.addEventListener('load', () => {
    // Add active class to home section
    document.getElementById('home').classList.add('active');
    
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
            // Handle error case too - maybe still show if it fails to load? 
            // Better to show an empty box than an invisible one if needed, 
            // but for now let's just make sure valid ones show.
            img.addEventListener('error', () => {
                img.classList.add('loaded'); 
            });
        }
    });
});