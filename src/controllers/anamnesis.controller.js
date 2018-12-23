const anamnesisService = require('../services/anamnesis.service');
const PdfGeneratorService = require('../services/pdf-generator.service');
const fs = require('fs');



const AnamnesisController = {

    async getAnamnesisList(req, res) {

        try {

            let params = req.query;

            let anamnesis = await anamnesisService.getAllAnamnesis(params);

            params.total = await anamnesisService.getAnamnesisTotalCount();

            const meta = {
                paginationConfig: {
                    "total": params.total === anamnesis.count ? params.total : anamnesis.count,
                    "count": anamnesis.count,
                    "per_page": parseInt(params.limit) || 15,
                    "current_page": parseInt(params.page) || 1,
                    "total_pages": (params.total < params.limit || params.total !== anamnesis.count ? 1 : Math.ceil(params.total / params.limit)) || 1,
                    "links": {},
                }
            }

            let responseBundle = { data: anamnesis.rows, meta }

            res.status(200).send(responseBundle)

        } catch (err) {
            res.status(400).send(err);
        }

    },

    async getOneAnamnesis(req, res) {

        try {
            
            let params = req.params;

            let anamnesis = await anamnesisService.getOneAnamnesis(params.id)

            res.status(200).send(anamnesis)

        } catch (err) {
            res.status(400).send(err)
        }

    },

    async postCreateAnamensis(req, res) {
        try {

            let bodyParams = req.body;

            const newAnamnesis = await anamnesisService.createAnamnesis(bodyParams);

            const responseBundle = newAnamnesis;

            res.status(200).json(responseBundle);

        } catch (err) {
            res.status(400).send(err);
        }
    },

    async postCreateAnamnesisQuestion(req, res) {
        try {
            let anamnesisId = req.params.id;
            let bodyParams = req.body;

            const newQuestion = await anamnesisService.createAnamnesisQuestion(anamnesisId, bodyParams);

            const responseBundle = newQuestion;

            res.status(200).json(responseBundle);

        } catch (err) {
            res.status(400).send(err);
        }
    },

    async pdfgenerate(req, res) {
        try {
            const anamnesisId = req.params.id;
    
            await PdfGeneratorService.generatePdf(anamnesisId);
    
            const file = fs.readFileSync('src/public/output/anamnesis.pdf');
            const filename = 'anamnese';
    
            res.setHeader('Content-Type', "application/pdf");
            res.setHeader('Content-Disposition', 'pdf; filename=' + `${filename}.pdf`);
            res.send(file);

        } catch (err) {
            console.log(err);
            
            res.status(400).send(err);
        }

    }

}

module.exports = AnamnesisController;
