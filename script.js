let reviews =
JSON.parse(localStorage.getItem("reviews"))
|| [];

/* login */

function login(){

let user =
document.getElementById("username").value;

let pass =
document.getElementById("password").value;

if(user=="admin" && pass=="1234"){

localStorage.setItem("login",true);

window.location="index.html";

}

else{

document.getElementById("msg").innerHTML=
"Invalid login";

}

}

/* protect page */

if(window.location.pathname.includes("index.html")){

if(localStorage.getItem("login")!="true"){

window.location="login.html";

}

}

/* logout */

function logout(){

localStorage.removeItem("login");

window.location="login.html";

}

/* sentiment */

function analyzeReview(){

let name =
document.getElementById("name").value;

let text =
document.getElementById("review").value;

let rating =
document.getElementById("rating").value;

let date =
new Date().toLocaleString();

let positiveWords =
["good","great","excellent","amazing","love"];

let negativeWords =
["bad","worst","poor","hate","problem"];

let sentiment="Neutral";

positiveWords.forEach(word=>{

if(text.toLowerCase().includes(word))
sentiment="Positive";

});

negativeWords.forEach(word=>{

if(text.toLowerCase().includes(word))
sentiment="Negative";

});

reviews.push({

name,
text,
rating,
date,
sentiment

});

localStorage.setItem(

"reviews",

JSON.stringify(reviews)

);

document.getElementById("result").innerHTML=
"Sentiment: "+sentiment;

}

/* dashboard */

window.onload=function(){

let table=
document.getElementById("reviewTable");

if(!table) return;

let search=
document.getElementById("searchBox");

let filter=
document.getElementById("filter");

function show(){

table.innerHTML=
`<tr>
<th>Name</th>
<th>Review</th>
<th>Rating</th>
<th>Date</th>
<th>Sentiment</th>
</tr>`;

let positive=0;
let negative=0;
let neutral=0;

reviews.forEach(r=>{

let text=r.name+" "+r.text;

if(search.value &&
!text.toLowerCase()
.includes(search.value.toLowerCase()))
return;

if(filter.value!="All" &&
r.sentiment!=filter.value)
return;

let row=table.insertRow();

row.insertCell(0).innerHTML=r.name;

row.insertCell(1).innerHTML=r.text;

row.insertCell(2).innerHTML="⭐".repeat(r.rating);

row.insertCell(3).innerHTML=r.date;

row.insertCell(4).innerHTML=r.sentiment;

if(r.sentiment=="Positive") positive++;

if(r.sentiment=="Negative") negative++;

if(r.sentiment=="Neutral") neutral++;

});

document.getElementById("total").innerHTML=
positive+negative+neutral;

document.getElementById("positive").innerHTML=
positive;

document.getElementById("negative").innerHTML=
negative;

document.getElementById("neutral").innerHTML=
neutral;

/* pie */

new Chart(

document.getElementById("chart"),

{

type:"pie",

data:{

labels:["Positive","Negative","Neutral"],

datasets:[{

data:[positive,negative,neutral]

}]

}

}

);

/* bar */

new Chart(

document.getElementById("barChart"),

{

type:"bar",

data:{

labels:["Positive","Negative","Neutral"],

datasets:[{

label:"Reviews",

data:[positive,negative,neutral]

}]

}

}

);

}

search.onkeyup=show;

filter.onchange=show;

show();

}

/* pdf */

function downloadPDF(){

const {jsPDF}=window.jspdf;

const doc=new jsPDF();

doc.text(
"Customer Review Report",
20,
20
);

let y=40;

reviews.forEach(r=>{

doc.text(
r.name+" "+r.sentiment,
20,
y
);

y+=10;

});

doc.save("report.pdf");

}
