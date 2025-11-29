import { test } from '@playwright/test'
import { productMatchingApi } from '../utils/api'
import testData from '../helpers/testData.json' assert { type: 'json' }

test.describe('Product Matching API - Positive Tests', () => {
    for (const tc of testData) {
        test(`${tc.id} - Should successfully match ${tc.description}`, async () => {
            // When
            let response = await productMatchingApi.searchByInputtedType({
                type: tc.type,
                input: tc.input,
            })

            // Then
            await productMatchingApi.shouldHaveMatchingProducts({
                response,
                expectedProductMatches: tc.expectedProductMatches,
            })

            await productMatchingApi.shouldHaveAtLeastOneWordMatchingInFoundProduct({
                response,
                productTerms: tc.productTerms,
            })

            await productMatchingApi.shouldHaveValidSimilarityPercentages({
                response,
            })

            await productMatchingApi.shouldHaveMatchingSimilarityPercentageGreaterThan({
                response,
                percentage: tc.minPercentage,
            })
        })
    }
})
