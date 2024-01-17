document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('.sections section');
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSectionId = link.getAttribute('href').substring(1);
            scrollToSectionHeading(targetSectionId);
        });
    });

    function scrollToSectionHeading(sectionId) {
        const section = document.querySelector('#' + sectionId);
        if (section) {
            const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
            if (heading) {
                const rect = heading.getBoundingClientRect();
                const scrollPosition = window.scrollY + (rect.top + rect.height / 2) - (window.innerHeight / 2);
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

});