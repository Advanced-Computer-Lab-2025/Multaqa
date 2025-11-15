import PDFDocument from 'pdfkit';

interface CertificateData {
    firstName: string;
    lastName: string;
    workshopName: string;
    startDate: Date;
    endDate: Date;
    issueDate?: Date;
}

export class CertificateService {

    static generateCertificatePDF(data: CertificateData): Promise<Buffer> {
        const { firstName, lastName, workshopName, startDate, endDate, issueDate = new Date() } = data;

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margin: 0
            });

            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const width = doc.page.width;
            const height = doc.page.height;

            // Background gradient effect (light purple/pink gradient)
            doc.rect(0, 0, width, height)
                .fill('#f8f4ff');

            // Decorative circles - top left (blue)
            doc.circle(80, 80, 60)
                .fill('#5B8DBE');
            doc.circle(50, 120, 35)
                .fill('#8FB8E8');
            
            // Decorative circles - top right (purple)
            doc.circle(width - 80, 60, 45)
                .fill('#9D4EDD');
            doc.circle(width - 120, 100, 30)
                .fill('#C77DFF');
            doc.circle(width - 60, 110, 25)
                .fill('#E0AAFF');

            // Decorative circles - bottom left (purple)
            doc.circle(90, height - 90, 50)
                .fill('#9D4EDD');
            doc.circle(140, height - 70, 35)
                .fill('#C77DFF');
            
            // Decorative circles - bottom right (blue/teal)
            doc.circle(width - 100, height - 100, 55)
                .fill('#5B8DBE');
            doc.circle(width - 60, height - 140, 40)
                .fill('#7FA8D1');
            doc.circle(width - 140, height - 60, 30)
                .fill('#8FB8E8');

            // Main white card with shadow effect
            const cardX = 120;
            const cardY = 80;
            const cardWidth = width - 240;
            const cardHeight = height - 160;

            // Shadow
            doc.rect(cardX + 5, cardY + 5, cardWidth, cardHeight)
                .fill('#00000010');

            // White card
            doc.rect(cardX, cardY, cardWidth, cardHeight)
                .fill('#FFFFFF');

            // Purple border accent (left side)
            doc.rect(cardX, cardY, 8, cardHeight)
                .fill('#9D4EDD');

            // Top decorative line
            doc.moveTo(cardX + 60, cardY + 50)
                .lineTo(cardX + cardWidth - 60, cardY + 50)
                .lineWidth(2)
                .strokeOpacity(0.2)
                .stroke('#9D4EDD');

            // MULTAQA Logo text (top left of card)
            // doc.fontSize(16)
            //     .font('Helvetica-Bold')
            //     .fillColor('#9D4EDD')
            //     .text('MULTAQA', cardX + 40, cardY + 25);

            // // "GUC" subtitle
            // doc.fontSize(10)
            //     .font('Helvetica')
            //     .fillColor('#666')
            //     .text('GERMAN UNIVERSITY IN CAIRO', cardX + 40, cardY + 45);

            // Main title "CERTIFICATE"
            doc.fontSize(48)
                .font('Helvetica-Bold')
                .fillColor('#5B8DBE')
                .text('CERTIFICATE', 0, cardY + 90, {
                    align: 'center',
                    width: width
                });

            // Subtitle "OF ACHIEVEMENT"
            doc.fontSize(16)
                .font('Helvetica')
                .fillColor('#9D4EDD')
                .text('OF ACHIEVEMENT', 0, cardY + 145, {
                    align: 'center',
                    width: width,
                    characterSpacing: 2
                });

            // Decorative line under subtitle
            doc.moveTo(width / 2 - 100, cardY + 170)
                .lineTo(width / 2 + 100, cardY + 170)
                .lineWidth(1)
                .strokeOpacity(0.3)
                .stroke('#9D4EDD');

            // "This certificate is proudly presented to"
            doc.fontSize(12)
                .font('Helvetica')
                .fillColor('#888')
                .text('This certificate is proudly presented to', 0, cardY + 190, {
                    align: 'center',
                    width: width
                });

            // Name (handwriting style simulation with italic)
            doc.fontSize(42)
                .font('Helvetica-BoldOblique')
                .fillColor('#9D4EDD')
                .text(`${firstName} ${lastName}`, 0, cardY + 215, {
                    align: 'center',
                    width: width
                });

            // Decorative underline for name
            doc.moveTo(width / 2 - 180, cardY + 265)
                .lineTo(width / 2 + 180, cardY + 265)
                .lineWidth(1)
                .strokeOpacity(0.4)
                .stroke('#9D4EDD');

            // Workshop description
            doc.fontSize(11)
                .font('Helvetica')
                .fillColor('#666')
                .text('For successfully completing the workshop', 0, cardY + 285, {
                    align: 'center',
                    width: width
                });

            // Workshop name
            doc.fontSize(20)
                .font('Helvetica-Bold')
                .fillColor('#333')
                .text(workshopName, cardX + 100, cardY + 310, {
                    align: 'center',
                    width: cardWidth - 200
                });

            // Date formatting
            const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Workshop duration
            doc.fontSize(11)
                .font('Helvetica')
                .fillColor('#666')
                .text(`Held from ${formatDate(startDate)} to ${formatDate(endDate)}`, 0, cardY + 355, {
                    align: 'center',
                    width: width
                });

            // Issue date
            doc.fontSize(9)
                .fillColor('#666')
                .text(`Issued: ${issueDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}`, cardX + 50, cardY + cardHeight - 45);

            // Footer - Multaqa info
            doc.fontSize(8)
                .font('Helvetica')
                .fillColor('#999')
                .text('© Multaqa - GUC Campus Events Platform', 0, height - 30, {
                    align: 'center',
                    width: width
                });

            doc.end();
        });
    }

   
}