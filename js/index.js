function logout() {
  localStorage.removeItem("token");  // Eliminar el token
  location.href = "login.html"; // Redirigir al login
}
