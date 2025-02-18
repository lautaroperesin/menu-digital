import QRCode from 'qrcode';

export async function generateTableQR(mesaId) {
  const url = `http://192.168.10.101:3000/menu?mesa=${mesaId}`;
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url);
    return qrCodeDataUrl;
  } catch (err) {
    console.error('Error generando QR:', err);
    return null;
  }
}