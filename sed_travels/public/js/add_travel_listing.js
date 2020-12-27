$("document").ready(()=>{
    data.every(focus);
    $("#submit").click(()=>{
        data.every(validate);
        if($("#image")[0].files[0] == undefined){
            validated = false;
            $("#image").css("border-bottom","1px solid red");
        }
        if(!validated){
            M.toast({html: 'Please fill in all fields!'});
        }
        else{
            data.every(appendForm);
            body.append("upload",$("#image")[0].files[0])
            axios.post("http://localhost:3000/travel",body,config).then((response)=>{
                M.toast({html: "Added travel listing!"});
                $("#travel").trigger("reset");
            });
            body = new FormData();
            data.every(clear);
        }
    })
   
})