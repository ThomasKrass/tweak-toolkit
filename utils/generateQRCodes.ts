import QRCode from 'qrcode'

/**
 * Creates and downloads a QR code for the given value.
 *
 * @param value the value to generate the QR code for
 */
function generateQRCode(value: string) {
  try {
    QRCode.toDataURL(value, { errorCorrectionLevel: 'high' }).then(
      (dataUrl) => {
        // Create a link element to trigger the download
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `qr_code-${value}.png`

        // Append the link to the DOM and simulate a click to start the download
        document.body.appendChild(link)
        link.click()

        // Remove the link from the DOM
        document.body.removeChild(link)
      },
    )
  } catch {
    /* empty */
  }
}

/**
 * Creates and downloads QR codes for the given values.
 *
 * @param values the values to generate QR codes for
 */
export default function generateQRCodes(values: string[]) {
  values.forEach((value) => generateQRCode(value))
}
