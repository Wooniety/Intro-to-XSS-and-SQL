$("document").ready(()=>{
    const createItineraryRow = (data)=>{
        let row = $('<tr class="created"></tr>');
        let day = $(`<td>${data.day}</td>`);
        let activity = $(`<td>${data.activity}</td>`);
        row.append(day);
        row.append(activity);
        $("#data").prepend(row);
    }
    let travelData =  JSON.parse(localStorage.getItem("data"))
    fill_form(travelData);
    $("#update").click(()=>{
        data.every(clear);
        data.every(validate);
        if($("#image")[0].files[0] != undefined){
            body.append("upload",$("#image")[0].files[0])
        }
        if(!validated){
            M.toast({html: 'Please fill in all fields!'});
        }
        else{
            data.every(appendForm);
            axios.put(`/travel/${travelData.travel_id}`,body,config).then((response)=>{
                console.log(response)
                M.toast({html: "Updated travel listing!"});
                body = new FormData();
            });
        }
    })
    $("#delete-listing").click(()=>{
        axios.delete(`/travel/${travelData.travel_id}`).then((response)=>{
            window.location.href = `/admin`
        })
    })
    $(`#itinerary`).click(()=>{
        let yo = document.getElementsByClassName("created");
        for(var x = 0; x < yo.length; x++){
            yo[x].remove();
        }
        axios.get(`/travel/${travelData.travel_id}/itinerary`).then((response)=>{
            response.data.every(createItineraryRow);
        })
    })
    $("#add").click(()=>{
        itinerary_data.every(clear);
        itinerary_data.every(validate);
        if(validated){
            itinerary_data.every(appendForm);
            axios.post(`/travel/${travelData.travel_id}/itinerary`,body,config).then((response)=>{
                window.location.href = "/edit"
            })
        }
        
    })
    initItinerary(travelData.travel_id);

})

function deleteItinerary(id){
    axios.delete(`/travel/itinerary/${id}`).then(() => {
        M.toast({html: 'Itinerary Deleted!'});

        let travelData =  JSON.parse(localStorage.getItem("data"));
        initItinerary(travelData.travel_id);
    }).catch((err) => {
        console.log(err);
    })
}

function initItinerary(travel_id){
    let container = $("#itinerary-container");
    container.empty();

    const createActivityCard = (data) => {
        // console.log(data);
        
        let cardCode = `<div class="col s12 m6">
            <div class="card blue-grey darken-1" style="margin-left: 0; margin-right: 0;">
              <div class="card-content white-text">
                <a id='delete-itinerary-${data.itinerary_id}' class="btn-floating btn-large halfway-fab waves-effect waves-light red"><i class="material-icons">delete</i></a>
                <span class="card-title">Day ${data.day}</span>
                <p>${data.activity}</p>
              </div>
            </div>
          </div>`;
        container.append(cardCode);

        $(`#delete-itinerary-${data.itinerary_id}`).click(() => {
            deleteItinerary(data.itinerary_id);
        })
        return true;
    }

    axios.get(`/travel/${travel_id}/itinerary`).then((resp) => {
        // console.log(resp);
        resp.data.every(createActivityCard);

        container.append(`<div class="col s12 m6">
        <div class="card white darken-1">
        <div class="card-content">
            <span class="card-title">Add Itinerary</span>
            <div class="row">
            <div class="input-field col s12">
                <h6 id='itinerary-error' class='red-text'></h6>
            </div>
        
            <div class="input-field col s12">
                <input id="add-day" type="text" class="validate">
                <label for="add-day">Day</label>
            </div>
            <div class="input-field col s12" style="margin-top: 1vh;">
                <textarea id="add-activity" class="materialize-textarea"></textarea>
                <label for="add-activity">Activity</label>
            </div>
            </div>
        </div>
        <div class="card-action right-align">
            <a id='add-itinerary' class="right-align waves-effect waves-light btn-large social linkedin">
            <i class="fas fa-plus-square"></i>Add Activity</a>
        </div>
        </div>
    </div>`);
        
        $("#add-itinerary").click(() => {
            addItinerary(travel_id);
        })
    })

}

function addItinerary(travel_id){
    let day = $("#add-day").val();
    let activity = $("#add-activity").val();

    if(day == "" || activity == ""){
        $("#itinerary-error").html("Inputs cannot be empty!");
    }else{
        // console.log(activity);

        let body = new FormData();
        body.append("day", day);
        body.append("activity", activity);
        axios.post(`/travel/${travel_id}/itinerary`, body, { headers: { 'Content-Type': 'multipart/form-data' } }).then((resp) => {
            M.toast({html: 'Itinerary Added!'})

            initItinerary(travel_id);
        })
    }
}