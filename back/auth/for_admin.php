<?php
$hashedPassword = password_hash(1234, PASSWORD_BCRYPT);
echo $hashedPassword;