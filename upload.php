<?php
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
$name = "";
$email = "";

//SQL
$servername = "localhost";
$username = "root";
$password = "";


$conn = new mysqli($servername, $username, $password);
$conn->select_db("designs");

// Check connection
if ($conn->connect_error) {
    $uploadOk = 0;
    die("Connection failed: " . $conn->connect_error);
}
else{
  echo "Connected successfully";
}



if (isset($_POST["dropFile"])){
  echo $_POST["dropFile"];
  echo "called";
}


if (isset($_POST["name"])){
  $name = $_POST["name"];
}
else {
  $uploadOk = 0;
}

if (isset($_POST["email"])){
  $email = $_POST["email"];
}
else {
  $uploadOk = 0;
}

// Check if file already exists
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        $sql = "INSERT INTO designs (name, email, filepath) VALUES ('$name','$email','$target_file')";
        if ($conn->query($sql) === TRUE) {
          echo "New record created successfully";
        } else {
          echo "Error: " . $sql . "<br>" . $conn->error;
        }

        //echo "The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.";

        $conn->close();

    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>
