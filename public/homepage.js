document.addEventListener('DOMContentLoaded', () =>{
    const container =document.getElementById("card-container");
    let pendingDelete = {id: null, type: null, cardDiv: null};
    let pendingEdit = {id: null, type: null, cardDiv: null};

    const confirmPopup = document.getElementById("confirm-delete");
    console.log("confirmPopup is", confirmPopup);
    const confirmYes = document.getElementById("confirm-yes");
    const confirmNo = document.getElementById("confirm-no");

    const successPopup = document.getElementById("success-popup");
    const successClose = document.getElementById("success-close");

    fetch('/api/cards')
        .then(response => response.json())
        .then(cards =>{
            if(!Array.isArray(cards)){
                throw new Error("Cards data is not in array");
            }

            cards.forEach(card =>{
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card');

                cardDiv.innerHTML = `
                    <div class="${card.type}">
                        <h3 class="name">${card.playername}</h3>
                        <p><strong>Team:</strong> ${card.team}</p>
                        <p><strong>Position:</strong> ${card.position}</p>
                        <p><strong>Year:</strong> ${card.year}</p>
                        <div class="individual-id" data-id="${card["card-number"]}">${card["card-number"]}</div>
                        <button type="button" class="individual-del" data-id="${card.id}" data-type="${card.type}">Delete</button>
                        <button type="button" class="individual-edit" data-id="${card.id}" data-type="${card.type}">Edit</button>
                    </div>
                    `;

                container.appendChild(cardDiv);

                const deleteButton = cardDiv.querySelector('.individual-del');
                const editButton = cardDiv.querySelector('.individual-edit')

                deleteButton.addEventListener('click', () =>{
                    console.log("Delete button clicked");   //debug
                    pendingDelete.id = deleteButton.getAttribute('data-id');
                    pendingDelete.type = deleteButton.getAttribute('data-type');
                    pendingDelete.cardDiv = cardDiv;
                    confirmPopup.classList.add('open-popup');
                });

                editButton.addEventListener('click', () =>{
                    console.log("Edit button clicked"); //debug
                    const id = editButton.getAttribute('data-id');
                    const type = editButton.getAttribute('data-type');
                    if(type === 'baseball'){
                        window.location.href =`/edit-bcard.html?id=${id}&type=${type}`;
                    }else{
                        window.location.href =`/edit-fcard.html?id=${id}&type=${type}`;
                    }
                })
            });
        })
        .catch(error => console.error('Error fetching cards', error));

confirmYes.addEventListener('click', () =>{
    if(!pendingDelete.id || !pendingDelete.type) return;

    fetch(`/api/cards/${pendingDelete.id}?type=${pendingDelete.type}`, {
        method: 'DELETE',
    })
    .then(response =>{
        if(response.ok){
            pendingDelete.cardDiv.remove();

            confirmPopup.classList.remove('open-popup');
            successPopup.classList.add('open-popup');
        }else{
            alert('Failed to delete card');
        }
    })
    .catch(error =>{
        console.error('Error deleting card', error);
        alert('Something went wrong');
    });
});

confirmNo.addEventListener('click', () =>{
    confirmPopup.classList.remove('open-popup');
});

successClose.addEventListener('click', () =>{
    successPopup.classList.remove('open-popup');
});
});

const search = document.getElementById('search-icon')
const input = document.getElementById('search-input')

search.addEventListener('click', () =>{
    const playername = input.value.trim();

    const url =`/api/card?playername=${encodeURIComponent(playername)}`;

    fetch(url)
        .then (res => res.json())

})
