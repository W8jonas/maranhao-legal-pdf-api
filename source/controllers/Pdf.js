const path = require('path')

PDFParser = require("pdf2json");

function getPdfById(id) {
    console.log("id", id)
    const val = path.join(__dirname, `./${id}.pdf`)
    return val
}

async function index(request, response) {
    console.log("request.params: ", request.params)
    
    try {
        const { id } = request.params
    
        const pdfParser = new PDFParser(this, 1);
    
        pdfParser.on("pdfParser_dataError", errData => {
            return response.send({
                status: '400',
                error: JSON.stringify(errData.parserError)
            })
        });
    
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const pdfText = pdfParser.getRawTextContent()
            // const autor = pdfText.match( /Autor(\([eas]{0,3}\))?:(.*)(\n|\r)/ui )[2] || null; // podemos ter 2 ou mais Réus.. // Autor(\([eas]{0,3}\))?:(.*)(\s*) // Réu?(\(u?s\))?:{1}
            // console.log('autor', autor)
    
            const filteredContent = pdfText.replace(/[\r\n]/g, ""); // filteredContent
            const formattedContent = filteredContent.replace(/(-{5,})(.+?)(-{5,})/g, " ");
    
            const dispositivo = formattedContent.match( /julgo(.*)procedente/ui )[0] || null;
            console.log('dispositivo', dispositivo)
    
            return response.send({
                status: '200',
                data: {
                    dispositivo
                }
            })
    
        });

        const pdfToRede = getPdfById(id);
    
        pdfParser.loadPDF(pdfToRede);
    } catch (error) {
        return response.send({
            status: '400',
            error: JSON.stringify(errData.parserError),
            errorMessage: 'Não foi encontrado nenhum documento com esse id.'
        })
    }

}

module.exports = {
    index
}
