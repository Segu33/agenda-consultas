document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const medico = document.getElementById("id_medico").value;
    const dni = document.getElementById("dni_paciente").value;

    // Validaciones básicas
    if (!fecha || !hora || !medico || !dni) {
      alert("Por favor, completá todos los campos.");
      e.preventDefault();
      return;
    }

    if (!/^\d{7,8}$/.test(dni)) {
      alert("El DNI debe tener entre 7 y 8 dígitos numéricos.");
      e.preventDefault();
      return;
    }

    const fechaIngresada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Solo fecha, sin hora

    if (fechaIngresada < hoy) {
      alert("La fecha del sobreturno no puede ser anterior a hoy.");
      e.preventDefault();
    }
  });
});
