/** @format */

import PdfPrinter from "pdfmake"
import imageToBase64 from "image-to-base64"
import fs from "fs-extra"

export const getPDFReadableStream = (products) => {
  //console.log(products)
  const imageToPdf = async () => {
    const response = await imageToBase64(products.imageUrl) // Image URL
      .then((response) => {
        //console.log(response)
        return response
      })
      .catch((error) => {
        console.log(error)
        return response
      })
  }
  //   const imageUrl = await imageToPdf()
  //   console.log(imageUrl)
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
    },
  }

  const printer = new PdfPrinter(fonts)

  const docDefinition = {
    content: [
      {
        text: `${products.name}`,
        style: "header",
      },
      {
        text: `${products.brand}`,
        style: "header",
      },
      {
        text: `${products.category}`,
        style: "header",
      },
      {
        text: `${products.price}`,
        style: "subheader",
      },
      {
        text: `${products.description}`,
        style: "small",
      },
      {
        //image: fs.readFileSync(products.imageUrl, "base64"),
        //image: products.imageUrl,
        //image: `data:image/jpeg;base64,${imageToPdf}`,
        //image: `${products.imageUrl}`,
      },
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()

  return pdfReadableStream
}
