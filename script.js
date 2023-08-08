const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");
const tipoSelect = document.getElementById("tipo");
const fechaCobroGroup = document.getElementById("fechaCobroGroup");
const identifierType = document.getElementById("identifierType");
const usernameLabel = document.getElementById("usernameLabel");

let formStepsNum = 0;

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
    updateSummary();
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum--;
    updateFormSteps();
    updateProgressbar();
  });
});

tipoSelect.addEventListener("change", (e) => {
  if (e.target.value === "certificado" || e.target.value === "diferido") {
    fechaCobroGroup.style.display = "block";
  } else {
    fechaCobroGroup.style.display = "none";
  }
});

// Event listener para cambiar la etiqueta del input de dirección
identifierType.addEventListener("change", function() {
  usernameLabel.textContent = identifierType.value;
});

function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("form-step-active") &&
      formStep.classList.remove("form-step-active");
  });

  formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
    if (idx < formStepsNum + 1) {
      progressStep.classList.add("progress-step-active");
    } else {
      progressStep.classList.remove("progress-step-active");
    }
  });

  const progressActive = document.querySelectorAll(".progress-step-active");

  progress.style.width =
    ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}

function updateSummary() {
  document.getElementById("summary-address").textContent = document.getElementById("username").value;
  document.getElementById("summary-monto").textContent = "$" + " " + document.getElementById("position").value;
  document.getElementById("summary-tipo").textContent = tipoSelect.options[tipoSelect.selectedIndex].text;
  document.getElementById("summary-fechaCobro").textContent = document.getElementById("fechaCobro").value;
}


document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault();  // Evitar el envío real del formulario

  // Primero mostramos el swal para ingresar la contraseña
  swal.fire({
      title: 'Ingresa tu contraseña',
      input: 'password',
      inputPlaceholder: 'Tu contraseña',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
  }).then((result) => {
      if (result.isConfirmed) {
          if (result.value === "lucho") {
              // Si la contraseña es correcta, mostrar el swal de "Emitiendo cheque..."
              swal.fire({
                  title: 'Emitiendo cheque...',
                  text: 'Por favor espera',
                  timer: 2000,
                  timerProgressBar: false,
                  allowOutsideClick: false,
                  showConfirmButton: false, // Esta línea elimina el botón "OK"
                  onBeforeOpen: () => {
                      swal.showLoading();
                  }
              }).then((timerResult) => {
                  if (timerResult.dismiss === swal.DismissReason.timer) {
                      swal.fire({
                          title: 'Éxito',
                          text: 'Cheque emitido con éxito',
                          icon: 'success'
                      }).then(() => {
                          // Una vez que se cierra el SweetAlert de éxito:
                          formStepsNum = 0;
                          updateFormSteps();
                          updateProgressbar();
                          document.querySelector("form").reset();
                          fechaCobroGroup.style.display = "none"; // Ocultar el campo "Fecha de cobro" si estaba visible
                          usernameLabel.textContent = "DNI"; // Restablecer el label a "DNI"
                      });
                  }
              });
          } else {
              // Si la contraseña es incorrecta, mostrar un mensaje de error
              swal.fire({
                  title: 'Error',
                  text: 'Contraseña incorrecta',
                  icon: 'error'
              });
          }
      }
  });
});