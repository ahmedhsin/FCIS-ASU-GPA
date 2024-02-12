const gradeMapping = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'D-': 0.7,
    'كرونا': 4,
    'ناجح': 4,
    'راسب': 0
};

const unIncludedCourses = [
    '[HUM 119] Human Rights and Combating Corruption',
    '[CIS 1] Summer Training 1',
    '[CIS 2] Summer Training 2'
]

const gradeRegex = /[A-D][+\-]?/g;
const hoursRegex = /\d+(\.\d+)?/;
const arGradeRegex = /(ناجح|راسب|كرونا)/g;

function getPointFromGrade(grade) {
    return gradeMapping[grade]
}

/**important note this is not the best implemention for getAllSubjects
 * becouse its complixty is O(N^2) where N is size of courses
 * to make it run in O(N) use dictonary instead of array so you can search/retrive in ~O(1)
 * courses will not exceed 50 so it's not a problem
 */
function findCourse(courses, courseName){
    for (let i = 0; i < courses.length; i++){
        if (courses[i].name == courseName)
            return i
    }
    return -1
}

function getAllSubjects(courses) {
    const allSubjects = document.getElementsByClassName('price-table-box2')
    console.log(allSubjects)
    Array.from(allSubjects).forEach(subject => {
        courseName = subject.childNodes[1].innerText.split(': ')[1].trim().replaceAll('\t', '')
        t_points = subject.childNodes[5].innerText.match(arGradeRegex)
        if (t_points === null) {
            t_points = subject.childNodes[5].innerText.match(gradeRegex)
        }
        grade = t_points[0]
        coursePoints = getPointFromGrade(t_points[0])
        coursesHours = parseFloat(subject.childNodes[3].innerText.match(hoursRegex)[0])
        courseObj = {
            'name': courseName,
            'points': coursePoints,
            'hours': coursesHours,
            'grade': grade

        }
        indexToPut = findCourse(courses, courseName)
        if (indexToPut == -1) {
            courses.push(courseObj)
        }else{
            courses[indexToPut] = courseObj
        }
        
    });
}
function addCourses(courses) {
    getAllSubjects(courses)
    storeCourses(courses)
}
function storeCourses(courses) {
    const jsonCourses = JSON.stringify(courses);
    localStorage.setItem('courses', jsonCourses);
}
function loadCourses() {
    let storedData = localStorage.getItem('courses');
    if (storedData === null || storedData === undefined) storedData = '[]'
    let courses = JSON.parse(storedData);
    return courses
}
function clearCourses() {
    localStorage.setItem('courses', '[]');
}


function calculateGpa(courses) {
    totalHours = courses.reduce((total, current) => {
        if (unIncludedCourses.includes(current['name']) || current['grade'] === 'كرونا') return total
        return total + current['hours']
    }, 0)
    totalPoints = courses.reduce((total, current) => {
        if (unIncludedCourses.includes(current['name']) || current['grade'] === 'كرونا') return total
        return total + current['hours'] * current['points']
    }, 0)
    gpa = (totalPoints / totalHours)
    return parseFloat(gpa.toString().slice(0, 5))
}
globalCourses = loadCourses()
//////////////////////

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "clear") {
        clearCourses()
        globalCourses = []
        sendResponse({ message: "CLEAR OK." });
    } else if (message.action === "add") {
        addCourses(globalCourses)
        sendResponse({ message: "Add OK." });
    } else if (message.action === "calc") {
        cgpa = calculateGpa(globalCourses)
        sendResponse({ gpa: cgpa })
    } else if (message.action == "getInfo"){
        cgpa = calculateGpa(globalCourses)
        t_name = document.getElementsByTagName('a')[30].innerText
        if (t_name.trim() === 'Pending Payments')
            t_name = document.getElementsByTagName('a')[2].innerText

        totalHours = globalCourses.reduce((total, current) => {
            if (current['grade'] === 'كرونا') return total
            return total + current['hours']
        }, 0)
        sendResponse({ gpa: cgpa, courses:globalCourses,name:t_name,totalHours:totalHours })
    }
});