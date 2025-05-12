document.addEventListener('DOMContentLoaded', function() {

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
 
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
 
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70, 
                    behavior: 'smooth'
                });
            }
        });
    });
    
    function setActiveSection() {
        const sections = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('.nav-links a');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const id = section.getAttribute('id');
                

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    function animateOnScroll() {
        const elements = document.querySelectorAll('.animated-text');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    function animateSkills() {
        const skillBars = document.querySelectorAll('.progress');
        
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    window.addEventListener('load', () => {
        animateOnScroll();

        const skillsSection = document.querySelector('#skills');
        if (skillsSection && isElementInViewport(skillsSection)) {
            animateSkills();
        }
    });
    

    window.addEventListener('scroll', () => {
        setActiveSection();
        animateOnScroll();
    });
    

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
 
            console.log('Form submitted:', data);
            
       
            alert('direct contact through my email');
            
       
            this.reset();
        });
    }
    
    if (document.querySelector('.typing')) {
        const typed = new Typed('.typing', {
            strings: ['Developer', 'Designer', 'Freelancer', 'Creator'],
            typeSpeed: 100,
            backSpeed: 60,
            loop: true
        });
    }
});