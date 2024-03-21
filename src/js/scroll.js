document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSectionId = link.getAttribute('href').substring(1);
            scrollToSectionHeading(targetSectionId);
        });
    });

    function scrollToSectionHeading(sectionId) {
        // Check if sectionId is not empty
        if (sectionId) {
            const section = document.getElementById(sectionId);

            // Check if the section exists
            if (section) {
                const heading = section.querySelector('h1, h2, h3, h4, h5, h6');

                // Check if the heading exists within the section
                if (heading) {
                    const rect = heading.getBoundingClientRect();
                    let scrollPosition;

                    if (sectionId == 'home') {
                        console.log('scroll to section1')
                        // For section1, set offset to 0
                        scrollPosition = 0;
                    } else {
                        // For other sections, set offset to 30px
                        const offset = 30; // Adjust this value as needed
                        scrollPosition = window.scrollY + rect.top - offset;
                    }

                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }

});

