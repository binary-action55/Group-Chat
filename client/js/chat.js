const chatMessageForm = document.querySelector('#chatMessageForm');
const chatMessageInput = document.querySelector('#chatMessageInput');
const logoutButton = document.querySelector('#logoutButton');


logoutButton.addEventListener('click',()=>{
    localStorage.setItem('userToken','');
    window.location.href='./login.html';
})

chatMessageForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const message = chatMessageInput.value;
    const token = localStorage.getItem('userToken');
    try{
        const res = await axios.post('http://localhost:3000/chat',{message,token});
        chatMessageForm.reset();
        alert('posted');
    }
    catch(err){
        console.log(err);
    }
})