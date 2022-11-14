const chatMessageForm = document.querySelector('#chatMessageForm');
const chatMessageInput = document.querySelector('#chatMessageInput');
const logoutButton = document.querySelector('#logoutButton');
const chatMessageSection = document.querySelector('#chatMessageSection');

async function createChatItemList(){
    const token = localStorage.getItem('userToken');
    try{
        const res = await axios.get('http://localhost:3000/chat',{headers:{authorization:token}});
        const chats = res.data.chatList;
        chatMessageSection.innerHTML='';
        for(let i=0;i<chats.length;i++){
            const chatItem = document.createElement('article');
            chatItem.classList.add('chatMessageItem');
            const background = i%2==0?'light':'dark';
            chatItem.classList.add(background);
            chatItem.innerText = chats[i].message;
            chatMessageSection.appendChild(chatItem);
        }
    }
    catch(err){
        console.log(err);
    } 
}

logoutButton.addEventListener('click',()=>{
    localStorage.setItem('userToken','');
    window.location.href='./login.html';
})

document.addEventListener('DOMContentLoaded',async ()=>{
    createChatItemList();
})

chatMessageForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const message = chatMessageInput.value;
    const token = localStorage.getItem('userToken');
    try{
        const res = await axios.post('http://localhost:3000/chat',{message},{headers:{authorization:token}});
        chatMessageForm.reset();
        createChatItemList();
    }
    catch(err){
        console.log(err);
    }
})