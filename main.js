const myname = document.querySelector('.name-user');
const myemail = document.querySelector('.email-user');

//untuk sign in
function onSignIn(googleUser) {
    // get user profile information
    var profile = googleUser.getBasicProfile();
    var getNama = profile.getName();
    var getEmail = profile.getEmail();
    myname.innerHTML = getNama;
    myemail.innerHTML = getEmail;
    console.log(profile);
    console.log(getNama);
    console.log(getEmail);
    document.getElementById('form-box').style.display = 'block';
    document.getElementById('message-box').style.display = 'block';
    document.getElementById('btn-logout').style.display = 'block';
}
//untuk sign out
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    console.log(gapi.auth2);
    auth2.signOut().then(function() {
    alert("User signed out");
    })
    .catch(error => {console.log(error)});
    window.reload();
}




const listmessage = document.querySelector('.messagelist');
const addmessage = document.querySelector('.addMessage');
const messagevalue = document.getElementById('message-value');
const sendtovalue = document.getElementById('sendTo-value');
const btnSubmit = document.getElementById('btn-submit');
const url = 'http://localhost:8080/getallMessage';
let output = '';

//get read the message
const renderMessage = (getall) => {
    getall.forEach(get => {
        output += `
            <div class="card mt-3 me-3">
                <div class="card-body" data-id=${get.idMessage}>
                    <h5 class="card-title">Kepada :</h5>
                    <h6 class="card-subtitle mb-2 text-muted" id="sendTo">${get.sendTo}</h6>
                    <p class="card-text" id="message">${get.message}</p>
                    <button type="button" class="btn btn-warning" id="edit-post">Edit</button>
                    <button type="button" class="btn btn-danger" id="delete-post">Delete</button>
                </div>
            </div>
        `;
        listmessage.innerHTML = output;
    });
}
fetch(url)
.then(res => res.json())
.then(data => renderMessage(data));


//post message
addmessage.addEventListener('submit',(e) => {
    if(messagevalue.value == "" && sendtovalue.value == ""){
        alert("maaf message dan tujuan anda kosong");
    }else{
        e.preventDefault();
        fetch(url, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                message:messagevalue.value,
                sendTo:sendtovalue.value
            })
        })
        .then(res => res.json())
        .then(data => {
            const dataArray = [];
            dataArray.push(data);
            renderMessage(dataArray);
        })
        alert("data berhasil di tambahkan");
    }
    messagevalue.value = '';
    sendtovalue.value = '';

})

//edit and delete messaage
listmessage.addEventListener('click', (e) =>{
    e.preventDefault();
    let delbuttonPressed = e.target.id == 'delete-post';
    let editbuttonPressed = e.target.id == 'edit-post';
    let id = e.target.parentElement.dataset.id;
    //delete message method: DELETE
    if(delbuttonPressed){
        let check = "apakah anda yakin ingin menghapus ini ?";
        if(confirm(check) == true){
            fetch(`${url}/${id}`,{
                method:'DELETE',
            })
            .then(res => res.json())
            .then(() => window.reload())
            alert("message berhasil di hapus");
            
        }
    }
    //edit message method: PUT
    if(editbuttonPressed){
        const parent = e.target.parentElement;
        let messageContent = parent.querySelector('#message').textContent;
        let sendToContent = parent.querySelector('#sendTo').textContent;
        messagevalue.value = messageContent;
        sendtovalue.value = sendToContent;
    }

    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        fetch(`${url}/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message:messagevalue.value,
                sendTo:sendtovalue.value
            })
        })
        .then(res=>res.json())
        .then(() => location.reload());
    })
})




