// education.js

function addCourseDetails(term, courses) {
    var container = document.createElement('div');
    container.classList.add('timeline-node-container');

    var details = document.createElement('div');
    details.classList.add('course-details');

    var termElement = document.createElement('p');
    termElement.textContent = term;
    details.appendChild(termElement);

    var coursesList = document.createElement('ul');
    courses.forEach(function(course) {
        var courseItem = document.createElement('li');
        courseItem.textContent = course;
        coursesList.appendChild(courseItem);
    });
    details.appendChild(coursesList);

    container.appendChild(details);
    console.log(container.appendChild(details))
    return container;
}

function createTimelineLine() {
    var timelineLine = document.createElement('div');
    timelineLine.classList.add('timeline-line');
    return timelineLine;
}

function populateEducationTimeline() {
    var timeline = document.getElementById('educationTimeline');
    
    // Create and append timeline line
    var timelineLine = createTimelineLine();
    timeline.appendChild(timelineLine);

    // Fetch JSON data
    fetch('/rudra-patel-v1/src/js/edu.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(function(termAndCourses) {
                var node = addCourseDetails(termAndCourses.term, termAndCourses.courses);
                timeline.appendChild(node);
            });
        })
        .catch(error => console.error('Error fetching JSON data:', error));
}

// Call the function when the DOM is ready
document.addEventListener('DOMContentLoaded', populateEducationTimeline);