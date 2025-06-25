const footballForm = document.querySelector('#football-form');

form.addEventListener("submit", function(e) {
    e.preventDefault();     //make sure page does not reload

    const data = {
    playername: document.getElementById("fname").value,
    team: document.getElementById("fteam").value,
    position: document.getElementById("fposition").value,
    year: document.getElementById("fyear").value,
    cardNumber: document.getElementById("fcard-number").value,
    type: "football"
    //condition: document.getElementById("condition").value,
    //description: document.getElementById("description").value,
    };

    fetch('http://localhost:3000/api/cards', {
        method: 'POST',

        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => response.json())
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

form.addEventListener("submit", function(e){
    document.getElementById("form").reset();
});