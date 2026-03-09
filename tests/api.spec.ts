import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('POST /api/analyze requires challenge token', async ({ request }) => {
    // 1. Get Challenge Token
    const challengeRes = await request.get('/api/challenge');
    expect(challengeRes.ok()).toBeTruthy();
    const { challengeId } = await challengeRes.json();

    // 2. Perform Analysis with Token
    const filePath = path.join(__dirname, 'fixtures/valid.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    const response = await request.post('/api/analyze', {
        headers: {
            'X-Challenge-Id': challengeId,
        },
        multipart: {
            file: { name: 'test.pdf', mimeType: 'application/pdf', buffer: fileBuffer },
        },
    });

    // We verify it PASSED the challenge gate (not a 403)
    // It might 500 if Gemini API is not reachable locally, but that's acceptable for this test
    expect(response.status()).not.toBe(403);
});

test('POST /api/analyze fails without challenge token (403)', async ({ request }) => {
    const filePath = path.join(__dirname, 'fixtures/valid.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    const response = await request.post('/api/analyze', {
        multipart: {
            file: { name: 'test.pdf', mimeType: 'application/pdf', buffer: fileBuffer },
        },
    });

    expect(response.status()).toBe(403);
});

test('POST /api/analyze fails with reused token (Single-use)', async ({ request }) => {
    const challengeRes = await request.get('/api/challenge');
    const { challengeId } = await challengeRes.json();

    const filePath = path.join(__dirname, 'fixtures/valid.pdf');
    const fileBuffer = fs.readFileSync(filePath);
    const payload = {
        headers: { 'X-Challenge-Id': challengeId },
        multipart: {
            file: { name: 'test.pdf', mimeType: 'application/pdf', buffer: fileBuffer },
        },
    };

    // First use: Should NOT be 403
    const res1 = await request.post('/api/analyze', payload);
    expect(res1.status()).not.toBe(403);

    // Second use: MUST be 403
    const res2 = await request.post('/api/analyze', payload);
    expect(res2.status()).toBe(403);
});
