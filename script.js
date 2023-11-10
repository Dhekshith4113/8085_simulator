let textTop = document.getElementById(
 "lcdTop");
let textBottom = document.getElementById(
 "lcdBottom");

textBottom.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("myBtn").click();
  }
});

function enter() {
 textTop.innerHTML = textBottom.value;
 console.log(textBottom.value);
}

function reset() {
 textTop.innerHTML = "MENU: A,D,M,F,";
 textBottom.value = "C,G,S,R,I,E,P";
}
