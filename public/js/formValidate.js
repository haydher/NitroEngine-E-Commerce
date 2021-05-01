const formInput = document.querySelectorAll("form input")
const formSelect = document.querySelector("form select")
const submitBtn = document.querySelector(".submit")
const errMessage = document.querySelector(".errMessage p")

submitBtn.addEventListener("click",(e)=>{
 let errMessage = document.querySelector(".errMessageContainer")
 
 formInput.forEach(input => {
 
  let inputValue = input.value.replace(/ /g,'')

  if(inputValue.length > 0) input.style.borderColor = "#21273099"
  else if(inputValue == "" || inputValue== " ") {
   input.style.borderColor = "red"
   showError(errMessage)
   e.preventDefault()
  }

 });
})

function showError(errMessage, errCode){
 if(errCode == "phone" && !errMessage.classList.contains("phoneErr")){
  newP = document.createElement("p")
  errMessage.classList.add("errMessage")
  errMessage.classList.add("phoneErr")
  newP.innerHTML = "<br/>Please enter a valid number. It must be all numbers and and 10 digits long."
  errMessage.append(newP)
 }
 if(errMessage.id != ("showOnce")){
  newP = document.createElement("p")
  errMessage.classList.add("errMessage")
  errMessage.id = "showOnce"
  newP.innerHTML = "Please fill the missing fields."
  errMessage.append(newP)
 }
}
