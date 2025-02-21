document.addEventListener("DOMContentLoaded", function () {
  const fechaInput = document.getElementById("fecha");
  const horaSelect = document.getElementById("hora");
  const comensalesSelect = document.getElementById("comensales");
  const mesaSelect = document.getElementById("mesa");
  const reservaBtn = document.getElementById("reservarBtn");

  // Deshabilitar opciones al inicio
  horaSelect.disabled = true;
  comensalesSelect.disabled = true;
  mesaSelect.disabled = true;
  reservaBtn.disabled = true;

  // Configurar fecha mínima (hoy o futura)
  const today = new Date().toISOString().split("T")[0];
  fechaInput.setAttribute("min", today);

  fechaInput.addEventListener("change", function () {
    resetSelect(horaSelect);
    resetSelect(comensalesSelect);
    resetSelect(mesaSelect);
    reservaBtn.disabled = true;

    if (fechaInput.value) {
      cargarHoras();
      horaSelect.disabled = false;
    }
  });

  horaSelect.addEventListener("change", function () {
    resetSelect(comensalesSelect);
    resetSelect(mesaSelect);
    reservaBtn.disabled = true;

    if (horaSelect.value) {
      comensalesSelect.disabled = false;
    }
  });

  comensalesSelect.addEventListener("change", function () {
    resetSelect(mesaSelect);
    reservaBtn.disabled = true;

    if (comensalesSelect.value) {
      cargarMesasDisponibles();
    }
  });

  mesaSelect.addEventListener("change", function () {
    reservaBtn.disabled = mesaSelect.value === "";
  });

  function resetSelect(selectElement) {
    selectElement.innerHTML = "<option value=''>Seleccione una opción</option>";
    selectElement.disabled = true;
  }

  async function cargarHoras() {
    resetSelect(horaSelect);
    horaSelect.disabled = false;

    const horasDisponibles = ["10:00","12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
    horasDisponibles.forEach(hora => {
      let option = document.createElement("option");
      option.value = hora;
      option.textContent = hora;
      horaSelect.appendChild(option);
    });
  }

  async function cargarMesasDisponibles() {
    resetSelect(mesaSelect);
    mesaSelect.disabled = true;
    reservaBtn.disabled = true;

    const fecha = fechaInput.value;  // YYYY-MM-DD
    const hora = horaSelect.value;   // HH:mm

    try {
      const response = await fetch(`http://localhost:8080/reservas/disponibles?fecha=${fecha}&hora=${hora}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Si es necesario
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener mesas disponibles: ${errorText}`);
      }

      const mesas = await response.json();
      if (mesas.length === 0) {
        alert("No hay mesas disponibles para la fecha y hora seleccionadas.");
        return;
      }

      mesas.forEach(mesa => {
        let option = document.createElement("option");
        option.value = mesa.id;
        option.textContent = `Mesa ${mesa.numeroMesa} - ${mesa.descripcion}`;
        mesaSelect.appendChild(option);
      });

      mesaSelect.disabled = false;
    } catch (error) {
      console.error("Error al obtener mesas disponibles:", error);
      alert("Error al obtener mesas: " + error.message);
    }
  }

  reservaBtn.addEventListener("click", async function () {
    const reserva = {
      fecha: `${fechaInput.value}T${horaSelect.value}:00`, // 🔹 Concatenamos fecha y hora
      comensales: parseInt(comensalesSelect.value, 10),
      mesaId: parseInt(mesaSelect.value, 10)
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reserva)
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // 🔹 Obtén el mensaje de error del backend
        throw new Error(`Error al realizar la reserva: ${errorMessage}`);
      }

      alert("Reserva realizada con éxito");
      location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  });

});
