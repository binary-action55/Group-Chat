const chatMessageForm = document.querySelector('#chatMessageForm');
const chatMessageInput = document.querySelector('#chatMessageInput');

chatMessageForm.addEventListener('submit',async (e)=>{
    e.preventDefault();

    const message = chatMessageInput.value;
    const token = localStorage.getItem('userToken');
    try{
        const res = await axios.post('http://localhost:3000/chat',{message,token});   
    }
    catch(err){
        console.log(err);
    }
})