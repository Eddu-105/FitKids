let colorPolo = "Negro";

function cambiarPolo(color){
  const img = document.getElementById("poloImg");

  if(color === "negro"){
    img.src = "../img/Polo_Negro_Fitkids.jpeg";
    colorPolo = "Negro";
  } else if(color === "azul"){
    img.src = "../img/Polo_Azul_Fitkids.jpeg";
    colorPolo = "Azul";
  }

  document.querySelectorAll(".color").forEach(btn => {
    btn.classList.remove("activo");
  });
  document.querySelector(`.color.${color}`).classList.add("activo");
}