// 선수 성장 시스템

// 선수별 성장 잠재력 저장
let playerGrowthData = {};

function initializePlayerGrowth() {
    if (!gameState.selectedTeamData || !gameState.selectedTeamData.players) return;
    
    gameState.selectedTeamData.players.forEach((player, index) => {
        if (player.age <= 25) {
            // 25세 이하 선수만 성장 가능
            const playerId = `${player.name}_${index}`;
            playerGrowthData[playerId] = {
                maxPotential: player.rating + Math.floor(Math.random() * 13) + 3, // 3-15 성장 가능
                growthRate: Math.random() * 0.8 + 0.2, // 0.2-1.0 성장 속도
                lastGrowth: 0,
                totalGrowth: 0
            };
        }
    });
}

function processPlayerGrowth() {
    if (!gameState.selectedTeamData || !gameState.selectedTeamData.players) return;
    
    const growthNotifications = [];
    
    gameState.selectedTeamData.players.forEach((player, index) => {
        if (player.age <= 25) { // 25세 이하만 성장
            const playerId = `${player.name}_${index}`;
            const growthData = playerGrowthData[playerId];
            
            if (!growthData) return;
            
            // 성장 확률 계산
            let growthChance = calculateGrowthChance(player, index, growthData);
            
            if (Math.random() < growthChance && player.rating < growthData.maxPotential) {
                const growth = calculateGrowthAmount(player, growthData);
                const oldRating = player.rating;
                
                player.rating = Math.min(player.rating + growth, growthData.maxPotential);
                growthData.totalGrowth += growth;
                growthData.lastGrowth = gameState.matchesPlayed;
                
                // 성장 알림
                if (player.rating > oldRating) {
                    growthNotifications.push({
                        player: player,
                        oldRating: oldRating,
                        newRating: player.rating,
                        growth: player.rating - oldRating
                    
    // 잠재력 순으로 정렬
    prospects.sort((a, b) => b.potential - a.potential);
    
    return prospects;
}

function checkPlayerMilestones(player) {
    // 특정 능력치 도달시 마일스톤 체크
    const milestones = [];
    
    if (player.rating === 80) {
        milestones.push(`${player.name}이 80 능력치에 도달했습니다!`);
    } else if (player.rating === 85) {
        milestones.push(`${player.name}이 85 능력치에 도달했습니다! 엘리트 선수가 되었습니다!`);
    } else if (player.rating === 90) {
        milestones.push(`${player.name}이 90 능력치에 도달했습니다! 세계적인 선수가 되었습니다!`);
    }
    
    return milestones;
}

function generateGrowthReport() {
    // 성장 리포트 생성 (시즌말 활용)
    const report = {
        totalPlayersGrown: 0,
        averageGrowth: 0,
        topGrower: null,
        stagnantPlayers: [],
        prospects: []
    };
    
    if (!gameState.selectedTeamData || !gameState.selectedTeamData.players) return report;
    
    let totalGrowth = 0;
    let grownPlayers = 0;
    
    gameState.selectedTeamData.players.forEach((player, index) => {
        if (player.age <= 25) {
            const playerId = `${player.name}_${index}`;
            const growthData = playerGrowthData[playerId];
            
            if (growthData && growthData.totalGrowth > 0) {
                grownPlayers++;
                totalGrowth += growthData.totalGrowth;
                
                if (!report.topGrower || growthData.totalGrowth > report.topGrower.growth) {
                    report.topGrower = {
                        player: player,
                        growth: growthData.totalGrowth
                    };
                }
            } else if (growthData && growthData.totalGrowth === 0) {
                report.stagnantPlayers.push(player);
            }
        }
    });
    
    report.totalPlayersGrown = grownPlayers;
    report.averageGrowth = grownPlayers > 0 ? Math.round(totalGrowth / grownPlayers) : 0;
    report.prospects = getTopYoungProspects();
    
    return report;
}

function resetSeasonGrowthData() {
    // 새 시즌 시작시 성장 데이터 리셋
    Object.keys(playerGrowthData).forEach(playerId => {
        playerGrowthData[playerId].lastGrowth = 0;
    });
}

function exportGrowthData() {
    // 성장 데이터 내보내기 (디버깅/분석용)
    const exportData = {
        playerGrowthData: playerGrowthData,
        currentSeason: gameState.season,
        matchesPlayed: gameState.matchesPlayed
    };
    
    return JSON.stringify(exportData, null, 2);
}

function importGrowthData(jsonData) {
    // 성장 데이터 가져오기
    try {
        const data = JSON.parse(jsonData);
        playerGrowthData = data.playerGrowthData || {};
        return true;
    } catch (error) {
        console.error('Growth data import failed:', error);
        return false;
    }
}

// 게임 시작시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // gameState가 로드된 후 실행되도록 지연
    setTimeout(() => {
        if (gameState.selectedTeamData) {
            initializePlayerGrowth();
        }
    }, 1000);
});

// 팀 선택시 성장 데이터 초기화
function initializeGrowthForNewTeam() {
    playerGrowthData = {};
    initializePlayerGrowth();
}            }
            }
            
            // 나이 증가 처리 (매 36경기 = 1시즌)
            if (gameState.matchesPlayed % 36 === 0) {
                player.age++;
                
                // 26세가 되면 성장 중단
                if (player.age === 26) {
                    delete playerGrowthData[playerId];
                }
            }
        }
    });
    
    // 성장 알림 표시
    if (growthNotifications.length > 0) {
        showGrowthNotifications(growthNotifications);
    }
    
    // UI 업데이트
    if (document.getElementById('formation-tab').classList.contains('active')) {
        setupFormation();
    }
}

function calculateGrowthChance(player, playerIndex, growthData) {
    let baseChance = 0.3; // 기본 30% 확률
    
    // 주전 여부 확인 (포메이션에 배치된 선수는 50% 빠른 성장)
    const isStarting = Object.values(gameState.formation).includes(playerIndex);
    if (isStarting) {
        baseChance *= 1.5;
    }
    
    // 팀 사기 영향
    const moraleBonus = (gameState.morale - 50) / 100; // -0.5 ~ +0.5
    baseChance += moraleBonus * 0.2;
    
    // 성장 속도 반영
    baseChance *= growthData.growthRate;
    
    // 나이별 성장 확률 조정
    if (player.age <= 20) baseChance *= 1.2;
    else if (player.age <= 22) baseChance *= 1.1;
    else if (player.age >= 24) baseChance *= 0.8;
    
    // 현재 능력치가 높을수록 성장 어려움
    if (player.rating >= 85) baseChance *= 0.5;
    else if (player.rating >= 80) baseChance *= 0.7;
    
    return Math.max(0.05, Math.min(0.8, baseChance)); // 5-80% 범위
}

function calculateGrowthAmount(player, growthData) {
    let baseGrowth = 1;
    
    // 포지션별 성장량 차이
    const positionMultiplier = {
        'GK': 0.8,
        'DF': 0.9,
        'MF': 1.0,
        'FW': 1.1
    };
    
    baseGrowth *= (positionMultiplier[player.position] || 1.0);
    
    // 나이별 성장량
    if (player.age <= 20) baseGrowth *= 1.3;
    else if (player.age <= 22) baseGrowth *= 1.1;
    else if (player.age >= 24) baseGrowth *= 0.8;
    
    // 랜덤 요소 추가
    const randomFactor = 0.5 + Math.random() * 1.0; // 0.5-1.5
    baseGrowth *= randomFactor;
    
    // 소수점 반올림
    return Math.max(1, Math.round(baseGrowth));
}

function showGrowthNotifications(notifications) {
    notifications.forEach((notification, index) => {
        setTimeout(() => {
            const modal = document.getElementById('notificationModal');
            const content = document.getElementById('notificationContent');
            
            content.innerHTML = `
                <h3>선수 성장!</h3>
                <div style="text-align: center; margin: 20px 0;">
                    <h4>${notification.player.name}</h4>
                    <p>${notification.player.position} • ${notification.player.age}세</p>
                    <div style="font-size: 1.5em; margin: 15px 0;">
                        <span style="color: #ccc;">${notification.oldRating}</span>
                        <span style="margin: 0 15px;">→</span>
                        <span style="color: #4CAF50; font-weight: bold;">${notification.newRating}</span>
                        <span style="color: #FFD700; margin-left: 10px;">(+${notification.growth})</span>
                    </div>
                    <p style="color: #4CAF50;">능력치가 상승했습니다!</p>
                </div>
            `;
            
            modal.classList.add('active');
            
            setTimeout(() => {
                modal.classList.remove('active');
            }, 3000);
            
        }, index * 1000); // 1초 간격으로 표시
    });
}

function getPlayerGrowthPotential(playerIndex) {
    const player = gameState.selectedTeamData.players[playerIndex];
    if (!player || player.age > 25) return null;
    
    const playerId = `${player.name}_${playerIndex}`;
    const growthData = playerGrowthData[playerId];
    
    if (!growthData) return null;
    
    return {
        currentRating: player.rating,
        maxPotential: growthData.maxPotential,
        totalGrowth: growthData.totalGrowth,
        remainingPotential: growthData.maxPotential - player.rating
    };
}

function simulatePlayerGrowthOverTime(player, months) {
    // 선수의 예상 성장을 시뮬레이션하는 함수 (유스 시스템에서 활용 가능)
    let simulatedRating = player.rating;
    let simulatedAge = player.age;
    
    for (let month = 0; month < months; month++) {
        if (simulatedAge <= 25 && Math.random() < 0.15) { // 월 15% 성장 확률
            const growth = Math.random() < 0.7 ? 1 : 2; // 70% 확률로 1, 30% 확률로 2 성장
            simulatedRating = Math.min(simulatedRating + growth, 99);
        }
        
        // 1년마다 나이 증가
        if (month % 12 === 0) {
            simulatedAge++;
        }
    }
    
    return {
        projectedRating: simulatedRating,
        projectedAge: simulatedAge,
        totalGrowth: simulatedRating - player.rating
    };
}

function getTopYoungProspects() {
    // 성장 가능성이 높은 유망주 리스트 반환
    const prospects = [];
    
    if (!gameState.selectedTeamData || !gameState.selectedTeamData.players) return prospects;
    
    gameState.selectedTeamData.players.forEach((player, index) => {
        if (player.age <= 25) {
            const playerId = `${player.name}_${index}`;
            const growthData = playerGrowthData[playerId];
            
            if (growthData) {
                const potential = growthData.maxPotential - player.rating;
                if (potential >= 5) { // 5 이상 성장 가능한 선수
                    prospects.push({
                        player: player,
                        index: index,
                        potential: potential,
                        currentRating: player.rating,
                        maxPotential: growthData.maxPotential
                    });
                }
            }
        }
    });
