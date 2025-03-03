$(function () {
  // Here is the form
  var form = $("#contact-form");
  var formSubmit = $("#contact-submit");

  // Getting the messages div
  var formMessages = $(".form-message");

  // Setting up an event listener for the contact form
  $(form).submit(function (event) {
    $("#contact-submit").prop("disabled", true);
    // Stopping the browser to submit the form
    event.preventDefault();

    // Serializing the form data
    var formData = $(form).serializeArray();
    var formDataJson = {};

    $.each(formData, function (_, field) {
      formDataJson[field.name] = field.value;
    });

    // Submitting the form using AJAX
    $.ajax({
      type: "POST",
      url: $(form).attr("action"),
      contentType: "application/json",
      data: JSON.stringify(formDataJson),
    })
      .done(function (response) {
        // Making the formMessages div to have the 'success' class
        $(formMessages).removeClass("error");
        $(formMessages).addClass("success");

        // Setting the message text
        var res = JSON.parse(response);
        $(formMessages).text(res?.message || "Form Submitted Successfully!");

        // Clearing the form after successful submission
        $("#inputName").val("");
        $("#inputEmail").val("");
        $("#inputPhone").val("");
        $("#inputMessage").val("");
        $("#inputSubject").val("");
      })
      .fail(function (data) {
        // Making the formMessages div to have the 'error' class
        $(formMessages).removeClass("success");
        $(formMessages).addClass("error");
        // Setting the message text
        $(formMessages).text(
          "Oops! An error occurred and your message could not be sent."
        );
        // if (data.responseText !== '') {
        //    $(formMessages).text(data.responseText);
        // } else {
        //    $(formMessages).text('Oops! An error occured and your message could not be sent.');
        // }
      });
  });
});

$(function () {
  // Here is the form
  var form = $("#subscribe-form");

  // Setting up an event listener for the contact form
  $(form).submit(function (event) {
    alert("You are subscribed!");
    $("#subscribe-button").prop("disabled", true);
    // Stopping the browser to submit the form
    event.preventDefault();

    // Serializing the form data
    var formData = $(form).serialize();

    // Submitting the form using AJAX
    $.ajax({
      type: "POST",
      url: $(form).attr("action"),
      data: formData,
    })
      .done(function (response) {
        // Making the formMessages div to have the 'success' class
        $(formMessages).removeClass("error");
        $(formMessages).addClass("success");

        // Setting the message text
        $(formMessages).text("Form Submitted Successfully!");

        // Clearing the form after successful submission
        $("#inputName").val("");
        $("#inputEmail").val("");
        $("#inputPhone").val("");
        $("#inputMessage").val("");
      })
      .fail(function (data) {
        // Making the formMessages div to have the 'error' class
        $(formMessages).removeClass("success");
        $(formMessages).addClass("success");

        // Setting the message text
        $(formMessages).text("Form Submitted Successfully!");
        // if (data.responseText !== '') {
        //    $(formMessages).text(data.responseText);
        // } else {
        //    $(formMessages).text('Oops! An error occured and your message could not be sent.');
        // }
      });
  });
});
