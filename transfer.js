// 이적 시장 시스템

let transferMarket = [];
let aiTransferHistory = [];

// 외부 리그 스타 선수들
const externalPlayers = [
    { name: "리오넬 메시", position: "FW", country: "아르헨티나", age: 38, rating: 88, team: "인터 마이애미" },
    { name: "크리스티아누 호날두", position: "FW", country: "포르투갈", age: 40, rating: 86, team: "알 나스르" },
    { name: "네이마르", position: "FW", country: "브라질", age: 33, rating: 85, team: "알 힐랄" },
    { name: "V.요케레스", position: "FW", country: "헝가리", age: 29, rating: 78, team: "RB 라이프치히" },
    { name: "에를링 홀란드", position: "FW", country: "노르웨이", age: 25, rating: 94, team: "맨체스터 시티" },
    { name: "킬리안 음바페", position: "FW", country: "프랑스", age: 26, rating: 94, team: "레알 마드리드" },
    { name: "카림 벤제마", position: "FW", country: "프랑스", age: 37, rating: 83, team: "알 이티하드" },
    { name: "루카 모드리치", position: "MF", country: "크로아티아", age: 39, rating: 85, team: "AC 밀란" },
    { name: "세르히오 라모스", position: "DF", country: "스페인", age: 39, rating: 78, team: "멕시코 연합" },
    { name: "은골로 캉테", position: "MF", country: "프랑스", age: 34, rating: 80, team: "알 이티하드" }
];

function initializeTransferMarket() {
    generateTransferMarket();
}

function generateTransferMarket() {
    transferMarket = [];
    
    // 1. 상대팀 선수들을 20% 확률로 시장에 진출
    for (let league = 1; league <= 3; league++) {
        const teams = gameState.leagueTables[league];
        
        teams.forEach(teamEntry => {
            if (teamEntry.name !== gameState.selectedTeam && superLeagueTeams[teamEntry.name]) {
                const teamData = superLeagueTeams[teamEntry.name];
                
                teamData.players.forEach(player => {
                    if (Math.random() < 0.2) { // 20% 확률
                        const price = calculatePlayerPrice(player);
                        transferMarket.push({
                            ...player,
                            originalTeam: teamEntry.name,
                            price: price
                        });
                    }
                });
            }
        });
    }
    
    // 2. 외부 리그 스타 선수들 추가 (50% 확률)
    externalPlayers.forEach(player => {
        if (Math.random() < 0.5) {
            const price = calculatePlayerPrice(player);
            transferMarket.push({
                ...player,
                originalTeam: player.team,
                price: price
            });
        }
    });
    
    console.log(`Transfer market initialized with ${transferMarket.length} players`);
}

function calculatePlayerPrice(player) {
    const basePrice = 500; // 500억 기본 가격
    
    // 능력치 배수
    let ratingMultiplier = 1;
    if (player.rating >= 90) ratingMultiplier = 8;
    else if (player.rating >= 85) ratingMultiplier = 5;
    else if (player.rating >= 80) ratingMultiplier = 3;
    else if (player.rating >= 75) ratingMultiplier = 2;
    else if (player.rating >= 70) ratingMultiplier = 1.5;
    
    // 나이 배수
    let ageMultiplier = 1;
    if (player.age <= 22) ageMultiplier = 1.5;
    else if (player.age <= 25) ageMultiplier = 1.3;
    else if (player.age <= 28) ageMultiplier = 1.1;
    else if (player.age <= 30) ageMultiplier = 1.0;
    else if (player.age <= 33) ageMultiplier = 0.8;
    else if (player.age <= 35) ageMultiplier = 0.6;
    else ageMultiplier = 0.4;
    
    // 포지션 배수
    const positionMultiplier = {
        'FW': 1.2,
        'MF': 1.0,
        'DF': 0.9,
        'GK': 0.8
    };
    
    // 랜덤 요소 (0.85~1.5)
    const randomFactor = 0.85 + Math.random() * 0.65;
    
    const finalPrice = Math.round(basePrice * ratingMultiplier * ageMultiplier * 
                                 (positionMultiplier[player.position] || 1) * randomFactor);
    
    return Math.max(100, finalPrice); // 최소 100억
}

function loadTransferMarket() {
    const searchTerm = document.getElementById('playerSearch').value.toLowerCase();
    const positionFilter = document.getElementById('positionFilter').value;
    const ratingFilter = parseInt(document.getElementById('ratingFilter').value) || 0;
    
    let filteredPlayers = transferMarket;
    
    // 필터 적용
    if (searchTerm) {
        filteredPlayers = filteredPlayers.filter(player => 
            player.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (positionFilter) {
        filteredPlayers = filteredPlayers.filter(player => 
            player.position === positionFilter
        );
    }
    
    if (ratingFilter) {
        filteredPlayers = filteredPlayers.filter(player => 
            player.rating >= ratingFilter
        );
    }
    
    displayTransferPlayers(filteredPlayers);
}

function displayTransferPlayers(players) {
    const container = document.getElementById('transferMarket');
    container.innerHTML = '';
    
    if (players.length === 0) {
        container.innerHTML = '<p>검색 조건에 맞는 선수가 없습니다.</p>';
        return;
    }
    
    players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player';
        
        const canAfford = gameState.funds >= player.price;
        
        playerCard.innerHTML = `
            <h4>${player.name}</h4>
            <div class="player-details">
                <p><strong>포지션:</strong> ${player.position}</p>
                <p><strong>국가:</strong> ${player.country}</p>
                <p><strong>나이:</strong> ${player.age}세</p>
                <p><strong>능력치:</strong> <span style="color: #FFD700; font-weight: bold;">${player.rating}</span></p>
                <p><strong>소속팀:</strong> ${player.originalTeam}</p>
            </div>
            <div class="transfer-price">${player.price}억원</div>
            <button class="action-btn ${!canAfford ? 'disabled' : ''}" 
                    onclick="buyPlayer(${index})"
                    ${!canAfford ? 'disabled' : ''}>
                ${canAfford ? '구매' : '자금 부족'}
            </button>
        `;
        
        container.appendChild(playerCard);
    });
}

function buyPlayer(marketIndex) {
    const searchTerm = document.getElementById('playerSearch').value.toLowerCase();
    const positionFilter = document.getElementById('positionFilter').value;
    const ratingFilter = parseInt(document.getElementById('ratingFilter').value) || 0;
    
    // 현재 필터된 선수 목록에서 선택
    let filteredPlayers = transferMarket;
    
    if (searchTerm) {
        filteredPlayers = filteredPlayers.filter(player => 
            player.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (positionFilter) {
        filteredPlayers = filteredPlayers.filter(player => 
            player.position === positionFilter
        );
    }
    
    if (ratingFilter) {
        filteredPlayers = filteredPlayers.filter(player => 
            player.rating >= ratingFilter
        );
    }
    
    const player = filteredPlayers[marketIndex];
    if (!player) return;
    
    if (gameState.funds < player.price) {
        showNotification('자금이 부족합니다!');
        return;
    }
    
    // 스쿼드 크기 확인 (최대 30명)
    if (gameState.selectedTeamData.players.length >= 30) {
        showNotification('스쿼드가 가득 찼습니다! (최대 30명)');
        return;
    }
    
    // 구매 처리
    gameState.funds -= player.price;
    
    // 선수를 스쿼드에 추가 (originalTeam 정보 제거)
    const newPlayer = {
        name: player.name,
        position: player.position,
        country: player.country,
        age: player.age,
        rating: player.rating
    };
    
    gameState.selectedTeamData.players.push(newPlayer);
    
    // 이적 시장에서 제거
    const originalIndex = transferMarket.findIndex(p => 
        p.name === player.name && p.originalTeam === player.originalTeam
    );
    if (originalIndex !== -1) {
        transferMarket.splice(originalIndex, 1);
    }
    
    // UI 업데이트
    updateUI();
    setupFormation();
    loadTransferMarket();
    
    // 선수 성장 데이터 추가 (25세 이하인 경우)
    if (newPlayer.age <= 25) {
        initializeGrowthForNewPlayer(newPlayer, gameState.selectedTeamData.players.length - 1);
    }
    
    // 뉴스 생성
    generateTransferNews('buy', newPlayer, player.price, player.originalTeam);
    
    showNotification(`${player.name}을(를) ${player.price}억원에 영입했습니다!`);
}

function sellPlayer(playerIndex) {
    const player = gameState.selectedTeamData.players[playerIndex];
    if (!player) return;
    
    // 포메이션에서 제거 확인
    const isInFormation = Object.values(gameState.formation).includes(playerIndex);
    if (isInFormation) {
        showNotification('포메이션에 배치된 선수는 판매할 수 없습니다!');
        return;
    }
    
    // 판매 가격 계산 (구매가의 70-90%)
    const sellPrice = Math.round(calculatePlayerPrice(player) * (0.7 + Math.random() * 0.2));
    
    // 판매 확인 창
    if (confirm(`${player.name}을(를) ${sellPrice}억원에 판매하시겠습니까?`)) {
        gameState.funds += sellPrice;
        
        // 선수 제거
        gameState.selectedTeamData.players.splice(playerIndex, 1);
        
        // 포메이션 인덱스 조정
        Object.keys(gameState.formation).forEach(pos => {
            if (gameState.formation[pos] > playerIndex) {
                gameState.formation[pos]--;
            } else if (gameState.formation[pos] === playerIndex) {
                gameState.formation[pos] = null;
            }
        });
        
        // 선수 성장 데이터 제거
        const playerId = `${player.name}_${playerIndex}`;
        if (playerGrowthData && playerGrowthData[playerId]) {
            delete playerGrowthData[playerId];
        }
        
        // UI 업데이트
        updateUI();
        setupFormation();
        
        // 뉴스 생성
        generateTransferNews('sell', player, sellPrice);
        
        showNotification(`${player.name}을(를) ${sellPrice}억원에 판매했습니다!`);
    }
}

function simulateAITransfers() {
    // AI 팀간 이적 시뮬레이션 (5경기마다 30% 확률)
    if (gameState.matchesPlayed % 5 === 0 && Math.random() < 0.3) {
        const availableTeams = [];
        
        for (let league = 1; league <= 3; league++) {
            gameState.leagueTables[league].forEach(team => {
                if (team.name !== gameState.selectedTeam && superLeagueTeams[team.name]) {
                    availableTeams.push({
                        name: team.name,
                        data: superLeagueTeams[team.name],
                        league: league
                    });
                }
            });
        }
        
        if (availableTeams.length >= 2) {
            const fromTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
            const toTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
            
            if (fromTeam !== toTeam && fromTeam.data.players.length > 0) {
                // 낮은 능력치 선수 위주로 이적
                const eligiblePlayers = fromTeam.data.players.filter(p => p.rating < 80);
                
                if (eligiblePlayers.length > 0) {
                    const player = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
                    const transferFee = calculatePlayerPrice(player);
                    
                    // 이적 실행
                    const playerIndex = fromTeam.data.players.indexOf(player);
                    fromTeam.data.players.splice(playerIndex, 1);
                    
                    // 새로운 선수로 복사해서 추가
                    toTeam.data.players.push({...player});
                    
                    // 이적 기록
                    aiTransferHistory.push({
                        player: player.name,
                        from: fromTeam.name,
                        to: toTeam.name,
                        fee: transferFee,
                        date: gameState.matchesPlayed
                    });
                    
                    // 뉴스 생성 (가끔씩만)
                    if (Math.random() < 0.3) {
                        generateAITransferNews(player, fromTeam.name, toTeam.name, transferFee);
                    }
                    
                    console.log(`AI Transfer: ${player.name} from ${fromTeam.name} to ${toTeam.name} for ${transferFee}억`);
                }
            }
        }
    }
}

function initializeGrowthForNewPlayer(player, playerIndex) {
    if (typeof initializePlayerGrowth === 'function') {
        const playerId = `${player.name}_${playerIndex}`;
        playerGrowthData[playerId] = {
            maxPotential: player.rating + Math.floor(Math.random() * 13) + 3,
            growthRate: Math.random() * 0.8 + 0.2,
            lastGrowth: 0,
            totalGrowth: 0
        };
    }
}

function refreshTransferMarket() {
    // 이적 시장 새로고침 (시즌마다 또는 수동으로)
    generateTransferMarket();
    loadTransferMarket();
    showNotification('이적 시장이 새로고침되었습니다!');
}

function getTransferBudgetRecommendation() {
    // 예산 추천 시스템
    const teamStrength = calculateTeamStrength();
    const leagueLevel = gameState.league;
    
    let recommendedBudget = 0;
    
    if (leagueLevel === 1) {
        recommendedBudget = teamStrength < 80 ? 1000 : 1500;
    } else if (leagueLevel === 2) {
        recommendedBudget = teamStrength < 75 ? 800 : 1200;
    } else {
        recommendedBudget = teamStrength < 70 ? 600 : 1000;
    }
    
    return recommendedBudget;
}

function calculateTeamStrength() {
    if (!gameState.selectedTeamData || !gameState.selectedTeamData.players) return 70;
    
    const players = gameState.selectedTeamData.players;
    const avgRating = players.reduce((sum, player) => sum + player.rating, 0) / players.length;
    
    return Math.round(avgRating);
}

function getPositionNeeds() {
    // 포지션별 필요도 분석
    const positions = ['GK', 'DF', 'MF', 'FW'];
    const positionCounts = {};
    const positionAvgRatings = {};
    
    positions.forEach(pos => {
        positionCounts[pos] = 0;
        positionAvgRatings[pos] = 0;
    });
    
    if (gameState.selectedTeamData && gameState.selectedTeamData.players) {
        gameState.selectedTeamData.players.forEach(player => {
            positionCounts[player.position]++;
            positionAvgRatings[player.position] += player.rating;
        });
        
        positions.forEach(pos => {
            if (positionCounts[pos] > 0) {
                positionAvgRatings[pos] = Math.round(positionAvgRatings[pos] / positionCounts[pos]);
            }
        });
    }
    
    const needs = [];
    
    // 최소 필요 인원 체크
    if (positionCounts['GK'] < 2) needs.push({ position: 'GK', priority: 'High', reason: '골키퍼 부족' });
    if (positionCounts['DF'] < 4) needs.push({ position: 'DF', priority: 'High', reason: '수비수 부족' });
    if (positionCounts['MF'] < 3) needs.push({ position: 'MF', priority: 'High', reason: '미드필더 부족' });
    if (positionCounts['FW'] < 2) needs.push({ position: 'FW', priority: 'High', reason: '공격수 부족' });
    
    // 평균 능력치 기준 보강 필요
    positions.forEach(pos => {
        if (positionAvgRatings[pos] < 75 && positionCounts[pos] >= 2) {
            needs.push({ position: pos, priority: 'Medium', reason: '능력치 향상 필요' });
        }
    });
    
    return needs;
}

function getTransferTargetRecommendations() {
    const needs = getPositionNeeds();
    const budget = gameState.funds;
    const recommendations = [];
    
    needs.forEach(need => {
        const suitablePlayers = transferMarket.filter(player => {
            return player.position === need.position && 
                   player.price <= budget * 0.4 && // 예산의 40% 이내
                   player.rating >= 75; // 최소 능력치
        });
        
        suitablePlayers.sort((a, b) => {
            // 가성비 정렬 (능력치/가격 비율)
            const ratioA = a.rating / a.price;
            const ratioB = b.rating / b.price;
            return ratioB - ratioA;
        });
        
        if (suitablePlayers.length > 0) {
            recommendations.push({
                need: need,
                player: suitablePlayers[0],
                valueRatio: Math.round((suitablePlayers[0].rating / suitablePlayers[0].price) * 1000) / 1000
            });
        }
    });
    
    return recommendations;
}

// 검색 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('searchBtn');
    const playerSearch = document.getElementById('playerSearch');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', loadTransferMarket);
    }
    
    if (playerSearch) {
        playerSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadTransferMarket();
            }
        });
    }
    
    // 필터 변경시 자동 검색
    const filters = ['positionFilter', 'ratingFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', loadTransferMarket);
        }
    });
});

// 더미 함수 (SNS 모듈에서 구현될 예정)
function generateTransferNews(type, player, price, fromTeam) {
    if (typeof generateNews === 'function') {
        let title, content;
        if (type === 'buy') {
            title = `[오피셜] ${gameState.selectedTeam}, ${player.name} 영입 확정!`;
            content = `${gameState.selectedTeam}이 ${fromTeam}에서 ${player.name} 선수를 ${price}억원에 영입했습니다. ${player.age}세 ${player.position} 선수로 팀에 새로운 활력을 불어넣을 것으로 기대됩니다.`;
        } else {
            title = `[오피셜] ${gameState.selectedTeam}, ${player.name} 방출`;
            content = `${gameState.selectedTeam}이 ${player.name} 선수를 ${price}억원에 방출했습니다.`;
        }
        generateNews(title, content, `#${gameState.selectedTeam.replace(/\s+/g, '')} #이적 #${player.name.replace(/\s+/g, '')}`);
    }
}

function generateAITransferNews(player, fromTeam, toTeam, fee) {
    if (typeof generateNews === 'function') {
        generateNews(
            `[이적] ${player.name}, ${fromTeam}에서 ${toTeam}로 이적`,
            `${player.name} 선수가 ${fee}억원의 이적료로 ${fromTeam}에서 ${toTeam}로 이적했습니다.`,
            `#이적 #${fromTeam.replace(/\s+/g, '')} #${toTeam.replace(/\s+/g, '')}`
        );
    }
}
