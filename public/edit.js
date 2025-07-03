const editForm = document.querySelector('#edit-form');
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type");

editForm.addEventListener("submit", function(e) {
    e.preventDefault();     //make sure page does not reload

    const data = {
    playername: document.getElementById("fname").value,
    team: document.getElementById("fteam").value,
    position: document.getElementById("fposition").value,
    year: document.getElementById("fyear").value,
    cardNumber: document.getElementById("fcard-number").value,
    type: "football"
    };

    fetch(`/api/cards/${id}?type=${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => {
        if(!response.ok) throw new Error("Failed to update");
        return response.json();
    })
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

const popup = document.getElementById("popup");     //for confirmation popup

window.openPopup = function(){
    popup.classList.add("open-popup");
};

window.closePopup = function(){
    popup.classList.remove("open-popup");
};

editForm.addEventListener("submit", function(e){
    document.getElementById("edit-form").reset();
});

function clearForm() {
    const form = document.getElementById("edit-form");
    form.reset();
    return false;
}