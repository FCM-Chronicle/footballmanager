// 경기 시뮬레이션 시스템
class MatchSimulation {
    constructor() {
        this.currentMatch = null;
        this.matchEvents = [];
        this.matchTime = 0;
        this.isSimulating = false;
        this.simulationSpeed = 1000; // 1초 = 1분
        
        // 이벤트 발생 확률
        this.eventProbabilities = {
            goal: 0.05, // 5%
            foul: 0.05, // 5%
            pass: 0.80, // 80%
            throwIn: 0.04, // 4%
            goalKick: 0.03, // 3%
            cornerKick: 0.03 // 3%
        };
        
        // 포지션별 골 확률
        this.goalProbabilityByPosition = {
            FW: 0.70,
            MF: 0.20,
            DF: 0.10,
            GK: 0.00
        };
        
        // 패스 설명 템플릿
        this.passDescriptions = [
            "{team}이 미드필드에서 공을 돌리고 있습니다",
            "{team}의 예리한 패스!",
            "{team}의 후방 빌드업",
            "{team}이 측면으로 볼을 전개합니다",
            "{team}의 정교한 패스 연결",
            "{team}이 중원에서 점유율을 높입니다",
            "{team}의 크로스가 올라갑니다",
            "{team}이 패스를 주고받습니다",
            "{team}의 롱패스 시도!",
            "{team}이 패스로 공격을 전개합니다",
            "{team}의 백패스로 안전하게",
            "{team}이 사이드 체인지를 시도합니다",
            "{team}의 스루패스!",
            "{team}이 천천히 빌드업합니다",
            "{team}의 원터치 패스!"
        ];
    }

    // 경기 시작
    startMatch(opponentTeam) {
        if (!isSquadValid()) {
            alert('스쿼드가 완성되지 않았습니다.');
            return;
        }

        this.currentMatch = {
            homeTeam: gameData.selectedTeam,
            awayTeam: opponentTeam,
            homeScore: 0,
            awayScore: 0,
            homeFormation: this.getTeamFormation(gameData.selectedTeam),
            awayFormation: this.getTeamFormation(opponentTeam)
        };

        this.matchEvents = [];
        this.matchTime = 0;
        this.isSimulating = true;

        this.showMatchModal();
        this.simulateMatch();
    }

    // 팀 포메이션 가져오기
    getTeamFormation(teamKey) {
        if (teamKey === gameData.selectedTeam) {
            return {
                gk: gameData.squad.gk,
                df: [...gameData.squad.df],
                mf: [...gameData.squad.mf],
                fw: [...gameData.squad.fw]
            };
        } else {
            // AI 팀의 경우 랜덤하게 선수 선택
            const teamPlayers = teams[teamKey];
            const gk = teamPlayers.filter(p => p.position === 'GK')[0];
            const defenders = teamPlayers.filter(p => p.position === 'DF').slice(0, 4);
            const midfielders = teamPlayers.filter(p => p.position === 'MF').slice(0, 3);
            const forwards = teamPlayers.filter(p => p.position === 'FW').slice(0, 3);

            return {
                gk: gk,
                df: defenders,
                mf: midfielders,
                fw: forwards
            };
        }
    }

    // 경기 모달 표시
    showMatchModal() {
        const modal = document.getElementById('matchModal');
        modal.classList.add('active');

        document.getElementById('homeTeam').textContent = teamNames[this.currentMatch.homeTeam];
        document.getElementById('awayTeam').textContent = teamNames[this.currentMatch.awayTeam];
        document.getElementById('score').textContent = `${this.currentMatch.homeScore} - ${this.currentMatch.awayScore}`;
        document.getElementById('matchTime').textContent = `${this.matchTime}분`;
        document.getElementById('matchEvents').innerHTML = '';
    }

    // 경기 시뮬레이션 실행
    simulateMatch() {
        if (!this.isSimulating || this.matchTime >= 90) {
            this.endMatch();
            return;
        }

        this.matchTime++;
        document.getElementById('matchTime').textContent = `${this.matchTime}분`;

        // 이벤트 발생 체크
        this.checkForEvents();

        // 다음 분으로 진행
        setTimeout(() => {
            if (this.isSimulating) {
                this.simulateMatch();
            }
        }, this.simulationSpeed);
    }

    // 이벤트 발생 체크
    checkForEvents() {
        const random = Math.random();
        let cumulativeProbability = 0;

        for (const [eventType, probability] of Object.entries(this.eventProbabilities)) {
            cumulativeProbability += probability;
            if (random <= cumulativeProbability) {
                this.handleEvent(eventType);
                break;
            }
        }
    }

    // 이벤트 처리
    handleEvent(eventType) {
        const attackingTeam = Math.random() < 0.5 ? this.currentMatch.homeTeam : this.currentMatch.awayTeam;
        const attackingFormation = attackingTeam === this.currentMatch.homeTeam ? 
            this.currentMatch.homeFormation : this.currentMatch.awayFormation;

        switch (eventType) {
            case 'goal':
                this.handleGoal(attackingTeam, attackingFormation);
                break;
            case 'foul':
                this.handleFoul(attackingTeam);
                break;
            case 'pass':
                this.handlePass(attackingTeam);
                break;
            case 'throwIn':
                this.handleThrowIn(attackingTeam);
                break;
            case 'goalKick':
                this.handleGoalKick(attackingTeam);
                break;
            case 'cornerKick':
                this.handleCornerKick(attackingTeam);
                break;
        }
    }

    // 골 이벤트 처리
    handleGoal(attackingTeam, formation) {
        // 전술 보너스 적용
        const tacticalBonus = this.calculateTacticalBonus(attackingTeam);
        let goalProbability = this.eventProbabilities.goal;

        // 포지션별 골 확률로 득점자 결정
        const scorer = this.selectGoalScorer(formation);
        if (!scorer) return;

        // 선수 능력치에 따른 추가 확률
        const ratingBonus = this.calculateRatingBonus(scorer.rating);
        goalProbability += ratingBonus + tacticalBonus;

        if (Math.random() < goalProbability) {
            // 골 발생
            if (attackingTeam === this.currentMatch.homeTeam) {
                this.currentMatch.homeScore++;
            } else {
                this.currentMatch.awayScore++;
            }

            // 어시스트 선수 선택 (80% 확률)
            let assister = null;
            if (Math.random() < 0.8) {
                assister = this.selectAssister(formation, scorer);
            }

            this.addMatchEvent('goal', `⚽ ${this.matchTime}분: ${scorer.name}이 골을 넣었습니다!${assister ? ` (도움: ${assister.name})` : ''}`, attackingTeam, scorer, assister);

            // 기록 시스템에 추가
            if (typeof recordsSystem !== 'undefined') {
                recordsSystem.addGoal(scorer.name, attackingTeam, 
                    attackingTeam === this.currentMatch.homeTeam ? this.currentMatch.awayTeam : this.currentMatch.homeTeam, 
                    this.matchTime);
                
                if (assister) {
                    recordsSystem.addAssist(assister.name, attackingTeam,
                        attackingTeam === this.currentMatch.homeTeam ? this.currentMatch.awayTeam : this.currentMatch.homeTeam,
                        this.matchTime);
                }
            }

            this.updateScore();
        }
    }

    // 득점자 선택
    selectGoalScorer(formation) {
        const allPlayers = [
            ...formation.fw.filter(p => p),
            ...formation.mf.filter(p => p),
            ...formation.df.filter(p => p)
        ];

        if (allPlayers.length === 0) return null;

        // 포지션별 가중치를 적용하여 선수 선택
        const weightedPlayers = [];
        allPlayers.forEach(player => {
            const weight = this.goalProbabilityByPosition[player.position] || 0.1;
            for (let i = 0; i < weight * 100; i++) {
                weightedPlayers.push(player);
            }
        });

        return weightedPlayers[Math.floor(Math.random() * weightedPlayers.length)];
    }

    // 어시스터 선택
    selectAssister(formation, scorer) {
        const allPlayers = [
            ...formation.fw.filter(p => p && p !== scorer),
            ...formation.mf.filter(p => p && p !== scorer),
            ...formation.df.filter(p => p && p !== scorer)
        ];

        if (allPlayers.length === 0) return null;
        return allPlayers[Math.floor(Math.random() * allPlayers.length)];
    }

    // 파울 이벤트 처리
    handleFoul(attackingTeam) {
        const formation = attackingTeam === this.currentMatch.homeTeam ? 
            this.currentMatch.homeFormation : this.currentMatch.awayFormation;
        
        const allPlayers = [
            ...formation.fw.filter(p => p),
            ...formation.mf.filter(p => p),
            ...formation.df.filter(p => p)
        ];

        if (allPlayers.length > 0) {
            const player = allPlayers[Math.floor(Math.random() * allPlayers.length)];
            this.addMatchEvent('foul', `🟨 ${this.matchTime}분: ${player.name}이 파울을 범했습니다.`, attackingTeam);
        }
    }

    // 패스 이벤트 처리
    handlePass(attackingTeam) {
        const description = this.getRandomElement(this.passDescriptions)
            .replace('{team}', teamNames[attackingTeam]);
        this.addMatchEvent('pass', `📝 ${this.matchTime}분: ${description}`, attackingTeam);
    }

    // 스로인 이벤트 처리
    handleThrowIn(attackingTeam) {
        this.addMatchEvent('throwIn', `↗️ ${this.matchTime}분: ${teamNames[attackingTeam]}의 스로인`, attackingTeam);
    }

    // 골킥 이벤트 처리
    handleGoalKick(attackingTeam) {
        const opposingTeam = attackingTeam === this.currentMatch.homeTeam ? this.currentMatch.awayTeam : this.currentMatch.homeTeam;
        this.addMatchEvent('goalKick', `🥅 ${this.matchTime}분: ${teamNames[opposingTeam]}의 골킥`, opposingTeam);
    }

    // 코너킥 이벤트 처리
    handleCornerKick(attackingTeam) {
        this.addMatchEvent('cornerKick', `📐 ${this.matchTime}분: ${teamNames[attackingTeam]}의 코너킥`, attackingTeam);
    }

    // 전술 보너스 계산
    calculateTacticalBonus(teamKey) {
        if (typeof getTacticalModifiers !== 'function') return 0;

        const modifiers = getTacticalModifiers(teamKey);
        const opponentTeam = teamKey === this.currentMatch.homeTeam ? this.currentMatch.awayTeam : this.currentMatch.homeTeam;
        const opponentModifiers = getTacticalModifiers(opponentTeam);

        if (typeof calculateTacticalBonus === 'function') {
            const advantage = calculateTacticalBonus(modifiers.tactic, opponentModifiers.tactic);
            return advantage / 1000; // 보너스를 확률로 변환
        }

        return 0;
    }

    // 능력치 보너스 계산
    calculateRatingBonus(rating) {
        if (rating >= 90) return 0.035;
        if (rating >= 85) return 0.02;
        if (rating >= 75) return 0.01;
        return 0;
    }

    // 매치 이벤트 추가
    addMatchEvent(type, description, team, player = null, assister = null) {
        const event = {
            type: type,
            description: description,
            minute: this.matchTime,
            team: team,
            player: player,
            assister: assister,
            timestamp: new Date()
        };

        this.matchEvents.push(event);

        // UI 업데이트
        const eventsContainer = document.getElementById('matchEvents');
        const eventDiv = document.createElement('div');
        eventDiv.className = `event ${type}`;
        eventDiv.innerHTML = description;
        eventsContainer.appendChild(eventDiv);
        eventsContainer.scrollTop = eventsContainer.scrollHeight;
    }

    // 점수 업데이트
    updateScore() {
        document.getElementById('score').textContent = `${this.currentMatch.homeScore} - ${this.currentMatch.awayScore}`;
    }

    // 경기 종료
    endMatch() {
        this.isSimulating = false;

        // 경기 결과 처리
        const isWin = this.currentMatch.homeScore > this.currentMatch.awayScore;
        const isDraw = this.currentMatch.homeScore === this.currentMatch.awayScore;

        // 리그 테이블 업데이트
        this.updateLeagueTable();

        // 다른 팀들의 경기 시뮬레이션
        this.simulateOtherMatches();

        // 기록 시스템 업데이트
        if (typeof updateMatchRecords === 'function') {
            updateMatchRecords(
                this.currentMatch.homeTeam,
                this.currentMatch.awayTeam,
                this.currentMatch.homeScore,
                this.currentMatch.awayScore,
                this.matchEvents
            );
        }

        // SNS 시스템 업데이트
        if (typeof updateSNSAfterMatch === 'function') {
            updateSNSAfterMatch(
                this.currentMatch.homeTeam,
                this.currentMatch.awayTeam,
                this.currentMatch.homeScore,
                this.currentMatch.awayScore,
                this.matchEvents
            );
        }

        // 자금 지급
        const earnedMoney = isWin ? 30 : (isDraw ? 15 : 5);
        gameData.teamMoney += earnedMoney;
        gameData.matchesPlayed++;

        // 모달 닫기
        setTimeout(() => {
            document.getElementById('matchModal').classList.remove('active');
            
            // 인터뷰 표시
            setTimeout(() => {
                this.showPostMatchInterview(isWin, isDraw);
            }, 1000);
        }, 3000);

        updateLobbyDisplay();
    }

    // 리그 테이블 업데이트
    updateLeagueTable() {
        const homeTeam = this.currentMatch.homeTeam;
        const awayTeam = this.currentMatch.awayTeam;
        const homeScore = this.currentMatch.homeScore;
        const awayScore = this.currentMatch.awayScore;

        // 홈팀 업데이트
        gameData.leagueTable[homeTeam].matches++;
        gameData.leagueTable[homeTeam].goalsFor += homeScore;
        gameData.leagueTable[homeTeam].goalsAgainst += awayScore;

        // 원정팀 업데이트
        gameData.leagueTable[awayTeam].matches++;
        gameData.leagueTable[awayTeam].goalsFor += awayScore;
        gameData.leagueTable[awayTeam].goalsAgainst += homeScore;

        if (homeScore > awayScore) {
            gameData.leagueTable[homeTeam].wins++;
            gameData.leagueTable[homeTeam].points += 3;
            gameData.leagueTable[awayTeam].losses++;
        } else if (homeScore < awayScore) {
            gameData.leagueTable[awayTeam].wins++;
            gameData.leagueTable[awayTeam].points += 3;
            gameData.leagueTable[homeTeam].losses++;
        } else {
            gameData.leagueTable[homeTeam].draws++;
            gameData.leagueTable[homeTeam].points++;
            gameData.leagueTable[awayTeam].draws++;
            gameData.leagueTable[awayTeam].points++;
        }
    }

    // 다른 팀들의 경기 시뮬레이션
    simulateOtherMatches() {
        const allTeams = Object.keys(teams).filter(team => 
            team !== this.currentMatch.homeTeam && team !== this.currentMatch.awayTeam
        );

        // 나머지 팀들을 랜덤하게 매칭
        const shuffledTeams = [...allTeams].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
            const team1 = shuffledTeams[i];
            const team2 = shuffledTeams[i + 1];
            
            this.simulateAIMatch(team1, team2);
        }

        console.log('다른 팀들의 경기 결과가 시뮬레이션되었습니다.');
    }

    // AI 팀 간 경기 시뮬레이션
    simulateAIMatch(team1, team2) {
        const team1Strength = this.calculateTeamStrength(team1);
        const team2Strength = this.calculateTeamStrength(team2);
        
        // 능력치 차이에 따른 확률 조정
        const strengthDiff = team1Strength - team2Strength;
        let team1WinProb = 0.33 + (strengthDiff / 100);
        team1WinProb = Math.max(0.1, Math.min(0.8, team1WinProb));
        
        const drawProb = 0.3;
        const team2WinProb = 1 - team1WinProb - drawProb;
        
        const random = Math.random();
        let team1Score, team2Score;
        
        if (random < team1WinProb) {
            // team1 승리
            team1Score = Math.floor(Math.random() * 3) + 1;
            team2Score = Math.floor(Math.random() * team1Score);
        } else if (random < team1WinProb + drawProb) {
            // 무승부
            const score = Math.floor(Math.random() * 3);
            team1Score = score;
            team2Score = score;
        } else {
            // team2 승리
            team2Score = Math.floor(Math.random() * 3) + 1;
            team1Score = Math.floor(Math.random() * team2Score);
        }
        
        // 리그 테이블 업데이트
        this.updateAIMatchResult(team1, team2, team1Score, team2Score);
        
        console.log(`${teamNames[team1]} ${team1Score} - ${team2Score} ${teamNames[team2]}`);
    }

    // AI 경기 결과로 리그 테이블 업데이트
    updateAIMatchResult(team1, team2, score1, score2) {
        // team1 업데이트
        gameData.leagueTable[team1].matches++;
        gameData.leagueTable[team1].goalsFor += score1;
        gameData.leagueTable[team1].goalsAgainst += score2;

        // team2 업데이트
        gameData.leagueTable[team2].matches++;
        gameData.leagueTable[team2].goalsFor += score2;
        gameData.leagueTable[team2].goalsAgainst += score1;

        if (score1 > score2) {
            gameData.leagueTable[team1].wins++;
            gameData.leagueTable[team1].points += 3;
            gameData.leagueTable[team2].losses++;
        } else if (score1 < score2) {
            gameData.leagueTable[team2].wins++;
            gameData.leagueTable[team2].points += 3;
            gameData.leagueTable[team1].losses++;
        } else {
            gameData.leagueTable[team1].draws++;
            gameData.leagueTable[team1].points++;
            gameData.leagueTable[team2].draws++;
            gameData.leagueTable[team2].points++;
        }
    }

    // 팀 능력치 계산
    calculateTeamStrength(teamKey) {
        const teamPlayers = teams[teamKey];
        if (!teamPlayers || teamPlayers.length === 0) return 70;
        
        const totalRating = teamPlayers.reduce((sum, player) => sum + player.rating, 0);
        return Math.round(totalRating / teamPlayers.length);
    }

    // 경기 후 인터뷰
    showPostMatchInterview(isWin, isDraw) {
        const modal = document.getElementById('interviewModal');
        const questionElement = document.getElementById('interviewQuestion');
        const optionsElement = document.getElementById('interviewOptions');
        
        let questions, options;
        
        if (isWin) {
            questions = [
                "훌륭한 승리였습니다! 오늘 경기에 대한 소감을 말씀해주세요.",
                "팀의 경기력이 인상적이었습니다. 어떤 점이 승리의 요인이었다고 생각하시나요?",
                "다음 경기에 대한 각오를 들려주세요."
            ];
            options = [
                { text: "정말 훌륭한 경기였습니다! 여러분이 자랑스럽습니다!", effect: 10 },
                { text: "팀워크가 빛났습니다! 계속 이렇게 해봅시다!", effect: 5 },
                { text: "몇몇 실수는 아쉬웠습니다. 다음에는 더 집중해야 합니다.", effect: -5 }
            ];
        } else if (isDraw) {
            questions = [
                "무승부로 경기가 끝났습니다. 오늘 경기를 어떻게 평가하시나요?",
                "아쉬운 결과입니다. 어떤 부분을 개선해야 한다고 생각하시나요?"
            ];
            options = [
                { text: "아쉽지만 최선을 다했습니다. 다음에는 더 좋은 결과를 만들겠습니다.", effect: 0 },
                { text: "운이 따라주지 않았습니다. 우리는 충분히 잘했어요.", effect: 3 },
                { text: "실망스럽습니다. 더 좋은 기회들을 놓쳤네요.", effect: -3 }
            ];
        } else {
            questions = [
                "아쉬운 패배였습니다. 오늘 경기에 대해 어떻게 생각하시나요?",
                "팬들에게 하고 싶은 말씀이 있으시나요?",
                "다음 경기 준비는 어떻게 하실 계획이신가요?"
            ];
            options = [
                { text: "이번 경기는 정말 실망스러웠습니다. 왜 이렇게 했는지 이해가 되지 않습니다!", effect: -10 },
                { text: "이런 경기는 절대 허용할 수 없습니다. 다음에는 더 잘해야 합니다!", effect: -5 },
                { text: "힘든 경기를 치렀지만, 여러분의 노력은 인정합니다. 다음에 더 좋은 결과를 기대합니다.", effect: 5 }
            ];
        }
        
        questionElement.textContent = this.getRandomElement(questions);
        optionsElement.innerHTML = '';
        
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.onclick = () => this.handleInterviewResponse(option.effect);
            optionsElement.appendChild(button);
        });
        
        modal.classList.add('active');
    }

    // 인터뷰 응답 처리
    handleInterviewResponse(moraleEffect) {
        gameData.teamMorale += moraleEffect;
        gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale));
        
        document.getElementById('interviewModal').classList.remove('active');
        
        let message = '';
        if (moraleEffect > 0) {
            message = `팀 사기가 ${moraleEffect}만큼 상승했습니다!`;
        } else if (moraleEffect < 0) {
            message = `팀 사기가 ${Math.abs(moraleEffect)}만큼 하락했습니다.`;
        } else {
            message = '팀 사기에 변화가 없습니다.';
        }
        
        setTimeout(() => {
            alert(message);
            updateLobbyDisplay();
        }, 500);
    }

    // 경기 생략
    skipMatch() {
        if (confirm('경기를 생략하시겠습니까?')) {
            this.simulationSpeed = 50; // 빠르게 진행
        }
    }

    // 랜덤 요소 선택
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 현재 경기 정보 가져오기
    getCurrentMatch() {
        return this.currentMatch;
    }

    // 경기 이벤트 가져오기
    getMatchEvents() {
        return this.matchEvents;
    }
}

// 전역 경기 시뮬레이션 인스턴스
const matchSimulation = new MatchSimulation();

// 경기 시작 함수 (다른 파일에서 호출)
function simulateMatch(opponentTeam) {
    matchSimulation.startMatch(opponentTeam);
}

// 경기 생략 함수
function skipMatch() {
    matchSimulation.skipMatch();
}

// 매치 화면 로드
function loadMatchScreen() {
    const matchContent = document.getElementById('matchContent');
    
    let html = `
        <div class="match-screen-container">
            <div class="match-header">
                <h3>⚽ 경기</h3>
                <div class="current-season-info">
                    <span>시즌 ${gameData.currentSeason} | 경기 ${gameData.matchesPlayed}/36</span>
                </div>
            </div>
            
            <div class="match-preparation">
                <h4>경기 준비</h4>
                <div class="squad-status">
    `;

    // 스쿼드 상태 체크
    const squadStatus = checkSquadStatus();
    
    html += `
                    <div class="status-item ${squadStatus.isValid ? 'valid' : 'invalid'}">
                        <span class="status-icon">${squadStatus.isValid ? '✅' : '❌'}</span>
                        <span>스쿼드: ${squadStatus.isValid ? '완성됨' : '미완성'}</span>
                    </div>
                    <div class="status-detail">
                        ${squadStatus.details.join('<br>')}
                    </div>
                </div>
                
                <div class="team-info-grid">
                    <div class="team-info-card">
                        <h5>내 팀</h5>
                        <div class="team-name">${teamNames[gameData.selectedTeam]}</div>
                        <div class="team-stats">
                            <div>평균 능력치: ${calculateAverageRating(gameData.selectedTeam)}</div>
                            <div>현재 전술: ${tacticsSystem ? tacticsSystem.getTacticInfo(gameData.currentTactic).name : '기본'}</div>
                            <div>팀 사기: ${gameData.teamMorale}</div>
                        </div>
                    </div>
                    
                    <div class="vs-indicator">VS</div>
                    
                    <div class="next-opponent">
                        <h5>다음 상대</h5>
                        <button onclick="selectRandomOpponent()" class="select-opponent-btn">
                            상대 팀 선택
                        </button>
                        <div id="selectedOpponent" class="opponent-info" style="display: none;">
                            <div class="opponent-name"></div>
                            <div class="opponent-stats"></div>
                        </div>
                    </div>
                </div>
                
                <div class="match-actions">
                    <button onclick="startMatchIfReady()" class="start-match-btn" ${!squadStatus.isValid ? 'disabled' : ''}>
                        경기 시작
                    </button>
                    <button onclick="showScreen('squad')" class="prepare-squad-btn">
                        스쿼드 관리
                    </button>
                    <button onclick="showScreen('tactics')" class="tactics-btn">
                        전술 변경
                    </button>
                </div>
            </div>
            
            <div class="recent-form">
                <h4>최근 경기 결과</h4>
                <div class="form-display">
    `;

    // 최근 경기 결과 표시
    if (typeof recordsSystem !== 'undefined') {
        const recentMatches = recordsSystem.getMyTeamRecentMatches(5);
        
        if (recentMatches.length === 0) {
            html += '<p>아직 경기 기록이 없습니다.</p>';
        } else {
            recentMatches.forEach(match => {
                const isHome = match.homeTeam === gameData.selectedTeam;
                const myScore = isHome ? match.homeScore : match.awayScore;
                const opponentScore = isHome ? match.awayScore : match.homeScore;
                const opponent = isHome ? match.awayTeam : match.homeTeam;
                
                let resultClass = '';
                if (myScore > opponentScore) resultClass = 'win';
                else if (myScore === opponentScore) resultClass = 'draw';
                else resultClass = 'loss';
                
                html += `
                    <div class="form-match ${resultClass}">
                        <div class="match-opponent">${teamNames[opponent]}</div>
                        <div class="match-score">${myScore}-${opponentScore}</div>
                        <div class="match-result">${resultClass === 'win' ? 'W' : resultClass === 'draw' ? 'D' : 'L'}</div>
                    </div>
                `;
            });
        }
    }

    html += `
                </div>
            </div>
            
            <div class="league-position">
                <h4>현재 리그 순위</h4>
                <div class="position-info">
    `;

    // 현재 순위 계산
    const currentPosition = calculateCurrentPosition();
    html += `
                    <div class="position-number">${currentPosition.position}위</div>
                    <div class="position-details">
                        <div>승점: ${currentPosition.points}</div>
                        <div>경기: ${currentPosition.matches}</div>
                        <div>득실차: ${currentPosition.goalDifference > 0 ? '+' : ''}${currentPosition.goalDifference}</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    matchContent.innerHTML = html;
}

// 스쿼드 상태 체크
function checkSquadStatus() {
    const details = [];
    let isValid = true;

    if (!gameData.squad.gk) {
        details.push('❌ 골키퍼가 없습니다');
        isValid = false;
    } else {
        details.push('✅ 골키퍼 배치됨');
    }

    const dfCount = gameData.squad.df.filter(p => p).length;
    if (dfCount < 4) {
        details.push(`❌ 수비수 부족 (${dfCount}/4)`);
        isValid = false;
    } else {
        details.push('✅ 수비수 배치 완료');
    }

    const mfCount = gameData.squad.mf.filter(p => p).length;
    if (mfCount < 3) {
        details.push(`❌ 미드필더 부족 (${mfCount}/3)`);
        isValid = false;
    } else {
        details.push('✅ 미드필더 배치 완료');
    }

    const fwCount = gameData.squad.fw.filter(p => p).length;
    if (fwCount < 3) {
        details.push(`❌ 공격수 부족 (${fwCount}/3)`);
        isValid = false;
    } else {
        details.push('✅ 공격수 배치 완료');
    }

    return { isValid, details };
}

// 평균 능력치 계산
function calculateAverageRating(teamKey) {
    if (teamKey === gameData.selectedTeam) {
        const allPlayers = [
            gameData.squad.gk,
            ...gameData.squad.df.filter(p => p),
            ...gameData.squad.mf.filter(p => p),
            ...gameData.squad.fw.filter(p => p)
        ].filter(p => p);

        if (allPlayers.length === 0) return 0;
        
        const totalRating = allPlayers.reduce((sum, player) => sum + player.rating, 0);
        return Math.round(totalRating / allPlayers.length);
    } else {
        const teamPlayers = teams[teamKey];
        const totalRating = teamPlayers.reduce((sum, player) => sum + player.rating, 0);
        return Math.round(totalRating / teamPlayers.length);
    }
}

// 현재 순위 계산
function calculateCurrentPosition() {
    if (!gameData.leagueTable || !gameData.selectedTeam) {
        return { position: 1, points: 0, matches: 0, goalDifference: 0 };
    }

    const sortedTeams = Object.keys(gameData.leagueTable).sort((a, b) => {
        const teamA = gameData.leagueTable[a];
        const teamB = gameData.leagueTable[b];
        
        if (teamA.points !== teamB.points) {
            return teamB.points - teamA.points;
        }
        
        const goalDiffA = teamA.goalsFor - teamA.goalsAgainst;
        const goalDiffB = teamB.goalsFor - teamB.goalsAgainst;
        
        return goalDiffB - goalDiffA;
    });

    const position = sortedTeams.indexOf(gameData.selectedTeam) + 1;
    const teamData = gameData.leagueTable[gameData.selectedTeam];
    
    return {
        position: position,
        points: teamData.points,
        matches: teamData.matches,
        goalDifference: teamData.goalsFor - teamData.goalsAgainst
    };
}

// 랜덤 상대 선택
function selectRandomOpponent() {
    const availableOpponents = Object.keys(teams).filter(team => team !== gameData.selectedTeam);
    const opponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
    
    const opponentInfo = document.getElementById('selectedOpponent');
    const opponentName = opponentInfo.querySelector('.opponent-name');
    const opponentStats = opponentInfo.querySelector('.opponent-stats');
    
    opponentName.textContent = teamNames[opponent];
    opponentStats.innerHTML = `
        <div>평균 능력치: ${calculateAverageRating(opponent)}</div>
        <div>전술: ${tacticsSystem ? tacticsSystem.getTacticInfo(tacticsSystem.getOpponentTactic(opponent)).name : '기본'}</div>
    `;
    
    opponentInfo.style.display = 'block';
    opponentInfo.dataset.opponent = opponent;
}

// 경기 준비 완료 시 시작
function startMatchIfReady() {
    const squadStatus = checkSquadStatus();
    if (!squadStatus.isValid) {
        alert('스쿼드가 완성되지 않았습니다. 모든 포지션에 선수를 배치해주세요.');
        return;
    }

    const opponentInfo = document.getElementById('selectedOpponent');
    if (!opponentInfo.style.display || opponentInfo.style.display === 'none') {
        alert('상대 팀을 먼저 선택해주세요.');
        return;
    }

    const opponent = opponentInfo.dataset.opponent;
    if (!opponent) {
        alert('상대 팀을 먼저 선택해주세요.');
        return;
    }

    simulateMatch(opponent);
}

// 시즌 종료 체크 및 처리
function checkSeasonEnd() {
    // 모든 팀이 36경기를 치렀는지 확인
    const allTeamsPlayedAllMatches = Object.values(gameData.leagueTable)
        .every(team => team.matches >= 36);

    if (allTeamsPlayedAllMatches) {
        endSeason();
    }
}

// 시즌 종료 처리
function endSeason() {
    const sortedTeams = Object.keys(gameData.leagueTable).sort((a, b) => {
        const teamA = gameData.leagueTable[a];
        const teamB = gameData.leagueTable[b];
        
        if (teamA.points !== teamB.points) {
            return teamB.points - teamA.points;
        }
        
        const goalDiffA = teamA.goalsFor - teamA.goalsAgainst;
        const goalDiffB = teamB.goalsFor - teamB.goalsAgainst;
        
        return goalDiffB - goalDiffA;
    });

    const myPosition = sortedTeams.indexOf(gameData.selectedTeam) + 1;
    let seasonReward = 0;
    let positionText = '';

    if (myPosition === 1) {
        seasonReward = 500;
        positionText = '🏆 우승';
    } else if (myPosition <= 4) {
        seasonReward = 300;
        positionText = '🥉 상위권';
    } else if (myPosition <= 10) {
        seasonReward = 150;
        positionText = '👍 중위권';
    } else {
        seasonReward = 50;
        positionText = '😞 강등권';
    }

    gameData.teamMoney += seasonReward;
    gameData.currentSeason++;

    // 리그 테이블 초기화
    initializeLeagueTable();

    alert(`시즌 ${gameData.currentSeason - 1} 종료!\n최종 순위: ${myPosition}위 (${positionText})\n시즌 보상: ${seasonReward}억`);
    
    updateLobbyDisplay();
}

// 저장/불러오기에 경기 데이터 포함
const originalSaveGame6 = window.saveGame;
window.saveGame = function() {
    gameData.matchSimulationData = {
        // 필요시 경기 시뮬레이션 관련 데이터 저장
    };
    if (originalSaveGame6) {
        originalSaveGame6.call(this);
    }
};

const originalLoadGame6 = window.loadGame;
window.loadGame = function() {
    if (originalLoadGame6) {
        originalLoadGame6.call(this);
    }
    // 필요시 경기 시뮬레이션 데이터 로드
};
