// 이적 시장 시스템
class TransferSystem {
    constructor() {
        this.basePrice = 500; // 기본가격 500억
        this.marketRefreshCost = 10; // 시장 새로고침 비용
        this.marketSize = 20; // 이적 시장에 표시될 선수 수
    }

    // 선수 가격 계산
    calculatePlayerPrice(player) {
        let price = this.basePrice;

        // 능력치 배수 계산
        const abilityMultiplier = Math.pow(player.rating / 70, 2.5);
        price *= abilityMultiplier;

        // 나이 배수
        let ageMultiplier = 1.0;
        if (player.age <= 20) ageMultiplier = 1.3;
        else if (player.age <= 25) ageMultiplier = 1.1;
        else if (player.age <= 29) ageMultiplier = 1.0;
        else if (player.age <= 34) ageMultiplier = 1.0;
        else ageMultiplier = 0.8;

        price *= ageMultiplier;

        // 포지션 배수
        let positionMultiplier = 1.1; // GK, DF, MF 기본
        if (player.position === 'FW') {
            positionMultiplier = 1.3;
        }

        price *= positionMultiplier;

        // 리그 배수 (현재 소속 리그)
        let leagueMultiplier = 1.0;
        if (player.currentLeague === '1부') leagueMultiplier = 1.5;
        else if (player.currentLeague === '2부') leagueMultiplier = 1.2;
        else leagueMultiplier = 1.0;

        price *= leagueMultiplier;

        // 랜덤 배수 (시장 변동성)
        const randomMultiplier = 0.85 + Math.random() * 0.65; // 0.85 ~ 1.5
        price *= randomMultiplier;

        return Math.round(price);
    }

    // 이적 시장 생성
    generateTransferMarket() {
        const transferPlayers = [];
        const allTeams = Object.keys(playerDatabase);

        // 각 팀에서 랜덤하게 선수 선별
        allTeams.forEach(teamName => {
            if (teamName === gameData.selectedTeam) return; // 자신의 팀 제외

            const teamPlayers = playerDatabase[teamName] || [];
            const teamLeague = this.getTeamLeague(teamName);

            // 팀당 1-3명의 선수를 이적 시장에 내놓음
            const numPlayers = Math.floor(Math.random() * 3) + 1;
            const selectedPlayers = this.selectRandomPlayers(teamPlayers, numPlayers);

                            selectedPlayers.forEach(player => {
                const transferPlayer = {
                    ...player,
                    id: `transfer_${teamName}_${player.name}`,
                    originalTeam: teamName,
                    currentLeague: teamLeague,
                    transferPrice: 0
                };

                transferPlayer.transferPrice = this.calculatePlayerPrice(transferPlayer);
                transferPlayers.push(transferPlayer);
            });
        });

        // 선수들을 랜덤하게 섞고 시장 크기만큼 선택
        const shuffled = transferPlayers.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, this.marketSize);
    }

    // 팀의 리그 찾기
    getTeamLeague(teamName) {
        for (const [league, data] of Object.entries(leagueData)) {
            if (data.teams.some(team => team.name === teamName)) {
                return league;
            }
        }
        return '3부'; // 기본값
    }

    // 랜덤 선수 선택
    selectRandomPlayers(players, count) {
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, players.length));
    }

    // 선수 구매
    buyPlayer(transferPlayer) {
        const price = transferPlayer.transferPrice;
        
        if (gameData.teamMoney < price) {
            this.showMessage('자금이 부족합니다!', 'error');
            return false;
        }

        // 스쿼드 자리 확인 (최대 30명)
        if (gameData.allPlayers.length >= 30) {
            this.showMessage('스쿼드가 가득 찼습니다! (최대 30명)', 'error');
            return false;
        }

        // 구매 처리
        gameData.teamMoney -= price;
        
        // 새 선수 객체 생성
        const newPlayer = {
            ...transferPlayer,
            id: `${gameData.selectedTeam}_${Date.now()}`,
            team: gameData.selectedTeam,
            goals: 0,
            assists: 0,
            matches: 0,
            inSquad: false
        };

        // 성장 가능성 초기화
        if (newPlayer.age <= 25) {
            playerGrowthSystem.initializeGrowthPotential(newPlayer);
        } else {
            newPlayer.growthPotential = 0;
            newPlayer.maxPotential = newPlayer.rating;
        }

        // 팀에 추가
        gameData.allPlayers.push(newPlayer);
        gameData.bench.push(newPlayer);

        // 이적 시장에서 제거
        const marketIndex = gameData.transferMarket.indexOf(transferPlayer);
        if (marketIndex > -1) {
            gameData.transferMarket.splice(marketIndex, 1);
        }

        // UI 업데이트
        updateHeader();
        this.showMessage(`${newPlayer.name}을(를) ${price}억원에 영입했습니다!`, 'success');

        // SNS 이적 뉴스 생성
        if (typeof snsSystem !== 'undefined') {
            snsSystem.generateTransferNews(newPlayer, price, 'buy');
        }

        return true;
    }

    // 선수 방출
    releasePlayer(player) {
        if (!player || player.inSquad) {
            this.showMessage('스쿼드에 포함된 선수는 방출할 수 없습니다!', 'error');
            return false;
        }

        // 방출 가격 계산 (시장가의 30%)
        const marketPrice = this.calculatePlayerPrice({
            ...player,
            currentLeague: gameData.currentLeague
        });
        
        let releaseValue = Math.round(marketPrice * 0.3);

        // 추가 할인 요소
        if (player.age > 30) releaseValue = Math.round(releaseValue * 0.8);
        if (gameData.teamMorale < 50) releaseValue = Math.round(releaseValue * 0.85);

        // 방출 처리
        gameData.teamMoney += releaseValue;

        // 팀에서 제거
        const playerIndex = gameData.allPlayers.indexOf(player);
        if (playerIndex > -1) {
            gameData.allPlayers.splice(playerIndex, 1);
        }

        const benchIndex = gameData.bench.indexOf(player);
        if (benchIndex > -1) {
            gameData.bench.splice(benchIndex, 1);
        }

        // 70% 가격으로 이적 시장에 추가 (선택사항)
        if (Math.random() < 0.3) {
            const marketPlayer = {
                ...player,
                id: `released_${player.name}_${Date.now()}`,
                originalTeam: '자유계약',
                currentLeague: gameData.currentLeague,
                transferPrice: Math.round(marketPrice * 0.7)
            };
            gameData.transferMarket.push(marketPlayer);
        }

        // UI 업데이트
        updateHeader();
        this.showMessage(`${player.name}을(를) ${releaseValue}억원에 방출했습니다.`, 'success');

        // SNS 이적 뉴스 생성
        if (typeof snsSystem !== 'undefined') {
            snsSystem.generateTransferNews(player, releaseValue, 'sell');
        }

        return true;
    }

    // 이적 시장 새로고침
    refreshMarket() {
        if (gameData.teamMoney < this.marketRefreshCost) {
            this.showMessage(`시장 새로고침에 ${this.marketRefreshCost}억원이 필요합니다!`, 'error');
            return false;
        }

        gameData.teamMoney -= this.marketRefreshCost;
        gameData.transferMarket = this.generateTransferMarket();
        
        updateHeader();
        this.showMessage('이적 시장이 새로고침되었습니다!', 'success');
        displayTransferMarket();
        
        return true;
    }

    // 리그별 이적 시장 필터링
    filterMarketByLeague(league) {
        if (league === 'all') {
            return gameData.transferMarket;
        }
        return gameData.transferMarket.filter(player => player.currentLeague === league);
    }

    // 포지션별 이적 시장 필터링
    filterMarketByPosition(position) {
        if (position === 'all') {
            return gameData.transferMarket;
        }
        return gameData.transferMarket.filter(player => player.position === position);
    }

    // 복합 필터링
    filterMarket(league, position) {
        let filtered = gameData.transferMarket;
        
        if (league !== 'all') {
            filtered = filtered.filter(player => player.currentLeague === league);
        }
        
        if (position !== 'all') {
            filtered = filtered.filter(player => player.position === position);
        }
        
        return filtered;
    }

    // 이적 시장 통계
    getMarketStatistics() {
        const stats = {
            totalPlayers: gameData.transferMarket.length,
            averagePrice: 0,
            averageAge: 0,
            averageRating: 0,
            positionCounts: { GK: 0, DF: 0, MF: 0, FW: 0 },
            leagueCounts: { '1부': 0, '2부': 0, '3부': 0 },
            priceRanges: {
                under100: 0,
                '100to500': 0,
                '500to1000': 0,
                over1000: 0
            }
        };

        if (gameData.transferMarket.length === 0) return stats;

        let totalPrice = 0;
        let totalAge = 0;
        let totalRating = 0;

        gameData.transferMarket.forEach(player => {
            totalPrice += player.transferPrice;
            totalAge += player.age;
            totalRating += player.rating;
            
            stats.positionCounts[player.position]++;
            stats.leagueCounts[player.currentLeague]++;
            
            if (player.transferPrice < 100) stats.priceRanges.under100++;
            else if (player.transferPrice < 500) stats.priceRanges['100to500']++;
            else if (player.transferPrice < 1000) stats.priceRanges['500to1000']++;
            else stats.priceRanges.over1000++;
        });

        stats.averagePrice = Math.round(totalPrice / gameData.transferMarket.length);
        stats.averageAge = Math.round(totalAge / gameData.transferMarket.length);
        stats.averageRating = Math.round(totalRating / gameData.transferMarket.length);

        return stats;
    }

    // 추천 선수 시스템
    getRecommendedPlayers() {
        const recommendations = [];
        
        // 스쿼드 약점 분석
        const positionNeeds = this.analyzeSquadNeeds();
        
        gameData.transferMarket.forEach(player => {
            let score = 0;
            
            // 포지션 필요도
            if (positionNeeds[player.position] > 0) {
                score += positionNeeds[player.position] * 30;
            }
            
            // 가성비 (능력치 대비 가격)
            const pricePerRating = player.transferPrice / player.rating;
            if (pricePerRating < 10) score += 20;
            else if (pricePerRating < 15) score += 10;
            
            // 나이 (젊은 선수 선호)
            if (player.age < 23) score += 15;
            else if (player.age < 26) score += 10;
            else if (player.age < 29) score += 5;
            
            // 능력치
            if (player.rating > 85) score += 20;
            else if (player.rating > 80) score += 15;
            else if (player.rating > 75) score += 10;
            
            // 구매 가능 여부
            if (player.transferPrice <= gameData.teamMoney) {
                score += 10;
            } else {
                score -= 20;
            }
            
            recommendations.push({
                player: player,
                score: score,
                reasons: this.getRecommendationReasons(player, positionNeeds)
            });
        });
        
        // 점수순으로 정렬하고 상위 5명 반환
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }

    // 스쿼드 필요 포지션 분석
    analyzeSquadNeeds() {
        const positionCounts = { GK: 0, DF: 0, MF: 0, FW: 0 };
        const positionNeeds = { GK: 0, DF: 0, MF: 0, FW: 0 };
        
        // 현재 보유 선수 수 계산
        gameData.allPlayers.forEach(player => {
            positionCounts[player.position]++;
        });
        
        // 필요도 계산 (권장 보유 수 대비)
        const recommendedCounts = { GK: 3, DF: 8, MF: 8, FW: 6 };
        
        Object.keys(recommendedCounts).forEach(position => {
            const shortage = recommendedCounts[position] - positionCounts[position];
            positionNeeds[position] = Math.max(0, shortage);
        });
        
        return positionNeeds;
    }

    // 추천 이유 생성
    getRecommendationReasons(player, positionNeeds) {
        const reasons = [];
        
        if (positionNeeds[player.position] > 0) {
            reasons.push(`${player.position} 포지션 보강 필요`);
        }
        
        if (player.age < 25) {
            reasons.push('젊은 유망주');
        }
        
        if (player.rating > 85) {
            reasons.push('뛰어난 능력치');
        }
        
        const pricePerRating = player.transferPrice / player.rating;
        if (pricePerRating < 10) {
            reasons.push('뛰어난 가성비');
        }
        
        if (player.transferPrice <= gameData.teamMoney) {
            reasons.push('구매 가능');
        } else {
            reasons.push('구매 불가 (자금 부족)');
        }
        
        return reasons;
    }

    // 메시지 표시
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }
}

// 이적 시스템 인스턴스 생성
const transferSystem = new TransferSystem();

// 이적 시장 초기화
function initializeTransferMarket() {
    gameData.transferMarket = transferSystem.generateTransferMarket();
}

// 이적 시장 표시
function displayTransferMarket() {
    const leagueFilter = document.getElementById('transferLeagueFilter').value;
    const positionFilter = document.getElementById('transferPositionFilter').value;
    
    const filteredPlayers = transferSystem.filterMarket(leagueFilter, positionFilter);
    const marketContainer = document.getElementById('transferMarket');
    
    marketContainer.innerHTML = '';
    
    if (filteredPlayers.length === 0) {
        marketContainer.innerHTML = '<div style="text-align: center; color: #666;">해당 조건의 선수가 없습니다.</div>';
        return;
    }
    
    filteredPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player';
        
        const canAfford = gameData.teamMoney >= player.transferPrice;
        
        playerCard.innerHTML = `
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-details">
                    <span>포지션: ${player.position}</span>
                    <span>국적: ${player.country}</span>
                    <span>나이: ${player.age}세</span>
                    <span>레이팅: ${player.rating}</span>
                    <span>소속: ${player.originalTeam}</span>
                    <span>리그: ${player.currentLeague}</span>
                </div>
            </div>
            <div class="player-price">${player.transferPrice}억원</div>
            <button class="buy-button" onclick="buyTransferPlayer('${player.id}')" ${canAfford ? '' : 'disabled'}>
                ${canAfford ? '영입하기' : '자금 부족'}
            </button>
        `;
        
        marketContainer.appendChild(playerCard);
    });
}

// 이적 시장 새로고침
function refreshTransferMarket() {
    transferSystem.refreshMarket();
}

// 선수 구매
function buyTransferPlayer(playerId) {
    const player = gameData.transferMarket.find(p => p.id === playerId);
    if (player && transferSystem.buyPlayer(player)) {
        displayTransferMarket();
        displayMyPlayers();
    }
}

// 내 선수 목록 표시
function displayMyPlayers() {
    const container = document.getElementById('myPlayers');
    const nonSquadPlayers = gameData.allPlayers.filter(p => !p.inSquad);
    
    container.innerHTML = '';
    
    if (nonSquadPlayers.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666;">벤치에 선수가 없습니다.</div>';
        return;
    }
    
    nonSquadPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'my-player';
        
        const marketValue = transferSystem.calculatePlayerPrice({
            ...player,
            currentLeague: gameData.currentLeague
        });
        const releaseValue = Math.round(marketValue * 0.3);
        
        playerCard.innerHTML = `
            <div style="font-weight: bold;">${player.name}</div>
            <div>${player.position} | ${player.country} | ${player.age}세</div>
            <div>레이팅: ${player.rating}</div>
            <div>시장가: ${marketValue}억원</div>
            <div>방출가: ${releaseValue}억원</div>
            <button class="release-button" onclick="releasePlayer('${player.id}')">
                방출하기
            </button>
        `;
        
        container.appendChild(playerCard);
    });
}

// 선수 방출
function releasePlayer(playerId) {
    const player = gameData.allPlayers.find(p => p.id === playerId);
    if (player && transferSystem.releasePlayer(player)) {
        displayMyPlayers();
        displaySquad();
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 이적 시장 필터 이벤트
    const leagueFilter = document.getElementById('transferLeagueFilter');
    const positionFilter = document.getElementById('transferPositionFilter');
    
    if (leagueFilter) {
        leagueFilter.addEventListener('change', displayTransferMarket);
    }
    
    if (positionFilter) {
        positionFilter.addEventListener('change', displayTransferMarket);
    }
});
