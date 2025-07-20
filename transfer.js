// 이적 시스템
class TransferSystem {
    constructor() {
        this.transferMarket = [];
        this.aiTransferCooldown = 0;
        this.basePrice = 500; // 기본 가격 500억
        
        // 타 리그 선수들
        this.extraPlayers = [
            { name: "V.죄케레스", position: "FW", rating: 85, age: 26, team: "외부리그" },
            { name: "주앙 칸셀루", position: "DF", rating: 82, age: 31, team: "외부리그" },
            { name: "L.토레이라", position: "MF", rating: 85, age: 27, team: "외부리그" },
            { name: "K.나카무라", position: "MF", rating: 80, age: 23, team: "외부리그" },
            { name: "R.산체스", position: "GK", rating: 84, age: 29, team: "외부리그" },
            { name: "C.호날두", position: "FW", rating: 86, age: 40, team: "외부리그" },
            { name: "사디오 마네", position: "FW", rating: 83, age: 33, team: "외부리그" },
            { name: "은골로 캉테", position: "MF", rating: 84, age: 34, team: "외부리그" },
            { name: "리오넬 메시", position: "FW", rating: 87, age: 37, team: "외부리그" },
            { name: "라포르트", position: "DF", rating: 83, age: 31, team: "외부리그" },
            { name: "A.그리즈만", position: "FW", rating: 85, age: 33, team: "외부리그" },
            { name: "카세미루", position: "MF", rating: 84, age: 32, team: "외부리그" },
            { name: "T.크루스", position: "MF", rating: 82, age: 30, team: "외부리그" },
            { name: "파울로 디발라", position: "FW", rating: 83, age: 31, team: "외부리그" },
            { name: "산초", position: "FW", rating: 81, age: 24, team: "외부리그" }
        ];
    }

    // 이적 시장 초기화
    initializeTransferMarket() {
        this.transferMarket = [];
        
        // 다른 팀의 일부 선수들을 이적 시장에 추가
        Object.keys(teams).forEach(teamKey => {
            if (teamKey !== gameData.selectedTeam) {
                const teamPlayers = teams[teamKey];
                
                // 각 팀에서 20% 확률로 선수를 이적 시장에 내놓음
                teamPlayers.forEach(player => {
                    if (Math.random() < 0.2) {
                        this.transferMarket.push({
                            ...player,
                            originalTeam: teamKey,
                            price: this.calculatePlayerPrice(player),
                            daysOnMarket: Math.floor(Math.random() * 30)
                        });
                    }
                });
            }
        });

        // 타 리그 선수들도 추가
        this.extraPlayers.forEach(player => {
            this.transferMarket.push({
                ...player,
                originalTeam: "외부리그",
                price: this.calculatePlayerPrice(player),
                daysOnMarket: Math.floor(Math.random() * 30)
            });
        });

        this.shuffleTransferMarket();
    }

    // 선수 가격 계산
    calculatePlayerPrice(player) {
        let price = this.basePrice;
        
        // 능력치에 따른 가격 조정
        const ratingMultiplier = Math.pow(player.rating / 70, 2.5);
        price *= ratingMultiplier;
        
        // 나이에 따른 가격 조정
        let ageMultiplier = 1;
        if (player.age <= 20) {
            ageMultiplier = 1.3; // 젊은 선수는 30% 비싸게
        } else if (player.age <= 25) {
            ageMultiplier = 1.1; // 25세 이하는 10% 비싸게
        } else if (player.age >= 30) {
            ageMultiplier = 1; // 30세 이상은 1배
        } else if (player.age >= 35) {
            ageMultiplier = 0.8; // 35세 이상은 20% 싸게
        }
        
        price *= ageMultiplier;
        
        // 포지션에 따른 가격 조정
        const positionMultiplier = {
            'GK': 1.0,
            'DF': 1.0,
            'MF': 1.1,
            'FW': 1.3
        };
        
        price *= positionMultiplier[player.position] || 1;
        
        // 랜덤 요소 추가 (85% ~ 150%)
        const randomFactor = 0.85 + Math.random() * 0.65;
        price *= randomFactor;
        
        return Math.round(price);
    }

    // 이적 시장 섞기
    shuffleTransferMarket() {
        for (let i = this.transferMarket.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.transferMarket[i], this.transferMarket[j]] = [this.transferMarket[j], this.transferMarket[i]];
        }
    }

    // 선수 검색
    searchPlayers(filters) {
        let filteredPlayers = [...this.transferMarket];
        
        // 이름 검색
        if (filters.name && filters.name.trim()) {
            const searchName = filters.name.toLowerCase();
            filteredPlayers = filteredPlayers.filter(player => 
                player.name.toLowerCase().includes(searchName)
            );
        }
        
        // 포지션 필터
        if (filters.position) {
            filteredPlayers = filteredPlayers.filter(player => 
                player.position === filters.position
            );
        }
        
        // 최소 능력치 필터
        if (filters.minRating) {
            filteredPlayers = filteredPlayers.filter(player => 
                player.rating >= filters.minRating
            );
        }
        
        // 최대 나이 필터
        if (filters.maxAge) {
            filteredPlayers = filteredPlayers.filter(player => 
                player.age <= filters.maxAge
            );
        }

        // 최대 가격 필터
        if (filters.maxPrice) {
            filteredPlayers = filteredPlayers.filter(player => 
                player.price <= filters.maxPrice
            );
        }
        
        return filteredPlayers;
    }

    // 선수 영입
    signPlayer(player) {
        if (gameData.teamMoney < player.price) {
            return { success: false, message: "자금이 부족합니다!" };
        }
        
        // 팀 인원 제한 확인 (30명 제한)
        if (teams[gameData.selectedTeam].length >= 30) {
            return { success: false, message: "팀 인원이 가득 찼습니다! (최대 30명)" };
        }
        
        // 영입 처리
        gameData.teamMoney -= player.price;
        
        // 선수를 팀에 추가
        const newPlayer = {
            name: player.name,
            position: player.position,
            rating: player.rating,
            age: player.age
        };
        
        teams[gameData.selectedTeam].push(newPlayer);
        
        // 이적 시장에서 제거
        this.transferMarket = this.transferMarket.filter(p => p !== player);
        
        // AI 팀에서 선수 제거 (외부리그가 아닌 경우)
        if (player.originalTeam !== "외부리그") {
            const originalTeamPlayers = teams[player.originalTeam];
            const playerIndex = originalTeamPlayers.findIndex(p => 
                p.name === player.name && p.position === player.position
            );
            if (playerIndex !== -1) {
                originalTeamPlayers.splice(playerIndex, 1);
            }
        }

        // SNS에 이적 소식 게시
        if (typeof updateSNSAfterTransfer === 'function') {
            updateSNSAfterTransfer(player.name, player.originalTeam, gameData.selectedTeam, player.price);
        }
        
        return { 
            success: true, 
            message: `${player.name}을(를) ${player.price}억에 영입했습니다!`,
            player: newPlayer
        };
    }

    // 선수 방출
    releasePlayer(player, transferFee = 0) {
        const teamPlayers = teams[gameData.selectedTeam];
        const playerIndex = teamPlayers.findIndex(p => 
            p.name === player.name && p.position === player.position
        );
        
        if (playerIndex === -1) {
            return { success: false, message: "해당 선수를 찾을 수 없습니다." };
        }
        
        // 스쿼드에서도 제거
        this.removePlayerFromSquad(player);
        
        // 팀에서 제거
        teamPlayers.splice(playerIndex, 1);
        
        // 이적료 받기
        gameData.teamMoney += transferFee;
        
        // 이적 시장에 추가 (자유계약인 경우)
        if (transferFee === 0) {
            this.transferMarket.push({
                ...player,
                originalTeam: gameData.selectedTeam,
                price: Math.round(this.calculatePlayerPrice(player) * 0.7), // 70% 가격으로
                daysOnMarket: 0
            });
        }
        
        return { 
            success: true, 
            message: `${player.name}을(를) 방출했습니다.${transferFee > 0 ? ` (이적료: ${transferFee}억)` : ''}`
        };
    }

    // 스쿼드에서 선수 제거
    removePlayerFromSquad(player) {
        if (gameData.squad.gk && gameData.squad.gk.name === player.name) {
            gameData.squad.gk = null;
        }
        
        gameData.squad.df = gameData.squad.df.map(p => 
            p && p.name === player.name ? null : p
        );
        
        gameData.squad.mf = gameData.squad.mf.map(p => 
            p && p.name === player.name ? null : p
        );
        
        gameData.squad.fw = gameData.squad.fw.map(p => 
            p && p.name === player.name ? null : p
        );
    }

    // AI 팀 간 이적 시뮬레이션
    simulateAITransfers() {
        this.aiTransferCooldown--;
        
        if (this.aiTransferCooldown <= 0 && Math.random() < 0.3) { // 30% 확률로 AI 이적 발생
            this.processAITransfer();
            this.aiTransferCooldown = 5; // 5경기 후 다시 시도
        }
    }

    // AI 팀 이적 처리
    processAITransfer() {
        const availableTeams = Object.keys(teams).filter(team => team !== gameData.selectedTeam);
        
        if (availableTeams.length < 2) return;
        
        const buyingTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        const sellingTeams = availableTeams.filter(team => team !== buyingTeam);
        const sellingTeam = sellingTeams[Math.floor(Math.random() * sellingTeams.length)];
        
        const sellingTeamPlayers = teams[sellingTeam];
        if (sellingTeamPlayers.length <= 15) return; // 최소 인원 유지
        
        // 낮은 능력치 선수를 이적시킬 확률이 높음
        const transferCandidate = sellingTeamPlayers
            .filter(p => p.rating < 85)
            .sort((a, b) => a.rating - b.rating)[0];
        
        if (transferCandidate && Math.random() < 0.5) {
            // 이적 실행
            const playerIndex = sellingTeamPlayers.findIndex(p => p === transferCandidate);
            sellingTeamPlayers.splice(playerIndex, 1);
            
            teams[buyingTeam].push(transferCandidate);
            
            // SNS에 AI 이적 소식 게시
            if (typeof updateSNSAfterTransfer === 'function') {
                const transferFee = this.calculatePlayerPrice(transferCandidate);
                updateSNSAfterTransfer(transferCandidate.name, sellingTeam, buyingTeam, transferFee);
            }
            
            console.log(`AI 이적: ${transferCandidate.name}이(가) ${teamNames[sellingTeam]}에서 ${teamNames[buyingTeam]}로 이적했습니다.`);
        }
    }

    // 이적 시장 업데이트 (매일/매경기)
    updateTransferMarket() {
        // 시장에 있는 선수들의 일수 증가
        this.transferMarket.forEach(player => {
            player.daysOnMarket++;
            
            // 30일 이상 시장에 있으면 가격 하락
            if (player.daysOnMarket > 30) {
                player.price = Math.round(player.price * 0.95);
            }
            
            // 60일 이상이면 시장에서 제거 (80%는 팀에 복귀, 20%는 다른 팀으로 이적)
            if (player.daysOnMarket > 60) {
                if (Math.random() < 0.8 && player.originalTeam !== "외부리그") {
                    // 원래 팀으로 복귀
                    teams[player.originalTeam].push({
                        name: player.name,
                        position: player.position,
                        rating: player.rating,
                        age: player.age
                    });
                } else {
                    // 20%는 다른 팀으로 이적
                    const availableTeams = Object.keys(teams).filter(team => 
                        team !== gameData.selectedTeam && team !== player.originalTeam
                    );
                    if (availableTeams.length > 0) {
                        const newTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
                        teams[newTeam].push({
                            name: player.name,
                            position: player.position,
                            rating: player.rating,
                            age: player.age
                        });
                    }
                }
                player.daysOnMarket = -1; // 제거 표시
            }
        });
        
        // 제거 표시된 선수들 제거
        this.transferMarket = this.transferMarket.filter(player => player.daysOnMarket >= 0);
        
        // 새로운 선수 추가 (20% 확률)
        if (Math.random() < 0.2) {
            this.addRandomPlayerToMarket();
        }
        
        // AI 이적 시뮬레이션
        this.simulateAITransfers();
    }

    // 랜덤 선수를 시장에 추가
    addRandomPlayerToMarket() {
        const availableTeams = Object.keys(teams).filter(team => team !== gameData.selectedTeam);
        
        if (availableTeams.length === 0) return;
        
        const randomTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
        const teamPlayers = teams[randomTeam];
        
        if (teamPlayers.length <= 20) return; // 최소 인원 유지
        
        const availablePlayers = teamPlayers.filter(player => 
            !this.transferMarket.some(tp => tp.name === player.name && tp.originalTeam === randomTeam)
        );
        
        if (availablePlayers.length > 0) {
            const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
            
            this.transferMarket.push({
                ...randomPlayer,
                originalTeam: randomTeam,
                price: this.calculatePlayerPrice(randomPlayer),
                daysOnMarket: 0
            });
        }
    }

    // 이적 시장 표시용 데이터 가져오기 (20명 제한)
    getTransferMarketDisplay(limit = 20) {
        return this.transferMarket
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    // 내 팀 선수 목록 가져오기 (방출용)
    getMyTeamPlayers() {
        if (!gameData.selectedTeam) return [];
        return teams[gameData.selectedTeam].map(player => ({
            ...player,
            estimatedPrice: Math.round(this.calculatePlayerPrice(player) * 0.8) // 80% 가격으로 판매
        }));
    }

    // 선수 계약 연장 (추후 구현)
    renewContract(player, newSalary, contractLength) {
        // 계약 연장 로직
        return { success: true, message: `${player.name}과(와) 계약을 연장했습니다.` };
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            transferMarket: this.transferMarket,
            aiTransferCooldown: this.aiTransferCooldown
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        this.transferMarket = saveData.transferMarket || [];
        this.aiTransferCooldown = saveData.aiTransferCooldown || 0;
    }
}

// 전역 이적 시스템 인스턴스
const transferSystem = new TransferSystem();

// 이적 시장 초기화
function initializeTransferMarket() {
    transferSystem.initializeTransferMarket();
}

// 이적 화면 로드 (단순화)
function loadTransferScreen() {
    updateMoneyDisplay();
    displayRandomTransferPlayers();
}

// 자금 표시 업데이트
function updateMoneyDisplay() {
    const moneyElement = document.getElementById('displayMoney');
    if (moneyElement) {
        moneyElement.textContent = gameData.teamMoney + '억';
    }
}

// 무작위 선수 표시 (다른 팀에서 10명)
function displayRandomTransferPlayers() {
    const container = document.getElementById('transferPlayersList');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 다른 팀에서 무작위로 선수 선택
    const randomPlayers = getRandomPlayersFromOtherTeams(10);
    
    if (randomPlayers.length === 0) {
        container.innerHTML = '<p class="no-data">현재 이적 가능한 선수가 없습니다.</p>';
        return;
    }

    randomPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player-card';
        
        playerCard.innerHTML = `
            <div class="player-info">
                <h4>${player.name}</h4>
                <p>포지션: ${player.position}</p>
                <p>능력치: ${player.rating}</p>
                <p>나이: ${player.age}세</p>
                <p>현재팀: ${teamNames[player.currentTeam]}</p>
            </div>
            <div class="player-price">
                <div class="price">${player.price}억</div>
                <button onclick="buyRandomPlayer('${player.name}', '${player.currentTeam}', ${player.price})" 
                        class="buy-btn ${gameData.teamMoney >= player.price ? '' : 'disabled'}"
                        ${gameData.teamMoney >= player.price ? '' : 'disabled'}>
                    ${gameData.teamMoney >= player.price ? '영입하기' : '자금부족'}
                </button>
            </div>
        `;
        
        container.appendChild(playerCard);
    });
}

// 다른 팀에서 무작위 선수 선택
function getRandomPlayersFromOtherTeams(count) {
    const allPlayers = [];
    
    // 내 팀을 제외한 모든 팀의 선수들 수집
    Object.keys(teams).forEach(teamKey => {
        if (teamKey !== gameData.selectedTeam) {
            teams[teamKey].forEach(player => {
                allPlayers.push({
                    ...player,
                    currentTeam: teamKey,
                    price: transferSystem.calculatePlayerPrice(player)
                });
            });
        }
    });
    
    // 무작위로 섞기
    for (let i = allPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPlayers[i], allPlayers[j]] = [allPlayers[j], allPlayers[i]];
    }
    
    // 지정된 수만큼 반환
    return allPlayers.slice(0, count);
}

// 무작위 선수 구매
function buyRandomPlayer(playerName, currentTeam, price) {
    if (gameData.teamMoney < price) {
        alert('자금이 부족합니다!');
        return;
    }

    if (teams[gameData.selectedTeam].length >= 30) {
        alert('팀 인원이 가득 찼습니다! (최대 30명)');
        return;
    }

    // 해당 선수 찾기
    const player = teams[currentTeam].find(p => p.name === playerName);
    if (!player) {
        alert('선수를 찾을 수 없습니다.');
        return;
    }

    const confirmMessage = `${playerName}을(를) ${price}억에 영입하시겠습니까?`;

    if (confirm(confirmMessage)) {
        // 자금 차감
        gameData.teamMoney -= price;
        
        // 내 팀에 선수 추가
        teams[gameData.selectedTeam].push({...player});
        
        // 원래 팀에서 선수 제거
        const playerIndex = teams[currentTeam].findIndex(p => p.name === playerName);
        if (playerIndex !== -1) {
            teams[currentTeam].splice(playerIndex, 1);
        }

        alert(`${playerName}을(를) 성공적으로 영입했습니다!`);
        
        // 화면 업데이트
        updateMoneyDisplay();
        displayRandomTransferPlayers();
        updateLobbyDisplay();
        
        // 성장 시스템에 새 선수 추가
        if (player.age <= 25 && typeof playerGrowthSystem !== 'undefined') {
            playerGrowthSystem.initializePlayerGrowth();
        }

        // SNS 업데이트
        if (typeof updateSNSAfterTransfer === 'function') {
            updateSNSAfterTransfer(playerName, currentTeam, gameData.selectedTeam, price);
        }
    }
}

// 이적시장 새로고침
function refreshTransferMarket() {
    displayRandomTransferPlayers();
}

// 이적 가능 선수 표시
function displayTransferPlayers() {
    const container = document.getElementById('transferPlayers');
    if (!container) return;
    
    container.innerHTML = '';
    const transferPlayers = transferSystem.getTransferMarketDisplay(20); // 20명 제한

    if (transferPlayers.length === 0) {
        container.innerHTML = '<p class="no-data">현재 이적 가능한 선수가 없습니다.</p>';
        return;
    }

    transferPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player';
        
        const teamInfo = player.originalTeam === "외부리그" ? 
            "외부리그" : teamNames[player.originalTeam];
        
        playerCard.innerHTML = `
            <div class="player-header">
                <div class="player-name">${player.name}</div>
                <div class="player-position-badge ${player.position.toLowerCase()}">${player.position}</div>
            </div>
            <div class="player-info">
                <div class="player-rating">능력치: <strong>${player.rating}</strong></div>
                <div class="player-age">나이: ${player.age}세</div>
                <div class="player-team">소속: ${teamInfo}</div>
                <div class="market-days">시장 ${player.daysOnMarket}일째</div>
            </div>
            <div class="transfer-price-section">
                <div class="transfer-price">${player.price}억</div>
                <button onclick="buyPlayer(${JSON.stringify(player).replace(/"/g, '&quot;')})" 
                        class="buy-btn ${gameData.teamMoney >= player.price ? '' : 'disabled'}"
                        ${gameData.teamMoney >= player.price ? '' : 'disabled'}>
                    ${gameData.teamMoney >= player.price ? '영입하기' : '자금부족'}
                </button>
            </div>
        `;
        
        container.appendChild(playerCard);
    });
}

// 내 팀 선수 표시
function displayMyTeamPlayers() {
    const container = document.getElementById('myTeamPlayers');
    if (!container) return;
    
    container.innerHTML = '';
    const myPlayers = transferSystem.getMyTeamPlayers();

    if (myPlayers.length === 0) {
        container.innerHTML = '<p class="no-data">팀에 선수가 없습니다.</p>';
        return;
    }

    myPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'my-team-player';
        
        playerCard.innerHTML = `
            <div class="player-header">
                <div class="player-name">${player.name}</div>
                <div class="player-position-badge ${player.position.toLowerCase()}">${player.position}</div>
            </div>
            <div class="player-info">
                <div class="player-rating">능력치: <strong>${player.rating}</strong></div>
                <div class="player-age">나이: ${player.age}세</div>
                <div class="estimated-price">예상 판매가: ${player.estimatedPrice}억</div>
            </div>
            <div class="player-actions">
                <button onclick="showPlayerGrowthDetails('${player.name}')" class="details-btn">
                    상세정보
                </button>
                <button onclick="releasePlayer(${JSON.stringify(player).replace(/"/g, '&quot;')})" class="release-btn">
                    방출하기
                </button>
            </div>
        `;
        
        container.appendChild(playerCard);
    });
}

// 선수 구매
function buyPlayer(player) {
    if (gameData.teamMoney < player.price) {
        alert('자금이 부족합니다!');
        return;
    }

    if (teams[gameData.selectedTeam].length >= 30) {
        alert('팀 인원이 가득 찼습니다! (최대 30명)');
        return;
    }

    const confirmMessage = `${player.name}을(를) ${player.price}억에 영입하시겠습니까?\n\n` +
                          `포지션: ${player.position}\n` +
                          `능력치: ${player.rating}\n` +
                          `나이: ${player.age}세`;

    if (confirm(confirmMessage)) {
        const result = transferSystem.signPlayer(player);
        
        if (result.success) {
            alert(result.message);
            displayTransferPlayers();
            displayMyTeamPlayers();
            updateLobbyDisplay();
            
            // 성장 시스템에 새 선수 추가
            if (result.player.age <= 25 && typeof playerGrowthSystem !== 'undefined') {
                playerGrowthSystem.initializePlayerGrowth();
            }
        } else {
            alert(result.message);
        }
    }
}

// 선수 방출
function releasePlayer(player) {
    const confirmMessage = `${player.name}을(를) 정말 방출하시겠습니까?\n\n` +
                          `예상 받을 수 있는 금액: ${player.estimatedPrice}억\n` +
                          `(자유계약으로 방출하면 0억)`;

    const choice = confirm(confirmMessage + '\n\n확인: 자유계약 방출, 취소: 돌아가기');
    
    if (choice) {
        const result = transferSystem.releasePlayer(player, 0);
        
        if (result.success) {
            alert(result.message);
            displayTransferPlayers();
            displayMyTeamPlayers();
            updateLobbyDisplay();
            
            // 스쿼드 화면 업데이트
            if (typeof updateFormationDisplay === 'function') {
                updateFormationDisplay();
            }
        } else {
            alert(result.message);
        }
    }
}

// 선수 검색
function searchPlayers() {
    const filters = {
        name: document.getElementById('nameSearch').value,
        position: document.getElementById('positionFilter').value,
        minRating: parseInt(document.getElementById('minRating').value) || 0,
        maxAge: parseInt(document.getElementById('maxAge').value) || 999,
        maxPrice: parseInt(document.getElementById('maxPrice').value) || 999999
    };

    const container = document.getElementById('transferPlayers');
    container.innerHTML = '';

    const filteredPlayers = transferSystem.searchPlayers(filters);

    if (filteredPlayers.length === 0) {
        container.innerHTML = '<p class="no-data">검색 조건에 맞는 선수가 없습니다.</p>';
        return;
    }

    // 검색 결과도 20명으로 제한
    const limitedPlayers = filteredPlayers.slice(0, 20);

    limitedPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player';
        
        const teamInfo = player.originalTeam === "외부리그" ? 
            "외부리그" : teamNames[player.originalTeam];
        
        playerCard.innerHTML = `
            <div class="player-header">
                <div class="player-name">${player.name}</div>
                <div class="player-position-badge ${player.position.toLowerCase()}">${player.position}</div>
            </div>
            <div class="player-info">
                <div class="player-rating">능력치: <strong>${player.rating}</strong></div>
                <div class="player-age">나이: ${player.age}세</div>
                <div class="player-team">소속: ${teamInfo}</div>
                <div class="market-days">시장 ${player.daysOnMarket}일째</div>
            </div>
            <div class="transfer-price-section">
                <div class="transfer-price">${player.price}억</div>
                <button onclick="buyPlayer(${JSON.stringify(player).replace(/"/g, '&quot;')})" 
                        class="buy-btn ${gameData.teamMoney >= player.price ? '' : 'disabled'}"
                        ${gameData.teamMoney >= player.price ? '' : 'disabled'}>
                    ${gameData.teamMoney >= player.price ? '영입하기' : '자금부족'}
                </button>
            </div>
        `;
        
        container.appendChild(playerCard);
    });

    if (filteredPlayers.length > 20) {
        const moreInfo = document.createElement('div');
        moreInfo.className = 'search-info';
        moreInfo.innerHTML = `<p>검색 결과 ${filteredPlayers.length}명 중 상위 20명만 표시됩니다. 더 구체적인 검색을 해보세요.</p>`;
        container.appendChild(moreInfo);
    }
}

// 검색 초기화
function resetSearch() {
    document.getElementById('nameSearch').value = '';
    document.getElementById('positionFilter').value = '';
    document.getElementById('minRating').value = '';
    document.getElementById('maxAge').value = '';
    document.getElementById('maxPrice').value = '';
    displayTransferPlayers();
}

// 경기 후 이적 시장 업데이트
function updateTransferMarketPostMatch() {
    transferSystem.updateTransferMarket();
}

// 기존 경기 종료 함수에 이적 시장 업데이트 추가
const originalEndMatch2 = window.endMatch;
window.endMatch = function() {
    if (originalEndMatch2) {
        originalEndMatch2.call(this);
    }
    setTimeout(() => {
        updateTransferMarketPostMatch();
    }, 3000);
};

// 저장/불러오기에 이적 데이터 포함
const originalSaveGame2 = window.saveGame;
window.saveGame = function() {
    gameData.transferSystemData = transferSystem.getSaveData();
    if (originalSaveGame2) {
        originalSaveGame2.call(this);
    }
};

const originalLoadGame2 = window.loadGame;
window.loadGame = function() {
    if (originalLoadGame2) {
        originalLoadGame2.call(this);
    }
    if (gameData.transferSystemData) {
        transferSystem.loadSaveData(gameData.transferSystemData);
    }
};

// 게임 초기화 시 이적 시장 초기화
window.addEventListener('load', () => {
    setTimeout(() => {
        initializeTransferMarket();
    }, 1000);
});
