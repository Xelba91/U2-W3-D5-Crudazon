const endPoint = "https://striveschool-api.herokuapp.com/api/product/";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWUxYTA0YTRjNTllYzAwMTk5MGQ3MDgiLCJpYXQiOjE3MDkyODU0NTAsImV4cCI6MTcxMDQ5NTA1MH0.uoHW10kWiRtWcVDvDu-N9rH54ErS5DSzmtzxceY7kQY";

const alertBox = document.getElementById("alert-box");
const previewImage = document.getElementById("preview-image");

// fetch
fetch(endPoint, {
  headers: {
    Authorization: token,
  },
})
  .then((response) => {
    console.log(response);
    if (!response.ok) throw response.status;
    return response.json();
  })
  .then((catalog) => {
    catalog.forEach((item) => {
      const name = item.name;
      const description = item.description;
      const brand = item.brand;
      const imageUrl = item.imageUrl;
      const price = item.price;
      const id = item._id;

      const catalogContainer = document.getElementById("catalog");
      const cardItem = document.createElement("div");
      cardItem.classList.add("col-6", "col-md-3", "card-group");
      // card-img-top per mettere un immagine al top della card
      cardItem.innerHTML = ` 
            <div class="card mt-4">
					<img src="${imageUrl}" class="card-img-top" alt="immagine ${name}" style="height: 200px ; object-fit:contain" />
					<div class="card-body d-flex flex-column justify-content-between">
                    <div>
                    <h5 class="card-title">${name}</h5>
                    <span class="badge bg-success mb-2 ">${price} €</span>
						<p class="card-text">
							${description}
						</p>
                    </div>
                        <div class="d-flex flex-column justify-content-between align-items-baseline">    
                            <div class="text-center">
                                <a href="./product_details.html?resourceId=${id}" class="btn btn-primary mt-2">Scopri di più</a>
                              
                                <a href="./backoffice.html?resourceId=${id}" class="btn btn-secondary px-4 mt-2">Modifica</a>
                            </div>
                        </div>    
					</div>
				</div>`;
      //riga 45 - 46:
      //"scopri di piu"  quando verra premuto porterà alla pagina product_details, inserendo nella barra dell URL di windows anche l'id del prodotto in cui si trova, mentre  modifica porterà alla pagina backoffice sempre con l 'id del prodotto.
      catalogContainer.appendChild(cardItem);
    });
  })
  .catch((error) => {
    showAlertError(error);
  });

//funzione  con switch per mostrare gli errori in base al codice ricevuto

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
