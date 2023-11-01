<?php
 
// Getting uploaded file
$file = $_FILES["file"];
 
// Uploading in "uplaods" folder
move_uploaded_file($file["tmp_name"], "../../../uploads/" . $file["name"]);
 
// Redirecting back
header("Location: ../../bnpQI2QMNCt8CZHCx4JI8d0UxDLJYXUzYhUSaccbilaut.php");