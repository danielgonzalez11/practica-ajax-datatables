   'use strict';
   var id_doctor;
   $(document).ready(function() {
     var tabla =  $('#miTabla').DataTable({
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
               'data': 'nombredoctor',
               'render': function(data){
                return '<a  href="#" class=" editarbtn"data-toggle="modal" data-target="#modalEditar">'+data+'</a>';
                //'<button type="button" class="btn btn-primary editarbtn" data-toggle="modal" data-target="#modalEditar">Editar</button>'
               }

           }, {
               'data': 'numcolegiado'
           }, {
               'data': 'nombre',
               'render': function(data){
                return '<li>' + data + '</li><br/>';
               }
           },{
               'data': 'id_doctor',
               'visible': false
           },{
               'data': 'id_clinica',
               'visible': false
           },{
               'data': 'id_doctor',
               'render': function(data) {
                return '<button type="button" class="btn btn-primary editarbtn" data-toggle="modal" data-target="#modalEditar">Editar</button>'  
                }
           }, {
               'data': 'id_doctor',
               'render': function(data) {
                return '<button type="button" class="btn btn-danger borrarbtn" data-toggle="modal" data-target="#modalBorrar">Borrar</button>'  
                

               }
           }]
       });
      ///^[ñA-Za-z _]*[ñA-Za-z][ñA-Za-z _]*$/
      //validaciones,letras, espacios y ñ
      $.validator.addMethod("lettersonly", function(value, element) {
    	return this.optional(element) || /^[a-z ñáéíóú]+$/i.test(value);
		}, "Introduce solo letras");
      //validar editar doctores
      $('#eD').validate({
          rules: {
              nombredoctor:{
                required: true,
                lettersonly: true
              },
              numcolegiado:{
                digits: true
              },
              clinicas:{
                required: true,
                minlength: 1
              }
         },
         submitHandler: function() {
          var numcolegiado= $('#numcolegiado').val();
          var nombre =  $('#nombredoctor').val();
          var clinicas=  $('#clinicas').val();     
          $('#modalEditar').modal('hide');
            $.ajax({
                 /*en principio el type para api restful sería delete pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
                 type: 'POST',
                 dataType: 'json',
                 url: 'php/editar_doctores.php',
                 //estos son los datos que queremos actualizar, en json:
                 data: {
                     num: numcolegiado,
                     nombre: nombre,
                     clinicas: clinicas,
                     id: id_doctor
                 },
                 error: function(xhr, status, error) {
                     //mostraríamos alguna ventana de alerta con el error
                     alert("Ha entrado en error");
                 },
                 success: function(data) {
                  
                     //obtenemos el mensaje del servidor, es un array!!!
                     var mensaje = data["mensaje"]; //o data[0], en función del tipo de array!!
                     if(data["estado"]==0){
                          $.growl({ style: 'notice',location: 'tr',title: "OK, TODO CORRECTO", message: data["mensaje"]});
                     }
                     else{
                          //$.growl.error({ message: mensaje });
                          $.growl({ style: 'error',location: 'tr',title: data["estado"], message: data["mensaje"]});
                     }
                     //actualizamos datatables:
                     /*para volver a pedir vía ajax los datos de la tabla*/
                     
                     //tabla.fnDraw();
                     tabla.draw();
                 },
                 complete: {
                     //si queremos hacer algo al terminar la petición ajax
                 }
             });
         }         
      });

      //validar "añadirDoctor"
      $('#aD').validate({
          rules: {
              nombredoctorA : {
                         required: true,
                        lettersonly: true 
              },
              numcolegiadoA: {
                     digits: true
              },
              clinicasA: {
                    required: true,
                    minlength: 1
              }
          },
         submitHandler: function() {
            var numd = $('#numcolegiadoA').val();
            var nombred =$('#nombredoctorA').val();
            var clinicasd = $('#clinicasA').val();
            
            $('#modalAdd').modal('hide');
            $.ajax({
                 type: 'POST',
                 dataType: 'json',
                 url: 'php/add_doctores.php',
                 data: {
                     numd: numd,
                     nombred: nombred,
                     clinicasd: clinicasd
                 },
                 error: function(xhr, status, error) {
                     //mostraríamos alguna ventana de alerta con el error
                     alert("Ha entrado en error");
                 },
                 success: function(data) {
                     //obtenemos el mensaje del servidor, es un array!!!
                     var mensaje = data["mensaje"]; //o data[0], en función del tipo de array!!
                     if(data["estado"]==0){
                          $.growl({ style: 'notice',location: 'tr',title: "OK, Doctor Añadido", message: data["mensaje"]});
                     }
                     else{
                          //$.growl.error({ message: mensaje });
                          $.growl({ style: 'error',location: 'tr',title: data["estado"], message: data["mensaje"]});
                     }
                     //actualizamos datatables:
                     /*para volver a pedir vía ajax los datos de la tabla*/
                     //tabla.fnDraw();
                     tabla.draw();
                 },
                 complete: {
                     //si queremos hacer algo al terminar la petición ajax
                 }
             });
         }
         
      });

      //cargar ventana al pulsar editar
      $('#miTabla').on('click', '.editarbtn', function() {
           var nRow = $(this).parents('tr')[0];
           var aData = tabla.row(nRow).data();
           $('#nombredoctor').val(aData.nombredoctor);
           $('#numcolegiado').val(aData.numcolegiado);
           $('#clinicas').val(aData.nombre);
           id_doctor = aData.id_doctor;

          var str = aData.id_clinica;
          str = str.split(",");
          $('#clinicas').val(str);
       });


      $('#miTabla').on('click', '.borrarbtn', function() {
           var nRow = $(this).parents('tr')[0];
           var aData = tabla.row(nRow).data();
           id_doctor = aData.id_doctor;
         });

      $('body').on('click', '#addNuevo', function() {
            $('#numcolegiadoA').val('');
            $('#nombredoctorA').val('');
            

         });
           
      $('#borrar').click(function(){
          $('#modalBorrar').modal('hide');
          $.ajax({
                 /*en principio el type para api restful sería delete pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
                 type: 'POST',
                 dataType: 'json',
                 url: 'php/borrar_doctores.php',
                 //estos son los datos que queremos actualizar, en json:
                 data: {
                     num: id_doctor
                 },
                 error: function(xhr, status, error) {
                     //mostraríamos alguna ventana de alerta con el error
                     alert("Ha entrado en error");
                 },
                 success: function(data) {
                  
                     //obtenemos el mensaje del servidor, es un array!!!
                     var mensaje = data["mensaje"]; //o data[0], en función del tipo de array!!
                     if(data["estado"]==0){
                          $.growl({ style: 'notice',location: 'tr',title: "OK, TODO CORRECTO", message: data["mensaje"]});
                     }
                     else{
                          //$.growl.error({ message: mensaje });
                          $.growl({ style: 'error',location: 'tr',title: data["estado"], message: data["mensaje"]});
                     }
                     //actualizamos datatables:
                     /*para volver a pedir vía ajax los datos de la tabla*/
                     //tabla.fnDraw();
                     tabla.draw();
                 },
                 complete: {
                     //si queremos hacer algo al terminar la petición ajax
                 }
             });
      });
});
