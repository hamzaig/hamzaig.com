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
        // Clear any previous field errors
        $(".field-error").remove();
        $(".form-field-error").removeClass("form-field-error");
        
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
      .fail(function (xhr) {
        // Making the formMessages div to have the 'error' class
        $(formMessages).removeClass("success");
        $(formMessages).addClass("error");
        
        // Clear previous field errors
        $(".field-error").remove();
        $(".form-field-error").removeClass("form-field-error");
        
        // Setting the message text
        try {
          var errorResponse = xhr.responseJSON || 
                             (xhr.responseText ? JSON.parse(xhr.responseText) : null);
          
          if (errorResponse) {
            // If there are specific field errors, display them
            if (errorResponse.errors && Object.keys(errorResponse.errors).length > 0) {
              var errorMessages = [];
              
              // Map field names to input IDs
              var fieldMapping = {
                'name': 'inputName',
                'email': 'inputEmail',
                'phone': 'inputPhone',
                'company': 'inputCompany',
                'serviceType': 'inputServiceType',
                'budget': 'inputBudget',
                'message': 'inputMessage',
                'consent': 'inputConsent'
              };
              
              // Display errors for each field
              $.each(errorResponse.errors, function(field, message) {
                var inputId = fieldMapping[field] || field;
                var $field = $("#" + inputId);
                
                if ($field.length) {
                  // Add error class to field
                  $field.addClass("form-field-error");
                  
                  // Add error message below field
                  var errorHtml = '<span class="field-error" style="color: red; font-size: 12px; display: block; margin-top: 5px;">' + message + '</span>';
                  $field.after(errorHtml);
                  
                  errorMessages.push(message);
                } else {
                  errorMessages.push(message);
                }
              });
              
              // Show general error message with all errors
              if (errorResponse.error) {
                $(formMessages).html('<strong>Please fix the following errors:</strong><br>' + errorMessages.join('<br>'));
              } else {
                $(formMessages).html('<strong>Please fix the following errors:</strong><br>' + errorMessages.join('<br>'));
              }
            } else if (errorResponse.error) {
              $(formMessages).text(errorResponse.error);
            } else if (errorResponse.message) {
              $(formMessages).text(errorResponse.message);
            } else {
              $(formMessages).text(
                "Oops! An error occurred and your message could not be sent. Please try again."
              );
            }
          } else {
            $(formMessages).text(
              "Oops! An error occurred and your message could not be sent. Please try again."
            );
          }
        } catch (e) {
          console.error('Error parsing response:', e);
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
