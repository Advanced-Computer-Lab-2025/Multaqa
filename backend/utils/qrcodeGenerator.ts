import QRCode from 'qrcode';
import { Buffer } from 'buffer';

export async function generateQrCodeBuffer(
    eventName: string,
    location: string,
    eventDate: string,
    attendeeName: string,
): Promise<Buffer> {

    const payload = [
        "** ACCESS PASS CONFIRMED **",
        "---",
        `Event: ${eventName}`,
        `Location: ${location}`,
        `Date: ${eventDate}`, 
        "---",
        `Attendee: ${attendeeName}`,
        "---",
        
    ];
    const text = payload.join('\n').trim();
   
    // Generate the QR code as a raw PNG Buffer directly
    const qrBuffer = await QRCode.toBuffer(text, {
        type: 'png',
        errorCorrectionLevel: 'M',
        width: 300,
        margin: 2
    });

    return qrBuffer;
}