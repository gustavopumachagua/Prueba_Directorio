const tableData = {
  ["ALTA DIRECCIÓN"]: [],
  ["DIRECCIÓN GENERAL DE ADMINISTRACIÓN"]: [],
  ["DIRECCIONES DE ESCUELA PROFESIONAL"]: [],
  ["DIRECTORES DE DEPARTAMENTOS ACÁDEMICOS DE LAS FACULTADES"]: [],
  ["DIRECTORES DE UNIDADES DE INVESTIGACIÓN"]: [],
  ["DIRECTORES DE UNIDADES DE POSGRADO"]: [],
  ["FACULTADES - DECANATOS Y MESAS DE PARTE"]: [],
  ["LIBRO DE RECLAMACIONES"]: [],
  ["ÓRGANOS ADMINISTRATIVOS - APOYO"]: [],
  ["ÓRGANOS ADMINISTRATIVOS - ASESORAMIENTO"]: [],
  ["ÓRGANOS DE LÍNEA DEL VICERRECTORADO ACADÉMICO"]: [],
  ["ÓRGANOS DE LÍNEA DEL VICERRECTORADO DE INVESTIGACIÓN"]: [],
  ["ÓRGANOS ESPECIALES"]: [],
};

// Función para cargar archivos Excel y almacenarlos en tableData
function loadFile(url, key) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      tableData[key] = XLSX.utils.sheet_to_json(sheet);
      console.log(`Loaded data for ${key}:`, tableData[key]);
    })
    .catch((error) =>
      console.error(`Error loading ${key} from ${url}:`, error)
    );
}

// Función para mostrar las opciones de selección según el tipo de directorio
function showOptions(type) {
  const select = document.getElementById("options");
  select.style.display = "block";
  select.innerHTML = "";

  if (type === "dependencia") {
    select.innerHTML = `
      <option value="" disabled selected>Seleccione</option>
      <option value="ALTA DIRECCIÓN">ALTA DIRECCIÓN</option>
      <option value="DIRECCIÓN GENERAL DE ADMINISTRACIÓN">DIRECCIÓN GENERAL DE ADMINISTRACIÓN</option>
      <option value="LIBRO DE RECLAMACIONES">LIBRO DE RECLAMACIONES</option>
      <option value="ÓRGANOS ADMINISTRATIVOS - APOYO">ÓRGANOS ADMINISTRATIVOS - APOYO</option>
      <option value="ÓRGANOS ADMINISTRATIVOS - ASESORAMIENTO">ÓRGANOS ADMINISTRATIVOS - ASESORAMIENTO</option>
      <option value="ÓRGANOS DE LÍNEA DEL VICERRECTORADO ACADÉMICO">ÓRGANOS DE LÍNEA DEL VICERRECTORADO ACADÉMICO</option>
      <option value="ÓRGANOS DE LÍNEA DEL VICERRECTORADO DE INVESTIGACIÓN">ÓRGANOS DE LÍNEA DEL VICERRECTORADO DE INVESTIGACIÓN</option>
      <option value="ÓRGANOS ESPECIALES">ÓRGANOS ESPECIALES</option>
    `;
  } else if (type === "facultad") {
    select.innerHTML = `
      <option value="" disabled selected>Seleccione</option>
      <option value="FACULTADES - DECANATOS Y MESAS DE PARTE">FACULTADES - DECANATOS Y MESAS DE PARTE</option>
      <option value="DIRECCIONES DE ESCUELA PROFESIONAL">DIRECCIONES DE ESCUELA PROFESIONAL</option>
      <option value="DIRECTORES DE DEPARTAMENTOS ACÁDEMICOS DE LAS FACULTADES">DIRECTORES DE DEPARTAMENTOS ACÁDEMICOS DE LAS FACULTADES</option>
      <option value="DIRECTORES DE UNIDADES DE POSGRADO">DIRECTORES DE UNIDADES DE POSGRADO</option>
      <option value="DIRECTORES DE UNIDADES DE INVESTIGACIÓN">DIRECTORES DE UNIDADES DE INVESTIGACIÓN</option>
    `;
  }
}

// Función para mostrar la tabla con datos según la selección
function showTable() {
  const resultsSection = document.querySelector(".results-section");
  const searchSection = document.querySelector(".search-section");
  const select = document.getElementById("options");
  const selectedOption = select.value;

  const table = document
    .getElementById("results-table")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = "";

  const data = tableData[selectedOption];

  if (data.length === 0) {
    alert("No hay datos disponibles para la opción seleccionada");
    return;
  }

  data.forEach((item) => {
    const row = table.insertRow();
    addCell(row, "APELLIDOS Y NOMBRES", item["APELLIDOS Y NOMBRES"]);
    addCell(row, "CARGO", item.CARGO);
    addCell(row, "SIGLA", item.SIGLA);
    addCell(row, "RESOL.", item["RESOL."]);
    addCell(row, "TELF. FIJO", item["TELF. FIJO"]);
    addCell(row, "CORREO INSTITUCIONAL", item["CORREO INSTITUCIONAL"]);
    addCell(row, "CORREOS GENERAL", item["CORREOS GENERAL"]);
    addCell(row, "ANEXO", item.ANEXO);
  });

  // Actualizar el título de la tabla
  document.getElementById("table-title").innerText = selectedOption;

  searchSection.style.display = "none";
  resultsSection.style.display = "block";
}

// Función para agregar celdas con data-label
function addCell(row, label, text) {
  const cell = row.insertCell();
  cell.innerText = text || "";
  cell.setAttribute("data-label", label);
}

// Función para buscar por criterios
function searchByCriteria() {
  const resultsSection = document.querySelector(".results-section");
  const searchSection = document.querySelector(".search-section");

  const nombre = document.getElementById("nombre").value.trim().toLowerCase();
  const apellido = document
    .getElementById("apellido")
    .value.trim()
    .toLowerCase();
  const anexo = document.getElementById("anexo").value.trim();

  if (!nombre && !apellido && !anexo) {
    alert("Por favor, complete al menos un campo de búsqueda");
    return;
  }

  const table = document
    .getElementById("results-table")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = "";

  const allData = [
    ...tableData["ALTA DIRECCIÓN"],
    ...tableData["DIRECCIÓN GENERAL DE ADMINISTRACIÓN"],
    ...tableData["DIRECCIONES DE ESCUELA PROFESIONAL"],
    ...tableData["DIRECTORES DE DEPARTAMENTOS ACÁDEMICOS DE LAS FACULTADES"],
    ...tableData["DIRECTORES DE UNIDADES DE INVESTIGACIÓN"],
    ...tableData["DIRECTORES DE UNIDADES DE POSGRADO"],
    ...tableData["FACULTADES - DECANATOS Y MESAS DE PARTE"],
    ...tableData["LIBRO DE RECLAMACIONES"],
    ...tableData["ÓRGANOS ADMINISTRATIVOS - APOYO"],
    ...tableData["ÓRGANOS ADMINISTRATIVOS - ASESORAMIENTO"],
    ...tableData["ÓRGANOS DE LÍNEA DEL VICERRECTORADO ACADÉMICO"],
    ...tableData["ÓRGANOS DE LÍNEA DEL VICERRECTORADO DE INVESTIGACIÓN"],
    ...tableData["ÓRGANOS ESPECIALES"],
  ];

  console.log("Datos cargados para la búsqueda:", allData);

  const filteredData = allData.filter((item) => {
    const nombreCompleto = item["APELLIDOS Y NOMBRES"]
      ? item["APELLIDOS Y NOMBRES"].toLowerCase().split(" ")
      : [];
    const nombreValido = nombre
      ? nombreCompleto.some((n) => n.startsWith(nombre))
      : true;
    const apellidoValido = apellido
      ? nombreCompleto.some((a) => a.startsWith(apellido))
      : true;
    const anexoValido = anexo
      ? item.ANEXO && item.ANEXO.toString().includes(anexo)
      : true;
    return nombreValido && apellidoValido && anexoValido;
  });

  console.log("Resultados filtrados:", filteredData);

  if (filteredData.length === 0) {
    alert("No se encontraron resultados");
    return;
  }

  filteredData.forEach((item) => {
    const row = table.insertRow();
    row.insertCell(0).innerText = item["APELLIDOS Y NOMBRES"] || "";
    row.insertCell(1).innerText = item.CARGO || "";
    row.insertCell(2).innerText = item.SIGLA || "";
    row.insertCell(3).innerText = item["RESOL."] || "";
    row.insertCell(4).innerText = item["TELF. FIJO"] || "";
    row.insertCell(5).innerText = item["CORREO INSTITUCIONAL"] || "";
    row.insertCell(6).innerText = item["CORREOS GENERAL"] || "";
    row.insertCell(7).innerText = item.ANEXO || "";
  });

  // Actualizar el título de la tabla
  document.getElementById("table-title").innerText = "Resultado de búsqueda";

  searchSection.style.display = "none";
  resultsSection.style.display = "block";
}

// Función para realizar una nueva consulta
function newQuery() {
  const searchSection = document.querySelector(".search-section");
  const resultsSection = document.querySelector(".results-section");
  searchSection.style.display = "block";
  resultsSection.style.display = "none";

  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("anexo").value = "";
  document.getElementById("options").style.display = "none";
}

async function printTable() {
  const resultsSection = document.querySelector(".results-section");
  const tableTitle = document.getElementById("table-title").innerText;

  // Crear una nueva ventana para la impresión
  const printWindow = window.open("", "_blank", "width=800,height=600");

  // Crear contenido HTML para la nueva ventana
  const printContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Imprimir Directorio Telefónico</title>
    <style>
        /* Reset CSS básico */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: "Roboto", sans-serif;
            margin: 0;
            padding: 20px;
        }
        .print-header {
            text-align: center;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .print-header img {
            margin-right: 10px;
        }
        .print-header h2 {
            font-size: 16px;
        }
        .table-title {
            text-align: center;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 16px;
        }
        .table-wrapper {
            overflow-x: auto;
            width: 100%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 4px;
            text-align: center;
            font-weight: normal;
        }
        th {
            background-color: #000;
            color: #ffffff;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        @media print {
            .print-header img {
                display: block;
            }
            .print-header h2 {
                margin: 0;
            }
            .table-title {
                margin-bottom: 15px;
                font-size: 14px;
            }
            .table-wrapper {
                overflow: visible;
            }
            table, th, td {
                border-color: #000;
            }
            table {
                page-break-inside: avoid;
                width: 100%;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            th, td {
                font-size: 8px;
                padding: 2px;
            }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <img src="/vite.svg" alt="Logo" width="50">
        <h2>Directorio Telefónico UNMSM</h2>
    </div>
    <div class="table-title">${tableTitle}</div>
    <div class="table-wrapper">
        <table class="table table-bordered">
            ${resultsSection.querySelector("table").innerHTML}
        </table>
    </div>
    <script>
        window.onload = function() {
            window.print();
            window.close();
        }
    </script>
</body>
</html>
  `;

  // Escribir el contenido HTML en la nueva ventana
  printWindow.document.write(printContent);
  printWindow.document.close();
}

// Cargar los archivos Excel al inicio
loadFile("/D_ALTA DIRECCIÓN.xlsx", "ALTA DIRECCIÓN");
loadFile(
  "/D_DIRECCIÓN GENERAL DE ADMINISTRACIÓN.xlsx",
  "DIRECCIÓN GENERAL DE ADMINISTRACIÓN"
);
loadFile(
  "/D_DIRECCIONES DE ESCUELA PROFESIONAL.xlsx",
  "DIRECCIONES DE ESCUELA PROFESIONAL"
);
loadFile(
  "/D_DIRECTORES DE DEPARTAMENTOS ACÁDEMICOS DE LAS FACULTADES.xlsx",
  "DIRECTORES DE DEPARTAMENTOS ACÁDEMICOS DE LAS FACULTADES"
);
loadFile(
  "/D_DIRECTORES DE UNIDADES DE INVESTIGACIÓN.xlsx",
  "DIRECTORES DE UNIDADES DE INVESTIGACIÓN"
);
loadFile(
  "/D_DIRECTORES DE UNIDADES DE POSGRADO.xlsx",
  "DIRECTORES DE UNIDADES DE POSGRADO"
);
loadFile(
  "/D_FACULTADES  -   DECANATOS Y MESAS DE PARTE.xlsx",
  "FACULTADES - DECANATOS Y MESAS DE PARTE"
);
loadFile("/D_LIBRO DE RECLAMACIONES.xlsx", "LIBRO DE RECLAMACIONES");
loadFile(
  "/D_ÓRGANOS ADMINISTRATIVOS - APOYO.xlsx",
  "ÓRGANOS ADMINISTRATIVOS - APOYO"
);
loadFile(
  "/D_ÓRGANOS ADMINISTRATIVOS - ASESORAMIENTO.xlsx",
  "ÓRGANOS ADMINISTRATIVOS - ASESORAMIENTO"
);
loadFile(
  "/D_ÓRGANOS DE LÍNEA DEL VICERRECTORADO ACADÉMICO.xlsx",
  "ÓRGANOS DE LÍNEA DEL VICERRECTORADO ACADÉMICO"
);
loadFile(
  "/D_ÓRGANOS DE LÍNEA DEL VICERRECTORADO DE INVESTIGACIÓN.xlsx",
  "ÓRGANOS DE LÍNEA DEL VICERRECTORADO DE INVESTIGACIÓN"
);
loadFile("/D_ÓRGANOS ESPECIALES.xlsx", "ÓRGANOS ESPECIALES");

// Asignar las funciones al objeto `window` para que sean accesibles globalmente
window.showOptions = showOptions;
window.showTable = showTable;
window.searchByCriteria = searchByCriteria;
window.printTable = printTable;
window.newQuery = newQuery;
