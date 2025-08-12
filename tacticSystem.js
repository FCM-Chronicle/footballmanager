// 전술 시스템
class TacticSystem {
    constructor() {
        this.tactics = {
            "게겐프레싱": {
                effective: ["두 줄 수비", "점유율 축구"],
                ineffective: ["롱볼축구", "카테나치오"],
                description: "전방 압박으로 상대방의 빌드업을 차단하는 전술"
            },
            "두 줄 수비": {
                effective: ["롱볼축구", "침대 축구"],
                ineffective: ["게겐프레싱", "토탈 풋볼"],
                description: "촘촘한 수비라인으로 상대 공격을 차단"
            },
            "라볼피아나": {
                effective: ["점유율 축구", "티키타카"],
                ineffective: ["카테나치오", "롱볼축구"],
                description: "수비진부터 시작하는 정교한 빌드업 전술"
            },
            "롱볼축구": {
                effective: ["침대 축구", "카테나치오"],
                ineffective: ["게겐프레싱", "티키타카"],
                description: "긴 패스를 통한 직접적이고 빠른 공격"
            },
            "점유율 축구": {
                effective: ["티키타카", "라볼피아나"],
                ineffective: ["롱볼축구", "게겐프레싱"],
                description: "볼 점유를 통해 경기를 지배하는 전술"
            },
            "침대 축구": {
                effective: ["카테나치오", "두 줄 수비"],
                ineffective: ["게겐프레싱", "토탈 풋볼"],
                description: "극도로 수비적인 전술로 실점을 최소화"
            },
            "카테나치오": {
                effective: ["두 줄 수비", "침대 축구"],
                ineffective: ["점유율 축구", "토탈 풋볼"],
                description: "이탈리아식 수비 전술, 조직적인 수비 후 역습"
            },
            "토탈 풋볼": {
                effective: ["티키타카", "게겐프레싱"],
                ineffective: ["두 줄 수비", "카테나치오"],
                description: "모든 선수가 공격과 수비를 함께하는 전술"
            },
            "티키타카": {
                effective: ["점유율 축구", "라볼피아나"],
                ineffective: ["롱볼축구", "침대 축구"],
                description: "짧은 패스 위주의 정교한 볼 컨트롤 전술"
            }
        };

        // 팀별 기본 전술
        this.teamTactics = {
            // 1부리그
            "레알 마드리드": "점유율 축구",
            "바르셀로나": "토탈 풋볼",
            "맨체스터 시티": "티키타카",
            "바이에른 뮌헨": "티키타카",
            "파리 생제르맹": "점유율 축구",
            "리버풀": "게겐프레싱",
            "아스널": "두 줄 수비",
            "AC 밀란": "게겐프레싱",
            "인터 밀란": "토탈 풋볼",
            "아틀레티코 마드리드": "카테나치오",
            "첼시": "롱볼축구",
            "도르트문트": "게겐프레싱",
            "나폴리": "침대 축구",
            "토트넘 홋스퍼": "게겐프레싱",
            
            // 2부리그
            "유벤투스": "카테나치오",
            "라이프치히": "게겐프레싱",
            "뉴캐슬 유나이티드": "라볼피아나",
            "세비야": "점유율 축구",
            "아약스": "토탈 풋볼",
            "로마": "롱볼축구",
            "레버쿠젠": "롱볼축구",
            "페예노르트": "토탈 풋볼",
            "리옹": "점유율 축구",
            "벤피카": "침대 축구",
            "PSV": "토탈 풋볼",
            "스포르팅 CP": "점유율 축구",
            "셀틱": "게겐프레싱",
            "아스톤 빌라": "두 줄 수비",
            
            // 3부리그
            "FC 서울": "점유율 축구",
            "전북 현대": "게겐프레싱",
            "울산 현대": "두 줄 수비",
            "포항 스틸러스": "롱볼축구",
            "광주 FC": "침대 축구",
            "마르세유": "게겐프레싱",
            "브라질 연합": "티키타카",
            "아르헨티나 연합": "라볼피아나",
            "멕시코 연합": "롱볼축구",
            "미국 연합": "두 줄 수비",
            "알힐랄": "점유율 축구",
            "알나스르": "카테나치오",
            "알이티하드": "침대 축구",
            "갈라타사라이": "게겐프레싱"
        };
    }

    // 전술 상성 계산
    calculateTacticAdvantage(myTactic, opponentTactic) {
        const myTacticData = this.tactics[myTactic];
        
        if (myTacticData.effective.includes(opponentTactic)) {
            return "advantage"; // 유리
        } else if (myTacticData.ineffective.includes(opponentTactic)) {
            return "disadvantage"; // 불리
        } else {
            return "neutral"; // 중립
        }
    }

    // 전술 효과 적용
    applyTacticEffects(myTactic, opponentTactic) {
        const advantage = this.calculateTacticAdvantage(myTactic, opponentTactic);
        
        let goalProbabilityModifier = 0;
        let moraleModifier = 0;
        
        switch (advantage) {
            case "advantage":
                goalProbabilityModifier = 0.5; // 골 확률 +0.5%
                moraleModifier = 5; // 사기 +5
                break;
            case "disadvantage":
                goalProbabilityModifier = -0.5; // 골 확률 -0.5%
                moraleModifier = -5; // 사기 -5
                break;
            case "neutral":
                goalProbabilityModifier = 0;
                moraleModifier = 0;
                break;
        }
        
        return {
            advantage: advantage,
            goalProbabilityModifier: goalProbabilityModifier,
            moraleModifier: moraleModifier,
            description: this.getTacticAdvantageDescription(advantage, myTactic, opponentTactic)
        };
    }

    // 전술 상성 설명 가져오기
    getTacticAdvantageDescription(advantage, myTactic, opponentTactic) {
        switch (advantage) {
            case "advantage":
                return `${myTactic}이(가) ${opponentTactic}을(를) 효과적으로 카운터합니다!`;
            case "disadvantage":
                return `${opponentTactic}이(가) ${myTactic}을(를) 억제하고 있습니다.`;
            case "neutral":
                return `${myTactic} vs ${opponentTactic} - 균등한 전술 대결`;
            default:
                return "";
        }
    }

    // 팀의 기본 전술 가져오기
    getTeamTactic(teamName) {
        return this.teamTactics[teamName] || "게겐프레싱";
    }

    // AI 팀 전술 변경 (경기 중)
    shouldAIChangeTactic(scoreDifference, minute) {
        // 2점 이상 뒤질 때 80% 확률로 하프타임에 변경
        if (scoreDifference <= -2 && minute === 45 && Math.random() < 0.8) {
            return true;
        }
        
        // 60분 이후 1점 이상 뒤질 때 40% 확률로 변경
        if (scoreDifference <= -1 && minute >= 60 && Math.random() < 0.4) {
            return true;
        }
        
        return false;
    }

    // 랜덤 전술 선택 (AI용)
    getRandomTactic(excludeTactic = null) {
        const tacticNames = Object.keys(this.tactics);
        let availableTactics = tacticNames;
        
        if (excludeTactic) {
            availableTactics = tacticNames.filter(tactic => tactic !== excludeTactic);
        }
        
        return availableTactics[Math.floor(Math.random() * availableTactics.length)];
    }

    // 전술 상성표 생성
    generateTacticMatrix() {
        const tacticNames = Object.keys(this.tactics);
        const matrix = [];
        
        // 헤더 행
        const headerRow = ['전술', ...tacticNames];
        matrix.push(headerRow);
        
        // 각 전술별 상성 계산
        tacticNames.forEach(myTactic => {
            const row = [myTactic];
            
            tacticNames.forEach(opponentTactic => {
                const advantage = this.calculateTacticAdvantage(myTactic, opponentTactic);
                let symbol = '';
                
                switch (advantage) {
                    case 'advantage':
                        symbol = '✅';
                        break;
                    case 'disadvantage':
                        symbol = '❌';
                        break;
                    case 'neutral':
                        symbol = '➖';
                        break;
                }
                
                row.push(symbol);
            });
            
            matrix.push(row);
        });
        
        return matrix;
    }

    // 전술 추천 시스템
    recommendTactic(opponentTactic) {
        const recommendations = [];
        
        Object.keys(this.tactics).forEach(tactic => {
            const advantage = this.calculateTacticAdvantage(tactic, opponentTactic);
            if (advantage === 'advantage') {
                recommendations.push({
                    tactic: tactic,
                    reason: `${opponentTactic}에 효과적`,
                    description: this.tactics[tactic].description
                });
            }
        });
        
        return recommendations;
    }

    // 전술 분석 리포트
    analyzeTacticPerformance(matches) {
        const tacticStats = {};
        
        matches.forEach(match => {
            const tactic = match.myTactic;
            if (!tacticStats[tactic]) {
                tacticStats[tactic] = {
                    used: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    advantages: 0,
                    disadvantages: 0
                };
            }
            
            tacticStats[tactic].used++;
            tacticStats[tactic].goalsFor += match.goalsFor;
            tacticStats[tactic].goalsAgainst += match.goalsAgainst;
            
            if (match.result === 'win') tacticStats[tactic].wins++;
            else if (match.result === 'draw') tacticStats[tactic].draws++;
            else tacticStats[tactic].losses++;
            
            if (match.tacticAdvantage === 'advantage') tacticStats[tactic].advantages++;
            else if (match.tacticAdvantage === 'disadvantage') tacticStats[tactic].disadvantages++;
        });
        
        return tacticStats;
    }

    // 전술별 성과 계산
    calculateTacticEffectiveness(tacticStats) {
        const effectiveness = {};
        
        Object.keys(tacticStats).forEach(tactic => {
            const stats = tacticStats[tactic];
            if (stats.used === 0) return;
            
            const winRate = (stats.wins / stats.used) * 100;
            const avgGoalsFor = stats.goalsFor / stats.used;
            const avgGoalsAgainst = stats.goalsAgainst / stats.used;
            const advantageRate = (stats.advantages / stats.used) * 100;
            
            effectiveness[tactic] = {
                winRate: Math.round(winRate * 10) / 10,
                avgGoalsFor: Math.round(avgGoalsFor * 10) / 10,
                avgGoalsAgainst: Math.round(avgGoalsAgainst * 10) / 10,
                advantageRate: Math.round(advantageRate * 10) / 10,
                gamesPlayed: stats.used,
                overallRating: Math.round((winRate + advantageRate + (avgGoalsFor * 10) - (avgGoalsAgainst * 10)) / 3)
            };
        });
        
        return effectiveness;
    }
}

// 전술 시스템 인스턴스 생성
const tacticSystem = new TacticSystem();

// 전술 상성표 표시 함수
function displayTacticsMatrix() {
    const container = document.getElementById('tacticsMatrix');
    if (!container) return;
    
    const matrix = tacticSystem.generateTacticMatrix();
    
    const table = document.createElement('table');
    table.className = 'tactics-table';
    
    matrix.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        row.forEach((cell, cellIndex) => {
            const element = rowIndex === 0 ? document.createElement('th') : document.createElement('td');
            
            if (rowIndex === 0 || cellIndex === 0) {
                element.textContent = cell;
            } else {
                element.textContent = cell;
                
                // 색상 클래스 추가
                if (cell === '✅') element.className = 'advantage';
                else if (cell === '❌') element.className = 'disadvantage';
                else if (cell === '➖') element.className = 'neutral';
            }
            
            tr.appendChild(element);
        });
        
        table.appendChild(tr);
    });
    
    container.innerHTML = '';
    container.appendChild(table);
}// 전술 상성표 표시 함수
function displayTacticsMatrix() {
    const container = document.getElementById('tacticsMatrix');
    if (!container) return;
    
    const matrix = tacticSystem.generateTacticMatrix();
    
    const table = document.createElement('table');
    table.className = 'tactics-table';
    
    matrix.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        row.forEach((cell, cellIndex) => {
            const element = rowIndex === 0 ? document.createElement('th') : document.createElement('td');
            
            if (rowIndex === 0 || cellIndex === 0) {
                element.textContent = cell;
            } else {
                element.textContent = cell;
                
                // 색상 클래스 추가
                if (cell === '✅') element.className = 'advantage';
                else if (cell === '❌') element.className = 'disadvantage';
                else if (cell === '➖') element.className = 'neutral';
            }
            
            tr.appendChild(element);
        });
        
        table.appendChild(tr);
    });
    
    container.innerHTML = '';
    container.appendChild(table);
}

// 경기 시스템
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
        
        transferSystem.showMessage(`시즌 종료! ${position}위로 ${reward}억원을 받았습니다!`, 'success');
    }

    // 승강 처리
    processPromotionRelegation() {
        // TODO: 실제 순위에 따른 승강 처리
        // 현재는 임시로 잔류 처리
        gameData.teamMorale += 5; // 잔류 사기 보너스
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

// 통계 시스템
class StatisticsSystem {
    constructor() {
        this.leagueTables = {
            "1부": [],
            "2부": [],
            "3부": []
        };
        this.goalScorers = [];
        this.assisters = [];
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
                points: 0,
                position: 0
            }));
        });
    }

    // 득점왕/도움왕 업데이트
    updateTopScorers() {
        // 모든 리그의 모든 선수들을 수집
        const allPlayers = [];
        
        // 내 팀 선수들
        gameData.allPlayers.forEach(player => {
            if ((player.goals || 0) > 0 || (player.assists || 0) > 0) {
                allPlayers.push({
                    ...player,
                    team: gameData.selectedTeam,
                    league: gameData.currentLeague,
                    isMyPlayer: true
                });
            }
        });

        // 다른 팀 선수들 (랜덤 생성)
        Object.keys(playerDatabase).forEach(teamName => {
            if (teamName === gameData.selectedTeam) return;
            
            const teamLeague = this.getTeamLeague(teamName);
            const teamPlayers = playerDatabase[teamName] || [];
            
            // 팀당 몇 명의 선수에게 랜덤 골/어시스트 부여
            const selectedPlayers = teamPlayers
                .sort(() => Math.random() - 0.5)
                .slice(0, Math.floor(Math.random() * 5) + 1);
            
            selectedPlayers.forEach(player => {
                const goals = player.position === 'FW' ? 
                    Math.floor(Math.random() * 15) :
                    player.position === 'MF' ?
                    Math.floor(Math.random() * 8) :
                    Math.floor(Math.random() * 3);
                
                const assists = Math.floor(Math.random() * 10);
                
                if (goals > 0 || assists > 0) {
                    allPlayers.push({
                        ...player,
                        goals: goals,
                        assists: assists,
                        team: teamName,
                        league: teamLeague,
                        isMyPlayer: false
                    });
                }
            });
        });

        // 득점왕 정렬
        this.goalScorers = allPlayers
            .filter(p => (p.goals || 0) > 0)
            .sort((a, b) => (b.goals || 0) - (a.goals || 0))
            .slice(0, 20);

        // 도움왕 정렬
        this.assisters = allPlayers
            .filter(p => (p.assists || 0) > 0)
            .sort((a, b) => (b.assists || 0) - (a.assists || 0))
            .slice(0, 20);
    }

    getTeamLeague(teamName) {
        for (const [league, data] of Object.entries(leagueData)) {
            if (data.teams.some(team => team.name === teamName)) {
                return league;
            }
        }
        return '3부';
    }
}

// 통계 시스템 인스턴스
const statisticsSystem = new StatisticsSystem();

// 리그 테이블 초기화
function initializeLeagueTables() {
    statisticsSystem.initializeLeagueTables();
}

// 통계 표시
function displayStatistics() {
    const activeStatsTab = document.querySelector('.stats-tab.active')?.dataset.stats || 'tables';
    
    switch (activeStatsTab) {
        case 'tables':
            displayLeagueTables();
            break;
        case 'scorers':
            displayTopScorers();
            break;
        case 'assisters':
            displayTopAssisters();
            break;
    }
}

// 리그 테이블 표시
function displayLeagueTables() {
    const activeTableTab = document.querySelector('.table-tab.active')?.dataset.table || '1부';
    const container = document.getElementById('tableContainer');
    
    const tableData = statisticsSystem.leagueTables[activeTableTab];
    
    const table = document.createElement('table');
    table.className = 'league-table';
    
    // 헤더
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>순위</th>
        <th>팀명</th>
        <th>경기</th>
        <th>승</th>
        <th>무</th>
        <th>패</th>
        <th>득점</th>
        <th>실점</th>
        <th>득실차</th>
        <th>승점</th>
    `;
    table.appendChild(headerRow);
    
    // 데이터 행들
    tableData.forEach((team, index) => {
        const row = document.createElement('tr');
        
        // 순위 색상 구분
        let rowClass = '';
        if (activeTableTab === '1부' && index >= 12) rowClass = 'relegation';
        else if (activeTableTab === '2부') {
            if (index <= 1) rowClass = 'promotion';
            else if (index >= 12) rowClass = 'relegation';
        }
        else if (activeTableTab === '3부' && index <= 1) rowClass = 'promotion';
        
        if (team.name === gameData.selectedTeam) rowClass += ' my-team';
        
        row.className = rowClass;
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${team.name}</td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.drawn}</td>
            <td>${team.lost}</td>
            <td>${team.goalsFor}</td>
            <td>${team.goalsAgainst}</td>
            <td>${team.goalDifference}</td>
            <td>${team.points}</td>
        `;
        
        table.appendChild(row);
    });
    
    container.innerHTML = '';
    container.appendChild(table);
}

// 득점왕 표시
function displayTopScorers() {
    statisticsSystem.updateTopScorers();
    const container = document.getElementById('scorersList');
    
    container.innerHTML = '';
    
    statisticsSystem.goalScorers.forEach((player, index) => {
        const scorerDiv = document.createElement('div');
        scorerDiv.className = `scorer-item ${player.isMyPlayer ? 'my-player' : ''}`;
        
        scorerDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold;">${index + 1}. ${player.name}</div>
                    <div style="font-size: 0.9rem; color: #666;">
                        ${player.team} (${player.league}) | ${player.position}
                    </div>
                </div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #667eea;">
                    ${player.goals}골
                </div>
            </div>
        `;
        
        container.appendChild(scorerDiv);
    });
}

// 도움왕 표시
function displayTopAssisters() {
    statisticsSystem.updateTopScorers();
    const container = document.getElementById('assistersList');
    
    container.innerHTML = '';
    
    statisticsSystem.assisters.forEach((player, index) => {
        const assisterDiv = document.createElement('div');
        assisterDiv.className = `assister-item ${player.isMyPlayer ? 'my-player' : ''}`;
        
        assisterDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold;">${index + 1}. ${player.name}</div>
                    <div style="font-size: 0.9rem; color: #666;">
                        ${player.team} (${player.league}) | ${player.position}
                    </div>
                </div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #4ecdc4;">
                    ${player.assists}도움
                </div>
            </div>
        `;
        
        container.appendChild(assisterDiv);
    });
}

// 설정 화면 표시
function displaySettings() {
    displayTacticsMatrix();
    displayPlayerPotentials();
}

// 선수 포텐셜 표시
function displayPlayerPotentials() {
    const container = document.getElementById('potentialList');
    if (!container) return;
    
    const potentials = playerGrowthSystem.getTeamGrowthSummary();
    
    container.innerHTML = '';
    
    if (potentials.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666;">성장 가능한 선수가 없습니다.</div>';
        return;
    }
    
    potentials.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'potential-player';
        
        playerDiv.innerHTML = `
            <div class="potential-player-name">${player.name}</div>
            <div class="potential-details">
                포지션: ${player.position} | 현재: ${player.currentRating} | 최대: ${player.maxPotential}
            </div>
            <div class="potential-progress">
                <div>성장 진행도: ${player.progressPercentage}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${player.progressPercentage}%"></div>
                </div>
            </div>
        `;
        
        container.appendChild(playerDiv);
    });
}

// 게임 저장
function saveGame() {
    const saveData = {
        selectedTeam: gameData.selectedTeam,
        currentLeague: gameData.currentLeague,
        teamMoney: gameData.teamMoney,
        teamMorale: gameData.teamMorale,
        matchesPlayed: gameData.matchesPlayed,
        season: gameData.season,
        squad: gameData.squad,
        bench: gameData.bench,
        allPlayers: gameData.allPlayers,
        transferMarket: gameData.transferMarket,
        currentSponsor: gameData.currentSponsor,
        sponsorContract: gameData.sponsorContract,
        leagueHistory: gameData.leagueHistory,
        currentTactic: gameData.currentTactic,
        matchDay: gameData.matchDay,
        snsNews: snsSystem.news,
        leagueTables: statisticsSystem.leagueTables,
        timestamp: Date.now()
    };
    
    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${gameData.selectedTeam}_${gameData.season}_${gameData.currentLeague}.json`;
    link.click();
    
    transferSystem.showMessage('게임이 저장되었습니다!', 'success');
}

// 게임 불러오기
function loadGame(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const saveData = JSON.parse(e.target.result);
            
            // 데이터 복원
            Object.keys(saveData).forEach(key => {
                if (key === 'snsNews') {
                    snsSystem.news = saveData[key];
                } else if (key === 'leagueTables') {
                    statisticsSystem.leagueTables = saveData[key];
                } else if (key !== 'timestamp') {
                    gameData[key] = saveData[key];
                }
            });
            
            // UI 업데이트
            updateHeader();
            showLobby();
            
            transferSystem.showMessage('게임이 불러와졌습니다!', 'success');
            
        } catch (error) {
            transferSystem.showMessage('파일을 불러오는데 실패했습니다!', 'error');
            console.error('Load error:', error);
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // 파일 입력 초기화
}

// 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', () => {
    // 통계 탭 이벤트
    document.querySelectorAll('.stats-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.stats-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.stats-pane').forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.stats).classList.add('active');
            
            displayStatistics();
        });
    });
    
    // 리그 테이블 탭 이벤트
    document.querySelectorAll('.table-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.table-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            displayLeagueTables();
        });
    });
}); 생성
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

    // 전술 시스템
class TacticSystem {
    constructor() {
        this.tactics = {
            "게겐프레싱": {
                effective: ["두 줄 수비", "점유율 축구"],
                ineffective: ["롱볼축구", "카테나치오"],
                description: "전방 압박으로 상대방의 빌드업을 차단하는 전술"
            },
            "두 줄 수비": {
                effective: ["롱볼축구", "침대 축구"],
                ineffective: ["게겐프레싱", "토탈 풋볼"],
                description: "촘촘한 수비라인으로 상대 공격을 차단"
            },
            "라볼피아나": {
                effective: ["점유율 축구", "티키타카"],
                ineffective: ["카테나치오", "롱볼축구"],
                description: "수비진부터 시작하는 정교한 빌드업 전술"
            },
            "롱볼축구": {
                effective: ["침대 축구", "카테나치오"],
                ineffective: ["게겐프레싱", "티키타카"],
                description: "긴 패스를 통한 직접적이고 빠른 공격"
            },
            "점유율 축구": {
                effective: ["티키타카", "라볼피아나"],
                ineffective: ["롱볼축구", "게겐프레싱"],
                description: "볼 점유를 통해 경기를 지배하는 전술"
            },
            "침대 축구": {
                effective: ["카테나치오", "두 줄 수비"],
                ineffective: ["게겐프레싱", "토탈 풋볼"],
                description: "극도로 수비적인 전술로 실점을 최소화"
            },
            "카테나치오": {
                effective: ["두 줄 수비", "침대 축구"],
                ineffective: ["점유율 축구", "토탈 풋볼"],
                description: "이탈리아식 수비 전술, 조직적인 수비 후 역습"
            },
            "토탈 풋볼": {
                effective: ["티키타카", "게겐프레싱"],
                ineffective: ["두 줄 수비", "카테나치오"],
                description: "모든 선수가 공격과 수비를 함께하는 전술"
            },
            "티키타카": {
                effective: ["점유율 축구", "라볼피아나"],
                ineffective: ["롱볼축구", "침대 축구"],
                description: "짧은 패스 위주의 정교한 볼 컨트롤 전술"
            }
        };

        // 팀별 기본 전술
        this.teamTactics = {
            // 1부리그
            "레알 마드리드": "점유율 축구",
            "바르셀로나": "토탈 풋볼",
            "맨체스터 시티": "티키타카",
            "바이에른 뮌헨": "티키타카",
            "파리 생제르맹": "점유율 축구",
            "리버풀": "게겐프레싱",
            "아스널": "두 줄 수비",
            "AC 밀란": "게겐프레싱",
            "인터 밀란": "토탈 풋볼",
            "아틀레티코 마드리드": "카테나치오",
            "첼시": "롱볼축구",
            "도르트문트": "게겐프레싱",
            "나폴리": "침대 축구",
            "토트넘 홋스퍼": "게겐프레싱",
            
            // 2부리그
            "유벤투스": "카테나치오",
            "라이프치히": "게겐프레싱",
            "뉴캐슬 유나이티드": "라볼피아나",
            "세비야": "점유율 축구",
            "아약스": "토탈 풋볼",
            "로마": "롱볼축구",
            "레버쿠젠": "롱볼축구",
            "페예노르트": "토탈 풋볼",
            "리옹": "점유율 축구",
            "벤피카": "침대 축구",
            "PSV": "토탈 풋볼",
            "스포르팅 CP": "점유율 축구",
            "셀틱": "게겐프레싱",
            "아스톤 빌라": "두 줄 수비",
            
            // 3부리그
            "FC 서울": "점유율 축구",
            "전북 현대": "게겐프레싱",
            "울산 현대": "두 줄 수비",
            "포항 스틸러스": "롱볼축구",
            "광주 FC": "침대 축구",
            "마르세유": "게겐프레싱",
            "브라질 연합": "티키타카",
            "아르헨티나 연합": "라볼피아나",
            "멕시코 연합": "롱볼축구",
            "미국 연합": "두 줄 수비",
            "알힐랄": "점유율 축구",
            "알나스르": "카테나치오",
            "알이티하드": "침대 축구",
            "갈라타사라이": "게겐프레싱"
        };
    }

    // 전술 상성 계산
    calculateTacticAdvantage(myTactic, opponentTactic) {
        const myTacticData = this.tactics[myTactic];
        
        if (myTacticData.effective.includes(opponentTactic)) {
            return "advantage"; // 유리
        } else if (myTacticData.ineffective.includes(opponentTactic)) {
            return "disadvantage"; // 불리
        } else {
            return "neutral"; // 중립
        }
    }

    // 전술 효과 적용
    applyTacticEffects(myTactic, opponentTactic) {
        const advantage = this.calculateTacticAdvantage(myTactic, opponentTactic);
        
        let goalProbabilityModifier = 0;
        let moraleModifier = 0;
        
        switch (advantage) {
            case "advantage":
                goalProbabilityModifier = 0.5; // 골 확률 +0.5%
                moraleModifier = 5; // 사기 +5
                break;
            case "disadvantage":
                goalProbabilityModifier = -0.5; // 골 확률 -0.5%
                moraleModifier = -5; // 사기 -5
                break;
            case "neutral":
                goalProbabilityModifier = 0;
                moraleModifier = 0;
                break;
        }
        
        return {
            advantage: advantage,
            goalProbabilityModifier: goalProbabilityModifier,
            moraleModifier: moraleModifier,
            description: this.getTacticAdvantageDescription(advantage, myTactic, opponentTactic)
        };
    }

    // 전술 상성 설명 가져오기
    getTacticAdvantageDescription(advantage, myTactic, opponentTactic) {
        switch (advantage) {
            case "advantage":
                return `${myTactic}이(가) ${opponentTactic}을(를) 효과적으로 카운터합니다!`;
            case "disadvantage":
                return `${opponentTactic}이(가) ${myTactic}을(를) 억제하고 있습니다.`;
            case "neutral":
                return `${myTactic} vs ${opponentTactic} - 균등한 전술 대결`;
            default:
                return "";
        }
    }

    // 팀의 기본 전술 가져오기
    getTeamTactic(teamName) {
        return this.teamTactics[teamName] || "게겐프레싱";
    }

    // AI 팀 전술 변경 (경기 중)
    shouldAIChangeTactic(scoreDifference, minute) {
        // 2점 이상 뒤질 때 80% 확률로 하프타임에 변경
        if (scoreDifference <= -2 && minute === 45 && Math.random() < 0.8) {
            return true;
        }
        
        // 60분 이후 1점 이상 뒤질 때 40% 확률로 변경
        if (scoreDifference <= -1 && minute >= 60 && Math.random() < 0.4) {
            return true;
        }
        
        return false;
    }

    // 랜덤 전술 선택 (AI용)
    getRandomTactic(excludeTactic = null) {
        const tacticNames = Object.keys(this.tactics);
        let availableTactics = tacticNames;
        
        if (excludeTactic) {
            availableTactics = tacticNames.filter(tactic => tactic !== excludeTactic);
        }
        
        return availableTactics[Math.floor(Math.random() * availableTactics.length)];
    }

    // 전술 상성표 생성
    generateTacticMatrix() {
        const tacticNames = Object.keys(this.tactics);
        const matrix = [];
        
        // 헤더 행
        const headerRow = ['전술', ...tacticNames];
        matrix.push(headerRow);
        
        // 각 전술별 상성 계산
        tacticNames.forEach(myTactic => {
            const row = [myTactic];
            
            tacticNames.forEach(opponentTactic => {
                const advantage = this.calculateTacticAdvantage(myTactic, opponentTactic);
                let symbol = '';
                
                switch (advantage) {
                    case 'advantage':
                        symbol = '✅';
                        break;
                    case 'disadvantage':
                        symbol = '❌';
                        break;
                    case 'neutral':
                        symbol = '➖';
                        break;
                }
                
                row.push(symbol);
            });
            
            matrix.push(row);
        });
        
        return matrix;
    }

    // 전술 추천 시스템
    recommendTactic(opponentTactic) {
        const recommendations = [];
        
        Object.keys(this.tactics).forEach(tactic => {
            const advantage = this.calculateTacticAdvantage(tactic, opponentTactic);
            if (advantage === 'advantage') {
                recommendations.push({
                    tactic: tactic,
                    reason: `${opponentTactic}에 효과적`,
                    description: this.tactics[tactic].description
                });
            }
        });
        
        return recommendations;
    }

    // 전술 분석 리포트
    analyzeTacticPerformance(matches) {
        const tacticStats = {};
        
        matches.forEach(match => {
            const tactic = match.myTactic;
            if (!tacticStats[tactic]) {
                tacticStats[tactic] = {
                    used: 0,
                    wins: 0,
                    draws: 0,
                    losses: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    advantages: 0,
                    disadvantages: 0
                };
            }
            
            tacticStats[tactic].used++;
            tacticStats[tactic].goalsFor += match.goalsFor;
            tacticStats[tactic].goalsAgainst += match.goalsAgainst;
            
            if (match.result === 'win') tacticStats[tactic].wins++;
            else if (match.result === 'draw') tacticStats[tactic].draws++;
            else tacticStats[tactic].losses++;
            
            if (match.tacticAdvantage === 'advantage') tacticStats[tactic].advantages++;
            else if (match.tacticAdvantage === 'disadvantage') tacticStats[tactic].disadvantages++;
        });
        
        return tacticStats;
    }

    // 전술별 성과 계산
    calculateTacticEffectiveness(tacticStats) {
        const effectiveness = {};
        
        Object.keys(tacticStats).forEach(tactic => {
            const stats = tacticStats[tactic];
            if (stats.used === 0) return;
            
            const winRate = (stats.wins / stats.used) * 100;
            const avgGoalsFor = stats.goalsFor / stats.used;
            const avgGoalsAgainst = stats.goalsAgainst / stats.used;
            const advantageRate = (stats.advantages / stats.used) * 100;
            
            effectiveness[tactic] = {
                winRate: Math.round(winRate * 10) / 10,
                avgGoalsFor: Math.round(avgGoalsFor * 10) / 10,
                avgGoalsAgainst: Math.round(avgGoalsAgainst * 10) / 10,
                advantageRate: Math.round(advantageRate * 10) / 10,
                gamesPlayed: stats.used,
                overallRating: Math.round((winRate + advantageRate + (avgGoalsFor * 10) - (avgGoalsAgainst * 10)) / 3)
            };
        });
        
        return effectiveness;
    }
}

// 전술 시스템 인스턴스 생성
const tacticSystem = new TacticSystem();

// 전술 상성표 표시 함수
function displayTacticsMatrix() {
    const container = document.getElementById('tacticsMatrix');
    if (!container) return;
    
    const matrix = tacticSystem.generateTacticMatrix();
    
    const table = document.createElement('table');
    table.className = 'tactics-table';
    
    matrix.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        
        row.forEach((cell, cellIndex) => {
            const element = rowIndex === 0 ? document.createElement('th') : document.createElement('td');
            
            if (rowIndex === 0 || cellIndex === 0) {
                element.textContent = cell;
            } else {
                element.textContent = cell;
                
                // 색상 클래스 추가
                if (cell === '✅') element.className = 'advantage';
                else if (cell === '❌') element.className = 'disadvantage';
                else if (cell === '➖') element.className = 'neutral';
            }
            
            tr.appendChild(element);
        });
        
        table.appendChild(tr);
    });
    
    container.innerHTML = '';
    container.appendChild(table);
}
