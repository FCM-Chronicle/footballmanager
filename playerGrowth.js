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
                    matchesPlayed: 0
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

        // 게임에서는 경기를 기준으로 성장 (5경기마다 성장 체크)
        return gameData.matchesPlayed > 0 && gameData.matchesPlayed % 5 === 0 && 
               growthInfo.matchesPlayed !== gameData.matchesPlayed;
    }

    // 성장량 계산
    calculateGrowthAmount(player, growthInfo) {
        // 기본 성장량 (5경기마다)
        let baseGrowth = growthInfo.monthlyGrowth * 2.5; // 약 2.5개월치 성장

        // 팀 사기에 따른 보정
        const moraleModifier = Math.max(0.5, gameData.teamMorale / 100);
        baseGrowth *= moraleModifier;

        // 경기 출전에 따른 보정 (스쿼드에 포함된 선수는 더 빨리 성장)
        if (this.isPlayerInSquad(player)) {
            baseGrowth *= 1.5; // 50% 빨른 성장
        }

        // 랜덤 요소 추가 (70% ~ 130%)
        const randomFactor = 0.7 + Math.random() * 0.6;
        baseGrowth *= randomFactor;

        return Math.min(baseGrowth, growthInfo.remainingGrowth);
    }

    // 선수가 현재 스쿼드에 포함되어 있는지 확인
    isPlayerInSquad(player) {
        const squad = gameData.squad;
        
        if (squad.gk && squad.gk.name === player.name) return true;
        
        for (let df of squad.df) {
            if (df && df.name === player.name) return true;
        }
        
        for (let mf of squad.mf) {
            if (mf && mf.name === player.name) return true;
        }
        
        for (let fw of squad.fw) {
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
        growthInfo.lastGrowthCheck = Date.now();
        growthInfo.matchesPlayed = gameData.matchesPlayed;

        // 성장 알림
        if (newRating > oldRating) {
            this.showGrowthNotification(player, oldRating, newRating);
        }

        // 성장 데이터 업데이트
        this.growthData.set(player.name, growthInfo);

        // 스쿼드에 있는 선수라면 스쿼드도 업데이트
        this.updatePlayerInSquad(player);
    }

    // 스쿼드 내 선수 정보 업데이트
    updatePlayerInSquad(updatedPlayer) {
        const squad = gameData.squad;
        
        if (
