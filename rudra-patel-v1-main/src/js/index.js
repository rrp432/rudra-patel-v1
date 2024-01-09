document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('.navbar a');
  
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
  
        const targetSectionId = link.getAttribute('href').substring(1);
        scrollToSectionAndCenter(targetSectionId);
      });
    });
  
    function scrollToSectionAndCenter(sectionId) {
      const section = document.querySelector('#' + sectionId);
      if (section) {
        // Get the bounding rectangle of the section element
        const rect = section.getBoundingClientRect();
  
        // Calculate the scroll position to center the element
        const scrollPosition = window.scrollY + (rect.top + rect.height / 2) - (window.innerHeight / 2)-100;
        
        // Smoothly scroll to the calculated position
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  });
  








