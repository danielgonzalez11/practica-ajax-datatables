<?php
/* Database connection information */
include("mysql.php" );
/*
 * Local functions
 */
function fatal_error($sErrorMessage = '') {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}
/*
 * MySQL connection
 */
if (!$gaSql['link'] = mysql_pconnect($gaSql['server'], $gaSql['user'], $gaSql['password'])) {
    fatal_error('Could not open connection to server');
}
if (!mysql_select_db($gaSql['db'], $gaSql['link'])) {
    fatal_error('Could not select database ');
}
mysql_query('SET names utf8');
/*
 * SQL queries
 * Get data to display
 */
$nombredoctor = $_POST['nombre'];
$numcolegiado = $_POST['num'];
$id_doctor = $_POST['id'];
$clinica = $_POST["clinicas"];
/* Consulta UPDATE */
//Primero borramos las clinicas que tenia por si ha modificado sus clinicas
$query = "delete from clinica_doctor where id_doctor=" . $id_doctor;
$query_res = mysql_query($query);
//ahora añadimos las nuevas o las mismas
foreach ($clinica as $key => $value) {
    $query = "INSERT INTO clinica_doctor (id_doctor,id_clinica) VALUES ('".$id_doctor."','".$value."')";
    $query_res = mysql_query($query);
    if (!$query_res) { 
        $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
        $estado = mysql_errno();
    } else {
        $estado = 1;
        $mensaje = 'Modificado sus clinicas pero no se ha conseguido actualizar el doctor';
    }
 }

$query = "UPDATE doctores SET numcolegiado = '".$numcolegiado."', nombre = '".$nombredoctor."' where id_doctor = '".$id_doctor."'";
//mysql_query($query, $gaSql['link']) or fatal_error('MySQL Error: ' . mysql_errno());
/*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
$query_res = mysql_query($query);
// Comprobar el resultado
if (!$query_res) {
    $mensaje  = 'Error en la consulta: ' . mysql_error() . "\n";
    $estado = mysql_errno();
}
else
{

    $mensaje = "Actualización correcta";
    $estado = 0;
}
$resultado = array();
 $resultado = array(
      'mensaje' => $mensaje,
      'estado' => $estado
   );
echo json_encode($resultado);
?>
