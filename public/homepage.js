document.addEventListener('DOMContentLoaded', () =>{
    fetch('/api/cards')
        .then(response => response.json())
        .then(cards =>{
            const container = document.getElementById("card-container");
            cards.forEach(card =>{
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card');

                const popupId = `popup-${card.id}`; //unique popup id for each card

                cardDiv.innerHTML =`
                <head>
                    <link rel="stylesheet" href="styles.css">
                </head>
                <h3>${card.playername}</h3>
                <p><strong>Team:<strong> ${card.team}</p>
                <p><strong>Position:<strong> ${card.position}</p>
                <p><strong>Year:<strong> ${card.year}</p>
                <button type="button" class="individual-del" data-id="${card.id}">Delete</button>
                    <div class="popup" id="${popupId}">
                        <h2>Card deleted.</h2>
                        <button type="button" class="close-btn">OK</button>
                    </div>
                `;
                container.appendChild(cardDiv);

                const deleteButton = cardDiv.querySelector('.individual-del');
                const popup = cardDiv.querySelector('.popup');
                const closeBtn = cardDiv.querySelector('.close-btn');

                deleteButton.addEventListener('click', (e) => {
                    e.preventDefault();

                fetch(`api/cards/${card.id}`,{
                    method: 'DELETE',
                })
                .then(response =>{
                    if(response.ok){
                        popup.classList.add("open-popup")
                    }else{
                        alert("Failed to delete card");
                    }
                })
                .catch(error =>{
                    console.error("Error deleting card", error);
                    alert("Something went wrong");
                });
                });

                closeBtn.addEventListener('click', () => {
                    popup.classList.remove("open-popup");
                    cardDiv.remove();
                });
            });
        })
        .catch(error => console.error('Error fetching cards', error));
});
