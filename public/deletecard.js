const popup = document.getElementById("popup");

window.openPopup = function(){
    popup.classList.add("open-popup");
};

window.closePopup = function(){
    popup.classList.remove("open-popup");
};