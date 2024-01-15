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

    function openResume() {
        window.open('img/rudra_resume.pdf', '_blank');
    }

    // Attach the updateActiveSection function to the scroll event
    document.addEventListener('scroll', updateActiveSection);

    // Initial call to set the active section on page load
    updateActiveSection();

    // Function to check if an element is in the viewport
    function isInViewport(elem) {
        const rect = elem.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to update the active state based on the current section
    function updateActiveSection() {
        sections.forEach((section, index) => {
            if (isInViewport(section)) {
                navLinks.forEach((link) => link.classList.remove('active'));
                navLinks[index].classList.add('active');
            }
        });
    }
});
