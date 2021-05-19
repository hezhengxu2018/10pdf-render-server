const pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
const { createCanvas } = require("canvas");

function renderPDFImage(pdfPath, vp = 1, pageNum = 1) {
  const loadingTask = pdfjsLib.getDocument(pdfPath);
  return new Promise((resolve, reject) => {
    loadingTask.promise.then((doc) => {
      const {numPages} = doc;
      if (pageNum > numPages || pageNum < 1) {
        reject("pageNum Error");
      }
      doc
        .getPage(pageNum)
        .then((page) => {
          const viewport = page.getViewport({ scale: vp });
          const canvas = createCanvas(viewport.width, viewport.height);
          const ctx = canvas.getContext("2d");
          const renderContext = {
            canvasContext: ctx,
            viewport,
          };
          try {
            page.render(renderContext).promise.then(() => {
              resolve(canvas.toBuffer());
            });
          } catch (error) {
            reject(error);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
}

function renderPDFTextContent(pdfPath, pageNum = 1, vp = 1.5) {
  const loadingTask = pdfjsLib.getDocument(pdfPath);
  return new Promise((resolve, reject) => {
    loadingTask.promise.then((doc) => {
      const {numPages} = doc;
      if (pageNum > numPages || pageNum < 1) {
        reject("pageNum Error");
      }
      doc.getPage(pageNum).then((page) => {
        const viewport = page.getViewport({ scale: vp });
        page.getTextContent().then((res) => {
          resolve({ textContent: res, viewport });
        });
      });
    });
  });
}

function getPDFMetadata(pdfPath) {
  const loadingTask = pdfjsLib.getDocument(pdfPath);
  return new Promise((resolve, reject) => {
    loadingTask.promise.then((doc) => {
      const {numPages} = doc;
      let metaData = "";
      let info = "";
      doc.getMetadata().then((data) => {
        info = data.info;
        if (data.metadata) {
          metaData = data.metadata.getAll();
        }
        resolve({ numPages, metaData, info });
      });
    });
  });
}

module.exports.renderPDFImage = renderPDFImage;
module.exports.renderPDFTextContent = renderPDFTextContent;
module.exports.getPDFMetadata = getPDFMetadata;
