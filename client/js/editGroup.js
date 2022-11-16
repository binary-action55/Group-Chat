const editGroupForm = document.querySelector('#editGroupForm');
const groupNameInput = document.querySelector('#groupNameInput');
const userListInput = document.querySelector('#userListInput');
const logoutButton = document.querySelector('#logoutButton');
const removeUserListInput = document.querySelector('#removeUserListInput');

async function createAddableUserList(groupId){
    const token = localStorage.getItem('userToken');
    try{
        const res  = await axios.get('http://localhost:3000/group/getEditAddableUsers',{params:{groupId},headers:{authorization:token}});
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

async function createRemovableUserList(groupId){
    const token = localStorage.getItem('userToken');
    try{
        const res  = await axios.get('http://localhost:3000/group/getEditRemovableUsers',{params:{groupId},headers:{authorization:token}});
        for(let user of res.data.users){
            const option = document.createElement('option');
            option.setAttribute('value',user.id);
            option.setAttribute('class','groupRemovableUserOption');
            option.innerText=user.name;
            removeUserListInput.appendChild(option);
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

editGroupForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    const groupName = groupNameInput.value;
    const userIds = [...userListInput.selectedOptions].map(option=>+option.value)
    const removeUserIds = [...removeUserListInput.selectedOptions].map(option=>+option.value);
    console.log(userIds);
    try{
        const res = await axios.post('http://localhost:3000/group/edit',{groupName,userIds,removeUserIds},{headers:{authorization:token}});
        window.location.href='./chat.html';
    }
    catch(err){
        console.log(err);
    }
});

document.addEventListener('DOMContentLoaded',async ()=>{
    const params = new URLSearchParams(window.location.href);
    const groupId = +params.get(groupId);
    createAddableUserList(groupId);
    createRemovableUserList(groupId);
})

