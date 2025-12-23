document.addEventListener("DOMContentLoaded", () => {
const btnAddPolo = document.getElementById("btnAddPolo");
const poloImg = document.getElementById("poloImg");

if(!btnAddPolo || !poloImg) return;

const syncImg = () => {
    btnAddPolo.setAttribute("data-img", poloImg.getAttribute("src"));
};

syncImg();

document.querySelectorAll(".colores .color").forEach(b => {
    b.addEventListener("click", () => setTimeout(syncImg, 0));
});
});