import QRCode from 'qrcode';
import { Buffer } from 'buffer';

export async function generateQrCodeBuffer(
    eventName: string,
    location: string,
    eventDate: string,
): Promise<Buffer> {
    const startDate = new Date(eventDate);
    
    // Use an explicit date format that includes the month name (long text) 
    // to break up the number sequence and prevent phone number detection.
    const formatDate = startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const payload = [
        "** ACCESS PASS CONFIRMED **",
        "---",
        `Event: ${eventName}`,
        `Location: ${location}`,
        `Date: ${formatDate}`, 
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