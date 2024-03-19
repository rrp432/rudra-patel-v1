fetch('/rudra-patel-v1/src/js/edu.json')
	.then(response => response.json())
	.then(data => populateEducationTimeline(data))
	.catch(error => console.error('Error fetching JSON data:', error));

function populateEducationTimeline(data) {
	const timelineContainer = document.querySelector('.timeline-container');

	data.forEach(college => {
		const universityContainer = document.createElement('div');
		universityContainer.classList.add('timeline-item');

		const universityName = document.createElement('h2');
		universityName.classList.add('university-name');
		universityName.textContent = college.college;

		// Add event listener to college name
		universityName.addEventListener('click', () => {
			// Toggle visibility of course list
			const courseList = universityContainer.querySelector('.course-list');
			courseList.classList.toggle('show-course-list');
		});

		universityContainer.appendChild(universityName);

		const courseList = document.createElement('div');
		courseList.classList.add('course-list');

		college.courses.forEach(course => {
			const courseLink = document.createElement('a');
			courseLink.textContent = course.name;
			courseLink.href = course.link || '#'; // Set default link if missing
			courseList.appendChild(courseLink);
		});

		universityContainer.appendChild(courseList);

		timelineContainer.appendChild(universityContainer);
	});
}
