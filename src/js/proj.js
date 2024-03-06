document.addEventListener('DOMContentLoaded', function () {
    // Fetch project data from proj.json
    fetch('/rudra-patel-v1/src/js/proj.json')
        .then(response => response.json())
        .then(data => {
            // Iterate through each project and add dynamically to the HTML
            data.forEach(project => {
                addProject(project);
            });

            // Add click and touch event listener to each project
            const projectElements = document.querySelectorAll('.project');
            projectElements.forEach((projectElement, index) => {
                projectElement.addEventListener('click', () => {
                    handleProjectClick(projectElement, data[index]);
                });

                // Add touch event listener
                projectElement.addEventListener('touchstart', (event) => {
                    event.preventDefault();
                    handleProjectClick(projectElement, data[index]);
                });
            });
        })
        .catch(error => console.error('Error fetching project data:', error));
});

function addProject(project) {
	// Create HTML elements for the project
	const projectDiv = document.createElement("div");
	projectDiv.className = "project";

	const heading = document.createElement("h2");
	heading.className = "project-heading";
	heading.textContent = project.heading;

	const description = document.createElement("p");
	description.className = "project-meta";
	const truncatedDescription =
		project.description.substring(0, 150) +
		(project.description.length > 150 ? "..." : "");
	description.textContent = truncatedDescription;

	const fullDescriptionButton = document.createElement("button");
    fullDescriptionButton.className = "fullDescriptionButton";
	fullDescriptionButton.textContent = "...";
	fullDescriptionButton.addEventListener("click", () => {
		description.textContent = project.description;
		fullDescriptionButton.style.display = "none";
	});

	const tags = document.createElement("div");
	tags.className = "tags";
	project.tags.forEach((tag) => {
		const tagElement = document.createElement("a");
		tagElement.textContent = tag;
		tags.appendChild(tagElement);
	});

	const completionDate = document.createElement("span");
	completionDate.className = "completion-date";
	completionDate.textContent = "Completion Date: " + project.completion_date;

	// Append elements to the project div
	projectDiv.appendChild(heading);
	projectDiv.appendChild(description);
	if (project.description.length > 150) {
		projectDiv.appendChild(fullDescriptionButton);
	}
	projectDiv.appendChild(tags);
	projectDiv.appendChild(completionDate);

	// Append the project div to the projects container
	const projectsContainer = document.querySelector(".projects-type");
	projectsContainer.appendChild(projectDiv);
}


function handleProjectClick(project) {
    // Define the behavior when a project is clicked
    // For example, you can open a new page with more details
    console.log('Project clicked:', project);
    // Add your code to handle the click event, e.g., open a new page or display more details
}
