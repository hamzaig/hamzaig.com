<?php
    // Set content type to JSON
    header('Content-Type: application/json');

    // Only process POST requests.
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get the form fields and remove whitespace.
        $name = isset($_POST["inputName"]) ? strip_tags(trim($_POST["inputName"])) : "";
        $name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = isset($_POST["inputEmail"]) ? filter_var(trim($_POST["inputEmail"]), FILTER_SANITIZE_EMAIL) : "";
        $phone = isset($_POST["inputPhone"]) ? trim($_POST["inputPhone"]) : "";
        $company = isset($_POST["inputCompany"]) ? strip_tags(trim($_POST["inputCompany"])) : "";
        $serviceType = isset($_POST["inputServiceType"]) ? strip_tags(trim($_POST["inputServiceType"])) : "";
        $budget = isset($_POST["inputBudget"]) ? strip_tags(trim($_POST["inputBudget"])) : "";
        $message = isset($_POST["inputMessage"]) ? trim($_POST["inputMessage"]) : "";
        $consent = isset($_POST["inputConsent"]) && ($_POST["inputConsent"] === "on" || $_POST["inputConsent"] === true || $_POST["inputConsent"] === "1");

        // Validation
        $errors = array();

        if (empty($name) || strlen($name) < 2) {
            $errors["name"] = "Name must be at least 2 characters";
        }

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors["email"] = "Please enter a valid email address";
        }

        if (empty($phone) || strlen($phone) < 11) {
            $errors["phone"] = "Phone number must be at least 11 digits";
        }

        if (empty($serviceType)) {
            $errors["serviceType"] = "Please select a service type";
        }

        if (empty($budget)) {
            $errors["budget"] = "Please select a budget range";
        }

        if (empty($message) || strlen($message) < 10) {
            $errors["message"] = "Message must be at least 10 characters";
        }

        if (!$consent) {
            $errors["consent"] = "You must agree to be contacted";
        }

        // If there are validation errors, return them
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(array(
                "ok" => false,
                "errors" => $errors,
                "error" => "Please check your form and try again."
            ));
            exit;
        }

        // Set the recipient email address.
        $recipient = "hamzaig@yahoo.com"; /** DON'T FORGET TO PUT YOUR EMAIL HERE **/

        // Set the email subject.
        $subject = "New Contact Form Submission - " . $serviceType;

        // Making email content
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n";
        $email_content .= "Phone: $phone\n";
        if (!empty($company)) {
            $email_content .= "Company: $company\n";
        }
        $email_content .= "Service Type: $serviceType\n";
        $email_content .= "Budget Range: $budget\n";
        $email_content .= "\nMessage:\n$message\n";

        // Making email headers
        $email_headers = "From: $name <$email>\r\n";
        $email_headers .= "Reply-To: $email\r\n";
        $email_headers .= "X-Mailer: PHP/" . phpversion();

        // Sending email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Setting a 200 (okay) response code.
            http_response_code(200);
            echo json_encode(array(
                "ok" => true,
                "message" => "Thanks for reaching out! We'll get back to you soon."
            ));
        } else {
            // Setting a 500 (internal server error) response code.
            http_response_code(500);
            echo json_encode(array(
                "ok" => false,
                "error" => "Oops! Something went wrong and we couldn't send your message. Please try again."
            ));
        }

    } else {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        echo json_encode(array(
            "ok" => false,
            "error" => "There was a problem with your input, please try again."
        ));
    }
?>