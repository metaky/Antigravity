
import fs from 'fs';
import path from 'path';

// Replicating the logic from RagEngine to verify it
function testParsing() {
    const docsDir = path.join(process.cwd(), 'src/data/rag_docs');
    if (fs.existsSync(docsDir)) {
        const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.txt') || f.endsWith('.rtf'));

        console.log(`Found ${files.length} files.`);

        for (const file of files) {
            console.log(`\n--- Processing ${file} ---`);
            let content = fs.readFileSync(path.join(docsDir, file), 'utf-8');

            // Logic from RagEngine
            if (file.endsWith('.rtf')) {
                const originalLength = content.length;
                console.log(`Original RTF length: ${originalLength}`);

                content = content
                    .replace(/\\par/g, '\n') // Handle newlines
                    .replace(/\\tab/g, '\t')
                    .replace(/[{}]/g, '') // Remove braces
                    .replace(/\\[a-z0-9]+\s?/g, '') // Remove commands like \cf0, \fs24
                    .replace(/\\\*/g, '')
                    .replace(/;/g, '');

                console.log(`Cleaned length: ${content.length}`);
            }

            const parts = content.split('\n').filter(line => line.trim().length > 20);

            console.log(`Extracted ${parts.length} meaningful chunks.`);
            if (parts.length > 0) {
                console.log("First chunk preview:", parts[0].substring(0, 100));
                console.log("Middle chunk preview:", parts[Math.floor(parts.length / 2)].substring(0, 100));
            }
        }
    } else {
        console.log("Docs dir not found");
    }
}

testParsing();
