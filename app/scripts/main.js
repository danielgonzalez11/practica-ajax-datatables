   'use strict';
   $(document).ready(function() {
     var tabla =  $('#miTabla').DataTable({
           'destroy': true,
           'processing': true,
           'serverSide': true,
           'ajax': 'php/cargar_doctores.php',
           "language": {
               'sProcessing': 'Procesando...',
               'sLengthMenu': 'Mostrar _MENU_ registros',
               'sZeroRecords': 'No se encontraron resultados',
               'sEmptyTable': 'Ningún dato disponible en esta tabla',
               'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
               'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
               'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
               'sInfoPostFix': '',
               'sSearch': 'Buscar:',
               'sUrl': '',
               'sInfoThousands': ',',
               'sLoadingRecords': 'Cargando...',
               'oPaginate': {
                   'sFirst': 'Primero',
                   'sLast': 'Último',
                   'sNext': 'Siguiente',
                   'sPrevious': 'Anterior'
               },
               'oAria': {
                   'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                   'sSortDescending': ': Activar para ordenar la columna de manera descendente'
               }
           },
           'columns': [{
               'data': 'nombredoctor'
           }, {
               'data': 'numcolegiado'
           }, {
               'data': 'nombre'
           },{
               'data': 'numcolegiado',
               'render': function(data) {
                return '<button type="button" class="btn btn-primary editarbtn" data-toggle="modal" data-target="#modalEditar">Editar</button>'  
                }
           }, {
               'data': 'numcolegiado',
               'render': function(data) {
                return '<button type="button" class="btn btn-danger borrarbtn" data-toggle="modal" data-target="#modalBorrar">Borrar</button>'  
                

               }
           }]
       });

      //cargar ventana al pulsar editar
      $('#miTabla').on('click', '.editarbtn', function() {
           
           //$('#tabla').fadeOut(100);
           //$('#modalEditar').fadeIn(100);
           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#nombredoctor').val(aData.nombredoctor);
           $('#numcolegiado').val(aData.numcolegiado);
           //cargar las clínicas , seleccionado a las que pertenezca el doctor
           //NO ME PASA LOS DATOS !!!!!!!!!!!!!!!!!!!!!!!!!!!!
           $('#clinicas').val(aData.nombre);
          
       });

      $('#miTabla').on('click', '.borrarbtn', function() {
           var nRow = $(this).parents('tr')[0];
           var aData = tabla.row(nRow).data();
           var numcolegiado = aData.numcolegiado;

            $('body').on('click', '#borrar', function() {
              $('#modalBorrar').modal('hide');
             $.ajax({
                 /*en principio el type para api restful sería delete pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
                 type: 'POST',
                 dataType: 'json',
                 url: 'php/borrar_doctores.php',
                 //estos son los datos que queremos actualizar, en json:
                 data: {
                     num: numcolegiado
                 },
                 error: function(xhr, status, error) {
                     //mostraríamos alguna ventana de alerta con el error
                     alert("Ha entrado en error");
                 },
                 success: function(data) {
                  
                     //obtenemos el mensaje del servidor, es un array!!!
                     var mensaje = data["mensaje"]; //o data[0], en función del tipo de array!!
                     alert(mensaje);
                     //actualizamos datatables:
                     /*para volver a pedir vía ajax los datos de la tabla*/
                     tabla.fnDraw();
                 },
                 complete: {
                     //si queremos hacer algo al terminar la petición ajax
                 }
             });
         });

       });
   });
