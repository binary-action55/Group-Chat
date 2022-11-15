const chatMessageForm = document.querySelector('#chatMessageForm');
const chatMessageInput = document.querySelector('#chatMessageInput');
const logoutButton = document.querySelector('#logoutButton');
const chatMessageSection = document.querySelector('#chatMessageSection');

const CHAT_MESSAGE_LIMIT = 20;

async function createChatItemList(limit=-1){
    const items = localStorage.getItem('chats') || '[]';
    let localChats = JSON.parse(items);
    const token = localStorage.getItem('userToken');
    let timeOffset = localStorage.getItem('timeOffset') || new Date(0).toISOString();
    try{
        const res = await axios.get('http://localhost:3000/chat',{params:{timeOffset,limit},headers:{authorization:token}});
        const chats = res.data.chatList;
        if(chats.length!==0){
            const updatedChats = [...localChats,...chats];
            localStorage.setItem('timeOffset',updatedChats[updatedChats.length-1].time.toString());
            if(updatedChats.length>CHAT_MESSAGE_LIMIT){
                updatedChats.splice(0,chats.length);
                for(let i=0;i<chats.length;i++){
                    chatMessageSection.removeChild(chatMessageSection.firstElementChild);
                }
            }

            localStorage.setItem('chats',JSON.stringify(updatedChats));
            for(let i=0;i<chats.length;i++){
                const chatItem = document.createElement('article');
                chatItem.classList.add('chatMessageItem');
                chatItem.classList.add('light');
                chatItem.innerText = chats[i].message;
                chatMessageSection.appendChild(chatItem);
            }
        }
    }
    catch(err){
        console.log(err);
    } 
}

logoutButton.addEventListener('click',()=>{
    localStorage.setItem('userToken','');
    localStorage.setItem('timeOffset',new Date(0).toISOString());
    localStorage.setItem('chats','[]');
    window.location.href='./login.html';
})

document.addEventListener('DOMContentLoaded',async ()=>{
    localStorage.setItem('timeOffset',new Date(0).toISOString());
    localStorage.setItem('chats','[]');
    createChatItemList(10);
    setInterval(createChatItemList,7000);
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