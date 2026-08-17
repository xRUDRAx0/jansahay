const fs = require("fs");
const PDFParser = require("pdf2json");

function readPdf(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      console.log("=== TEXT FROM:", filePath, "===");
      console.log("Pages:", pdfData.Pages.length);
      pdfData.Pages.forEach((page, i) => {
        console.log(`\n--- Page ${i + 1} ---`);
        const texts = page.Texts.map(t => 
          t.R.map(r => decodeURIComponent(r.T)).join("")
        );
        console.log(texts.join(" "));
      });
      console.log("\n=== END ===\n");
      resolve();
    });
    pdfParser.loadPDF(filePath);
  });
}

(async () => {
  await readPdf("C:\\Users\\Lenovo-LOQ\\Desktop\\c8f8edbc-6136-4188-986b-f2dd180ac8cf.pdf");
  await readPdf("C:\\Users\\Lenovo-LOQ\\Desktop\\wellcall.pdf");
})();
