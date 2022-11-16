const chatMessageForm = document.querySelector('#chatMessageForm');
const chatMessageInput = document.querySelector('#chatMessageInput');
const logoutButton = document.querySelector('#logoutButton');
const chatMessageSection = document.querySelector('#chatMessageSection');
const createGroupButton  = document.querySelector('#createGroupButton');
const groupList = document.querySelector('#groupList');
const groupNameHeading = document.querySelector('#groupNameHeading');
const groupListRefreshButton = document.querySelector('#groupListRefreshButton');
const fileUploadForm = document.querySelector('#fileUploadForm');

const CHAT_MESSAGE_LIMIT = 20;

let myTimer;

async function createChatItemList(limit=-1){
    const items = localStorage.getItem('chats') || '[]';
    const groupDetails  = localStorage.getItem('group');
    const {groupId} = JSON.parse(groupDetails || '{}');
    if(groupId==null)
        return;
    let localChats = JSON.parse(items);
    const token = localStorage.getItem('userToken');
    let timeOffset = localStorage.getItem('timeOffset') || new Date(0).toISOString();
    try{
        const res = await axios.get('http://localhost:3000/chat',{params:{timeOffset,limit,groupId},headers:{authorization:token}});
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
                if(chats[i].type==='file'){
                    chatItem.innerHTML= `<span>${chats[i].author}: <a href=${chats[i].link}>${chats[i].link}</a></span>`;
                }
                else{
                    chatItem.innerText = chats[i].message;
                }
                chatMessageSection.appendChild(chatItem);
            }
        }
    }
    catch(err){
        console.log(err);
    } 
}

function createGroupListItem(group){
    const item = document.createElement('li');
    item.classList.add('groupListItem');
    item.dataset.id=group.id;
    item.dataset.name=group.name;
    
    item.innerHTML=`
        <span class='groupListItemName'>Name:${group.name}</span>
        <span class='groupListItemMemberCount'>Member Count:${group.memberCount}</span>
    `;
    if(group.isAdmin){
        item.innerHTML+=`<button class='editGroupButton' id='editGroupButton'>Edit Group</button>`;    
    }
    item.innerHTML+=`<button class='leaveGroupButton' id='leaveGroupButton'>Leave Group</button>`;
    groupList.appendChild(item);
}

async function createGroupItemList(){
    groupList.innerHTML='';
    const token = localStorage.getItem('userToken');
    try{
        const res = await axios.get('http://localhost:3000/group/userGroups',{headers:{authorization:token}});
        const groupList = res.data.groupList;
        for(let group of groupList){
            createGroupListItem(group);
        }
    }
    catch(err){
        console.log(err);
    }
}

function createGroupNameHeading(){
    const {groupName} = JSON.parse(localStorage.getItem('group') || '{}');
    groupNameHeading.innerHTML=groupName; 
}

function resetLocalParameters(){
    localStorage.setItem('timeOffset',new Date(0).toISOString());
    localStorage.setItem('chats','[]');
    localStorage.setItem('group','{}');
    chatMessageSection.innerHTML='';
    groupNameHeading.innerHTML='';
}

function switchGroup(groupId,groupName){
    resetLocalParameters();
    localStorage.setItem('group',JSON.stringify({groupId,groupName}));
    clearInterval(myTimer);
    createGroupNameHeading();
    createChatItemList(10);
    myTimer = setInterval(createChatItemList,90000);
}

async function leaveGroup(groupId,groupListItem){
    const token = localStorage.getItem('userToken');
    try{
        await axios.delete(`http://localhost:3000/group/leaveGroup/${groupId}`,{headers:{authorization:token}});
        groupList.removeChild(groupListItem);
        const {currentGroupId} = JSON.parse(localStorage.getItem('group')||'{}');
        if(currentGroupId===groupId)
            resetLocalParameters();
        alert('Left Group');
    }
    catch(err){
        console.log(err);
    }
}

fileUploadForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const token = localStorage.getItem('userToken');
    const {groupId} = JSON.parse(localStorage.getItem('group') || '{}');
    if(groupId==null){
        alert('Group not selected');
        return;
    }
    const formData = new FormData(fileUploadForm);
    formData.append('groupId',groupId);
    try{
        const res = await axios.post('http://localhost:3000/chat/uploadFile',formData,{
            headers: {
                'Content-Type': 'multipart/form-data',
                authorization:token,
            },
        });
        fileUploadForm.reset();
        createChatItemList();
        alert("file uploaded");
    }
    catch(err){
        console.log(err);
    }
})

groupListRefreshButton.addEventListener('click',()=>{
    createGroupItemList();
})

groupList.addEventListener('click',(e)=>{
    const item = e.target;
    if(item.classList.contains('groupListItem')){
        const groupId = item.dataset.id;
        const groupName = item.dataset.name;
        switchGroup(groupId,groupName);
    }
    else if(item.classList.contains('editGroupButton')){
        const groupListItem = item.parentElement;
        const groupId = groupListItem.dataset.id;
        const groupName = groupListItem.dataset.name;
        window.location.href=`./editGroup.html?groupId=${groupId}&groupName=${groupName}`;
    }
    else if(item.classList.contains('leaveGroupButton')){
        const groupListItem = item.parentElement;
        const groupId = groupListItem.dataset.id;
        leaveGroup(groupId,groupListItem);
    }
});

createGroupButton.addEventListener('click',()=>{
    window.location.href='./createGroup.html';
})

logoutButton.addEventListener('click',()=>{
    localStorage.setItem('userToken','');
    resetLocalParameters();
    window.location.href='./login.html';
})

document.addEventListener('DOMContentLoaded',async ()=>{
    resetLocalParameters();
    createGroupItemList();
})

chatMessageForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const message = chatMessageInput.value;
    const token = localStorage.getItem('userToken');
    const {groupId} = JSON.parse(localStorage.getItem('group') || '{}');
    if(groupId==null){
        alert('Group not selected');
        return;
    }
    try{
        await axios.post('http://localhost:3000/chat',{message,groupId},{headers:{authorization:token}});
        chatMessageForm.reset();
        createChatItemList();
    }
    catch(err){
        console.log(err);
    }
})