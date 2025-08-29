// 전술 시스템

const tactics = {
    '게겐프레싱': {
        name: '게겐프레싱',
        description: '높은 압박으로 상대의 실수를 유도하는 전술입니다.',
        effective: ['두 줄 수비', '점유율 축구'],
        ineffective: ['롱볼축구', '카테나치오'],
        bonuses: {
            pressing: 15,
            intensity: 10,
            stamina: -5
        }
    },
    '두 줄 수비': {
        name: '두 줄 수비',
        description: '견고한 수비 라인으로 상대의 공격을 차단합니다.',
        effective: ['롱볼축구', '침대 축구'],
        ineffective: ['게겐프레싱', '토탈 풋볼'],
        bonuses: {
            defense: 15,
            organization: 10,
            attack: -5
        }
    },
    '라볼피아나': {
        name: '라볼피아나',
        description: '창의적이고 예술적인 플레이로 상대를 압도합니다.',
        effective: ['점유율 축구', '티키타카'],
        ineffective: ['카테나치오', '롱볼축구'],
        bonuses: {
            creativity: 15,
            technique: 10,
            physicality: -5
        }
    },
    '롱볼축구': {
        name: '롱볼축구',
        description: '직접적이고 빠른 공격으로 상대를 제압합니다.',
        effective: ['침대 축구', '카테나치오'],
        ineffective: ['게겐프레싱', '티키타카'],
        bonuses: {
            directness: 15,
            physicality: 10,
            possession: -10
        }
    },
    '점유율 축구': {
        name: '점유율 축구',
        description: '볼 점유율을 높여 경기를 주도합니다.',
        effective: ['티키타카', '라볼피아나'],
        ineffective: ['롱볼축구', '게겐프레싱'],
        bonuses: {
            possession: 20,
            patience: 10,
            directness: -10
        }
    },
    '침대 축구': {
        name: '침대 축구',
        description: '극도로 수비적인 전술로 무승부를 노립니다.',
        effective: ['카테나치오', '두 줄 수비'],
        ineffective: ['게겐프레싱', '토탈 풋볼'],
        bonuses: {
            defense: 20,
            discipline: 15,
            attack: -15
        }
    },
    '카테나치오': {
        name: '카테나치오',
        description: '이탈리아식 수비 전술의 대표주자입니다.',
        effective: ['두 줄 수비', '침대 축구'],
        ineffective: ['점유율 축구', '토탈 풋볼'],
        bonuses: {
            defense: 18,
            counterattack: 12,
            possession: -8
        }
    },
    '토탈 풋볼': {
        name: '토탈 풋볼',
        description: '모든 선수가 공격과 수비를 함께하는 전술입니다.',
        effective: ['티키타카', '게겐프레싱'],
        ineffective: ['두 줄 수비', '카테나치오'],
        bonuses: {
            versatility: 15,
            movement: 15,
            stamina: -10
        }
    },
    '티키타카': {
        name: '티키타카',
        description: '짧은 패스로 연결되는 아름다운 축구입니다.',
        effective: ['점유율 축구', '라볼피아나'],
        ineffective: ['롱볼축구', '침대 축구'],
        bonuses: {
            passing: 20,
            technique: 15,
            physicality: -10
        }
    }
};

// 팀별 기본 전술
const defaultTeamTactics = {
    '맨체스터 시티': '티키타카',
    '리버풀': '게겐프레싱',
    '맨체스터 유나이티드': '점유율 축구',
    '아스널': '두 줄 수비',
    '첼시': '롱볼축구',
    '토트넘 홋스퍼': '게겐프레싱',
    '레알 마드리드': '점유율 축구',
    '바르셀로나': '토탈 풋볼',
    'AC 밀란': '게겐프레싱',
    '인터 밀란': '토탈 풋볼',
    '바이에른 뮌헨': '티키타카',
    '파리 생제르맹': '점유율 축구',
    '레버쿠젠': '롱볼축구',
    '도르트문트': '게겐프레싱',
    '뉴캐슬 유나이티드': '라볼피아나',
    'AS 로마': '롱볼축구',
    '아틀레티코 마드리드': '카테나치오',
    '나폴리': '침대 축구'
};

function initializeTactics() {
    // 기본 전술 설정
    if (!gameState.currentTactic) {
        gameState.currentTactic = '게겐프레싱';
    }
}

function loadTactics() {
    const tacticsList = document.getElementById('tacticsList');
    const currentTacticSpan = document.getElementById('currentTactic');
    const tacticDescription = document.getElementById('tacticDescription');
    
    // 현재 전술 정보 업데이트
    currentTacticSpan.textContent = gameState.currentTactic;
    tacticDescription.textContent = tactics[gameState.currentTactic].description;
    
    // 전술 카드들 생성
    tacticsList.innerHTML = '';
    
    Object.keys(tactics).forEach(tacticName => {
        const tactic = tactics[tacticName];
        const tacticCard = document.createElement('div');
        tacticCard.className = `tactic-card ${tacticName === gameState.currentTactic ? 'active' : ''}`;
        
        tacticCard.innerHTML = `
            <h4>${tactic.name}</h4>
            <p>${tactic.description}</p>
            <div class="tactic-effectiveness">
                <div class="effective">
                    <strong>효과적 vs:</strong> ${tactic.effective.join(', ')}
                </div>
                <div class="ineffective">
                    <strong>비효과적 vs:</strong> ${tactic.ineffective.join(', ')}
                </div>
            </div>
            <div class="tactic-bonuses">
                ${Object.entries(tactic.bonuses).map(([bonus, value]) => 
                    `<span class="${value > 0 ? 'positive' : 'negative'}">${bonus}: ${value > 0 ? '+' : ''}${value}</span>`
                ).join(' ')}
            </div>
        `;
        
        tacticCard.addEventListener('click', () => selectTactic(tacticName));
        tacticsList.appendChild(tacticCard);
    });
}

function selectTactic(tacticName) {
    gameState.currentTactic = tacticName;
    
    // UI 업데이트
    document.querySelectorAll('.tactic-card').forEach(card => {
        card.classList.remove('active');
    });
    
    event.target.closest('.tactic-card').classList.add('active');
    
    document.getElementById('currentTactic').textContent = tacticName;
    document.getElementById('tacticDescription').textContent = tactics[tacticName].description;
    
    showNotification(`전술이 ${tacticName}로 변경되었습니다!`);
    
    // 뉴스 생성
    generateNews(
        `[전술 변경] ${gameState.selectedTeam}, ${tacticName} 전술 도입`,
        `${gameState.selectedTeam}이 새로운 전술 ${tacticName}을 도입했습니다. ${tactics[tacticName].description}`,
        `#${gameState.selectedTeam.replace(/\s+/g, '')} #전술변경 #${tacticName.replace(/\s+/g, '')}`
    );
}

function getTacticEffectiveness(myTactic, opponentTactic) {
    if (!tactics[myTactic] || !tactics[opponentTactic]) return 0;
    
    const myTacticData = tactics[myTactic];
    
    // 상대 전술에 대한 효과성 계산
    if (myTacticData.effective.includes(opponentTactic)) {
        return 1; // 효과적
    } else if (myTacticData.ineffective.includes(opponentTactic)) {
        return -1; // 비효과적
    }
    
    return 0; // 보통
}

function calculateTacticBonus(tacticName, bonusType) {
    if (!tactics[tacticName] || !tactics[tacticName].bonuses) return 0;
    
    return tactics[tacticName].bonuses[bonusType] || 0;
}

function getOpponentTactic(opponentTeam) {
    // 상대팀의 기본 전술 반환 (없으면 랜덤)
    if (defaultTeamTactics[opponentTeam]) {
        return defaultTeamTactics[opponentTeam];
    }
    
    // 랜덤 전술 선택
    const tacticNames = Object.keys(tactics);
    return tacticNames[Math.floor(Math.random() * tacticNames.length)];
}

function applyTacticEffectsToMatch(myTactic, opponentTactic) {
    const effectiveness = getTacticEffectiveness(myTactic, opponentTactic);
    
    let goalProbabilityModifier = 0;
    let defenseProbabilityModifier = 0;
    
    switch(effectiveness) {
        case 1: // 효과적
            goalProbabilityModifier = 2; // +2% 골 확률
            defenseProbabilityModifier = -1; // -1% 실점 확률
            break;
        case -1: // 비효과적
            goalProbabilityModifier = -1.5; // -1.5% 골 확률
            defenseProbabilityModifier = 1.5; // +1.5% 실점 확률
            break;
        default: // 보통
            break;
    }
    
    return {
        goalBonus: goalProbabilityModifier,
        defenseBonus: defenseProbabilityModifier,
        effectiveness: effectiveness
    };
}

function getTacticMatchReport(myTactic, opponentTactic) {
    const effectiveness = getTacticEffectiveness(myTactic, opponentTactic);
    const opponentEffectiveness = getTacticEffectiveness(opponentTactic, myTactic);
    
    let report = `전술 분석: ${myTactic} vs ${opponentTactic}\n`;
    
    if (effectiveness === 1) {
        report += "✅ 우리 전술이 상대에게 효과적입니다!";
    } else if (effectiveness === -1) {
        report += "❌ 우리 전술이 상대에게 불리합니다.";
    } else {
        report += "➖ 전술적으로 비슷한 수준입니다.";
    }
    
    if (opponentEffectiveness === 1) {
        report += "\n⚠️ 상대 전술이 우리에게 효과적일 수 있습니다.";
    } else if (opponentEffectiveness === -1) {
        report += "\n✨ 상대 전술은 우리에게 불리합니다.";
    }
    
    return report;
}

function recommendTacticAgainst(opponentTactic) {
    const recommendations = [];
    
    Object.keys(tactics).forEach(tacticName => {
        const tactic = tactics[tacticName];
        if (tactic.effective.includes(opponentTactic)) {
            recommendations.push({
                name: tacticName,
                reason: `${opponentTactic}에 효과적`
            });
        }
    });
    
    return recommendations;
}

function getTacticStatistics() {
    // 전술별 승률 통계 (추후 구현 가능)
    const stats = {};
    
    Object.keys(tactics).forEach(tacticName => {
        stats[tacticName] = {
            used: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            winRate: 0
        };
    });
    
    return stats;
}

// 전술 효과를 경기에 적용하는 헬퍼 함수들
function getFormationSuitability(tactic, formation) {
    // 특정 전술이 현재 포메이션에 얼마나 적합한지 계산
    // 4-3-3 기본 포메이션 기준
    const formationSuitability = {
        '게겐프레싱': 0.9, // 높은 압박에 적합
        '두 줄 수비': 0.8,
        '라볼피아나': 0.85,
        '롱볼축구': 0.75,
        '점유율 축구': 0.95, // 점유율에 매우 적합
        '침대 축구': 0.7,
        '카테나치오': 0.75,
        '토탈 풋볼': 0.9,
        '티키타카': 0.95 // 짧은 패스에 매우 적합
    };
    
    return formationSuitability[tactic] || 0.8;
}

function calculateTacticFamiliarity() {
    // 전술 숙련도 계산 (같은 전술을 오래 사용할수록 효과 증가)
    // 추후 구현시 gameState에 전술 사용 기록 추가
    return 1.0; // 기본값
}

// CSS 스타일을 위한 클래스 추가
const tacticStyles = `
    .tactic-effectiveness {
        font-size: 0.8em;
        margin: 10px 0;
    }
    
    .effective {
        color: #4CAF50;
        margin-bottom: 5px;
    }
    
    .ineffective {
        color: #f44336;
    }
    
    .tactic-bonuses {
        font-size: 0.7em;
        margin-top: 10px;
    }
    
    .tactic-bonuses .positive {
        color: #4CAF50;
        margin-right: 10px;
    }
    
    .tactic-bonuses .negative {
        color: #f44336;
        margin-right: 10px;
    }
`;

// 스타일 추가
if (!document.getElementById('tactic-styles')) {
    const style = document.createElement('style');
    style.id = 'tactic-styles';
    style.textContent = tacticStyles;
    document.head.appendChild(style);
}
