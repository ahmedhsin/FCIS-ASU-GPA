// Inject the payload.js script into the current tab after the popout has loaded
htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    *{
        margin: 0%;
        padding: 0%;
    }
    #title{
        background-color: black;
        color: white;
        padding: 2vh;
        border-radius: 1vh;
    }
    #header{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3vh;
        line-height: 6vh;
        margin: 2vh 0vh;
    }
    #data{
        margin: 5vh 10vh;
    }
    
    table {
        width: 90%;
        margin-bottom: 20px;
        font-weight: 600;
        margin: 0 auto;
    }
     td {
        padding: 8px;
        text-align: left;
        border-right: 2px solid #000; 
                border-bottom: 2px solid #000;
    }
    th {
        padding: 8px;
        text-align: center;
        color: white;
        font-weight: 800;
        font-size: 2.5vh;
        letter-spacing: 1.1px;
        background-color: #000000;
        border-right: 2px solid #000;
        border-bottom: 2px solid #000;
    }*{
        margin: 0%;
        padding: 0%;
    }
    #title{
        background-color: black;
        color: white;
        padding: 2vh;
        border-radius: 1vh;
    }
    #header{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3vh;
        line-height: 6vh;
        margin: 2vh 0vh;
    }
    #data{
        margin: 5vh 10vh;
    }
    
    table {
        width: 90%;
        margin-bottom: 20px;
        font-weight: 600;
        margin: 0 auto;
    }
     td {
        padding: 8px;
        text-align: left;
        border-right: 2px solid #000; 
                border-bottom: 2px solid #000;
    }
    th {
        padding: 8px;
        text-align: center;
        color: white;
        font-weight: 800;
        font-size: 2.5vh;
        letter-spacing: 1.1px;
        background-color: #000000;
        border-right: 2px solid #000;
        border-bottom: 2px solid #000;
    }
    </style>
    <title>Document</title>
    <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  />
</head>
<body>
    <nav id="header" class="animate__animated animate__fadeInDown">
        <h1 id="title">FCIS ASU Grade Report </h1>
    </nav>

    <div id="data"  class="animate__animated animate__fadeInLeft" >
        <h2>Name : <span id="name"></span></h4>
        <h2>CGPA : <span id="cgpa"></span> </h2>
        <h2>Total Courses : <span id="courses"></span> </h2>
        <h2>Total Hours : <span id="hours"></span> </h2>
        <p class="disclaimer">
        Please note that this is not an official document.</p>
    </div>

    <table  class="animate__animated animate__fadeInUp">
        <thead>
            <tr>
                <th>Course name</th>
                <th>Grade</th>
                <th>Points</th>
                <th>Hours</th>
            </tr>
        </thead>
        <tbody id="tableBody">
        </tbody>
    </table>



    <script src="script.js"></script>
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

            tablebody.innerHTML = ``;
            doc.getElementById('name').innerText = message['name']
            doc.getElementById('cgpa').innerText = message['gpa']
            doc.getElementById('hours').innerText = message['totalHours']
            doc.getElementById('courses').innerText = message['numcourses']
            function add(name, grades, point, hours) {

                tablebody.innerHTML += `
                    <tr>
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
            
            message.courses.forEach(((course) => {
                add(course['name'], course['grade'], course['points'], course['hours'])
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