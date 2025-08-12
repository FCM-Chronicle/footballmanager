// 경기 시스템 (matchSystem.js)
// 경기 시스템 (matchSystem.js)
class MatchSystem {
    constructor() {
        this.baseGoalProbability = 2.0; // 기본 골 확률 2%
        this.matchDuration = 90; // 90초 (1초 = 1분)
        this.eventTypes = {
            goal: 0.02,
            pass: 0.80,
            foul: 0.05,
            throwin: 0.04,
            goalkick: 0.03,
            corner: 0.03,
            other: 0.03
        };
        
        this.passExpressions = [
            "미드필드에서 공을 돌리고 있습니다",
            "예리한 패스!",
            "후방 빌드업",
            "사이드에서 크로스를 올립니다",
            "킬패스 시도!",
            "공간을 찾아 패스합니다",
            "백패스로 안정화",
            "측면으로 볼을 돌립니다",
            "스루패스!",
            "중앙에서 배급합니다",
            "롱패스 시도",
            "짧은 패스로 연결",
            "원터치 패스",
            "템포를 조절합니다",
            "사이드 체인지"
        ];
        
        this.goalExpressions = [
            "환상적인 연계플레이로 골!",
            "어시스트를 받아 골을 터뜨립니다!",
            "개인기로 만들어낸 골!",
            "정확한 크로스를 헤더로 마무리!",
            "킬패스를 받아 침착하게 골!",
            "원투패스 후 골!",
            "완벽한 마무리!",
            "스루패스를 받아 골!",
            "크로스를 발리슛으로 골!",
            "빠른 패스 교환 후 골!",
            "센터링을 골로 연결!",
            "백힐패스로 골!",
            "정교한 패스를 골로!",
            "화려한 콤비네이션 골!",
            "절묘한 어시스트로 골!"
        ];

        // 리그별 테이블 초기화
        this.leagueTables = {
            "1부": [],
            "2부": [],
            "3부": []
        };
        this.initializeLeagueTables();
    }

    // 리그 테이블 초기화
    initializeLeagueTables() {
        Object.keys(leagueData).forEach(league => {
            const teams = leagueData[league].teams;
            this.leagueTables[league] = teams.map(team => ({
                name: team.name,
                played: 0,
                won: 0,
                drawn: 0,
                lost: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0
            }));
        });
    }

    // 경기 일정 생성
    generateMatchFixtures(teams, matchDay) {
        const fixtures = [];
        const teamNames = teams.map(team => team.name);
        
        // 라운드 로빈 방식으로 경기 생성
        for (let i = 0; i < teamNames.length; i += 2) {
            if (i + 1 < teamNames.length) {
                // matchDay를 이용해 홈/어웨이 결정
                const isEvenRound = matchDay % 2 === 0;
                const homeTeam = isEvenRound ? teamNames[i] : teamNames[i + 1];
                const awayTeam = isEvenRound ? teamNames[i + 1] : teamNames[i];
                
                fixtures.push({
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    matchDay: matchDay
                });
            }
        }
        
        return fixtures;
    }

    // AI 경기 시뮬레이션 (결과만 생성)
    simulateAIMatch(homeTeam, awayTeam) {
        const homeRating = calculateTeamRating(homeTeam);
        const awayRating = calculateTeamRating(awayTeam);
        
        // 홈 어드밴티지 (+5점)
        const adjustedHomeRating = homeRating + 5;
        
        // 전술 효과
        const homeTactic = tacticSystem.getTeamTactic(homeTeam);
        const awayTactic = tacticSystem.getTeamTactic(awayTeam);
        const tacticEffect = tacticSystem.applyTacticEffects(homeTactic, awayTactic);
        
        // 골 기대치 계산
        let homeGoalExpectancy = this.calculateGoalExpectancy(adjustedHomeRating, awayRating);
        let awayGoalExpectancy = this.calculateGoalExpectancy(awayRating, homeRating);
        
        // 전술 효과 적용
        if (tacticEffect.advantage === 'advantage') {
            homeGoalExpectancy *= 1.2;
            awayGoalExpectancy *= 0.9;
        } else if (tacticEffect.advantage === 'disadvantage') {
            homeGoalExpectancy *= 0.9;
            awayGoalExpectancy *= 1.2;
        }
        
        // 포아송 분포를 이용한 골 수 결정
        const homeGoals = this.poissonRandom(homeGoalExpectancy);
        const awayGoals = this.poissonRandom(awayGoalExpectancy);
        
        // 득점자 생성
        const homeScorers = this.generateRandomScorers(homeTeam, homeGoals);
        const awayScorers = this.generateRandomScorers(awayTeam, awayGoals);
        
        return {
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            homeScore: homeGoals,
            awayScore: awayGoals,
            homeScorers: homeScorers,
            awayScorers: awayScorers,
            homeTactic: homeTactic,
            awayTactic: awayTactic
        };
    }

    // 골 기대치 계산
    calculateGoalExpectancy(attackRating, defenseRating) {
        const ratingDiff = attackRating - defenseRating;
        let baseExpectancy = 1.3; // 기본 골 기대치
        
        // 레이팅 차이에 따른 조정
        baseExpectancy += (ratingDiff / 100);
        
        // 최소/최대 제한
        return Math.max(0.3, Math.min(4.0, baseExpectancy));
    }

    // 포아송 분포 랜덤
    poissonRandom(lambda) {
        let L = Math.exp(-lambda);
        let p = 1.0;
        let k = 0;
        
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        
        return k - 1;
    }

    // 랜덤 득점자 생성
    generateRandomScorers(teamName, goalCount) {
        const scorers = [];
        const teamPlayers = playerDatabase[teamName] || [];
        
        if (teamPlayers.length === 0) return scorers;
        
        // 포지션별 득점 확률
        const positionWeights = {
            'FW': 0.7,
            'MF': 0.2,
            'DF': 0.1,
            'GK': 0.0
        };
        
        for (let i = 0; i < goalCount; i++) {
            const weightedPlayers = [];
            
            teamPlayers.forEach(player => {
                const weight = positionWeights[player.position] || 0;
                for (let j = 0; j < weight * 100; j++) {
                    weightedPlayers.push(player.name);
                }
            });
            
            if (weightedPlayers.length > 0) {
                const scorer = weightedPlayers[Math.floor(Math.random() * weightedPlayers.length)];
                scorers.push(scorer);
            }
        }
        
        return scorers;
    }

    // 다른 팀들 경기 시뮬레이션
    simulateOtherTeamsMatches() {
        const currentLeagueTeams = leagueData[gameData.currentLeague].teams;
        const fixtures = this.generateMatchFixtures(currentLeagueTeams, gameData.matchDay);
        
        fixtures.forEach(fixture => {
            // 플레이어가 참여하지 않는 경기만 시뮬레이션
            if (fixture.homeTeam !== gameData.selectedTeam && 
                fixture.awayTeam !== gameData.selectedTeam) {
                
                const result = this.simulateAIMatch(fixture.homeTeam, fixture.awayTeam);
                this.updateLeagueTable(result);
                
                // SNS 뉴스 생성 (확률적으로)
                if (typeof snsSystem !== 'undefined' && Math.random() < 0.3) {
                    snsSystem.generateMatchNews(
                        result.homeTeam,
                        result.awayTeam,
                        result.homeScore,
                        result.awayScore,
                        gameData.currentLeague,
                        result.homeScorers,
                        result.awayScorers
                    );
                }
            }
        });
        
        // 테이블 정렬
        this.sortLeagueTable(gameData.currentLeague);
    }

    // 리그 테이블 업데이트
    updateLeagueTable(matchResult) {
        const league = gameData.currentLeague;
        const homeTeam = this.leagueTables[league].find(team => team.name === matchResult.homeTeam);
        const awayTeam = this.leagueTables[league].find(team => team.name === matchResult.awayTeam);
        
        if (!homeTeam || !awayTeam) return;
        
        // 경기 수 증가
        homeTeam.played++;
        awayTeam.played++;
        
        // 득점/실점 업데이트
        homeTeam.goalsFor += matchResult.homeScore;
        homeTeam.goalsAgainst += matchResult.awayScore;
        awayTeam.goalsFor += matchResult.awayScore;
        awayTeam.goalsAgainst += matchResult.homeScore;
        
        // 득실차 계산
        homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst;
        awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst;
        
        // 승부 결과에 따른 승점 및 승부 기록
        if (matchResult.homeScore > matchResult.awayScore) {
            // 홈팀 승리
            homeTeam.won++;
            homeTeam.points += 3;
            awayTeam.lost++;
        } else if (matchResult.homeScore < matchResult.awayScore) {
            // 어웨이팀 승리
            awayTeam.won++;
            awayTeam.points += 3;
            homeTeam.lost++;
        } else {
            // 무승부
            homeTeam.drawn++;
            homeTeam.points += 1;
            awayTeam.drawn++;
            awayTeam.points += 1;
        }
    }

    // 플레이어 팀 경기 결과로 테이블 업데이트
    updatePlayerTeamResult(homeTeam, awayTeam, homeScore, awayScore) {
        const league = gameData.currentLeague;
        const homeTeamData = this.leagueTables[league].find(team => team.name === homeTeam);
        const awayTeamData = this.leagueTables[league].find(team => team.name === awayTeam);
        
        if (!homeTeamData || !awayTeamData) return;
        
        // 경기 수 증가
        homeTeamData.played++;
        awayTeamData.played++;
        
        // 득점/실점 업데이트
        homeTeamData.goalsFor += homeScore;
        homeTeamData.goalsAgainst += awayScore;
        awayTeamData.goalsFor += awayScore;
        awayTeamData.goalsAgainst += homeScore;
        
        // 득실차 계산
        homeTeamData.goalDifference = homeTeamData.goalsFor - homeTeamData.goalsAgainst;
        awayTeamData.goalDifference = awayTeamData.goalsFor - awayTeamData.goalsAgainst;
        
        // 승부 결과에 따른 승점 및 승부 기록
        if (homeScore > awayScore) {
            homeTeamData.won++;
            homeTeamData.points += 3;
            awayTeamData.lost++;
        } else if (homeScore < awayScore) {
            awayTeamData.won++;
            awayTeamData.points += 3;
            homeTeamData.lost++;
        } else {
            homeTeamData.drawn++;
            homeTeamData.points += 1;
            awayTeamData.drawn++;
            awayTeamData.points += 1;
        }
        
        // 테이블 정렬
        this.sortLeagueTable(league);
    }

    // 리그 테이블 정렬
    sortLeagueTable(league) {
        this.leagueTables[league].sort((a, b) => {
            // 1. 승점
            if (b.points !== a.points) return b.points - a.points;
            // 2. 득실차
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            // 3. 득점
            return b.goalsFor - a.goalsFor;
        });
    }

    // 현재 순위 가져오기
    getCurrentPosition(teamName) {
        const league = gameData.currentLeague;
        const table = this.leagueTables[league];
        const position = table.findIndex(team => team.name === teamName) + 1;
        return position;
    }

    // 경기 시작
    startMatch(homeTeam, awayTeam, homeTactic, awayTactic) {
        const matchData = {
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            homeScore: 0,
            awayScore: 0,
            minute: 0,
            events: [],
            homeTactic: homeTactic,
            awayTactic: awayTactic,
            homeGoalScorers: [],
            awayGoalScorers: [],
            tacticsChanged: 0
        };

        // 전술 효과 계산
        const tacticEffect = tacticSystem.applyTacticEffects(homeTactic, awayTactic);
        matchData.tacticEffect = tacticEffect;

        // 팀 사기에 전술 효과 적용
        gameData.teamMorale += tacticEffect.moraleModifier;
        gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale));

        this.simulateMatch(matchData);
        return matchData;
    }

    // 경기 시뮬레이션
    simulateMatch(matchData) {
        const interval = setInterval(() => {
            matchData.minute++;
            
            // 경기 이벤트 생성
            this.generateMatchEvent(matchData);
            
            // UI 업데이트
            this.updateMatchUI(matchData);
            
            // AI 전술 변경 체크
            if (matchData.homeTeam !== gameData.selectedTeam) {
                this.checkAITacticChange(matchData, 'home');
            }
            if (matchData.awayTeam !== gameData.selectedTeam) {
                this.checkAITacticChange(matchData, 'away');
            }
            
            // 경기 종료
            if (matchData.minute >= 90) {
                clearInterval(interval);
                this.endMatch(matchData);
            }
        }, 1000);
    }

    // 경기 이벤트 생성
    generateMatchEvent(matchData) {
        const rand = Math.random();
        let eventType = 'pass';
        
        // 이벤트 타입 결정
        if (rand < this.eventTypes.goal) {
            eventType = 'goal';
        } else if (rand < this.eventTypes.goal + this.eventTypes.foul) {
            eventType = 'foul';
        } else if (rand < this.eventTypes.goal + this.eventTypes.foul + this.eventTypes.throwin) {
            eventType = 'throwin';
        } else if (rand < this.eventTypes.goal + this.eventTypes.foul + this.eventTypes.throwin + this.eventTypes.goalkick) {
            eventType = 'goalkick';
        } else if (rand < this.eventTypes.goal + this.eventTypes.foul + this.eventTypes.throwin + this.eventTypes.goalkick + this.eventTypes.corner) {
            eventType = 'corner';
        }

        // 골 확률 조정
        if (eventType === 'goal') {
            if (!this.shouldScoreGoal(matchData)) {
                eventType = 'pass';
            }
        }

        this.processMatchEvent(matchData, eventType);
    }

    // 골 판정
    shouldScoreGoal(matchData) {
        let goalProbability = this.baseGoalProbability;
        
        // 리그별 보정
        const league = gameData.currentLeague;
        if (league === '1부') goalProbability += 0.3;
        else if (league === '3부') goalProbability -= 0.3;
        
        // 전술 효과 적용
        if (matchData.tacticEffect) {
            goalProbability += matchData.tacticEffect.goalProbabilityModifier;
        }
        
        // 팀 오버롤 보너스 (내 팀만)
        const myTeamRating = this.getTeamRating(gameData.selectedTeam);
        if (myTeamRating >= 90) goalProbability += 1.5;
        else if (myTeamRating >= 85) goalProbability += 1.0;
        else if (myTeamRating >= 75) goalProbability += 0.5;
        
        return Math.random() * 100 < goalProbability;
    }

    // 팀 레이팅 계산
    getTeamRating(teamName) {
        if (teamName === gameData.selectedTeam) {
            const squadPlayers = gameData.squad.filter(p => p !== null);
            if (squadPlayers.length === 0) return 70;
            const totalRating = squadPlayers.reduce((sum, player) => sum + player.rating, 0);
            return Math.round(totalRating / squadPlayers.length);
        } else {
            return calculateTeamRating(teamName);
        }
    }

    // 경기 이벤트 처리
    processMatchEvent(matchData, eventType) {
        let eventText = '';
        let isHome = Math.random() < 0.5;
        const team = isHome ? matchData.homeTeam : matchData.awayTeam;
        
        switch (eventType) {
            case 'goal':
                const goalData = this.processGoal(matchData, isHome);
                eventText = goalData.text;
                break;
            case 'pass':
                const player = this.getRandomPlayer(team);
                const passText = this.passExpressions[Math.floor(Math.random() * this.passExpressions.length)];
                eventText = `${matchData.minute}' ${player}이(가) ${passText}`;
                break;
            case 'foul':
                const fouler = this.getRandomPlayer(team);
                eventText = `${matchData.minute}' ${fouler}의 파울`;
                break;
            case 'throwin':
                eventText = `${matchData.minute}' ${team} 스로인`;
                break;
            case 'goalkick':
                eventText = `${matchData.minute}' ${team} 골킥`;
                break;
            case 'corner':
                eventText = `${matchData.minute}' ${team} 코너킥`;
                break;
        }

        const event = {
            minute: matchData.minute,
            type: eventType,
            text: eventText,
            team: team
        };

        matchData.events.push(event);
    }

    // 골 처리
    processGoal(matchData, isHome) {
        // 포지션별 골 확률
        const positionProbability = {
            'FW': 0.7,
            'MF': 0.2,
            'DF': 0.1,
            'GK': 0.0
        };

        const team = isHome ? matchData.homeTeam : matchData.awayTeam;
        const scorer = this.selectGoalScorer(team, positionProbability);
        const assister = Math.random() < 0.8 ? this.getRandomPlayer(team, scorer) : null;

        // 점수 업데이트
        if (isHome) {
            matchData.homeScore++;
            matchData.homeGoalScorers.push(scorer);
        } else {
            matchData.awayScore++;
            matchData.awayGoalScorers.push(scorer);
        }

        // 골 텍스트 생성
        const goalText = this.goalExpressions[Math.floor(Math.random() * this.goalExpressions.length)];
        let eventText = `${matchData.minute}' ⚽ GOAL! `;
        
        if (assister) {
            eventText += `${assister}${goalText.includes('어시스트') ? '의' : '와'} ${scorer}${goalText}`;
        } else {
            eventText += `${scorer}의 ${goalText}`;
        }

        // 선수 통계 업데이트 (내 팀만)
        if (team === gameData.selectedTeam) {
            this.updatePlayerStats(scorer, 'goal');
            if (assister) {
                this.updatePlayerStats(assister, 'assist');
            }
        }

        return { text: eventText, scorer: scorer, assister: assister };
    }

    // 골 득점자 선택
    selectGoalScorer(teamName, positionProbability) {
        if (teamName === gameData.selectedTeam) {
            const squadPlayers = gameData.squad.filter(p => p !== null);
            const weightedPlayers = [];
            
            squadPlayers.forEach(player => {
                const weight = positionProbability[player.position] || 0;
                for (let i = 0; i < weight * 100; i++) {
                    weightedPlayers.push(player.name);
                }
            });
            
            return weightedPlayers.length > 0 ? 
                weightedPlayers[Math.floor(Math.random() * weightedPlayers.length)] :
                this.getRandomPlayer(teamName);
        } else {
            return this.getRandomPlayer(teamName);
        }
    }

    // 랜덤 선수 가져오기
    getRandomPlayer(teamName, excludePlayer = null) {
        if (teamName === gameData.selectedTeam) {
            const availablePlayers = gameData.squad
                .filter(p => p !== null && p.name !== excludePlayer)
                .map(p => p.name);
            
            return availablePlayers.length > 0 ?
                availablePlayers[Math.floor(Math.random() * availablePlayers.length)] :
                '선수';
        } else {
            const teamPlayers = playerDatabase[teamName] || [];
            const availablePlayers = teamPlayers
                .filter(p => p.name !== excludePlayer)
                .slice(0, 11); // 베스트 11만
            
            return availablePlayers.length > 0 ?
                availablePlayers[Math.floor(Math.random() * availablePlayers.length)].name :
                '선수';
        }
    }

    // 선수 통계 업데이트
    updatePlayerStats(playerName, statType) {
        const player = gameData.allPlayers.find(p => p.name === playerName);
        if (player) {
            if (statType === 'goal') {
                player.goals = (player.goals || 0) + 1;
            } else if (statType === 'assist') {
                player.assists = (player.assists || 0) + 1;
            }
        }
    }

    // AI 전술 변경 체크
    checkAITacticChange(matchData, side) {
        const isHome = side === 'home';
        const scoreDiff = isHome ? 
            matchData.homeScore - matchData.awayScore :
            matchData.awayScore - matchData.homeScore;

        if (tacticSystem.shouldAIChangeTactic(scoreDiff, matchData.minute)) {
            const currentTactic = isHome ? matchData.homeTactic : matchData.awayTactic;
            const newTactic = tacticSystem.getRandomTactic(currentTactic);
            
            if (isHome) {
                matchData.homeTactic = newTactic;
            } else {
                matchData.awayTactic = newTactic;
            }

            const team = isHome ? matchData.homeTeam : matchData.awayTeam;
            const event = {
                minute: matchData.minute,
                type: 'tactic',
                text: `${matchData.minute}' ${team}이 전술을 ${newTactic}로 변경했습니다`,
                team: team
            };

            matchData.events.push(event);
            matchData.tacticsChanged++;

            // 전술 효과 재계산 (플레이어 팀 관련시에만)
            if (team === gameData.selectedTeam) {
                const opponentTactic = isHome ? matchData.awayTactic : matchData.homeTactic;
                matchData.tacticEffect = tacticSystem.applyTacticEffects(newTactic, opponentTactic);
            }
        }
    }

    // 경기 UI 업데이트
    updateMatchUI(matchData) {
        document.getElementById('homeScore').textContent = matchData.homeScore;
        document.getElementById('awayScore').textContent = matchData.awayScore;
        document.getElementById('matchTime').textContent = matchData.minute;

        // 최근 이벤트 표시 (최대 10개)
        const eventsContainer = document.getElementById('matchEvents');
        const recentEvents = matchData.events.slice(-10);
        
        eventsContainer.innerHTML = '';
        recentEvents.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = `match-event ${event.type}`;
            eventDiv.textContent = event.text;
            eventsContainer.appendChild(eventDiv);
        });

        // 스크롤을 맨 아래로
        eventsContainer.scrollTop = eventsContainer.scrollHeight;
    }

    // 경기 종료
    endMatch(matchData) {
        // 모든 선수 경기 수 증가
        gameData.allPlayers.forEach(player => {
            if (player.inSquad) {
                player.matches = (player.matches || 0) + 1;
            }
        });

        // 게임 데이터 업데이트
        gameData.matchesPlayed++;
        gameData.matchDay++;

        // 플레이어 팀 결과를 테이블에 반영
        this.updatePlayerTeamResult(
            matchData.homeTeam, 
            matchData.awayTeam, 
            matchData.homeScore, 
            matchData.awayScore
        );

        // 다른 팀들의 경기 시뮬레이션
        this.simulateOtherTeamsMatches();

        // 선수 성장 처리
        if (typeof processPostMatchGrowth === 'function') {
            processPostMatchGrowth();
        }

        // SNS 뉴스 생성
        if (typeof snsSystem !== 'undefined') {
            snsSystem.generateMatchNews(
                matchData.homeTeam,
                matchData.awayTeam,
                matchData.homeScore,
                matchData.awayScore,
                gameData.currentLeague,
                matchData.homeGoalScorers,
                matchData.awayGoalScorers
            );
        }

        // 경기 후 화면 표시
        this.showPostMatch(matchData);
    }

    // 경기 후 화면 표시
    showPostMatch(matchData) {
        document.getElementById('liveMatch').classList.add('hidden');
        document.getElementById('postMatch').classList.remove('hidden');

        // 결과 표시
        document.getElementById('finalHome').textContent = matchData.homeTeam;
        document.getElementById('finalAway').textContent = matchData.awayTeam;
        document.getElementById('finalScore').textContent = `${matchData.homeScore} - ${matchData.awayScore}`;

        // 인터뷰 옵션 생성
        this.generateInterviewOptions(matchData);
    }

    // 인터뷰 옵션 생성
    generateInterviewOptions(matchData) {
        const container = document.getElementById('interviewOptions');
        const myScore = matchData.homeTeam === gameData.selectedTeam ? matchData.homeScore : matchData.awayScore;
        const opponentScore = matchData.homeTeam === gameData.selectedTeam ? matchData.awayScore : matchData.homeScore;
        const scoreDiff = myScore - opponentScore;
        
        let options = [];

        if (scoreDiff > 0) { // 승리
            if (scoreDiff >= 3) { // 대승
                options = [
                    { text: "완벽한 경기였습니다! 이것이 우리의 실력입니다!", morale: 15 },
                    { text: "팀의 잠재력을 보여준 훌륭한 경기였습니다.", morale: 8 },
                    { text: "좋은 결과지만 방심하지 맙시다.", morale: 3 }
                ];
            } else { // 일반 승리
                options = [
                    { text: "정말 훌륭한 경기였습니다! 여러분이 자랑스럽습니다!", morale: 10 },
                    { text: "팀워크가 빛났습니다! 계속 이렇게 해봅시다!", morale: 5 },
                    { text: "몇몇 실수는 아쉬웠습니다. 다음에는 더 집중해야 합니다.", morale: -5 }
                ];
            }
        } else if (scoreDiff < 0) { // 패배
            if (scoreDiff <= -3) { // 대패
                options = [
                    { text: "이런 치욕적인 경기는 다시는 없어야 합니다!", morale: -15 },
                    { text: "실망스럽지만 다음 경기를 준비해야 합니다.", morale: -8 },
                    { text: "어려운 상대였지만 우리도 더 노력해야 합니다.", morale: -3 }
                ];
            } else { // 일반 패배
                options = [
                    { text: "이번 경기는 정말 실망스러웠습니다. 왜 이렇게 했는지 이해가 되지 않습니다!", morale: -10 },
                    { text: "이런 경기는 절대 허용할 수 없습니다. 다음에는 더 잘해야 합니다!", morale: -5 },
                    { text: "힘든 경기를 치렀지만, 여러분의 노력은 인정합니다. 다음에 더 좋은 결과를 기대합니다.", morale: 5 }
                ];
            }
        } else { // 무승부
            options = [
                { text: "아쉬운 결과지만 좋은 경기였습니다.", morale: 3 },
                { text: "더 좋은 결과를 만들어야 했습니다.", morale: -3 },
                { text: "이런 경기에서는 승부를 가렸어야 합니다.", morale: -7 }
            ];
        }

        container.innerHTML = '';
        options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'interview-option';
            optionDiv.textContent = option.text;
            optionDiv.onclick = () => this.selectInterviewOption(option.morale);
            container.appendChild(optionDiv);
        });
    }

    // 인터뷰 옵션 선택
    selectInterviewOption(moraleChange) {
        gameData.teamMorale += moraleChange;
        gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale));
        
        updateHeader();
        
        // 경기 화면 초기화
        document.getElementById('postMatch').classList.add('hidden');
        document.getElementById('preMatch').classList.remove('hidden');
        
        // 다음 경기 준비
        this.prepareNextMatch();
    }

    // 다음 경기 준비
    prepareNextMatch() {
        if (gameData.matchDay > 26) {
            // 시즌 종료
            this.endSeason();
        } else {
            // 다음 경기 설정
            const nextOpponent = getNextOpponent();
            document.getElementById('preMatchHome').textContent = gameData.selectedTeam;
            document.getElementById('preMatchAway').textContent = nextOpponent;
            document.getElementById('preMatchHomeRating').textContent = `평점: ${this.getTeamRating(gameData.selectedTeam)}`;
            document.getElementById('preMatchAwayRating').textContent = `평점: ${this.getTeamRating(nextOpponent)}`;
        }

        // 로비에서 현재 순위 업데이트
        this.updateLobbyInfo();
    }

    // 로비 정보 업데이트
    updateLobbyInfo() {
        const currentPosition = this.getCurrentPosition(gameData.selectedTeam);
        const currentPositionEl = document.getElementById('currentPosition');
        if (currentPositionEl) {
            currentPositionEl.textContent = `${currentPosition}위`;
        }
    }

    // 시즌 종료 처리
    endSeason() {
        const finalPosition = this.getCurrentPosition(gameData.selectedTeam);
        
        // 시즌 보상 지급
        this.giveSeasonRewards(finalPosition);
        
        // 승강 처리
        this.processPromotionRelegation(finalPosition);
        
        // 선수 나이 증가
        if (typeof playerGrowthSystem !== 'undefined') {
            playerGrowthSystem.ageAllPlayers();
        }
        
        // 새 시즌 시작
        gameData.season++;
        gameData.matchDay = 1;
        gameData.matchesPlayed = 0;
        
        // 리그 테이블 초기화
        this.initializeLeagueTables();
        
        // 이적 시장 새로고침
        if (typeof transferSystem !== 'undefined') {
            gameData.transferMarket = transferSystem.generateTransferMarket();
        }
        
        updateHeader();
        showLobby();
    }

    // 시즌 보상 지급
    giveSeasonRewards(position) {
        const rewards = {
            "1부": {
                1: 2500, 2: 1200, 3: 1200, 4: 1200, 5: 1200, 6: 1200,
                7: 500, 8: 500, 9: 500, 10: 500, 11: 500, 12: 500,
                13: 120, 14: 120
            },
            "2부": {
                1: 1000, 2: 1000, 3: 600, 4: 600, 5: 600, 6: 600,
                7: 300, 8: 300, 9: 300, 10: 300, 11: 300, 12: 300,
                13: 80, 14: 80
            },
            "3부": {
                1: 500, 2: 500, 3: 300, 4: 300, 5: 300, 6: 300,
                7: 150, 8: 150, 9: 150, 10: 150, 11: 150, 12: 150,
                13: 50, 14: 50
            }
        };

        const reward = rewards[gameData.currentLeague][position] || 50;
        gameData.teamMoney += reward;
        
        if (typeof transferSystem !== 'undefined') {
            transferSystem.showMessage(`시즌 종료! ${position}위로 ${reward}억원을 받았습니다!`, 'success');
        }
    }

    // 승강 처리
    processPromotionRelegation(position) {
        let newLeague = gameData.currentLeague;
        let promoted = false;
        let relegated = false;

        if (gameData.currentLeague === '3부') {
            if (position <= 2) {
                newLeague = '2부';
                promoted = true;
            }
        } else if (gameData.currentLeague === '2부') {
            if (position <= 2) {
                newLeague = '1부';
                promoted = true;
            } else if (position >= 13) {
                newLeague = '3부';
                relegated = true;
            }
        } else if (gameData.currentLeague === '1부') {
            if (position >= 13) {
                newLeague = '2부';
                relegated = true;
            }
        }

        if (promoted) {
            gameData.currentLeague = newLeague;
            gameData.teamMoney += leagueData[newLeague].money;
            gameData.teamMorale += 20;
            
            if (typeof transferSystem !== 'undefined') {
                transferSystem.showMessage(`🎉 축하합니다! ${newLeague} 리그로 승격되었습니다!`, 'success');
            }
            
            // SNS 승격 뉴스 생성
            if (typeof snsSystem !== 'undefined') {
                snsSystem.generatePromotionNews(
                    gameData.selectedTeam, 
                    gameData.currentLeague, 
                    newLeague, 
                    position
                );
            }
        } else if (relegated) {
            gameData.currentLeague = newLeague;
            gameData.teamMorale -= 15;
            
            if (typeof transferSystem !== 'undefined') {
                transferSystem.showMessage(`😢 아쉽게도 ${newLeague} 리그로 강등되었습니다.`, 'error');
            }
            
            // SNS 강등 뉴스 생성
            if (typeof snsSystem !== 'undefined') {
                snsSystem.generatePromotionNews(
                    gameData.selectedTeam, 
                    gameData.currentLeague, 
                    newLeague, 
                    position
                );
            }
        } else {
            gameData.teamMorale += 5; // 잔류 사기 보너스
            
            if (typeof transferSystem !== 'undefined') {
                transferSystem.showMessage(`${gameData.currentLeague} 리그 잔류 확정!`, 'success');
            }
        }

        gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale));
    }

    // 리그 테이블 가져오기 (통계 화면용)
    getLeagueTable(league) {
        return this.leagueTables[league] || [];
    }

    // 리그 테이블 표시용 데이터 생성
    generateDisplayTable(league) {
        const table = this.getLeagueTable(league);
        return table.map((team, index) => ({
            position: index + 1,
            name: team.name,
            played: team.played,
            won: team.won,
            drawn: team.drawn,
            lost: team.lost,
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            goalDifference: team.goalDifference,
            points: team.points,
            isMyTeam: team.name === gameData.selectedTeam
        }));
    }
}

// 경기 시스템 인스턴스 생성
const matchSystem = new MatchSystem();

// 경기 화면 표시
function displayMatch() {
    const nextOpponent = getNextOpponent();
    
    document.getElementById('preMatchHome').textContent = gameData.selectedTeam;
    document.getElementById('preMatchAway').textContent = nextOpponent;
    document.getElementById('preMatchHomeRating').textContent = `평점: ${matchSystem.getTeamRating(gameData.selectedTeam)}`;
    document.getElementById('preMatchAwayRating').textContent = `평점: ${matchSystem.getTeamRating(nextOpponent)}`;

    // 전술 선택 초기화
    document.getElementById('tacticSelect').value = gameData.currentTactic;
}

// 경기 시작
function startMatch() {
    const selectedTactic = document.getElementById('tacticSelect').value;
    gameData.currentTactic = selectedTactic;
    
    const opponent = getNextOpponent();
    const opponentTactic = tacticSystem.getTeamTactic(opponent);
    
    // 화면 전환
    document.getElementById('preMatch').classList.add('hidden');
    document.getElementById('liveMatch').classList.remove('hidden');
    
    // 경기 시작
    matchSystem.startMatch(gameData.selectedTeam, opponent, selectedTactic, opponentTactic);
}

// 리그 테이블 초기화 (게임 시작 시 호출)
function initializeLeagueTables() {
    matchSystem.initializeLeagueTables();
}

// 통계 시스템에서 사용할 수 있도록 전역 함수 추가
function getLeagueTableData(league) {
    return matchSystem.generateDisplayTable(league);
}
