// 전역 변수
let gameState = {
    selectedTeam: null,
    selectedTeamData: null,
    league: null,
    season: 1,
    matchesPlayed: 0,
    funds: 1000,
    morale: 50,
    currentTactic: '게겐프레싱',
    formation: {
        'pos-gk': null,
        'pos-df1': null,
        'pos-df2': null,
        'pos-df3': null,
        'pos-df4': null,
        'pos-mf1': null,
        'pos-mf2': null,
        'pos-mf3': null,
        'pos-fw1': null,
        'pos-fw2': null,
        'pos-fw3': null
    },
    sponsors: {
        current: null,
        remainingGames: 0
    },
    leagueTables: {
        1: [],
        2: [],
        3: []
    },
    transferMarket: [],
    statistics: {
        goals: 0,
        assists: 0,
        wins: 0,
        draws: 0,
        losses: 0
    }
};

// 팀 데이터 (일부만 표시, 실제로는 더 많음)
const superLeagueTeams = {
    // 1부 리그
    "바르셀로나": {
        league: 1,
        players: [
            { name: "페드리", position: "MF", country: "스페인", age: 22, rating: 92 },
            { name: "로베르트 레반도프스키", position: "FW", country: "폴란드", age: 36, rating: 92 },
            { name: "라민 야말", position: "FW", country: "스페인", age: 18, rating: 94 },
            { name: "하피냐", position: "FW", country: "브라질", age: 28, rating: 95 },
            { name: "이냐키 페냐", position: "GK", country: "스페인", age: 26, rating: 73 }
        ],
        description: "꿈과 열정이 살아 숨쉬는 카탈루냐의 자존심"
    },
    
    "레알 마드리드": {
        league: 1,
        players: [
            { name: "티보 쿠르투아", position: "GK", country: "벨기에", age: 33, rating: 85 },
            { name: "주드 벨링엄", position: "MF", country: "잉글랜드", age: 22, rating: 92 },
            { name: "비니시우스 주니오르", position: "FW", country: "브라질", age: 25, rating: 93 },
            { name: "킬리안 음바페", position: "FW", country: "프랑스", age: 26, rating: 94 },
            { name: "페데리코 발베르데", position: "MF", country: "우루과이", age: 27, rating: 92 }
        ],
        description: "왕실의 위엄을 지닌 세계 최고의 클럽"
    },

    "FC 서울": {
        league: 3,
        players: [
            { name: "이상민", position: "DF", country: "대한민국", age: 27, rating: 75 },
            { name: "야잔", position: "DF", country: "요르단", age: 29, rating: 78 },
            { name: "정승원", position: "MF", country: "대한민국", age: 28, rating: 79 },
            { name: "린가드", position: "MF", country: "잉글랜드", age: 32, rating: 82 },
            { name: "천성훈", position: "FW", country: "대한민국", age: 24, rating: 72 }
        ],
        description: "대한민국 수도의 자존심, 끊임없는 도전정신"
    }
};

// 리그별 팀 목록
const leagueTeams = {
    1: ["바르셀로나", "레실 마드리드", "맨체스터 시티", "맨체스터 유나이티드", "리버풀", "토트넘 홋스퍼", "파리 생제르맹", "AC 밀란", "인터 밀란", "아스널", "나폴리", "첼시", "바이에른 뮌헨", "아틀레티코 마드리드", "도르트문트"],
    2: ["유벤투스", "뉴캐슬 유나이티드", "아스톤 빌라", "라이프치히", "세비야", "아약스", "AS 로마", "레버쿠젠", "스포르팅 CP", "벤피카", "셀틱", "페예노르트", "PSV", "올랭피크 드 마르세유"],
    3: ["FC 서울", "갈라타사라이", "알 힐랄", "알 이티하드", "알 나스르", "아르헨티나 연합", "미국 연합", "멕시코 연합", "브라질 연합", "전북 현대", "울산 현대", "포항 스틸러스", "광주 FC", "리옹"]
};

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    showTeamSelection();
    initializeTransferMarket();
    initializeTactics();
    initializeSponsors();
    initializeLeagueTables();
}

function showTeamSelection() {
    const firstDiv = document.getElementById('firstDivisionTeams');
    const secondDiv = document.getElementById('secondDivisionTeams');
    const thirdDiv = document.getElementById('thirdDivisionTeams');
    
    // 1부 리그 팀들
    leagueTeams[1].forEach(teamName => {
        if (superLeagueTeams[teamName]) {
            const teamCard = createTeamCard(teamName, superLeagueTeams[teamName], 1);
            firstDiv.appendChild(teamCard);
        }
    });
    
    // 2부 리그 팀들
    leagueTeams[2].forEach(teamName => {
        if (superLeagueTeams[teamName]) {
            const teamCard = createTeamCard(teamName, superLeagueTeams[teamName], 2);
            secondDiv.appendChild(teamCard);
        }
    });
    
    // 3부 리그 팀들
    leagueTeams[3].forEach(teamName => {
        if (superLeagueTeams[teamName]) {
            const teamCard = createTeamCard(teamName, superLeagueTeams[teamName], 3);
            thirdDiv.appendChild(teamCard);
        }
    });
}

function createTeamCard(teamName, teamData, league) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.dataset.team = teamName;
    card.dataset.league = league;
    
    const avgRating = teamData.players.reduce((sum, player) => sum + player.rating, 0) / teamData.players.length;
    const stars = '★'.repeat(Math.round(avgRating / 20));
    
    card.innerHTML = `
        <h3>${teamName}</h3>
        <p>"${teamData.description}"</p>
        <div class="team-rating">${stars}</div>
    `;
    
    card.addEventListener('click', () => selectTeam(teamName, teamData, league));
    return card;
}

function selectTeam(teamName, teamData, league) {
    gameState.selectedTeam = teamName;
    gameState.selectedTeamData = teamData;
    gameState.league = league;
    gameState.funds = 1000 + (4 - league) * 500; // 상위 리그일수록 더 많은 자금
    
    document.getElementById('teamSelectionScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    
    updateUI();
    setupFormation();
    loadLeagueTable();
    generateNews(`[오피셜] ${teamName}의 새로운 감독이 취임했습니다!`, 
                `${teamName}은 새로운 시즌을 앞두고 새로운 감독과 함께 도전에 나섭니다. 팬들의 큰 기대를 받고 있습니다.`, 
                `#${teamName.replace(/\s+/g, '')} #새감독 #새시즌`);
}

function updateUI() {
    document.getElementById('teamName').textContent = gameState.selectedTeam;
    document.getElementById('funds').textContent = `자금: ${gameState.funds}억원`;
    document.getElementById('morale').textContent = `사기: ${gameState.morale}`;
    document.getElementById('currentSponsor').textContent = `스폰서: ${gameState.sponsors.current || '없음'}`;
}

function setupFormation() {
    const squadList = document.getElementById('squadList');
    squadList.innerHTML = '';
    
    gameState.selectedTeamData.players.forEach((player, index) => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.dataset.playerIndex = index;
        
        playerItem.innerHTML = `
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-details">${player.position} • ${player.country} • ${player.age}세</div>
            </div>
            <div class="player-rating">${player.rating}</div>
        `;
        
        playerItem.addEventListener('click', () => showPlayerSelection(player, index));
        squadList.appendChild(playerItem);
    });
}

function showPlayerSelection(player, playerIndex) {
    const modal = document.getElementById('playerSelectModal');
    const availablePlayers = document.getElementById('availablePlayers');
    
    // 해당 포지션의 빈 자리 찾기
    const availablePositions = [];
    Object.keys(gameState.formation).forEach(posId => {
        const position = posId.split('-')[1];
        if ((position === 'gk' && player.position === 'GK') ||
            (position === 'df' && player.position === 'DF') ||
            (position === 'mf' && player.position === 'MF') ||
            (position === 'fw' && player.position === 'FW')) {
            availablePositions.push(posId);
        }
    });
    
    availablePlayers.innerHTML = '';
    availablePositions.forEach(posId => {
        const posBtn = document.createElement('button');
        posBtn.className = 'action-btn';
        posBtn.textContent = `${posId.toUpperCase()}에 배치`;
        posBtn.addEventListener('click', () => {
            placePlayer(posId, player, playerIndex);
            modal.classList.remove('active');
        });
        availablePlayers.appendChild(posBtn);
    });
    
    modal.classList.add('active');
}

function placePlayer(positionId, player, playerIndex) {
    gameState.formation[positionId] = playerIndex;
    const posSlot = document.getElementById(positionId);
    posSlot.querySelector('.player-slot').innerHTML = `
        <div style="font-size: 0.7em; font-weight: bold;">${player.name}</div>
        <div style="font-size: 0.6em;">${player.rating}</div>
    `;
    posSlot.style.background = 'rgba(255, 215, 0, 0.3)';
}

function setupEventListeners() {
    // 탭 버튼 이벤트
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // 모달 닫기
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });
    
    // 리그 선택 버튼
    document.querySelectorAll('.league-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const league = parseInt(e.target.dataset.league);
            showLeagueTable(league);
            
            // 활성 버튼 변경
            document.querySelectorAll('.league-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    // 경기 시작 버튼
    document.getElementById('startMatchBtn').addEventListener('click', startMatch);
    
    // 저장/불러오기 버튼
    document.getElementById('saveGameBtn').addEventListener('click', saveGame);
    document.getElementById('loadGameBtn').addEventListener('click', () => {
        document.getElementById('loadGameFile').click();
    });
    document.getElementById('loadGameFile').addEventListener('change', loadGame);
}

function switchTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // 탭별 초기화
    switch(tabName) {
        case 'league':
            loadLeagueTable();
            break;
        case 'transfer':
            loadTransferMarket();
            break;
        case 'tactics':
            loadTactics();
            break;
        case 'sponsors':
            loadSponsors();
            break;
        case 'sns':
            loadNews();
            break;
        case 'stats':
            loadStatistics();
            break;
    }
}

function initializeLeagueTables() {
    // 각 리그별로 팀 초기화
    for (let league = 1; league <= 3; league++) {
        gameState.leagueTables[league] = leagueTeams[league].map(teamName => ({
            name: teamName,
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0
        }));
    }
}

function loadLeagueTable() {
    showLeagueTable(gameState.league);
}

function showLeagueTable(league) {
    const tableContainer = document.getElementById('leagueTable');
    const table = gameState.leagueTables[league];
    
    // 순위 정렬
    const sortedTable = [...table].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
    });
    
    let tableHTML = `
        <div class="table-row table-header">
            <div>순위</div>
            <div>팀명</div>
            <div>경기</div>
            <div>승</div>
            <div>무</div>
            <div>패</div>
            <div>승점</div>
        </div>
    `;
    
    sortedTable.forEach((team, index) => {
        let rowClass = 'table-row';
        if (team.name === gameState.selectedTeam) rowClass += ' my-team';
        if (index < 2) rowClass += ' promotion';
        if (index >= sortedTable.length - 2) rowClass += ' relegation';
        
        tableHTML += `
            <div class="${rowClass}">
                <div>${index + 1}</div>
                <div>${team.name}</div>
                <div>${team.played}</div>
                <div>${team.wins}</div>
                <div>${team.draws}</div>
                <div>${team.losses}</div>
                <div>${team.points}</div>
            </div>
        `;
    });
    
    tableContainer.innerHTML = tableHTML;
}

function saveGame() {
    const saveData = {
        gameState: gameState,
        timestamp: new Date().toISOString(),
        version: "1.0"
    };
    
    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${gameState.selectedTeam}_${new Date().toLocaleDateString()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showNotification("게임이 저장되었습니다!");
}

function loadGame(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const saveData = JSON.parse(e.target.result);
            gameState = saveData.gameState;
            
            document.getElementById('teamSelectionScreen').classList.remove('active');
            document.getElementById('gameScreen').classList.add('active');
            
            updateUI();
            setupFormation();
            loadLeagueTable();
            
            showNotification("게임이 불러와졌습니다!");
        } catch (error) {
            showNotification("파일을 불러오는데 실패했습니다.");
        }
    };
    reader.readAsText(file);
}

function showNotification(message) {
    const modal = document.getElementById('notificationModal');
    const content = document.getElementById('notificationContent');
    content.innerHTML = `<h3>${message}</h3>`;
    modal.classList.add('active');
    
    setTimeout(() => {
        modal.classList.remove('active');
    }, 2000);
}

// 간단한 더미 함수들 (다른 모듈에서 구현될 예정)
function initializeTransferMarket() {}
function loadTransferMarket() {}
function initializeTactics() {}
function loadTactics() {}
function initializeSponsors() {}
function loadSponsors() {}
function loadNews() {}
function loadStatistics() {}
function startMatch() {
    showNotification("경기 시뮬레이션 기능은 matchEngine.js에서 구현됩니다.");
}
function generateNews() {}

console.log("Football Manager Game initialized!");
