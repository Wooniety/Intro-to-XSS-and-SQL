$(document).ready(() => {
    let data = JSON.parse(localStorage.getItem("data"));
    initListingDetails(data);

    $("#review-form").submit(() => {
        event.preventDefault();
        postReview(data.travel_id);
    })
})

function initListingDetails(data){

    // init basic details
    $("#travel-img").attr("src", `./travel/${data.image_url}`);
    $("#title").html(data.title);
    $("#travel-period").html(`${data.date_from} to ${data.date_to}`);
    $("#country").html(data.country);
    $("#description").html(data.description);
    $("#price").html(`SGD ${data.price}`);

    // init other details
    initItineraries(data.travel_id);
    initReviews(data.travel_id);
}

function postReview(travel_id){
    let content = $("#review-textarea").val();
    let rating = $("#rating-select").val()
    console.log(rating);
    if(content == "" || rating == null){
        $("#review-error-msg").html("Inputs cannot be empty!");
    }else{
        $("#review-error-msg").html();

        let body = new FormData();
        body.append("content", content);
        body.append("rating", rating);
        axios.post(`/travel/${travel_id}/review`, body, {headers: {"Content-Type": "multipart/form-data"}}).then((resp) => {
            M.toast({html: 'Review Added!'})

            initReviews(travel_id);
        })
    }
}

function initItineraries(travel_id){
    let container = $("#itinerary-container");
    container.empty();

    const createActivityCard = (data) => {
        
        let cardCode = `<div class="col s12 m6">
        <div class="card blue-grey darken-1" style="margin-left: 0; margin-right: 0;">
          <div class="card-content white-text">
            <span class="card-title">Day ${data.day}</span>
            <p>${data.activity}</p>
          </div>
        </div>
      </div>`
        container.append(cardCode);
        return true;
    }

    axios.get(`/travel/${travel_id}/itinerary`).then((resp) => {
        resp.data.every(createActivityCard);
    })
}

function initReviews(travel_id){
    let container = $("#reviews-container");
    container.empty();

    const createReviewCard = (data) => {
        let ratingCode = "";
        for(let i = 0; i < 5; i ++){
            if(i < data.rating) ratingCode += `<span class="fas fa-star checked"></span>`;
            else ratingCode += `<span class="fas fa-star"></span>`;
        }
        console.log(data.profile_pic_url);

        let date = data.created_at.substring(0, 10);
        let time = data.created_at.substring(11, 19);

        let cardCode = `<div class="col s12 left-align">
        <div class="card horizontal review-card" style="margin-left: 0;">
          <div class="card-image user-img" style="background-image: url('/images/${data.profile_pic_url}.jpg');">
          </div>
          <div class="card-stacked">
            <div class="card-content">
              <h6><span class="blue-text">${data.username}</span> Says</h6>
              <p>${data.content}</p>
            </div>
            <div class="card-action">
              <div class="rating">
                ${ratingCode}
              </div>
              <div>
                <p class="grey-text">${date} ${time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;

      container.prepend(cardCode);
      return true;
    }

    axios.get(`/travel/${travel_id}/review`).then((resp) => {
        console.log(resp);
        resp.data.every(createReviewCard);
    })
}
