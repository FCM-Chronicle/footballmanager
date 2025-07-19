// 전술 시스템
class TacticsSystem {
    constructor() {
        this.tactics = {
            gegenPressing: {
                name: "게겐프레싱",
                description: "높은 위치에서의 강력한 압박과 빠른 역습을 통해 상대방을 제압하는 전술입니다.",
                effective: ["twoLineDefense", "possessionFootball"],
                ineffective: ["longBall", "catenaccio"],
                moraleEffect: 0,
                possessionBonus: -5,
                attackBonus: 10,
                defenseBonus: 5
            },
            twoLineDefense: {
                name: "두 줄 수비",
                description: "견고한 수비 라인을 구축하여 상대의 공격을 차단하고 안정적인 경기 운영을 하는 전술입니다.",
                effective: ["longBall", "bedFootball"],
                ineffective: ["gegenPressing", "totalFootball"],
                moraleEffect: 0,
                possessionBonus: 0,
                attackBonus: -5,
                defenseBonus: 15
            },
            laVolpiana: {
                name: "라 볼피아나",
                description: "창의적인 공격 전개와 다양한 패턴으로 상대 수비를 교란시키는 이탈리아식 전술입니다.",
                effective: ["possessionFootball", "tikitaka"],
                ineffective: ["catenaccio", "longBall"],
                moraleEffect: 5,
                possessionBonus: 10,
                attackBonus: 5,
                defenseBonus: -5
            },
            longBall: {
                name: "롱볼 축구",
                description: "긴 패스를 통해 빠르게 전방으로 볼을 전개하는 직접적인 공격 전술입니다.",
                effective: ["bedFootball", "catenaccio"],
                ineffective: ["gegenPressing", "tikitaka"],
                moraleEffect: 0,
                possessionBonus: -10,
                attackBonus: 5,
                defenseBonus: 0
            },
            possessionFootball: {
                name: "점유율 축구",
                description: "볼 점유율을 높여 경기의 주도권을 잡고 안정적으로 공격을 전개하는 전술입니다.",
                effective: ["tikitaka", "laVolpiana"],
                ineffective: ["longBall", "gegenPressing"],
                moraleEffect: 0,
                possessionBonus: 15,
                attackBonus: 0,
                defenseBonus: 5
            },
            bedFootball: {
                name: "침대 축구",
                description: "극도로 수비적인 전술로 골을 허용하지 않는 것에 집중하는 보수적인 전술입니다.",
                effective: ["catenaccio", "twoLineDefense"],
                ineffective: ["gegenPressing", "totalFootball"],
                moraleEffect: -5,
                possessionBonus: -5,
                attackBonus: -10,
                defenseBonus: 20
            },
            catenaccio: {
                name: "카테나치오",
                description: "이탈리아의 전통적인 수비 전술로 견고한 수비와 빠른 역습을 조합한 전술입니다.",
                effective: ["twoLineDefense", "bedFootball"],
                ineffective: ["possessionFootball", "totalFootball"],
                moraleEffect: 0,
                possessionBonus: -5,
                attackBonus: 0,
                defenseBonus: 15
            },
            totalFootball: {
                name: "토탈 풋볼",
                description: "모든 선수가 다양한 포지션을 소화하며 유기적으로 움직이는 네덜란드식 전술입니다.",
                effective: ["tikitaka", "gegenPressing"],
                ineffective: ["twoLineDefense", "catenaccio"],
                moraleEffect: 10,
                possessionBonus: 5,
                attackBonus: 10,
                defenseBonus: 0
            },
            tikitaka: {
                name: "티키타카",
                description: "짧은 패스를 통한 정교한 볼 배급과 점유율을 바탕으로 한 스페인식 전술입니다.",
                effective: ["possessionFootball", "laVolpiana"],
                ineffective: ["longBall", "bedFootball"],
                moraleEffect: 5,
                possessionBonus: 20,
                attackBonus: 5,
                defenseBonus: -5
            }
        };

        // 각 팀의 기본 전술 설정
        this.teamTactics = {
            manCity: "tikitaka",
            liverpool: "gegenPressing",
            manUnited: "possessionFootball",
            arsenal: "twoLineDefense",
            chelsea: "longBall",
            tottenham: "gegenPressing",
            realMadrid: "possessionFootball",
            barcelona: "totalFootball",
            acMilan: "gegenPressing",
            inter: "totalFootball",
            bayern: "tikitaka",
            psg: "possessionFootball",
            leverkusen: "longBall",
            dortmund: "gegenPressing",
            newCastle: "laVolpiana",
            asRoma: "longBall",
            atMadrid: "catenaccio",
            napoli: "bedFootball"
        };
    }

    // 전술 효과 계산
    calculateTacticalAdvantage(playerTactic, opponentTactic) {
        const playerTacticData = this.tactics[playerTactic];
        const opponentTacticData = this.tactics[opponentTactic];

        let advantage = 0;

        // 상성 체크
        if (playerTacticData.effective.includes(opponentTactic)) {
            advantage += 15; // 효과적인 전술이면 15% 보너스
        }
        
        if (playerTacticData.ineffective.includes(opponentTactic)) {
            advantage -= 15; // 비효과적인 전술이면 15% 패널티
        }

        return advantage;
    }

    // 전술에 따른 팀 사기 효과
    applyTacticalMoraleEffect(tactic) {
        const tacticData = this.tactics[tactic];
        gameData.teamMorale += tacticData.moraleEffect;
        gameData.teamMorale = Math.max(0, Math.min(100, gameData.teamMorale));
    }

    // 전술 변경
    changeTactic(newTactic) {
        if (!this.tactics[newTactic]) {
            console.error("존재하지 않는 전술입니다:", newTactic);
            return false;
        }

        const oldTactic = gameData.currentTactic;
        gameData.currentTactic = newTactic;

        // 사기 효과 적용
        this.applyTacticalMoraleEffect(newTactic);

        return true;
    }

    // 상대팀 전술 가져오기
    getOpponentTactic(teamKey) {
        return this.teamTactics[teamKey] || "possessionFootball";
    }

    // 전술 정보 가져오기
    getTacticInfo(tacticKey) {
        return this.tactics[tacticKey];
    }

    // 모든 전술 목록 가져오기
    getAllTactics() {
        return this.tactics;
    }

    // 전술 호환성 체크 (선수 능력치와 전술의 궁합)
    calculateTacticalFit(tactic) {
        if (!gameData.selectedTeam) return 0;

        const tacticData = this.tactics[tactic];
        let fit = 50; // 기본 50%

        // 스쿼드가 완성되지 않은 경우
        if (!isSquadValid()) {
            return fit;
        }

        // 선수들의 평균 능력치 계산
        const squad = gameData.squad;
        let totalRating = 0;
        let playerCount = 0;

        // GK
        if (squad.gk) {
            totalRating += squad.gk.rating;
            playerCount++;
        }

        // DF
        squad.df.forEach(player => {
            if (player) {
                totalRating += player.rating;
                playerCount++;
            }
        });

        // MF
        squad.mf.forEach(player => {
            if (player) {
                totalRating += player.rating;
                playerCount++;
            }
        });

        // FW
        squad.fw.forEach(player => {
            if (player) {
                totalRating += player.rating;
                playerCount++;
            }
        });

        const averageRating = playerCount > 0 ? totalRating / playerCount : 70;

        // 전술별 특성에 따른 보정
        switch(tactic) {
            case "gegenPressing":
            case "totalFootball":
                // 젊은 선수들이 많고 체력이 좋은 팀에 유리
                fit += (averageRating - 75) * 0.5;
                break;
            case "tikitaka":
            case "possessionFootball":
                // 기술적인 선수들이 많은 팀에 유리
                fit += (averageRating - 80) * 0.7;
                break;
            case "catenaccio":
            case "twoLineDefense":
                // 수비력이 강한 팀에 유리
                const defenseRating = squad.df.reduce((sum, player) => sum + (player ? player.rating : 0), 0) / 4;
                fit += (defenseRating - 75) * 0.8;
                break;
            case "longBall":
                // 신체적으로 강한 선수들이 많은 팀에 유리
                const fwRating = squad.fw.reduce((sum, player) => sum + (player ? player.rating : 0), 0) / 3;
                fit += (fwRating - 75) * 0.6;
                break;
            case "bedFootball":
                // 수비 중심 팀에 유리하지만 공격력 희생
                const gkRating = squad.gk ? squad.gk.rating : 70;
                fit += (gkRating - 75) * 0.5;
                break;
        }

        return Math.max(0, Math.min(100, fit));
    }

    // 전술 추천 시스템
    recommendTactic() {
        const allTactics = Object.keys(this.tactics);
        const recommendations = [];

        allTactics.forEach(tactic => {
            const fit = this.calculateTacticalFit(tactic);
            recommendations.push({
                tactic: tactic,
                fit: fit,
                data: this.tactics[tactic]
            });
        });

        recommendations.sort((a, b) => b.fit - a.fit);
        return recommendations.slice(0, 3); // 상위 3개 추천
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            currentTactic: gameData.currentTactic,
            teamTactics: this.teamTactics
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        if (saveData.currentTactic) {
            gameData.currentTactic = saveData.currentTactic;
        }
        if (saveData.teamTactics) {
            this.teamTactics = { ...this.teamTactics, ...saveData.teamTactics };
        }
    }
}

// 전역 전술 시스템 인스턴스
const tacticsSystem = new TacticsSystem();

// 전술 화면 로드
function loadTacticsScreen() {
    const tacticsContent = document.getElementById('tacticsContent');
    
    let html = `
        <div class="tactics-container">
            <div class="current-tactic">
                <h3>현재 전술</h3>
                <div class="tactic-card selected">
                    <div class="tactic-name">${tacticsSystem.getTacticInfo(gameData.currentTactic).name}</div>
                    <div class="tactic-description">${tacticsSystem.getTacticInfo(gameData.currentTactic).description}</div>
                    <div class="tactic-fit">전술 적합도: ${Math.round(tacticsSystem.calculateTacticalFit(gameData.currentTactic))}%</div>
                </div>
            </div>
            
            <div class="tactic-recommendations">
                <h3>추천 전술</h3>
                <div class="recommendations-grid">
    `;

    const recommendations = tacticsSystem.recommendTactic();
    recommendations.forEach(rec => {
        html += `
            <div class="recommendation-card">
                <div class="tactic-name">${rec.data.name}</div>
                <div class="fit-score">적합도: ${Math.round(rec.fit)}%</div>
                <div class="tactic-description">${rec.data.description}</div>
                <button onclick="changeTactic('${rec.tactic}')" class="adopt-btn">
                    ${rec.tactic === gameData.currentTactic ? '현재 전술' : '채택하기'}
                </button>
            </div>
        `;
    });

    html += `
                </div>
            </div>
            
            <div class="all-tactics">
                <h3>모든 전술</h3>
                <div class="tactics-grid">
    `;

    const allTactics = tacticsSystem.getAllTactics();
    Object.keys(allTactics).forEach(tacticKey => {
        const tactic = allTactics[tacticKey];
        const fit = tacticsSystem.calculateTacticalFit(tacticKey);
        const isSelected = tacticKey === gameData.currentTactic;

        html += `
            <div class="tactic-card ${isSelected ? 'selected' : ''}" onclick="selectTacticForDetails('${tacticKey}')">
                <div class="tactic-name">${tactic.name}</div>
                <div class="tactic-description">${tactic.description}</div>
                <div class="tactic-stats">
                    <div class="stat">
                        <span class="label">점유율:</span>
                        <span class="value ${tactic.possessionBonus > 0 ? 'positive' : tactic.possessionBonus < 0 ? 'negative' : ''}">
                            ${tactic.possessionBonus > 0 ? '+' : ''}${tactic.possessionBonus}%
                        </span>
                    </div>
                    <div class="stat">
                        <span class="label">공격력:</span>
                        <span class="value ${tactic.attackBonus > 0 ? 'positive' : tactic.attackBonus < 0 ? 'negative' : ''}">
                            ${tactic.attackBonus > 0 ? '+' : ''}${tactic.attackBonus}%
                        </span>
                    </div>
                    <div class="stat">
                        <span class="label">수비력:</span>
                        <span class="value ${tactic.defenseBonus > 0 ? 'positive' : tactic.defenseBonus < 0 ? 'negative' : ''}">
                            ${tactic.defenseBonus > 0 ? '+' : ''}${tactic.defenseBonus}%
                        </span>
                    </div>
                </div>
                <div class="tactic-fit">적합도: ${Math.round(fit)}%</div>
                <div class="tactic-effects">
                    <div class="effective">
                        <strong>효과적 vs:</strong> ${tactic.effective.map(t => tacticsSystem.getTacticInfo(t).name).join(', ')}
                    </div>
                    <div class="ineffective">
                        <strong>비효과적 vs:</strong> ${tactic.ineffective.map(t => tacticsSystem.getTacticInfo(t).name).join(', ')}
                    </div>
                </div>
                ${!isSelected ? `<button onclick="changeTactic('${tacticKey}')" class="change-tactic-btn">전술 변경</button>` : '<div class="current-label">현재 전술</div>'}
            </div>
        `;
    });

    html += `
                </div>
            </div>
        </div>
    `;

    tacticsContent.innerHTML = html;
}

// 전술 변경 함수
function changeTactic(newTactic) {
    if (newTactic === gameData.currentTactic) {
        alert('이미 선택된 전술입니다.');
        return;
    }

    const oldTacticName = tacticsSystem.getTacticInfo(gameData.currentTactic).name;
    const newTacticName = tacticsSystem.getTacticInfo(newTactic).name;

    if (confirm(`전술을 "${oldTacticName}"에서 "${newTacticName}"으로 변경하시겠습니까?`)) {
        const success = tacticsSystem.changeTactic(newTactic);
        
        if (success) {
            alert(`전술이 "${newTacticName}"으로 변경되었습니다!`);
            loadTacticsScreen(); // 화면 새로고침
            updateLobbyDisplay(); // 로비 화면도 업데이트
        } else {
            alert('전술 변경에 실패했습니다.');
        }
    }
}

// 전술 상세 정보 선택
function selectTacticForDetails(tacticKey) {
    const tactic = tacticsSystem.getTacticInfo(tacticKey);
    const fit = tacticsSystem.calculateTacticalFit(tacticKey);
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${tactic.name} 상세 정보</h3>
            <div class="tactic-details">
                <p><strong>설명:</strong> ${tactic.description}</p>
                <div class="tactic-stats-detail">
                    <h4>전술 효과</h4>
                    <ul>
                        <li>점유율 보정: ${tactic.possessionBonus > 0 ? '+' : ''}${tactic.possessionBonus}%</li>
                        <li>공격력 보정: ${tactic.attackBonus > 0 ? '+' : ''}${tactic.attackBonus}%</li>
                        <li>수비력 보정: ${tactic.defenseBonus > 0 ? '+' : ''}${tactic.defenseBonus}%</li>
                        <li>팀 사기 효과: ${tactic.moraleEffect > 0 ? '+' : ''}${tactic.moraleEffect}</li>
                    </ul>
                </div>
                <div class="tactic-matchups">
                    <h4>전술 상성</h4>
                    <p><strong>효과적인 상대:</strong> ${tactic.effective.map(t => tacticsSystem.getTacticInfo(t).name).join(', ')}</p>
                    <p><strong>불리한 상대:</strong> ${tactic.ineffective.map(t => tacticsSystem.getTacticInfo(t).name).join(', ')}</p>
                </div>
                <div class="team-fit">
                    <h4>현재 스쿼드 적합도</h4>
                    <div class="fit-bar">
                        <div class="fit-fill" style="width: ${fit}%"></div>
                        <span class="fit-text">${Math.round(fit)}%</span>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                ${tacticKey !== gameData.currentTactic ? 
                    `<button onclick="changeTactic('${tacticKey}'); closeModal()">이 전술로 변경</button>` : 
                    '<span>현재 사용 중인 전술입니다</span>'
                }
                <button onclick="closeModal()">닫기</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 모달 닫기
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    });
}

// 전술 시스템과 경기 시뮬레이션 연결
function getTacticalModifiers(teamKey) {
    const tactic = teamKey === gameData.selectedTeam ? 
        gameData.currentTactic : 
        tacticsSystem.getOpponentTactic(teamKey);
    
    const tacticData = tacticsSystem.getTacticInfo(tactic);
    
    return {
        possession: tacticData.possessionBonus,
        attack: tacticData.attackBonus,
        defense: tacticData.defenseBonus,
        tactic: tactic
    };
}

// 전술 상성 보너스 계산
function calculateTacticalBonus(playerTactic, opponentTactic) {
    return tacticsSystem.calculateTacticalAdvantage(playerTactic, opponentTactic);
}

// 저장/불러오기에 전술 데이터 포함
const originalSaveGame3 = window.saveGame;
window.saveGame = function() {
    gameData.tacticsData = tacticsSystem.getSaveData();
    if (originalSaveGame3) {
        originalSaveGame3.call(this);
    }
};

const originalLoadGame3 = window.loadGame;
window.loadGame = function() {
    if (originalLoadGame3) {
        originalLoadGame3.call(this);
    }
    if (gameData.tacticsData) {
        tacticsSystem.loadSaveData(gameData.tacticsData);
    }
}; "
