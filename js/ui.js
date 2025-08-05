import { locale, deviceDefinitions, didYouKnowMessages } from './config.js';

class UIManager {
    constructor() {
        this.domRefs = { devices: {}, stats: {} };
    }

    formatNumber(num, unitType = 'bytes') {
        if (isNaN(num) || num === null) return '...';

        const format = window.game?.gameState.settings.numberFormat || 'short';
        if (format === 'long' && unitType !== 'plain') {
            return num.toLocaleString('pt-BR');
        }
        if (unitType === 'plain') return num.toLocaleString('pt-BR');

        const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const divisor = 1000;
        if (num < divisor) return `${num.toFixed(0)} ${units[0]}`;
        const i = Math.min(units.length - 1, Math.floor(Math.log10(num) / 3));
        return `${(num / Math.pow(divisor, i)).toFixed(2)} ${units[i]}`;
    }

    formatTime(ms) {
        if (ms < 1000) return "alguns instantes";
        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 && parts.length < 2) parts.push(`${seconds}s`);
        
        return parts.slice(0, 2).join(' ');
    }


    applyTranslations() {
        document.getElementById('game-title').textContent = locale.gameTitle;
        document.getElementById('clickButton').textContent = locale.generateData;
        document.getElementById('devices-title').textContent = locale.storageDevices;
        document.getElementById('upgrades-title').textContent = locale.upgrades;
        // Correctly target the h2 inside the modal for achievements
        document.querySelector('#achievements-modal .modal-header h2').textContent = locale.achievements;
        document.querySelector('#settings-modal .modal-header h2').textContent = locale.settings;
        document.getElementById('saveButton').textContent = locale.saveGame;
        document.getElementById('resetButton').textContent = locale.resetGame;
        
        // Settings translations
        document.getElementById('label-shadows').textContent = locale.settingVisualEffects;
        document.getElementById('label-floating').textContent = locale.settingFloatingText;
        document.getElementById('label-numberFormat').textContent = locale.settingNumberFormat;
        document.getElementById('label-autosave').textContent = locale.settingAutosave;
        document.querySelector('#numberFormatSelect option[value="short"]').textContent = locale.numberFormatShort;
        document.querySelector('#numberFormatSelect option[value="long"]').textContent = locale.numberFormatLong;
        document.querySelector('#autoSaveIntervalSelect option[value="30000"]').textContent = locale.autosaveInterval30s;
        document.querySelector('#autoSaveIntervalSelect option[value="60000"]').textContent = locale.autosaveInterval1m;
        document.querySelector('#autoSaveIntervalSelect option[value="300000"]').textContent = locale.autosaveInterval5m;
        document.querySelector('#autoSaveIntervalSelect option[value="0"]').textContent = locale.autosaveIntervalOff;
        
        // Reset Confirm Modal translations
        document.getElementById('reset-confirm-title').textContent = locale.resetConfirmTitle;
        document.getElementById('reset-confirm-text').textContent = locale.resetConfirmText;
        document.getElementById('confirm-reset-button').textContent = locale.confirmAction;
        document.getElementById('cancel-reset-button').textContent = locale.cancelAction;
    }

    renderInitialStructure() {
        const devicesContainer = document.getElementById('storageDevices');
        let devicesHTML = '';
        for (const id in deviceDefinitions) {
            const infoIconSVG = `<svg class="info-icon" data-device-id="${id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg>`;
            devicesHTML += `
                <div class="card device-card" id="device-card-${id}" data-device-id="${id}">
                    <div class="card-progress" id="device-progress-${id}"></div>
                    <div class="card-content">
                        <div class="card-header">
                            <div class="card-name">${deviceDefinitions[id].name}</div>
                            <div class="card-controls">
                                ${infoIconSVG}
                                <div class="card-count" id="device-count-${id}"></div>
                            </div>
                        </div>
                        <div class="card-stats">
                            <div id="device-amount-${id}"></div>
                            <div id="device-time-${id}"></div>
                        </div>
                        <div class="device-cost">
                            <img src="assets/data-storage.png" alt="Data" class="cost-icon">
                            <span id="device-cost-${id}"></span>
                        </div>
                    </div>
                </div>`;
        }
        devicesContainer.innerHTML = devicesHTML;

        for (const id in deviceDefinitions) {
            this.domRefs.devices[id] = {
                card: document.getElementById(`device-card-${id}`),
                count: document.getElementById(`device-count-${id}`),
                amount: document.getElementById(`device-amount-${id}`),
                time: document.getElementById(`device-time-${id}`),
                cost: document.getElementById(`device-cost-${id}`),
                progress: document.getElementById(`device-progress-${id}`),
            };
        }
        this.domRefs.stats = {
            totalData: document.getElementById('totalData'),
            estimatedDPS: document.getElementById('dataPerSecond'),
        };
        this.domRefs.upgradesContainer = document.getElementById('upgradesList');
    }

    updateUIDisplay(gameState) {
        this.domRefs.stats.totalData.textContent = this.formatNumber(gameState.totalData);
        this.domRefs.stats.estimatedDPS.innerHTML = `${this.formatNumber(gameState.estimatedDPS)}/s <img src="assets/data-storage.png" alt="Data">`;
        document.title = `${this.formatNumber(gameState.totalData)} - ${locale.gameTitle}`;
    }

    updateDeviceUIData(device, totalAmountMultiplier, getBuffedMultiplier) {
        const def = deviceDefinitions[device.id];
        const refs = this.domRefs.devices[device.id];
        const totalSpeedMultiplier = getBuffedMultiplier(device.speedMultiplier, device.creatorBuff);
        const cycleTime = def.baseTime / totalSpeedMultiplier;

        refs.count.textContent = `${locale.owned}: ${this.formatNumber(device.count, 'plain')}`;

        if (device.count > 0) {
            const totalAmountPerCycle = def.baseAmount * totalAmountMultiplier * device.count;
            refs.amount.textContent = `${locale.transferAmount}: ${this.formatNumber(totalAmountPerCycle)}`;
            refs.amount.style.display = 'block';
        } else {
            refs.amount.style.display = 'none';
        }

        refs.time.textContent = `${locale.cycleTime}: ${cycleTime.toFixed(2)}s`;
        refs.cost.textContent = this.formatNumber(device.cost);
    }

    updateAllDeviceUIData(gameState, calculateTotalMultiplier, getBuffedMultiplier) {
        for (const id in deviceDefinitions) {
            const device = gameState.devices[id];
            const totalMultiplier = calculateTotalMultiplier(device);
            this.updateDeviceUIData(device, totalMultiplier, getBuffedMultiplier);
        }
    }

    updateDeviceVisibility(gameState) {
        for (const id in deviceDefinitions) {
            const card = this.domRefs.devices[id]?.card;
            if (card) {
                card.classList.toggle('hidden', !gameState.revealedDevices[id]);
            }
        }
    }

    showDataAnimation(amount, sourceElement, type, event) {
        if (!window.game.gameState.settings.floatingTextEnabled || !sourceElement) return;

        const rect = sourceElement.getBoundingClientRect();
        const animation = document.createElement('div');
        animation.className = `data-animation ${type}-animation`;
        animation.textContent = `+${this.formatNumber(amount)}`;
        if (type === 'click' && event) {
            animation.style.left = `${event.clientX}px`;
            animation.style.top = `${event.clientY - 20}px`;
        } else {
            animation.style.left = `${rect.left + rect.width / 2}px`;
            animation.style.top = `${rect.top + rect.height / 2}px`;
        }
        document.body.appendChild(animation);
        setTimeout(() => { if (document.body.contains(animation)) document.body.removeChild(animation) }, 2000);
    }

    startCycleAnimation(device, getBuffedMultiplier) {
        const progressBar = this.domRefs.devices[device.id].progress;
        if (!progressBar) return;

        const totalSpeedMultiplier = getBuffedMultiplier(device.speedMultiplier, device.creatorBuff);
        const cycleTime = deviceDefinitions[device.id].baseTime / totalSpeedMultiplier;

        progressBar.style.setProperty('--cycle-time', cycleTime + 's');
        progressBar.classList.remove('running');
        void progressBar.offsetWidth;
        progressBar.classList.add('running');
    }

    renderAvailableUpgrades(upgrades, gameState) {
        const availableUpgrades = upgrades
            .filter(u => !gameState.upgrades[u.id] && u.requirement())
            .sort((a, b) => a.cost - b.cost);
        let html = '';
        if (availableUpgrades.length === 0) {
            html = `<div class="placeholder">${locale.noUpgradesAvailable}</div>`;
        } else {
            availableUpgrades.forEach(upgrade => {
                html += `
                <div class="card upgrade-card" id="upgrade-card-${upgrade.id}">
                    <div class="card-content">
                         <div class="card-name">${upgrade.name}</div>
                         <div class="card-description">${upgrade.description}</div>
                         <button id="buy-${upgrade.id}" class="buy-button">
                            ${locale.cost}: ${this.formatNumber(upgrade.cost)}
                         </button>
                    </div>
                </div>`;
            });
        }
        this.domRefs.upgradesContainer.innerHTML = html;
    }

    updateBuyButtonStates(gameState, upgrades) {
        const canAfford = (cost) => gameState.totalData >= cost;
        for (const id in this.domRefs.devices) {
            this.domRefs.devices[id].card.classList.toggle('can-buy', canAfford(gameState.devices[id].cost));
        }
        upgrades.forEach(upgrade => {
            if (!gameState.upgrades[upgrade.id]) {
                const btn = document.getElementById(`buy-${upgrade.id}`);
                if (btn) btn.classList.toggle('can-buy', canAfford(upgrade.cost));
            }
        });
    }

    renderAchievements(achievements, gameState) {
        const container = document.getElementById('achievementsList');
        const title = document.querySelector('#achievements-modal .modal-header h2');
        const completedCount = Object.values(gameState.achievements).filter(Boolean).length;
        title.textContent = `${locale.achievements} (${completedCount}/${achievements.length})`;
        container.innerHTML = achievements.map(ach => `
            <div class="card achievement-card ${gameState.achievements[ach.id] ? 'completed' : ''}">
                <div class="card-content">
                    <div class="card-name">${gameState.achievements[ach.id] ? '🏆' : '🔒'} ${ach.name}</div>
                    <div class="card-description">${ach.description}</div>
                </div>
            </div>`).join('');
    }

    showNotification(message) {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        container.appendChild(notification);
        setTimeout(() => { if (container.contains(notification)) container.removeChild(notification) }, 4000);
    }

    showInitialAutoSaveToast() {
        const container = document.getElementById('autosave-toast-container');
        const toast = document.createElement('div');
        toast.className = 'autosave-toast';
        toast.textContent = locale.autosaveReminder;
        container.appendChild(toast);
        setTimeout(() => { if (container.contains(toast)) container.removeChild(toast) }, 8000);
    }

    showDidYouKnowPopup() {
        const container = document.getElementById('did-you-know-container');
        const message = didYouKnowMessages[Math.floor(Math.random() * didYouKnowMessages.length)];
        const popup = document.createElement('div');
        popup.className = 'did-you-know-popup';
        popup.textContent = message;
        container.appendChild(popup);
        setTimeout(() => { if (container.contains(popup)) container.removeChild(popup) }, 10000);
    }

    toggleModal(modalId, show, data) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.toggle('hidden', !show);
            if (show && data && document.getElementById(`${modalId}-title`)) {
                document.getElementById(`${modalId}-title`).textContent = data.title;
                document.getElementById(`${modalId}-text`).textContent = data.text;
            }
        }
    }

    applyVisualSettings(settings) {
        document.body.classList.toggle('no-shadows', !settings.shadowsEnabled);
    }
    
    updateSettingsUI(settings) {
        document.getElementById('shadowsToggle').checked = settings.shadowsEnabled;
        document.getElementById('floatingTextToggle').checked = settings.floatingTextEnabled;
        document.getElementById('numberFormatSelect').value = settings.numberFormat;
        document.getElementById('autoSaveIntervalSelect').value = settings.autoSaveInterval;
    }
}

export const uiManager = new UIManager();
