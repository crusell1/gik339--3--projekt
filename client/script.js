//Uppgift 4 - Skapa variabler, 4 olika DOM-funktioner

const checkbox = document.querySelector("#divStyle"); //querySelector

const textfields = document.getElementsByClassName("textfield"); //getElementsByClassName

const button = document.getElementById("button"); //getElementById

const divelement = document.getElementsByTagName("div")[1]; //getElementsByTagName

//Uppgift 5 - Skapa en fördefinierad funktion

function input(e) {
  //Skriver ut vilket fält som triggat eventet t.ex. "content" eller "color"
  console.log("Target:", e.target);

  //Skapa variabel fieldName och sparar target.name
  const fieldName = e.target.name;
  console.log("Field name:", fieldName);

  //Om fältet är 'content'
  if (fieldName === "content") {
    //Skriv ut värdet i div-elementet
    divelement.innerHTML = e.target.value;
  }
}

//Uppgift 6 - Koppla eventlyssnare

//när värdet i checkboxen ändras så triggas eventet change och funktionen körs.
checkbox.addEventListener("change", function () {
  //skapar colorvalue när färgboxen får ett value t.ex. "red"
  const colorValue = textfields[0].value;

  //hämtar div och använder .style för att ändra bakrundsfärgen i CSS till den färgen som skrevs i colorValue
  divelement.style.backgroundColor = colorValue;
});

//Loopar igenom textfälten och lyssnar på varje input som skrivs in
for (let i = 0; i < textfields.length; i++) {
  textfields[i].addEventListener("input", input);
}

//eventlyssnare osm tar bort diven vid "click"
button.addEventListener("click", function () {
  divelement.remove();
});
