// Inject the payload.js script into the current tab after the popout has loaded
htmlContent = `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FCIS REPORT</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet">
    <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  />
  <link
    rel="stylesheet"
    href="${chrome.runtime.getURL('style.css')}"
  />
</head>

<body>
    <nav class="flex animate__animated animate__fadeInLeft">
        <img src="${chrome.runtime.getURL('college.png')}" width="52px" height="52px">
        <p class="bold f-16">كلية الحاسبات والمعلومات - جامعة عين شمس</p>
    </nav>
    <div class="content flex animate__animated animate__fadeInLeft">
        <section class="header flex animate__animated animate__fadeInLeft">
            <div class="name bold" id="name"></div>
            <div class="right">
                <p class="bold f-14">Grade Report Tool</p>
                <p class="bold f-14">Note: This page doesn’t represent any official document</p>
            </div>
            <div class="left flex">
                <div class="ball animate__animated animate__fadeInLeft">
                    <p class="t-top">Total Courses</p>
                    <p class="num-45" id="courses">0</p>
                </div>
                <div class="ball animate__animated animate__fadeInLeft">
                    <p class="t-top">Total Hours</p>
                    <p class="num-45" id="hours">0</p>
                </div>
                <div class="ball animate__animated animate__fadeInLeft">
                    <p class="t-top">CGPA</p>
                    <p class="num-45" id="cgpa">0</p>
                </div>
            </div>
        </section>
        <section class="table animate__animated animate__fadeInLeft">
            <table class="table-s">
                <thead>
                    <tr>
                        <th class="b-tl">Course</th>
                        <th>Grade</th>
                        <th>Points</th>
                        <th class="b-tr">Hours</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <tr class="f-color">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</body>

</html>`
const parser = new DOMParser();
const doc = parser.parseFromString(htmlContent, 'text/html');
const numcourses = document.getElementById('numcourses')

window.addEventListener('load', function (evt) {
    chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
        file: 'payload.js'
    });;
});

function getNum (){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "" }, function (message) {
            numcourses.innerText = message['numcourses']
        });
    });
};
window.onload = getNum;

document.getElementById("clearCourses").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "clear" }, function (message) {
            console.log(message)
            numcourses.innerText = message['numcourses']
        });
    });
});

document.getElementById("addCourses").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "add" }, function (message) {
            //alert(message)
            numcourses.innerText = message['numcourses']
        });
    });
});
/*
document.getElementById("calcgpa").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "calc" }, function (message) {
            console.log(message)
        });
    });
});
*/
document.getElementById("getInfo").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getInfo" }, function (message) {
            console.log(message)
            let tablebody = doc.getElementById("tableBody")

            /*tablebody.innerHTML = ``;*/
            doc.getElementById('name').innerText = message['name']
            doc.getElementById('cgpa').innerText = message['gpa']
            doc.getElementById('hours').innerText = message['totalHours']
            doc.getElementById('courses').innerText = message['numcourses']
            function add(name, grades, point, hours, rowColor) {

                tablebody.innerHTML += `
                    <tr class="${rowColor}">
                    <td>${name}</td>
                    <td>${grades}</td>
                    <td>${point}</td>
                    <td>${hours}</td>
                    </tr>`
            }
            ss = message
            let sign = 1 ;
            if(document.getElementById("order").value == "descending" )
                sign = -1 ;

            if(document.getElementById("select").value == "hours"){
                message.courses.sort((a , b)=>{return (a.hours - b.hours) * sign })
            }
            else if(document.getElementById("select").value == "points"){
                message.courses.sort((a , b)=>{return (a.points - b.points) * sign })
            }
            
            else if(document.getElementById("select").value == "hoursAndPoints"){
                message.courses.sort((a , b)=>{
                    if(a.hours == b.hours){
                        return ((a.points - b.points) * sign)
                    }
                    else{
                        return ((a.hours - b.hours) * sign)
                    }
                })
            }
            else if(document.getElementById("select").value == "pointsAndHours"){
                message.courses.sort((a , b)=>{
                    if(a.points == b.points){
                        return ((a.hours - b.hours) * sign)
                    }
                    else{
                        return ((a.points - b.points) * sign)
                    }
                })
            }
            let rowColor = 's-color'
            message.courses.forEach(((course) => {
                add(course['name'], course['grade'], course['points'], course['hours'], rowColor)
                if (rowColor == 's-color') rowColor = 'f-color'
                else rowColor = 's-color'
            }))

            const htmlCode = new XMLSerializer().serializeToString(doc);
            const blob = new Blob([htmlCode], { type: 'text/html' });
            const dataUrl = URL.createObjectURL(blob);
            // Open a new tab with the specified HTML content
            const newTab = window.open(dataUrl);
            newTab.focus()

        });
    });
});