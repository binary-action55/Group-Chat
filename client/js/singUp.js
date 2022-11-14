const sinUpForm = document.querySelector('#signUpForm');
const formErrorToast = document.querySelector('#formErrorToast');
const nameInput = document.querySelector('#nameInput');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const phoneNumberInput = document.querySelector('#phoneNumberInput');


function createFormErrorToast(message){
    const toast = document.createElement('div');
    toast.innerText = message;
    formErrorToast.appendChild(toast);
    setTimeout(()=>formErrorToast.removeChild(toast),2000);
}




document.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const userDetails = {
        name:nameInput.value,
        email:emailInput.value,
        password:passwordInput.value,
        phoneNumber:phoneNumberInput.value,
    }

    try{
        const res = await axios.post('http://localhost:3000/user/signup',userDetails);
        window.location.href = './login.html';
    }
    catch(err){
        console.log(err);
        if(err.response.data.isUniqueEmail===false){
            const message = 'User already exists, Please Login';
            createFormErrorToast(message);
        }
    }
})