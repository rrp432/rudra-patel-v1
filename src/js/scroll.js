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
                    const scrollPosition = window.scrollY + (rect.top + rect.height / 2) - (window.innerHeight / 2);

                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                    });
                }
            }
        }
        
    }
});


document.addEventListener("DOMContentLoaded", function() {
    // Simulate content loading delay
    setTimeout(function() {
        // Hide loader with fade-out effect
        document.body.classList.remove("loading");
        document.querySelector(".loader").classList.add("fade-out");
        // Optional: Remove loader from the DOM after fade-out animation
        setTimeout(function() {
            document.querySelector(".loader").style.display = "none";
        }, 500);
    }, 1000); // Adjust the delay as needed
});
