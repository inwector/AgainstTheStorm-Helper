// Game data for Against the Storm Blueprint Optimizer
const gameData = {
    biomes: {
        cursed_royal_woodlands: {
            name: "Cursed Royal Woodlands",
            bonuses: ["wood_production", "foraging"],
            penalties: ["stone_scarcity"]
        },
        coral_forest: {
            name: "Coral Forest",
            bonuses: ["meat_production", "leather_production"],
            penalties: ["wood_scarcity"]
        },
        scarlet_orchard: {
            name: "Scarlet Orchard",
            bonuses: ["food_production", "brewing"],
            penalties: ["metal_scarcity"]
        },
        marshlands: {
            name: "Marshlands",
            bonuses: ["clay_production", "fishing"],
            penalties: ["building_cost_increase"]
        },
        sealed_biome: {
            name: "Sealed Biome",
            bonuses: ["ancient_knowledge"],
            penalties: ["resource_variety"]
        }
    },

    species: {
        humans: {
            name: "Humans",
            bonuses: ["versatile", "construction"],
            preferences: ["complex_food", "services"]
        },
        beavers: {
            name: "Beavers",
            bonuses: ["wood_cutting", "engineering"],
            preferences: ["simple_food", "housing"]
        },
        lizards: {
            name: "Lizards",
            bonuses: ["meat_processing", "warmth"],
            preferences: ["meat", "luxury"]
        },
        harpies: {
            name: "Harpies",
            bonuses: ["speed", "storm_resistance"],
            preferences: ["complex_food", "religion"]
        },
        foxes: {
            name: "Foxes",
            bonuses: ["efficiency", "trade"],
            preferences: ["luxury", "services"]
        }
    },

    buildings: {
        // Production Buildings
        crude_workstation: {
            name: "Crude Workstation",
            category: "Production",
            recipes: ["planks", "fabric"],
            species_bonus: { beavers: 1.25, humans: 1.0, lizards: 0.75 }
        },
        lumber_mill: {
            name: "Lumber Mill",
            category: "Production",
            recipes: ["planks"],
            species_bonus: { beavers: 1.5, humans: 1.0, lizards: 0.5 }
        },
        weaver: {
            name: "Weaver",
            category: "Production",
            recipes: ["fabric"],
            species_bonus: { humans: 1.25, harpies: 1.25, beavers: 0.75 }
        },
        provisioner: {
            name: "Provisioner",
            category: "Production",
            recipes: ["flour", "barrels"],
            species_bonus: { humans: 1.25, foxes: 1.25, lizards: 0.75 }
        },
        cookhouse: {
            name: "Cookhouse",
            category: "Production",
            recipes: ["skewers", "biscuits"],
            species_bonus: { lizards: 1.5, humans: 1.0, beavers: 0.75 }
        },
        butcher: {
            name: "Butcher",
            category: "Production",
            recipes: ["meat", "leather"],
            species_bonus: { lizards: 1.5, humans: 1.0, foxes: 1.25 }
        },
        supplier: {
            name: "Supplier",
            category: "Production",
            recipes: ["flour", "planks"],
            species_bonus: { humans: 1.25, beavers: 1.25, harpies: 0.75 }
        },

        // Housing Buildings
        human_house: {
            name: "Human House",
            category: "Housing",
            species_bonus: { humans: 2.0 },
            housing_capacity: 4
        },
        beaver_house: {
            name: "Beaver House",
            category: "Housing",
            species_bonus: { beavers: 2.0 },
            housing_capacity: 6
        },
        lizard_house: {
            name: "Lizard House",
            category: "Housing",
            species_bonus: { lizards: 2.0 },
            housing_capacity: 2
        },
        harpy_house: {
            name: "Harpy House",
            category: "Housing",
            species_bonus: { harpies: 2.0 },
            housing_capacity: 3
        },
        fox_house: {
            name: "Fox House",
            category: "Housing",
            species_bonus: { foxes: 2.0 },
            housing_capacity: 2
        },

        // City Buildings
        tavern: {
            name: "Tavern",
            category: "City",
            service: "leisure",
            species_bonus: { humans: 1.5, foxes: 1.25, harpies: 1.0 }
        },
        temple: {
            name: "Temple",
            category: "City",
            service: "religion",
            species_bonus: { harpies: 1.5, lizards: 1.25, humans: 1.0 }
        },
        market: {
            name: "Market",
            category: "City",
            service: "trade",
            species_bonus: { foxes: 1.5, humans: 1.25, beavers: 1.0 }
        },
        clan_hall: {
            name: "Clan Hall",
            category: "City",
            service: "blight_reduction",
            species_bonus: { beavers: 1.5, humans: 1.25, lizards: 1.0 }
        },

        // Resource Acquisition Buildings
        woodcutters_camp: {
            name: "Woodcutter's Camp",
            category: "ResourceAcquisition",
            resources: ["wood"],
            species_bonus: { beavers: 1.5, humans: 1.0, lizards: 0.75 }
        },
        foragers_hut: {
            name: "Forager's Hut",
            category: "ResourceAcquisition",
            resources: ["mushrooms", "berries"],
            species_bonus: { harpies: 1.5, humans: 1.0, foxes: 1.25 }
        },
        trappers_camp: {
            name: "Trapper's Camp",
            category: "ResourceAcquisition",
            resources: ["meat", "leather"],
            species_bonus: { lizards: 1.5, humans: 1.0, foxes: 1.25 }
        },
        stonecutters_camp: {
            name: "Stonecutter's Camp",
            category: "ResourceAcquisition",
            resources: ["stone"],
            species_bonus: { lizards: 1.25, beavers: 1.25, humans: 1.0 }
        }
    }
};