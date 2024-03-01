const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWUxYTA0YTRjNTllYzAwMTk5MGQ3MDgiLCJpYXQiOjE3MDkyODU0NTAsImV4cCI6MTcxMDQ5NTA1MH0.uoHW10kWiRtWcVDvDu-N9rH54ErS5DSzmtzxceY7kQY";

// prendo il valore di resourceId dalla barra dell'url.
const resourceId = new URLSearchParams(window.location.search).get("resourceId");

const H1 = document.querySelector("h1");
const previewImage = document.getElementById("preview-image");
const nameField = document.getElementById("name");
const descriptionField = document.getElementById("description");
const brandField = document.getElementById("brand");
const imageUrlField = document.getElementById("imageUrl");
const priceField = document.getElementById("price");
const submitButton = document.getElementById("submitButton");
const deleteButton = document.getElementById("deleteButton");
const confirmModalButton = document.getElementById("confirmModalButton");
const resetFieldsButton = document.getElementById("resetFields");
const alertBox = document.getElementById("alert-box");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");

// Se il valore è presente  il metodo diventa put, unisco l'endPoint con resourceID
if (resourceId) {
  method = "PUT";
  URL = endPoint + resourceId;
  fillFieldByResourceId(); // applico la funzione per riempirlo
  submitButton.classList.add("btn-warning"); //colore bottone
  submitButton.innerHTML = "Salva modifica"; //testo del bottone
  H1.innerHTML = "Modifica un articolo"; //h1
} else {
  //in caso contrario il metodo diventa post per la creazione
  method = "POST";
  URL = endPoint; //l'URL diventa il valore dell'endpoint
  submitButton.classList.add("btn-primary");
  submitButton.innerHTML = "Crea";
  H1.innerHTML = "Inserisci un nuovo articolo";
  deleteButton.classList.add("d-none");
  resetFieldsButton.classList.add("d-none");
}

// prevent default per non far aggiornare la pagina
// handleRequest crea l'oggetto per convertirlo in json
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  handleRequest();
});
//per cancellare con conferma
deleteButton.addEventListener("click", () => {
  handleModal(
    "Conferma delete",
    "Alla conferma l'oggetto verrà eliminato dal server",
    "Sì, cancellalo",
    "danger",
    handleDelete
  );
});
//per resettare i campi
resetFieldsButton.addEventListener("click", () => {
  handleModal(
    "Conferma reset campi",
    "Alla conferma i campi verranno resettati",
    "Sì, resettali",
    "primary",
    emptyFields
  );
});

// handleRequest crea l'oggetto per convertirlo in json
function handleRequest() {
  //creating Obj to convert in JSON
  const newItem = {
    name: nameField.value,
    description: descriptionField.value,
    brand: brandField.value,
    imageUrl: imageUrlField.value,
    price: priceField.value,
  };
  //fetch

  fetch(URL, {
    method,
    // converte l'oggetto in json e lo inserisce nel body
    body: JSON.stringify(newItem),
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      console.log(response);
      //se response.ok è false  inserisce nel throw il valore di response.status es(404)
      if (!response.ok) throw response.status;

      return response.json();
    })
    .then((item) => showAlert(item._id, method, item.imageUrl))
    .catch((error) => {
      // nel caso di erroe parte la funzione showAlertError
      showAlertError(error);
    });
}

//funzione con metodo delete
function handleDelete() {
  fetch(URL, {
    method: "DELETE",
    headers: { Authorization: token },
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) throw response.status;

      return response.json();
    })
    .then((deletedObj) => {
      showAlert(deletedObj._id, "DELETE", deletedObj.imageUrl);

      setTimeout(() => {
        window.location.assign("./index.html");
      }, 3000);
    })
    .catch((error) => {
      showAlertError(error);
    });
}

// funzione per prendere il prodotto e inserire di nuovo i suoi dati
function fillFieldByResourceId() {
  fetch(URL, {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) throw response.status;

      return response.json();
    })
    .then((returnedObj) => {
      const name = returnedObj.name;
      const description = returnedObj.description;
      const brand = returnedObj.brand;
      const imageUrl = returnedObj.imageUrl;
      const price = returnedObj.price;
      const id = returnedObj._id;

      previewImage.innerHTML = `
						<img
							src="${imageUrl}"
							class="img-thumbnail mx-auto d-block my-4"
							alt="..."
							style="max-height: 200px"
						/>`;
      nameField.value = name;
      descriptionField.value = description;
      brandField.value = brand;
      imageUrlField.value = imageUrl;
      priceField.value = price;
    })
    .catch((error) => {
      // nel caso di errroe parte la funzione showAlertError
      showAlertError(error);
    });
}
//funzione per resettare i campi
function emptyFields() {
  nameField.value = "";
  descriptionField.value = "";
  brandField.value = "";
  imageUrlField.value = "";
  priceField.value = "";
}
//modale di conferma
function handleModal(
  title = "Conferma azione",
  body = "Sei sicuro?",
  textButtonConfirm = "Conferma",
  colorButtonConfirm = "primary",
  functionToAdd
) {
  modalTitle.innerHTML = title;
  modalBody.innerHTML = body;
  confirmModalButton.innerHTML = textButtonConfirm;
  confirmModalButton.className = "btn btn-" + colorButtonConfirm;

  confirmModalButton.addEventListener("click", (event) => {
    functionToAdd();
  });
}

function showAlert(id, methodType, url) {
  switch (methodType) {
    case "POST":
      colorCode = "success";
      action = "creato";
      break;
    case "PUT":
      colorCode = "warning";
      action = "modificato";
      break;
    case "DELETE":
      colorCode = "danger";
      action = "eliminato";
      break;
    default:
      colorCode = "secondary";
      break;
  }

  alertBox.innerHTML = `<div class="alert alert-${colorCode} p-5" role="alert">
	L'item con ID ${id} è stato <span class="fs-3">${action}</span>
	</div>`;

  previewImage.innerHTML = `
	<img
		src="${url}"
		class="img-thumbnail mx-auto d-block my-4"
		alt="..."
		style="max-height: 200px"
	/>`;

  setTimeout(() => {
    window.location.href = "./backoffice.html";
  }, 3000);
}

function showAlertError(errorCode) {
  switch (errorCode) {
    case 404:
      message = "Risorsa non trovata.";
      break;
    case 401:
      message = "Non sei autorizzato.";
      break;
    case 400:
      message = "Inserisci tutti i campi";
      break;
    default:
      message = "Errore con codice non definito";
      break;
  }

  alertBox.innerHTML = `
	<div class="alert alert-danger p-5" role="alert">
	    <p class="fs-1"201>${message}</p>
		<p>Codice errore: ${errorCode}</p>
	</div>`;
}
