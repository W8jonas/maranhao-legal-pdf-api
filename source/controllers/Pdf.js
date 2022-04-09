const path = require('path')

const pdf = path.join(__dirname, "./tribunal_de_justica_do_estado_do_maranhao.pdf")

// const pdf = "./tribunal_de_justica_do_estado_do_maranhao.pdf"
const pdf2 = "./juiz_flagrado_dirigindo_carro_eike.pdf"
const pdf3 = "./sentenca-juiz-advogado.pdf"

PDFParser = require("pdf2json");

async function index(request, response) {
    const pdfParser = new PDFParser(this, 1);

    pdfParser.on("pdfParser_dataError", errData => {
        console.error(errData.parserError)

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

    pdfParser.loadPDF(pdf);

}

module.exports = {
    index
}
