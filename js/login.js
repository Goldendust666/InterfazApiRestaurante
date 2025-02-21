async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      alert("Usuario o contraseña incorrectos");
      throw new Error("Error en la autenticación");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Guardar token
    location.href = "index.html"; // Redirigir a la página principal

  } catch (error) {
    console.error("Error:", error);
  }
}

document.getElementById("loginBtn").addEventListener("click", login);
