async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  try {
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password, email })
    });

    if (!response.ok) {
      alert("Error al registrar");
      throw new Error("Error al registrar");
    }

    alert("Usuario registrado con éxito");
    window.location.href = "login.html"; // Redirige a la página de login
  } catch (error) {
    console.error("Error:", error);
  }
}

document.getElementById("registerBtn").addEventListener("click", register);
