import PDFDocument from 'pdfkit';

interface CertificateData {
	firstName: string;
	lastName: string;
	workshopName: string;
	startDate: Date;
	endDate: Date;
	issueDate?: Date;
}

export class pdfGenerator {

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

			// Background gradient effect (light blue/purple gradient)
			doc.rect(0, 0, width, height)
				.fill('#f0f4ff');

			// Color palette: Bluish purple theme
			const colors = {
				primary: '#6B46C1',     // Rich bluish-purple
				secondary: '#5B8DBE',   // Medium blue
				accent: '#8B5FBF',      // Soft purple
				lightBlue: '#A3BFFA',   // Light blue
				lightPurple: '#C4B5FD', // Light purple
				darkBlue: '#4C63B6',    // Dark blue
				textPrimary: '#4A5568', // Dark gray for text
				textSecondary: '#718096' // Medium gray for text
			};

			// Decorative circles - top left (bluish purple)
			doc.circle(80, 80, 60)
				.fill(colors.secondary);
			doc.circle(50, 120, 35)
				.fill(colors.lightBlue);

			// Decorative circles - top right (purple shades)
			doc.circle(width - 80, 60, 45)
				.fill(colors.primary);
			doc.circle(width - 120, 100, 30)
				.fill(colors.accent);
			doc.circle(width - 60, 110, 25)
				.fill(colors.lightPurple);

			// Decorative circles - bottom left (purple-blue mix)
			doc.circle(90, height - 90, 50)
				.fill(colors.accent);
			doc.circle(140, height - 70, 35)
				.fill(colors.lightPurple);

			// Decorative circles - bottom right (blue shades)
			doc.circle(width - 100, height - 100, 55)
				.fill(colors.darkBlue);
			doc.circle(width - 60, height - 140, 40)
				.fill(colors.secondary);
			doc.circle(width - 140, height - 60, 30)
				.fill(colors.lightBlue);

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

			// Bluish purple border accent (left side)
			doc.rect(cardX, cardY, 8, cardHeight)
				.fill(colors.primary);

			// Top decorative line
			doc.moveTo(cardX + 60, cardY + 50)
				.lineTo(cardX + cardWidth - 60, cardY + 50)
				.lineWidth(2)
				.strokeOpacity(0.2)
				.stroke(colors.primary);

			// Main title "CERTIFICATE"
			doc.fontSize(48)
				.font('Helvetica-Bold')
				.fillColor(colors.primary)
				.text('CERTIFICATE', 0, cardY + 90, {
					align: 'center',
					width: width
				});

			// Subtitle "OF ACHIEVEMENT"
			doc.fontSize(16)
				.font('Helvetica')
				.fillColor(colors.primary)
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
				.stroke(colors.primary);

			// "This certificate is proudly presented to"
			doc.fontSize(12)
				.font('Helvetica')
				.fillColor(colors.textSecondary)
				.text('This certificate is proudly presented to', 0, cardY + 190, {
					align: 'center',
					width: width
				});

			// Name (handwriting style simulation with italic)
			doc.fontSize(42)
				.font('Helvetica-BoldOblique')
				.fillColor(colors.darkBlue)
				.text(`${firstName} ${lastName}`, 0, cardY + 215, {
					align: 'center',
					width: width
				});

			// Decorative underline for name
			doc.moveTo(width / 2 - 180, cardY + 265)
				.lineTo(width / 2 + 180, cardY + 265)
				.lineWidth(1)
				.strokeOpacity(0.4)
				.stroke(colors.primary);

			// Workshop description
			doc.fontSize(11)
				.font('Helvetica')
				.fillColor(colors.textSecondary)
				.text('For successfully completing the workshop', 0, cardY + 285, {
					align: 'center',
					width: width
				});

			// Workshop name
			doc.fontSize(20)
				.font('Helvetica-Bold')
				.fillColor(colors.textPrimary)
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
				.fillColor(colors.textSecondary)
				.text(`Held from ${formatDate(startDate)} to ${formatDate(endDate)}`, 0, cardY + 355, {
					align: 'center',
					width: width
				});

            doc.end();
        });
    }

  
static buildQrCodePdfBuffer(
    qrCodeDataArray: any[], 
    eventName: string
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const title = `Event QR Codes - ${eventName}`;

        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 72, bottom: 72, left: 72, right: 72 }, 
            info: { Title: title } 
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;
        const qrSize = 300; 
        const margin = 72; // Consistent with doc margins

        // Loop through all QR codes to add them to the PDF
        qrCodeDataArray.forEach((qrData, index) => {
            
            // If it's not the first QR code, start a new page
            if (index > 0) {
                doc.addPage();
            }

            // 1. Main PDF Title
            doc.fontSize(24)
               .font('Helvetica-Bold')
               .fillColor('#4A5568')
               .text(eventName, margin, margin);

            // 2. Attendee Name (Title of this specific QR code/page)
            doc.fontSize(16)
               .font('Helvetica')
               .fillColor('#718096')
               .text(`Attendee: ${qrData.name}`, margin, margin + 40);

            // 3. Calculate position to center the image horizontally
            const xPos = (pageWidth / 2) - (qrSize / 2);
            // Adjust Y position to be centered below the titles
            const yPos = (pageHeight / 2) - (qrSize / 2) + 40; 

            // 4. Add the QR code image to the PDF
            doc.image(qrData.buffer, xPos, yPos, {
                fit: [qrSize, qrSize],
                align: 'center',
                valign: 'center'
            });

        });

        // Finalize the PDF
        doc.end();
    });
}   
}