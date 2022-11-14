const loginForm = document.querySelector('#loginForm');
const formErrorToast = document.querySelector('#formErrorToast');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const signUpButton = document.querySelector('#signUpButton');


function createFormErrorToast(message){
    const toast = document.createElement('div');
    toast.innerText = message;
    formErrorToast.appendChild(toast);
    setTimeout(()=>formErrorToast.removeChild(toast),2000);
}


signUpButton.addEventListener('click',()=>{
    window.location.href='./signUp.html';
})

document.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const userLoginDetails = {
        email:emailInput.value,
        password:passwordInput.value,
    }

    try{
        const res = await axios.post('http://localhost:3000/user/login',userLoginDetails);
        localStorage.setItem('userToken',res.data.token);
        alert("success login");
    }
    catch(err){
        console.log(err);
        if(err.response.data.isValidUser===false){
            const message = 'User Not Found';
            createFormErrorToast(message);
        }
        else if(err.response.data.isValidPassword===false){
            const message = 'User Not Authorized';
            createFormErrorToast(message);
        }
    }
})