
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
            window.location.href = 'tel:+15415708491';
        } else if (contactType === 'email') {
            window.location.href = 'mailto:rrp3827@gmail.com';
            mailtoLink.click();
        }
    });
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
