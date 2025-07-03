const editForm = document.querySelector('#edit-form');
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type");

console.log("Editing card id:", id);
console.log("Editing card type:", type);

editForm.addEventListener('submit', function(e){
    e.preventDefault();

    const data = {
    playername: document.getElementById("fname").value,
    team: document.getElementById("fteam").value,
    position: document.getElementById("fposition").value,
    year: document.getElementById("fyear").value,
    "card-number": document.getElementById("fcard-number").value,
    type: "football"
    };

    fetch(`http://localhost:3000/api/cards/${id}?type=${type}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(res => {
        if(!res.ok) throw new Error("Failed to update");
        return res.text();
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