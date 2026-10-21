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