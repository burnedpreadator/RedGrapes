const selected = document.querySelector(".selected");
const Timeline = document.querySelector(".Timeline");
const optionsContainer = document.querySelector(".budget-container");
const TimelineContainer = document.querySelector(".Timeline-container");

const BudgetList = document.querySelectorAll(".option-budget");
selected.addEventListener("click", () =>{
  optionsContainer.classList.toggle("active");
});
const TimelineList = document.querySelectorAll(".option-Timeline");
Timeline.addEventListener("click", () =>{
  TimelineContainer.classList.toggle("active");
});

BudgetList.forEach( o => {
  o.addEventListener("click", () =>{
    selected.innerHTML = o.querySelector("label").innerHTML;
    optionsContainer.classList.remove("active");
});
});

TimelineList.forEach( o => {
    o.addEventListener("click", () =>{
        Timeline.innerHTML = o.querySelector("label").innerHTML;
        TimelineContainer.classList.remove("active");
    });
});

const contactForm = document.querySelector('.contact-form');
let firstname = document.getElementById('first-name');
let lastname = document.getElementById('last-name');
let email = document.getElementById('email');
let website = document.getElementById('website');
let phone = document.getElementById('phone');
let company = document.getElementById('company');
let projectdesc = document.getElementById('project-description');

contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let formData = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        website: website.value,
        phone: phone.value,
        company: company.value,
        projectdesc: projectdesc.value,
        selected: selected.innerHTML,
        Timeline: Timeline.innerHTML
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.onload = function(){
      console.log(xhr.responseText);
      if(xhr.responseText == 'success'){
        firstname.value = '',
        lastname.value = '',
        email.value = '',
        website.value = '',
        phone.value = '',
        company.value = '',
        projectdesc.value = '',
        selected.innerHTML = 'Budget',
        Timeline.innerHTML = 'Timeline'
      }
      else{
        alert('something went wrong!')
      }
    }
    xhr.send(JSON.stringify(formData));
})