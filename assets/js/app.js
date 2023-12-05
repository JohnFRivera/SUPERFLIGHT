//? Inicialización
let stDestinos = document.getElementById('stDestinos');
let txtCantidadPasajeros = document.getElementById('txtCantidadPasajeros');
let txtPesoMaleta = document.getElementById('txtPesoMaleta');
let ckEjecutiva = document.getElementById('ckEjecutiva');
let ckVIP = document.getElementById('ckVIP');
let contentTicket = document.getElementById('contentTicket');
let btnLiquidarTicket = document.getElementById('btnLiquidarTicket');
let lblErrorAlert = document.getElementById('errorAlert');

let sillaGlobal, totalCobroPorKilo, totalCobroPorSilla;

fetch('./assets/json/Ciudades.json')
    .then(Response => Response.json())
    .then(Data => {
        Data.map(Ciudad => {
            stDestinos.innerHTML += `
            <option value="${Ciudad.precio}" class="${Ciudad.nombre}">${Ciudad.nombre}  (${Ciudad.precio.toLocaleString('es-CO')})</option>
            `;
        });
    })

const CobroPorKilo = (Pago, pesoMaleta) => {
    if (pesoMaleta > 50) {
        totalCobroPorKilo = (15000 * (pesoMaleta - 50)).toLocaleString('es-CO');
        Pago+= (15000 * (pesoMaleta - 50));
    } else {
        totalCobroPorKilo = "No";
    }
    return Pago;
}

const CobroPorSilla = (Pago, boolEjecutiva, boolVIP) => {
    if (boolEjecutiva) {
        sillaGlobal = "Ejecutiva";
        totalCobroPorSilla = 20000;
    } else if (boolVIP) {
        sillaGlobal = "VIP";
        totalCobroPorSilla = 40000;
    } else {
        sillaGlobal = "Normal";
        totalCobroPorSilla = 0;
    }
    return (Pago + totalCobroPorSilla);
}

const PintarTicket = (destino, silla, pasajeros, pesoMaleta, total, totalCobroPorKilo) => {
    contentTicket.innerHTML = `
    <div class="row">
        <div class="col-3">
            <img src="./assets/media/logo_superflight.svg" class="w-100" alt="avion"
                style="transform: rotate(60deg);">
        </div>
        <div class="col">
            <h2 class="fw-bolder" id="lblDestino">CTR-${stDestinos.selectedOptions.item(0).className}</h2>
            <hr>
            <div class="row mb-3">
                <div class="col border-end border-danger">
                    <p class="text-center text-primary fs-6 fw-bold">Silla<br><span
                            class="text-black" id="lblSilla">${silla}</span></p>
                </div>
                <div class="col border-end border-danger">
                    <p class="text-center text-primary fs-6 fw-bold">Pasajeros<br><span
                            class="text-black" id="lblPasajeros">${pasajeros}</span></p>
                </div>
                <div class="col">
                    <p class="text-center text-primary fs-6 fw-bold">Peso Maleta<br><span
                            class="text-black" id="lblPesoMaleta">${pesoMaleta} Kg</span></p>
                </div>
            </div>
            <img src="./assets/media/codigo_barras.png" class="w-100" alt="" style="height: 50px;">
        </div>
    </div>
    <hr>
    <div class="row">
        <p class="mb-0"><span class="fw-semibold">Destino ${stDestinos.selectedOptions.item(0).innerText}:</span> ${destino.toLocaleString('es-CO')}</p>
        <p class="mb-0"><span class="fw-semibold">Más de 50 kilos:</span> ${totalCobroPorKilo}</p>
        <p class="mb-1"><span class="fw-semibold">Silla:</span> ${totalCobroPorSilla.toLocaleString('es-CO')}</p>
        <p class="text-white text-bg-dark fw-bold mb-0">Total: ${total.toLocaleString('es-CO')}</p>
    </div>
    `
}

const LiquidarTicket = () => {
    var Pago = parseInt(stDestinos.value);
    Pago*= parseInt(txtCantidadPasajeros.value);
    Pago = CobroPorKilo(Pago, parseInt(txtPesoMaleta.value));
    Pago = CobroPorSilla(Pago, ckEjecutiva.checked, ckVIP.checked);
    PintarTicket(parseInt(stDestinos.selectedOptions.item(0).value), sillaGlobal, txtCantidadPasajeros.value, txtPesoMaleta.value, Pago, totalCobroPorKilo);
}

//* EVENTOS

btnLiquidarTicket.addEventListener("click", (e) => {
    if (stDestinos.selectedOptions.item(0).innerText != 'Destino') {
        if (txtCantidadPasajeros.value > 0) {
            if (txtPesoMaleta.value > 0) {
                LiquidarTicket();
                lblErrorAlert.innerText = "";
            } else {
                lblErrorAlert.innerText = "Error: Falta asignar el Peso de la Maleta";
                txtPesoMaleta.focus();
            }
        } else {
            lblErrorAlert.innerText = "Error: Falta asignar la Cantidad de Pasajeros";
            txtCantidadPasajeros.focus();
        }
    } else {
        lblErrorAlert.innerText = "Error: Falta escoger un Destino";
        stDestinos.focus();
    }
})