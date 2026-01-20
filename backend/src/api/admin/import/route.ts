import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { parse } from "csv-parse/sync"

interface ImportResult {
    success: boolean
    type: string
    created: number
    updated: number
    errors: number
    errorDetails: string[]
}

// POST /admin/import/products - Bulk import products from CSV
export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    try {
        const { csvData, type } = req.body as { csvData: string; type: string }

        if (!csvData) {
            res.status(400).json({ error: "No CSV data provided" })
            return
        }

        // Parse CSV
        const records = parse(csvData, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        })

        const result: ImportResult = {
            success: true,
            type,
            created: 0,
            updated: 0,
            errors: 0,
            errorDetails: [],
        }

        switch (type) {
            case "products":
                await processProductsImport(req, records, result)
                break
            case "fitments":
                await processFitmentsImport(req, records, result)
                break
            case "vehicles":
                await processVehiclesImport(req, records, result)
                break
            case "inventory":
                await processInventoryImport(req, records, result)
                break
            default:
                res.status(400).json({ error: "Invalid import type" })
                return
        }

        res.json(result)
    } catch (error) {
        console.error("Import error:", error)
        res.status(500).json({
            error: "Failed to process import",
            message: error instanceof Error ? error.message : "Unknown error",
        })
    }
}

async function processProductsImport(
    req: MedusaRequest,
    records: any[],
    result: ImportResult
) {
    // Get product service from container
    // const productService = req.scope.resolve("productService")

    for (const record of records) {
        try {
            const { sku, name, description, category, price, compare_at_price, stock, status } = record

            if (!sku || !name || !price) {
                result.errors++
                result.errorDetails.push(`Missing required fields for SKU: ${sku || "unknown"}`)
                continue
            }

            // Check if product exists by SKU
            // In production, use productService to create/update products
            // const existing = await productService.findBySku(sku)
            // if (existing) {
            //   await productService.update(existing.id, { ... })
            //   result.updated++
            // } else {
            //   await productService.create({ ... })
            //   result.created++
            // }

            // Simulate for now
            result.created++
        } catch (error) {
            result.errors++
            result.errorDetails.push(`Error processing ${record.sku}: ${error}`)
        }
    }
}

async function processFitmentsImport(
    req: MedusaRequest,
    records: any[],
    result: ImportResult
) {
    // const fitmentService = req.scope.resolve("vehicleFitmentModuleService")

    for (const record of records) {
        try {
            const { product_sku, make, model, variant, year_start, year_end, fitment_type, notes } = record

            if (!product_sku) {
                result.errors++
                result.errorDetails.push("Missing product SKU")
                continue
            }

            // In production, create fitment mapping
            // await fitmentService.createFitment({
            //   productSku: product_sku,
            //   make,
            //   model,
            //   variant,
            //   yearStart: parseInt(year_start),
            //   yearEnd: parseInt(year_end),
            //   fitmentType: fitment_type,
            //   notes,
            // })

            result.created++
        } catch (error) {
            result.errors++
            result.errorDetails.push(`Error processing fitment: ${error}`)
        }
    }
}

async function processVehiclesImport(
    req: MedusaRequest,
    records: any[],
    result: ImportResult
) {
    // const fitmentService = req.scope.resolve("vehicleFitmentModuleService")

    for (const record of records) {
        try {
            const { type, make_name, make_slug, model_name, model_slug, variant_name, year_start, year_end, engine_type, transmission } = record

            switch (type) {
                case "make":
                    // await fitmentService.createMake({ name: make_name, slug: make_slug })
                    result.created++
                    break
                case "model":
                    // await fitmentService.createModel({ makeName: make_name, name: model_name, slug: model_slug })
                    result.created++
                    break
                case "variant":
                    // await fitmentService.createVariant({ ... })
                    result.created++
                    break
                default:
                    result.errors++
                    result.errorDetails.push(`Unknown vehicle type: ${type}`)
            }
        } catch (error) {
            result.errors++
            result.errorDetails.push(`Error processing vehicle: ${error}`)
        }
    }
}

async function processInventoryImport(
    req: MedusaRequest,
    records: any[],
    result: ImportResult
) {
    // const inventoryService = req.scope.resolve("inventoryService")

    for (const record of records) {
        try {
            const { sku, stock_quantity, low_stock_threshold } = record

            if (!sku || stock_quantity === undefined) {
                result.errors++
                result.errorDetails.push(`Missing SKU or stock quantity`)
                continue
            }

            // In production, update inventory
            // await inventoryService.updateBySku(sku, {
            //   quantity: parseInt(stock_quantity),
            //   lowStockThreshold: parseInt(low_stock_threshold) || 10,
            // })

            result.updated++
        } catch (error) {
            result.errors++
            result.errorDetails.push(`Error updating inventory for ${record.sku}: ${error}`)
        }
    }
}

// GET /admin/import/history - Get import history
export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    // In production, fetch from database
    const history = [
        {
            id: "imp_1",
            filename: "products_jan21.csv",
            type: "products",
            created: 45,
            updated: 12,
            errors: 3,
            createdAt: new Date("2026-01-21"),
        },
        {
            id: "imp_2",
            filename: "fitments_batch2.csv",
            type: "fitments",
            created: 89,
            updated: 0,
            errors: 2,
            createdAt: new Date("2026-01-20"),
        },
    ]

    res.json({ history })
}
