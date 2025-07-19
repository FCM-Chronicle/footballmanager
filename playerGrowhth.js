// 선수 성장 시스템
class PlayerGrowthSystem {
    constructor() {
        this.growthData = new Map(); // 선수별 성장 데이터 저장
    }

    // 게임 시작 시 25세 이하 선수들에게 성장 가능성 부여
    initializePlayerGrowth() {
        if (!gameData.selectedTeam) return;

        const teamPlayers = teams[gameData.selectedTeam];
        
        teamPlayers.forEach(player => {
            if (player.age <= 25 && !this.growthData.has(player.name)) {
                const growthPotential = this.calculateGrowthPotential(player);
                const monthsToGrow = (26 - player.age) * 12; // 26세까지 남은 개월 수
                
                this.growthData.set(player.name, {
                    currentRating: player.rating,
                    maxGrowth: growthPotential,
                    remainingGrowth: growthPotential,
                    monthsToGrow: monthsToGrow,
                    monthlyGrowth: monthsToGrow > 0 ? growthPotential / monthsToGrow : 0,
                    lastGrowthCheck: Date.now(),
                    totalGrowth: 0
                });

                console.log(`${player.name}: 성장 가능성 ${growthPotential}, 월별 성장 ${(growthPotential / monthsToGrow).toFixed(2)}`);
            }
        });
    }

    // 성장 가능성 계산 (3-15 사이의 랜덤 값)
    calculateGrowthPotential(player) {
        const baseGrowth = 3 + Math.random() * 12; // 3-15 사이
        
        // 나이에 따른 보정
        let ageModifier = 1;
        if (player.age <= 18) {
            ageModifier = 1.3; // 18세 이하는 30% 더 성장
        } else if (player.age <= 21) {
            ageModifier = 1.2; // 21세 이하는 20% 더 성장
        } else if (player.age <= 23) {
            ageModifier = 1.1; // 23세 이하는 10% 더 성장
        }

        // 현재 능력치에 따른 보정 (낮은 능력치는 성장 여지가 더 많음)
        let ratingModifier = 1;
        if (player.rating < 70) {
            ratingModifier = 1.2;
        } else if (player.rating < 80) {
            ratingModifier = 1.1;
        } else if (player.rating >= 90) {
            ratingModifier = 0.8; // 이미 높은 선수는 성장 제한
        }

        return Math.round(baseGrowth * ageModifier * ratingModifier);
    }

    // 선수 성장 처리 (매월 또는 경기마다 호출)
    processPlayerGrowth() {
        if (!gameData.selectedTeam) return;

        const teamPlayers = teams[gameData.selectedTeam];
        let growthOccurred = false;

        teamPlayers.forEach(player => {
            if (this.growthData.has(player.name)) {
                const growthInfo = this.growthData.get(player.name);
                
                // 성장 조건 확인
                if (this.shouldPlayerGrow(player, growthInfo)) {
                    const growthAmount = this.calculateGrowthAmount(player, growthInfo);
                    
                    if (growthAmount > 0) {
                        this.applyGrowth(player, growthAmount, growthInfo);
                        growthOccurred = true;
                    }
                }
            }
        });

        if (growthOccurred) {
            this.updateSquadDisplay();
        }
    }

    // 성장 조건 확인
    shouldPlayerGrow(player, growthInfo) {
        // 아직 성장 여지가 있고, 26세 미만인 경우
        if (growthInfo.remainingGrowth <= 0 || player.age >= 26) {
            return false;
        }

        // 게임에서는 경기를 기준으로 성장 (10경기마다 성장 체크)
        return gameData.matchesPlayed > 0 && gameData.matchesPlayed % 10 === 0;
    }

    // 성장량 계산
    calculateGrowthAmount(player, growthInfo) {
        // 기본 월별 성장량 (10경기 = 1개월로 가정)
        let baseGrowth = growthInfo.monthlyGrowth * 10;

        // 팀 사기에 따른 보정
        const moraleModifier = gameData.teamMorale / 100;
        baseGrowth *= moraleModifier;

        // 경기 출전에 따른 보정 (스쿼드에 포함된 선수는 더 빨리 성장)
        if (this.isPlayerInSquad(player)) {
            baseGrowth *= 1.5; // 50% 빨른 성장
        }

        // 훈련 효과 (팀 자금에 따른 보정)
        const trainingModifier = Math.min(1.2, 1 + (gameData.teamMoney / 10000));
        baseGrowth *= trainingModifier;

        // 랜덤 요소 추가 (80% ~ 120%)
        const randomFactor = 0.8 + Math.random() * 0.4;
        baseGrowth *= randomFactor;

        return Math.min(baseGrowth, growthInfo.remainingGrowth);
    }

    // 선수가 현재 스쿼드에 포함되어 있는지 확인
    isPlayerInSquad(player) {
        if (!gameData.squad) return false;
        
        if (gameData.squad.gk && gameData.squad.gk.name === player.name) return true;
        
        for (let df of gameData.squad.df) {
            if (df && df.name === player.name) return true;
        }
        
        for (let mf of gameData.squad.mf) {
            if (mf && mf.name === player.name) return true;
        }
        
        for (let fw of gameData.squad.fw) {
            if (fw && fw.name === player.name) return true;
        }
        
        return false;
    }

    // 성장 적용
    applyGrowth(player, growthAmount, growthInfo) {
        const oldRating = player.rating;
        const newRating = Math.min(99, Math.round(player.rating + growthAmount));
        
        player.rating = newRating;
        growthInfo.remainingGrowth -= growthAmount;
        growthInfo.totalGrowth += (newRating - oldRating);
        growthInfo.lastGrowthCheck = Date.now();

        // 성장 알림
        if (newRating > oldRating) {
            this.showGrowthNotification(player, oldRating, newRating);
        }

        // 성장 데이터 업데이트
        this.growthData.set(player.name, growthInfo);

        // 스쿼드의 해당 선수도 업데이트
        this.updatePlayerInSquad(player);
    }

    // 스쿼드 내 선수 정보 업데이트
    updatePlayerInSquad(player) {
        if (!gameData.squad) return;

        if (gameData.squad.gk && gameData.squad.gk.name === player.name) {
            gameData.squad.gk.rating = player.rating;
        }
        
        gameData.squad.df.forEach((p, index) => {
            if (p && p.name === player.name) {
                gameData.squad.df[index].rating = player.rating;
            }
        });
        
        gameData.squad.mf.forEach((p, index) => {
            if (p && p.name === player.name) {
                gameData.squad.mf[index].rating = player.rating;
            }
        });
        
        gameData.squad.fw.forEach((p, index) => {
            if (p && p.name === player.name) {
                gameData.squad.fw[index].rating = player.rating;
            }
        });
    }

    // 성장 알림 표시
    showGrowthNotification(player, oldRating, newRating) {
        const growthAmount = newRating - oldRating;
        const message = `🌟 ${player.name}의 능력치가 상승했습니다!\n${oldRating} → ${newRating} (+${growthAmount})`;
        
        // 알림을 게임 화면에 표시
        setTimeout(() => {
            alert(message);
        }, 1000);

        console.log(message);
    }

    // 모든 팀 선수 성장 처리 (AI 팀들)
    processAllTeamsGrowth() {
        Object.keys(teams).forEach(teamKey => {
            if (teamKey !== gameData.selectedTeam) {
                const teamPlayers = teams[teamKey];
                
                teamPlayers.forEach(player => {
                    if (player.age <= 25) {
                        // AI 팀 선수들도 약간의 성장 (유저팀보다 느리게)
                        const growthChance = Math.random();
                        
                        if (growthChance < 0.1 && gameData.matchesPlayed % 15 === 0) { // 10% 확률로 15경기마다
                            const growthAmount = 0.5 + Math.random() * 1.5; // 0.5-2.0 성장
                            player.rating = Math.min(99, Math.round(player.rating + growthAmount));
                        }
                    }
                });
            }
        });
    }

    // 선수 나이 증가 처리 (시즌마다)
    advancePlayerAges() {
        Object.keys(teams).forEach(teamKey => {
            teams[teamKey].forEach(player => {
                player.age++;
                
                // 26세가 되면 성장 데이터 제거
                if (player.age >= 26 && this.growthData.has(player.name)) {
                    this.growthData.delete(player.name);
                }
            });
        });
    }

    // 스쿼드 화면 업데이트
    updateSquadDisplay() {
        if (document.getElementById('squad') && document.getElementById('squad').classList.contains('active')) {
            if (typeof displayTeamPlayers === 'function') {
                displayTeamPlayers();
            }
            if (typeof updateFormationDisplay === 'function') {
                updateFormationDisplay();
            }
        }
    }

    // 선수 성장 정보 조회
    getPlayerGrowthInfo(playerName) {
        return this.growthData.get(playerName) || null;
    }

    // 팀의 모든 선수 성장 정보 조회
    getTeamGrowthSummary() {
        if (!gameData.selectedTeam) return [];

        const teamPlayers = teams[gameData.selectedTeam];
        const summary = [];

        teamPlayers.forEach(player => {
            if (this.growthData.has(player.name)) {
                const growthInfo = this.growthData.get(player.name);
                summary.push({
                    name: player.name,
                    position: player.position,
                    age: player.age,
                    currentRating: player.rating,
                    maxPotential: player.rating + growthInfo.remainingGrowth,
                    remainingGrowth: growthInfo.remainingGrowth,
                    totalGrowth: growthInfo.totalGrowth,
                    inSquad: this.isPlayerInSquad(player)
                });
            } else if (player.age <= 25) {
                // 성장 데이터가 없지만 25세 이하인 선수
                summary.push({
                    name: player.name,
                    position: player.position,
                    age: player.age,
                    currentRating: player.rating,
                    maxPotential: player.rating,
                    remainingGrowth: 0,
                    totalGrowth: 0,
                    inSquad: this.isPlayerInSquad(player)
                });
            }
        });

        return summary.sort((a, b) => b.maxPotential - a.maxPotential);
    }

    // 성장 통계 조회
    getGrowthStatistics() {
        const stats = {
            totalPlayers: 0,
            growingPlayers: 0,
            averageGrowth: 0,
            totalPotential: 0,
            squadPlayers: 0
        };

        let totalGrowth = 0;
        let playerCount = 0;

        this.growthData.forEach((growthInfo, playerName) => {
            stats.totalPlayers++;
            
            if (growthInfo.remainingGrowth > 0) {
                stats.growingPlayers++;
            }

            totalGrowth += growthInfo.totalGrowth;
            stats.totalPotential += growthInfo.maxGrowth;
            
            // 해당 선수가 현재 팀에 있는지 확인
            const player = teams[gameData.selectedTeam]?.find(p => p.name === playerName);
            if (player && this.isPlayerInSquad(player)) {
                stats.squadPlayers++;
            }
            
            playerCount++;
        });

        if (playerCount > 0) {
            stats.averageGrowth = Math.round(totalGrowth / playerCount * 10) / 10;
        }

        return stats;
    }

    // 특별 훈련 실시 (자금 소모)
    conductSpecialTraining(playerName, trainingCost = 100) {
        if (gameData.teamMoney < trainingCost) {
            return { success: false, message: "훈련 비용이 부족합니다." };
        }

        const player = teams[gameData.selectedTeam]?.find(p => p.name === playerName);
        if (!player) {
            return { success: false, message: "해당 선수를 찾을 수 없습니다." };
        }

        if (player.age > 25) {
            return { success: false, message: "25세 이상의 선수는 특별 훈련을 받을 수 없습니다." };
        }

        const growthInfo = this.growthData.get(playerName);
        if (!growthInfo || growthInfo.remainingGrowth <= 0) {
            return { success: false, message: "해당 선수는 더 이상 성장할 수 없습니다." };
        }

        // 자금 차감
        gameData.teamMoney -= trainingCost;

        // 즉시 성장 적용 (특별 훈련 효과)
        const bonusGrowth = Math.min(1 + Math.random() * 2, growthInfo.remainingGrowth);
        this.applyGrowth(player, bonusGrowth, growthInfo);

        return { 
            success: true, 
            message: `${playerName}이 특별 훈련을 받았습니다! 능력치가 ${Math.round(bonusGrowth * 10) / 10} 상승했습니다.`,
            growth: bonusGrowth
        };
    }

    // 성장 시스템 리셋
    resetGrowthSystem() {
        this.growthData.clear();
    }

    // 저장 데이터 준비
    getSaveData() {
        const saveData = {};
        this.growthData.forEach((value, key) => {
            saveData[key] = value;
        });
        return saveData;
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        this.growthData.clear();
        Object.entries(saveData).forEach(([key, value]) => {
            this.growthData.set(key, value);
        });
    }
}

// 전역 성장 시스템 인스턴스
const playerGrowthSystem = new PlayerGrowthSystem();

// 게임 초기화 시 성장 시스템 초기화
function initializePlayerGrowth() {
    playerGrowthSystem.initializePlayerGrowth();
}

// 경기 후 성장 처리
function processPostMatchGrowth() {
    playerGrowthSystem.processPlayerGrowth();
    playerGrowthSystem.processAllTeamsGrowth();
}

// 시즌 종료 시 나이 증가
function advancePlayerAges() {
    playerGrowthSystem.advancePlayerAges();
}

// 성장 정보 표시 함수
function showGrowthSummary() {
    const summary = playerGrowthSystem.getTeamGrowthSummary();
    const stats = playerGrowthSystem.getGrowthStatistics();
    
    console.table(summary);
    
    let message = `팀 유망주 성장 현황:\n\n`;
    message += `전체 유망주: ${stats.totalPlayers}명\n`;
    message += `성장 중인 선수: ${stats.growingPlayers}명\n`;
    message += `스쿼드 포함: ${stats.squadPlayers}명\n`;
    message += `평균 성장: ${stats.averageGrowth}\n\n`;
    
    summary.forEach((player, index) => {
        if (index < 10) { // 상위 10명만 표시
            message += `${index + 1}. ${player.name} (${player.position}, ${player.age}세): ${player.currentRating} → ${player.maxPotential} (잔여: ${player.remainingGrowth.toFixed(1)})${player.inSquad ? ' ⭐' : ''}\n`;
        }
    });

    alert(message);
}

// 특별 훈련 실시
function conductSpecialTraining(playerName) {
    const result = playerGrowthSystem.conductSpecialTraining(playerName, 100);
    
    if (result.success) {
        alert(result.message);
        updateLobbyDisplay();
        
        // 스쿼드 화면이 열려있다면 업데이트
        if (document.getElementById('squad').classList.contains('active')) {
            displayTeamPlayers();
            updateFormationDisplay();
        }
    } else {
        alert(result.message);
    }
}

// 성장 상세 정보 모달
function showPlayerGrowthDetails(playerName) {
    const player = teams[gameData.selectedTeam]?.find(p => p.name === playerName);
    const growthInfo = playerGrowthSystem.getPlayerGrowthInfo(playerName);
    
    if (!player || !growthInfo) {
        alert('해당 선수의 성장 정보를 찾을 수 없습니다.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${player.name} 성장 정보</h3>
            <div class="player-growth-details">
                <div class="player-basic-info">
                    <p><strong>포지션:</strong> ${player.position}</p>
                    <p><strong>나이:</strong> ${player.age}세</p>
                    <p><strong>현재 능력치:</strong> ${player.rating}</p>
                </div>
                
                <div class="growth-progress">
                    <h4>성장 진행도</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((growthInfo.maxGrowth - growthInfo.remainingGrowth) / growthInfo.maxGrowth) * 100}%"></div>
                    </div>
                    <p>성장 완료: ${Math.round(((growthInfo.maxGrowth - growthInfo.remainingGrowth) / growthInfo.maxGrowth) * 100)}%</p>
                </div>

                <div class="growth-stats">
                    <div class="stat-item">
                        <span class="label">최대 성장 가능성:</span>
                        <span class="value">${growthInfo.maxGrowth.toFixed(1)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">남은 성장:</span>
                        <span class="value">${growthInfo.remainingGrowth.toFixed(1)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">지금까지 성장:</span>
                        <span class="value">${growthInfo.totalGrowth.toFixed(1)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">최대 도달 가능 능력치:</span>
                        <span class="value">${Math.round(player.rating + growthInfo.remainingGrowth)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">스쿼드 포함:</span>
                        <span class="value">${playerGrowthSystem.isPlayerInSquad(player) ? '예 (성장 보너스 +50%)' : '아니오'}</span>
                    </div>
                </div>

                <div class="training-section">
                    <h4>특별 훈련</h4>
                    <p>비용: 100억 | 즉시 능력치 1-3 상승</p>
                    <button onclick="conductSpecialTraining('${playerName}'); closeModal()" 
                            class="training-btn ${gameData.teamMoney >= 100 && growthInfo.remainingGrowth > 0 ? '' : 'disabled'}"
                            ${gameData.teamMoney >= 100 && growthInfo.remainingGrowth > 0 ? '' : 'disabled'}>
                        특별 훈련 실시
                    </button>
                </div>
            </div>
            <button onclick="closeModal()">닫기</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 경기 종료 후 성장 처리를 기존 endMatch 함수에 추가
const originalEndMatch = window.endMatch;
window.endMatch = function() {
    if (originalEndMatch) {
        originalEndMatch.call(this);
    }
    // 경기 후 성장 처리
    setTimeout(() => {
        processPostMatchGrowth();
    }, 2000);
};

// 저장/불러오기에 성장 데이터 포함
const originalSaveGame = window.saveGame;
window.saveGame = function() {
    gameData.playerGrowthData = playerGrowthSystem.getSaveData();
    if (originalSaveGame) {
        originalSaveGame.call(this);
    }
};

const originalLoadGame = window.loadGame;
window.loadGame = function() {
    if (originalLoadGame) {
        originalLoadGame.call(this);
    }
    if (gameData.playerGrowthData) {
        playerGrowthSystem.loadSaveData(gameData.playerGrowthData);
    }
};
