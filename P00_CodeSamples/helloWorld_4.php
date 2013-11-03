<?php

$books = array(
    "Myst: The Book of Atrus",
    "Myst: The Book of Ti'ana",
    "Myst: The Book of D'ni"
);

serveBooks($books);

function serveBooks($books) {
    echo $html = '<b>' . join($books, '</b><br/><b>') . '</b>';
    $books = array(); // Intentionally cleaned
}

// Always echoes the 3x books

?>