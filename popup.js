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
        <h2>Name : <span id="name">Lorem ipsum dolor </span></h4>
        <h2>CGPA : <span id="cgpa">4.000</span> </h2>
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

window.addEventListener('load', function (evt) {
    chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
        file: 'payload.js'
    });;
});
document.getElementById("clearCourses").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "clear" }, function (message) {
            console.log(message)
        });
    });
});

document.getElementById("addCourses").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "add" }, function (message) {
            alert(message)
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
            if(document.getElementById("select").value == "none"){
                message.courses.forEach(((course) => {
                    add(course['name'], course['grade'], course['points'], course['hours'])
                }))
            }
            else if(document.getElementById("select").value == "hours"){
                // the array will sorted with bubble sort algo , bubble sort is O(N^2) time complexty 
                // there is better algorethems but the data legnth max is 50 so no broblem 
                for (var i = 0; i < message.courses.length; i++) {
                    for (var j = 0; j < (message.courses.length - i - 1); j++) {
                        if (message.courses[j].hours > message.courses[j + 1].hours) {
                            var temp = message.courses[j]
                            message.courses[j] = message.courses[j + 1]
                            message.courses[j + 1] = temp
                        }
                    }
                }

                message.courses.forEach(((course) => {
                    add(course['name'], course['grade'], course['points'], course['hours'])
                }))
            }
            else if(document.getElementById("select").value == "pointes"){
                for (var i = 0; i < message.courses.length; i++) {
                    for (var j = 0; j < (message.courses.length - i - 1); j++) {
                        if (message.courses[j].points > message.courses[j + 1].points) {
                            var temp = message.courses[j]
                            message.courses[j] = message.courses[j + 1]
                            message.courses[j + 1] = temp
                        }
                    }
                }

                message.courses.forEach(((course) => {
                    add(course['name'], course['grade'], course['points'], course['hours'])
                }))
            }
            
            const htmlCode = new XMLSerializer().serializeToString(doc);
            const blob = new Blob([htmlCode], { type: 'text/html' });
            const dataUrl = URL.createObjectURL(blob);
            // Open a new tab with the specified HTML content
            const newTab = window.open(dataUrl);
            newTab.focus()

        });
    });
});