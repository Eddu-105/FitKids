document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".form-card form");
  if (!form) return;

  const API_URL = "/api/inscripciones_create";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, select");

    const nombre_padre = inputs[0].value.trim();
    const nombre_nino  = inputs[1].value.trim();
    const edad         = Number(inputs[2].value);
    const sede         = inputs[3].value;
    const email        = inputs[4].value.trim();

    if (!nombre_padre || !nombre_nino || !edad || !sede || !email) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const payload = {
      nombre_padre,
      nombre_nino,
      edad,
      sede,
      email,
      telefono: "" 
    };

    try {
      const btn = form.querySelector("button[type='submit']");
      btn.disabled = true;
      btn.textContent = "Enviando...";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        alert(data.error || "No se pudo enviar la inscripción.");
        return;
      }

      alert("Inscripción enviada correctamente");
      form.reset();

    } catch (err) {
      alert("Error de conexión. Intenta nuevamente.");
    } finally {
      const btn = form.querySelector("button[type='submit']");
      btn.disabled = false;
      btn.textContent = "Enviar inscripción";
    }
  });

});
