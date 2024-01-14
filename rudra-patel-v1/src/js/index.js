// Navigation Smooth Scroll Functionality
document.addEventListener("DOMContentLoaded", function() {
    // Select all navigation links
    const navLinks = document.querySelectorAll('.navbar a');
  
    // Attach click event listeners to each navigation link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
  
            // Get the target section ID from the link's href attribute
            const targetSectionId = link.getAttribute('href').substring(1);
  
            // Call the scrollToSectionHeading function with the target section ID
            scrollToSectionHeading(targetSectionId);
        });
    });
  
    // Function to smoothly scroll to the center of the target section's heading
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
  
  // Toggle Expanded Content Functionality
  function toggleSection() {
    var expandedContent = document.getElementById("expandedContent");
    var expandButton = document.querySelector(".expand-button");
  
    // Toggle the visibility of the expanded content and button
    if (expandedContent.style.display === "none") {
      expandedContent.style.display = "block";
      expandButton.style.display = "none"; // Hide the button
    } else {
      expandedContent.style.display = "none";
      expandButton.style.display = "inline-block"; // Show the button
    }
  }
  
  // Toggle Menu Functionality
  function toggleMenu() {
    var menuItems = document.querySelector('.menu-items');
    menuItems.classList.toggle('show');
  }
  
  // Contact Information Display and Click Functionality
  document.addEventListener("DOMContentLoaded", function () {
    // Get elements related to showing contact information
    const showContactLinks = document.querySelectorAll('.show-contact');
    const contactInfo = document.getElementById('contact-info');
  
    // Attach click event listeners to each link showing contact information
    showContactLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const contactType = this.getAttribute('data-type');
  
            // Set content based on the clicked link
            if (contactType === 'phone') {
                contactInfo.innerText = '+15415708491';
            } else if (contactType === 'email') {
                contactInfo.innerText = 'rrp3827@gmail.com';
            }
  
            // Show the contact information
            contactInfo.setAttribute('data-type', contactType); // Save the contact type
            contactInfo.style.display = 'block';
        });
    });
  
    // Attach click event listener to the contact information
    contactInfo.addEventListener('click', function () {
        const contactType = this.getAttribute('data-type');
  
        // Open the respective app based on the saved contact type
        if (contactType === 'phone') {
            window.location.href = 'tel:+5415708491';
        } else if (contactType === 'email') {
            window.location.href = 'mailto:rrp3827@email.com';
            mailtoLink.click();
        }
    });
  });
  
  // Toggle Menu Functionality for Mobile
  function toggleMenu() {
      const navbar = document.querySelector('.navbar');
      navbar.classList.toggle('show-dropdown');
  }
  