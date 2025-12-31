const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function createTestPdfs() {
    // Create a mock behavior incident report
    const behaviorDoc = await PDFDocument.create();
    const behaviorPage = behaviorDoc.addPage();
    behaviorPage.drawText('BEHAVIOR INCIDENT REPORT', { x: 50, y: 700, size: 18 });
    behaviorPage.drawText('Student: John Smith', { x: 50, y: 650, size: 12 });
    behaviorPage.drawText('Date: December 15, 2024', { x: 50, y: 630, size: 12 });
    behaviorPage.drawText('Location: Classroom 204', { x: 50, y: 610, size: 12 });
    behaviorPage.drawText('', { x: 50, y: 580, size: 12 });
    behaviorPage.drawText('Description of Incident:', { x: 50, y: 560, size: 12 });
    behaviorPage.drawText('Student refused to complete math worksheet.', { x: 50, y: 540, size: 12 });
    behaviorPage.drawText('When teacher insisted, student became upset', { x: 50, y: 520, size: 12 });
    behaviorPage.drawText('and left the classroom without permission.', { x: 50, y: 500, size: 12 });
    behaviorPage.drawText('Student was found in hallway after 10 minutes.', { x: 50, y: 480, size: 12 });
    behaviorPage.drawText('', { x: 50, y: 460, size: 12 });
    behaviorPage.drawText('Actions Taken:', { x: 50, y: 440, size: 12 });
    behaviorPage.drawText('- Staff followed student to ensure safety', { x: 50, y: 420, size: 12 });
    behaviorPage.drawText('- Student was sent to office', { x: 50, y: 400, size: 12 });
    behaviorPage.drawText('- Parent was notified', { x: 50, y: 380, size: 12 });

    const behaviorBytes = await behaviorDoc.save();
    fs.writeFileSync(path.join(__dirname, 'test_behavior_report.pdf'), behaviorBytes);

    // Create a mock IEP document
    const iepDoc = await PDFDocument.create();
    const iepPage1 = iepDoc.addPage();
    iepPage1.drawText('INDIVIDUALIZED EDUCATION PROGRAM (IEP)', { x: 50, y: 700, size: 16 });
    iepPage1.drawText('Student: John Smith', { x: 50, y: 650, size: 12 });
    iepPage1.drawText('Disability: Autism Spectrum Disorder with PDA profile', { x: 50, y: 630, size: 12 });
    iepPage1.drawText('', { x: 50, y: 600, size: 12 });
    iepPage1.drawText('ACCOMMODATIONS:', { x: 50, y: 580, size: 14 });
    iepPage1.drawText('1. Provide choices whenever possible', { x: 50, y: 560, size: 12 });
    iepPage1.drawText('2. Allow breaks upon request', { x: 50, y: 540, size: 12 });
    iepPage1.drawText('3. Use declarative language instead of direct demands', { x: 50, y: 520, size: 12 });
    iepPage1.drawText('4. Provide sensory breaks every 30 minutes', { x: 50, y: 500, size: 12 });
    iepPage1.drawText('5. Allow access to quiet space when overwhelmed', { x: 50, y: 480, size: 12 });
    iepPage1.drawText('6. Avoid sudden transitions; provide 5-minute warnings', { x: 50, y: 460, size: 12 });
    iepPage1.drawText('', { x: 50, y: 440, size: 12 });
    iepPage1.drawText('BEHAVIOR PLAN:', { x: 50, y: 420, size: 14 });
    iepPage1.drawText('- Staff should not escalate conflicts', { x: 50, y: 400, size: 12 });
    iepPage1.drawText('- Provide co-regulation support during distress', { x: 50, y: 380, size: 12 });
    iepPage1.drawText('- Allow student to leave situation if overwhelmed', { x: 50, y: 360, size: 12 });
    iepPage1.drawText('- Do not use punishment-based approaches', { x: 50, y: 340, size: 12 });

    const iepBytes = await iepDoc.save();
    fs.writeFileSync(path.join(__dirname, 'test_iep.pdf'), iepBytes);

    console.log('Created test PDFs:');
    console.log('- test_behavior_report.pdf');
    console.log('- test_iep.pdf');
}

createTestPdfs().catch(console.error);
