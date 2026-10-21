const menuToggle = document.getElementById('menuToggle');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', function() {
    navbar.classList.toggle('active');
    menuToggle.classList.toggle('active');

    const isOpen = navbar.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
});

// মেনুর কোনো লিংকে ক্লিক করলে মেনু বন্ধ হবে
document.querySelectorAll('.navbar a').forEach(function (link) {
    link.addEventListener('click', function () {
        navbar.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
    });
});

/* ========== ২. Stats Counter ========== */

const counters = document.querySelectorAll('.counter');

function runCounter(el) {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target) + (progress === 1 ? suffix : '');
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

counters.forEach(function (c) {
    counterObserver.observe(c);
});

/* ========== ১. Scroll Reveal ========== */
const revealItems = document.querySelectorAll(
    '.section-header, .about-wrapper, .stat, .service-card, .portfolio-item, .blog-card, .contact-wrapper'
);

revealItems.forEach(function (el) {
    el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            revealObserver.unobserve(entry.target);

            // animation শেষে ক্লাস সরাই, নইলে card-এর hover বাধা পায়
            setTimeout(function () {
                entry.target.classList.remove('reveal', 'show');
            }, 900);
        }
    });
}, { threshold: 0.15 });

revealItems.forEach(function (el) {
    revealObserver.observe(el);
});

/* ========== ৩. Scroll-spy ========== */
const spySections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar a');

const spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === '#' + entry.target.id
                );
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

spySections.forEach(function (s) {
    spyObserver.observe(s);
});

/* ========== ৪. Form Validation + Send ========== */
const form = document.getElementById('contactForm');
const statusBox = document.getElementById('formStatus');

function showError(input, message) {
    const group = input.closest('.form-group');
    group.classList.add('error');
    let msg = group.querySelector('.error-msg');
    if (!msg) {
        msg = document.createElement('small');
        msg.className = 'error-msg';
        group.appendChild(msg);
    }
    msg.textContent = message;
}

function clearError(input) {
    const group = input.closest('.form-group');
    group.classList.remove('error');
    const msg = group.querySelector('.error-msg');
    if (msg) msg.remove();
}

function validateForm() {
    let valid = true;
    const name = form.elements['name'];
    const email = form.elements['email'];
    const subject = form.elements['subject'];
    const message = form.elements['message'];

    [name, email, subject, message].forEach(clearError);

    if (name.value.trim().length < 2) {
        showError(name, 'Please enter your name.');
        valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        valid = false;
    }
    if (subject.value.trim().length < 3) {
        showError(subject, 'Please enter a subject.');
        valid = false;
    }
    if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters.');
        valid = false;
    }
    return valid;
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    statusBox.textContent = '';
    statusBox.className = 'form-status';

    if (!validateForm()) return;

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Sending...';

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: new FormData(form)
        });
        const data = await response.json();

        if (data.success) {
            statusBox.textContent = 'Thank you! Your message has been sent.';
            statusBox.classList.add('success');
            form.reset();
        } else {
            throw new Error('Send failed');
        }
    } catch (error) {
        statusBox.textContent = 'Something went wrong. Please try again.';
        statusBox.classList.add('error');
    } finally {
        button.disabled = false;
        button.textContent = 'Send Message';
    }
});