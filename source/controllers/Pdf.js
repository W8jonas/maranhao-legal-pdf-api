const path = require('path')

PDFParser = require("pdf2json");

function getPdfById(id) {
    console.log("id", id)
    const val = path.join(__dirname, `./${id}.pdf`)
    return val
}


function getAuthor(pdfText) {

    try {
        const pdfTextLower = pdfText.toLowerCase()

        var someEncodedString = Buffer.from(pdfTextLower, 'utf-8').toString();

        const _author = someEncodedString.match(/(?<=autor[eas]{0,3})(.*)(?= )/)

        if (_author) {
            if (_author.length) {
                return _author[0]
            }
        }

        const _author2 = someEncodedString.match(/(?<=exequente[s]{0,1})(.*)(?= )/)

        if (_author2) {
            if (_author2.length) {
                return _author2[0]
            }
        }
    } catch (error) {
        return ''
    }
}

function getDefendant(pdfText) {

    try {
        const pdfTextLower = pdfText.toLowerCase()
    
        var someEncodedString = Buffer.from(pdfTextLower, 'utf-8').toString();
    
        const _defendant = someEncodedString.match(/(?<=réu[s]{0,1})(.*)(?= )/)
    
        if (_defendant) {
            if (_defendant.length) {
                return _defendant[0]
            }
        }
    
        const _defendant2 = someEncodedString.match(/(?<=executado[s]{0,1})(.*)(?= )/)
    
        if (_defendant2) {
            if (_defendant2.length) {
                return _defendant2[0]
            }
        }
    } catch (error) {
        return ''
    }
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
            
            // console.log('pdfText', pdfText)
            
            const filteredContent = pdfText.replace(/[\r\n]/g, ""); // filteredContent
            const formattedContent = filteredContent.replace(/(-{5,})(.+?)(-{5,})/g, " ");
            
            const dispositivo = 123 // formattedContent.match( /julgo(.*)procedente/ui )[0] || null;
            console.log('dispositivo', dispositivo)

            const autor = getAuthor(pdfText)
            console.log('\nautor', autor)

            const defendant = getDefendant(pdfText)
            console.log('\ndefendant', defendant)

            return response.send({
                status: '200',
                data: {
                    autor, defendant
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
