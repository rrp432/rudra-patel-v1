document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll('.navbar a');

  navLinks.forEach(function(link) {
      link.addEventListener('click', function(event) {
          event.preventDefault();

          const targetSectionId = link.getAttribute('href').substring(1);
          scrollToSectionHeading(targetSectionId);
      });
  });

  function scrollToSectionHeading(sectionId) {
      const section = document.querySelector('#' + sectionId);
      if (section) {
          // Find the first heading element within the section
          const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
          
          if (heading) {
              // Get the bounding rectangle of the heading element
              const rect = heading.getBoundingClientRect();

              // Calculate the scroll position to center the heading
              const scrollPosition = window.scrollY + (rect.top + rect.height / 2) - (window.innerHeight / 2);

              // Smoothly scroll to the calculated position
              window.scrollTo({
                  top: scrollPosition,
                  behavior: 'smooth'
              });
          }
      }
  }
});

function toggleSection() {
  var expandedContent = document.getElementById("expandedContent");
  var expandButton = document.querySelector(".expand-button");

  if (expandedContent.style.display === "none") {
    expandedContent.style.display = "block";
    expandButton.style.display = "none"; // Hide the button
  } else {
    expandedContent.style.display = "none";
    expandButton.style.display = "inline-block"; // Show the button
  }
}

