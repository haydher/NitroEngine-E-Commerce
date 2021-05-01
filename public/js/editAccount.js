const accountInput = document.querySelectorAll(".editAccount input")
const errMsg = document.querySelector(".errMessageContainer")
const resMessage = document.querySelector(".resError")
const editProfile = document.querySelector(".editAccountBtn")

editProfile?.addEventListener("click", (e)=>{

  let firstName, lastName, username, email, phone, validate = true
  
  accountInput.forEach(input => {
    let inputValue = input.value.replace(/ /g,'')

    if(inputValue == "" || inputValue == " "){
      input.style.borderColor = "red"
      validate = false
      showError(errMsg)
    }

    if(input.name == "firstName" && inputValue != "" ) firstName = inputValue
    if(input.name == "lastName" && inputValue != "" ) lastName = inputValue
    if(input.name == "username" && inputValue != "" ) username = inputValue.toLowerCase()
    if(input.name == "email" && inputValue != "" ) email = inputValue.toLowerCase()
    if(input.name == "phone" && inputValue != "" ) phone = inputValue
    

    if((input.name == "firstName" && inputValue != "" ) &&
      (input.name == "lastName" && inputValue != "" ) &&
      (input.name == "email" && inputValue != "" ) &&
      (input.name == "phone" && inputValue != "" )){
        input.style.borderColor = "#21273099"
        validate = true
      }

  });

  console.log("validate", validate)

  const url = "/account/edit"
  const item = {
    firstName,
    lastName,
    username,
    email,
    phone,
  }
  const options = {
    method: 'PUT', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item) 
  }
  if(validate){
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
      if(data.status == 500){
       resMessage.lastElementChild.innerHTML = data.message
       resMessage.lastElementChild.classList.add("errMessage")
       resMessage.lastElementChild.classList.remove("successMessage")
      } else if(data.status == 200) {
        resMessage.lastElementChild.innerHTML = data.message
        resMessage.lastElementChild.classList.remove("errMessage")
        resMessage.lastElementChild.classList.add("successMessage")
        setTimeout(() => {
          redirect: window.location.replace("../account") 
        }, 1000);
      }
    });
  }
  e.preventDefault()
})

const chngPassBtn = document.querySelector(".changePassword")
chngPassBtn.addEventListener("click", (e)=>{

  let currPass, newPass, confPass, validate = true, matched = false
  accountInput.forEach(input => {

    if(input.value == ""){
      input.style.borderColor = "red"
      validate = false
      showError(errMsg)
    }
    
    if(input.name == "password" && input.value != "" ) currPass = input.value
    if(input.name == "newPassword" && input.value != "" ) newPass = input.value
    if(input.name == "confirmPassword" && input.value != "" ) confPass = input.value
   

    if((input.name == "password" && input.value != "" ) ||
      (input.name == "newPassword" && input.value != "" ) ||
      (input.name == "confirmPassword" && input.value != "" )){
        input.style.borderColor = "#21273099"
        validate = true
    }

  });

  if(currPass === newPass && validate == true) passNotMatch(errMsg, "samePass")
  else if(newPass != confPass && validate == true) passNotMatch(errMsg, "show")
  else if(newPass === confPass && validate == true){
    passNotMatch(errMsg, "clear")
    matched = true
  } 

  const url = "/account/changePassword"
  const item = {
    currPass,
    newPass,
    confPass,
  }
  const options = {
    method: 'PUT', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item) 
  }

  if(validate && matched){
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
      if(data.status == 500 || data.status == 400){
       resMessage.lastElementChild.innerHTML = data.message
       resMessage.lastElementChild.classList.add("errMessage")
       resMessage.lastElementChild.classList.remove("successMessage")
      } else if(data.status == 200) {
        resMessage.lastElementChild.innerHTML = data.message
        resMessage.lastElementChild.classList.remove("errMessage")
        resMessage.lastElementChild.classList.add("successMessage")
        setTimeout(() => {
          redirect: window.location.replace("../account") 
        }, 1000);
      }
    });
  }
  e.preventDefault()
})

function passNotMatch(errMsg, status) {
 if(status == "show" || status == "samePass"){

  if(errMsg.lastElementChild == undefined || errMsg.lastElementChild == null){
      newPPlaceHolder = document.createElement("p")
      newPErr = document.createElement("p")
    
      newPErr.classList.add("errMessage")
      if(status == "samePass") newPErr.innerHTML = "New Password can not be same as old password"
      else newPErr.innerHTML = "Passwords did not match."
    
      errMsg.append(newPPlaceHolder)
      errMsg.append(newPErr)
      errMsg.classList.add("showOnce")
  
    }else {
      if(status == "samePass") newPErr.innerHTML = "New Password can not be same as old password"
      else newPErr.innerHTML = "Passwords did not match."
    }
  } else if(status == "clear"){
    errMsg.lastElementChild.classList.remove("errMessage")
    newPErr.innerHTML = ""
  }
  
}

function showError(errMsg){
  if(!errMsg.classList.contains("showOnce")){
    newPPlaceHolder = document.createElement("p")
    newPErr = document.createElement("p")
  
    newPErr.classList.add("errMessage")
    newPErr.innerHTML = "All Fields must have a value."
  
    errMsg.append(newPPlaceHolder)
    errMsg.append(newPErr)

    errMsg.classList.add("showOnce")
  } else {
    errMsg.lastElementChild.innerHTML = "All Fields must have a value."
  }
}
