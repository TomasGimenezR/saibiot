const index = function() {
    $.ajax({
        url: "/color_room",
        type: "GET",
        success: function (response) {
            $botones = $('.containerBotonesIndex button').toArray()
            for(let i = 0; i < $botones.length; i++){
                $btn = $botones[i]
                if($btn.id == response[i].room){
                    if(response[i].valid)
                        $('#' + $btn.id).css("background-color", "#f56666")
                    else
                        $('#' + $btn.id).css("background-color", "#55cc55")
                }
            }                
        }
    })
    
    $('.containerBotonesIndex button').click(function() {
        var data = {
            id: $(this).attr('id')
        }

        $.ajax({
            url: "/",
            type: "POST",
            data,
            success: function (response) {
                $('#dataRoom').text(response.dataRoom)
                $('#dataTemp').text(response.dataTemp + '°C')
                $('#dataHum').text(response.dataHum + '%')
                $('#dataID').text(response.dataID)
                $('#dataName').text(response.dataName)
                $('#dataAdicional').text(response.dataAdicional)

                if(response.dataID == '--')
                    $('.room_state').css("color", "green").text('VACANTE')
                else
                    $('.room_state').css("color", "red").text('OCUPADO')
            }
        })
    })
}

const cargaBase = function () {
    $('.user_row').click(function () {

        data =  {
            id: $(this).attr('data-id')
        }
        console.log('DATA:',data)
        $.ajax({
            url: "/user",
            type: "POST",
            data,
            success: function(response) {
                $('#codigo').val(response.codigo)
                $('#is_admin').prop( "checked", response.admin )
                $('#name').val(response.name)
                $('#adicional').val(response.adicional)
                $('.titulo').attr('data-id', response._id)
            }
        })
    })

    $('#modifica_usuario').click(function () {

        data =  {
            id: $('.titulo').attr('data-id'),
            codigo:  $('#codigo').val(),
            admin: $('#is_admin').val() == 'on',
            name: $('#name').val(),
            adicional: $('#adicional').val(),
        }
        $.ajax({ 
            url: "/user",
            type: "PATCH",
            data,
            success: function(response) {
                location.reload()
                alert(response)
            },
            fail: function(response){
                alert('Ha ocurrido un error modificando el usuario.')
            }
        })
    })

    $('#elimina_usuario').click(function () {

        data =  {
            id: $('.titulo').attr('data-id')
        }
        $.ajax({ 
            url: "/user",
            type: "DELETE",
            data,
            success: function(response) {
                location.reload()
                alert('Usuario eliminado exitosamente.')
            }
        })
    })
}

const asignaPermisos = function () {
    $selsalas =  $('.salas')
    $selkeys = $('.llaves')

    $.ajax({
        url: "/rooms",
        type: "GET",
        success: function(result) {
            $.each(result, function() {
                $selsalas.append($("<option />").val(this._id).text(this.name));
            });
        }
    })
    $.ajax({
        url: "/keys",
        type: "GET",
        success: function(result) {
            $.each(result, function() {
                $selkeys.append($("<option />").val(this.key_id).text(this.name));
            });
        }
    })
    
    $('#eliminaPermiso').click(function () {

        data =  {
            id: $(this).attr('data-id')
        }
        $.ajax({ 
            url: "/permissions",
            type: "DELETE",
            data,
            success: function(response) {
                location.reload()
                alert('Permiso eliminado exitosamente.')
            }
        })
    })
}

$( document ).ready(function() {
    index()
    cargaBase()
    asignaPermisos()
})