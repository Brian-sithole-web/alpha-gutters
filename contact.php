<?php
/**
 * Contact handler for the public enquiry forms.
 * It accepts a POST from index.html and contact-us.html,
 * checks the fields, and emails info@alpha-gutters.co.za.
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact-us.html');
    exit;
}

if (!empty($_POST['company_website'])) {
    header('Location: contact-us.html?sent=1#quote');
    exit;
}

function clean_line($value, $maxLength)
{
    $value = trim((string) $value);
    $value = str_replace(array("\r", "\n", "%0a", "%0d", "%0A", "%0D"), ' ', $value);
    if (strlen($value) > $maxLength) {
        $value = substr($value, 0, $maxLength);
    }
    return $value;
}

$name = clean_line(isset($_POST['name']) ? $_POST['name'] : '', 120);
$emailRaw = clean_line(isset($_POST['email']) ? $_POST['email'] : '', 160);
$email = filter_var($emailRaw, FILTER_VALIDATE_EMAIL);
$phone = clean_line(isset($_POST['phone']) ? $_POST['phone'] : '', 40);
$service = clean_line(isset($_POST['service']) ? $_POST['service'] : '', 80);
$source = clean_line(isset($_POST['source']) ? $_POST['source'] : '', 40);
$message = trim(isset($_POST['message']) ? (string) $_POST['message'] : '');
$message = str_replace(array("\r\n", "\r"), "\n", $message);
if (strlen($message) > 4000) {
    $message = substr($message, 0, 4000);
}

$allowedServices = array(
    'Seamless aluminium gutters',
    'Gutter repair',
    'Roofing',
    'Carports',
    'Doors',
    'Household maintenance',
    'Other',
);
$allowedSources = array('Home page', 'Contact page');

$isValid = $name !== ''
    && $email
    && $phone !== ''
    && in_array($service, $allowedServices, true)
    && in_array($source, $allowedSources, true)
    && $message !== '';

if (!$isValid) {
    header('Location: contact-us.html?sent=0#quote');
    exit;
}

$recipient = 'info@alpha-gutters.co.za';
$subject = 'Website enquiry: ' . $service;
$safeName = str_replace(array('<', '>', '"'), '', $name);
$body = "New enquiry from the Alpha Gutters website\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Service: {$service}\n"
    . "Sent from: {$source}\n\n"
    . "Message:\n{$message}\n";

$headers = array(
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Alpha Gutters Website <info@alpha-gutters.co.za>',
    'Reply-To: ' . $safeName . ' <' . $email . '>',
);

$wasSent = mail(
    $recipient,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers)
);

header('Location: contact-us.html?' . ($wasSent ? 'sent=1' : 'sent=0') . '#quote');
exit;
