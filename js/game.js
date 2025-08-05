import { locale, deviceDefinitions, upgradeNames, achievementNames, deviceInfoTexts } from './config.js';
import { uiManager } from './ui.js';

export class DataStorageGame {
    constructor() {
        this.gameState = {};
        this.visualGameState = { totalData: 0, estimatedDPS: 0 };
        this.upgradeDefinitions = [];
        this.achievementDefinitions = [];
        this.autoSaveIntervalId = null;
        this.didYouKnowIntervalId = null;
        this.init();
    }

    init() {
        this.resetGameState();
        this.generateUpgrades();
        this.generateAchievements();
        uiManager.applyTranslations();
        uiManager.renderInitialStructure();
        this.loadGame(); // This now handles offline progress
        this.bindEvents();
        this.startGameLoop();
        this.startTimers();
    }

    // Helper function to convert numbers to Roman numerals for upgrade levels.
    toRoman(num) {
        if (isNaN(num) || num < 1) return num.toString();
        const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
        let str = '';
        for (let i of Object.keys(roman)) {
            let q = Math.floor(num / roman[i]);
            num -= q * roman[i];
            str += i.repeat(q);
        }
        return str;
    }

    resetGameState(returnState = false) {
        const defaultState = {
            totalData: 0,
            clickPower: 5,
            dpsToClickRate: 0,
            lastSaveTime: null,
            devices: {},
            upgrades: {},
            achievements: {},
            revealedDevices: { punchCard: true },
            settings: {
                shadowsEnabled: true,
                floatingTextEnabled: true,
                numberFormat: 'short', // 'short' or 'long'
                autoSaveInterval: 30000, // in ms
            }
        };
        for (const id in deviceDefinitions) {
            defaultState.devices[id] = {
                id,
                count: 0,
                cost: deviceDefinitions[id].cost,
                progress: 0,
                speedMultiplier: 1,
                amountMultiplier: 1,
                creatorBuff: 1,
                hasSelfSynergy: false,
                crossSynergySources: {}
            };
        }

        if (returnState) return JSON.parse(JSON.stringify(defaultState));

        this.gameState = JSON.parse(JSON.stringify(defaultState));
        this.visualGameState = { totalData: this.gameState.totalData, estimatedDPS: this.gameState.estimatedDPS };
    }

    generateUpgrades() {
        const deviceIds = Object.keys(deviceDefinitions);
        deviceIds.forEach((id, index) => {
            const deviceDef = deviceDefinitions[id];
            
            // Generate a large number of upgrades to feel "infinite".
            for (let i = 0; i < 100; i++) {
                const speedEffect = 1 + (0.25 + i * 0.05);
                this.upgradeDefinitions.push({
                    id: `${id}_speed_${i}`,
                    name: `${upgradeNames[id].speed} ${this.toRoman(i + 1)}`,
                    description: `Aumenta a velocidade de transferência dos ${deviceDef.name}s em ${((speedEffect - 1) * 100).toFixed(0)}%.`,
                    cost: deviceDef.cost * 40 * Math.pow(2.8, i),
                    effect: () => { this.gameState.devices[id].speedMultiplier *= speedEffect; },
                    requirement: () => this.gameState.devices[id].count >= (5 + (i * 5))
                });

                const amountEffect = 1 + (0.25 + i * 0.05);
                this.upgradeDefinitions.push({
                    id: `${id}_amount_${i}`,
                    name: `${upgradeNames[id].amount} ${this.toRoman(i + 1)}`,
                    description: `Aumenta a quantidade de dados por ciclo dos ${deviceDef.name}s em ${((amountEffect - 1) * 100).toFixed(0)}%.`,
                    cost: deviceDef.cost * 30 * Math.pow(2.7, i),
                    effect: () => { this.gameState.devices[id].amountMultiplier *= amountEffect; },
                    requirement: () => this.gameState.devices[id].count >= (1 + (i * 5))
                });
            }

            // Keep unique, powerful upgrades separate.
            this.upgradeDefinitions.push({
                id: `${id}_creator`,
                name: `Visão de ${deviceDef.creator}`,
                description: `Aumenta o efeito de todas as outras melhorias de ${deviceDef.name} em 50%.`,
                cost: deviceDef.cost * 1e6,
                effect: () => { this.gameState.devices[id].creatorBuff = 1.5; },
                requirement: () => this.gameState.devices[id].count >= 50
            });

            this.upgradeDefinitions.push({
                id: `${id}_self_synergy`,
                name: `Firmware Adaptativo`,
                description: `Aumenta a quantia por ciclo em 0.5% para cada ${deviceDef.name} que você possui.`,
                cost: deviceDef.cost * 2500,
                effect: () => { this.gameState.devices[id].hasSelfSynergy = true; },
                requirement: () => this.gameState.devices[id].count >= 25
            });

            if (index > 0) {
                const prevDeviceId = deviceIds[index - 1];
                this.upgradeDefinitions.push({
                    id: `${id}_cross_synergy_${prevDeviceId}`,
                    name: `Sinergia: ${deviceDef.name.split(" ")[1]}`,
                    description: `Cada ${deviceDef.name} aumenta a quantia de ${deviceDefinitions[prevDeviceId].name}s em 1%.`,
                    cost: deviceDef.cost * 5000,
                    effect: () => { this.gameState.devices[prevDeviceId].crossSynergySources[id] = 0.01; },
                    requirement: () => this.gameState.devices[id].count >= 10
                });
            }
        });

        // Global / Click upgrades
        this.upgradeDefinitions.push({
            id: 'triple_synergy_hdd_sata_nvme',
            name: 'Hierarquia de Armazenamento',
            description: 'HDs, SSDs SATA e SSDs NVMe aumentam a produção uns dos outros em 10%.',
            cost: 5e9,
            effect: () => {
                this.gameState.devices.hdd.crossSynergySources.sata = 0.1;
                this.gameState.devices.hdd.crossSynergySources.nvme = 0.1;
                this.gameState.devices.sata.crossSynergySources.hdd = 0.1;
                this.gameState.devices.sata.crossSynergySources.nvme = 0.1;
                this.gameState.devices.nvme.crossSynergySources.hdd = 0.1;
                this.gameState.devices.nvme.crossSynergySources.sata = 0.1;
            },
            requirement: () => this.gameState.devices.hdd.count >= 1 && this.gameState.devices.sata.count >= 1 && this.gameState.devices.nvme.count >= 1
        });

        this.upgradeDefinitions.push({
            id: 'punchCard_click_1', name: 'Dedos Ágeis',
            description: 'Dobra o poder do seu clique.', cost: 750,
            effect: () => { this.gameState.clickPower *= 2; },
            requirement: () => this.gameState.devices.punchCard.count >= 10
        });
        this.upgradeDefinitions.push({
            id: 'punchCard_click_2', name: 'Mouse de Cartão',
            description: 'Triplica o poder do seu clique.', cost: 15000,
            effect: () => { this.gameState.clickPower *= 3; },
            requirement: () => this.gameState.devices.punchCard.count >= 25
        });
        this.upgradeDefinitions.push({
            id: 'punchCard_click_3', name: 'Clique Sinergético',
            description: 'Aumenta o poder do seu clique em 1% do seu DPS total.', cost: 150000,
            effect: () => { this.gameState.dpsToClickRate = 0.01; },
            requirement: () => this.gameState.devices.punchCard.count >= 50
        });
    }

    generateAchievements() {
        const deviceIds = Object.keys(deviceDefinitions);
        const achievementTiers = [1, 10, 25, 50, 100, 250, 500, 1000];
        deviceIds.forEach(id => {
            achievementTiers.forEach((val, i) => {
                this.achievementDefinitions.push({
                    id: `d_count_${id}_${i}`, name: achievementNames[id][i],
                    description: `Possua ${val} ${deviceDefinitions[id].name}s.`,
                    requirement: () => this.gameState.devices[id].count >= val
                });
            });
        });
        const dataMilestones = [1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27];
        dataMilestones.forEach((val, i) => {
            this.achievementDefinitions.push({
                id: `data_${i}`, name: `Acumulador de Dados ${this.toRoman(i + 1)}`,
                description: `Acumule ${uiManager.formatNumber(val)} de dados.`,
                requirement: () => this.gameState.totalData >= val
            });
        });
    }

    calculateClickPower() {
        const basePower = this.gameState.clickPower;
        const dpsBonus = this.gameState.estimatedDPS * this.gameState.dpsToClickRate;
        return basePower + dpsBonus;
    }

    handleClick(event) {
        const currentClickPower = this.calculateClickPower();
        this.gameState.totalData += currentClickPower;

        uiManager.showDataAnimation(currentClickPower, document.getElementById('clickButton'), 'click', event);
        this.checkDeviceRevelations();
        uiManager.updateUIDisplay(this.gameState);
        this.checkAchievements();
        uiManager.updateBuyButtonStates(this.gameState, this.upgradeDefinitions);
    }

    buyDevice(deviceId) {
        const device = this.gameState.devices[deviceId];
        if (this.gameState.totalData >= device.cost) {
            this.gameState.totalData -= device.cost;
            if (device.count === 0) {
                uiManager.startCycleAnimation(device, this.getBuffedMultiplier.bind(this));
            }
            device.count++;
            device.cost = Math.floor(deviceDefinitions[deviceId].cost * Math.pow(1.30, device.count));
            this.updateAllCalculations();
        }
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgradeDefinitions.find(u => u.id === upgradeId);
        if (upgrade && !this.gameState.upgrades[upgradeId] && this.gameState.totalData >= upgrade.cost) {
            this.gameState.totalData -= upgrade.cost;
            this.gameState.upgrades[upgradeId] = true;
            upgrade.effect();
            this.updateAllCalculations();
            uiManager.showNotification(`${locale.upgradePurchased}: ${upgrade.name}`);
        }
    }

    getBuffedMultiplier(baseMultiplier, creatorBuff) {
        return 1 + ((baseMultiplier - 1) * creatorBuff);
    }

    calculateTotalMultiplier(device) {
        const creatorBuff = device.creatorBuff || 1;
        let totalMultiplier = this.getBuffedMultiplier(device.amountMultiplier, creatorBuff);

        if (device.hasSelfSynergy) {
            totalMultiplier *= (1 + (device.count * 0.005));
        }
        for (const sourceId in device.crossSynergySources) {
            const sourceDevice = this.gameState.devices[sourceId];
            const synergyRate = device.crossSynergySources[sourceId];
            totalMultiplier *= (1 + (sourceDevice.count * synergyRate));
        }
        return totalMultiplier;
    }

    calculateEstimatedDPS() {
        this.gameState.estimatedDPS = Object.values(this.gameState.devices).reduce((total, device) => {
            if (device.count > 0) {
                const def = deviceDefinitions[device.id];
                const totalAmountMultiplier = this.calculateTotalMultiplier(device);
                const totalSpeedMultiplier = this.getBuffedMultiplier(device.speedMultiplier, device.creatorBuff);
                return total + (device.count * def.baseAmount * totalAmountMultiplier) / (def.baseTime / totalSpeedMultiplier);
            }
            return total;
        }, 0);
    }

    updateAllCalculations() {
        this.calculateEstimatedDPS();
        uiManager.updateAllDeviceUIData(
            this.gameState,
            (d) => this.calculateTotalMultiplier(d),
            this.getBuffedMultiplier.bind(this)
        );
        uiManager.renderAvailableUpgrades(this.upgradeDefinitions, this.gameState);
        this.checkAchievements();
        uiManager.updateBuyButtonStates(this.gameState, this.upgradeDefinitions);
        uiManager.updateUIDisplay(this.gameState);
    }

    updateDeviceProgress(deltaTime) {
        let dataGeneratedThisTick = 0;
        for (const device of Object.values(this.gameState.devices)) {
            if (device.count > 0) {
                device.progress += deltaTime;
                const totalSpeedMultiplier = this.getBuffedMultiplier(device.speedMultiplier, device.creatorBuff);
                const cycleTime = deviceDefinitions[device.id].baseTime / totalSpeedMultiplier;

                if (device.progress >= cycleTime) {
                    const numCycles = Math.floor(device.progress / cycleTime);
                    const totalAmountMultiplier = this.calculateTotalMultiplier(device);
                    const dataGenerated = numCycles * device.count * deviceDefinitions[device.id].baseAmount * totalAmountMultiplier;

                    dataGeneratedThisTick += dataGenerated;

                    const deviceCard = document.getElementById(`device-card-${device.id}`);
                    if (deviceCard) uiManager.showDataAnimation(dataGenerated, deviceCard, 'cycle');

                    device.progress -= numCycles * cycleTime;
                    uiManager.startCycleAnimation(device, this.getBuffedMultiplier.bind(this));
                }
            }
        }
        if (dataGeneratedThisTick > 0) {
            this.gameState.totalData += dataGeneratedThisTick;
            this.checkDeviceRevelations();
            this.updateAllCalculations();
        }
    }

    checkAchievements() {
        let newAchievementUnlocked = false;
        this.achievementDefinitions.forEach(ach => {
            if (!this.gameState.achievements[ach.id] && ach.requirement()) {
                this.gameState.achievements[ach.id] = true;
                newAchievementUnlocked = true;
                uiManager.showNotification(`${locale.achievementUnlocked}: ${ach.name}`);
            }
        });
        if (newAchievementUnlocked) uiManager.renderAchievements(this.achievementDefinitions, this.gameState);
    }

    checkDeviceRevelations() {
        let changed = false;
        for (const id in deviceDefinitions) {
            if (!this.gameState.revealedDevices[id]) {
                if (this.gameState.totalData >= deviceDefinitions[id].cost / 3) {
                    this.gameState.revealedDevices[id] = true;
                    changed = true;
                }
            }
        }
        if (changed) {
            uiManager.updateDeviceVisibility(this.gameState);
        }
    }

    startGameLoop() {
        let lastTime = performance.now();
        const gameTick = (currentTime) => {
            const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
            lastTime = currentTime;
            this.updateDeviceProgress(deltaTime);
            requestAnimationFrame(gameTick);
        };
        requestAnimationFrame(gameTick);
    }

    startTimers() {
        // Setup autosave interval based on settings
        this.setupAutoSaveInterval();

        // Setup "Did You Know" popups
        if (this.didYouKnowIntervalId) clearInterval(this.didYouKnowIntervalId);
        this.didYouKnowIntervalId = setInterval(() => {
            // Only show if the player has bought at least one device
            if (Object.values(this.gameState.devices).some(d => d.count > 0)) {
                uiManager.showDidYouKnowPopup();
            }
        }, 120000); // Every 2 minutes
    }

    setupAutoSaveInterval() {
        if (this.autoSaveIntervalId) {
            clearInterval(this.autoSaveIntervalId);
        }
        const interval = this.gameState.settings.autoSaveInterval;
        if (interval > 0) {
            this.autoSaveIntervalId = setInterval(() => this.saveGame(true), interval);
        }
    }

    bindEvents() {
        document.getElementById('clickButton').addEventListener('click', (event) => this.handleClick(event));
        document.body.addEventListener('click', (e) => {
            const deviceCard = e.target.closest('.device-card.can-buy');
            if (deviceCard && !e.target.closest('.info-icon')) {
                this.buyDevice(deviceCard.dataset.deviceId);
                return;
            }

            if (e.target?.matches('.buy-button.can-buy')) {
                this.buyUpgrade(e.target.id.replace('buy-', ''));
            }

            if (e.target?.closest('.info-icon')) {
                const deviceId = e.target.closest('.info-icon').dataset.deviceId;
                uiManager.toggleModal('info-modal', true, { title: deviceDefinitions[deviceId].name, text: deviceInfoTexts[deviceId] });
            }
        });

        document.getElementById('trophy-button').addEventListener('click', () => uiManager.toggleModal('achievements-modal', true));
        document.getElementById('achievements-modal-close').addEventListener('click', () => uiManager.toggleModal('achievements-modal', false));
        document.getElementById('achievements-modal').addEventListener('click', (e) => { if (e.target.id === 'achievements-modal') uiManager.toggleModal('achievements-modal', false); });

        document.getElementById('info-modal-close').addEventListener('click', () => uiManager.toggleModal('info-modal', false));
        document.getElementById('info-modal').addEventListener('click', (e) => { if (e.target.id === 'info-modal') uiManager.toggleModal('info-modal', false); });

        document.getElementById('settings-button').addEventListener('click', () => {
            uiManager.updateSettingsUI(this.gameState.settings);
            uiManager.toggleModal('settings-modal', true);
        });
        document.getElementById('settings-modal-close').addEventListener('click', () => uiManager.toggleModal('settings-modal', false));
        document.getElementById('settings-modal').addEventListener('click', (e) => { if (e.target.id === 'settings-modal') uiManager.toggleModal('settings-modal', false); });

        document.getElementById('saveButton').addEventListener('click', () => this.saveGame());
        
        // Reset and Confirmation Modal
        document.getElementById('resetButton').addEventListener('click', () => {
            uiManager.toggleModal('reset-confirm-modal', true);
        });
        document.getElementById('confirm-reset-button').addEventListener('click', () => this.resetGame());
        document.getElementById('cancel-reset-button').addEventListener('click', () => uiManager.toggleModal('reset-confirm-modal', false));
        document.getElementById('reset-confirm-modal').addEventListener('click', (e) => { if (e.target.id === 'reset-confirm-modal') uiManager.toggleModal('reset-confirm-modal', false); });


        // Settings Listeners with Toasts
        const showSettingsSavedToast = () => uiManager.showNotification(locale.settingsSaved);

        document.getElementById('shadowsToggle').addEventListener('change', (e) => {
            this.gameState.settings.shadowsEnabled = e.target.checked;
            uiManager.applyVisualSettings(this.gameState.settings);
            showSettingsSavedToast();
        });
        document.getElementById('floatingTextToggle').addEventListener('change', (e) => {
            this.gameState.settings.floatingTextEnabled = e.target.checked;
            showSettingsSavedToast();
        });
        document.getElementById('numberFormatSelect').addEventListener('change', (e) => {
            this.gameState.settings.numberFormat = e.target.value;
            this.updateAllCalculations(); // Refresh UI with new format
            showSettingsSavedToast();
        });
        document.getElementById('autoSaveIntervalSelect').addEventListener('change', (e) => {
            this.gameState.settings.autoSaveInterval = parseInt(e.target.value, 10);
            this.setupAutoSaveInterval();
            showSettingsSavedToast();
        });

        window.addEventListener('beforeunload', () => this.saveGame(true));
    }

    saveGame(isAutoSave = false) {
        this.gameState.lastSaveTime = Date.now();
        localStorage.setItem('dataStorageGameSave', JSON.stringify(this.gameState));
        if (!isAutoSave) uiManager.showNotification(locale.gameSaved);
    }

    loadGame() {
        const savedData = localStorage.getItem('dataStorageGameSave');
        const defaultState = this.resetGameState(true); 

        if (savedData) {
            try {
                const loadedState = JSON.parse(savedData);
                // Deep merge to prevent issues with new/missing properties in save file
                this.gameState = {
                    ...defaultState,
                    ...loadedState,
                    devices: { ...defaultState.devices },
                    upgrades: { ...loadedState.upgrades },
                    achievements: { ...loadedState.achievements },
                    revealedDevices: { ...loadedState.revealedDevices },
                    settings: { ...defaultState.settings, ...loadedState.settings },
                };

                if (loadedState.devices) {
                    for (const deviceId in this.gameState.devices) {
                        if (loadedState.devices[deviceId]) {
                            this.gameState.devices[deviceId] = {
                                ...this.gameState.devices[deviceId],
                                ...loadedState.devices[deviceId]
                            };
                        }
                    }
                }
                
                // Calculate offline progress
                this.calculateOfflineProgress(loadedState.lastSaveTime);

            } catch (e) {
                console.error('Failed to parse saved data, resetting game.', e);
                this.resetGame();
            }
        }
        
        // Show one-time autosave toast
        if (!localStorage.getItem('autosaveToastShown')) {
            uiManager.showInitialAutoSaveToast();
            localStorage.setItem('autosaveToastShown', 'true');
        }

        uiManager.applyVisualSettings(this.gameState.settings);
        this.checkDeviceRevelations();
        uiManager.updateDeviceVisibility(this.gameState);
        this.updateAllCalculations();
        Object.values(this.gameState.devices).forEach(d => {
            if (d.count > 0) uiManager.startCycleAnimation(d, this.getBuffedMultiplier.bind(this));
        });
    }
    
    calculateOfflineProgress(lastSaveTime) {
        if (!lastSaveTime) return;

        this.calculateEstimatedDPS(); // Calculate DPS based on loaded state
        const dps = this.gameState.estimatedDPS;
        if (dps === 0) return;

        const currentTime = Date.now();
        const timeDiff = currentTime - lastSaveTime;
        
        // Cap offline time to 24 hours to prevent exploitation
        const maxOfflineTime = 24 * 60 * 60 * 1000;
        const effectiveTimeDiff = Math.min(timeDiff, maxOfflineTime);

        if (effectiveTimeDiff < 60000) return; // Don't award for less than a minute

        const earnings = (effectiveTimeDiff / 1000) * dps;
        this.gameState.totalData += earnings;
        
        const formattedEarnings = uiManager.formatNumber(earnings);
        const formattedTime = uiManager.formatTime(effectiveTimeDiff);
        uiManager.showNotification(locale.offlineEarningsReport(formattedEarnings, formattedTime));
    }


    resetGame() {
        localStorage.removeItem('dataStorageGameSave');
        // Keep the autosave toast shown flag so it doesn't reappear
        // localStorage.removeItem('autosaveToastShown'); 
        
        this.resetGameState();
        
        uiManager.toggleModal('reset-confirm-modal', false);
        uiManager.toggleModal('settings-modal', false);
        
        uiManager.applyVisualSettings(this.gameState.settings);
        this.setupAutoSaveInterval();
        uiManager.updateDeviceVisibility(this.gameState);
        this.updateAllCalculations();
    }
}
