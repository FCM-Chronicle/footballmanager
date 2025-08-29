// 경기 시뮬레이션 엔진

let matchState = {
    isActive: false,
    currentMinute: 0,
    homeTeam: null,
    awayTeam: null,
    homeScore: 0,
    awayScore: 0,
    events: [],
    matchInterval: null,
    homeFormation: [],
    awayFormation: []
};

// 골 표현 템플릿
const goalExpressions = [
    "{scorer}의 환상적인 골! {assist}의 절묘한 패스를 받아 완벽한 마무리!",
    "{scorer}가 골망을 흔듭니다! {assist}가 어시스트를 기록했습니다!",
    "골! {scorer}의 강력한 슛! {assist}의 크로스가 빛을 발했습니다!",
    "{scorer}의 침착한 마무리! {assist}와의 연계플레이가 인상적입니다!",
    "멋진 골! {scorer}가 {assist}의 패스를 받아 골키퍼를 제쳤습니다!",
    "{scorer}의 예술적인 골! {assist}의 스루패스가 완벽했습니다!",
    "골! {scorer}의 정확한 슛! {assist}가 기가 막힌 어시스트를 했습니다!",
    "{scorer}가 골을 터뜨립니다! {assist}의 환상적인 플레이메이킹!",
    "골네트가 흔들립니다! {scorer}의 날카로운 마무리! {assist}가 킬패스를 선사했습니다!",
    "{scorer}의 완벽한 타이밍! {assist}와의 호흡이 일품입니다!",
    "멋진 연계골! {scorer}가 {assist}의 센스있는 패스를 골로 연결시켰습니다!",
    "{scorer}의 클래스가 돋보이는 골! {assist}의 어시스트도 빛났습니다!",
    "골! {scorer}가 침착하게 마무리했습니다! {assist}의 크로스가 정확했습니다!",
    "{scorer}의 강력한 중거리슛! {assist}가 공간을 만들어줬습니다!",
    "환상적인 골! {scorer}의 개인기가 돋보였습니다! {assist}가 기회를 만들었습니다!"
];

// 패스 표현 템플릿
const passExpressions = [
    "안정적인 패스 플레이가 이어집니다.",
    "중원에서 볼을 돌리고 있습니다.",
    "측면으로 볼이 전개됩니다.",
    "백패스로 템포를 조절합니다.",
    "짧은 패스로 빌드업을 시도합니다.",
    "롱패스로 전방을 노립니다.",
    "크로스필드 패스가 나갑니다.",
    "원터치 패스로 연결됩니다.",
    "스위칭 플레이로 측면을 바꿉니다.",
    "킬패스를 시도했지만 막혔습니다.",
    "스루패스가 시도되었습니다.",
    "백힐패스로 상대를 제쳤습니다.",
    "헤더로 볼을 연결합니다.",
    "가슴트래핑 후 패스합니다.",
    "발리패스가 나갑니다."
];

// 기타 이벤트 표현
const eventExpressions = {
    foul: [
        "파울이 선언되었습니다.",
        "거친 태클로 파울입니다.",
        "반칙으로 경기가 중단됩니다.",
        "위험한 플레이로 파울이 주어졌습니다."
    ],
    throwin: [
        "터치라인 밖으로 나가 스로인입니다.",
        "사이드라인을 벗어나 스로인이 주어집니다.",
        "볼이 아웃되어 스로인입니다."
    ],
    goalkick: [
        "골키퍼가 골킥을 준비합니다.",
        "골라인 밖으로 나가 골킥입니다.",
        "골키퍼의 골킥으로 재개됩니다."
    ],
    corner: [
        "코너킥이 주어집니다!",
        "골라인 밖으로 나가 코너킥입니다!",
        "절호의 코너킥 찬스입니다!"
    ]
};

function startMatch() {
    if (!gameState.selectedTeam) return;
    
    // 다음 상대 선정 (간단히 랜덤으로)
    const currentLeague = gameState.leagueTables[gameState.league];
    const opponents = currentLeague.filter(team => team.name !== gameState.selectedTeam);
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    
    matchState.homeTeam = gameState.selectedTeam;
    matchState.awayTeam = opponent.name;
    matchState.homeScore = 0;
    matchState.awayScore = 0;
    matchState.currentMinute = 0;
    matchState.events = [];
    matchState.isActive = true;
    
    // UI 업데이트
    document.getElementById('nextMatchInfo').style.display = 'none';
    document.getElementById('startMatchBtn').style.display = 'none';
    document.getElementById('matchSimulation').classList.add('active');
    
    updateMatchUI();
    
    // 경기 시작
    matchState.matchInterval = setInterval(simulateMatchMinute, 1000);
}

function simulateMatchMinute() {
    matchState.currentMinute++;
    
    // 경기 이벤트 발생 확률 계산
    simulateEvents();
    
    updateMatchUI();
    
    // 90분 종료
    if (matchState.currentMinute >= 90) {
        endMatch();
    }
}

function simulateEvents() {
    const rand = Math.random() * 100;
    
    // 골 (기본 5% + 팀 능력치에 따른 추가 확률)
    if (rand < getGoalProbability()) {
        simulateGoal();
    }
    // 패스 (80%)
    else if (rand < 85) {
        addMatchEvent(getRandomFromArray(passExpressions), 'pass');
    }
    // 파울 (5%)
    else if (rand < 90) {
        addMatchEvent(getRandomFromArray(eventExpressions.foul), 'foul');
    }
    // 스로인 (4%)
    else if (rand < 94) {
        addMatchEvent(getRandomFromArray(eventExpressions.throwin), 'throwin');
    }
    // 골킥 (3%)
    else if (rand < 97) {
        addMatchEvent(getRandomFromArray(eventExpressions.goalkick), 'goalkick');
    }
    // 코너킥 (3%)
    else if (rand < 100) {
        addMatchEvent(getRandomFromArray(eventExpressions.corner), 'corner');
    }
}

function getGoalProbability() {
    let baseProbability = 5;
    
    // 내 팀의 평균 능력치에 따른 추가 확률
    if (gameState.selectedTeamData && gameState.selectedTeamData.players) {
        const avgRating = gameState.selectedTeamData.players.reduce((sum, p) => sum + p.rating, 0) / gameState.selectedTeamData.players.length;
        
        if (avgRating >= 90) baseProbability += 3.5;
        else if (avgRating >= 85) baseProbability += 2;
        else if (avgRating >= 75) baseProbability += 1;
    }
    
    return baseProbability;
}

function simulateGoal() {
    const isHomeGoal = Math.random() < 0.5; // 50% 확률로 홈/어웨이 골
    const scoringTeam = isHomeGoal ? gameState.selectedTeam : matchState.awayTeam;
    
    if (isHomeGoal) {
        matchState.homeScore++;
        simulateMyTeamGoal();
    } else {
        matchState.awayScore++;
        simulateOpponentGoal();
    }
}

function simulateMyTeamGoal() {
    const players = gameState.selectedTeamData.players;
    
    // 포지션별 골 확률
    const goalProbabilities = {
        'FW': 70,
        'MF': 20,
        'DF': 10,
        'GK': 0
    };
    
    // 가중치를 고려한 득점자 선택
    const eligiblePlayers = players.filter(p => goalProbabilities[p.position] > 0);
    const scorer = selectPlayerByPosition(eligiblePlayers, goalProbabilities);
    
    // 어시스트 (80% 확률)
    let assist = null;
    if (Math.random() < 0.8) {
        const assistPlayers = players.filter(p => p !== scorer && p.position !== 'GK');
        assist = assistPlayers[Math.floor(Math.random() * assistPlayers.length)];
    }
    
    // 골 텍스트 생성
    let goalText = getRandomFromArray(goalExpressions);
    goalText = goalText.replace('{scorer}', scorer.name);
    
    if (assist) {
        goalText = goalText.replace('{assist}', assist.name);
    } else {
        goalText = goalText.replace('{assist}의 ', '').replace('{assist}가 ', '').replace('{assist}', '');
    }
    
    addMatchEvent(goalText, 'goal');
    
    // 통계 업데이트
    updatePlayerStats(scorer, 'goals');
    if (assist) updatePlayerStats(assist, 'assists');
}

function simulateOpponentGoal() {
    addMatchEvent(`${matchState.awayTeam}이 골을 넣었습니다!`, 'goal');
}

function selectPlayerByPosition(players, probabilities) {
    const weightedPlayers = [];
    
    players.forEach(player => {
        const weight = probabilities[player.position] || 0;
        for (let i = 0; i < weight; i++) {
            weightedPlayers.push(player);
        }
    });
    
    return weightedPlayers[Math.floor(Math.random() * weightedPlayers.length)];
}

function addMatchEvent(text, type) {
    const event = {
        minute: matchState.currentMinute,
        text: text,
        type: type
    };
    
    matchState.events.push(event);
    
    const eventsContainer = document.getElementById('matchEvents');
    const eventDiv = document.createElement('div');
    eventDiv.className = `match-event ${type === 'goal' ? 'goal-event' : ''}`;
    eventDiv.innerHTML = `<strong>${matchState.currentMinute}'</strong> ${text}`;
    
    eventsContainer.appendChild(eventDiv);
    eventsContainer.scrollTop = eventsContainer.scrollHeight;
}

function updateMatchUI() {
    document.getElementById('matchTeams').textContent = `${matchState.homeTeam} vs ${matchState.awayTeam}`;
    document.getElementById('matchTime').textContent = `${matchState.currentMinute}분`;
    document.getElementById('matchScore').textContent = `${matchState.homeScore} - ${matchState.awayScore}`;
}

function endMatch() {
    clearInterval(matchState.matchInterval);
    matchState.isActive = false;
    
    // 경기 결과 처리
    const result = getMatchResult();
    updateLeagueTable(result);
    updateTeamStats(result);
    
    // 다른 팀들의 경기도 시뮬레이션
    simulateOtherMatches();
    
    addMatchEvent("경기 종료!", 'end');
    
    // 인터뷰 표시
    setTimeout(() => {
        showPostMatchInterview(result);
    }, 2000);
}

function getMatchResult() {
    if (matchState.homeScore > matchState.awayScore) return 'win';
    if (matchState.homeScore < matchState.awayScore) return 'loss';
    return 'draw';
}

function updateLeagueTable(result) {
    const league = gameState.leagueTables[gameState.league];
    const myTeam = league.find(team => team.name === gameState.selectedTeam);
    const opponent = league.find(team => team.name === matchState.awayTeam);
    
    // 내 팀 업데이트
    myTeam.played++;
    myTeam.goalsFor += matchState.homeScore;
    myTeam.goalsAgainst += matchState.awayScore;
    myTeam.goalDifference = myTeam.goalsFor - myTeam.goalsAgainst;
    
    // 상대팀 업데이트
    opponent.played++;
    opponent.goalsFor += matchState.awayScore;
    opponent.goalsAgainst += matchState.homeScore;
    opponent.goalDifference = opponent.goalsFor - opponent.goalsAgainst;
    
    switch(result) {
        case 'win':
            myTeam.wins++;
            myTeam.points += 3;
            opponent.losses++;
            break;
        case 'loss':
            myTeam.losses++;
            opponent.wins++;
            opponent.points += 3;
            break;
        case 'draw':
            myTeam.draws++;
            myTeam.points++;
            opponent.draws++;
            opponent.points++;
            break;
    }
    
    gameState.matchesPlayed++;
}

function simulateOtherMatches() {
    const league = gameState.leagueTables[gameState.league];
    const otherTeams = league.filter(team => 
        team.name !== gameState.selectedTeam && 
        team.name !== matchState.awayTeam
    );
    
    // 다른 팀들끼리 랜덤 매치 시뮬레이션
    for (let i = 0; i < otherTeams.length; i += 2) {
        if (i + 1 < otherTeams.length) {
            simulateAIMatch(otherTeams[i], otherTeams[i + 1]);
        }
    }
}

function simulateAIMatch(team1, team2) {
    const team1Score = Math.floor(Math.random() * 4);
    const team2Score = Math.floor(Math.random() * 4);
    
    team1.played++;
    team2.played++;
    team1.goalsFor += team1Score;
    team1.goalsAgainst += team2Score;
    team2.goalsFor += team2Score;
    team2.goalsAgainst += team1Score;
    
    team1.goalDifference = team1.goalsFor - team1.goalsAgainst;
    team2.goalDifference = team2.goalsFor - team2.goalsAgainst;
    
    if (team1Score > team2Score) {
        team1.wins++;
        team1.points += 3;
        team2.losses++;
    } else if (team1Score < team2Score) {
        team2.wins++;
        team2.points += 3;
        team1.losses++;
    } else {
        team1.draws++;
        team2.draws++;
        team1.points++;
        team2.points++;
    }
    
    console.log(`${team1.name} ${team1Score} - ${team2Score} ${team2.name}`);
}

function showPostMatchInterview(result) {
    const interview = document.getElementById('postMatchInterview');
    const options = document.getElementById('interviewOptions');
    
    let interviewOptions = [];
    
    switch(result) {
        case 'win':
            interviewOptions = [
                { text: "정말 훌륭한 경기였습니다! 여러분이 자랑스럽습니다!", effect: 10 },
                { text: "팀워크가 빛났습니다! 계속 이렇게 해봅시다!", effect: 5 },
                { text: "몇몇 실수는 아쉬웠습니다. 다음에는 더 집중해야 합니다.", effect: -5 }
            ];
            break;
        case 'loss':
            interviewOptions = [
                { text: "이번 경기는 정말 실망스러웠습니다. 왜 이렇게 했는지 이해가 되지 않습니다!", effect: -10 },
                { text: "이런 경기는 절대 허용할 수 없습니다. 다음에는 더 잘해야 합니다!", effect: -5 },
                { text: "힘든 경기를 치렀지만, 여러분의 노력은 인정합니다. 다음에 더 좋은 결과를 기대합니다.", effect: 5 }
            ];
            break;
        case 'draw':
            interviewOptions = [
                { text: "아쉬운 결과지만, 다음 경기를 위해 더 열심히 준비하겠습니다.", effect: 0 },
                { text: "1점이라도 더 중요합니다. 선수들이 최선을 다했습니다.", effect: 3 },
                { text: "우리는 더 잘할 수 있었습니다. 실망스러운 결과입니다.", effect: -3 }
            ];
            break;
    }
    
    options.innerHTML = '';
    interviewOptions.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'interview-option';
        optionDiv.innerHTML = `
            ${option.text}
            <span class="interview-effect ${option.effect < 0 ? 'negative' : ''}">(사기 ${option.effect > 0 ? '+' : ''}${option.effect})</span>
        `;
        optionDiv.addEventListener('click', () => selectInterviewOption(option.effect));
        options.appendChild(optionDiv);
    });
    
    interview.classList.add('active');
}

function selectInterviewOption(moraleChange) {
    gameState.morale += moraleChange;
    gameState.morale = Math.max(1, Math.min(100, gameState.morale)); // 1-100 범위 제한
    
    updateUI();
    document.getElementById('postMatchInterview').classList.remove('active');
    
    // 스폰서 보상 지급
    if (gameState.sponsors.current) {
        const result = getMatchResult();
        paySponsorsReward(result);
    }
    
    // 선수 성장 처리 (10경기마다)
    if (gameState.matchesPlayed % 10 === 0) {
        processPlayerGrowth();
    }
    
    // 뉴스 생성
    generateMatchNews(getMatchResult());
    
    // UI 리셋
    document.getElementById('matchSimulation').classList.remove('active');
    document.getElementById('nextMatchInfo').style.display = 'block';
    document.getElementById('startMatchBtn').style.display = 'block';
    document.getElementById('matchEvents').innerHTML = '';
}

function updateTeamStats(result) {
    switch(result) {
        case 'win':
            gameState.statistics.wins++;
            break;
        case 'loss':
            gameState.statistics.losses++;
            break;
        case 'draw':
            gameState.statistics.draws++;
            break;
    }
}

function updatePlayerStats(player, statType) {
    if (!gameState.playerStats) gameState.playerStats = {};
    if (!gameState.playerStats[player.name]) {
        gameState.playerStats[player.name] = { goals: 0, assists: 0 };
    }
    gameState.playerStats[player.name][statType]++;
}

function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function paySponsorsReward(result) {
    // 스폰서 모듈에서 구현될 예정
}

function processPlayerGrowth() {
    // 선수 성장 모듈에서 구현될 예정
}

function generateMatchNews(result) {
    // SNS 모듈에서 구현될 예정
}
