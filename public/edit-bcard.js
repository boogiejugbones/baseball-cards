const editForm = document.querySelector('#edit-form');
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type");

const submitButton = editForm.querySelector('button[type="submit"]');
let originalCard ={};

console.log("Editing card id:", id);
console.log("Editing card type:", type);

editForm.addEventListener('submit', function(e){
    e.preventDefault();

    const updatedData = {};

    const playername = document.getElementById("bname").value.trim();
    const team = document.getElementById("bteam").value.trim();
    const position = document.getElementById("bposition").value;
    const year = document.getElementById("byear").value.trim();
    const cardNumber = document.getElementById("bcard-number").value.trim();

    if (playername !== originalCard.playername) updatedData.playername = playername;
    if (team !== originalCard.team) updatedData.team = team;
    if (position !== originalCard.position && position !== '(Select one)' && position !== '') updatedData.position = position;
    if (year != originalCard.year) updatedData.year= year;
    if (cardNumber != originalCard["card-number"]) updatedData["card-number"] = cardNumber;

    updatedData.type = 'baseball';

    if(Object.keys(updatedData).length <= 1){       //the type field will always be there
        alert("Please fill out at least one field to update");
        return;
    }

    fetch(`http://localhost:3000/api/cards/${id}?type=${type}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(updatedData),
    })
    .then(res => {
        if(!res.ok) throw new Error("Failed to update");
        return res.text();
    })
    .then(result => {
        console.log('Success:', result);
        openPopup();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update card. Please try again.');
    })
    .finally(() =>{
        submitButton.disabled = false;
        submitButton.textContent = 'Save Changes';
    })
});

const popup = document.getElementById("popup");     //for confirmation popup

window.openPopup = function(){
    popup.classList.add("open-popup");
};

window.closePopup = function(){
    popup.classList.remove("open-popup");
};

function clearForm() {
    const form = document.getElementById("edit-form");
    form.reset();
    return false;
}

window.addEventListener('DOMContentLoaded', () => {
    fetch(`http://localhost:3000/api/cards/${id}?type=${type}`)
    .then(res =>{
        if(!res.ok) throw new Error('Failed to fetch card data');
        return res.json();
    })
    .then(card =>{
        originalCard = card;
        document.getElementById("bname").value = card.playername || '';
        document.getElementById("bteam").value = card.team || '';
        document.getElementById("byear").value = card.year || '';
        document.getElementById("bposition").value = card.position || '';
        document.getElementById("bcard-number").value = card["card-number"] || '';
    })
    .catch(err => {
        console.error('Failed to load card for editing: ', err)
        alert('Could not load card data');
    });
});