// Fetch the JSON data
fetch('/rudra-patel-v1/src/js/edu.json')
	.then(response => response.json())
	.then(data => {
		populateeducation(data);
		appendCollegeLogos();
	})
	.catch(error => console.error('Error fetching JSON data:', error));

function populateeducation(data) {
	const timelineContainer = document.querySelector('.timeline-container');

	data.forEach(college => {
		const universityContainer = document.createElement('div');
		universityContainer.classList.add('timeline-item');

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

function appendCollegeLogos() {
	const hcccLogo = createLogoElement('/rudra-patel-v1/src/img/hcccLogo.png', 'HCCC Logo', 'logo', 'college-logo', 'hccc-logo');
	const oitLogo = createLogoElement('/rudra-patel-v1/src/img/oitLogo.png', 'OIT Logo', 'logo', 'college-logo', 'oit-logo');
	const rutgersLogo = createLogoElement('/rudra-patel-v1/src/img/rutgersLogo.png', 'Rutgers Logo', 'logo', 'college-logo', 'rutgers-logo');

	const logos = [oitLogo, hcccLogo, rutgersLogo];

	logos.forEach((logo, index) => {
		// Add event listener to logo to toggle course list visibility
		logo.addEventListener('click', () => {
			// Hide all course lists
			const allCourseLists = document.querySelectorAll('.course-list');
			allCourseLists.forEach(courseList => {
				courseList.classList.remove('show-course-list');
			});

			// Show the course list for the clicked university
			const courseList = document.querySelectorAll('.course-list')[index];
			courseList.classList.toggle('show-course-list');
		});

		// Insert logo into the corresponding timeline item
		const timelineItem = document.querySelectorAll('.timeline-item')[index];
		timelineItem.insertBefore(logo, timelineItem.firstChild);
	});
}



function createLogoElement(src, alt, ...classNames) {
	const logo = document.createElement('img');
	logo.src = src;
	logo.alt = alt;
	logo.classList.add(...classNames);

	return logo;
}
