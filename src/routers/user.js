const express = require('express')
const dateformat = require('dateformat')
const excel = require('../utils/export2excel')
const Key = require('../models/keys')
const Movement = require('../models/movements')
const Room = require('../models/rooms')
const User = require('../models/users')
const Permission = require('../models/permissions')
const PIR = require('../models/pir')
const { findById } = require('../models/keys')

// const passport = require('passport')
// const User = require('../models/user')
// const { forwardAuthenticated } = require('../middleware/auth')

const router = new express.Router()

router.get('/', async (req, res) => {
    const habitaciones = await Room.find({})

    res.render('index', {
        title: 'Sistema de Acceso Inteligente',
        layout: 'layout',
        habitaciones
    })
})

router.post('/', async (req, res) => {
    await Room.findById(req.body.id)
        .then(async (hab) => {
            await Permission.findOne({
                room: hab._id,
                starting_time: {$gt: Date.now() - 5 * 3600000}
            }).then(async (perm) => {
                if(perm){
                    await User.findById(perm.user)
                        .then((user) => {
                            result = {
                                layout: 'layout',
                                title: 'Sistema de Acceso Inteligente',
                                dataRoom: hab.name,
                                dataTemp: hab.temp,
                                dataHum: hab.hum,
                                dataID: user.codigo,
                                dataName: user.name,
                                dataAdicional: user.adicional
                            }
                            res.send(result)
                        })
                }
                else{
                    result = {
                        layout: 'layout',
                        title: 'Sistema de Acceso Inteligente',
                        dataRoom: hab.name,
                        dataTemp: hab.temp,
                        dataHum: hab.hum,
                        dataID: '--',
                        dataName: '--',
                        dataAdicional: '--'
                    }
                    res.send(result)
                }
            })
        })
})

router.get('/color_room', async (req, res) => {
    datos = []
    const rooms = await Room.find({})
    if(rooms){
        for(let i = 0; i < rooms.length; i++){
            let permission = await Permission.find({
                room: rooms[i],
                starting_time: {$gt: Date.now() - 5 * 3600000}
            })

            obj = {
                room: rooms[i]._id,
                valid: permission.length > 0
            }
            datos.push(obj)
        }
        res.status(200).send(datos)
    }
})

router.post('/user', async (req, res) => {
    const user = await User.findById(req.body.id)
    if(user)
        res.send(user)
    else
        res.status(404).send()
})

router.patch('/user', async (req, res) => {
    const user = await User.findById(req.body.id)
    if(req.body.codigo == user.codigo && user){
        user.admin = req.body.admin
        user.name = req.body.name
        user.adicional = req.body.adicional
        user.save()
        console.log('User updated!')
        res.status(200).send('Usuario modificado con exito!')
    } else{
        console.log(req.body.codigo, user.codigo)
        res.send('Ocurrio un error modificando al usuario.')
    }
})

router.delete('/user', async (req, res) => {
    const user = await User.findById(req.body.id)

    //Delete all permissions and movements from user
    const permissions = await Permission.find({
        user
    }).then((perm) => {
        movements = Movement.deleteMany({
            permission: { $in: perm }
        }).then(() => {
            console.log('Movimientos eliminados')
        })
    })
    Permission.deleteMany({
        user
    }).then(() => {
        console.log('Permisos eliminados')
    })

    await User.findByIdAndDelete(user._id)
        .then(() => {
            console.log('User deleted!')
            res.status(200).send()
        })
        .catch(e => {
            console.log(e)
        })
})

router.get('/rooms', async (req, res) => {
    const rooms = await Room.find({})

    if(rooms)
        res.send(rooms)
    else
        res.status(404).send()
})

router.get('/keys', async (req, res) => {
    const keys = await Key.find({})

    if(keys)
        res.send(keys)
    else
        res.status(404).send()
})

router.delete('/permissions', async (req, res) => {
    let permission = await Permission.findById(req.body.id)

    await Movement.deleteMany({
        permission
    })

    permission = await Permission.findByIdAndDelete(req.body.id)

    if(permission)
        res.status(200).send()
    else
        res.status(404).send()
})

router.get('/cargaBase', async (req, res) => {
    const usuarios = await User.find({})

    res.render('cargaBase', {
        layout: 'layout',
        title: 'Cargado de Datos',
        usuarios
    })
})

// Creado de usuarios
router.post('/cargaBase', async (req, res) => {
    const user = await new User({
        codigo: req.body.codigo,
        admin: req.body.admin == 'on',
        name: req.body.name,
        adicional: req.body.adicional
    })
    await user.save()
        .then((user) => {
            console.log('Usuario creado con exito!', user)
            usuario_creado = true
        })
        .catch(() => {
            console.log('Ha ocurrido un error creando usuario!')
            usuario_creado = false
        })

    const usuarios = await User.find({})

    res.render('cargaBase', {
        layout: 'layout',
        title: 'Cargado de Datos',
        usuarios,
        usuario_creado
    })
})

router.get('/asigna-permisos', async (req, res) => {
    let datos = []
    const permission = await Permission.find({
        starting_time: {$gt: Date.now() - 5 * 3600000}
    })
    if(permission.length){
        for(let i = 0; i < permission.length; i++){
            const user = await User.findById(permission[i].user)
            const room = await Room.findById(permission[i].room)
            const key = await Key.find({ key_id: permission[i].key })

            obj = {
                id: permission[i]._id,
                starting_time: dateformat(permission[i].starting_time, 'isoTime'),
                username: user.name,
                usercode: user.codigo,
                key: key[0].name,
                room: room.name
            }
            datos.push(obj)
        }
    }

    res.render('asignaPermisos', {
        layout: 'layout',
        title: 'Asignacion de Permisos',
        datos
    })
})

router.post('/asigna-permisos', async (req, res) => {
    await User.findOne({ codigo: req.body.code })
        .then(async (user) => {
            await Room.findById(req.body.room)
                .then(async (room) => {
                    const permiso = new Permission({
                        starting_time: Date.now(),
                        key: req.body.key,
                        user,
                        room
                    })
                    await permiso.save()
                })

            const permiso = await Permission.find({
                starting_time: {$gt: Date.now() - 5 * 3600000}
            })
            res.redirect('/asigna-permisos')
        })
})

router.post('/export-movements', async (req, res) => {
    let i = 0;
    let array = []
    movements = await Movement.find({})
    console.log('MOVIMIENTOS:', movements)
    for(let i = 0; i < movements.length; i++){
        const permission = await Permission.findById(movements[i].permission)
        console.log('PERMISO:', permission)
        const user = await User.findById(permission.user)
        const room = await Room.findById(permission.room)

        obj = {
            date: movements[i].date,
            username: user.name,
            usercode: user.codigo,
            room: room.name
        }
        array.push(obj)
    }

    console.log('ARRAY:\n', array)
    excel.exportReport_movements(array)
    res.redirect('/asigna-permisos')
});

router.post('/export-pir', async (req, res) => {
    let array = []
    let room
    const pir = await PIR.find({})

    for(let i = 0; i < pir.length; i++){
        room = await Room.findById(pir[i].room)

        obj = {
            date: pir[i].date,
            room: room.name
        }
        array.push(obj)
    }

    console.log('ARRAY:\n', array)
    excel.exportReport_pir(array)
    res.redirect('/asigna-permisos')
});

module.exports = router