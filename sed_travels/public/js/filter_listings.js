$("document").ready(() => {
    $("#filter-form").submit(() => {
        event.preventDefault();
        filterTravelListings();
        M.toast({html: 'Listings Filtered!'});
    })

    $("#clear-filters").click(() => {
        clearFilters();
        filterTravelListings();
        M.toast({html: 'Filters Cleared!'});
    })
})

function filterTravelListings(){
    let search = $("#search-filter").val()
    let country = $("#country-filter").val();
    let dateFrom = $("#travel-period-from-filter").val();
    let dateTo = $("#travel-period-to-filter").val();
    let minPrice = $("#min-price").val();
    let maxPrice = $("#max-price").val();
    console.log(dateFrom)
    let body = new FormData();
    body.append("search", search);
    body.append("country", country);
    body.append("dateFrom", dateFrom);
    body.append("dateTo", dateTo);
    body.append("minPrice", minPrice);
    body.append("maxPrice", maxPrice);

    console.log(body);

    // Display search back
    if (search != ""){
        $('#search-results').html(`<p>You searched for ${search}</p>`);
    }

    axios.post("/travel/filter", body, {headers: { 'Content-Type': 'multipart/form-data' }}).then((resp) => {
        console.log(resp);
        
        // func from get_travel_listings.js
        fillTravelListings(resp);
    })
}

function clearFilters(){
    $("#country-filter").val("");
    $("#travel-period-from").val("");
    $("#travel-period-to").val("");
    $("#min-price").val("");
    $("#max-price").val("");
}