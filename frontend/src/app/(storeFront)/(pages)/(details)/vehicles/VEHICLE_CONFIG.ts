import { getCarById } from "@/actions/categories/carActions";
import { getFarmEquipmentById } from "@/actions/categories/FarmequipmentAction";
import { getMotorcycleById } from "@/actions/categories/motorcycleActions";
import { getBoatById } from "@/actions/categories/boatActions";
import type { VehicleType, FieldDef } from "@/app/utils/types/vehicle";

export const VEHICLE_CONFIG: Record<
  VehicleType,
  {
    label: string;
    itemModel: string;
    fetchFn: (id: string) => Promise<any>;
    fields: FieldDef[];
  }
> = {
  car: {
    label: "Car",
    itemModel: "Car",
    fetchFn: getCarById,
    fields: [
      { key: "make", label: "Make" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "vehicleModel", label: "Vehicle Model" },
      { key: "trim", label: "Trim" },
      { key: "year", label: "Year" },
      {
        key: "mileage",
        label: "Mileage",
        format: (v: any) => `${Number(v).toLocaleString()} km`,
      },
      { key: "fuelType", label: "Fuel Type" },
      { key: "transmission", label: "Transmission" },
      { key: "gearbox", label: "Gearbox" },
      { key: "engineSize", label: "Engine Size" },
      { key: "doors", label: "Doors" },
      { key: "condition", label: "Condition" },
      { key: "color", label: "Color" },
    ],
  },
  boat: {
    label: "Boat",
    itemModel: "Boat",
    fetchFn: getBoatById,
    fields: [
      { key: "type", label: "Boat Type" },
      { key: "boatModel", label: "Model" },
      { key: "transmission", label: "Transmission" },
      { key: "color", label: "Color" },
      { key: "condition", label: "Condition" },
      { key: "length", label: "Length", format: (v: any) => `${v} ft` },
      { key: "hullMaterial", label: "Hull Material" },
      {
        key: "engineHours",
        label: "Engine Hours",
        format: (v: any) => `${Number(v).toLocaleString()} hrs`,
      },
      { key: "year", label: "Year" },
    ],
  },
  motorcycle: {
    label: "Motorcycle",
    itemModel: "Motorcycle",
    fetchFn: getMotorcycleById,
    fields: [
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "modelName", label: "Model Name" },
      { key: "type", label: "Type" },
      { key: "year", label: "Year" },
      { key: "engineSize", label: "Engine Size" },
      { key: "engineCc", label: "Engine CC" },
      {
        key: "mileage",
        label: "Mileage",
        format: (v: any) => `${Number(v).toLocaleString()} km`,
      },
      { key: "fuelType", label: "Fuel Type" },
      { key: "transmission", label: "Transmission" },
      { key: "gearbox", label: "Gearbox" },
      { key: "color", label: "Color" },
      { key: "condition", label: "Condition" },
    ],
  },
  farmequipment: {
    label: "Farm Equipment",
    itemModel: "FarmEquipment",
    fetchFn: getFarmEquipmentById,
    fields: [
      { key: "make", label: "Make" },
      { key: "brand", label: "Brand" },
      { key: "farmequipmentModel", label: "Model" },
      { key: "type", label: "Type" },
      { key: "equipmentType", label: "Equipment Type" },
      { key: "year", label: "Year" },
      { key: "enginePower", label: "Engine Power" },
      { key: "fuelType", label: "Fuel Type" },
      {
        key: "hoursUsed",
        label: "Hours Used",
        format: (v: any) => `${Number(v).toLocaleString()} hrs`,
      },
      {
        key: "hours",
        label: "Hours",
        format: (v: any) => `${Number(v).toLocaleString()} hrs`,
      },
      { key: "condition", label: "Condition" },
      {
        key: "attachmentsIncluded",
        label: "Attachments",
        format: (v: any) => (v ? "Yes" : "No"),
      },
    ],
  },
};
