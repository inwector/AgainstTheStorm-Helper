// Main application logic and initialization

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log('🎮 Against the Storm Blueprint Optimizer - Starting up...');

    try {
        // Populate UI elements
        populateBuildingsList();
        populateBlueprintOptions();
        setupEventListeners();

        // Initialize counters
        updateSpeciesDisplay();
        updateCurrentBuildings();

        console.log('✅ Application initialized successfully');
        showMessage('Blueprint Optimizer ready! Configure your settlement to get started.', 'success');

    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        showMessage('Error initializing application. Please refresh the page.', 'error');
    }
}

function calculateOptimalBlueprint() {
    console.log('🧮 Starting blueprint calculation...');

    // Validate inputs first
    if (!validateInputs()) {
        return;
    }

    const biome = document.getElementById('biome-select').value;
    const blueprint1 = document.getElementById('blueprint-1').value;
    const blueprint2 = document.getElementById('blueprint-2').value;
    const blueprint3 = document.getElementById('blueprint-3').value;

    console.log('📊 Input Configuration:', {
        biome,
        species: selectedSpecies,
        currentBuildings: currentBuildings.length,
        blueprints: [blueprint1, blueprint2, blueprint3]
    });

    // Show loading state
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading">🔄 Calculating optimal blueprint choice...</div>';

    // Small delay to show loading state
    setTimeout(() => {
        try {
            const blueprints = [blueprint1, blueprint2, blueprint3];
            const scores = [];

            blueprints.forEach((blueprint, index) => {
                const scoreResult = calculateBlueprintScore(blueprint, biome, selectedSpecies, currentBuildings);

                scores.push({
                    option: index + 1,
                    building: gameData.buildings[blueprint],
                    buildingKey: blueprint,
                    score: scoreResult,
                    details: generateScoreDetails(blueprint, biome, selectedSpecies, currentBuildings)
                });

                console.log(`📋 Blueprint ${index + 1} (${gameData.buildings[blueprint].name}): ${scoreResult.total} points`);
            });

            // Sort by score (highest first)
            scores.sort((a, b) => b.score.total - a.score.total);

            console.log('🏆 Final Rankings:', scores.map(s => `${s.building.name}: ${s.score.total}`));

            displayResults(scores);

            // Log recommendation
            const winner = scores[0];
            console.log(`🎯 Recommended: ${winner.building.name} with ${winner.score.total}/100 points`);

            showMessage(`Calculation complete! Best choice: ${winner.building.name}`, 'success');

        } catch (error) {
            console.error('❌ Calculation failed:', error);
            resultsDiv.innerHTML = '<div class="loading">❌ Error calculating results. Please try again.</div>';
            showMessage('Calculation failed. Please check your inputs and try again.', 'error');
        }
    }, 500);
}

// Utility functions
function resetCalculator() {
    // Reset all form elements
    document.getElementById('biome-select').value = '';

    // Reset species selection
    document.querySelectorAll('.species-item').forEach(item => {
        item.classList.remove('selected');
        item.querySelector('input').checked = false;
    });
    selectedSpecies = [];

    // Reset buildings
    document.querySelectorAll('#current-buildings input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    currentBuildings = [];

    // Reset blueprints
    document.getElementById('blueprint-1').value = '';
    document.getElementById('blueprint-2').value = '';
    document.getElementById('blueprint-3').value = '';

    // Reset results
    document.getElementById('results').innerHTML = `
        <div class="loading">
            Configure your settlement and blueprint options, then click "Calculate Best Choice" to see recommendations.
        </div>
    `;

    // Update displays
    updateSpeciesDisplay();
    updateCurrentBuildings();

    console.log('🔄 Calculator reset');
    showMessage('Calculator reset successfully!', 'info');
}

// Add reset button to the page (optional)
function addResetButton() {
    const calculateBtn = document.querySelector('.calculate-btn');
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Reset All';
    resetBtn.className = 'calculate-btn';
    resetBtn.style.background = 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
    resetBtn.style.marginTop = '10px';
    resetBtn.onclick = resetCalculator;

    calculateBtn.parentNode.insertBefore(resetBtn, calculateBtn.nextSibling);
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + Enter to calculate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        calculateOptimalBlueprint();
    }

    // Ctrl/Cmd + R to reset (prevent default browser refresh)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetCalculator();
    }
});

// Export for potential future use
window.ATS = {
    calculateOptimalBlueprint,
    resetCalculator,
    gameData,
    selectedSpecies: () => selectedSpecies,
    currentBuildings: () => currentBuildings
};

console.log('🚀 Against the Storm Blueprint Optimizer loaded successfully!');