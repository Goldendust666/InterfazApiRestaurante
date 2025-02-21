async function cargarReservas() {
  try {
    const response = await fetch("http://localhost:8080/reservas/mis-reservas", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      alert("Error al cargar reservas");
      throw new Error("Error en la carga de reservas");
    }

    const reservas = await response.json();
    const tabla = document.getElementById("reservasTableBody");
    tabla.innerHTML = ""; // Limpiar contenido previo

    reservas.forEach(reserva => {
      const fila = document.createElement("tr");

      fila.innerHTML = `
                <td>${reserva.id}</td>
                <td>${reserva.fecha}</td>
                <td>${reserva.hora}</td>
                <td>${reserva.comensales}</td>
                <td>Mesa ${reserva.mesa.numeroMesa}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="cancelarReserva(${reserva.id})">Cancelar</button>
                </td>
            `;

      tabla.appendChild(fila);
    });

  } catch (error) {
    console.error("Error:", error);
  }
}

async function cancelarReserva(reservaId) {
  if (!confirm("¿Seguro que deseas cancelar esta reserva?")) return;

  try {
    const response = await fetch(`http://localhost:8080/reservas/${reservaId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      alert("Error al cancelar reserva");
      throw new Error("Error en la cancelación");
    }

    alert("Reserva cancelada con éxito");
    cargarReservas(); // Recargar la tabla
  } catch (error) {
    console.error("Error:", error);
  }
}

// Cargar reservas al inicio
cargarReservas();
