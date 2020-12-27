$("document").ready(()=>{
    $("#manage").click(()=>{
        axios.get("/travel").then((response)=>{
            fillTravelListings(response);
        })
        
    })
})

const createCard = (data)=>{
    data.date_from = data.date_from.substring(0, 10);
    data.date_to = data.date_to.substring(0, 10);
    console.log(data)
    let container = $("#travel-listing-container");
    let innerContaner = $(`<div class="col s12 m12 l6 "></div>`);
    let card = $(` <div class="card waves-effect waves-light hoverable modal-trigger" ></div>`);

    let imageContainer = $(`<div class="card-image"></div>`);
    let image = $(`<img id="travel-img" src=./travel/${data.image_url}>`);
    imageContainer.append(image);
    
    let content = $(`<div class="card-content "></div>`);
    let title = $(`<span id="title" class="card-title">${data.title}</span>`);
    // let description = $(`<p id="description">${data.description}</p>`)
    content.append(title);
    // content.append(description);

    let action = $(`<div class="card-action "></div>`);
    let row = $(`<div class="row center "></div>`);
    let travelPeriod = $(`<p id="travel-period" class="grey-text col s6 left-align">${data.date_from} to ${data.date_to}</p>`);
    let price = $(`<p id="price" class="grey-text col s6 left-align">${data.price}</p>`);
    row.append(travelPeriod);
    row.append(price);
    action.append(row);

    card.append(imageContainer);
    card.append(content);
    card.append(action);
    card.click(()=>{
        window.localStorage.setItem("data",JSON.stringify(data));
        window.location.href = "/edit";
    })
    innerContaner.append(card);
    container.append(innerContaner);
    return true;
}

function fillTravelListings(results){
    let container = $("#travel-listing-container");
    container.empty();

    results.data.every(createCard);
}