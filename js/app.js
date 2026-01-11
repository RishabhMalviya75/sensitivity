// SensiFinder - Main Application Logic

// State
let currentGame = null;
let currentSearchQuery = '';
let profiles = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();

    // Check which page we're on
    const page = document.body.dataset.page;

    switch (page) {
        case 'home':
            initHomePage();
            break;
        case 'upload':
            initUploadPage();
            break;
        case 'profile':
            initProfilePage();
            break;
        case 'converter':
            initConverterPage();
            break;
    }
});

// ==================== NAVBAR ====================
function initNavbar() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = mobileMenu.classList.contains('active')
                ? ICONS.close
                : ICONS.menu;
        });
    }

    // Set active nav link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath ||
            (currentPath.includes('index') && link.getAttribute('href') === 'index.html') ||
            (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ==================== HOME PAGE ====================
function initHomePage() {
    loadProfiles();
    initSearch();
    initGameFilters();
}

function loadProfiles() {
    showLoadingState();

    // Simulate loading delay for better UX
    setTimeout(() => {
        profiles = filterProfiles(currentGame, currentSearchQuery);
        renderProfiles();
    }, 300);
}

function showLoadingState() {
    const grid = document.getElementById('profiles-grid');
    if (!grid) return;

    grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-header">
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton-lines">
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line"></div>
                </div>
            </div>
            <div class="skeleton skeleton-box"></div>
            <div class="skeleton skeleton-button"></div>
        </div>
    `).join('');
}

function renderProfiles() {
    const grid = document.getElementById('profiles-grid');
    const sectionTitle = document.getElementById('section-title');
    const sectionSubtitle = document.getElementById('section-subtitle');
    const backLink = document.getElementById('back-link');

    if (!grid) return;

    // Update section header
    if (sectionTitle) {
        sectionTitle.textContent = currentSearchQuery
            ? `Results for "${currentSearchQuery}"`
            : 'Trending Sensitivities';
    }

    if (sectionSubtitle) {
        sectionSubtitle.textContent = currentSearchQuery
            ? `${profiles.length} profiles found`
            : 'Most upvoted sensitivity profiles from the community';
    }

    if (backLink) {
        backLink.classList.toggle('hidden', !currentSearchQuery);
    }

    // Render profiles or empty state
    if (profiles.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">${ICONS.users}</div>
                <h3 class="empty-title">No profiles found</h3>
                <p class="empty-text">
                    ${currentSearchQuery
                ? `No sensitivity profiles match "${currentSearchQuery}"`
                : 'Be the first to upload a sensitivity profile!'}
                </p>
                <a href="upload.html" class="btn btn-primary">Upload Your Sensitivity</a>
            </div>
        `;
        return;
    }

    grid.innerHTML = profiles.map(profile => createProfileCard(profile)).join('');

    // Add event listeners for copy buttons
    grid.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const code = e.currentTarget.dataset.code;
            const success = await copyToClipboard(code);

            if (success) {
                const originalText = e.currentTarget.innerHTML;
                e.currentTarget.innerHTML = `${ICONS.check} Copied!`;
                e.currentTarget.classList.add('copied');

                setTimeout(() => {
                    e.currentTarget.innerHTML = originalText;
                    e.currentTarget.classList.remove('copied');
                }, 2000);

                showToast('Share code copied to clipboard!');
            }
        });
    });
}

function createProfileCard(profile) {
    const gameClass = GAME_CLASSES[profile.game_name] || '';
    const isVerified = profile.upvotes >= 50;

    return `
        <div class="sensitivity-card">
            <span class="card-game-badge ${gameClass}">${profile.game_name}</span>
            
            <div class="card-header">
                <div class="device-icon">${ICONS.smartphone}</div>
                <div class="device-info">
                    <h3>${profile.device_name}</h3>
                    <p>${profile.is_gyro_enabled ? 'Gyro Enabled' : 'Non-Gyro'}</p>
                </div>
            </div>
            
            <div class="share-code-box">
                <p class="share-code-label">Share Code</p>
                <p class="share-code-value">${profile.share_code}</p>
            </div>
            
            <div class="card-stats">
                <div class="upvotes">
                    ${ICONS.thumbsUp}
                    <span>${profile.upvotes}</span>
                </div>
                ${isVerified ? `
                    <span class="verified-badge">
                        ${ICONS.shield}
                        Verified
                    </span>
                ` : ''}
            </div>
            
            <div class="card-actions">
                <button class="btn btn-copy" data-code="${profile.share_code}">
                    ${ICONS.copy}
                    Copy Code
                </button>
                <a href="profile.html?id=${profile.id}" class="btn btn-view">
                    View
                    ${ICONS.arrowUpRight}
                </a>
            </div>
        </div>
    `;
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const debouncedSearch = debounce((query) => {
        currentSearchQuery = query;
        loadProfiles();
    }, 300);

    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value.trim());
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            currentSearchQuery = e.target.value.trim();
            loadProfiles();
        }
    });
}

function initGameFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const backLink = document.getElementById('back-link');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const game = btn.dataset.game;

            // Toggle filter
            if (currentGame === game) {
                currentGame = null;
                btn.classList.remove('active');
            } else {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentGame = game;
            }

            loadProfiles();
        });
    });

    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentSearchQuery = '';
            document.getElementById('search-input').value = '';
            loadProfiles();
        });
    }
}

// ==================== UPLOAD PAGE ====================
function initUploadPage() {
    const form = document.getElementById('upload-form');
    const gyroToggle = document.getElementById('gyro-toggle');
    const gyroSection = document.getElementById('gyro-section');

    // Initialize sliders
    initSliders();

    // Gyro toggle
    if (gyroToggle && gyroSection) {
        gyroToggle.addEventListener('click', () => {
            gyroToggle.classList.toggle('active');
            gyroSection.classList.toggle('hidden');
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit();
        });
    }
}

function initSliders() {
    document.querySelectorAll('.slider').forEach(slider => {
        const valueDisplay = slider.parentElement.nextElementSibling;

        slider.addEventListener('input', () => {
            if (valueDisplay) {
                valueDisplay.textContent = slider.value;
            }
        });
    });
}

function handleFormSubmit() {
    const formData = {
        game_name: document.getElementById('game-select').value,
        device_name: document.getElementById('device-name').value,
        share_code: document.getElementById('share-code').value,
        is_gyro_enabled: document.getElementById('gyro-toggle').classList.contains('active'),
        camera_sensitivity: getSensitivityValues('camera'),
        ads_sensitivity: getSensitivityValues('ads'),
        gyro_sensitivity: document.getElementById('gyro-toggle').classList.contains('active')
            ? getSensitivityValues('gyro')
            : null
    };

    // Validate
    if (!formData.game_name || !formData.device_name || !formData.share_code) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Save profile
    const savedProfile = saveProfile(formData);
    showToast('Sensitivity profile uploaded successfully!');

    // Redirect to home after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function getSensitivityValues(type) {
    const values = {};
    SCOPE_LABELS.forEach(({ key }) => {
        const slider = document.getElementById(`${type}-${key}`);
        values[key] = slider ? parseInt(slider.value) : 100;
    });
    return values;
}

// ==================== PROFILE PAGE ====================
function initProfilePage() {
    const profileId = getUrlParam('id');

    if (!profileId) {
        window.location.href = 'index.html';
        return;
    }

    const profile = getProfileById(profileId);

    if (!profile) {
        document.getElementById('profile-content').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">${ICONS.users}</div>
                <h3 class="empty-title">Profile not found</h3>
                <p class="empty-text">This sensitivity profile doesn't exist or has been removed.</p>
                <a href="index.html" class="btn btn-primary">Back to Home</a>
            </div>
        `;
        return;
    }

    renderProfile(profile);
}

function renderProfile(profile) {
    const content = document.getElementById('profile-content');
    if (!content) return;

    const gameClass = GAME_CLASSES[profile.game_name] || '';
    const characterImage = GAME_CHARACTERS[profile.game_name] || 'images/hero-character.png';
    const isVerified = profile.upvotes >= 50;

    content.innerHTML = `
        <div class="profile-header">
            <img src="${characterImage}" alt="${profile.game_name} Character" class="profile-character" onerror="this.src='images/hero-character.png'">
            
            <div class="profile-info">
                <span class="profile-game-badge card-game-badge ${gameClass}">${profile.game_name}</span>
                <h1 class="profile-device">${profile.device_name}</h1>
                
                <div class="profile-meta">
                    <div class="profile-meta-item">
                        ${ICONS.rotate}
                        ${profile.is_gyro_enabled ? 'Gyro Enabled' : 'Non-Gyro'}
                    </div>
                    <div class="profile-meta-item">
                        ${ICONS.thumbsUp}
                        ${profile.upvotes} upvotes
                    </div>
                    <div class="profile-meta-item">
                        ${ICONS.calendar}
                        ${formatDate(profile.created_at)}
                    </div>
                    ${isVerified ? `
                        <span class="verified-badge">
                            ${ICONS.shield}
                            Verified
                        </span>
                    ` : ''}
                </div>
                
                <div class="profile-share-code">
                    <div class="share-code-info">
                        <label>Share Code</label>
                        <p>${profile.share_code}</p>
                    </div>
                    <button class="btn btn-primary" id="copy-code-btn">
                        ${ICONS.copy}
                        Copy Code
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Camera Sensitivity -->
        <div class="sensitivity-section">
            <h2 class="sensitivity-section-title">
                ${ICONS.camera}
                Camera Sensitivity
            </h2>
            ${renderSensitivityTable(profile.camera_sensitivity)}
        </div>
        
        <!-- ADS Sensitivity -->
        <div class="sensitivity-section">
            <h2 class="sensitivity-section-title">
                ${ICONS.crosshair}
                ADS Sensitivity
            </h2>
            ${renderSensitivityTable(profile.ads_sensitivity)}
        </div>
        
        ${profile.is_gyro_enabled && profile.gyro_sensitivity ? `
            <!-- Gyro Sensitivity -->
            <div class="sensitivity-section">
                <h2 class="sensitivity-section-title">
                    ${ICONS.rotate}
                    Gyro Sensitivity
                </h2>
                ${renderSensitivityTable(profile.gyro_sensitivity)}
            </div>
        ` : ''}
    `;

    // Add copy button listener
    const copyBtn = document.getElementById('copy-code-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const success = await copyToClipboard(profile.share_code);
            if (success) {
                copyBtn.innerHTML = `${ICONS.check} Copied!`;
                copyBtn.classList.add('copied');
                showToast('Share code copied to clipboard!');

                setTimeout(() => {
                    copyBtn.innerHTML = `${ICONS.copy} Copy Code`;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        });
    }
}

function renderSensitivityTable(sensitivity) {
    return `
        <table class="sens-table">
            <thead>
                <tr>
                    <th>Scope</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                ${SCOPE_LABELS.map(({ key, label }) => `
                    <tr>
                        <td>${label}</td>
                        <td>${sensitivity[key]}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ==================== CONVERTER PAGE ====================
function initConverterPage() {
    const sourceGame = document.getElementById('source-game');
    const targetGame = document.getElementById('target-game');
    const convertBtn = document.getElementById('convert-btn');

    initSliders();

    if (convertBtn) {
        convertBtn.addEventListener('click', performConversion);
    }

    // Swap source/target when selecting
    [sourceGame, targetGame].forEach(select => {
        if (select) {
            select.addEventListener('change', () => {
                if (sourceGame.value === targetGame.value) {
                    // Swap values
                    const other = select === sourceGame ? targetGame : sourceGame;
                    const games = GAMES.filter(g => g !== select.value);
                    other.value = games[0];
                }
            });
        }
    });
}

function performConversion() {
    const sourceGame = document.getElementById('source-game').value;
    const targetGame = document.getElementById('target-game').value;

    if (sourceGame === targetGame) {
        showToast('Please select different games', 'error');
        return;
    }

    const resultsContainer = document.getElementById('conversion-results');

    // Get source values and convert
    const results = SCOPE_LABELS.map(({ key, label }) => {
        const slider = document.getElementById(`source-${key}`);
        const sourceValue = slider ? parseInt(slider.value) : 100;
        const convertedValue = convertSensitivity(sourceValue, sourceGame, targetGame);

        return { label, sourceValue, convertedValue };
    });

    // Display results
    resultsContainer.innerHTML = `
        <div class="sensitivity-section">
            <h2 class="sensitivity-section-title">
                ${ICONS.check}
                Converted to ${targetGame}
            </h2>
            <table class="sens-table">
                <thead>
                    <tr>
                        <th>Scope</th>
                        <th>${sourceGame}</th>
                        <th>${targetGame}</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(r => `
                        <tr>
                            <td>${r.label}</td>
                            <td>${r.sourceValue}</td>
                            <td style="color: var(--success);">${r.convertedValue}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    resultsContainer.classList.remove('hidden');
    showToast('Sensitivity converted successfully!');
}
