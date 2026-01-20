/**
 * Seed script for Indian vehicle data
 * Run: npx medusa exec src/scripts/seed-vehicles.ts
 */

import { ExecArgs } from "@medusajs/framework/types"
import { VEHICLE_FITMENT_MODULE } from "../modules/vehicle-fitment"

// Indian car manufacturers and popular models
const VEHICLE_DATA = {
    makes: [
        { name: "Maruti Suzuki", slug: "maruti-suzuki", country: "India", display_order: 1 },
        { name: "Hyundai", slug: "hyundai", country: "South Korea", display_order: 2 },
        { name: "Tata Motors", slug: "tata", country: "India", display_order: 3 },
        { name: "Mahindra", slug: "mahindra", country: "India", display_order: 4 },
        { name: "Kia", slug: "kia", country: "South Korea", display_order: 5 },
        { name: "Toyota", slug: "toyota", country: "Japan", display_order: 6 },
        { name: "Honda", slug: "honda", country: "Japan", display_order: 7 },
        { name: "MG Motor", slug: "mg", country: "China", display_order: 8 },
        { name: "Skoda", slug: "skoda", country: "Czech Republic", display_order: 9 },
        { name: "Volkswagen", slug: "volkswagen", country: "Germany", display_order: 10 },
    ],
    models: {
        "maruti-suzuki": [
            { name: "Swift", slug: "swift", body_type: "Hatchback" },
            { name: "Baleno", slug: "baleno", body_type: "Hatchback" },
            { name: "Dzire", slug: "dzire", body_type: "Sedan" },
            { name: "Brezza", slug: "brezza", body_type: "SUV" },
            { name: "Grand Vitara", slug: "grand-vitara", body_type: "SUV" },
            { name: "Ertiga", slug: "ertiga", body_type: "MPV" },
            { name: "XL6", slug: "xl6", body_type: "MPV" },
            { name: "Fronx", slug: "fronx", body_type: "SUV" },
            { name: "Jimny", slug: "jimny", body_type: "SUV" },
            { name: "Alto K10", slug: "alto-k10", body_type: "Hatchback" },
            { name: "WagonR", slug: "wagonr", body_type: "Hatchback" },
            { name: "Celerio", slug: "celerio", body_type: "Hatchback" },
            { name: "Ignis", slug: "ignis", body_type: "Hatchback" },
            { name: "Ciaz", slug: "ciaz", body_type: "Sedan" },
            { name: "Invicto", slug: "invicto", body_type: "MPV" },
        ],
        "hyundai": [
            { name: "Creta", slug: "creta", body_type: "SUV" },
            { name: "Venue", slug: "venue", body_type: "SUV" },
            { name: "i20", slug: "i20", body_type: "Hatchback" },
            { name: "Verna", slug: "verna", body_type: "Sedan" },
            { name: "Alcazar", slug: "alcazar", body_type: "SUV" },
            { name: "Tucson", slug: "tucson", body_type: "SUV" },
            { name: "Exter", slug: "exter", body_type: "SUV" },
            { name: "Grand i10 Nios", slug: "grand-i10-nios", body_type: "Hatchback" },
            { name: "Aura", slug: "aura", body_type: "Sedan" },
            { name: "Ioniq 5", slug: "ioniq-5", body_type: "SUV" },
        ],
        "tata": [
            { name: "Nexon", slug: "nexon", body_type: "SUV" },
            { name: "Punch", slug: "punch", body_type: "SUV" },
            { name: "Harrier", slug: "harrier", body_type: "SUV" },
            { name: "Safari", slug: "safari", body_type: "SUV" },
            { name: "Altroz", slug: "altroz", body_type: "Hatchback" },
            { name: "Tiago", slug: "tiago", body_type: "Hatchback" },
            { name: "Tigor", slug: "tigor", body_type: "Sedan" },
            { name: "Curvv", slug: "curvv", body_type: "SUV" },
            { name: "Nexon EV", slug: "nexon-ev", body_type: "SUV" },
            { name: "Punch EV", slug: "punch-ev", body_type: "SUV" },
        ],
        "mahindra": [
            { name: "Thar", slug: "thar", body_type: "SUV" },
            { name: "Scorpio N", slug: "scorpio-n", body_type: "SUV" },
            { name: "XUV700", slug: "xuv700", body_type: "SUV" },
            { name: "XUV400", slug: "xuv400", body_type: "SUV" },
            { name: "XUV300", slug: "xuv300", body_type: "SUV" },
            { name: "Bolero", slug: "bolero", body_type: "SUV" },
            { name: "Bolero Neo", slug: "bolero-neo", body_type: "SUV" },
            { name: "XUV3XO", slug: "xuv3xo", body_type: "SUV" },
            { name: "Scorpio Classic", slug: "scorpio-classic", body_type: "SUV" },
        ],
        "kia": [
            { name: "Seltos", slug: "seltos", body_type: "SUV" },
            { name: "Sonet", slug: "sonet", body_type: "SUV" },
            { name: "Carens", slug: "carens", body_type: "MPV" },
            { name: "EV6", slug: "ev6", body_type: "SUV" },
            { name: "Carnival", slug: "carnival", body_type: "MPV" },
        ],
        "toyota": [
            { name: "Innova Crysta", slug: "innova-crysta", body_type: "MPV" },
            { name: "Innova Hycross", slug: "innova-hycross", body_type: "MPV" },
            { name: "Fortuner", slug: "fortuner", body_type: "SUV" },
            { name: "Urban Cruiser Hyryder", slug: "hyryder", body_type: "SUV" },
            { name: "Glanza", slug: "glanza", body_type: "Hatchback" },
            { name: "Rumion", slug: "rumion", body_type: "MPV" },
            { name: "Hilux", slug: "hilux", body_type: "Pickup" },
            { name: "Camry", slug: "camry", body_type: "Sedan" },
            { name: "Vellfire", slug: "vellfire", body_type: "MPV" },
        ],
        "honda": [
            { name: "City", slug: "city", body_type: "Sedan" },
            { name: "Amaze", slug: "amaze", body_type: "Sedan" },
            { name: "Elevate", slug: "elevate", body_type: "SUV" },
        ],
        "mg": [
            { name: "Hector", slug: "hector", body_type: "SUV" },
            { name: "Hector Plus", slug: "hector-plus", body_type: "SUV" },
            { name: "Astor", slug: "astor", body_type: "SUV" },
            { name: "ZS EV", slug: "zs-ev", body_type: "SUV" },
            { name: "Gloster", slug: "gloster", body_type: "SUV" },
            { name: "Comet EV", slug: "comet-ev", body_type: "Hatchback" },
        ],
        "skoda": [
            { name: "Kushaq", slug: "kushaq", body_type: "SUV" },
            { name: "Slavia", slug: "slavia", body_type: "Sedan" },
            { name: "Kodiaq", slug: "kodiaq", body_type: "SUV" },
            { name: "Superb", slug: "superb", body_type: "Sedan" },
        ],
        "volkswagen": [
            { name: "Taigun", slug: "taigun", body_type: "SUV" },
            { name: "Virtus", slug: "virtus", body_type: "Sedan" },
            { name: "Tiguan", slug: "tiguan", body_type: "SUV" },
        ],
    },
    // Sample variants for popular models
    variants: {
        "swift": [
            { name: "LXi", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1197, transmission: "Manual" },
            { name: "VXi", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1197, transmission: "Manual" },
            { name: "VXi AMT", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1197, transmission: "AMT" },
            { name: "ZXi", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1197, transmission: "Manual" },
            { name: "ZXi+", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1197, transmission: "Manual" },
            { name: "ZXi+ AMT", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1197, transmission: "AMT" },
            { name: "VXi CNG", year_start: 2024, year_end: null, engine_type: "CNG", engine_cc: 1197, transmission: "Manual" },
            { name: "LXi (Old)", year_start: 2018, year_end: 2023, engine_type: "Petrol", engine_cc: 1197, transmission: "Manual" },
            { name: "ZXi (Old)", year_start: 2018, year_end: 2023, engine_type: "Petrol", engine_cc: 1197, transmission: "Manual" },
        ],
        "creta": [
            { name: "E", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "Manual" },
            { name: "EX", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "Manual" },
            { name: "S", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "Manual" },
            { name: "S(O)", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "CVT" },
            { name: "SX", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "Manual" },
            { name: "SX(O)", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "CVT" },
            { name: "SX Turbo DCT", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1482, transmission: "DCT" },
            { name: "SX(O) Diesel AT", year_start: 2024, year_end: null, engine_type: "Diesel", engine_cc: 1493, transmission: "Automatic" },
        ],
        "nexon": [
            { name: "Smart", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1199, transmission: "Manual" },
            { name: "Smart+", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1199, transmission: "Manual" },
            { name: "Pure", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1199, transmission: "Manual" },
            { name: "Creative", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1199, transmission: "Manual" },
            { name: "Creative+ AMT", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1199, transmission: "AMT" },
            { name: "Fearless", year_start: 2024, year_end: null, engine_type: "Petrol", engine_cc: 1199, transmission: "Manual" },
            { name: "Fearless+ Diesel", year_start: 2024, year_end: null, engine_type: "Diesel", engine_cc: 1497, transmission: "Manual" },
        ],
        "seltos": [
            { name: "HTE", year_start: 2023, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "Manual" },
            { name: "HTK", year_start: 2023, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "Manual" },
            { name: "HTK+", year_start: 2023, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "Manual" },
            { name: "HTX", year_start: 2023, year_end: null, engine_type: "Petrol", engine_cc: 1497, transmission: "Manual" },
            { name: "HTX+ iMT", year_start: 2023, year_end: null, engine_type: "Petrol", engine_cc: 1482, transmission: "iMT" },
            { name: "GTX+ DCT", year_start: 2023, year_end: null, engine_type: "Petrol", engine_cc: 1482, transmission: "DCT" },
            { name: "X-Line DCT", year_start: 2023, year_end: null, engine_type: "Petrol", engine_cc: 1482, transmission: "DCT" },
        ],
    },
}

export default async function seedVehicles({ container }: ExecArgs) {
    const vehicleFitmentService = container.resolve(VEHICLE_FITMENT_MODULE)

    console.log("🚗 Seeding vehicle data...")

    // Create makes
    const makeMap = new Map<string, string>()
    for (const makeData of VEHICLE_DATA.makes) {
        try {
            const make = await vehicleFitmentService.createVehicleMakes(makeData)
            makeMap.set(makeData.slug, make.id)
            console.log(`  ✓ Created make: ${makeData.name}`)
        } catch (error) {
            console.log(`  ⚠ Make ${makeData.name} may already exist`)
        }
    }

    // Create models for each make
    const modelMap = new Map<string, string>()
    for (const [makeSlug, models] of Object.entries(VEHICLE_DATA.models)) {
        const makeId = makeMap.get(makeSlug)
        if (!makeId) continue

        for (const modelData of models) {
            try {
                const model = await vehicleFitmentService.createVehicleModels({
                    ...modelData,
                    make_id: makeId,
                })
                modelMap.set(modelData.slug, model.id)
                console.log(`    ✓ Created model: ${modelData.name}`)
            } catch (error) {
                console.log(`    ⚠ Model ${modelData.name} may already exist`)
            }
        }
    }

    // Create variants for sample models
    for (const [modelSlug, variants] of Object.entries(VEHICLE_DATA.variants)) {
        const modelId = modelMap.get(modelSlug)
        if (!modelId) continue

        for (const variantData of variants) {
            try {
                await vehicleFitmentService.createVehicleVariants({
                    ...variantData,
                    model_id: modelId,
                })
                console.log(`      ✓ Created variant: ${variantData.name}`)
            } catch (error) {
                console.log(`      ⚠ Variant ${variantData.name} may already exist`)
            }
        }
    }

    console.log("✅ Vehicle seeding complete!")
}
