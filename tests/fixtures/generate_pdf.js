const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createPdf() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText('This is a valid PDF for testing Antigravity IEP Tool.');

    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, 'valid.pdf');
    fs.writeFileSync(outputPath, pdfBytes);
    console.log('Created valid.pdf at', outputPath);
}

createPdf().catch(console.error);
