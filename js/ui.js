// UI management functions

let selectedSpecies = [];
let currentBuildings = [];

function populateBuildingsList() {
    const container = document.getElementById('current-buildings');
    container.innerHTML = '';

    // Group buildings by category
    const categories = {};
    Object.entries(gameData.buildings).forEach(([key, building]) => {
        if (!categories[building.category]) {
            categories[building.category] = [];
        }
        categories[building.category].push({ key, building });
    });

    // Create sections for each category
    Object.entries(categories).forEach(([category, buildings]) => {
        const categoryHeader = document.createElement('div');
        categoryHeader.style.fontWeight = 'bold';
        categoryHeader.style.marginTop = '15px';
        categoryHeader.style.marginBottom = '8px';
        categoryHeader.style.color = '#666';
        categoryHeader.textContent = category;
        container.appendChild(categoryHeader);

        buildings.forEach(({ key, building }) => {
            const item = document.createElement('div');
            item.className = 'building-item';
            item.innerHTML = `
                <input type="checkbox" id="building-${key}" value="${key}" onchange="updateCurrentBuildings()">
                <label for="building-${key}">${building.name}</label>
            `;
            container.appendChild(item);
        });
    });
}

function populateBlueprintOptions() {
    ['blueprint-1', 'blueprint-2', 'blueprint-3'].forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Select a building...</option>';

        // Group options by category for better UX
        const categories = {};
        Object.entries(gameData.buildings).forEach(([key, building]) => {
            if (!categories[building.category]) {
                categories[building.category] = [];
            }
            categories[building.category].push({ key, building });
        });

        Object.entries(categories).forEach(([category, buildings]) => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;

            buildings.forEach(({ key, building }) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = building.name;
                optgroup.appendChild(option);
            });

            select.appendChild(optgroup);
        });
    });
}

function setupEventListeners() {
    // Species selection
    document.querySelectorAll('.species-item').forEach(item => {
        item.addEventListener('click', function (e) {
            // Prevent double-triggering when clicking the checkbox directly
            if (e.target.type === 'checkbox') return;

            const checkbox = this.querySelector('input[type="checkbox"]');
            const species = this.dataset.species;

            if (checkbox.checked) {
                // Unselect
                checkbox.checked = false;
                this.classList.remove('selected');
                selectedSpecies = selectedSpecies.filter(s => s !== species);
            } else if (selectedSpecies.length < 3) {
                // Select if less than 3 selected
                checkbox.checked = true;
                this.classList.add('selected');
                selectedSpecies.push(species);
            } else {
                // Show message if trying to select more than 3
                showMessage('You can only select 3 species maximum!', 'warning');
            }

            updateSpeciesDisplay();
        });
    });

    // Also handle direct checkbox clicks
    document.querySelectorAll('.species-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const item = this.closest('.species-item');
            const species = item.dataset.species;

            if (this.checked && selectedSpecies.length >= 3 && !selectedSpecies.includes(species)) {
                this.checked = false;
                showMessage('You can only select 3 species maximum!', 'warning');
                return;
            }

            if (this.checked) {
                item.classList.add('selected');
                if (!selectedSpecies.includes(species)) {
                    selectedSpecies.push(species);
                }
            } else {
                item.classList.remove('selected');
                selectedSpecies = selectedSpecies.filter(s => s !== species);
            }

            updateSpeciesDisplay();
        });
    });
}

function updateSpeciesDisplay() {
    const count = selectedSpecies.length;
    const label = document.querySelector('label[for="species"]') ||
        document.querySelector('.input-group label');

    if (label && label.textContent.includes('Species')) {
        label.textContent = `Species (${count}/3 selected):`;
    }
}

function updateCurrentBuildings() {
    currentBuildings = [];
    document.querySelectorAll('#current-buildings input[type="checkbox"]:checked').forEach(checkbox => {
        currentBuildings.push(checkbox.value);
    });

    // Update building count display
    const buildingCount = currentBuildings.length;
    const buildingsLabel = document.querySelector('.input-group').querySelector('label');

    // Find the correct label for current buildings
    const labels = document.querySelectorAll('.input-group label');
    labels.forEach(label => {
        if (label.textContent.includes('Current Buildings')) {
            label.textContent = `Current Buildings (${buildingCount} selected):`;
        }
    });
}

function showMessage(message, type = 'info') {
    // Remove any existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;

    // Set colors based on type
    switch (type) {
        case 'warning':
            messageDiv.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
            break;
        case 'error':
            messageDiv.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
            break;
        case 'success':
            messageDiv.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            break;
        default:
            messageDiv.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    }

    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    if (!document.querySelector('style[data-message-styles]')) {
        style.setAttribute('data-message-styles', 'true');
        document.head.appendChild(style);
    }

    // Auto-remove after 4 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 4000);
}

function displayResults(scores) {
    const resultsDiv = document.getElementById('results');

    if (scores.length === 0) {
        resultsDiv.innerHTML = '<div class="loading">No valid blueprint options to compare.</div>';
        return;
    }

    resultsDiv.innerHTML = scores.map((result, index) => {
        const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        const scoreColor = result.score.total >= 80 ? '#27ae60' :
            result.score.total >= 60 ? '#f39c12' : '#e74c3c';

        return `
            <div class="result-item">
                <h3>${rankEmoji} #${index + 1} - ${result.building.name}</h3>
                <div class="score" style="color: ${scoreColor};">${result.score.total}/100</div>
                <div class="details">${result.details}</div>
                ${result.score.breakdown ? `
                    <div style="margin-top: 10px; font-size: 0.8rem; opacity: 0.8;">
                        <strong>Score Breakdown:</strong><br>
                        ${result.score.breakdown.join(' • ')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');

    // Scroll results into view on mobile
    if (window.innerWidth <= 768) {
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function validateInputs() {
    const biome = document.getElementById('biome-select').value;
    const blueprint1 = document.getElementById('blueprint-1').value;
    const blueprint2 = document.getElementById('blueprint-2').value;
    const blueprint3 = document.getElementById('blueprint-3').value;

    if (!biome) {
        showMessage('Please select a biome', 'warning');
        document.getElementById('biome-select').focus();
        return false;
    }

    if (selectedSpecies.length !== 3) {
        showMessage('Please select exactly 3 species', 'warning');
        return false;
    }

    if (!blueprint1 || !blueprint2 || !blueprint3) {
        showMessage('Please select all three blueprint options', 'warning');
        return false;
    }

    const blueprints = [blueprint1, blueprint2, blueprint3];
    const uniqueBlueprints = new Set(blueprints);

    if (uniqueBlueprints.size !== 3) {
        showMessage('Please select three different buildings for your blueprints', 'warning');
        return false;
    }

    return true;
}