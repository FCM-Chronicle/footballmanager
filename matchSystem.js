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

        // AI 경기 결과 저장
        this.aiMatchResults = [];
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
            homeAssisters: [],
            awayAssisters: [],
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

    // AI 경기 시뮬레이션 (빠른 시뮬레이션)
    simulateAIMatch(homeTeam, awayTeam) {
        const homeTactic = tacticSystem.getTeamTactic(homeTeam);
        const awayTactic = tacticSystem.getTeamTactic(awayTeam);
        
        const matchData = {
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            homeScore: 0,
            awayScore: 0,
            homeTactic: homeTactic,
            awayTactic: awayTactic,
            homeGoalScorers: [],
            awayGoalScorers: [],
            homeAssisters: [],
            awayAssisters: [],
            isAIMatch: true
        };

        // 전술 효과 계산
        const tacticEffect = tacticSystem.applyTacticEffects(homeTactic, awayTactic);
        
        // 팀 레이팅 기반 골 확률 계산
        const homeRating = this.getTeamRating(homeTeam);
        const awayRating = this.getTeamRating(awayTeam);
        
        // 홈 어드밴티지 적용
        const homeAdvantage = 1.2;
        const adjustedHomeRating = homeRating * homeAdvantage;
        
        // 골 개수 시뮬레이션
        const totalRating = adjustedHomeRating + awayRating;
        const homeGoalProbability = (adjustedHomeRating / totalRating) * 0.6; // 최대 60% 확률
        const awayGoalProbability = (awayRating / totalRating) * 0.6;
        
        // 전술 효과 적용
        let homeGoals = this.generateGoalsForTeam(homeGoalProbability + (tacticEffect.goalProbabilityModifier / 100));
        let awayGoals = this.generateGoalsForTeam(awayGoalProbability - (tacticEffect.goalProbabilityModifier / 100));
        
        matchData.homeScore = homeGoals;
        matchData.awayScore = awayGoals;
        
        // 득점자와 어시스트 생성
        this.generateAIGoalScorers(matchData, homeTeam, homeGoals, true);
        this.generateAIGoalScorers(matchData, awayTeam, awayGoals, false);
        
        return matchData;
    }

    // 팀의 골 개수 생성
    generateGoalsForTeam(probability) {
        let goals = 0;
        
        // 푸아송 분포 기반 골 생성
        const lambda = probability * 4; // 평균 골 수 조정
        let l = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        
        do {
            k++;
            p *= Math.random();
        } while (p > l);
        
        goals = k - 1;
        
        // 최대 골 수 제한 (현실적으로)
        return Math.min(goals, 6);
    }

    // AI 경기 득점자 및 어시스트 생성
    generateAIGoalScorers(matchData, teamName, goalCount, isHome) {
        const teamPlayers = playerDatabase[teamName] || [];
        const positionProbability = {
            'FW': 0.5,
            'MF': 0.3,
            'DF': 0.15,
            'GK': 0.05
        };
        
        for (let i = 0; i < goalCount; i++) {
            // 득점자 선택
            const scorer = this.selectAIGoalScorer(teamPlayers, positionProbability);
            
            // 80% 확률로 어시스트 생성
            let assister = null;
            if (Math.random() < 0.8) {
                assister = this.selectAIAssister(teamPlayers, scorer);
            }
            
            if (isHome) {
                matchData.homeGoalScorers.push(scorer);
                if (assister) matchData.homeAssisters.push(assister);
            } else {
                matchData.awayGoalScorers.push(scorer);
                if (assister) matchData.awayAssisters.push(assister);
            }
            
            // 전역 통계 업데이트
            this.updateGlobalPlayerStats(teamName, scorer, 'goal');
            if (assister) {
                this.updateGlobalPlayerStats(teamName, assister, 'assist');
            }
        }
    }

    // AI 득점자 선택
    selectAIGoalScorer(players, positionProbability) {
        const weightedPlayers = [];
        
        players.slice(0, 11).forEach(player => { // 베스트 11만
            const weight = positionProbability[player.position] || 0;
            const ratingBonus = player.rating / 100; // 레이팅 보너스
            const finalWeight = weight * ratingBonus;
            
            for (let i = 0; i < finalWeight * 100; i++) {
                weightedPlayers.push(player.name);
            }
        });
        
        if (weightedPlayers.length === 0) {
            return players[0]?.name || "선수";
        }
        
        return weightedPlayers[Math.floor(Math.random() * weightedPlayers.length)];
    }

    // AI 어시스터 선택
    selectAIAssister(players, scorerName) {
        const availablePlayers = players
            .slice(0, 11)
            .filter(p => p.name !== scorerName);
        
        if (availablePlayers.length === 0) return null;
        
        // MF와 FW가 어시스트할 확률이 높음
        const positionWeight = {
            'MF': 0.4,
            'FW': 0.3,
            'DF': 0.2,
            'GK': 0.1
        };
        
        const weightedPlayers = [];
        availablePlayers.forEach(player => {
            const weight = positionWeight[player.position] || 0;
            for (let i = 0; i < weight * 100; i++) {
                weightedPlayers.push(player.name);
            }
        });
        
        if (weightedPlayers.length === 0) {
            return availablePlayers[Math.floor(Math.random() * availablePlayers.length)].name;
        }
        
        return weightedPlayers[Math.floor(Math.random() * weightedPlayers.length)];
    }

    // 전역 선수 통계 업데이트 (AI 팀용)
    updateGlobalPlayerStats(teamName, playerName, statType) {
        // 전역 선수 통계 객체가 없으면 생성
        if (!window.globalPlayerStats) {
            window.globalPlayerStats = {};
        }
        
        const playerId = `${teamName}_${playerName}`;
        
        if (!window.globalPlayerStats[playerId]) {
            const player = playerDatabase[teamName]?.find(p => p.name === playerName);
            window.globalPlayerStats[playerId] = {
                name: playerName,
                team: teamName,
                position: player?.position || 'FW',
                country: player?.country || '미정',
                age: player?.age || 25,
                rating: player?.rating || 70,
                goals: 0,
                assists: 0,
                matches: 0
            };
        }
        
        if (statType === 'goal') {
            window.globalPlayerStats[playerId].goals++;
        } else if (statType === 'assist') {
            window.globalPlayerStats[playerId].assists++;
        }
        
        window.globalPlayerStats[playerId].matches++;
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
            if (assister) matchData.homeAssisters.push(assister);
        } else {
            matchData.awayScore++;
            matchData.awayGoalScorers.push(scorer);
            if (assister) matchData.awayAssisters.push(assister);
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

    // 다른 팀들 경기 시뮬레이션
    simulateOtherTeamsMatches() {
        const currentLeagueTeams = leagueData[gameData.currentLeague].teams;
        const matches = this.generateMatchFixtures(currentLeagueTeams, gameData.matchDay);
        
        console.log(`\n=== ${gameData.matchDay}라운드 ${gameData.currentLeague} 리그 경기 결과 ===`);
        
        matches.forEach(match => {
            if (match.homeTeam !== gameData.selectedTeam && match.awayTeam !== gameData.selectedTeam) {
                const result = this.simulateAIMatch(match.homeTeam, match.awayTeam);
                this.aiMatchResults.push(result);
                
                // 콘솔에 결과 출력
                console.log(`${result.homeTeam} ${result.homeScore} - ${result.awayScore} ${result.awayTeam}`);
                if (result.homeGoalScorers.length > 0 || result.awayGoalScorers.length > 0) {
                    let scorersText = "득점자: ";
                    if (result.homeGoalScorers.length > 0) {
                        scorersText += `${result.homeTeam}(${result.homeGoalScorers.join(', ')})`;
                    }
                    if (result.awayGoalScorers.length > 0) {
                        if (result.homeGoalScorers.length > 0) scorersText += " / ";
                        scorersText += `${result.awayTeam}(${result.awayGoalScorers.join(', ')})`;
                    }
                    console.log(`  ${scorersText}`);
                }
                
                // 어시스트 정보
                if (result.homeAssisters.length > 0 || result.awayAssisters.length > 0) {
                    let assistersText = "어시스트: ";
                    if (result.homeAssisters.length > 0) {
                        assistersText += `${result.homeTeam}(${result.homeAssisters.join(', ')})`;
                    }
                    if (result.awayAssisters.length > 0) {
                        if (result.homeAssisters.length > 0) assistersText += " / ";
                        assistersText += `${result.awayTeam}(${result.awayAssisters.join(', ')})`;
                    }
                    console.log(`  ${assistersText}`);
                }
                
                // SNS 뉴스 생성
                if (typeof snsSystem !== 'undefined') {
                    snsSystem.generateMatchNews(
                        result.homeTeam,
                        result.awayTeam,
                        result.homeScore,
                        result.awayScore,
                        gameData.currentLeague,
                        result.homeGoalScorers,
                        result.awayGoalScorers
                    );
                }
            }
        });
        
        console.log(`=== ${gameData.matchDay}라운드 종료 ===\n`);
    }

    // 경기 일정 생성
    generateMatchFixtures(teams, matchDay) {
        const fixtures = [];
        const teamNames = teams.map(team => team.name);
        const numTeams = teamNames.length;
        
        // 라운드로빈 방식으로 경기 일정 생성
        // 각 라운드마다 모든 팀이 경기를 하도록 함
        
        const halfSeason = numTeams - 1;
        const isSecondHalf = matchDay > halfSeason;
        const actualRound = isSecondHalf ? matchDay - halfSeason : matchDay;
        
        for (let i = 0; i < numTeams / 2; i++) {
            let home, away;
            
            if (i === 0) {
                home = 0; // 첫 번째 팀은 항상 고정
                away = actualRound;
            } else {
                home = (actualRound - i + numTeams - 1) % (numTeams - 1) + 1;
                away = (actualRound + i - 1) % (numTeams - 1) + 1;
            }
            
            // 홈/원정 조정
            if (home >= numTeams) home -= numTeams;
            if (away >= numTeams) away -= numTeams;
            
            // 후반기에는 홈/원정 바뀜
            if (isSecondHalf) {
                [home, away] = [away, home];
            }
            
            fixtures.push({
                homeTeam: teamNames[home],
                awayTeam: teamNames[away]
            });
        }
        
        return fixtures;
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

        // 다른 팀들의 경기 시뮬레이션
        this.simulateOtherTeamsMatches();

        // 선수 성장 처리
        if (typeof processPostMatchGrowth === 'function') {
            processPostMatchGrowth();
        }

        // SNS 뉴스 생성 (내 팀 경기)
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
    }

    // 시즌 종료 처리
    endSeason() {
        // 시즌 보상 지급
        this.giveSeasonRewards();
        
        // 승강 처리
        this.processPromotionRelegation();
        
        // 선수 나이 증가
        if (typeof playerGrowthSystem !== 'undefined') {
            playerGrowthSystem.ageAllPlayers();
        }
        
        // 새 시즌 시작
        gameData.season++;
        gameData.matchDay = 1;
        gameData.matchesPlayed = 0;
        
        // 이적 시장 새로고침
        if (typeof transferSystem !== 'undefined') {
            gameData.transferMarket = transferSystem.generateTransferMarket();
        }
        
        // AI 경기 결과 초기화
        this.aiMatchResults = [];
        
        // 전역 선수 통계 초기화
        if (window.globalPlayerStats) {
            Object.values(window.globalPlayerStats).forEach(player => {
                player.goals = 0;
                player.assists = 0;
                player.matches = 0;
            });
        }
        
        updateHeader();
        showLobby();
    }

    // 시즌 보상 지급
    giveSeasonRewards() {
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

        // TODO: 실제 순위 계산 후 보상 지급
        const position = 1; // 임시로 1위
        const reward = rewards[gameData.currentLeague][position] || 50;
        
        gameData.teamMoney += reward;
        
        if (typeof transferSystem !== 'undefined') {
            transferSystem.showMessage(`시즌 종료! ${position}위로 ${reward}억원을 받았습니다!`, 'success');
        }
    }

    // 승강 처리
    processPromotionRelegation() {
        // TODO: 실제 순위에 따른 승강 처리
        // 현재는 임시로 잔류 처리
        gameData.teamMorale += 5; // 잔류 사기 보너스
    }

    // 전역 선수 통계 가져오기 (통계 화면용)
    getGlobalPlayerStats() {
        if (!window.globalPlayerStats) return [];
        
        return Object.values(window.globalPlayerStats);
    }

    // 리그별 득점왕 가져오기
    getTopScorersByLeague(league = 'all', limit = 20) {
        const allStats = this.getGlobalPlayerStats();
        let filteredStats = allStats;
        
        if (league !== 'all') {
            filteredStats = allStats.filter(player => {
                const teamLeague = this.getTeamLeague(player.team);
                return teamLeague === league;
            });
        }
        
        // 내 팀 선수들도 추가
        gameData.allPlayers.forEach(player => {
            if ((player.goals || 0) > 0) {
                filteredStats.push({
                    name: player.name,
                    team: gameData.selectedTeam,
                    position: player.position,
                    country: player.country,
                    age: player.age,
                    rating: player.rating,
                    goals: player.goals || 0,
                    assists: player.assists || 0,
                    matches: player.matches || 0,
                    isMyPlayer: true
                });
            }
        });
        
        return filteredStats
            .filter(player => player.goals > 0)
            .sort((a, b) => b.goals - a.goals)
            .slice(0, limit);
    }

    // 리그별 도움왕 가져오기
    getTopAssistersByLeague(league = 'all', limit = 20) {
        const allStats = this.getGlobalPlayerStats();
        let filteredStats = allStats;
        
        if (league !== 'all') {
            filteredStats = allStats.filter(player => {
                const teamLeague = this.getTeamLeague(player.team);
                return teamLeague === league;
            });
        }
        
        // 내 팀 선수들도 추가
        gameData.allPlayers.forEach(player => {
            if ((player.assists || 0) > 0) {
                filteredStats.push({
                    name: player.name,
                    team: gameData.selectedTeam,
                    position: player.position,
                    country: player.country,
                    age: player.age,
                    rating: player.rating,
                    goals: player.goals || 0,
                    assists: player.assists || 0,
                    matches: player.matches || 0,
                    isMyPlayer: true
                });
            }
        });
        
        return filteredStats
            .filter(player => player.assists > 0)
            .sort((a, b) => b.assists - a.assists)
            .slice(0, limit);
    }

    // 팀의 리그 찾기
    getTeamLeague(teamName) {
        for (const [league, data] of Object.entries(leagueData)) {
            if (data.teams.some(team => team.name === teamName)) {
                return league;
            }
        }
        return '3부';
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
