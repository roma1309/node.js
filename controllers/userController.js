const {User} = require('../models/User')
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
var validator = require("email-validator");
const uuid = require('uuid')
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const pdf2base64 = require('pdf-to-base64');


class UserController {

    async getPrincipal(req, res, next){
        const email = req.user.email
        console.log(email);
        const user = await User.findOne({where: {email}})
        return res.json({
            email: user.email,
            firstname: user.firstName,
            lastname: user.lastName,
            image: user.image
            })
    }

    async deleteUser(req, res, next){
        const id = req.user.id
        console.log(id);
        const user = await User.findByPk(id)

        const fileName = user.image
        fs.unlink(path.resolve(__dirname, '..', 'static', fileName), err => {
            if(err) throw err;
            console.log('Файл успешно удалён');
         });

        await User.destroy({where: {id}})

        fs.unlink(path.resolve(__dirname, '..', 'static', fileName), err => {
            if(err) throw err;
            console.log('Файл успешно удалён');
         });
        return res.json('User deleted')
    }

    async updateUser(req, res, next){
        const{lastName, firstName} = req.body
        const id = req.user.id
        console.log(id)
        const {img} = req.files
        let newFileName = uuid.v4() + ".jpg"
        img.mv(path.resolve(__dirname, '..', 'static', newFileName))

        const user = await User.findByPk(id)
        
        const fileName = user.image
        fs.unlink(path.resolve(__dirname, '..', 'static', fileName), err => {
            if(err) throw err;
            console.log('Файл успешно удалён');
         });

        await User.update({lastName: lastName, firstName:firstName,
             image:newFileName}, {where:{id: id}})    
        return res.json('User updated')
    }

    async createPDF(req, res, next){
        const doc = new PDFDocument();
        const{email} = req.body
        const user = await User.findOne({where: {email}})
        doc.pipe(fs.createWriteStream('example.pdf'));
        doc
         .fontSize(25)
         .text(user.firstName+' '+ user.lastName, 100, 100);

         doc.image(path.resolve(__dirname, '..', 'static', user.image), {
            fit: [350, 350],
            align: 'center',
            valign: 'center'
          });
        doc.end();

          console.log(pdf2base64('example.pdf'))
         await User.update({pdf: pdf2base64('example.pdf')}, {where:{email}})  
        return res.json('true')
    }
}

module.exports = new UserController()