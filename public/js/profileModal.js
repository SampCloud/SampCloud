document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Profile Modal JS imported successfully!");
  },
  false
);

// document.getElementById('button').addEventListener("click", function() {
// 	document.querySelector('.modal-bg').style.display = "flex";
// });

// document.querySelector('.close').addEventListener("click", function() {
// 	document.querySelector('.modal-bg').style.display = "none";
// });

let modalButtons = [...document.querySelectorAll(".button")];
modalButtons.forEach(function (button) {
  button.onclick = function () {
    let modal = button.getAttribute('data-modal');
    document.getElementById(modal).style.display = "block";
  }
});

let closeButtons = [...document.querySelectorAll(".close")];
closeBtns.forEach(function (button) {
  button.onclick = function () {
    let modal = button.closest('.modal');
    modal.style.display = "none";
  }
});

window.onclick = function (event) {
  if (event.target.className === "modal") {
    event.target.style.display = "none";
  }
}





// document.querySelector('.close').addEventListener("click", function() {
// 	document.querySelector('.modal-bg').style.display = "none";
// });

