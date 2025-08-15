// Blueprint calculation logic

function calculateBlueprintScore(buildingKey, biome, species, currentBuildings) {
    const building = gameData.buildings[buildingKey];
    if (!building) return 0;

    let score = 50; // Base score
    let scoreDetails = {
        base: 50,
        species: 0,
        category: 0,
        biome: 0,
        synergy: 0
    };

    // Species synergy bonus
    if (building.species_bonus) {
        species.forEach(speciesKey => {
            if (building.species_bonus[speciesKey]) {
                const bonus = (building.species_bonus[speciesKey] - 1) * 30;
                scoreDetails.species += bonus;
                score += bonus;
            }
        });
    }

    // Category-specific scoring
    if (building.category === 'Housing') {
        // Housing is always valuable, check if we need more for current species
        const housingBonus = calculateHousingNeed(buildingKey, species, currentBuildings);
        scoreDetails.category += housingBonus;
        score += housingBonus;
    } else if (building.category === 'Production') {
        // Production buildings get bonus if we don't have them or similar ones
        if (!currentBuildings.includes(buildingKey)) {
            scoreDetails.category += 25;
            score += 25;
        }
        // Additional bonus for production diversity
        const diversityBonus = calculateProductionDiversity(building, currentBuildings);
        scoreDetails.synergy += diversityBonus;
        score += diversityBonus;
    } else if (building.category === 'City') {
        // City buildings provide services
        scoreDetails.category += 15;
        score += 15;
    } else if (building.category === 'ResourceAcquisition') {
        // Resource buildings are valuable for resource security
        scoreDetails.category += 20;
        score += 20;
    }

    // Biome compatibility
    const biomeBonus = calculateBiomeCompatibility(building, biome);
    scoreDetails.biome += biomeBonus;
    score += biomeBonus;

    return {
        total: Math.round(score),
        details: scoreDetails,
        breakdown: generateScoreBreakdown(scoreDetails)
    };
}

function calculateHousingNeed(buildingKey, species, currentBuildings) {
    const building = gameData.buildings[buildingKey];
    if (!building.species_bonus) return 20; // Generic housing bonus

    // Check which species this housing serves best
    const bestSpecies = Object.keys(building.species_bonus).find(s =>
        building.species_bonus[s] > 1.5 && species.includes(s)
    );

    if (bestSpecies) {
        // Count existing housing for this species
        const existingHousing = currentBuildings.filter(b => {
            const existingBuilding = gameData.buildings[b];
            return existingBuilding &&
                existingBuilding.category === 'Housing' &&
                existingBuilding.species_bonus &&
                existingBuilding.species_bonus[bestSpecies] > 1.5;
        }).length;

        // Higher bonus if we have fewer houses for this species
        return Math.max(15, 35 - (existingHousing * 10));
    }

    return 20;
}

function calculateProductionDiversity(building, currentBuildings) {
    if (!building.recipes) return 0;

    const currentRecipes = new Set();
    currentBuildings.forEach(buildingKey => {
        const currentBuilding = gameData.buildings[buildingKey];
        if (currentBuilding && currentBuilding.recipes) {
            currentBuilding.recipes.forEach(recipe => currentRecipes.add(recipe));
        }
    });

    // Bonus for new recipes we don't currently have
    const newRecipes = building.recipes.filter(recipe => !currentRecipes.has(recipe));
    return newRecipes.length * 8; // 8 points per new recipe type
}

function calculateBiomeCompatibility(building, biome) {
    const biomeData = gameData.biomes[biome];
    if (!biomeData) return 0;

    let bonus = 0;

    // Production building bonuses
    if (building.category === 'Production') {
        if (building.recipes) {
            building.recipes.forEach(recipe => {
                if (recipe.includes('wood') && biomeData.bonuses.includes('wood_production')) {
                    bonus += 15;
                }
                if (recipe.includes('meat') && biomeData.bonuses.includes('meat_production')) {
                    bonus += 15;
                }
                if (recipe.includes('food') && biomeData.bonuses.includes('food_production')) {
                    bonus += 15;
                }
            });
        }
    }

    // Resource acquisition bonuses
    if (building.category === 'ResourceAcquisition' && building.resources) {
        building.resources.forEach(resource => {
            if (resource === 'wood' && biomeData.bonuses.includes('wood_production')) {
                bonus += 20;
            }
            if (resource === 'meat' && biomeData.bonuses.includes('meat_production')) {
                bonus += 20;
            }
            if ((resource === 'mushrooms' || resource === 'berries') && biomeData.bonuses.includes('foraging')) {
                bonus += 20;
            }
        });
    }

    // Penalty for scarcity
    if (building.category === 'Production' && building.recipes) {
        building.recipes.forEach(recipe => {
            if (recipe.includes('wood') && biomeData.penalties.includes('wood_scarcity')) {
                bonus -= 10;
            }
            if (recipe.includes('stone') && biomeData.penalties.includes('stone_scarcity')) {
                bonus -= 10;
            }
        });
    }

    return bonus;
}

function generateScoreBreakdown(scoreDetails) {
    const breakdown = [];

    if (scoreDetails.base > 0) breakdown.push(`Base: +${scoreDetails.base}`);
    if (scoreDetails.species > 0) breakdown.push(`Species Synergy: +${Math.round(scoreDetails.species)}`);
    if (scoreDetails.category > 0) breakdown.push(`Category Bonus: +${scoreDetails.category}`);
    if (scoreDetails.biome > 0) breakdown.push(`Biome Compatibility: +${scoreDetails.biome}`);
    if (scoreDetails.synergy > 0) breakdown.push(`Synergy Bonus: +${scoreDetails.synergy}`);

    return breakdown;
}

function generateScoreDetails(buildingKey, biome, species, currentBuildings) {
    const building = gameData.buildings[buildingKey];
    const details = [];

    details.push(`Category: ${building.category}`);

    if (building.species_bonus) {
        const bonuses = species.filter(s => building.species_bonus[s] && building.species_bonus[s] > 1);
        if (bonuses.length > 0) {
            details.push(`Strong with: ${bonuses.map(s => gameData.species[s].name).join(', ')}`);
        }
    }

    if (building.recipes) {
        details.push(`Produces: ${building.recipes.join(', ')}`);
    }

    if (building.resources) {
        details.push(`Gathers: ${building.resources.join(', ')}`);
    }

    if (building.service) {
        details.push(`Provides: ${building.service}`);
    }

    if (building.housing_capacity) {
        details.push(`Houses: ${building.housing_capacity} villagers`);
    }

    return details.join(' • ');
}