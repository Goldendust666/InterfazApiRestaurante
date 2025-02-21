async function cargarHoras() {
  const horasDisponibles = ["12:00", "14:00", "16:00", "18:00", "20:00"];
  const horaSelect = document.getElementById("hora");

  horasDisponibles.forEach(hora => {
    const option = document.createElement("option");
    option.value = hora;
    option.innerText = hora;
    horaSelect.appendChild(option);
  });
}

async function cargarMesas() {
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const response = await fetch(`http://localhost:8080/mesas/disponibles?fecha=${fecha}&hora=${hora}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    }
  });

  const mesas = await response.json();
  const mesaSelect = document.getElementById("mesa");
  mesaSelect.innerHTML = ""; // Limpiar mesas previas

  mesas.forEach(mesa => {
    const option = document.createElement("option");
    option.value = mesa.id;
    option.innerText = `Mesa ${mesa.numeroMesa}`;
    mesaSelect.appendChild(option);
  });
}

async function hacerReserva() {
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;
  const comensales = document.getElementById("comensales").value;
  const mesa = document.getElementById("mesa").value;

  try {
    const response = await fetch("http://localhost:8080/reservas", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fecha, hora, comensales, mesa
      })
    });

    if (!response.ok) {
      alert("Error al hacer la reserva");
      throw new Error("Error al hacer la reserva");
    }

    alert("Reserva realizada con éxito");
  } catch (error) {
    console.error("Error:", error);
  }
}

document.getElementById("reservarBtn").addEventListener("click", hacerReserva);
document.getElementById("fecha").addEventListener("change", cargarMesas);
document.getElementById("hora").addEventListener("change", cargarMesas);

cargarHoras(); // Cargar las horas al inicio
