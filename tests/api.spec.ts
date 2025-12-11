import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('POST /api/analyze returns mock analysis for valid PDF', async ({ request }) => {
    const filePath = path.join(__dirname, 'fixtures/valid.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    const response = await request.post('/api/analyze', {
        multipart: {
            file: {
                name: 'test.pdf',
                mimeType: 'application/pdf',
                buffer: fileBuffer,
            },
        },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.summary).toContain("Analyzed document");
    expect(json.data.goals.length).toBeGreaterThan(0);
    expect(json.data.contextUsed).toBeDefined();
});

test('POST /api/analyze fails without file', async ({ request }) => {
    const response = await request.post('/api/analyze', {});
    expect(response.status()).toBe(400);
});
