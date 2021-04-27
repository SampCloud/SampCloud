document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Profile Modal JS imported successfully!");
  },
  false
);

document.getElementById('button').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "flex";
});

document.getElementById('button2').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "flex";
});

document.querySelector('.close').addEventListener("click", function() {
	document.querySelector('.bg-modal').style.display = "none";
});

