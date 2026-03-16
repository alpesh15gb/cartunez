export type VehicleCompatibility = {
  make: string;
  model: string;
  pcd: string;
  centerBore: number;
  offsetRange: string;
  recommendedSizes: string[];
};

// Data sourced from neowheels.com - actual vehicle-to-wheel PCD mapping
export const vehicleData: VehicleCompatibility[] = [
  // ─── DATSUN ────────────────────────────────────────────────
  { make: "Datsun", model: "Go", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15"] },
  { make: "Datsun", model: "Go+", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15"] },
  { make: "Datsun", model: "Redi-Go", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["12", "13", "14"] },

  // ─── FORCE ─────────────────────────────────────────────────
  { make: "Force", model: "Gurkha", pcd: "5x139.7", centerBore: 108, offsetRange: "ET15-ET30", recommendedSizes: ["16", "17"] },
  { make: "Force", model: "Trax Cruiser", pcd: "5x139.7", centerBore: 108, offsetRange: "ET15-ET30", recommendedSizes: ["15", "16"] },

  // ─── FORD ──────────────────────────────────────────────────
  { make: "Ford", model: "EcoSport", pcd: "4x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Ford", model: "Endeavour", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET35-ET45", recommendedSizes: ["17", "18", "20"] },
  { make: "Ford", model: "Figo", pcd: "4x108", centerBore: 63.4, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15", "16"] },
  { make: "Ford", model: "Aspire", pcd: "4x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16"] },

  // ─── HONDA ─────────────────────────────────────────────────
  { make: "Honda", model: "City", pcd: "4x100", centerBore: 56.1, offsetRange: "ET45-ET55", recommendedSizes: ["15", "16", "17"] },
  { make: "Honda", model: "Amaze", pcd: "4x100", centerBore: 56.1, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16"] },
  { make: "Honda", model: "Jazz", pcd: "4x100", centerBore: 56.1, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16"] },
  { make: "Honda", model: "WR-V", pcd: "4x100", centerBore: 56.1, offsetRange: "ET45-ET55", recommendedSizes: ["16", "17"] },
  { make: "Honda", model: "CR-V", pcd: "5x114.3", centerBore: 64.1, offsetRange: "ET45-ET55", recommendedSizes: ["17", "18"] },
  { make: "Honda", model: "Elevate", pcd: "5x114.3", centerBore: 64.1, offsetRange: "ET45-ET55", recommendedSizes: ["16", "17"] },

  // ─── HYUNDAI ───────────────────────────────────────────────
  { make: "Hyundai", model: "Creta", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17", "18"] },
  { make: "Hyundai", model: "Venue", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Hyundai", model: "i20", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Hyundai", model: "i10", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15"] },
  { make: "Hyundai", model: "Verna", pcd: "4x114.3", centerBore: 67.1, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16", "17"] },
  { make: "Hyundai", model: "Tucson", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["17", "18"] },
  { make: "Hyundai", model: "Alcazar", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18"] },
  { make: "Hyundai", model: "Exter", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15", "16"] },
  { make: "Hyundai", model: "Grand i10 Nios", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15", "16"] },
  { make: "Hyundai", model: "Ioniq 5", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["20"] },

  // ─── KIA ───────────────────────────────────────────────────
  { make: "Kia", model: "Seltos", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["16", "17", "18"] },
  { make: "Kia", model: "Sonet", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Kia", model: "Carnival", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["17", "18"] },
  { make: "Kia", model: "Carens", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Kia", model: "EV6", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["19", "20"] },
  { make: "Kia", model: "Syros", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },

  // ─── MAHINDRA ──────────────────────────────────────────────
  { make: "Mahindra", model: "Thar 2020", pcd: "5x114.3", centerBore: 67.5, offsetRange: "ET20", recommendedSizes: ["16", "17", "18", "20"] },
  { make: "Mahindra", model: "Thar Roxx", pcd: "5x114.3", centerBore: 67.5, offsetRange: "ET20", recommendedSizes: ["17", "18", "20"] },
  { make: "Mahindra", model: "Old Thar CRDe", pcd: "5x139.7", centerBore: 108, offsetRange: "ET15-ET30", recommendedSizes: ["16", "17"] },
  { make: "Mahindra", model: "Scorpio-N", pcd: "6x139.7", centerBore: 108, offsetRange: "ET25-ET35", recommendedSizes: ["17", "18", "20"] },
  { make: "Mahindra", model: "Scorpio (2014-2021)", pcd: "6x139.7", centerBore: 108, offsetRange: "ET25-ET35", recommendedSizes: ["17", "18"] },
  { make: "Mahindra", model: "Scorpio Old (2006-2014)", pcd: "5x139.7", centerBore: 108, offsetRange: "ET15-ET30", recommendedSizes: ["16", "17"] },
  { make: "Mahindra", model: "Scorpio S2", pcd: "5x139.7", centerBore: 108, offsetRange: "ET15-ET30", recommendedSizes: ["15", "16"] },
  { make: "Mahindra", model: "XUV700", pcd: "6x139.7", centerBore: 108, offsetRange: "ET30-ET40", recommendedSizes: ["18", "19", "20"] },
  { make: "Mahindra", model: "XUV500", pcd: "6x139.7", centerBore: 108, offsetRange: "ET25-ET35", recommendedSizes: ["17", "18"] },
  { make: "Mahindra", model: "XUV300", pcd: "5x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Mahindra", model: "XUV3XO", pcd: "5x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Mahindra", model: "Bolero", pcd: "5x139.7", centerBore: 108, offsetRange: "ET15-ET30", recommendedSizes: ["15", "16"] },
  { make: "Mahindra", model: "Bolero Neo", pcd: "5x139.7", centerBore: 108, offsetRange: "ET15-ET30", recommendedSizes: ["15", "16"] },
  { make: "Mahindra", model: "TUV300", pcd: "5x127", centerBore: 71.5, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Mahindra", model: "Marazzo", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Mahindra", model: "3XO", pcd: "5x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Mahindra", model: "BE 6", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET40-ET50", recommendedSizes: ["19", "20"] },
  { make: "Mahindra", model: "XEV 9e", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET40-ET50", recommendedSizes: ["19", "20"] },
  { make: "Mahindra", model: "E-XUV400", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },

  // ─── MARUTI SUZUKI ─────────────────────────────────────────
  { make: "Maruti Suzuki", model: "Swift", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["14", "15", "16"] },
  { make: "Maruti Suzuki", model: "Baleno", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16", "17"] },
  { make: "Maruti Suzuki", model: "Brezza", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["16", "17"] },
  { make: "Maruti Suzuki", model: "Ertiga", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16"] },
  { make: "Maruti Suzuki", model: "Grand Vitara", pcd: "5x114.3", centerBore: 60.1, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18"] },
  { make: "Maruti Suzuki", model: "Fronx", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["16"] },
  { make: "Maruti Suzuki", model: "Jimny", pcd: "5x139.7", centerBore: 108, offsetRange: "ET-5-ET5", recommendedSizes: ["15", "16"] },
  { make: "Maruti Suzuki", model: "Dzire", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["14", "15", "16"] },
  { make: "Maruti Suzuki", model: "Alto K10", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["12", "13", "14"] },
  { make: "Maruti Suzuki", model: "S-Presso", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["13", "14", "15"] },
  { make: "Maruti Suzuki", model: "Celerio", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["13", "14", "15"] },
  { make: "Maruti Suzuki", model: "Ignis", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Maruti Suzuki", model: "Ciaz", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16", "17"] },
  { make: "Maruti Suzuki", model: "XL6", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16"] },

  // ─── MG ────────────────────────────────────────────────────
  { make: "MG", model: "Hector", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["17", "18"] },
  { make: "MG", model: "Gloster", pcd: "6x139.7", centerBore: 110, offsetRange: "ET30-ET40", recommendedSizes: ["18", "20"] },
  { make: "MG", model: "Astor", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["17", "18"] },
  { make: "MG", model: "ZS EV", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["17", "18"] },
  { make: "MG", model: "Windsor EV", pcd: "5x114.3", centerBore: 67.1, offsetRange: "ET45-ET55", recommendedSizes: ["17", "18"] },
  { make: "MG", model: "Comet EV", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["12", "13"] },

  // ─── NISSAN ────────────────────────────────────────────────
  { make: "Nissan", model: "Magnite", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Nissan", model: "Kicks", pcd: "5x114.3", centerBore: 66.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Nissan", model: "Terrano", pcd: "5x114.3", centerBore: 66.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },

  // ─── RENAULT ───────────────────────────────────────────────
  { make: "Renault", model: "Kiger", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Renault", model: "Duster", pcd: "5x114.3", centerBore: 66.1, offsetRange: "ET35-ET45", recommendedSizes: ["16", "17"] },
  { make: "Renault", model: "Triber", pcd: "4x100", centerBore: 60.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15"] },

  // ─── SKODA ─────────────────────────────────────────────────
  { make: "Skoda", model: "Kushaq", pcd: "5x112", centerBore: 57.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Skoda", model: "Slavia", pcd: "5x112", centerBore: 57.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Skoda", model: "Octavia", pcd: "5x112", centerBore: 57.1, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18"] },
  { make: "Skoda", model: "Superb", pcd: "5x112", centerBore: 57.1, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18", "19"] },
  { make: "Skoda", model: "Kodiaq", pcd: "5x112", centerBore: 57.1, offsetRange: "ET40-ET50", recommendedSizes: ["18", "19"] },

  // ─── TATA ──────────────────────────────────────────────────
  { make: "Tata", model: "Nexon", pcd: "4x108", centerBore: 63.4, offsetRange: "ET35-ET45", recommendedSizes: ["16"] },
  { make: "Tata", model: "Nexon EV", pcd: "4x108", centerBore: 63.4, offsetRange: "ET35-ET45", recommendedSizes: ["16"] },
  { make: "Tata", model: "Harrier", pcd: "5x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18", "19"] },
  { make: "Tata", model: "Safari", pcd: "5x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["18", "19"] },
  { make: "Tata", model: "Punch", pcd: "4x108", centerBore: 63.4, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Tata", model: "Tiago", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15"] },
  { make: "Tata", model: "Tigor", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15"] },
  { make: "Tata", model: "Altroz", pcd: "4x100", centerBore: 54.1, offsetRange: "ET40-ET50", recommendedSizes: ["15", "16"] },
  { make: "Tata", model: "Curvv", pcd: "5x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18", "19"] },
  { make: "Tata", model: "Curvv EV", pcd: "5x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18"] },
  { make: "Tata", model: "Sierra EV", pcd: "5x108", centerBore: 63.4, offsetRange: "ET40-ET50", recommendedSizes: ["18", "19"] },
  { make: "Tata", model: "Hexa", pcd: "6x139.7", centerBore: 110, offsetRange: "ET30-ET40", recommendedSizes: ["17", "18"] },

  // ─── TOYOTA ────────────────────────────────────────────────
  { make: "Toyota", model: "Fortuner", pcd: "6x139.7", centerBore: 106.1, offsetRange: "ET20-ET30", recommendedSizes: ["17", "18", "20"] },
  { make: "Toyota", model: "Innova Crysta", pcd: "5x114.3", centerBore: 60.1, offsetRange: "ET35-ET45", recommendedSizes: ["16", "17"] },
  { make: "Toyota", model: "Innova HyCross", pcd: "5x114.3", centerBore: 60.1, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18"] },
  { make: "Toyota", model: "Urban Cruiser Hyryder", pcd: "5x114.3", centerBore: 60.1, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18"] },
  { make: "Toyota", model: "Glanza", pcd: "4x100", centerBore: 54.1, offsetRange: "ET35-ET45", recommendedSizes: ["15", "16"] },
  { make: "Toyota", model: "Camry", pcd: "5x114.3", centerBore: 60.1, offsetRange: "ET45-ET55", recommendedSizes: ["17", "18"] },
  { make: "Toyota", model: "Land Cruiser", pcd: "6x139.7", centerBore: 106.1, offsetRange: "ET25-ET35", recommendedSizes: ["18", "20"] },

  // ─── VOLKSWAGEN ────────────────────────────────────────────
  { make: "Volkswagen", model: "Taigun", pcd: "5x112", centerBore: 57.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Volkswagen", model: "Virtus", pcd: "5x112", centerBore: 57.1, offsetRange: "ET40-ET50", recommendedSizes: ["16", "17"] },
  { make: "Volkswagen", model: "Tiguan", pcd: "5x112", centerBore: 57.1, offsetRange: "ET40-ET50", recommendedSizes: ["17", "18"] },
  { make: "Volkswagen", model: "Polo", pcd: "5x100", centerBore: 57.1, offsetRange: "ET35-ET45", recommendedSizes: ["14", "15", "16"] },
];



