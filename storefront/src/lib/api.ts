/**
 * API Client for Car Tunez Backend
 */

const API_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

interface ApiResponse<T> {
    data?: T
    error?: string
}

class ApiClient {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                return { error: data.message || "Request failed" }
            }

            return { data }
        } catch (error) {
            return { error: error instanceof Error ? error.message : "Network error" }
        }
    }

    // Vehicle Fitment APIs
    async getVehicleMakes() {
        return this.request<{ makes: any[]; count: number }>("/store/vehicles")
    }

    async getModelsByMake(makeId: string) {
        return this.request<{ models: any[]; count: number }>(
            `/store/vehicles/${makeId}/models`
        )
    }

    async getVariantsByModel(modelId: string) {
        return this.request<{ variants: any[]; count: number }>(
            `/store/vehicles/models/${modelId}/variants`
        )
    }

    async getYearsForModel(modelId: string) {
        return this.request<{ years: number[]; count: number }>(
            `/store/vehicles/models/${modelId}/years`
        )
    }

    async checkFitment(productId: string, variantId: string) {
        return this.request<{ fits: boolean; fitment: any }>("/store/fitment/check", {
            method: "POST",
            body: JSON.stringify({ productId, variantId }),
        })
    }

    async getProductsForVehicle(variantId: string) {
        return this.request<{ products: any[]; count: number }>(
            `/store/fitment?variantId=${variantId}`
        )
    }

    // Auth APIs
    async sendOtp(phone: string) {
        return this.request<{ success: boolean; message: string; otp?: string }>(
            "/store/auth/otp/send",
            {
                method: "POST",
                body: JSON.stringify({ phone }),
            }
        )
    }

    async verifyOtp(phone: string, otp: string) {
        return this.request<{ success: boolean; customer: any }>(
            "/store/auth/otp/verify",
            {
                method: "POST",
                body: JSON.stringify({ phone, otp }),
            }
        )
    }

    // Payment APIs
    async createRazorpayOrder(amount: number, orderId: string) {
        return this.request<{ success: boolean; order: any; key: string }>(
            "/store/payments/razorpay/create",
            {
                method: "POST",
                body: JSON.stringify({ amount, orderId }),
            }
        )
    }

    async verifyRazorpayPayment(
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string
    ) {
        return this.request<{ success: boolean; payment: any }>(
            "/store/payments/razorpay/verify",
            {
                method: "POST",
                body: JSON.stringify({
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                }),
            }
        )
    }

    async checkCodEligibility(pincode: string, orderAmount: number) {
        return this.request<{ cod: any; delivery: any }>("/store/payments/cod-check", {
            method: "POST",
            body: JSON.stringify({ pincode, orderAmount }),
        })
    }

    // Medusa Store APIs (built-in)
    async getProducts(params?: Record<string, string>) {
        const query = params ? `?${new URLSearchParams(params)}` : ""
        return this.request<{ products: any[]; count: number }>(`/store/products${query}`)
    }

    async getProduct(id: string) {
        return this.request<{ product: any }>(`/store/products/${id}`)
    }

    async getCategories() {
        return this.request<{ product_categories: any[] }>("/store/product-categories")
    }

    async createCart() {
        return this.request<{ cart: any }>("/store/carts", { method: "POST" })
    }

    async getCart(cartId: string) {
        return this.request<{ cart: any }>(`/store/carts/${cartId}`)
    }

    async addToCart(cartId: string, variantId: string, quantity: number) {
        return this.request<{ cart: any }>(`/store/carts/${cartId}/line-items`, {
            method: "POST",
            body: JSON.stringify({ variant_id: variantId, quantity }),
        })
    }
}

export const api = new ApiClient(API_URL)
export default api
