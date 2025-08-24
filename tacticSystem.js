// 전술 시스템
class TacticSystem {
    constructor() {
        // 전술별 효과와 상성 정의
        this.tactics = {
            gegenpressing: {
                name: '게겐프레싱',
                description: '높은 압박과 빠른 역습',
                effective: ['twoLineDefense', 'possession'],
                ineffective: ['longBall', 'catenaccio'],
                effects: {
                    attackBonus: 1.2,
                    defenseBonus: 1.0,
                    possession: -5, // 점유율 -5%
                    moraleBonusWin: 2,
                    moraleBonusLoss: -1
                }
            },
            twoLineDefense: {
                name: '두 줄 수비',
                description: '안정적인 수비진 배치',
                effective: ['longBall', 'parking'],
                ineffective: ['gegenpressing', 'totalFootball'],
                effects: {
                    attackBonus: 0.9,
                    defenseBonus: 1.3,
                    possession: -10,
                    moraleBonusWin: 1,
                    moraleBonusLoss: -2
                }
            },
            lavolpiana: {
                name: '라볼피아나',
                description: '창의적인 공격 전개',
                effective: ['possession', 'tikitaka'],
                ineffective: ['catenaccio', 'longBall'],
                effects: {
                    attackBonus: 1.3,
                    defenseBonus: 0.8,
                    possession: 10,
                    moraleBonusWin: 3,
                    moraleBonusLoss: -3
                }
            },
            longBall: {
                name: '롱볼축구',
                description: '직접적이고 빠른 공격',
                effective: ['parking', 'catenaccio'],
                ineffective: ['gegenpressing', 'tikitaka'],
                effects: {
                    attackBonus: 1.1,
                    defenseBonus: 1.1,
                    possession: -15,
                    moraleBonusWin: 1,
                    moraleBonusLoss: -1
                }
            },
            possession: {
                name: '점유율 축구',
                description: '볼 점유를 통한 경기 지배',
                effective: ['tikitaka', 'lavolpiana'],
                ineffective: ['longBall', 'gegenpressing'],
                effects: {
                    attackBonus: 1.1,
                    defenseBonus: 1.0,
                    possession: 20,
                    moraleBonusWin: 2,
                    moraleBonusLoss: -2
                }
            },
            parking: {
                name: '침대축구',
                description: '극도로 수비적인 전술',
                effective: ['catenaccio', 'twoLineDefense'],
                ineffective: ['gegenpressing', 'totalFootball'],
                effects: {
                    attackBonus: 0.6,
                    defenseBonus: 1.5,
                    possession: -25,
                    moraleBonusWin: 1,
                    moraleBonusLoss: -4
                }
            },
            catenaccio: {
                name: '카테나치오',
                description: '이탈리아식 수비 전술',
                effective: ['twoLineDefense', 'parking'],
                ineffective: ['possession', 'totalFootball'],
                effects: {
                    attackBonus: 0.8,
                    defenseBonus: 1.4,
                    possession: -20,
                    moraleBonusWin: 1,
                    moraleBonusLoss: -3
                }
            },
            totalFootball: {
                name: '토탈풋볼',
                description: '전 선수가 공수를 병행',
                effective: ['tikitaka', 'gegenpressing'],
                ineffective: ['twoLineDefense', 'catenaccio'],
                effects: {
                    attackBonus: 1.2,
                    defenseBonus: 0.9,
                    possession: 5,
                    moraleBonusWin: 3,
                    moraleBonusLoss: -2
                }
            },
            tikitaka: {
                name: '티키타카',
                description: '짧은 패스의 연속',
                effective: ['possession', 'lavolpiana'],
                ineffective: ['longBall', 'parking'],
                effects: {
                    attackBonus: 1.1,
                    defenseBonus: 0.9,
                    possession: 25,
                    moraleBonusWin: 2,
                    moraleBonusLoss: -2
                }
            }
        };

        // 각 팀의 기본 전술
        this.teamTactics = {
            manCity: 'tikitaka',
            liverpool: 'gegenpressing',
            manUnited: 'possession',
            arsenal: 'twoLineDefense',
            chelsea: 'longBall',
            tottenham: 'gegenpressing',
            realMadrid: 'possession',
            barcelona: 'totalFootball',
            acMilan: 'gegenpressing',
            inter: 'totalFootball',
            bayern: 'tikitaka',
            psg: 'possession',
            leverkusen: 'longBall',
            dortmund: 'gegenpressing',
            newCastle: 'lavolpiana',
            asRoma: 'longBall',
            atMadrid: 'catenaccio',
            napoli: 'parking'
        };
    }

    // 전술 효과 계산
    calculateTacticEffect(playerTactic, opponentTactic) {
        const playerTacticData = this.tactics[playerTactic];
        const opponentTacticData = this.tactics[opponentTactic];
        
        if (!playerTacticData || !opponentTacticData) {
            return {
                playerBonus: 1.0,
                opponentBonus: 1.0,
                playerPossession: 50,
                description: '일반적인 경기'
            };
        }

        let playerBonus = 1.0;
        let opponentBonus = 1.0;
        let description = '';

        // 상성 효과 계산
        if (playerTacticData.effective.includes(opponentTactic)) {
            playerBonus = 1.15; // 15% 보너스
            opponentBonus = 0.85; // 상대방 15% 페널티
            description = `${playerTacticData.name}이(가) ${opponentTacticData.name}에 효과적입니다!`;
        } else if (playerTacticData.ineffective.includes(opponentTactic)) {
            playerBonus = 0.85; // 15% 페널티
            opponentBonus = 1.15; // 상대방 15% 보너스
            description = `${playerTacticData.name}이(가) ${opponentTacticData.name}에 비효과적입니다.`;
        } else {
            description = '균등한 전술 대결입니다.';
        }

        // 점유율 계산
        const playerPossessionBase = 50 + playerTacticData.effects.possession;
        const opponentPossessionBase = 50 + opponentTacticData.effects.possession;
        const totalPossession = playerPossessionBase + opponentPossessionBase;
        const playerPossession = Math.max(15, Math.min(85, 
            (playerPossessionBase / totalPossession) * 100));

        return {
            playerBonus,
            opponentBonus,
            playerPossession: Math.round(playerPossession),
            description,
            playerTacticData,
            opponentTacticData
        };
    }

    // 경기에서 전술 효과 적용
    applyTacticToMatch(playerTactic, opponentTeam) {
        const opponentTactic = this.getTeamTactic(opponentTeam);
        const tacticEffect = this.calculateTacticEffect(playerTactic, opponentTactic);
        
        // matchStats에 전술 효과 저장
        if (typeof matchStats !== 'undefined') {
            matchStats.tacticEffect = tacticEffect;
            matchStats.possession = tacticEffect.playerPossession;
            
            console.log(`전술 대결: ${this.tactics[playerTactic].name} vs ${this.tactics[opponentTactic].name}`);
            console.log(`점유율: ${tacticEffect.playerPossession}% - ${100 - tacticEffect.playerPossession}%`);
            console.log(tacticEffect.description);
        }

        return tacticEffect;
    }

    // 팀의 전술 가져오기
    getTeamTactic(teamKey) {
        return this.teamTactics[teamKey] || 'possession'; // 기본값
    }

    // 팀의 전술 설정
    setTeamTactic(teamKey, tactic) {
        if (this.tactics[tactic]) {
            this.teamTactics[teamKey] = tactic;
        }
    }

    // 전술이 골 확률에 미치는 영향 계산
    getTacticGoalModifier(isPlayerTeam = true) {
        if (typeof matchStats === 'undefined' || !matchStats.tacticEffect) {
            return 1.0;
        }

        const tacticEffect = matchStats.tacticEffect;
        
        if (isPlayerTeam) {
            return tacticEffect.playerBonus * tacticEffect.playerTacticData.effects.attackBonus;
        } else {
            return tacticEffect.opponentBonus * tacticEffect.opponentTacticData.effects.attackBonus;
        }
    }

    // 전술이 수비력에 미치는 영향 계산
    getTacticDefenseModifier(isPlayerTeam = true) {
        if (typeof matchStats === 'undefined' || !matchStats.tacticEffect) {
            return 1.0;
        }

        const tacticEffect = matchStats.tacticEffect;
        
        if (isPlayerTeam) {
            return tacticEffect.playerBonus * tacticEffect.playerTacticData.effects.defenseBonus;
        } else {
            return tacticEffect.opponentBonus * tacticEffect.opponentTacticData.effects.defenseBonus;
        }
    }

    // 경기 후 전술에 따른 사기 변화
    applyPostMatchMoraleEffect(won, drawn, lost) {
        if (!gameData.currentTactic || !this.tactics[gameData.currentTactic]) return;

        const tacticData = this.tactics[gameData.currentTactic];
        let moraleChange = 0;

        if (won) {
            moraleChange = tacticData.effects.moraleBonusWin;
        } else if (lost) {
            moraleChange = tacticData.effects.moraleBonusLoss;
        }
        // 무승부는 사기 변화 없음

        if (moraleChange !== 0) {
            gameData.teamMorale += moraleChange;
            gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale));
            
            console.log(`전술 효과로 인한 사기 변화: ${moraleChange > 0 ? '+' : ''}${moraleChange}`);
        }
    }

    // 전술 정보 가져오기
    getTacticInfo(tacticKey) {
        return this.tactics[tacticKey] || null;
    }

    // 모든 전술 목록 가져오기
    getAllTactics() {
        return this.tactics;
    }

    // 전술 추천 시스템
    recommendTactic(opponentTeam) {
        const opponentTactic = this.getTeamTactic(opponentTeam);
        const recommendations = [];

        // 상대 전술에 효과적인 전술들 찾기
        Object.entries(this.tactics).forEach(([tacticKey, tacticData]) => {
            if (tacticData.effective.includes(opponentTactic)) {
                recommendations.push({
                    tactic: tacticKey,
                    name: tacticData.name,
                    reason: `${tacticData.name}은(는) 상대의 ${this.tactics[opponentTactic].name}에 효과적입니다.`
                });
            }
        });

        return recommendations;
    }

    // 전술 분석 리포트
    getTacticAnalysisReport() {
        if (!gameData.currentTactic) return null;

        const currentTacticData = this.tactics[gameData.currentTactic];
        
        return {
            currentTactic: {
                key: gameData.currentTactic,
                name: currentTacticData.name,
                description: currentTacticData.description
            },
            strengths: currentTacticData.effective.map(t => this.tactics[t].name),
            weaknesses: currentTacticData.ineffective.map(t => this.tactics[t].name),
            effects: currentTacticData.effects
        };
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            teamTactics: this.teamTactics
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        if (saveData && saveData.teamTactics) {
            this.teamTactics = { ...this.teamTactics, ...saveData.teamTactics };
        }
    }
}

// 전역 전술 시스템 인스턴스
const tacticSystem = new TacticSystem();

// 전술 선택 함수 (기존 selectTactic 함수 확장)
function selectTacticAdvanced(tactic) {
    if (tacticSystem.getTacticInfo(tactic)) {
        gameData.currentTactic = tactic;
        updateTacticsDisplay();
        
        // 선택된 전술의 상세 정보 표시
        const tacticInfo = tacticSystem.getTacticInfo(tactic);
        console.log(`전술 선택: ${tacticInfo.name} - ${tacticInfo.description}`);
    }
}

// 전술 추천 표시
function showTacticRecommendations(opponentTeam) {
    const recommendations = tacticSystem.recommendTactic(opponentTeam);
    
    if (recommendations.length > 0) {
        let message = "추천 전술:\n\n";
        recommendations.forEach(rec => {
            message += `• ${rec.name}: ${rec.reason}\n`;
        });
        
        console.log(message);
        return recommendations;
    } else {
        console.log("특별히 유리한 전술이 없습니다. 자신있는 전술을 사용하세요.");
        return [];
    }
}

// 전술 분석 리포트 표시
function showTacticAnalysis() {
    const report = tacticSystem.getTacticAnalysisReport();
    
    if (report) {
        let message = `현재 전술 분석: ${report.currentTactic.name}\n\n`;
        message += `설명: ${report.currentTactic.description}\n\n`;
        message += `강점 (효과적인 상대 전술):\n`;
        report.strengths.forEach(strength => {
            message += `• ${strength}\n`;
        });
        message += `\n약점 (비효과적인 상대 전술):\n`;
        report.weaknesses.forEach(weakness => {
            message += `• ${weakness}\n`;
        });
        
        alert(message);
    }
}

// 경기 전 전술 적용
function applyTacticsToUpcomingMatch(opponentTeam) {
    if (gameData.currentTactic) {
        const tacticEffect = tacticSystem.applyTacticToMatch(gameData.currentTactic, opponentTeam);
        
        // 전술 효과를 UI에 표시
        setTimeout(() => {
            alert(`전술 대결: ${tacticSystem.tactics[gameData.currentTactic].name} vs ${tacticSystem.tactics[tacticSystem.getTeamTactic(opponentTeam)].name}\n\n${tacticEffect.description}\n\n예상 점유율: ${tacticEffect.playerPossession}%`);
        }, 500);
        
        return tacticEffect;
    }
    
    return null;
}

// 전역 함수로 노출
window.tacticSystem = tacticSystem;
window.selectTacticAdvanced = selectTacticAdvanced;
window.showTacticRecommendations = showTacticRecommendations;
window.showTacticAnalysis = showTacticAnalysis;
window.applyTacticsToUpcomingMatch = applyTacticsToUpcomingMatch;
