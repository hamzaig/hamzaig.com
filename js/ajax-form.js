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
      url: $(form).attr("action") || "/api/contact",
      contentType: "application/json",
      data: JSON.stringify(formDataJson),
      dataType: "json",
    })
      .done(function (response) {
        // Making the formMessages div to have the 'success' class
        $(formMessages).removeClass("error");
        $(formMessages).addClass("success");

        // Setting the message text
        try {
          var res = typeof response === 'string' ? JSON.parse(response) : response;
          $(formMessages).text(res?.message || "Thanks for reaching out! We'll get back to you soon.");
        } catch (e) {
          $(formMessages).text(response || "Thanks for reaching out! We'll get back to you soon.");
        }

        // Clearing the form after successful submission
        $("#inputName").val("");
        $("#inputEmail").val("");
        $("#inputPhone").val("");
        $("#inputCompany").val("");
        $("#inputServiceType").val("");
        $("#inputBudget").val("");
        $("#inputMessage").val("");
        $("#inputConsent").prop("checked", false);
        $("#contact-submit").prop("disabled", false);
      })
      .fail(function (data) {
        // Making the formMessages div to have the 'error' class
        $(formMessages).removeClass("success");
        $(formMessages).addClass("error");
        // Setting the message text
        try {
          var errorResponse = typeof data.responseJSON !== 'undefined' ? data.responseJSON : 
                             (typeof data.responseText !== 'undefined' && data.responseText !== '' ? 
                              JSON.parse(data.responseText) : null);
          if (errorResponse && errorResponse.error) {
            $(formMessages).text(errorResponse.error);
          } else if (errorResponse && errorResponse.message) {
            $(formMessages).text(errorResponse.message);
          } else {
            $(formMessages).text(
              "Oops! An error occurred and your message could not be sent. Please try again."
            );
          }
        } catch (e) {
          $(formMessages).text(
            "Oops! An error occurred and your message could not be sent. Please try again."
          );
        }
        $("#contact-submit").prop("disabled", false);
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
