// 기록 시스템
class RecordsSystem {
    constructor() {
        this.goalScorers = new Map(); // 선수별 득점 기록
        this.assistProviders = new Map(); // 선수별 도움 기록
        this.matchHistory = []; // 경기 기록
        this.seasonStats = {
            goals: 0,
            assists: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            cleanSheets: 0
        };
    }

    // 득점 기록 추가
    addGoal(playerName, teamKey, opponent, minute) {
        const key = `${playerName}_${teamKey}`;
        
        if (!this.goalScorers.has(key)) {
            this.goalScorers.set(key, {
                playerName: playerName,
                teamKey: teamKey,
                goals: 0,
                matches: []
            });
        }
        
        const player = this.goalScorers.get(key);
        player.goals++;
        player.matches.push({
            opponent: opponent,
            minute: minute,
            date: new Date().toLocaleDateString()
        });
        
        this.goalScorers.set(key, player);
        
        // 시즌 통계 업데이트 (내 팀 선수인 경우)
        if (teamKey === gameData.selectedTeam) {
            this.seasonStats.goals++;
        }
    }

    // 어시스트 기록 추가
    addAssist(playerName, teamKey, opponent, minute) {
        const key = `${playerName}_${teamKey}`;
        
        if (!this.assistProviders.has(key)) {
            this.assistProviders.set(key, {
                playerName: playerName,
                teamKey: teamKey,
                assists: 0,
                matches: []
            });
        }
        
        const player = this.assistProviders.get(key);
        player.assists++;
        player.matches.push({
            opponent: opponent,
            minute: minute,
            date: new Date().toLocaleDateString()
        });
        
        this.assistProviders.set(key, player);
        
        // 시즌 통계 업데이트 (내 팀 선수인 경우)
        if (teamKey === gameData.selectedTeam) {
            this.seasonStats.assists++;
        }
    }

    // 경기 결과 기록
    addMatchResult(homeTeam, awayTeam, homeScore, awayScore, matchEvents) {
        const match = {
            id: this.matchHistory.length + 1,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            homeScore: homeScore,
            awayScore: awayScore,
            events: matchEvents,
            date: new Date().toLocaleDateString(),
            isMyTeamMatch: homeTeam === gameData.selectedTeam || awayTeam === gameData.selectedTeam
        };
        
        this.matchHistory.push(match);
        
        // 내 팀 경기인 경우 시즌 통계 업데이트
        if (match.isMyTeamMatch) {
            const myTeamScore = homeTeam === gameData.selectedTeam ? homeScore : awayScore;
            const opponentScore = homeTeam === gameData.selectedTeam ? awayScore : homeScore;
            
            if (myTeamScore > opponentScore) {
                this.seasonStats.wins++;
            } else if (myTeamScore === opponentScore) {
                this.seasonStats.draws++;
            } else {
                this.seasonStats.losses++;
            }
            
            // 클린시트 체크
            if (opponentScore === 0) {
                this.seasonStats.cleanSheets++;
            }
        }
        
        // 최대 50경기만 보관
        if (this.matchHistory.length > 50) {
            this.matchHistory.shift();
        }
    }

    // 득점왕 순위 (상위 5명)
    getTopScorers(limit = 5) {
        const scorers = Array.from(this.goalScorers.values())
            .filter(player => player.goals > 0)
            .sort((a, b) => b.goals - a.goals)
            .slice(0, limit);
        
        return scorers;
    }

    // 도움왕 순위 (상위 5명)
    getTopAssistProviders(limit = 5) {
        const assisters = Array.from(this.assistProviders.values())
            .filter(player => player.assists > 0)
            .sort((a, b) => b.assists - a.assists)
            .slice(0, limit);
        
        return assisters;
    }

    // 최근 경기 기록 (상위 10경기)
    getRecentMatches(limit = 10) {
        return this.matchHistory
            .slice(-limit)
            .reverse(); // 최신 경기가 위로 오도록
    }

    // 내 팀 최근 경기 기록
    getMyTeamRecentMatches(limit = 5) {
        return this.matchHistory
            .filter(match => match.isMyTeamMatch)
            .slice(-limit)
            .reverse();
    }

    // 선수별 상세 기록 조회
    getPlayerStats(playerName, teamKey) {
        const goalKey = `${playerName}_${teamKey}`;
        const assistKey = `${playerName}_${teamKey}`;
        
        const goals = this.goalScorers.get(goalKey) || { goals: 0, matches: [] };
        const assists = this.assistProviders.get(assistKey) || { assists: 0, matches: [] };
        
        return {
            playerName: playerName,
            teamKey: teamKey,
            goals: goals.goals,
            assists: assists.assists,
            goalMatches: goals.matches,
            assistMatches: assists.matches
        };
    }

    // 팀별 통계
    getTeamStats(teamKey) {
        let goals = 0;
        let assists = 0;
        let matches = 0;
        let wins = 0;
        let draws = 0;
        let losses = 0;

        // 득점 통계
        this.goalScorers.forEach(player => {
            if (player.teamKey === teamKey) {
                goals += player.goals;
            }
        });

        // 어시스트 통계
        this.assistProviders.forEach(player => {
            if (player.teamKey === teamKey) {
                assists += player.assists;
            }
        });

        // 경기 결과 통계
        this.matchHistory.forEach(match => {
            if (match.homeTeam === teamKey || match.awayTeam === teamKey) {
                matches++;
                const teamScore = match.homeTeam === teamKey ? match.homeScore : match.awayScore;
                const opponentScore = match.homeTeam === teamKey ? match.awayScore : match.homeScore;
                
                if (teamScore > opponentScore) wins++;
                else if (teamScore === opponentScore) draws++;
                else losses++;
            }
        });

        return {
            teamKey: teamKey,
            teamName: teamNames[teamKey],
            goals: goals,
            assists: assists,
            matches: matches,
            wins: wins,
            draws: draws,
            losses: losses,
            points: wins * 3 + draws
        };
    }

    // 시즌 통계 리셋
    resetSeasonStats() {
        this.seasonStats = {
            goals: 0,
            assists: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            cleanSheets: 0
        };
    }

    // 전체 기록 리셋
    resetAllRecords() {
        this.goalScorers.clear();
        this.assistProviders.clear();
        this.matchHistory = [];
        this.resetSeasonStats();
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            goalScorers: Array.from(this.goalScorers.entries()),
            assistProviders: Array.from(this.assistProviders.entries()),
            matchHistory: this.matchHistory,
            seasonStats: this.seasonStats
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        if (saveData.goalScorers) {
            this.goalScorers = new Map(saveData.goalScorers);
        }
        if (saveData.assistProviders) {
            this.assistProviders = new Map(saveData.assistProviders);
        }
        if (saveData.matchHistory) {
            this.matchHistory = saveData.matchHistory;
        }
        if (saveData.seasonStats) {
            this.seasonStats = saveData.seasonStats;
        }
    }
}

// 전역 기록 시스템 인스턴스
const recordsSystem = new RecordsSystem();

// 기록 화면 로드
function loadRecordsScreen() {
    const recordsContent = document.getElementById('recordsContent');
    
    const topScorers = recordsSystem.getTopScorers(5);
    const topAssisters = recordsSystem.getTopAssistProviders(5);
    const recentMatches = recordsSystem.getRecentMatches(10);
    const myTeamStats = recordsSystem.getTeamStats(gameData.selectedTeam);

    let html = `
        <div class="records-container">
            <!-- 시즌 통계 -->
            <div class="section season-stats">
                <h3>🏆 시즌 통계</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${recordsSystem.seasonStats.goals}</div>
                        <div class="stat-label">팀 득점</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${recordsSystem.seasonStats.assists}</div>
                        <div class="stat-label">팀 도움</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${recordsSystem.seasonStats.wins}</div>
                        <div class="stat-label">승리</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${recordsSystem.seasonStats.draws}</div>
                        <div class="stat-label">무승부</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${recordsSystem.seasonStats.losses}</div>
                        <div class="stat-label">패배</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${recordsSystem.seasonStats.cleanSheets}</div>
                        <div class="stat-label">클린시트</div>
                    </div>
                </div>
            </div>

            <div class="records-grid">
                <!-- 득점왕 -->
                <div class="section top-scorers">
                    <h3>⚽ 득점왕</h3>
                    <div class="ranking-list">
    `;

    if (topScorers.length === 0) {
        html += '<p class="no-data">아직 득점 기록이 없습니다.</p>';
    } else {
        topScorers.forEach((player, index) => {
            const isMyPlayer = player.teamKey === gameData.selectedTeam;
            html += `
                <div class="ranking-item ${isMyPlayer ? 'my-player' : ''}">
                    <div class="rank">${index + 1}</div>
                    <div class="player-info">
                        <div class="player-name">${player.playerName}</div>
                        <div class="team-name">${teamNames[player.teamKey]}</div>
                    </div>
                    <div class="score">${player.goals}골</div>
                </div>
            `;
        });
    }

    html += `
                    </div>
                </div>

                <!-- 도움왕 -->
                <div class="section top-assisters">
                    <h3>🎯 도움왕</h3>
                    <div class="ranking-list">
    `;

    if (topAssisters.length === 0) {
        html += '<p class="no-data">아직 어시스트 기록이 없습니다.</p>';
    } else {
        topAssisters.forEach((player, index) => {
            const isMyPlayer = player.teamKey === gameData.selectedTeam;
            html += `
                <div class="ranking-item ${isMyPlayer ? 'my-player' : ''}">
                    <div class="rank">${index + 1}</div>
                    <div class="player-info">
                        <div class="player-name">${player.playerName}</div>
                        <div class="team-name">${teamNames[player.teamKey]}</div>
                    </div>
                    <div class="score">${player.assists}도움</div>
                </div>
            `;
        });
    }

    html += `
                    </div>
                </div>
            </div>

            <!-- 최근 경기 결과 -->
            <div class="section recent-matches">
                <h3>📋 최근 경기 결과</h3>
                <div class="matches-list">
    `;

    if (recentMatches.length === 0) {
        html += '<p class="no-data">아직 경기 기록이 없습니다.</p>';
    } else {
        recentMatches.forEach(match => {
            const isMyTeamHome = match.homeTeam === gameData.selectedTeam;
            const isMyTeamAway = match.awayTeam === gameData.selectedTeam;
            const isMyMatch = isMyTeamHome || isMyTeamAway;
            
            let resultClass = '';
            if (isMyMatch) {
                const myScore = isMyTeamHome ? match.homeScore : match.awayScore;
                const opponentScore = isMyTeamHome ? match.awayScore : match.homeScore;
                
                if (myScore > opponentScore) resultClass = 'win';
                else if (myScore === opponentScore) resultClass = 'draw';
                else resultClass = 'loss';
            }

            html += `
                <div class="match-item ${isMyMatch ? 'my-match ' + resultClass : ''}" onclick="showMatchDetails(${match.id})">
                    <div class="match-date">${match.date}</div>
                    <div class="match-teams">
                        <span class="home-team ${isMyTeamHome ? 'my-team' : ''}">${teamNames[match.homeTeam]}</span>
                        <span class="score">${match.homeScore} - ${match.awayScore}</span>
                        <span class="away-team ${isMyTeamAway ? 'my-team' : ''}">${teamNames[match.awayTeam]}</span>
                    </div>
                    <div class="match-type">${isMyMatch ? '리그' : '리그'}</div>
                </div>
            `;
        });
    }

    html += `
                </div>
            </div>

            <!-- 내 팀 선수 기록 -->
            <div class="section my-team-players">
                <h3>👥 우리 팀 선수 기록</h3>
                <div class="players-stats">
    `;

    if (gameData.selectedTeam && teams[gameData.selectedTeam]) {
        const myPlayers = teams[gameData.selectedTeam];
        const playersWithStats = myPlayers.map(player => {
            const stats = recordsSystem.getPlayerStats(player.name, gameData.selectedTeam);
            return {
                ...player,
                goals: stats.goals,
                assists: stats.assists
            };
        }).filter(player => player.goals > 0 || player.assists > 0);

        if (playersWithStats.length === 0) {
            html += '<p class="no-data">아직 우리 팀 선수들의 기록이 없습니다.</p>';
        } else {
            playersWithStats
                .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
                .forEach(player => {
                    html += `
                        <div class="player-stat-item">
                            <div class="player-info">
                                <div class="player-name">${player.name}</div>
                                <div class="player-position">${player.position} | 능력치: ${player.rating}</div>
                            </div>
                            <div class="player-stats">
                                <span class="goals">${player.goals}골</span>
                                <span class="assists">${player.assists}도움</span>
                            </div>
                        </div>
                    `;
                });
        }
    }

    html += `
                </div>
            </div>

            <!-- 기록 관리 -->
            <div class="section record-management">
                <h3>🔧 기록 관리</h3>
                <div class="management-buttons">
                    <button onclick="exportRecords()" class="export-btn">기록 내보내기</button>
                    <button onclick="resetSeasonRecords()" class="reset-season-btn">시즌 기록 초기화</button>
                    <button onclick="resetAllRecords()" class="reset-all-btn">전체 기록 초기화</button>
                </div>
            </div>
        </div>
    `;

    recordsContent.innerHTML = html;
}

// 경기 상세 정보 표시
function showMatchDetails(matchId) {
    const match = recordsSystem.matchHistory.find(m => m.id === matchId);
    if (!match) return;

    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    let eventsHtml = '';
    if (match.events && match.events.length > 0) {
        eventsHtml = '<h4>경기 이벤트</h4><div class="match-events-detail">';
        match.events.forEach(event => {
            let eventClass = '';
            let eventIcon = '';
            
            switch(event.type) {
                case 'goal':
                    eventClass = 'goal';
                    eventIcon = '⚽';
                    break;
                case 'assist':
                    eventClass = 'assist';
                    eventIcon = '🎯';
                    break;
                case 'card':
                    eventClass = 'card';
                    eventIcon = event.cardType === 'yellow' ? '🟨' : '🟥';
                    break;
                default:
                    eventIcon = '📝';
            }
            
            eventsHtml += `
                <div class="event-item ${eventClass}">
                    <span class="event-icon">${eventIcon}</span>
                    <span class="event-time">${event.minute}'</span>
                    <span class="event-description">${event.description}</span>
                </div>
            `;
        });
        eventsHtml += '</div>';
    }

    modal.innerHTML = `
        <div class="modal-content">
            <h3>경기 상세 정보</h3>
            <div class="match-header-detail">
                <div class="match-score-detail">
                    <span class="team">${teamNames[match.homeTeam]}</span>
                    <span class="score-big">${match.homeScore} - ${match.awayScore}</span>
                    <span class="team">${teamNames[match.awayTeam]}</span>
                </div>
                <div class="match-date-detail">${match.date}</div>
            </div>
            ${eventsHtml}
            <button onclick="closeModal()" class="close-btn">닫기</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 기록 내보내기
function exportRecords() {
    const data = {
        topScorers: recordsSystem.getTopScorers(10),
        topAssisters: recordsSystem.getTopAssistProviders(10),
        recentMatches: recordsSystem.getRecentMatches(20),
        seasonStats: recordsSystem.seasonStats,
        teamStats: recordsSystem.getTeamStats(gameData.selectedTeam),
        exportDate: new Date().toLocaleDateString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    link.download = `${teamNames[gameData.selectedTeam]}_기록_${dateStr}.json`;
    
    link.click();
    alert('기록이 성공적으로 내보내졌습니다!');
}

// 시즌 기록 초기화
function resetSeasonRecords() {
    if (confirm('정말로 시즌 기록을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        recordsSystem.resetSeasonStats();
        loadRecordsScreen();
        alert('시즌 기록이 초기화되었습니다.');
    }
}

// 전체 기록 초기화
function resetAllRecords() {
    if (confirm('정말로 모든 기록을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        if (confirm('한 번 더 확인합니다. 정말로 모든 기록을 삭제하시겠습니까?')) {
            recordsSystem.resetAllRecords();
            loadRecordsScreen();
            alert('모든 기록이 초기화되었습니다.');
        }
    }
}

// 경기 종료 시 기록 업데이트 (다른 파일에서 호출)
function updateMatchRecords(homeTeam, awayTeam, homeScore, awayScore, events) {
    recordsSystem.addMatchResult(homeTeam, awayTeam, homeScore, awayScore, events);
    
    // 이벤트에서 득점자와 어시스트 추출
    events.forEach(event => {
        if (event.type === 'goal' && event.player) {
            recordsSystem.addGoal(
                event.player.name, 
                event.team, 
                event.team === homeTeam ? awayTeam : homeTeam, 
                event.minute
            );
        }
        
        if (event.type === 'assist' && event.player) {
            recordsSystem.addAssist(
                event.player.name, 
                event.team, 
                event.team === homeTeam ? awayTeam : homeTeam, 
                event.minute
            );
        }
    });
}

// 선수별 시즌 통계 조회
function getPlayerSeasonStats(playerName) {
    if (!gameData.selectedTeam) return null;
    
    return recordsSystem.getPlayerStats(playerName, gameData.selectedTeam);
}

// 팀 비교 통계
function compareTeamStats(teamKey1, teamKey2) {
    const team1Stats = recordsSystem.getTeamStats(teamKey1);
    const team2Stats = recordsSystem.getTeamStats(teamKey2);
    
    return {
        team1: team1Stats,
        team2: team2Stats,
        comparison: {
            goalDifference: team1Stats.goals - team2Stats.goals,
            assistDifference: team1Stats.assists - team2Stats.assists,
            pointsDifference: team1Stats.points - team2Stats.points
        }
    };
}

// 월별 통계 (향후 확장용)
function getMonthlyStats(month, year) {
    const monthMatches = recordsSystem.matchHistory.filter(match => {
        const matchDate = new Date(match.date);
        return matchDate.getMonth() === month && matchDate.getFullYear() === year;
    });
    
    let goals = 0;
    let assists = 0;
    let wins = 0;
    let draws = 0;
    let losses = 0;
    
    monthMatches.forEach(match => {
        if (match.isMyTeamMatch) {
            const myTeamScore = match.homeTeam === gameData.selectedTeam ? match.homeScore : match.awayScore;
            const opponentScore = match.homeTeam === gameData.selectedTeam ? match.awayScore : match.homeScore;
            
            goals += myTeamScore;
            
            if (myTeamScore > opponentScore) wins++;
            else if (myTeamScore === opponentScore) draws++;
            else losses++;
        }
    });
    
    return {
        month: month,
        year: year,
        matches: monthMatches.length,
        goals: goals,
        assists: assists,
        wins: wins,
        draws: draws,
        losses: losses,
        points: wins * 3 + draws
    };
}

// 저장/불러오기에 기록 데이터 포함
const originalSaveGame4 = window.saveGame;
window.saveGame = function() {
    gameData.recordsData = recordsSystem.getSaveData();
    if (originalSaveGame4) {
        originalSaveGame4.call(this);
    }
};

const originalLoadGame4 = window.loadGame;
window.loadGame = function() {
    if (originalLoadGame4) {
        originalLoadGame4.call(this);
    }
    if (gameData.recordsData) {
        recordsSystem.loadSaveData(gameData.recordsData);
    }
};
