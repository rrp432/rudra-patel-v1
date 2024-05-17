document.addEventListener("DOMContentLoaded", function () {

  // Typing animation
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

  // Delay the typing animation until the page has fully loaded
  setTimeout(type, 2000); // Adjust delay as needed

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
    }
  });

  // Dark mode functionality
  const darkModeCheckbox = document.getElementById("darkModeCheckbox");
  const root = document.documentElement;

  // Function to set dark mode
  function setDarkMode(enabled) {
    if (enabled) {
      root.classList.add("dark-mode");
      darkModeCheckbox.checked = true;
      localStorage.setItem('darkModeEnabled', 'true');
    } else {
      root.classList.remove("dark-mode");
      darkModeCheckbox.checked = false;
      localStorage.setItem('darkModeEnabled', 'false');
    }
  }

  // Initialize dark mode based on user preference or default to light mode
  const darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
  setDarkMode(darkModeEnabled); // Set initial dark mode state

  // Listen for changes to the dark mode checkbox
  darkModeCheckbox.addEventListener("change", function () {
    setDarkMode(this.checked);
  });

  // Get all project elements
  const projects = document.querySelectorAll('.section4 .project');

  // Loop through each project element
  projects.forEach(project => {
    // Add click event listener
    project.addEventListener('click', function () {
      // Toggle the 'clicked' class on the project element
      this.classList.toggle('clicked');
    });
  });

});
