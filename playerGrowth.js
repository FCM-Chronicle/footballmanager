// 선수 성장 시스템(playerGrowth.js)
class PlayerGrowthSystem {
    constructor() {
        this.growthCheckInterval = 10; // 10경기마다 성장 체크
    }

    // 선수 성장 가능성 초기화
    initializeGrowthPotential(player) {
        if (player.age > 25) {
            player.growthPotential = 0;
            player.maxPotential = player.rating;
            return;
        }

        // 기본 성장 가능성 (3-15)
        let baseGrowth = 3 + Math.floor(Math.random() * 13);

        // 나이 보정
        let ageMultiplier = 1.0;
        if (player.age <= 18) ageMultiplier = 1.3;
        else if (player.age <= 21) ageMultiplier = 1.2;
        else if (player.age <= 23) ageMultiplier = 1.1;
        else if (player.age <= 25) ageMultiplier = 1.0;

        // 현재 능력치 보정
        let ratingMultiplier = 1.0;
        if (player.rating < 70) ratingMultiplier = 1.2;
        else if (player.rating < 80) ratingMultiplier = 1.1;
        else if (player.rating < 90) ratingMultiplier = 1.0;
        else ratingMultiplier = 0.8;

        // 리그 보정
        let leagueMultiplier = 1.0;
        if (gameData.currentLeague === '1부') leagueMultiplier = 1.2;
        else if (gameData.currentLeague === '2부') leagueMultiplier = 1.1;
        else leagueMultiplier = 1.0;

        // 최종 성장 가능성 계산
        const finalGrowth = Math.floor(baseGrowth * ageMultiplier * ratingMultiplier * leagueMultiplier);
        
        player.growthPotential = finalGrowth;
        player.maxPotential = Math.min(99, player.rating + finalGrowth);
        player.growthProgress = 0;
        player.totalGrowthNeeded = finalGrowth * 10; // 성장에 필요한 총 경험치
    }

    // 경기 후 성장 처리
    processMatchGrowth() {
        gameData.allPlayers.forEach(player => {
            if (player.age <= 25 && player.growthPotential > 0) {
                this.updatePlayerGrowth(player);
            }
        });

        // 10경기마다 성장 체크
        if (gameData.matchesPlayed % this.growthCheckInterval === 0) {
            this.checkForGrowth();
        }
    }

    // 선수 성장 업데이트
    updatePlayerGrowth(player) {
        if (player.growthPotential <= 0) return;

        // 기본 성장 경험치
        let growthPoints = 1;

        // 팀 사기 보정
        growthPoints *= (gameData.teamMorale / 100);

        // 스쿼드 포함 여부 보정
        if (player.inSquad) {
            growthPoints *= 1.5;
        }

        // 리그 보정
        if (gameData.currentLeague === '1부') growthPoints *= 1.2;
        else if (gameData.currentLeague === '2부') growthPoints *= 1.1;

        // 랜덤 요소 (80-120%)
        growthPoints *= (0.8 + Math.random() * 0.4);

        // 성장 진행도 업데이트
        player.growthProgress = (player.growthProgress || 0) + growthPoints;
    }

    // 성장 체크 및 적용
    checkForGrowth() {
        const grownPlayers = [];

        gameData.allPlayers.forEach(player => {
            if (player.age <= 25 && player.growthPotential > 0) {
                const requiredProgress = player.totalGrowthNeeded / player.growthPotential;
                
                if (player.growthProgress >= requiredProgress) {
                    // 성장!
                    const growth = Math.min(
                        Math.floor(player.growthProgress / requiredProgress),
                        player.growthPotential
                    );
                    
                    if (growth > 0) {
                        const oldRating = player.rating;
                        player.rating = Math.min(99, player.rating + growth);
                        player.growthPotential -= growth;
                        player.growthProgress -= (growth * requiredProgress);

                        grownPlayers.push({
                            name: player.name,
                            oldRating: oldRating,
                            newRating: player.rating,
                            growth: growth
                        });
                    }
                }
            }
        });

        // 성장한 선수들 알림
        if (grownPlayers.length > 0) {
            this.showGrowthNotifications(grownPlayers);
        }
    }

    // 성장 알림 표시
    showGrowthNotifications(grownPlayers) {
        grownPlayers.forEach(player => {
            const notification = document.createElement('div');
            notification.className = 'success-message';
            notification.innerHTML = `
                🌟 ${player.name}의 능력치가 상승했습니다!<br>
                ${player.oldRating} → ${player.newRating} (+${player.growth})
            `;
            
            document.body.appendChild(notification);
            
            // 3초 후 제거
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        });
    }

    // 나이 증가 (시즌 종료 시)
    ageAllPlayers() {
        gameData.allPlayers.forEach(player => {
            player.age++;
            
            // 26세가 되면 성장 중단
            if (player.age === 26) {
                player.growthPotential = 0;
                player.growthProgress = 0;
                player.totalGrowthNeeded = 0;
            }
        });
    }

    // 팀 성장 요약 가져오기
    getTeamGrowthSummary() {
        return gameData.allPlayers
            .filter(player => player.age <= 25 && player.growthPotential > 0)
            .map(player => ({
                name: player.name,
                position: player.position,
                currentRating: player.rating,
                maxPotential: player.maxPotential,
                remainingGrowth: player.growthPotential,
                progressPercentage: player.totalGrowthNeeded > 0 ? 
                    Math.round((player.growthProgress / player.totalGrowthNeeded) * 100) : 0
            }))
            .sort((a, b) => b.maxPotential - a.maxPotential);
    }

    // 선수별 상세 성장 정보
    getPlayerGrowthDetails(playerId) {
        const player = gameData.allPlayers.find(p => p.id === playerId);
        if (!player || player.age > 25) return null;

        return {
            name: player.name,
            position: player.position,
            age: player.age,
            currentRating: player.rating,
            maxPotential: player.maxPotential,
            remainingGrowth: player.growthPotential,
            currentProgress: player.growthProgress || 0,
            totalNeeded: player.totalGrowthNeeded || 0,
            progressPercentage: player.totalGrowthNeeded > 0 ? 
                Math.round((player.growthProgress / player.totalGrowthNeeded) * 100) : 0,
            inSquad: player.inSquad,
            estimatedGrowthTime: this.estimateGrowthTime(player)
        };
    }

    // 성장 완료 예상 시간 계산
    estimateGrowthTime(player) {
        if (player.growthPotential <= 0) return 0;

        const requiredProgress = player.totalGrowthNeeded / player.growthPotential;
        const remainingProgress = requiredProgress - (player.growthProgress || 0);
        
        // 평균 성장 속도 계산 (팀 사기, 스쿼드 여부 등 고려)
        let averageGrowthPerMatch = 1;
        averageGrowthPerMatch *= (gameData.teamMorale / 100);
        if (player.inSquad) averageGrowthPerMatch *= 1.5;
        if (gameData.currentLeague === '1부') averageGrowthPerMatch *= 1.2;
        else if (gameData.currentLeague === '2부') averageGrowthPerMatch *= 1.1;

        return Math.ceil(remainingProgress / averageGrowthPerMatch);
    }

    // 성장 가속화 (특별 이벤트용)
    accelerateGrowth(playerId, multiplier = 2) {
        const player = gameData.allPlayers.find(p => p.id === playerId);
        if (player && player.age <= 25 && player.growthPotential > 0) {
            player.growthProgress = (player.growthProgress || 0) * multiplier;
            
            // 즉시 성장 체크
            this.checkForGrowth();
        }
    }

    // 성장 시스템 통계
    getGrowthStatistics() {
        const eligiblePlayers = gameData.allPlayers.filter(p => p.age <= 25);
        const growingPlayers = eligiblePlayers.filter(p => p.growthPotential > 0);
        
        return {
            totalEligiblePlayers: eligiblePlayers.length,
            totalGrowingPlayers: growingPlayers.length,
            averageAge: eligiblePlayers.length > 0 ? 
                Math.round(eligiblePlayers.reduce((sum, p) => sum + p.age, 0) / eligiblePlayers.length) : 0,
            averagePotential: growingPlayers.length > 0 ?
                Math.round(growingPlayers.reduce((sum, p) => sum + p.maxPotential, 0) / growingPlayers.length) : 0,
            totalPotentialGrowth: growingPlayers.reduce((sum, p) => sum + p.growthPotential, 0),
            squadGrowingPlayers: growingPlayers.filter(p => p.inSquad).length
        };
    }
}

// 성장 시스템 인스턴스 생성
const playerGrowthSystem = new PlayerGrowthSystem();

// 게임 시작 시 모든 선수의 성장 가능성 초기화
function initializeAllPlayersGrowth() {
    gameData.allPlayers.forEach(player => {
        playerGrowthSystem.initializeGrowthPotential(player);
    });
}

// 경기 종료 후 성장 처리 호출
function processPostMatchGrowth() {
    playerGrowthSystem.processMatchGrowth();
}
