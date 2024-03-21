
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

    /*Typing animation*/
    const typingDemo = document.querySelector('.typing-demo');
    const text = "Hello there I'm Rudra Patel";
    let index = 0;

    function type() {
      if (index < text.length) {
        typingDemo.textContent += text.charAt(index);
        index++;
        setTimeout(type, 200); // Adjust typing speed (in milliseconds)
      }
    }

    setTimeout(type, 1600); 
    /*ends*/








    // Get elements related to showing contact information
    const showContactLinks = document.querySelectorAll('.show-contact');
    const contactInfo = document.getElementById('contact-info');
  
    // Attach click event listeners to each link showing contact information
    showContactLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const contactType = this.getAttribute('data-type');
  
            if (contactType === 'email') {
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
  
       
        if (contactType === 'email') {
            window.location.href = 'mailto:rrp3827@gmail.com';
            mailtoLink.click();
        }
    });


    const darkModeCheckbox = document.getElementById("darkModeCheckbox");
		const root = document.documentElement;

		darkModeCheckbox.addEventListener("change", function () {
			if (this.checked) {
				root.classList.add("dark-mode");
			} else {
				root.classList.remove("dark-mode");
			}
		});

    
    // Get all project elements
    const projects = document.querySelectorAll('.section4 .project');

// Loop through each project element
    projects.forEach(project => {
        // Add click event listener
        project.addEventListener('click', function() {
            // Toggle the 'clicked' class on the project element
            this.classList.toggle('clicked');
        });




      });
  



  });
