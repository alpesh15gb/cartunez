import { model } from "@medusajs/framework/utils"

/**
 * OTP Request - Stores OTP codes for phone verification
 */
export const OtpRequest = model.define("otp_request", {
    id: model.id().primaryKey(),
    phone: model.text().searchable(),
    otp: model.text(),
    is_verified: model.boolean().default(false),
    attempts: model.number().default(0),
    expires_at: model.dateTime(),
    created_at: model.dateTime(),
})
