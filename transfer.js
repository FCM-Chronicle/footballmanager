// 이적 시스템
class TransferSystem {
    constructor() {
        this.transferMarket = [];
        this.aiTransferCooldown = 0;
        this.basePrice = 500; // 기본 가격 500억

        // 타 리그 선수들 (메시, 호날두 등)
        this.extraPlayers = [
            { name: "리오넬 메시", position: "FW", rating: 91, age: 37 },
            { name: "크리스티아누 호날두", position: "FW", rating: 88, age: 39 },
            { name: "네이마르", position: "FW", rating: 86, age: 32 },
            { name: "루이스 수아레스", position: "FW", rating: 84, age: 37 },
            { name: "세르히오 라모스", position: "DF", rating: 82, age: 38 },
            { name: "루카 모드리치", position: "MF", rating: 85, age: 39 },
            { name: "V.죄케레스", position: "FW", rating: 88, age: 26 },
            { name: "가레스 베일", position: "FW", rating: 83, age: 35 },
            { name: "조르지니오 바이날둠", position: "MF", rating: 84, age: 31 },
            { name: "카림 벤제마", position: "FW", rating: 89, age: 36 },
            { name: "로베르토 피르미뉴", position: "FW", rating: 82, age: 32 },
            { name: "파비뉴", position: "MF", rating: 84, age: 31 },
            { name: "사디오 마네", position: "FW", rating: 86, age: 32 },
            { name: "리야드 마레즈", position: "FW", rating: 85, age: 33 },
            { name: "웨슬리 스나이더", position: "MF", rating: 80, age: 40 },
            { name: "프랑크 리베리", position: "FW", rating: 78, age: 41 },
            { name: "아르연 로벤", position: "FW", rating: 79, age: 40 },
            { name: "즐라탄 이브라히모비치", position: "FW", rating: 82, age: 42 },
            { name: "디에고 고딘", position: "DF", rating: 81, age: 38 },
            { name: "에딘손 카바니", position: "FW", rating: 80, age: 37 }
        ];
    }

    // 이적 시장 초기화
    initializeTransferMarket() {
        this.transferMarket = [];
        
        // 다른 팀의 일부 선수들을 이적 시장에 추가
        Object.keys(teams).forEach(teamKey => {
            if (teamKey !== gameData.selectedTeam) {
                const teamPlayers = teams[teamKey];
                
                // 각 팀에서 15% 확률로 선수를 이적 시장에 내놓음
                teamPlayers.forEach(player => {
                    if (Math.random() < 0.15) {
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
            if (Math.random() < 0.7) { // 70% 확률로 시장에 등장
                this.transferMarket.push({
                    ...player,
                    originalTeam: "외부리그",
                    price: this.calculatePlayerPrice(player),
                    daysOnMarket: Math.floor(Math.random() * 30)
                });
            }
        });

        this.shuffleTransferMarket();
        console.log(`이적 시장 초기화 완료: ${this.transferMarket.length}명의 선수`);
    }

    // 선수 가격 계산
    calculatePlayerPrice(player) {
        let price = this.basePrice;
        
        // 능력치에 따른 가격 조정 (지수적 증가)
        const ratingMultiplier = Math.pow(player.rating / 70, 2.5);
        price *= ratingMultiplier;
        
        // 나이에 따른 가격 조정
        let ageMultiplier = 1;
        if (player.age <= 20) {
            ageMultiplier = 1.4; // 젊은 선수는 40% 비싸게
        } else if (player.age <= 25) {
            ageMultiplier = 1.2; // 25세 이하는 20% 비싸게
        } else if (player.age <= 30) {
            ageMultiplier = 1.0; // 30세 이하는 기본가
        } else if (player.age <= 35) {
            ageMultiplier = 0.7; // 35세 이하는 30% 싸게
        } else {
            ageMultiplier = 0.4; // 35세 이상은 60% 싸게
        }
        
        price *= ageMultiplier;
        
        // 포지션에 따른 가격 조정
        const positionMultiplier = {
            'GK': 1.0,
            'DF': 1.0,
            'MF': 1.1,
            'FW': 1.3 // 공격수가 가장 비쌈
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
        
        return filteredPlayers.sort((a, b) => b.rating - a.rating);
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

        // SNS에 이적 뉴스 추가
        if (typeof snsSystem !== 'undefined') {
            snsSystem.addTransferNews(player, gameData.selectedTeam, player.originalTeam, player.price);
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
        
        // 이적 시장에 추가 (자유이적인 경우)
        if (transferFee === 0) {
            this.transferMarket.push({
                ...player,
                originalTeam: gameData.selectedTeam,
                price: Math.round(this.calculatePlayerPrice(player) * 0.6), // 60% 가격으로
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
        
        if (this.aiTransferCooldown <= 0 && Math.random() < 0.25) { // 25% 확률로 AI 이적 발생
            this.processAITransfer();
            this.aiTransferCooldown = 3 + Math.floor(Math.random() * 5); // 3-7경기 후 다시 시도
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
        if (sellingTeamPlayers.length <= 18) return; // 최소 인원 유지
        
        // 낮은 능력치 선수나 나이가 많은 선수를 이적시킬 확률이 높음
        const transferCandidates = sellingTeamPlayers
            .filter(p => p.rating < 85 || p.age > 30)
            .sort((a, b) => (a.rating - b.rating) + (b.age - a.age));
        
        if (transferCandidates.length > 0 && Math.random() < 0.6) {
            const transferCandidate = transferCandidates[0];
            
            // 이적 실행
            const playerIndex = sellingTeamPlayers.findIndex(p => p === transferCandidate);
            sellingTeamPlayers.splice(playerIndex, 1);
            
            teams[buyingTeam].push(transferCandidate);
            
            const transferFee = this.calculatePlayerPrice(transferCandidate);
            
            console.log(`AI 이적: ${transferCandidate.name}이(가) ${teamNames[sellingTeam]}에서 ${teamNames[buyingTeam]}로 이적했습니다. (${transferFee}억)`);
            
            // SNS에 AI 이적 뉴스 추가
            if (typeof snsSystem !== 'undefined') {
                snsSystem.addTransferNews(transferCandidate, buyingTeam, sellingTeam, transferFee);
            }
        }
    }

    // 이적 시장 업데이트 (매경기)
    updateTransferMarket() {
        // 시장에 있는 선수들의 일수 증가
        this.transferMarket.forEach(player => {
            player.daysOnMarket++;
            
            // 30일 이상 시장에 있으면 가격 하락
            if (player.daysOnMarket > 30) {
                player.price = Math.round(player.price * 0.95);
            }
            
            // 60일 이상이면 시장에서 제거될 확률 (30%)
            if (player.daysOnMarket > 60 && Math.random() < 0.3) {
                player.daysOnMarket = -1; // 제거 표시
            }
        });
        
        // 제거 표시된 선수들 제거
        this.transferMarket = this.transferMarket.filter(player => player.daysOnMarket >= 0);
        
        // 새로운 선수 추가 (15% 확률)
        if (Math.random() < 0.15) {
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
        
        if (teamPlayers.length <= 18) return; // 최소 인원 유지
        
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
            
            console.log(`새로운 선수 시장 등장: ${randomPlayer.name} (${teamNames[randomTeam]})`);
        }
    }

    // 이적 시장 표시용 데이터 가져오기
    getTransferMarketDisplay(limit = 30) {
        return this.transferMarket
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
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
        if (saveData) {
            this.transferMarket = saveData.transferMarket || [];
            this.aiTransferCooldown = saveData.aiTransferCooldown || 0;
        }
    }
}

// 전역 이적 시스템 인스턴스
const transferSystem = new TransferSystem();

// 이적 시장 초기화
function initializeTransferMarket() {
    transferSystem.initializeTransferMarket();
}

// 이적 화면 로드
function loadTransferScreen() {
    displayTransferPlayers();
}

// 이적 가능 선수 표시
function displayTransferPlayers() {
    const container = document.getElementById('transferPlayers');
    if (!container) return;
    
    container.innerHTML = '';
    const transferPlayers = transferSystem.getTransferMarketDisplay();

    if (transferPlayers.length === 0) {
        container.innerHTML = '<p>현재 이적 가능한 선수가 없습니다.</p>';
        return;
    }

    transferPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player';
        
        const teamInfo = player.originalTeam === "외부리그" ? 
            "외부리그" : (teamNames[player.originalTeam] || player.originalTeam);
        
        playerCard.innerHTML = `
            <div class="transfer-player-header">
                <div class="player-name">${player.name}</div>
                <div class="player-position">${player.position}</div>
            </div>
            <div class="transfer-player-details">
                <div class="player-rating">능력치: ${player.rating}</div>
                <div class="player-age">나이: ${player.age}세</div>
                <div class="player-team">소속: ${teamInfo}</div>
                <div class="transfer-price">${player.price}억</div>
                <div class="market-days">시장 ${player.daysOnMarket}일째</div>
            </div>
            <button class="transfer-btn" onclick="attemptTransfer('${player.name}', '${player.originalTeam}')">
                영입하기
            </button>
        `;
        
        container.appendChild(playerCard);
    });
}

// 이적 시도
function attemptTransfer(playerName, originalTeam) {
    const player = transferSystem.transferMarket.find(p => 
        p.name === playerName && p.originalTeam === originalTeam
    );
    
    if (!player) {
        alert('선수를 찾을 수 없습니다.');
        return;
    }
    
    const result = transferSystem.signPlayer(player);
    
    if (result.success) {
        gameData.teamMoney = Math.max(0, gameData.teamMoney);
        updateGameUI();
        
        alert(result.message);
        displayTransferPlayers(); // 목록 새로고침
        
        // 성장 시스템에 새 선수 추가
        if (result.player.age <= 25 && typeof addPlayerToGrowthSystem === 'function') {
            addPlayerToGrowthSystem(result.player);
        }
    } else {
        alert(result.message);
    }
}

// 선수 검색
function searchPlayers() {
    const filters = {
        name: document.getElementById('nameSearch').value,
        position: document.getElementById('positionFilter').value,
        minRating: parseInt(document.getElementById('minRating').value) || 0,
        maxAge: parseInt(document.getElementById('maxAge').value) || 999
    };
    
    const container = document.getElementById('transferPlayers');
    if (!container) return;
    
    container.innerHTML = '';

    const filteredPlayers = transferSystem.searchPlayers(filters);

    if (filteredPlayers.length === 0) {
        container.innerHTML = '<p>검색 조건에 맞는 선수가 없습니다.</p>';
        return;
    }

    filteredPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'transfer-player';
        
        const teamInfo = player.originalTeam === "외부리그" ? 
            "외부리그" : (teamNames[player.originalTeam] || player.originalTeam);
        
        playerCard.innerHTML = `
            <div class="transfer-player-header">
                <div class="player-name">${player.name}</div>
                <div class="player-position">${player.position}</div>
            </div>
            <div class="transfer-player-details">
                <div class="player-rating">능력치: ${player.rating}</div>
                <div class="player-age">나이: ${player.age}세</div>
                <div class="player-team">소속: ${teamInfo}</div>
                <div class="transfer-price">${player.price}억</div>
                <div class="market-days">시장 ${player.daysOnMarket}일째</div>
            </div>
            <button class="transfer-btn" onclick="attemptTransfer('${player.name}', '${player.originalTeam}')">
                영입하기
            </button>
        `;
        
        container.appendChild(playerCard);
    });
}

// 경기 후 이적 시장 업데이트
function updateTransferMarketPostMatch() {
    transferSystem.updateTransferMarket();
}

// 선수 방출 인터페이스 (추후 구현)
function releasePlayerInterface(player) {
    const transferFee = Math.round(transferSystem.calculatePlayerPrice(player) * 0.5);
    const confirmRelease = confirm(`${player.name}을(를) 방출하시겠습니까?\n예상 이적료: ${transferFee}억`);
    
    if (confirmRelease) {
        const result = transferSystem.releasePlayer(player, transferFee);
        
        if (result.success) {
            gameData.teamMoney += transferFee;
            updateGameUI();
            alert(result.message);
            
            // 화면 새로고침
            if (typeof displayTeamPlayers === 'function') {
                displayTeamPlayers();
            }
            if (typeof updateFormationDisplay === 'function') {
                updateFormationDisplay();
            }
        } else {
            alert(result.message);
        }
    }
}

// 전역 함수로 노출
window.transferSystem = transferSystem;
window.initializeTransferMarket = initializeTransferMarket;
window.loadTransferScreen = loadTransferScreen;
window.displayTransferPlayers = displayTransferPlayers;
window.searchPlayers = searchPlayers;
window.updateTransferMarketPostMatch = updateTransferMarketPostMatch;
window.attemptTransfer = attemptTransfer;
window.releasePlayerInterface = releasePlayerInterface;
