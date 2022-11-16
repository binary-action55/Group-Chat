const createGroupForm = document.querySelector('#createGroupForm');
const groupNameInput = document.querySelector('#groupNameInput');
const userListInput = document.querySelector('#userListInput');
const logoutButton = document.querySelector('#logoutButton');

async function createAddableUserList(){
    const token = localStorage.getItem('userToken');
    try{
        const res  = await axios.get('http://localhost:3000/group/getAddableUsers',{headers:{authorization:token}});
        for(let user of res.data.users){
            const option = document.createElement('option');
            option.setAttribute('value',user.id);
            option.setAttribute('class','groupAddableUserOption');
            option.innerText=user.name;
            userListInput.appendChild(option);
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

createGroupForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    const groupName = groupNameInput.value;
    const userIds = [...userListInput.selectedOptions].map(option=>+option.value)
    console.log(userIds);
    try{
        const res = await axios.post('http://localhost:3000/group',{groupName,userIds},{headers:{authorization:token}});
        window.location.href='./chat.html';
    }
    catch(err){
        console.log(err);
    }
});

document.addEventListener('DOMContentLoaded',async ()=>{
    createAddableUserList();
})

