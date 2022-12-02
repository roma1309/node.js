const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/User')
const validator = require("email-validator");
const uuid = require('uuid')
const path = require('path');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        'random_secret_key123',
        {expiresIn: '24h'}
    )
}

class AuthController {
    async registration(req, res, next){
        const{email, password, lastName, firstName} = req.body
        
        if(!validator.validate(email) || !password || !lastName || !firstName || ! req.files) {
            return next(ApiError.badRequest('Неккоректный ввод данных'));
        }

        const {img} = req.files
        const candidate = await User.findOne({where: {email}})

        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        let fileName = uuid.v4() + ".jpg"
        img.mv(path.resolve(__dirname, '..', 'static', fileName))
        const hashPassword = await bcrypt.hash(password, 5)

        await User.create({email, lastName, firstName, fileName, password: hashPassword, image: fileName})
        return res.json({response: 'okey'})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }
}

module.exports = new AuthController();