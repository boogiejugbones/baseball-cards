const form = document.querySelector('form');

form.addEventListener("submit", function(e) {
    e.preventDefault();     //make sure page does not reload

    const data = {
    playername: document.getElementById("name").value,
    team: document.getElementById("team").value,
    position: document.getElementById("position").value,
    year: document.getElementById("year").value,
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