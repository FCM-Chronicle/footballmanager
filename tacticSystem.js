// 전술 시스템(tacticSystem.js)
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
