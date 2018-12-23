const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
const anamnesisService = require('../services/anamnesis.service');

const templateFile = './src/public/index.ejs';
const filePath = './src/public/output/anamnesis.pdf';

const PdfGeneratorService = {

    async generatePdf(id) {

        await fs.access(filePath, error => {
            if (!error) {
                fs.unlink(filePath, function (error) {});
            } 
        });

        let anamnesis = await anamnesisService.getOneAnamnesis(id);

        anamnesis = JSON.stringify(anamnesis);
        anamnesis = JSON.parse(anamnesis);
        
        let template = await htmlGenerator(templateFile, {patientData: {}, questions: anamnesis.questions});

        await pdfGenerator('anamnesis', template, { format: 'Letter' });
    }

}

function htmlGenerator(templateFile, data) {

    return new Promise(function (resolve, reject) {
        ejs.renderFile(templateFile, data, function (err, html) {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

};

function pdfGenerator(fileName, html, options) {

    return new Promise(function (resolve, reject) {
        pdf.create(html, options).toFile(`./src/public/output/${fileName}123.pdf`, function (err, pdf) {
            if (err) {
                reject(err);
            } else {
                resolve(pdf);
            }
        });
    });

};

module.exports = PdfGeneratorService;
