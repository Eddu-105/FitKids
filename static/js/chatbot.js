document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("sideChatOpen");
    const closeBtn = document.getElementById("sideChatClose");
    const overlay = document.getElementById("sideChatOverlay");
    const sideChat = document.getElementById("sideChat");

    const body = document.getElementById("sideChatBody");
    const input = document.getElementById("sideChatInput");
    const send = document.getElementById("sideChatSend");

    const respuestas = [
    { keys: ["qué es", "fitkids", "que es"], msg: "FitKids es bienestar físico infantil con entrenamiento pre-operacional: juego, coordinación y movimiento seguro." },
    { keys: ["edad", "edades"], msg: "Trabajamos con niños desde los 4 años a 12 años." },
    { keys: ["ubicación", "ubicacion", "sede", "direccion", "dirección"],
        msg: `Estamos en Arequipa. Aquí puedes ver más información 👇
            <div class="chat-media">
            <a class="chat-cardlink" href="/sedes">
                <img src="static/img/like_Fitkids.jpg" alt="Like_FitKids">
                <div>
                <strong>Ver nuestras sedes</strong>
                <span>Conoce dónde nos puedes encontrar</span>
                </div>
            </a>
            </div>` },
    { keys: ["horario", "horarios", "atencion", "atención"], msg: "Nuestros horarios varían según la sede. Escríbenos por WhatsApp para más detalles 📅" },
    { keys: ["precio", "precios", "costo", "cuanto cuesta", "tarifa"], msg: "Los precios dependen del programa y la sede. Contáctanos y te damos la información completa 💬" },
    { keys: ["inscripción", "inscripcion", "matricula", "registrar", "inscribirme"], 
        msg: `Puedes inscribir a tu niño fácilmente aquí 👇
        <div class="chat-media">
            <a class="chat-cardlink" href="/inscripciones">
                <img src="/static/img/inscripcion_fitkids.jpg" alt="Inscripción FitKids">
                <div>
                    <strong>Formulario de inscripción</strong>
                    <span>Inscríbete en pocos minutos</span>
                </div>
            </a>
        </div>` },
    { keys: ["tienda", "productos", "ropa", "polos", "comprar"], 
        msg: `Tenemos productos oficiales FitKids 👕
        <div class="chat-media">
            <a class="chat-cardlink" href="/tienda">
                <img src="/static/img/tienda_fitkids.jpg" alt="Tienda FitKids">
                <div>
                    <strong>Ir a la tienda</strong>
                    <span>Ver productos disponibles</span>
                </div>
            </a>
        </div>` },
    { keys: ["beneficios", "ventajas", "porque fitkids", "por qué fitkids"], msg: "FitKids mejora la coordinación, fuerza, resistencia y confianza de los niños mediante el juego y el movimiento." },
    { keys: ["contacto", "whatsapp", "telefono", "teléfono", "llamar"], msg: "Puedes contactarnos por WhatsApp al 📞 +51 953 721 560. ¡Estamos para ayudarte!" },
    { keys: ["gracias", "ok", "genial", "perfecto"], msg: "¡Con gusto! 😊 Si tienes otra pregunta, aquí estoy." },
    { keys: ["hola", "buenas", "hey", "buenos dias", "buenas tardes"], msg: "¡Hola! 👋 Soy el asistente de FitKids. ¿En qué puedo ayudarte?" }
    ];

    function agregarBurbuja(text, who){
        const div = document.createElement("div");
        div.className = "bubble " + who;
        div.innerHTML = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    function responder(text){
        const t = text.toLowerCase();
        for(const r of respuestas){
            if(r.keys.some(k => t.includes(k))) 
            return r.msg;
        }
        return "Prueba con: “qué es FitKids” o “edades”.";
    }

    function enviarTexto(txt){
        const text = (txt ?? input.value).trim();
        if(!text) return;
        agregarBurbuja(text, "user");
        input.value = "";
        setTimeout(() => agregarBurbuja(responder(text), "bot"), 150);
    }

    function abrir(){
        sideChat.classList.add("open");
        overlay.hidden = false;
        sideChat.setAttribute("aria-hidden", "false");
        openBtn.setAttribute("aria-expanded", "true");
        setTimeout(() => input.focus(), 50);
    }

    function cerrar(){
        sideChat.classList.remove("open");
        overlay.hidden = true;
        sideChat.setAttribute("aria-hidden", "true");
        openBtn.setAttribute("aria-expanded", "false");
    }

    openBtn.addEventListener("click", abrir);
    closeBtn.addEventListener("click", cerrar);
    overlay.addEventListener("click", cerrar);

    send.addEventListener("click", () => enviarTexto());
    input.addEventListener("keydown", (e) => {
        if(e.key === "Enter") enviarTexto();
    });

    document.querySelectorAll(".sidechat .qbtn").forEach(btn => {
        btn.addEventListener("click", () => enviarTexto(btn.getAttribute("data-q")));
    });

    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape" && sideChat.classList.contains("open")) cerrar();
    });
});