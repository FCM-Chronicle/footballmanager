// 스폰서 데이터
const sponsors = [
    {
        name: "푸마",
        description: "빠르고 역동적인 스포츠 브랜드",
        payPerWin: 15,
        payPerLoss: 3,
        contractLength: 12,
        signingBonus: 80,
        requirements: { minRating: 70 }
    },
    {
        name: "나이키",
        description: "세계적인 스포츠 브랜드",
        payPerWin: 20,
        payPerLoss: 5,
        contractLength: 10,
        signingBonus: 100,
        requirements: { minRating: 75 }
    },
    {
        name: "뉴발란스",
        description: "전문성을 추구하는 스포츠 브랜드",
        payPerWin: 18,
        payPerLoss: 4,
        contractLength: 15,
        signingBonus: 120,
        requirements: { minRating: 78 }
    },
    {
        name: "아디다스",
        description: "독일의 프리미엄 스포츠 브랜드",
        payPerWin: 25,
        payPerLoss: 8,
        contractLength: 8,
        signingBonus: 150,
        requirements: { minRating: 80 }
    },
    {
        name: "넥센타이어",
        description: "한국의 타이어 브랜드",
        payPerWin: 30,
        payPerLoss: 10,
        contractLength: 6,
        signingBonus: 200,
        requirements: { minRating: 85 }
    },
    {
        name: "플라이 에미레이츠",
        description: "세계 최고의 항공사 중 하나",
        payPerWin: 40,
        payPerLoss: 15,
        contractLength: 5,
        signingBonus: 300,
        requirements: { minRating: 88 }
    },
    {
        name: "FIFA 공식 파트너십",
        description: "FIFA와의 독점 글로벌 파트너십",
        payPerWin: 50,
        payPerLoss: 20,
        contractLength: 4,
        signingBonus: 500,
        requirements: { minRating: 90 }
    }
];

// 리그 테이블 데이터
let leagueTable = {};

// 경기 결과와 통계
let matchStats = {
    totalGoals: 0,
    totalFouls: 0,
    totalPasses: 0,
    totalThrowins: 0,
    possession: 50
};

// 현재 선택된 포지션
let selectedPosition = null;
let selectedPositionIndex = null;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

// 게임 초기화
function initializeGame() {
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 팀 선택 화면에서 시작
    showScreen('teamSelection');
    
    // 리그 테이블 초기화
    initializeLeagueTable();
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 팀 선택
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('click', () => {
            const teamId = card.getAttribute('data-team');
            selectTeam(teamId);
        });
    });

    // 네비게이션 탭
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const screen = tab.getAttribute('data-screen');
            showScreen(screen);
            
            // 활성 탭 표시
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // 경기 시작 버튼
    document.getElementById('playMatchBtn').addEventListener('click', startMatch);
    document.getElementById('startMatchBtn').addEventListener('click', startMatchSimulation);

    // 전술 카드 클릭
    const tacticCards = document.querySelectorAll('.tactic-card');
    tacticCards.forEach(card => {
        card.addEventListener('click', () => {
            const tactic = card.getAttribute('data-tactic');
            selectTactic(tactic);
        });
    });

    // 포지션 필터
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterPlayers(filter);
            
            // 활성 필터 표시
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// 팀 선택
function selectTeam(teamId) {
    gameData.selectedTeam = teamId;
    
    // UI 업데이트
    document.getElementById('teamName').textContent = teamNames[teamId];
    updateGameUI();
    
    // 선수 성장 시스템 초기화
    if (typeof playerGrowthSystem !== 'undefined') {
        playerGrowthSystem.initializePlayerGrowth();
    }
    
    // 이적 시장 초기화
    if (typeof transferSystem !== 'undefined') {
        transferSystem.initializeTransferMarket();
    }
    
    // 메인 게임 화면으로 이동
    showScreen('gameInterface');
    showScreen('lobby');
    
    // 스쿼드 초기화
    initializeSquad();
    
    // 다음 상대 설정
    setNextOpponent();
}

// 화면 표시
function showScreen(screenId) {
    // 모든 화면 숨기기
    const allScreens = document.querySelectorAll('.screen, .game-screen');
    allScreens.forEach(screen => screen.classList.remove('active'));
    
    // 선택된 화면 표시
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // 특정 화면에 대한 추가 처리
        switch(screenId) {
            case 'squad':
                displayTeamPlayers();
                updateFormationDisplay();
                break;
            case 'transfer':
                displayTransferPlayers();
                break;
            case 'league':
                updateLeagueTable();
                updateTopScorers();
                break;
            case 'sponsors':
                displaySponsors();
                break;
            case 'sns':
                displayNewsFeed();
                break;
            case 'tactics':
                updateTacticsDisplay();
                break;
        }
    }
}

// 게임 UI 업데이트
function updateGameUI() {
    document.getElementById('teamMoney').textContent = gameData.teamMoney;
    document.getElementById('teamMorale').textContent = gameData.teamMorale;
    document.getElementById('currentMatchday').textContent = gameData.currentMatchday;
    document.getElementById('matchesPlayed').textContent = gameData.matchesPlayed;
    document.getElementById('wins').textContent = gameData.wins;
    document.getElementById('draws').textContent = gameData.draws;
    document.getElementById('losses').textContent = gameData.losses;
    document.getElementById('goalsFor').textContent = gameData.goalsFor;
    document.getElementById('goalsAgainst').textContent = gameData.goalsAgainst;
    document.getElementById('points').textContent = gameData.points;
    
    // 팀 레이팅 계산 및 표시
    const teamRating = calculateTeamRating();
    document.getElementById('teamOverallRating').textContent = teamRating;
    
    // 현재 스폰서 정보
    if (gameData.currentSponsor) {
        document.getElementById('sponsorName').textContent = gameData.currentSponsor.name;
        document.getElementById('sponsorWinBonus').textContent = gameData.currentSponsor.payPerWin;
    }
}

// 팀 레이팅 계산
function calculateTeamRating() {
    if (!gameData.selectedTeam) return 75;
    
    const teamPlayers = teams[gameData.selectedTeam];
    const totalRating = teamPlayers.reduce((sum, player) => sum + player.rating, 0);
    return Math.round(totalRating / teamPlayers.length);
}

// 스쿼드 초기화
function initializeSquad() {
    // 기본 스쿼드 설정 (능력치 높은 선수들로 자동 배치)
    if (!gameData.selectedTeam) return;
    
    const teamPlayers = teams[gameData.selectedTeam];
    
    // 포지션별로 선수 분류
    const gks = teamPlayers.filter(p => p.position === 'GK').sort((a, b) => b.rating - a.rating);
    const dfs = teamPlayers.filter(p => p.position === 'DF').sort((a, b) => b.rating - a.rating);
    const mfs = teamPlayers.filter(p => p.position === 'MF').sort((a, b) => b.rating - a.rating);
    const fws = teamPlayers.filter(p => p.position === 'FW').sort((a, b) => b.rating - a.rating);
    
    // 최고 능력치 선수들로 스쿼드 구성
    gameData.squad.gk = gks[0] || null;
    gameData.squad.df = [dfs[0], dfs[1], dfs[2], dfs[3]].filter(p => p);
    gameData.squad.mf = [mfs[0], mfs[1], mfs[2]].filter(p => p);
    gameData.squad.fw = [fws[0], fws[1], fws[2]].filter(p => p);
    
    // 부족한 포지션은 null로 유지
    while (gameData.squad.df.length < 4) gameData.squad.df.push(null);
    while (gameData.squad.mf.length < 3) gameData.squad.mf.push(null);
    while (gameData.squad.fw.length < 3) gameData.squad.fw.push(null);
}

// 선수 목록 표시
function displayTeamPlayers() {
    if (!gameData.selectedTeam) return;
    
    const playersList = document.getElementById('playersList');
    const teamPlayers = teams[gameData.selectedTeam];
    
    playersList.innerHTML = '';
    
    teamPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-item';
        playerCard.innerHTML = `
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-details">
                    <span class="position">${player.position}</span>
                    <span class="rating">${player.rating}</span>
                    <span class="age">${player.age}세</span>
                </div>
            </div>
        `;
        
        playerCard.addEventListener('click', () => {
            if (selectedPosition && selectedPositionIndex !== null) {
                assignPlayerToPosition(player);
            }
        });
        
        playersList.appendChild(playerCard);
    });
}

// 포메이션 디스플레이 업데이트
function updateFormationDisplay() {
    // GK 업데이트
    updatePositionSlot('gk', 0, gameData.squad.gk);
    
    // DF 업데이트
    for (let i = 0; i < 4; i++) {
        updatePositionSlot('df', i, gameData.squad.df[i]);
    }
    
    // MF 업데이트
    for (let i = 0; i < 3; i++) {
        updatePositionSlot('mf', i, gameData.squad.mf[i]);
    }
    
    // FW 업데이트
    for (let i = 0; i < 3; i++) {
        updatePositionSlot('fw', i, gameData.squad.fw[i]);
    }
}

// 포지션 슬롯 업데이트
function updatePositionSlot(position, index, player) {
    const slot = document.querySelector(`[data-position="${position}"][data-index="${index}"]`);
    if (!slot) return;
    
    const playerCard = slot.querySelector('.player-card');
    
    if (player) {
        playerCard.classList.remove('empty');
        playerCard.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-rating">${player.rating}</div>
        `;
    } else {
        playerCard.classList.add('empty');
        playerCard.innerHTML = `<span>${position.toUpperCase()}</span>`;
    }
}

// 포지션 선택
function selectPlayerForPosition(position, index) {
    selectedPosition = position;
    selectedPositionIndex = index;
    
    // 모든 포지션 슬롯에서 선택 표시 제거
    document.querySelectorAll('.position-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // 선택된 포지션 표시
    const selectedSlot = document.querySelector(`[data-position="${position}"][data-index="${index}"]`);
    if (selectedSlot) {
        selectedSlot.classList.add('selected');
    }
}

// 선수를 포지션에 배치
function assignPlayerToPosition(player) {
    if (!selectedPosition || selectedPositionIndex === null) return;
    
    // 포지션 호환성 확인
    if (!isPlayerCompatible(player, selectedPosition)) {
        alert('이 선수는 해당 포지션에 적합하지 않습니다!');
        return;
    }
    
    // 선수 배치
    if (selectedPosition === 'gk') {
        gameData.squad.gk = player;
    } else {
        gameData.squad[selectedPosition][selectedPositionIndex] = player;
    }
    
    // 디스플레이 업데이트
    updateFormationDisplay();
    
    // 선택 해제
    selectedPosition = null;
    selectedPositionIndex = null;
    
    document.querySelectorAll('.position-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
}

// 선수 포지션 호환성 확인
function isPlayerCompatible(player, position) {
    const compatibility = {
        'gk': ['GK'],
        'df': ['DF', 'MF'],  // 미드필더도 수비 가능
        'mf': ['MF', 'DF', 'FW'],  // 미드필더는 다양한 포지션 가능
        'fw': ['FW', 'MF']  // 미드필더도 공격 가능
    };
    
    return compatibility[position].includes(player.position);
}

// 선수 필터링
function filterPlayers(filter) {
    if (!gameData.selectedTeam) return;
    
    const playersList = document.getElementById('playersList');
    const teamPlayers = teams[gameData.selectedTeam];
    
    const filteredPlayers = filter === 'all' ? 
        teamPlayers : 
        teamPlayers.filter(player => player.position === filter);
    
    playersList.innerHTML = '';
    
    filteredPlayers.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-item';
        playerCard.innerHTML = `
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-details">
                    <span class="position">${player.position}</span>
                    <span class="rating">${player.rating}</span>
                    <span class="age">${player.age}세</span>
                </div>
            </div>
        `;
        
        playerCard.addEventListener('click', () => {
            if (selectedPosition && selectedPositionIndex !== null) {
                assignPlayerToPosition(player);
            }
        });
        
        playersList.appendChild(playerCard);
    });
}

// 리그 테이블 초기화
function initializeLeagueTable() {
    Object.keys(teamNames).forEach(teamId => {
        leagueTable[teamId] = {
            name: teamNames[teamId],
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0
        };
    });
}

// 다음 상대 설정
function setNextOpponent() {
    const allTeams = Object.keys(teamNames).filter(team => team !== gameData.selectedTeam);
    const nextOpponent = allTeams[gameData.currentMatchday - 1] || allTeams[0];
    
    document.getElementById('nextOpponent').textContent = teamNames[nextOpponent];
    document.getElementById('nextVenue').textContent = Math.random() > 0.5 ? '홈' : '원정';
}

// 경기 시작
function startMatch() {
    showScreen('match');
    
    // 상대팀 설정
    const allTeams = Object.keys(teamNames).filter(team => team !== gameData.selectedTeam);
    const opponent = allTeams[gameData.currentMatchday - 1] || allTeams[0];
    
    document.getElementById('homeTeam').textContent = teamNames[gameData.selectedTeam];
    document.getElementById('awayTeam').textContent = teamNames[opponent];
    
    // 경기 준비
    setupMatch(opponent);
}

// 경기 설정
function setupMatch(opponent) {
    // 경기 데이터 초기화
    matchStats = {
        totalGoals: 0,
        totalFouls: 0,
        totalPasses: 0,
        totalThrowins: 0,
        possession: 50,
        homeScore: 0,
        awayScore: 0,
        minute: 0,
        events: []
    };
    
    // UI 초기화
    document.getElementById('homeScore').textContent = '0';
    document.getElementById('awayScore').textContent = '0';
    document.getElementById('currentTime').textContent = '0';
    document.getElementById('matchProgress').style.width = '0%';
    document.getElementById('matchEvents').innerHTML = '';
}

// 경기 시뮬레이션 시작
function startMatchSimulation() {
    const startBtn = document.getElementById('startMatchBtn');
    const pauseBtn = document.getElementById('pauseMatchBtn');
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    // 경기 시뮬레이션 실행
    runMatchSimulation();
}

// 경기 시뮬레이션 실행 (개선된 버전)
function runMatchSimulation() {
    const allTeams = Object.keys(teamNames).filter(team => team !== gameData.selectedTeam);
    const opponent = allTeams[(gameData.currentMatchday - 1) % allTeams.length];
    
    // 전술 효과 적용
    if (typeof tacticSystem !== 'undefined') {
        const tacticEffect = tacticSystem.applyTacticToMatch(gameData.currentTactic, opponent);
        matchStats.tacticEffect = tacticEffect;
    }
    
    const matchInterval = setInterval(() => {
        matchStats.minute++;
        
        // 시간 업데이트
        document.getElementById('currentTime').textContent = matchStats.minute;
        document.getElementById('matchProgress').style.width = `${(matchStats.minute / 90) * 100}%`;
        
        // 이벤트 발생 확인 (개선된 버전)
        processEnhancedMatchEvents();
        
        // 90분 완료
        if (matchStats.minute >= 90) {
            clearInterval(matchInterval);
            const homeScore = matchStats.homeScore;
            const awayScore = matchStats.awayScore;
            
            // 경기 종료 처리
            endMatch();
            
            // 추가 업데이트
            if (typeof postMatchUpdates === 'function') {
                postMatchUpdates(gameData.selectedTeam, opponent, homeScore, awayScore);
            }
        }
    }, 1000); // 1초마다 1분씩
}

// 향상된 경기 이벤트 처리
function processEnhancedMatchEvents() {
    const eventRoll = Math.random() * 100;
    
    // 전술 효과에 따른 확률 조정
    let goalProbability = 5;
    if (matchStats.tacticEffect) {
        const isPlayerTeamAttacking = Math.random() > 0.5;
        const tacticModifier = isPlayerTeamAttacking ? 
            matchStats.tacticEffect.playerBonus : 
            matchStats.tacticEffect.opponentBonus;
        goalProbability *= tacticModifier;
    }
    
    if (eventRoll < goalProbability) { // 골
        processEnhancedGoalEvent();
    } else if (eventRoll < goalProbability + 5) { // 파울
        processFoulEvent();
    } else if (eventRoll < goalProbability + 85) { // 패스 (80%)
        processPassEvent();
    } else if (eventRoll < goalProbability + 89) { // 스로인
        processThrowinEvent();
    } else if (eventRoll < goalProbability + 92) { // 골킥
        processGoalkickEvent();
    } else { // 코너킥
        processCornerEvent();
    }
}

// 향상된 골 이벤트 처리
function processEnhancedGoalEvent() {
    const isHomeGoal = Math.random() > 0.5;
    const team = isHomeGoal ? gameData.selectedTeam : 'opponent';
    
    // 득점 선수 선택 (포지션별 확률 적용)
    let scorer;
    const positionRoll = Math.random() * 100;
    
    if (positionRoll < 70) { // 70% FW
        scorer = getRandomPlayerByPosition('FW');
    } else if (positionRoll < 90) { // 20% MF
        scorer = getRandomPlayerByPosition('MF');
    } else { // 10% DF
        scorer = getRandomPlayerByPosition('DF');
    }
    
    // 상대팀 득점인 경우 가상의 선수 생성
    if (!isHomeGoal) {
        const allTeams = Object.keys(teamNames).filter(team => team !== gameData.selectedTeam);
        const opponentTeam = allTeams[(gameData.currentMatchday - 1) % allTeams.length];
        scorer = getRandomTeamPlayer(opponentTeam);
    }
    
    // 어시스트 (80% 확률)
    let assist = null;
    if (Math.random() < 0.8) {
        if (isHomeGoal) {
            assist = getRandomPlayerExcept(scorer);
        } else {
            const allTeams = Object.keys(teamNames).filter(team => team !== gameData.selectedTeam);
            const opponentTeam = allTeams[(gameData.currentMatchday - 1) % allTeams.length];
            assist = getRandomTeamPlayerExcept(opponentTeam, scorer);
        }
    }
    
    // 점수 업데이트
    if (isHomeGoal) {
        matchStats.homeScore++;
        document.getElementById('homeScore').textContent = matchStats.homeScore;
        gameData.goalsFor++;
    } else {
        matchStats.awayScore++;
        document.getElementById('awayScore').textContent = matchStats.awayScore;
        gameData.goalsAgainst++;
    }
    
    // 이벤트 표시
    const eventText = createEnhancedGoalEventText(scorer, assist, isHomeGoal);
    addMatchEvent('goal', eventText);
    
    // 통계 업데이트 (내 팀 선수만)
    if (isHomeGoal && scorer) {
        updatePlayerStats(scorer.name, 'goals', 1);
        if (assist) {
            updatePlayerStats(assist.name, 'assists', 1);
        }
    }
}

// 향상된 골 이벤트 텍스트 생성
function createEnhancedGoalEventText(scorer, assist, isHomeGoal) {
    const goalTexts = [
        `⚽ ${scorer.name}의 환상적인 마무리!`,
        `⚽ ${scorer.name}이 골망을 흔듭니다!`,
        `⚽ ${scorer.name}의 완벽한 슈팅!`,
        `⚽ ${scorer.name}이 결정적인 골을 넣었습니다!`,
        `⚽ ${scorer.name}의 예술적인 골!`,
        `⚽ ${scorer.name}이 골키퍼를 완전히 따돌렸습니다!`,
        `⚽ ${scorer.name}의 침착한 마무리!`,
        `⚽ ${scorer.name}이 완벽한 타이밍에 골을 넣었습니다!`,
        `⚽ ${scorer.name}의 강력한 슈팅이 골대를 강타합니다!`,
        `⚽ ${scorer.name}이 수비수들을 제치고 골을 성공시켰습니다!`,
        `⚽ ${scorer.name}의 번개같은 반응!`,
        `⚽ ${scorer.name}이 기막힌 골을 터뜨렸습니다!`,
        `⚽ ${scorer.name}의 절묘한 위치 선정!`,
        `⚽ ${scorer.name}이 골키퍼의 허를 찔렀습니다!`,
        `⚽ ${scorer.name}의 환상적인 드리블 돌파 후 골!`
    ];
    
    const assistTexts = [
        `${assist.name}과 ${scorer.name}의 환상적인 연계플레이!`,
        `${assist.name}의 완벽한 패스로 ${scorer.name}이 골을 넣었습니다!`,
        `${assist.name}의 절묘한 어시스트!`,
        `${assist.name}과 ${scorer.name}의 멋진 콤비네이션!`,
        `${assist.name}의 정교한 패스가 ${scorer.name}에게 전달됩니다!`,
        `${assist.name}의 창의적인 플레이로 ${scorer.name}이 골을 성공!`,
        `${assist.name}과 ${scorer.name}의 완벽한 호흡!`,
        `${assist.name}의 킬패스를 받은 ${scorer.name}이 골!`,
        `${assist.name}의 정확한 크로스를 ${scorer.name}이 헤더골로 연결!`,
        `${assist.name}의 스루패스를 놓치지 않은 ${scorer.name}!`,
        `${assist.name}과 ${scorer.name}의 원터치 플레이!`,
        `${assist.name}의 환상적인 시야로 만들어진 골!`,
        `${assist.name}의 예술적인 백힐패스를 ${scorer.name}이 마무리!`,
        `${assist.name}과 ${scorer.name}의 교과서적인 연계!`,
        `${assist.name}의 발목 패스를 ${scorer.name}이 완벽하게 연결!`
    ];
    
    let eventText = goalTexts[Math.floor(Math.random() * goalTexts.length)];
    
    if (assist) {
        eventText = assistTexts[Math.floor(Math.random() * assistTexts.length)];
    }
    
    return eventText;
}

// 스폰서 시스템 통합
function integrateSponsorsWithMatch() {
    // 경기 후 스폰서 계약 기간 감소
    if (gameData.currentSponsor && gameData.currentSponsor.remainingMatches > 0) {
        gameData.currentSponsor.remainingMatches--;
        
        if (gameData.currentSponsor.remainingMatches === 0) {
            setTimeout(() => {
                alert(`${gameData.currentSponsor.name}와의 계약이 만료되었습니다.`);
                gameData.currentSponsor = null;
                updateGameUI();
            }, 3000);
        }
    }
}

// 시즌 진행 체크
function checkSeasonProgress() {
    // 모든 팀이 36경기를 완료했는지 확인
    const allTeamsCompleted = Object.values(leagueTable).every(team => team.played >= 36);
    
    if (allTeamsCompleted) {
        // 시즌 종료 SNS 뉴스 추가
        if (typeof addSeasonEndNews === 'function') {
            addSeasonEndNews();
        }
        
        endSeason();
    }
}

// 게임 저장 시 모든 시스템 데이터 포함
function enhancedSaveGame() {
    const saveData = {
        gameData: gameData,
        leagueTable: leagueTable,
        matchStats: matchStats,
        playerStats: Array.from(gameData.playerStats.entries())
    };
    
    // 각 시스템의 저장 데이터 추가
    if (typeof playerGrowthSystem !== 'undefined') {
        saveData.playerGrowthData = playerGrowthSystem.getSaveData();
    }
    
    if (typeof transferSystem !== 'undefined') {
        saveData.transferSystemData = transferSystem.getSaveData();
    }
    
    if (typeof tacticSystem !== 'undefined') {
        saveData.tacticSystemData = tacticSystem.getSaveData();
    }
    
    if (typeof snsSystem !== 'undefined') {
        saveData.snsSystemData = snsSystem.getSaveData();
    }
    
    const dataStr = JSON.stringify(saveData);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    
    const teamName = teamNames[gameData.selectedTeam] || 'Unknown';
    const date = new Date().toISOString().slice(0, 10);
    link.download = `${teamName}_${date}.json`;
    
    link.click();
}

// 게임 불러오기 시 모든 시스템 데이터 복원
function enhancedLoadGame(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const saveData = JSON.parse(e.target.result);
            
            gameData = saveData.gameData;
            leagueTable = saveData.leagueTable;
            matchStats = saveData.matchStats;
            
            if (saveData.playerStats) {
                gameData.playerStats = new Map(saveData.playerStats);
            }
            
            // 각 시스템의 데이터 복원
            if (saveData.playerGrowthData && typeof playerGrowthSystem !== 'undefined') {
                playerGrowthSystem.loadSaveData(saveData.playerGrowthData);
            }
            
            if (saveData.transferSystemData && typeof transferSystem !== 'undefined') {
                transferSystem.loadSaveData(saveData.transferSystemData);
            }
            
            if (saveData.tacticSystemData && typeof tacticSystem !== 'undefined') {
                tacticSystem.loadSaveData(saveData.tacticSystemData);
            }
            
            if (saveData.snsSystemData && typeof snsSystem !== 'undefined') {
                snsSystem.loadSaveData(saveData.snsSystemData);
            }
            
            // UI 업데이트
            updateGameUI();
            showScreen('gameInterface');
            showScreen('lobby');
            
            // 환영 뉴스가 없다면 추가
            if (typeof snsSystem !== 'undefined' && snsSystem.newsFeed.length === 0) {
                addWelcomeNews();
            }
            
            alert('게임을 성공적으로 불러왔습니다!');
            
        } catch (error) {
            alert('저장 파일을 불러오는데 실패했습니다.');
            console.error('Load error:', error);
        }
    };
    
    reader.readAsText(file);
}

// 경기 종료 함수 개선
function enhancedEndMatch() {
    // 기존 endMatch 로직
    const homeScore = matchStats.homeScore;
    const awayScore = matchStats.awayScore;
    
    if (homeScore > awayScore) {
        gameData.wins++;
        gameData.points += 3;
        processSponsorBonus(true);
    } else if (homeScore < awayScore) {
        gameData.losses++;
        processSponsorBonus(false);
    } else {
        gameData.draws++;
        gameData.points += 1;
    }
    
    gameData.matchesPlayed++;
    gameData.currentMatchday++;
    
    // UI 업데이트
    updateGameUI();
    
    // 리그 테이블 업데이트
    updateOwnTeamInLeague();
    simulateOtherMatches();
    
    // 시스템 통합 업데이트
    integrateSponsorsWithMatch();
    
    // 시즌 진행 체크
    checkSeasonProgress();
    
    // 인터뷰 모달 표시
    setTimeout(() => {
        showInterviewModal(homeScore, awayScore);
    }, 2000);
    
    // 선수 성장 처리
    if (typeof processPostMatchGrowth === 'function') {
        processPostMatchGrowth();
    }
    
    // 이적 시장 업데이트
    if (typeof updateTransferMarketPostMatch === 'function') {
        updateTransferMarketPostMatch();
    }
    
    // 경기 버튼 상태 복원
    document.getElementById('startMatchBtn').disabled = false;
    document.getElementById('pauseMatchBtn').disabled = true;
    
    console.log('경기 종료:', homeScore, '-', awayScore);
}

// 시즌 종료 함수 개선
function enhancedEndSeason() {
    // 최종 순위 계산
    const finalPosition = calculateFinalPosition();
    
    // 시즌 보상
    let seasonBonus = 0;
    if (finalPosition === 1) {
        seasonBonus = 500; // 우승
        alert('🏆 축하합니다! 리그 우승을 차지했습니다!');
    } else if (finalPosition <= 4) {
        seasonBonus = 300; // 상위권
        alert('🥉 훌륭합니다! 상위권 진출에 성공했습니다!');
    } else if (finalPosition <= 12) {
        seasonBonus = 150; // 중위권
        alert('📊 중위권 성적을 기록했습니다.');
    } else {
        seasonBonus = 50; // 강등권
        alert('⚠️ 아쉬운 시즌이었습니다. 다음 시즌에는 더 좋은 결과를 기대합니다.');
    }
    
    gameData.teamMoney += seasonBonus;
    
    // 시즌 종료 SNS 뉴스
    if (typeof addSeasonEndNews === 'function') {
        addSeasonEndNews();
    }
    
    // 시즌 초기화
    gameData.currentSeason++;
    gameData.currentMatchday = 1;
    gameData.matchesPlayed = 0;
    gameData.wins = 0;
    gameData.draws = 0;
    gameData.losses = 0;
    gameData.goalsFor = 0;
    gameData.goalsAgainst = 0;
    gameData.points = 0;
    
    // 리그 테이블 초기화
    initializeLeagueTable();
    
    // 선수 나이 증가
    if (typeof advancePlayerAges === 'function') {
        advancePlayerAges();
    }
    
    updateGameUI();
    setNextOpponent();
}

// 팀 선택 후 모든 시스템 초기화
function initializeAllSystems(teamId) {
    gameData.selectedTeam = teamId;
    
    // UI 업데이트
    document.getElementById('teamName').textContent = teamNames[teamId];
    updateGameUI();
    
    // 모든 시스템 초기화
    if (typeof playerGrowthSystem !== 'undefined') {
        playerGrowthSystem.initializePlayerGrowth();
    }
    
    if (typeof transferSystem !== 'undefined') {
        transferSystem.initializeTransferMarket();
    }
    
    if (typeof snsSystem !== 'undefined') {
        addWelcomeNews();
    }
    
    // 메인 게임 화면으로 이동
    showScreen('gameInterface');
    showScreen('lobby');
    
    // 스쿼드 초기화
    initializeSquad();
    
    // 다음 상대 설정
    setNextOpponent();
    
    console.log(`${teamNames[teamId]} 선택 완료. 모든 시스템 초기화됨.`);
}

// 기존 함수들을 향상된 버전으로 교체
window.saveGame = enhancedSaveGame;
window.loadGame = enhancedLoadGame;
window.endMatch = enhancedEndMatch;
window.endSeason = enhancedEndSeason;
window.runMatchSimulation = runMatchSimulation;
window.initializeAllSystems = initializeAllSystems;

// 경기 이벤트 처리
function processMatchEvents() {
    const eventRoll = Math.random() * 100;
    
    if (eventRoll < 5) { // 5% 골
        processGoalEvent();
    } else if (eventRoll < 10) { // 5% 파울
        processFoulEvent();
    } else if (eventRoll < 90) { // 80% 패스
        processPassEvent();
    } else if (eventRoll < 94) { // 4% 스로인
        processThrowinEvent();
    } else if (eventRoll < 97) { // 3% 골킥
        processGoalkickEvent();
    } else { // 3% 코너킥
        processCornerEvent();
    }
}

// 골 이벤트 처리
function processGoalEvent() {
    const isHomeGoal = Math.random() > 0.5;
    const team = isHomeGoal ? gameData.selectedTeam : 'opponent';
    
    // 득점 선수 선택 (포지션별 확률 적용)
    let scorer;
    const positionRoll = Math.random() * 100;
    
    if (positionRoll < 70) { // 70% FW
        scorer = getRandomPlayerByPosition('FW');
    } else if (positionRoll < 90) { // 20% MF
        scorer = getRandomPlayerByPosition('MF');
    } else { // 10% DF
        scorer = getRandomPlayerByPosition('DF');
    }
    
    // 어시스트 (80% 확률)
    let assist = null;
    if (Math.random() < 0.8) {
        assist = getRandomPlayerExcept(scorer);
    }
    
    // 점수 업데이트
    if (isHomeGoal) {
        matchStats.homeScore++;
        document.getElementById('homeScore').textContent = matchStats.homeScore;
        gameData.goalsFor++;
    } else {
        matchStats.awayScore++;
        document.getElementById('awayScore').textContent = matchStats.awayScore;
        gameData.goalsAgainst++;
    }
    
    // 이벤트 표시
    const eventText = createGoalEventText(scorer, assist, isHomeGoal);
    addMatchEvent('goal', eventText);
    
    // 통계 업데이트
    if (scorer) {
        updatePlayerStats(scorer.name, 'goals', 1);
    }
    if (assist) {
        updatePlayerStats(assist.name, 'assists', 1);
    }
}

// 골 이벤트 텍스트 생성
function createGoalEventText(scorer, assist, isHomeGoal) {
    const goalTexts = [
        `⚽ ${scorer.name}의 환상적인 마무리!`,
        `⚽ ${scorer.name}이 골망을 흔듭니다!`,
        `⚽ ${scorer.name}의 완벽한 슈팅!`,
        `⚽ ${scorer.name}이 결정적인 골을 넣었습니다!`,
        `⚽ ${scorer.name}의 예술적인 골!`,
        `⚽ ${scorer.name}이 골키퍼를 완전히 따돌렸습니다!`,
        `⚽ ${scorer.name}의 침착한 마무리!`,
        `⚽ ${scorer.name}이 완벽한 타이밍에 골을 넣었습니다!`,
        `⚽ ${scorer.name}의 강력한 슈팅이 골대를 강타합니다!`,
        `⚽ ${scorer.name}이 수비수들을 제치고 골을 성공시켰습니다!`
    ];
    
    const assistTexts = [
        `${assist.name}과 ${scorer.name}의 환상적인 연계플레이!`,
        `${assist.name}의 완벽한 패스로 ${scorer.name}이 골을 넣었습니다!`,
        `${assist.name}의 절묘한 어시스트!`,
        `${assist.name}과 ${scorer.name}의 멋진 콤비네이션!`,
        `${assist.name}의 정교한 패스가 ${scorer.name}에게 전달됩니다!`
    ];
    
    let eventText = goalTexts[Math.floor(Math.random() * goalTexts.length)];
    
    if (assist) {
        eventText = assistTexts[Math.floor(Math.random() * assistTexts.length)];
    }
    
    return eventText;
}

// 다른 이벤트 처리 함수들
function processFoulEvent() {
    matchStats.totalFouls++;
    const foulTexts = [
        "🟨 파울이 선언되었습니다",
        "🟨 거친 태클로 인한 파울",
        "🟨 심판이 휘슬을 불었습니다",
        "🟨 반칙으로 경기가 잠시 중단됩니다"
    ];
    addMatchEvent('foul', foulTexts[Math.floor(Math.random() * foulTexts.length)]);
}

function processPassEvent() {
    matchStats.totalPasses++;
    const passTexts = [
        `${teamNames[gameData.selectedTeam]}이 미드필드에서 공을 돌리고 있습니다`,
        `${teamNames[gameData.selectedTeam]}의 예리한 패스!`,
        `${teamNames[gameData.selectedTeam]}의 후방 빌드업`,
        `안정적인 패스 플레이가 이어집니다`,
        `중원에서의 볼 경합이 치열합니다`,
        `정확한 롱패스가 전개됩니다`,
        `측면을 통한 공격 전개`,
        `짧은 패스로 템포를 조절합니다`,
        `크로스가 올라갑니다`,
        `백패스로 안전하게 볼을 돌립니다`,
        `스루패스 시도가 있었습니다`,
        `원터치 패스가 이어집니다`,
        `중앙 돌파를 시도합니다`,
        `넓게 벌린 포메이션으로 공간을 활용합니다`,
        `압박을 피해 볼을 돌립니다`
    ];
    
    // 랜덤하게 표시하지 않고 가끔만 표시
    if (Math.random() < 0.3) {
        addMatchEvent('pass', passTexts[Math.floor(Math.random() * passTexts.length)]);
    }
}

function processThrowinEvent() {
    matchStats.totalThrowins++;
    addMatchEvent('throwin', "⚪ 스로인");
}

function processGoalkickEvent() {
    addMatchEvent('goalkick', "⚪ 골킥");
}

function processCornerEvent() {
    addMatchEvent('corner', "🚩 코너킥");
}

// 매치 이벤트 추가
function addMatchEvent(type, text) {
    const eventsContainer = document.getElementById('matchEvents');
    const eventCard = document.createElement('div');
    eventCard.className = `match-event ${type}`;
    eventCard.innerHTML = `
        <div class="event-time">${matchStats.minute}'</div>
        <div class="event-text">${text}</div>
    `;
    
    eventsContainer.appendChild(eventCard);
    eventsContainer.scrollTop = eventsContainer.scrollHeight;
}

// 포지션별 랜덤 선수 선택
function getRandomPlayerByPosition(position) {
    if (!gameData.selectedTeam) return null;
    
    let players;
    switch(position) {
        case 'GK':
            players = [gameData.squad.gk].filter(p => p);
            break;
        case 'DF':
            players = gameData.squad.df.filter(p => p);
            break;
        case 'MF':
            players = gameData.squad.mf.filter(p => p);
            break;
        case 'FW':
            players = gameData.squad.fw.filter(p => p);
            break;
    }
    
    if (players.length === 0) {
        // 해당 포지션에 선수가 없으면 전체 스쿼드에서 선택
        const allSquadPlayers = [
            gameData.squad.gk,
            ...gameData.squad.df,
            ...gameData.squad.mf,
            ...gameData.squad.fw
        ].filter(p => p);
        return allSquadPlayers[Math.floor(Math.random() * allSquadPlayers.length)];
    }
    
    return players[Math.floor(Math.random() * players.length)];
}

// 특정 선수를 제외한 랜덤 선수 선택
function getRandomPlayerExcept(excludePlayer) {
    const allSquadPlayers = [
        gameData.squad.gk,
        ...gameData.squad.df,
        ...gameData.squad.mf,
        ...gameData.squad.fw
    ].filter(p => p && p !== excludePlayer);
    
    if (allSquadPlayers.length === 0) return null;
    
    return allSquadPlayers[Math.floor(Math.random() * allSquadPlayers.length)];
}

// 선수 통계 업데이트
function updatePlayerStats(playerName, stat, value) {
    if (!gameData.playerStats.has(playerName)) {
        gameData.playerStats.set(playerName, {
            goals: 0,
            assists: 0,
            team: gameData.selectedTeam
        });
    }
    
    const playerStat = gameData.playerStats.get(playerName);
    playerStat[stat] += value;
    gameData.playerStats.set(playerName, playerStat);
}

// 경기 종료
function endMatch() {
    // 경기 결과 처리
    const homeScore = matchStats.homeScore;
    const awayScore = matchStats.awayScore;
    
    if (homeScore > awayScore) {
        gameData.wins++;
        gameData.points += 3;
        processSponsorBonus(true);
    } else if (homeScore < awayScore) {
        gameData.losses++;
        processSponsorBonus(false);
    } else {
        gameData.draws++;
        gameData.points += 1;
    }
    
    gameData.matchesPlayed++;
    gameData.currentMatchday++;
    
    // UI 업데이트
    updateGameUI();
    
    // 리그 테이블 업데이트
    updateOwnTeamInLeague();
    simulateOtherMatches();
    
    // 인터뷰 모달 표시
    setTimeout(() => {
        showInterviewModal(homeScore, awayScore);
    }, 2000);
    
    // 선수 성장 처리
    if (typeof processPostMatchGrowth === 'function') {
        processPostMatchGrowth();
    }
    
    // 이적 시장 업데이트
    if (typeof updateTransferMarketPostMatch === 'function') {
        updateTransferMarketPostMatch();
    }
    
    // 경기 버튼 상태 복원
    document.getElementById('startMatchBtn').disabled = false;
    document.getElementById('pauseMatchBtn').disabled = true;
    
    console.log('경기 종료:', homeScore, '-', awayScore);
}

// 스폰서 보너스 처리
function processSponsorBonus(won) {
    if (!gameData.currentSponsor) return;
    
    const bonus = won ? gameData.currentSponsor.payPerWin : gameData.currentSponsor.payPerLoss;
    gameData.teamMoney += bonus;
    
    updateGameUI();
}

// 자신의 팀 리그 테이블 업데이트
function updateOwnTeamInLeague() {
    if (!leagueTable[gameData.selectedTeam]) return;
    
    const teamData = leagueTable[gameData.selectedTeam];
    teamData.played = gameData.matchesPlayed;
    teamData.wins = gameData.wins;
    teamData.draws = gameData.draws;
    teamData.losses = gameData.losses;
    teamData.goalsFor = gameData.goalsFor;
    teamData.goalsAgainst = gameData.goalsAgainst;
    teamData.goalDifference = gameData.goalsFor - gameData.goalsAgainst;
    teamData.points = gameData.points;
}

// 다른 팀들의 경기 시뮬레이션
function simulateOtherMatches() {
    const allTeams = Object.keys(teamNames);
    const otherTeams = allTeams.filter(team => team !== gameData.selectedTeam);
    
    // 각 팀마다 경기 진행
    otherTeams.forEach(team => {
        if (leagueTable[team].played < gameData.matchesPlayed) {
            simulateAIMatch(team);
        }
    });
}

// AI 팀 경기 시뮬레이션
function simulateAIMatch(team) {
    const allTeams = Object.keys(teamNames);
    const opponents = allTeams.filter(t => t !== team);
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    
    // 간단한 경기 시뮬레이션
    const teamScore = Math.floor(Math.random() * 4); // 0-3 골
    const opponentScore = Math.floor(Math.random() * 4);
    
    // 팀 데이터 업데이트
    const teamData = leagueTable[team];
    const opponentData = leagueTable[opponent];
    
    teamData.played++;
    opponentData.played++;
    
    teamData.goalsFor += teamScore;
    teamData.goalsAgainst += opponentScore;
    opponentData.goalsFor += opponentScore;
    opponentData.goalsAgainst += teamScore;
    
    if (teamScore > opponentScore) {
        teamData.wins++;
        teamData.points += 3;
        opponentData.losses++;
    } else if (teamScore < opponentScore) {
        teamData.losses++;
        opponentData.wins++;
        opponentData.points += 3;
    } else {
        teamData.draws++;
        teamData.points += 1;
        opponentData.draws++;
        opponentData.points += 1;
    }
    
    teamData.goalDifference = teamData.goalsFor - teamData.goalsAgainst;
    opponentData.goalDifference = opponentData.goalsFor - opponentData.goalsAgainst;
    
    // 콘솔에 결과 출력
    console.log(`${teamNames[team]} ${teamScore}-${opponentScore} ${teamNames[opponent]}`);
    
    // AI 팀 선수들에게도 골/어시 기록
    simulateAIPlayerStats(team, opponent, teamScore, opponentScore);
}

// AI 선수 통계 시뮬레이션
function simulateAIPlayerStats(team1, team2, score1, score2) {
    // team1 골
    for (let i = 0; i < score1; i++) {
        const scorer = getRandomTeamPlayer(team1);
        if (scorer) {
            updatePlayerStats(scorer.name, 'goals', 1);
            
            // 80% 확률로 어시스트
            if (Math.random() < 0.8) {
                const assistant = getRandomTeamPlayerExcept(team1, scorer);
                if (assistant) {
                    updatePlayerStats(assistant.name, 'assists', 1);
                }
            }
        }
    }
}

// 팀의 랜덤 선수 선택
function getRandomTeamPlayer(teamId) {
    const teamPlayers = teams[teamId];
    if (!teamPlayers || teamPlayers.length === 0) return null;
    
    return teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
}

// 특정 선수를 제외한 팀의 랜덤 선수 선택
function getRandomTeamPlayerExcept(teamId, excludePlayer) {
    const teamPlayers = teams[teamId].filter(p => p !== excludePlayer);
    if (!teamPlayers || teamPlayers.length === 0) return null;
    
    return teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
}

// 인터뷰 모달 표시
function showInterviewModal(homeScore, awayScore) {
    const modal = document.getElementById('interviewModal');
    const question = document.getElementById('interviewQuestion');
    const options = document.getElementById('interviewOptions');
    
    let interviewData;
    
    if (homeScore > awayScore) {
        // 승리
        if (homeScore - awayScore >= 3) {
            // 대승
            interviewData = {
                question: "대승을 거두셨습니다! 소감을 말씀해주세요.",
                options: [
                    { text: "정말 훌륭한 경기였습니다! 여러분이 자랑스럽습니다!", morale: 10 },
                    { text: "팀워크가 빛났습니다! 계속 이렇게 해봅시다!", morale: 8 },
                    { text: "좋은 결과지만 아직 부족한 점이 많습니다.", morale: 3 }
                ]
            };
        } else {
            // 일반 승리
            interviewData = {
                question: "승리를 거두셨습니다. 경기에 대해 어떻게 생각하시나요?",
                options: [
                    { text: "팀워크가 빛났습니다! 계속 이렇게 해봅시다!", morale: 5 },
                    { text: "좋은 경기였지만 더 발전할 여지가 있습니다.", morale: 3 },
                    { text: "몇몇 실수는 아쉬웠습니다. 다음에는 더 집중해야 합니다.", morale: -3 }
                ]
            };
        }
    } else if (homeScore < awayScore) {
        // 패배
        if (awayScore - homeScore >= 3) {
            // 대패
            interviewData = {
                question: "큰 점수차로 패배하셨습니다. 어떤 말씀을 해주시겠습니까?",
                options: [
                    { text: "이번 경기는 정말 실망스러웠습니다. 왜 이렇게 했는지 이해가 되지 않습니다!", morale: -10 },
                    { text: "이런 경기는 절대 허용할 수 없습니다. 다음에는 더 잘해야 합니다!", morale: -8 },
                    { text: "힘든 경기를 치렀지만, 여러분의 노력은 인정합니다. 다음에 더 좋은 결과를 기대합니다.", morale: -3 }
                ]
            };
        } else {
            // 일반 패배
            interviewData = {
                question: "아쉬운 패배였습니다. 선수들에게 한 말씀 해주세요.",
                options: [
                    { text: "이런 경기는 절대 허용할 수 없습니다. 다음에는 더 잘해야 합니다!", morale: -5 },
                    { text: "아쉬운 결과지만 다음 경기에서 만회하겠습니다.", morale: -2 },
                    { text: "힘든 경기를 치렀지만, 여러분의 노력은 인정합니다. 다음에 더 좋은 결과를 기대합니다.", morale: 2 }
                ]
            };
        }
    } else {
        // 무승부
        interviewData = {
            question: "무승부로 경기가 끝났습니다. 어떻게 평가하시나요?",
            options: [
                { text: "아쉬운 결과입니다. 더 좋은 기회들이 있었는데요.", morale: -2 },
                { text: "균형잡힌 경기였습니다. 다음에는 승리를 가져오겠습니다.", morale: 1 },
                { text: "상대도 좋은 팀이었습니다. 좋은 경험이었어요.", morale: 3 }
            ]
        };
    }
    
    question.textContent = interviewData.question;
    options.innerHTML = '';
    
    interviewData.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'interview-option';
        button.textContent = option.text;
        button.addEventListener('click', () => {
            selectInterviewOption(option.morale);
            modal.style.display = 'none';
        });
        options.appendChild(button);
    });
    
    modal.style.display = 'flex';
}

// 인터뷰 선택지 처리
function selectInterviewOption(moraleChange) {
    gameData.teamMorale += moraleChange;
    gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale));
    
    updateGameUI();
    
    // 다음 경기 상대 설정
    setNextOpponent();
    
    // 시즌 종료 확인
    if (gameData.matchesPlayed >= 36) {
        endSeason();
    }
}

// 시즌 종료
function endSeason() {
    // 최종 순위 계산
    const finalPosition = calculateFinalPosition();
    
    // 시즌 보상
    let seasonBonus = 0;
    if (finalPosition === 1) {
        seasonBonus = 500; // 우승
        alert('🏆 축하합니다! 리그 우승을 차지했습니다!');
    } else if (finalPosition <= 4) {
        seasonBonus = 300; // 상위권
        alert('🥉 훌륭합니다! 상위권 진출에 성공했습니다!');
    } else if (finalPosition <= 12) {
        seasonBonus = 150; // 중위권
        alert('📊 중위권 성적을 기록했습니다.');
    } else {
        seasonBonus = 50; // 강등권
        alert('⚠️ 아쉬운 시즌이었습니다. 다음 시즌에는 더 좋은 결과를 기대합니다.');
    }
    
    gameData.teamMoney += seasonBonus;
    
    // 시즌 초기화
    gameData.currentSeason++;
    gameData.currentMatchday = 1;
    gameData.matchesPlayed = 0;
    gameData.wins = 0;
    gameData.draws = 0;
    gameData.losses = 0;
    gameData.goalsFor = 0;
    gameData.goalsAgainst = 0;
    gameData.points = 0;
    
    // 리그 테이블 초기화
    initializeLeagueTable();
    
    // 선수 나이 증가
    if (typeof advancePlayerAges === 'function') {
        advancePlayerAges();
    }
    
    updateGameUI();
    setNextOpponent();
}

// 최종 순위 계산
function calculateFinalPosition() {
    const sortedTable = Object.values(leagueTable).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if ((b.goalsFor - b.goalsAgainst) !== (a.goalsFor - a.goalsAgainst)) {
            return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
        }
        return b.goalsFor - a.goalsFor;
    });
    
    const myTeamData = leagueTable[gameData.selectedTeam];
    return sortedTable.findIndex(team => team.name === myTeamData.name) + 1;
}

// 리그 테이블 업데이트
function updateLeagueTable() {
    const tableBody = document.querySelector('#leagueTable tbody');
    if (!tableBody) return;
    
    // 순위별로 정렬
    const sortedTeams = Object.values(leagueTable).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
    });
    
    tableBody.innerHTML = '';
    
    sortedTeams.forEach((team, index) => {
        const row = document.createElement('tr');
        if (team.name === teamNames[gameData.selectedTeam]) {
            row.classList.add('my-team');
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${team.name}</td>
            <td>${team.played}</td>
            <td>${team.wins}</td>
            <td>${team.draws}</td>
            <td>${team.losses}</td>
            <td>${team.goalsFor}</td>
            <td>${team.goalsAgainst}</td>
            <td>${team.goalDifference}</td>
            <td>${team.points}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 현재 순위 업데이트
    const myPosition = sortedTeams.findIndex(team => team.name === teamNames[gameData.selectedTeam]) + 1;
    document.getElementById('leaguePosition').textContent = myPosition;
}

// 득점왕/도움왕 업데이트
function updateTopScorers() {
    const topScorersContainer = document.getElementById('topScorers');
    const topAssistsContainer = document.getElementById('topAssists');
    
    // 득점왕 정렬
    const scorersList = Array.from(gameData.playerStats.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10);
    
    // 도움왕 정렬
    const assistsList = Array.from(gameData.playerStats.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.assists - a.assists)
        .slice(0, 10);
    
    // 득점왕 표시
    topScorersContainer.innerHTML = '';
    scorersList.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'stat-item';
        if (player.team === gameData.selectedTeam) {
            item.classList.add('my-player');
        }
        item.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span>${player.goals} 골</span>
        `;
        topScorersContainer.appendChild(item);
    });
    
    // 도움왕 표시
    topAssistsContainer.innerHTML = '';
    assistsList.forEach((player, index) => {
        const item = document.createElement('div');
        item.className = 'stat-item';
        if (player.team === gameData.selectedTeam) {
            item.classList.add('my-player');
        }
        item.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span>${player.assists} 도움</span>
        `;
        topAssistsContainer.appendChild(item);
    });
}

// 전술 선택
function selectTactic(tactic) {
    gameData.currentTactic = tactic;
    updateTacticsDisplay();
}

// 전술 디스플레이 업데이트
function updateTacticsDisplay() {
    // 모든 전술 카드에서 선택 표시 제거
    document.querySelectorAll('.tactic-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 현재 전술 카드에 선택 표시 추가
    const currentTacticCard = document.querySelector(`[data-tactic="${gameData.currentTactic}"]`);
    if (currentTacticCard) {
        currentTacticCard.classList.add('selected');
    }
    
    // 현재 전술 정보 업데이트
    const tacticNames = {
        'gegenpressing': '게겐프레싱',
        'twoLineDefense': '두 줄 수비',
        'lavolpiana': '라볼피아나',
        'longBall': '롱볼축구',
        'possession': '점유율 축구',
        'parking': '침대축구',
        'catenaccio': '카테나치오',
        'totalFootball': '토탈풋볼',
        'tikitaka': '티키타카'
    };
    
    const tacticDescriptions = {
        'gegenpressing': '높은 압박과 빠른 역습으로 상대를 압도합니다.',
        'twoLineDefense': '안정적인 수비진 배치로 상대 공격을 차단합니다.',
        'lavolpiana': '창의적인 공격 전개로 상대를 혼란시킵니다.',
        'longBall': '직접적이고 빠른 공격으로 상대를 압박합니다.',
        'possession': '볼 점유를 통한 경기 지배로 승부를 가립니다.',
        'parking': '극도로 수비적인 전술로 상대 공격을 봉쇄합니다.',
        'catenaccio': '이탈리아식 수비 전술로 견고함을 추구합니다.',
        'totalFootball': '전 선수가 공수를 병행하는 역동적인 축구를 구사합니다.',
        'tikitaka': '짧은 패스의 연속으로 상대를 현혹시킵니다.'
    };
    
    document.getElementById('currentTactic').textContent = tacticNames[gameData.currentTactic];
    document.getElementById('tacticDescription').textContent = tacticDescriptions[gameData.currentTactic];
}

// 스폰서 표시
function displaySponsors() {
    const sponsorsList = document.getElementById('sponsorsList');
    sponsorsList.innerHTML = '';
    
    sponsors.forEach(sponsor => {
        const teamRating = calculateTeamRating();
        const canContract = teamRating >= sponsor.requirements.minRating;
        
        const sponsorCard = document.createElement('div');
        sponsorCard.className = `sponsor-card ${canContract ? '' : 'disabled'}`;
        sponsorCard.innerHTML = `
            <h4>${sponsor.name}</h4>
            <p>${sponsor.description}</p>
            <div class="sponsor-details">
                <div>승리 보너스: ${sponsor.payPerWin}억</div>
                <div>패배 보너스: ${sponsor.payPerLoss}억</div>
                <div>계약 기간: ${sponsor.contractLength}경기</div>
                <div>계약금: ${sponsor.signingBonus}억</div>
                <div>필요 레이팅: ${sponsor.requirements.minRating}</div>
            </div>
            <button class="sponsor-btn ${canContract ? '' : 'disabled'}" 
                    onclick="contractSponsor('${sponsor.name}')" 
                    ${canContract ? '' : 'disabled'}>
                ${canContract ? '계약하기' : '레이팅 부족'}
            </button>
        `;
        
        sponsorsList.appendChild(sponsorCard);
    });
    
    // 현재 스폰서 정보 업데이트
    const currentSponsorInfo = document.getElementById('currentSponsorInfo');
    if (gameData.currentSponsor) {
        currentSponsorInfo.innerHTML = `
            <div class="current-sponsor-details">
                <h5>${gameData.currentSponsor.name}</h5>
                <p>승리 보너스: ${gameData.currentSponsor.payPerWin}억</p>
                <p>패배 보너스: ${gameData.currentSponsor.payPerLoss}억</p>
                <p>남은 경기: ${gameData.currentSponsor.remainingMatches || 0}경기</p>
                <button onclick="cancelSponsor()" class="btn-secondary">계약 해지</button>
            </div>
        `;
    } else {
        currentSponsorInfo.innerHTML = '<p>계약된 스폰서가 없습니다.</p>';
    }
}

// 스폰서 계약
function contractSponsor(sponsorName) {
    const sponsor = sponsors.find(s => s.name === sponsorName);
    if (!sponsor) return;
    
    const teamRating = calculateTeamRating();
    if (teamRating < sponsor.requirements.minRating) {
        alert('팀 레이팅이 부족합니다!');
        return;
    }
    
    if (gameData.teamMoney < sponsor.signingBonus) {
        alert('계약금이 부족합니다!');
        return;
    }
    
    // 기존 스폰서 해지
    if (gameData.currentSponsor) {
        cancelSponsor();
    }
    
    // 새 스폰서 계약
    gameData.currentSponsor = {
        ...sponsor,
        remainingMatches: sponsor.contractLength
    };
    
    gameData.teamMoney -= sponsor.signingBonus;
    
    alert(`${sponsor.name}와 계약을 체결했습니다!`);
    
    updateGameUI();
    displaySponsors();
}

// 스폰서 계약 해지
function cancelSponsor() {
    gameData.currentSponsor = null;
    updateGameUI();
    displaySponsors();
    alert('스폰서 계약을 해지했습니다.');
}

// 저장 및 불러오기
function saveGame() {
    const saveData = {
        gameData: gameData,
        leagueTable: leagueTable,
        matchStats: matchStats,
        playerStats: Array.from(gameData.playerStats.entries())
    };
    
    const dataStr = JSON.stringify(saveData);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    
    const teamName = teamNames[gameData.selectedTeam] || 'Unknown';
    const date = new Date().toISOString().slice(0, 10);
    link.download = `${teamName}_${date}.json`;
    
    link.click();
}

function loadGame(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const saveData = JSON.parse(e.target.result);
            
            gameData = saveData.gameData;
            leagueTable = saveData.leagueTable;
            matchStats = saveData.matchStats;
            
            if (saveData.playerStats) {
                gameData.playerStats = new Map(saveData.playerStats);
            }
            
            // UI 업데이트
            updateGameUI();
            showScreen('gameInterface');
            showScreen('lobby');
            
            alert('게임을 성공적으로 불러왔습니다!');
            
        } catch (error) {
            alert('저장 파일을 불러오는데 실패했습니다.');
            console.error('Load error:', error);
        }
    };
    
    reader.readAsText(file);
}

// SNS 뉴스 피드 (기본 구현)
function displayNewsFeed() {
    const newsFeed = document.getElementById('newsFeed');
    newsFeed.innerHTML = `
        <div class="news-item">
            <div class="news-content">
                <h4>환영합니다!</h4>
                <p>SNS 기능이 곧 추가될 예정입니다. 이적 뉴스와 경기 결과를 확인하세요!</p>
                <div class="news-time">방금 전</div>
            </div>
        </div>
    `;
}

// 전역 함수로 노출
window.showScreen = showScreen;
window.contractSponsor = contractSponsor;
window.cancelSponsor = cancelSponsor;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.selectPlayerForPosition = selectPlayerForPosition; 1);
                }
            }
        }
    }
    
    // team2 골
    for (let i = 0; i < score2; i++) {
        const scorer = getRandomTeamPlayer(team2);
        if (scorer) {
            updatePlayerStats(scorer.name, 'goals', 1);
            
            // 80% 확률로 어시스트
            if (Math.random() < 0.8) {
                const assistant = getRandomTeamPlayerExcept(team2, scorer);
                if (assistant) {
                    updatePlayerStats(assistant.name, 'assists',
                // 게임 데이터 및 전역 변수
let gameData = {
    selectedTeam: null,
    teamMoney: 1000,
    teamMorale: 50,
    currentSeason: 1,
    currentMatchday: 1,
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
    currentTactic: 'gegenpressing',
    currentSponsor: null,
    squad: {
        gk: null,
        df: [null, null, null, null],
        mf: [null, null, null],
        fw: [null, null, null]
    },
    playerStats: new Map(), // 선수별 골/어시 통계
    transferSystemData: null,
    playerGrowthData: null
};

// 팀 명칭 매핑
const teamNames = {
    tottenham: '토트넘 홋스퍼',
    liverpool: '리버풀',
    manCity: '맨체스터 시티',
    arsenal: '아스널',
    manUnited: '맨체스터 유나이티드',
    chelsea: '첼시',
    realMadrid: '레알 마드리드',
    barcelona: '바르셀로나',
    acMilan: 'AC 밀란',
    inter: '인터 밀란',
    bayern: '바이에른 뮌헨',
    psg: '파리 생제르맹',
    leverkusen: '바이어 레버쿠젠',
    dortmund: '보루시아 도르트문트',
    newCastle: '뉴캐슬 유나이티드',
    asRoma: 'AS 로마',
    atMadrid: '아틀레티코 마드리드',
    napoli: '나폴리'
};

// 팀 데이터
const teams = {
    tottenham: [
        { name: "비카리오", position: "GK", rating: 82, age: 27 },
        { name: "레길론", position: "DF", rating: 78, age: 27 },
        { name: "드라구신", position: "DF", rating: 75, age: 24 },
        { name: "손흥민", position: "FW", rating: 90, age: 31 },
        { name: "비수마", position: "MF", rating: 80, age: 28 },
        { name: "히샬리송", position: "FW", rating: 83, age: 26 },
        { name: "매디슨", position: "MF", rating: 85, age: 27 },
        { name: "우도기", position: "DF", rating: 76, age: 25 },
        { name: "그레이", position: "MF", rating: 81, age: 24 },
        { name: "베리발", position: "FW", rating: 77, age: 23 },
        { name: "베르너", position: "FW", rating: 75, age: 29 },
        { name: "로메로", position: "DF", rating: 85, age: 25 },
        { name: "솔랑케", position: "FW", rating: 78, age: 26 },
        { name: "포스터", position: "GK", rating: 70, age: 24 },
        { name: "마티스 텔", position: "FW", rating: 81, age: 19 },
        { name: "쿨루셉스키", position: "FW", rating: 84, age: 23 },
        { name: "케빈 단소", position: "DF", rating: 81, age: 26 },
        { name: "존슨", position: "MF", rating: 76, age: 25 },
        { name: "페드로 포로", position: "DF", rating: 78, age: 24 },
        { name: "스펜스", position: "DF", rating: 74, age: 22 },
        { name: "오도베르", position: "MF", rating: 72, age: 21 },
        { name: "P. M. 사르", position: "MF", rating: 70, age: 21 },
        { name: "벤탕쿠르", position: "MF", rating: 82, age: 26 },
        { name: "데이비스", position: "DF", rating: 77, age: 30 },
        { name: "판더펜", position: "DF", rating: 73, age: 22 },
        { name: "오스틴", position: "GK", rating: 71, age: 25 },
        { name: "화이트먼", position: "DF", rating: 69, age: 23 },
        { name: "양민혁", position: "MF", rating: 78, age: 18 }
    ],
    liverpool: [
        { name: "A. 베케르", position: "GK", rating: 81, age: 27 },
        { name: "고메즈", position: "DF", rating: 78, age: 26 },
        { name: "엔도", position: "MF", rating: 76, age: 25 },
        { name: "버질", position: "DF", rating: 90, age: 31 },
        { name: "코나테", position: "DF", rating: 84, age: 24 },
        { name: "루이스 디아스", position: "FW", rating: 82, age: 26 },
        { name: "소보슬라이", position: "MF", rating: 79, age: 22 },
        { name: "다르윈", position: "FW", rating: 85, age: 25 },
        { name: "맥 알리스터", position: "MF", rating: 83, age: 25 },
        { name: "M. 살라", position: "FW", rating: 92, age: 31 },
        { name: "키에사", position: "FW", rating: 80, age: 25 },
        { name: "존스", position: "MF", rating: 75, age: 22 },
        { name: "각포", position: "MF", rating: 74, age: 23 },
        { name: "엘리엇", position: "MF", rating: 76, age: 20 },
        { name: "디오구 J.", position: "FW", rating: 78, age: 26 },
        { name: "치미카스", position: "DF", rating: 73, age: 27 },
        { name: "로버트슨", position: "DF", rating: 83, age: 29 },
        { name: "흐라벤베르흐", position: "MF", rating: 72, age: 21 },
        { name: "야로스", position: "GK", rating: 70, age: 23 },
        { name: "켈러허", position: "GK", rating: 77, age: 25 },
        { name: "콴사", position: "DF", rating: 71, age: 19 },
        { name: "모튼", position: "MF", rating: 69, age: 20 },
        { name: "브래들리", position: "MF", rating: 68, age: 22 },
        { name: "데이비스", position: "DF", rating: 72, age: 25 }
    ],
    manCity: [
        { name: "후벵 디아스", position: "DF", rating: 85, age: 29 },
        { name: "스톤스", position: "DF", rating: 82, age: 29 },
        { name: "아케", position: "DF", rating: 78, age: 24 },
        { name: "코바치치", position: "MF", rating: 81, age: 29 },
        { name: "홀란드", position: "FW", rating: 92, age: 23 },
        { name: "그릴리쉬", position: "FW", rating: 84, age: 28 },
        { name: "로드리", position: "MF", rating: 79, age: 27 },
        { name: "오르테가 모레노", position: "GK", rating: 75, age: 30 },
        { name: "귄도안", position: "MF", rating: 83, age: 32 },
        { name: "베르나르두", position: "MF", rating: 87, age: 29 },
        { name: "그바르디올", position: "DF", rating: 82, age: 22 },
        { name: "아칸지", position: "DF", rating: 80, age: 28 },
        { name: "사비뉴", position: "MF", rating: 76, age: 25 },
        { name: "마테우스 N.", position: "MF", rating: 74, age: 23 },
        { name: "에데르송 M.", position: "GK", rating: 88, age: 30 },
        { name: "카슨", position: "GK", rating: 70, age: 35 },
        { name: "포든", position: "MF", rating: 85, age: 23 },
        { name: "리코 루이스", position: "DF", rating: 72, age: 19 },
        { name: "매카티", position: "MF", rating: 71, age: 20 },
        { name: "윌슨-에스브랜드", position: "FW", rating: 73, age: 21 }
    ],
    arsenal: [
        { name: "키어런 티어니", position: "DF", rating: 80, age: 26 },
        { name: "벤 화이트", position: "DF", rating: 82, age: 25 },
        { name: "토마스 파티", position: "MF", rating: 85, age: 30 },
        { name: "가브리엘 마갈량이스", position: "DF", rating: 83, age: 25 },
        { name: "부카요 사카", position: "FW", rating: 88, age: 22 },
        { name: "마르틴 외데고르", position: "MF", rating: 87, age: 25 },
        { name: "가브리엘 제주스", position: "FW", rating: 84, age: 26 },
        { name: "가브리엘 마르티넬리", position: "FW", rating: 86, age: 22 },
        { name: "유리언 팀버르", position: "DF", rating: 78, age: 23 },
        { name: "야쿠프 키비오르", position: "DF", rating: 76, age: 24 },
        { name: "올렉산드르 진첸코", position: "DF", rating: 81, age: 27 },
        { name: "도미야스 다케히로", position: "DF", rating: 79, age: 26 },
        { name: "레안드로 트로사르", position: "FW", rating: 80, age: 28 },
        { name: "조르지뉴", position: "MF", rating: 82, age: 31 },
        { name: "다비드 라야", position: "GK", rating: 83, age: 28 },
        { name: "미켈 메리노", position: "MF", rating: 77, age: 26 },
        { name: "카이 하베르츠", position: "FW", rating: 84, age: 24 },
        { name: "라힘 스털링", position: "FW", rating: 85, age: 29 },
        { name: "리카르도 칼라피오리", position: "DF", rating: 74, age: 22 },
        { name: "데클런 라이스", position: "MF", rating: 86, age: 24 }
    ],
    manUnited: [
        { name: "알타이 바이은드르", position: "GK", rating: 78, age: 25 },
        { name: "빅토르 린델뢰프", position: "DF", rating: 80, age: 29 },
        { name: "누사이르 마즈라위", position: "DF", rating: 82, age: 25 },
        { name: "마테이스 더 리흐트", position: "DF", rating: 85, age: 25 },
        { name: "해리 매과이어", position: "DF", rating: 79, age: 30 },
        { name: "리산드로 마르티네스", position: "DF", rating: 81, age: 25 },
        { name: "메이슨 마운트", position: "MF", rating: 84, age: 24 },
        { name: "브루노 페르난데스", position: "MF", rating: 88, age: 29 },
        { name: "라스무스 호일룬", position: "FW", rating: 80, age: 20 },
        { name: "마커스 래시퍼드", position: "FW", rating: 86, age: 26 },
        { name: "조슈아 지르크제이", position: "FW", rating: 75, age: 23 },
        { name: "티렐 말라시아", position: "DF", rating: 77, age: 24 },
        { name: "크리스티안 에릭센", position: "MF", rating: 83, age: 31 },
        { name: "레니 요로", position: "DF", rating: 74, age: 21 },
        { name: "아마드 디알로", position: "FW", rating: 78, age: 21 },
        { name: "알레한드로 가르나초", position: "FW", rating: 76, age: 19 },
        { name: "카세미루", position: "MF", rating: 86, age: 31 },
        { name: "디오구 달로", position: "DF", rating: 79, age: 23 },
        { name: "안토니", position: "FW", rating: 82, age: 23 },
        { name: "톰 히턴", position: "GK", rating: 75, age: 36 },
        { name: "루크 쇼", position: "DF", rating: 81, age: 28 },
        { name: "앙드레 오나나", position: "GK", rating: 84, age: 27 },
        { name: "마누엘 우가르테", position: "MF", rating: 73, age: 23 },
        { name: "조니 에번스", position: "DF", rating: 72, age: 35 },
        { name: "에단 휘틀리", position: "GK", rating: 70, age: 20 },
        { name: "코비 마이누", position: "MF", rating: 71, age: 19 },
        { name: "해리 애머스", position: "DF", rating: 68, age: 21 },
        { name: "토비 콜리어", position: "DF", rating: 69, age: 22 },
        { name: "대니얼 고어", position: "GK", rating: 67, age: 22 }
    ],
    realMadrid: [
        { name: "티보 쿠르투아", position: "GK", rating: 90, age: 31 },
        { name: "다니 카르바할", position: "DF", rating: 80, age: 31 },
        { name: "에데르 밀리탕", position: "DF", rating: 84, age: 25 },
        { name: "데이비드 알라바", position: "DF", rating: 82, age: 30 },
        { name: "주드 벨링엄", position: "MF", rating: 91, age: 20 },
        { name: "에두아르도 카마빙가", position: "MF", rating: 84, age: 21 },
        { name: "비니시우스 주니오르", position: "FW", rating: 89, age: 23 },
        { name: "페데리코 발베르데", position: "MF", rating: 85, age: 25 },
        { name: "킬리안 음바페", position: "FW", rating: 93, age: 25 },
        { name: "루카 모드리치", position: "MF", rating: 88, age: 38 },
        { name: "호드리구", position: "FW", rating: 88, age: 22 },
        { name: "안드리 루닌", position: "GK", rating: 76, age: 24 },
        { name: "오렐리앵 추아메니", position: "MF", rating: 81, age: 23 },
        { name: "아르다 귈러", position: "FW", rating: 78, age: 19 },
        { name: "엔드릭", position: "FW", rating: 75, age: 18 },
        { name: "루카스 바스케스", position: "DF", rating: 77, age: 32 },
        { name: "헤수스 바예호", position: "DF", rating: 74, age: 25 },
        { name: "다니 세바요스", position: "MF", rating: 79, age: 27 },
        { name: "프란 가르시아", position: "DF", rating: 73, age: 24 },
        { name: "안토니오 뤼디거", position: "DF", rating: 85, age: 30 },
        { name: "페를랑 멘디", position: "DF", rating: 80, age: 28 }
    ],
    barcelona: [
        { name: "마르크-안드레 테어 슈테겐", position: "GK", rating: 89, age: 31 },
        { name: "파우 쿠바르시", position: "DF", rating: 78, age: 23 },
        { name: "알레한드로 발데", position: "DF", rating: 80, age: 20 },
        { name: "로날드 아라우호", position: "DF", rating: 84, age: 24 },
        { name: "이니고 마르티네스", position: "DF", rating: 82, age: 32 },
        { name: "가비", position: "MF", rating: 83, age: 19 },
        { name: "페란 토레스", position: "FW", rating: 81, age: 23 },
        { name: "페드리", position: "MF", rating: 88, age: 20 },
        { name: "로베르트 레반도프스키", position: "FW", rating: 91, age: 35 },
        { name: "안수 파티", position: "FW", rating: 80, age: 20 },
        { name: "하피냐", position: "FW", rating: 85, age: 26 },
        { name: "이냐키 페냐", position: "GK", rating: 76, age: 23 },
        { name: "파블로 토레", position: "MF", rating: 75, age: 19 },
        { name: "안드레아스 크리스텐센", position: "DF", rating: 80, age: 27 },
        { name: "페르민 로페스", position: "MF", rating: 78, age: 23 },
        { name: "마르크 카사도", position: "DF", rating: 73, age: 21 },
        { name: "파우 빅토르", position: "DF", rating: 70, age: 21 },
        { name: "라민 야말", position: "FW", rating: 86, age: 17 },
        { name: "다니 올모", position: "MF", rating: 80, age: 25 },
        { name: "프렝키 더 용", position: "MF", rating: 86, age: 26 },
        { name: "쥘 쿤데", position: "DF", rating: 83, age: 25 },
        { name: "에리크 가르시아", position: "DF", rating: 79, age: 24 },
        { name: "보이치에흐 슈쳉스니", position: "GK", rating: 81, age: 33 }
    ],
    acMilan: [
        { name: "다비데 칼라브리아", position: "DF", rating: 80, age: 26 },
        { name: "이스마엘 벤나세르", position: "MF", rating: 82, age: 25 },
        { name: "알바로 모라타", position: "FW", rating: 85, age: 30 },
        { name: "루빈 로프터스치크", position: "MF", rating: 80, age: 28 },
        { name: "루카 요비치", position: "FW", rating: 78, age: 25 },
        { name: "하파엘 레앙", position: "FW", rating: 86, age: 24 },
        { name: "크리스천 풀리식", position: "FW", rating: 81, age: 25 },
        { name: "티자니 라인더르스", position: "DF", rating: 75, age: 20 },
        { name: "마이크 메냥", position: "GK", rating: 86, age: 27 },
        { name: "노아 오카포르", position: "DF", rating: 76, age: 22 },
        { name: "케빈 체롤리", position: "MF", rating: 74, age: 19 },
        { name: "카일 워커", position: "DF", rating: 80, age: 33 },
        { name: "테오 에르난데스", position: "DF", rating: 85, age: 26 },
        { name: "알렉스 히메네스", position: "DF", rating: 78, age: 33 },
        { name: "새뮤얼 추쿠에제", position: "FW", rating: 81, age: 24 },
        { name: "에메르송 로얄", position: "DF", rating: 79, age: 24 },
        { name: "피카요 토모리", position: "DF", rating: 82, age: 25 },
        { name: "알레산드로 플로렌치", position: "DF", rating: 77, age: 33 },
        { name: "말릭 티아우", position: "DF", rating: 74, age: 23 },
        { name: "유수프 포파나", position: "DF", rating: 76, age: 25 },
        { name: "스트라히냐 파블로비치", position: "DF", rating: 75, age: 24 },
        { name: "필리포 테라치아노", position: "GK", rating: 72, age: 27 },
        { name: "마테오 가비아", position: "DF", rating: 70, age: 23 },
        { name: "마르코 스포르티엘로", position: "GK", rating: 73, age: 30 },
        { name: "유누스 무사", position: "MF", rating: 78, age: 21 },
        { name: "태미 에이브러햄", position: "FW", rating: 84, age: 26 },
        { name: "로렌초 토리아니", position: "GK", rating: 71, age: 22 }
    ],
    inter: [
        { name: "얀 조머", position: "GK", rating: 84, age: 30 },
        { name: "덴젤 둠프리스", position: "DF", rating: 81, age: 26 },
        { name: "스테판 더브레이", position: "DF", rating: 82, age: 29 },
        { name: "피오트르 지엘린스키", position: "MF", rating: 80, age: 28 },
        { name: "마르코 아르나우토비치", position: "FW", rating: 78, age: 34 },
        { name: "마르쿠스 튀람", position: "FW", rating: 84, age: 25 },
        { name: "라우타로 마르티네스", position: "FW", rating: 89, age: 26 },
        { name: "호아킨 코레아", position: "FW", rating: 79, age: 29 },
        { name: "라파엘레 디 젠나로", position: "DF", rating: 76, age: 24 },
        { name: "조제프 마르티네스", position: "FW", rating: 75, age: 26 },
        { name: "프란체스코 아체르비", position: "DF", rating: 80, age: 30 },
        { name: "다비데 프라테시", position: "DF", rating: 78, age: 25 },
        { name: "테이존 뷰캐넌", position: "DF", rating: 74, age: 22 },
        { name: "하칸 찰하노글루", position: "MF", rating: 83, age: 29 },
        { name: "크리스티안 아슬라니", position: "MF", rating: 76, age: 22 },
        { name: "헨리크 미키타리안", position: "MF", rating: 81, age: 34 },
        { name: "니콜로 바렐라", position: "MF", rating: 85, age: 26 },
        { name: "뱅자맹 파바르", position: "DF", rating: 79, age: 27 },
        { name: "카를루스 아우구스투", position: "DF", rating: 75, age: 29 },
        { name: "얀 아우렐 비세크", position: "DF", rating: 73, age: 25 },
        { name: "페데리코 디마르코", position: "DF", rating: 78, age: 25 },
        { name: "마테오 다르미안", position: "DF", rating: 76, age: 33 },
        { name: "알레산드로 바스토니", position: "DF", rating: 80, age: 24 },
        { name: "실바노 스카르파", position: "FW", rating: 77, age: 26 }
    ],
    bayern: [
        { name: "마누엘 노이어", position: "GK", rating: 90, age: 37 },
        { name: "다요 우파메카노", position: "DF", rating: 83, age: 25 },
        { name: "김민재", position: "DF", rating: 84, age: 27 },
        { name: "요주아 키미히", position: "MF", rating: 88, age: 28 },
        { name: "세르주 그나브리", position: "FW", rating: 85, age: 28 },
        { name: "레온 고레츠카", position: "MF", rating: 84, age: 28 },
        { name: "해리 케인", position: "FW", rating: 92, age: 30 },
        { name: "리로이 자네", position: "FW", rating: 86, age: 28 },
        { name: "킹슬레 코망", position: "FW", rating: 82, age: 28 },
        { name: "알폰소 데이비스", position: "DF", rating: 87, age: 23 },
        { name: "주앙 팔리냐", position: "MF", rating: 80, age: 28 },
        { name: "다니엘 페레츠", position: "GK", rating: 75, age: 26 },
        { name: "다니엘 산체스", position: "DF", rating: 79, age: 28 },
        { name: "하파엘 게헤이루", position: "DF", rating: 78, age: 27 },
        { name: "마이클 올리스", position: "MF", rating: 76, age: 25 },
        { name: "다니엘 베르너", position: "FW", rating: 79, age: 28 },
        { name: "이토 히로키", position: "DF", rating: 72, age: 26 },
        { name: "타레크 부흐만", position: "MF", rating: 74, age: 22 },
        { name: "마르코 레흐너", position: "DF", rating: 73, age: 21 },
        { name: "자말 무시알라", position: "FW", rating: 81, age: 20 },
        { name: "스벤 울라이히", position: "GK", rating: 76, age: 29 },
        { name: "콘라트 라이머", position: "MF", rating: 75, age: 29 },
        { name: "요시프 스타니시치", position: "DF", rating: 73, age: 23 },
        { name: "알렉산다르 파블로비치", position: "DF", rating: 72, age: 27 }
    ],
    psg: [
        { name: "잔루이지 돈나룸마", position: "GK", rating: 89, age: 24 },
        { name: "아슈라프 하키미", position: "DF", rating: 85, age: 25 },
        { name: "프레스넬 킴펨베", position: "DF", rating: 83, age: 28 },
        { name: "마르키뉴스", position: "DF", rating: 87, age: 29 },
        { name: "파비안 루이스", position: "MF", rating: 81, age: 27 },
        { name: "곤살루 하무스", position: "FW", rating: 82, age: 27 },
        { name: "우스만 뎀벨레", position: "FW", rating: 80, age: 26 },
        { name: "마르코 아센시오", position: "FW", rating: 82, age: 31 },
        { name: "데지레 두에", position: "MF", rating: 76, age: 25 },
        { name: "비티냐", position: "MF", rating: 81, age: 23 },
        { name: "이강인", position: "MF", rating: 85, age: 22 },
        { name: "루카스 에르난데스", position: "DF", rating: 82, age: 27 },
        { name: "랑달 콜로 무아니", position: "FW", rating: 81, age: 24 },
        { name: "세니 마율루", position: "DF", rating: 75, age: 23 },
        { name: "누누 멘데스", position: "DF", rating: 82, age: 21 },
        { name: "브래들리 바르콜라", position: "FW", rating: 74, age: 22 },
        { name: "워렌 자이르에메리", position: "MF", rating: 77, age: 18 },
        { name: "루카스 베라우두", position: "MF", rating: 72, age: 20 },
        { name: "밀란 슈크리니아르", position: "DF", rating: 84, age: 28 },
        { name: "마트베이 사포노프", position: "GK", rating: 75, age: 29 },
        { name: "크바라츠헬리아", position: "FW", rating: 90, age: 22 },
        { name: "요람 자그", position: "DF", rating: 70, age: 21 },
        { name: "이브라힘 음바예", position: "FW", rating: 73, age: 22 },
        { name: "주앙 네베스", position: "MF", rating: 78, age: 23 },
        { name: "아르나우 테나스", position: "GK", rating: 76, age: 22 }
    ],
    leverkusen: [
        { name: "루카시 흐라데츠키", position: "GK", rating: 85, age: 31 },
        { name: "피에로 인카피에", position: "DF", rating: 78, age: 25 },
        { name: "조나탕 타", position: "DF", rating: 82, age: 29 },
        { name: "요나스 호프만", position: "FW", rating: 80, age: 30 },
        { name: "로베르트 안드리히", position: "MF", rating: 79, age: 27 },
        { name: "플로리안 비르츠", position: "MF", rating: 88, age: 20 },
        { name: "마르탱 테리에", position: "FW", rating: 81, age: 27 },
        { name: "에드몽 탑소바", position: "DF", rating: 81, age: 24 },
        { name: "아르투르", position: "FW", rating: 76, age: 26 },
        { name: "파트리크 시크", position: "FW", rating: 84, age: 28 },
        { name: "마테이 코바르시", position: "DF", rating: 75, age: 23 },
        { name: "네이선 텔러", position: "FW", rating: 77, age: 25 },
        { name: "알렉스 그리말도", position: "DF", rating: 79, age: 28 },
        { name: "아민 아들리", position: "FW", rating: 78, age: 26 },
        { name: "빅터 보니페이스", position: "MF", rating: 74, age: 22 },
        { name: "노르디 무키엘레", position: "DF", rating: 82, age: 25 },
        { name: "알레시 가르시아", position: "DF", rating: 76, age: 24 },
        { name: "에세키엘 팔라시오스", position: "FW", rating: 75, age: 23 },
        { name: "제레미 프림퐁", position: "DF", rating: 77, age: 27 },
        { name: "그라니트 자카", position: "MF", rating: 83, age: 31 },
        { name: "니클라스 롬브", position: "DF", rating: 72, age: 24 },
        { name: "사디크 포파나", position: "FW", rating: 74, age: 23 },
        { name: "주누엘 벨로시앙", position: "DF", rating: 73, age: 25 },
        { name: "아이만 아우리르", position: "FW", rating: 70, age: 22 }
    ],
    dortmund: [
        { name: "그레고어 코벨", position: "GK", rating: 84, age: 25 },
        { name: "얀 코투", position: "DF", rating: 77, age: 26 },
        { name: "발데마르 안톤", position: "DF", rating: 76, age: 24 },
        { name: "니코 슐로터베크", position: "DF", rating: 82, age: 24 },
        { name: "라미 벤세바이니", position: "DF", rating: 80, age: 28 },
        { name: "지오바니 레이나", position: "MF", rating: 81, age: 21 },
        { name: "펠릭스 은메차", position: "FW", rating: 79, age: 22 },
        { name: "세루 기라시", position: "FW", rating: 77, age: 26 },
        { name: "율리안 브란트", position: "MF", rating: 83, age: 27 },
        { name: "파스칼 그로스", position: "MF", rating: 78, age: 28 },
        { name: "막시밀리안 바이어", position: "DF", rating: 76, age: 26 },
        { name: "쥘리앵 듀렁빌", position: "DF", rating: 75, age: 25 },
        { name: "마르셀 자비처", position: "DF", rating: 74, age: 27 },
        { name: "도니얼 말런", position: "FW", rating: 78, age: 25 },
        { name: "엠레 잔", position: "MF", rating: 84, age: 30 },
        { name: "니클라스 쥘레", position: "DF", rating: 83, age: 29 },
        { name: "율리안 뤼에르손", position: "DF", rating: 73, age: 23 },
        { name: "카림 아데예미", position: "FW", rating: 79, age: 22 },
        { name: "실라스 오스트르진스키", position: "DF", rating: 72, age: 21 },
        { name: "알렉산더 마이어", position: "GK", rating: 75, age: 32 },
        { name: "마르셀 로트카", position: "GK", rating: 71, age: 24 },
        { name: "콜 캠벨", position: "FW", rating: 70, age: 23 },
        { name: "키엘 베티엔", position: "DF", rating: 68, age: 25 },
        { name: "제이미 기튼스", position: "FW", rating: 69, age: 20 }
    ],
    newCastle: [
        { name: "두브라프카", position: "GK", rating: 85, age: 35 },
        { name: "트리피어", position: "DF", rating: 83, age: 34 },
        { name: "보트만", position: "DF", rating: 82, age: 24 },
        { name: "셰어", position: "DF", rating: 80, age: 32 },
        { name: "라셀스", position: "DF", rating: 81, age: 31 },
        { name: "조엘린통", position: "MF", rating: 80, age: 28 },
        { name: "토날리", position: "MF", rating: 84, age: 24 },
        { name: "윌슨", position: "FW", rating: 82, age: 32 },
        { name: "고든", position: "FW", rating: 79, age: 23 },
        { name: "반스", position: "FW", rating: 78, age: 26 },
        { name: "타겟", position: "DF", rating: 76, age: 29 },
        { name: "이사크", position: "FW", rating: 84, age: 25 },
        { name: "크라프트", position: "DF", rating: 78, age: 30 },
        { name: "오술라", position: "FW", rating: 73, age: 21 },
        { name: "닉 포프", position: "GK", rating: 78, age: 33 },
        { name: "홀", position: "DF", rating: 74, age: 20 },
        { name: "리브라멘토", position: "DF", rating: 75, age: 22 },
        { name: "포프", position: "GK", rating: 82, age: 32 },
        { name: "머피", position: "MF", rating: 76, age: 29 },
        { name: "알미론", position: "MF", rating: 82, age: 30 },
        { name: "켈리", position: "DF", rating: 73, age: 26 },
        { name: "러디", position: "GK", rating: 75, age: 38 },
        { name: "윌록", position: "MF", rating: 75, age: 25 },
        { name: "길레스피", position: "GK", rating: 74, age: 32 },
        { name: "번", position: "DF", rating: 79, age: 32 },
        { name: "롱스태프", position: "MF", rating: 76, age: 27 },
        { name: "A. 머피", position: "DF", rating: 72, age: 20 },
        { name: "브루누", position: "MF", rating: 81, age: 27 },
        { name: "L. 마일리", position: "MF", rating: 70, age: 18 }
    ],
    asRoma: [
        { name: "앙헬리뇨", position: "DF", rating: 75, age: 28 },
        { name: "은디카", position: "DF", rating: 80, age: 27 },
        { name: "도우비크", position: "FW", rating: 76, age: 29 },
        { name: "압둘하미드", position: "DF", rating: 74, age: 29 },
        { name: "쇼무로도프", position: "FW", rating: 77, age: 27 },
        { name: "후멜스", position: "DF", rating: 81, age: 35 },
        { name: "파레데스", position: "MF", rating: 79, age: 28 },
        { name: "코네", position: "MF", rating: 76, age: 24 },
        { name: "소울레", position: "FW", rating: 72, age: 22 },
        { name: "첼리크", position: "DF", rating: 75, age: 25 },
        { name: "디발라", position: "FW", rating: 90, age: 30 },
        { name: "에르모소", position: "DF", rating: 77, age: 29 },
        { name: "달", position: "DF", rating: 74, age: 23 },
        { name: "르페", position: "MF", rating: 70, age: 21 },
        { name: "발단치", position: "MF", rating: 72, age: 20 },
        { name: "살레마커스", position: "MF", rating: 71, age: 26 },
        { name: "잘레프스키", position: "MF", rating: 69, age: 22 },
        { name: "피실리", position: "MF", rating: 70, age: 24 },
        { name: "B. 상가레", position: "DF", rating: 75, age: 25 },
        { name: "레나토 벨루치", position: "MF", rating: 72, age: 27 },
        { name: "엘샤라위", position: "FW", rating: 82, age: 30 },
        { name: "라이언", position: "FW", rating: 73, age: 21 },
        { name: "스빌라르", position: "GK", rating: 71, age: 24 }
    ],
    chelsea: [
        { name: "산체스", position: "GK", rating: 80, age: 30 },
        { name: "디사시", position: "DF", rating: 79, age: 25 },
        { name: "쿠쿠레야", position: "DF", rating: 78, age: 25 },
        { name: "토신", position: "DF", rating: 75, age: 24 },
        { name: "B. 바디아실", position: "DF", rating: 80, age: 22 },
        { name: "콜윌", position: "DF", rating: 76, age: 23 },
        { name: "네투", position: "GK", rating: 75, age: 29 },
        { name: "엔소", position: "MF", rating: 85, age: 22 },
        { name: "무드리크", position: "FW", rating: 81, age: 24 },
        { name: "마두에케", position: "FW", rating: 77, age: 21 },
        { name: "요르겐센", position: "MF", rating: 74, age: 26 },
        { name: "베티넬리", position: "GK", rating: 72, age: 31 },
        { name: "주앙 펠릭스", position: "FW", rating: 84, age: 23 },
        { name: "N. 잭슨", position: "FW", rating: 78, age: 22 },
        { name: "추쿠에메카", position: "MF", rating: 76, age: 20 },
        { name: "은쿤쿠", position: "MF", rating: 82, age: 25 },
        { name: "산초", position: "FW", rating: 80, age: 24 },
        { name: "파머", position: "GK", rating: 70, age: 22 },
        { name: "칠웰", position: "DF", rating: 81, age: 26 },
        { name: "듀스버리홀", position: "MF", rating: 75, age: 23 },
        { name: "제임스", position: "DF", rating: 84, age: 23 },
        { name: "카이세도", position: "MF", rating: 80, age: 21 },
        { name: "귀스토", position: "DF", rating: 76, age: 22 },
        { name: "포파나", position: "DF", rating: 78, age: 22 },
        { name: "카사데이", position: "MF", rating: 72, age: 20 },
        { name: "조지", position: "MF", rating: 71, age: 26 },
        { name: "아체암퐁", position: "DF", rating: 74, age: 25 },
        { name: "데이비드", position: "MF", rating: 73, age: 22 },
        { name: "켈리먼", position: "FW", rating: 70, age: 21 },
        { name: "마르크 기우", position: "DF", rating: 72, age: 24 },
        { name: "헤나투 베이가", position: "MF", rating: 73, age: 22 },
        { name: "라비아", position: "MF", rating: 75, age: 26 },
        { name: "베리스트룀", position: "FW", rating: 71, age: 21 }
    ],
    atMadrid: [
        { name: "J. 무소", position: "GK", rating: 75, age: 30 },
        { name: "J. M. 히메네스", position: "DF", rating: 80, age: 28 },
        { name: "아스필리쿠에타", position: "DF", rating: 82, age: 34 },
        { name: "갤러거", position: "MF", rating: 78, age: 23 },
        { name: "R. 데 파울", position: "MF", rating: 80, age: 29 },
        { name: "코케", position: "MF", rating: 84, age: 31 },
        { name: "그리즈만", position: "FW", rating: 89, age: 33 },
        { name: "바리오스", position: "MF", rating: 76, age: 25 },
        { name: "쇠를로트", position: "FW", rating: 79, age: 26 },
        { name: "코레아", position: "FW", rating: 79, age: 28 },
        { name: "S. 리누", position: "GK", rating: 72, age: 25 },
        { name: "오블락", position: "GK", rating: 90, age: 31 },
        { name: "M. 요렌테", position: "DF", rating: 81, age: 29 },
        { name: "랑글레", position: "DF", rating: 77, age: 27 },
        { name: "몰리나", position: "DF", rating: 75, age: 32 },
        { name: "리켈메", position: "FW", rating: 78, age: 24 },
        { name: "J. 알바레스", position: "FW", rating: 80, age: 22 },
        { name: "비첼", position: "MF", rating: 79, age: 30 },
        { name: "하비 갈란", position: "MF", rating: 73, age: 26 },
        { name: "줄리아노", position: "MF", rating: 72, age: 27 },
        { name: "헤이닐두", position: "FW", rating: 71, age: 23 },
        { name: "르노르망", position: "DF", rating: 82, age: 25 }
    ],
    napoli: [
        { name: "메렛", position: "GK", rating: 80, age: 30 },
        { name: "부온조르노", position: "DF", rating: 83, age: 26 },
        { name: "제주스", position: "DF", rating: 76, age: 28 },
        { name: "길모어", position: "MF", rating: 80, age: 22 },
        { name: "네리스", position: "FW", rating: 79, age: 24 },
        { name: "맥토미니", position: "MF", rating: 82, age: 26 },
        { name: "루카쿠", position: "FW", rating: 83, age: 30 },
        { name: "라흐마니", position: "DF", rating: 84, age: 29 },
        { name: "콘티니", position: "DF", rating: 73, age: 25 },
        { name: "라파 마린", position: "MF", rating: 72, age: 27 },
        { name: "M. 올리베라", position: "MF", rating: 77, age: 28 },
        { name: "시메오네", position: "FW", rating: 80, age: 28 },
        { name: "포포비치", position: "GK", rating: 70, age: 25 },
        { name: "폴리타노", position: "FW", rating: 79, age: 29 },
        { name: "디 로렌초", position: "DF", rating: 82, age: 30 },
        { name: "카프릴레", position: "DF", rating: 74, age: 25 },
        { name: "은곤게", position: "MF", rating: 72, age: 24 },
        { name: "마초키", position: "DF", rating: 71, age: 22 },
        { name: "스피나촐라", position: "DF", rating: 78, age: 30 },
        { name: "로보트카", position: "MF", rating: 75, age: 26 },
        { name: "라스파도리", position: "FW", rating: 80, age: 25 },
        { name: "폴로룬쇼", position: "FW", rating: 76, age: 24 },
        { name: "잠보-앙귀사", position: "MF", rating: 78, age: 23 },
        { name: "마리우 후이", position: "DF", rating: 76, age: 26 }
    ]
};
