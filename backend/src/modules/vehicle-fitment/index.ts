import { Module } from "@medusajs/framework/utils"
import VehicleFitmentModuleService from "./service"

export const VEHICLE_FITMENT_MODULE = "vehicleFitment"

export default Module(VEHICLE_FITMENT_MODULE, {
    service: VehicleFitmentModuleService,
})
