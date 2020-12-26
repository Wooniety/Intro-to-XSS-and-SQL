let validated = true;
let body = new FormData();
const config =  { headers: { 'Content-Type': 'multipart/form-data' } };
const data = ["title","travel-period-from","travel-period-to","country","price","description"];
const itinerary_data = ["day","activity"]

const validate = (title)=>{
    const field = $(`#${title}`);
    if(field.val().trim() == ""){
        validated = false;
        field.css("border-bottom","1px solid red");
    }
    return true
}

const clear = (title)=>{
    const field = $(`#${title}`);
    field.attr("style","");
    return true;
}

const focus = (title)=>{
    $(`#${title}`).focus(()=>{
        clear(title);
    })
    return true;
}

const appendForm = (title)=>{
    console.log(title);
    const field = $(`#${title}`);
    if(title == "travel-period-from"){
        body.set("date_from", field.val());
    }
    else if(title == "travel-period-to"){
        body.set("date_to", field.val());
    }
    else{
        body.append(title,field.val());
    }
    return true;
   
}

const fill_form = (data)=>{
    $(`#title`).trigger("focus").val(data.title);

    let from_instance = M.Datepicker.getInstance($("#travel-period-from"));
    from_instance.setDate(new Date(data.date_from));
    from_instance._finishSelection();

    let to_instance = M.Datepicker.getInstance($("#travel-period-to"));
    to_instance.setDate(new Date(data.date_to));
    to_instance._finishSelection();

    $(`#country`).trigger("focus").val(data.country);
    $(`#price`).trigger("focus").val(data.price);
    $(`#description`).val(data.description);
    M.textareaAutoResize($('#description'));
}

exports = {
    validated: validated,
    body: body,
    config: config,
    data: data,
    validate: validate,
    clear: clear,
    focus: focus,
    appendForm: appendForm,
    fill_form: fill_form
}