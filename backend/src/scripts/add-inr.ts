import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { updateStoresStep } from "@medusajs/medusa/core-flows";

const updateStoreCurrencies = createWorkflow(
    "update-store-currencies",
    (input: {
        supported_currencies: { currency_code: string; is_default?: boolean }[];
        store_id: string;
        existing_currencies: { currency_code: string; is_default?: boolean }[];
    }) => {
        const normalizedInput = transform({ input }, (data) => {
            // Create a map to handle merging and deduplication
            const currencyMap = new Map();

            // Process existing currencies
            // We set is_default to false for all existing if we intend to set a new default
            // However, if the new input doesn't specify a default, we should preserve the old one?
            // For this script, we assume we want to making the NEW currency (INR) the default if specified.
            data.input.existing_currencies.forEach(c => {
                currencyMap.set(c.currency_code.toLowerCase(), { ...c, is_default: false });
            });

            // Process new currencies
            data.input.supported_currencies.forEach(c => {
                currencyMap.set(c.currency_code.toLowerCase(), c);
            });

            return {
                selector: { id: data.input.store_id },
                update: {
                    supported_currencies: Array.from(currencyMap.values()),
                },
            };
        });

        const stores = updateStoresStep(normalizedInput);
        return new WorkflowResponse(stores);
    }
);

export default async function addInr({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const storeModuleService = container.resolve(Modules.STORE);

    logger.info("Starting currency update script...");

    // Fetch store with supported_currencies relation
    const [store] = await storeModuleService.listStores({}, { relations: ["supported_currencies"] });

    if (!store) {
        logger.error("No store found!");
        return;
    }

    const existingCurrencies = store.supported_currencies || [];
    logger.info(`Found store ${store.id} with currencies: ${existingCurrencies.map(c => c.currency_code).join(", ")}`);

    // Run the workflow
    await updateStoreCurrencies(container).run({
        input: {
            store_id: store.id,
            existing_currencies: existingCurrencies.map(c => ({
                currency_code: c.currency_code,
                is_default: c.is_default
            })),
            supported_currencies: [
                {
                    currency_code: "inr",
                    is_default: true,
                },
            ],
        },
    });

    logger.info("Successfully added INR as the default currency.");
}
