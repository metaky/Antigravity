
import { RagEngine } from '../src/lib/rag-engine';

async function testRag() {
    const rag = new RagEngine();
    await rag.init();

    // Test retrieval with a term from the specific RTF content we saw
    const results = await rag.retrieve("autonomy neuroception", 5);

    console.log("--- RAG Retrieval Test ---");
    console.log(`Found ${results.length} chunks.`);
    results.forEach((r, i) => {
        console.log(`\n[Result ${i + 1}] Source: ${r.source}`);
        console.log(`Content Preview: ${r.content.substring(0, 150)}...`);
    });
}

testRag().catch(console.error);
