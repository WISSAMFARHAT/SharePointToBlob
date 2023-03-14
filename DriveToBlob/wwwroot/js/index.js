var submit = document.querySelector("#submit");

submit.onsubmit = (e) => {
    event.preventDefault();
    var formData = new FormData(submit);
    
    $.ajax({
        url: '/ToBlobStorage',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            alert("done");
            location.reload();
        },
        error: function (xhr, status, error) {
            alert("error");
        }
    });

}
