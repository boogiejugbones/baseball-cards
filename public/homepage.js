document.addEventListener('DOMContentLoaded', () =>{
    fetch('/api/cards')
        .then(response => response.json())
        .then(cards =>{
            const container = document.getElementById("card-container");
            cards.forEach(card =>{
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card');
                cardDiv.innerHTML =`
                <h3>${card.playername}</h3>
                <p><strong>Team:<strong> ${card.team}</p>
                <p><strong>Position:<strong> ${card.position}</p>
                <p><strong>Year:<strong> ${card.year}</p>
                `;
                container.appendChild(cardDiv);
            });
        })
        .catch(error => console.error('Error fetching cards', error));
});