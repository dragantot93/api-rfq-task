import { request, APIResponse } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

export default abstract class BaseApi {
    protected async sendRequest(options: { method: string; url: string; data: any }): Promise<APIResponse> {
        const apiContext = await request.newContext({
            extraHTTPHeaders: {
                Authorization: process.env.API_KEY!,
            },
        })

        switch (options.method.toUpperCase()) {
            case 'POST':
                return apiContext.post(options.url, { data: options.data })
            case 'PUT':
                return apiContext.put(options.url, { data: options.data })
            case 'PATCH':
                return apiContext.patch(options.url, { data: options.data })
            case 'DELETE':
                return apiContext.delete(options.url, { data: options.data })
            default:
                return apiContext.get(options.url)
        }
    }
}
