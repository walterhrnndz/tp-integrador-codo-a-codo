document.addEventListener("DOMContentLoaded", function() {
    var comprarTicketsButton1 = document.getElementById("btnComprar1");
    var comprarTicketsButton2 = document.getElementById("btnComprar2");
    var oradores = document.getElementById("modal-oradores");
    var btnAgregarOrador = document.getElementById("agregarOrador");

    if (comprarTicketsButton1) {
        comprarTicketsButton1.addEventListener("click", function (event) {
            event.preventDefault();
            cargarFormulario();
        });
    }

    if (comprarTicketsButton2) {
        comprarTicketsButton2.addEventListener("click", function (event) {
            event.preventDefault();
            cargarFormulario();
        });
    }

    if (oradores) {
        oradores.addEventListener("click", function (event) {
            event.preventDefault();
            cargarOradores();
        });
    }

    if (btnAgregarOrador) {
        btnAgregarOrador.addEventListener("click", function (event) {
            event.preventDefault();
            agregarOrador();
        });
    }

    function cargarFormulario() {
        fetch("formTicket.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById("formComprarTickets").innerHTML = data;

                var modal = new bootstrap.Modal(document.getElementById("ticketModal"));
                modal.show();

                asignarEventosFormulario();
            })
            .catch(error => console.error("Error al cargar el formulario: " + error));
    }

    function asignarEventosFormulario() {
        var cantidad = document.getElementById("cantidad");
        var categoria = document.getElementById("categoria");
        var btnResumen = document.getElementById("btnResumen");
        var btnBorrar = document.getElementById("btnBorrar");
        var totalHtml = document.getElementById("total-amount");

        if (btnBorrar) {
            btnBorrar.addEventListener("click", function (event) {
                event.preventDefault();
                resetFormulario(totalHtml);
            });
        }

        if (btnResumen) {
            btnResumen.addEventListener("click", function (event) {
                event.preventDefault();
                calcularTotal(cantidad, categoria, totalHtml);
            });
        }
    }

    function calcularTotal(cantidad, categoria, totalHtml) {
        const valorTicket = 200;
        const descuentoEstudiante = 80;
        const descuentoTrainee = 50;
        const descuentoJunior = 15;

        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const correo = document.getElementById("email").value;

        if (!nombre || !apellido || !correo || cantidad.value === "" || categoria.value === "-- Seleccionar categoría --") {
            totalHtml.textContent = "Por favor, complete todos los campos obligatorios.";
            return;
        }

        let total = cantidad.value * valorTicket;

        if (categoria.value.toLowerCase() === "estudiante") {
            total = total - (total * descuentoEstudiante / 100);
        } else if (categoria.value.toLowerCase() === "trainee") {
            total = total - (total * descuentoTrainee / 100);
        }else if (categoria.value.toLowerCase() === "junior") {
            total = total - (total * descuentoJunior / 100);
        }

        totalHtml.textContent = "Total a Pagar: $" + total;
    }

    function resetFormulario(totalHtml) {
        document.getElementById("nombre").value = "";
        document.getElementById("apellido").value = "";
        document.getElementById("email").value = "";
        document.getElementById("cantidad").value = "";
        document.getElementById("categoria").value = "-- Seleccionar categoría --";

        totalHtml.textContent = "Total a Pagar: $";
    }

    function cargarOradores() {
        fetch("tablaOradores.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById("tablaOradores").innerHTML = data;

                var modal = new bootstrap.Modal(document.getElementById("oradoresModal"));
                modal.show();
                traerTodosOradores();
            })
            .catch(error => console.error("Error al cargar los oradores: " + error));
    }

    function traerTodosOradores() {
        const url = "http://localhost:9094/orador/all";
        const bodyTablaOradores = document.getElementById("body-oradores");

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Agregar filas con datos de oradores
                data.forEach(orador => {
                    const row = document.createElement("tr");

                    row.innerHTML += `
                        <th scope="row">${orador.id}</th>
                        <td>${orador.nombre}</td>
                        <td>${orador.apellido}</td>
                        <td>${orador.tema}</td>
                        <td>
                            <button id="editarOrador_${orador.id}" type="button" class="btn btn-primary btn-sm">Editar</button>
                            <button id="eliminarOrador_${orador.id}" type="button" class="btn btn-danger btn-sm">Eliminar</button>
                        </td>
                `;
                    bodyTablaOradores.appendChild(row);

                    const btnEditarOrador = document.getElementById(`editarOrador_${orador.id}`);
                    const btnEliminarOrador = document.getElementById(`eliminarOrador_${orador.id}`);

                    btnEditarOrador.addEventListener("click", function (event) {
                        event.preventDefault();
                        editarOrador(orador.id);
                    });

                    btnEliminarOrador.addEventListener("click", function (event) {
                        event.preventDefault();
                        eliminarOrador(orador.id);

                        cargarOradores();
                    });
                });
            })
            .catch(error => console.error("Error al obtener todos los oradores:", error));
    }

    function agregarOrador() {
        const nombreOrador = document.getElementById("nombreOrador").value;
        const apellidoOrador = document.getElementById("apellidoOrador").value;
        const temaOrador = document.getElementById("info-charla").value;

        const url = "http://localhost:9094/orador/add";

        if (nombreOrador && apellidoOrador && temaOrador) {
            const payload = {
                nombre: nombreOrador,
                apellido: apellidoOrador,
                tema: temaOrador,
            };

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.text())
                .then(data => alert(data))
                .catch(error => alert(error));

            document.getElementById("nombreOrador").value = ""
            document.getElementById("apellidoOrador").value = ""
            document.getElementById("info-charla").value = "";
        } else {
            alert("Por favor, complete todos los campos del formulario.");
        }
    }

    function eliminarOrador(id) {
        const url = `http://localhost:9094/orador/delete/${id}`;

        fetch(url, {
            method: "DELETE",
        })
            .then(response => response.text())
            .then(data => alert(data))
            .catch(error => alert(error));
    }

    async function editarOrador(id) {
        const orador = await detailOrador(id);
        cargarModalEditar(orador);
    }

    function cargarModalEditar(orador) {
        fetch("formEditarOrador.html")
            .then(response => response.text())
            .then(data => {
                document.getElementById("modalDataOrador").innerHTML = data;

                var modal = new bootstrap.Modal(document.getElementById("containerDataModalOrador"));
                modal._element.style.backgroundColor = "rgba(10, 10, 10, 0.5)";
                modal._element.style.position = "absolute";
                modal._element.style.width = "100%";

                var containerModalOrador = document.getElementById("containerModalOrador");
                containerModalOrador.style.width = "100%";

                document.getElementById("detalleOradorNombre").value = orador.nombre;
                document.getElementById("detalleOradorApellido").value = orador.apellido;
                document.getElementById("detalleOradorTema").value = orador.tema;

                var btnGuardar = document.getElementById("btnGuardarEdicion");

                if (btnGuardar) {
                    btnGuardar.addEventListener("click", function (event) {
                        event.preventDefault();
                        guardarEdicion(orador.id);
                        modal.hide();
                        cargarOradores();
                    });
                }

                modal.show();
            })
            .catch(error => console.error("Error al cargar los oradores: " + error));
    }

    function guardarEdicion(orador) {
        const nombreOrador = document.getElementById("detalleOradorNombre").value;
        const apellidoOrador = document.getElementById("detalleOradorApellido").value;
        const temaOrador = document.getElementById("detalleOradorTema").value;

        const url = `http://localhost:9094/orador/edit`;

        if (nombreOrador && apellidoOrador && temaOrador) {
            const payload = {
                id: orador,
                nombre: nombreOrador,
                apellido: apellidoOrador,
                tema: temaOrador,
            };

            fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.text())
                .then(data => alert(data))
                .catch(error => alert(error));
        } else {
            alert("Por favor, complete todos los campos del formulario.");
        }
    }

    async function detailOrador(id) {
        const url = `http://localhost:9094/orador/detail/${id}`;

        try {
            const response = await fetch(url, {
                method: "GET",
            });

            if (!response.ok) {
                console.error("Error al obtener el orador:", response.statusText);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error("Error al obtener el orador:", error);
            return null;
        }
    }
});