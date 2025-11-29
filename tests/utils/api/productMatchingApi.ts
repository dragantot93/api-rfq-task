import BaseApi from './base.api'
import { APIResponse, expect } from '@playwright/test'

export default class ProductMatchingApi extends BaseApi {
    async searchByText(options: {
        text: string
        statusId?: string
        topK?: number
        threshold?: number
        enablePrivateLabelRanking?: boolean
        enableStockProductRanking?: boolean
        enableVendorRanking?: boolean
        enableProductRanking?: boolean
        useOldReranking?: boolean
        expectedStatus?: number
    }): Promise<APIResponse> {
        const response = await this.sendRequest({
            method: 'POST',
            url: '/api/rfq/upload-free-text',
            data: {
                statusId: options.statusId ?? 'string',
                text: options.text,
                topK: options.topK ?? 3,
                threshold: options.threshold ?? 0.5,
                enablePrivateLabelRanking: options.enablePrivateLabelRanking ?? false,
                enableStockProductRanking: options.enableStockProductRanking ?? false,
                enableVendorRanking: options.enableVendorRanking ?? false,
                enableProductRanking: options.enableProductRanking ?? false,
                useOldReranking: options.useOldReranking ?? true,
            },
        })

        expect(response.status()).toBe(options.expectedStatus ?? 200)

        return response
    }

    async searchByUrl(options: {
        url: string
        statusId?: string
        topK?: number
        threshold?: number
        enablePrivateLabelRanking?: boolean
        enableStockProductRanking?: boolean
        enableVendorRanking?: boolean
        enableProductRanking?: boolean
        useOldReranking?: boolean
        expectedStatus?: number
    }): Promise<APIResponse> {
        const response = await this.sendRequest({
            method: 'POST',
            url: '/api/rfq/upload-url-html',
            data: {
                statusId: options.statusId ?? 'string',
                url: options.url,
                topK: options.topK ?? 3,
                threshold: options.threshold ?? 0.5,
                enablePrivateLabelRanking: options.enablePrivateLabelRanking ?? false,
                enableStockProductRanking: options.enableStockProductRanking ?? false,
                enableVendorRanking: options.enableVendorRanking ?? false,
                enableProductRanking: options.enableProductRanking ?? false,
                useOldReranking: options.useOldReranking ?? true,
            },
        })

        expect(response.status()).toBe(options.expectedStatus ?? 200)

        return response
    }

    async shouldHaveMatchingProducts(options: { response: APIResponse; expectedProductMatches: number; expectedInternalMatches?: number }) {
        // Get JSON from the response
        const responseJson = await options.response.json()
        const matchedItems = responseJson.result.matchedItems
        const matchedItemsCount = matchedItems.length

        expect(matchedItemsCount, `Expected exactly ${options.expectedProductMatches} top-level matched items`).toBe(
            options.expectedProductMatches,
        )

        if (options.expectedProductMatches !== 0) {
            let internalMatchesCount = 0

            for (const item of matchedItems) {
                if (item.matchedInternalProducts && item.matchedInternalProducts.length > 0) {
                    internalMatchesCount += item.matchedInternalProducts.length
                }
            }

            if (options.expectedInternalMatches !== undefined) {
                expect(internalMatchesCount, `Expected exactly ${options.expectedInternalMatches} internal matched products`).toBe(
                    options.expectedInternalMatches,
                )
            }
        }
    }

    async shouldHaveAtLeastOneWordMatchingInFoundProduct(options: { response: any; productTerms: string[] }) {
        const responseBody = await options.response.json()

        const matches = responseBody.result.matchedItems.some((matchedItem: any) =>
            matchedItem.matchedInternalProducts.some((internalProduct: any) => {
                const productName = (internalProduct.name || '').toLowerCase()
                return options.productTerms.some(term => productName.includes(term.toLowerCase()))
            }),
        )

        expect(
            matches,
            `Expected at least one internal product name to contain one of these terms: ${options.productTerms.join(', ')}, but none matched.`,
        ).toBeTruthy()
    }

    async shouldHaveValidSimilarityPercentages(options: { response: APIResponse }) {
        const responseBody = await options.response.json()

        for (const item of responseBody.result.matchedItems) {
            if (!item.matchedInternalProducts) continue

            for (const product of item.matchedInternalProducts) {
                if (product.percentage !== undefined) {
                    expect(product.percentage, {
                        message: `Expected percentage to be >= 0, but got ${product.percentage} for product "${product.productName ?? 'unknown'}".`,
                    }).toBeGreaterThanOrEqual(0)

                    expect(product.percentage, {
                        message: `Expected percentage to be <= 100, but got ${product.percentage} for product "${product.productName ?? 'unknown'}".`,
                    }).toBeLessThanOrEqual(100)
                }
            }
        }
    }

    async shouldHaveMatchingSimilarityPercentageGreaterThan(options: { response: APIResponse; percentage: number }) {
        const responseBody = await options.response.json()

        for (const item of responseBody.result.matchedItems) {
            if (!item.matchedInternalProducts) continue

            for (const product of item.matchedInternalProducts) {
                if (product.percentage !== undefined) {
                    expect(product.percentage, {
                        message: `Expected percentage to be greater than ${options.percentage}, but got ${product.percentage} for product "${product.productName ?? 'unknown'}".`,
                    }).toBeGreaterThan(options.percentage)
                }
            }
        }
    }

    async searchByInputtedType(options: { type: string; input: string }): Promise<APIResponse> {
        let response: APIResponse

        if (options.type === 'text') {
            response = await this.searchByText({ text: options.input, ...options })
        } else if (options.type === 'url') {
            response = await this.searchByUrl({ url: options.input, ...options })
        } else {
            throw new Error(`Unknown test type: ${options.type}`)
        }

        return response
    }
}
