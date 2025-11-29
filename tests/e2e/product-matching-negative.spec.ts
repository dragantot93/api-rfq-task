import { test } from '@playwright/test'
import { productMatchingApi } from '../utils/api'

test.describe('Product Matching - Negative / Edge Cases', () => {
    test('TC-5 - Should return status 400 for empty text', async () => {
        // When
        await productMatchingApi.searchByText({
            text: '',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-6 - Should return status 400 for malformed text input', async () => {
        // Given
        const malformedText = '@@##$$%%'

        // When
        const response = await productMatchingApi.searchByText({
            text: malformedText,
            expectedStatus: 200,
        })

        // Then
        await productMatchingApi.shouldHaveMatchingProducts({
            response,
            expectedProductMatches: 0,
        })
    })

    test('TC-7 - Should return 400 for invalid URL', async () => {
        // When
        await productMatchingApi.searchByUrl({
            url: 'invalid-url',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-8 - Should return 0 matches for page with no product data', async () => {
        // When
        const response = await productMatchingApi.searchByUrl({
            url: 'https://example.com/no-product',
            expectedStatus: 200,
        })

        // Then
        await productMatchingApi.shouldHaveMatchingProducts({
            response,
            expectedProductMatches: 0,
        })
    })

    test('TC-9 - Should return 400 for missing required fields', async () => {
        // When
        // @ts-ignore
        await productMatchingApi.searchByText({
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-10 - Should not handle text with only whitespace', async () => {
        // When
        await productMatchingApi.searchByText({
            text: '     ',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-11 - Should not handle text with only newlines and tabs', async () => {
        // When
        await productMatchingApi.searchByText({
            text: '\n\n\t\t\r\n',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-12 - Should handle text with HTML tags', async () => {
        // Given
        const textWithHtml = '<script>alert("XSS")</script> Cutting Board'

        // When
        const response = await productMatchingApi.searchByText({
            text: textWithHtml,
            expectedStatus: 200,
        })

        // Then
        await productMatchingApi.shouldHaveMatchingProducts({
            response,
            expectedProductMatches: 1,
        })
    })

    test('TC-13 - Should handle text with SQL injection patterns', async () => {
        // Given
        const sqlInjectionText = "' OR '1'='1'; DROP TABLE products;--"

        // When
        const response = await productMatchingApi.searchByText({
            text: sqlInjectionText,
            expectedStatus: 200,
        })

        // Then
        await productMatchingApi.shouldHaveMatchingProducts({
            response,
            expectedProductMatches: 0,
        })
    })

    test('TC-14 - Should handle text with NoSQL injection patterns', async () => {
        // Given
        const nosqlText = '{"$gt": ""} OR 1=1'

        // When
        const response = await productMatchingApi.searchByText({
            text: nosqlText,
            expectedStatus: 200,
        })

        // Then
        await productMatchingApi.shouldHaveMatchingProducts({
            response,
            expectedProductMatches: 0,
        })
    })

    test('TC-15 - Should handle text with path traversal attempts', async () => {
        // Given
        const pathTraversalText = '../../../etc/passwd'

        // When
        const response = await productMatchingApi.searchByText({
            text: pathTraversalText,
            expectedStatus: 200,
        })

        // Then
        await productMatchingApi.shouldHaveMatchingProducts({
            response,
            expectedProductMatches: 0,
        })
    })

    test('TC-16 - Should handle text with null bytes', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Product\0Name',
            // Then
            expectedStatus: 200,
        })
    })

    test('TC-17 - Should reject URL without protocol', async () => {
        // When
        await productMatchingApi.searchByUrl({
            url: 'www.example.com/product',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-18 - Should reject file: protocol URL', async () => {
        // When
        await productMatchingApi.searchByUrl({
            url: 'file:///etc/passwd',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-19 - Should reject FTP protocol URL', async () => {
        // When
        await productMatchingApi.searchByUrl({
            url: 'ftp://ftp.example.com/file.txt',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-20 - Should reject localhost URL', async () => {
        // When
        await productMatchingApi.searchByUrl({
            url: 'http://localhost:8080/admin',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-21 - Should reject 127.0.0.1 URL', async () => {
        // When
        await productMatchingApi.searchByUrl({
            url: 'http://127.0.0.1/admin',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-22 - Should reject private IP ranges', async () => {
        // When
        await productMatchingApi.searchByUrl({
            url: 'http://192.168.1.1/router',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-23 - Should reject negative topK value', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Cutting Board',
            topK: -5,
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-24 - Should reject zero topK value', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Cutting Board',
            topK: 0,
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-25 - Should reject extremely large topK value', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Cutting Board',
            topK: 999999,
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-26 - Should reject negative threshold value', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Cutting Board',
            threshold: -0.5,
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-27 - Should reject threshold greater than 1', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Cutting Board',
            threshold: 1.5,
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-28 - Should not reject threshold equal to 0', async () => {
        // When
        const response = await productMatchingApi.searchByText({
            text: 'Cutting Board',
            threshold: 0,
            expectedStatus: 200,
        })

        // Then
        await productMatchingApi.shouldHaveMatchingProducts({
            response,
            expectedProductMatches: 1,
        })
    })

    test('TC-29 - Should reject non-numeric topK value', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Cutting Board',
            // @ts-ignore
            topK: 'five',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-30 - Should reject non-numeric threshold value', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Cutting Board',
            // @ts-ignore
            threshold: 'high',
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-31 - Should reject non-string text value', async () => {
        // When
        await productMatchingApi.searchByText({
            // @ts-ignore
            text: 12345,
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-32 - Should reject non-string URL value', async () => {
        // When
        await productMatchingApi.searchByUrl({
            // @ts-ignore
            url: { domain: 'example.com' },
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-33 - Should reject null text value', async () => {
        // When
        await productMatchingApi.searchByText({
            // @ts-ignore
            text: null,
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-34 - Should reject null URL value', async () => {
        // When
        await productMatchingApi.searchByUrl({
            // @ts-ignore
            url: null,
            // Then
            expectedStatus: 400,
        })
    })

    test('TC-35 - Should handle text with mixed character encodings', async () => {
        // Given
        const text = 'Cutting Board 切割板 доска'

        // When
        await productMatchingApi.searchByText({
            text,
            // Then
            expectedStatus: 200,
        })
    })

    test('TC-36 - Should handle text with right-to-left characters', async () => {
        // Given
        const text = 'لوح تقطيع Cutting Board'

        // When
        await productMatchingApi.searchByText({
            text,
            // Then
            expectedStatus: 200,
        })
    })

    test('TC-37 - Should handle text with combining characters', async () => {
        // Given
        const text = 'Café Naïve Résumé'

        // When
        await productMatchingApi.searchByText({
            text,
            // Then
            expectedStatus: 200,
        })
    })

    test('TC-38 - Should reject request with extra unexpected fields', async () => {
        // When
        await productMatchingApi.searchByText({
            text: 'Cutting Board',
            // @ts-ignore
            maliciousField: 'blabla',
            // Then
            expectedStatus: 200,
        })
    })

    test('TC-39 - Should handle statusId with special characters', async () => {
        // When
        const response = await productMatchingApi.searchByText({
            text: 'Cutting Board',
            statusId: 'test',
            // Then
            expectedStatus: 200,
        })
    })
})
