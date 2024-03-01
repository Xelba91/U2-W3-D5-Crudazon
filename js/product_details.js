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
const alertBox = document.getElementById("alert-box");

URL = endPoint + resourceId;
fillFieldByResourceId();

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
      console.log(returnedObj);
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
							style="max-height: 400px"
						/>`;
      nameField.value = name;
      descriptionField.value = description;
      brandField.value = brand;
      imageUrlField.value = imageUrl;
      priceField.value = price;
    })
    .catch((error) => {
      showAlertError(error);
    });
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
