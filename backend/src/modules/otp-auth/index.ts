import { Module } from "@medusajs/framework/utils"
import OtpAuthModuleService from "./service"

export const OTP_AUTH_MODULE = "otpAuth"

export default Module(OTP_AUTH_MODULE, {
    service: OtpAuthModuleService,
})
