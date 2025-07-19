// SNS 시스템
class SNSSystem {
    constructor() {
        this.posts = [];
        this.lastPostId = 0;
        this.maxPosts = 50; // 최대 50개 포스트 유지
        
        // 이적 확정 템플릿
        this.transferTemplates = [
            "[오피셜] {playerName}, {fee}억에 {newTeam} 이적 확정!",
            "[오피셜] {playerName}, {fee}억에 {newTeam} 합류!",
            "[오피셜] {playerName}, {newTeam}과 계약! 새로운 도전 시작!",
            "[오피셜] {playerName}, {fee}억으로 {newTeam} 이적 '충격'!",
            "[오피셜] {playerName}, {newTeam}과 동행!",
            "[오피셜] {playerName}, {fee}억에 {newTeam} 이적!",
            "[오피셜] {playerName}, {newTeam}과 계약!",
            "[오피셜] {playerName}, {fee}억에 {newTeam} 이적 '전격'!",
            "[오피셜] {playerName}, {newTeam}으로 '유턴'!",
            "[오피셜] {playerName}, {newTeam} 이적! '이변'의 주인공!",
            "HERE WE GO! {playerName}, {newTeam} 이적 확정! by 파브리치오 로마노"
        ];
        
        // 이적 루머 템플릿
        this.rumorTemplates = [
            "[이적 루머] {playerName}, {newTeam} 이적설 솔솔... {fee}억 거론",
            "[이적설] {playerName}, {newTeam}으로 깜짝 이적하나?",
            "[이적시장] {playerName}, {newTeam} 이적 임박?",
            "[루머] {playerName}, {newTeam} '러브콜' 받았다!",
            "[이적 가십] {playerName}, {newTeam} 이적 '가능성' 제기!"
        ];
        
        // 경기 결과 템플릿
        this.matchTemplates = {
            upset: [
                "[경기 결과] 충격! {winner}이 {loser}를 {score}로 격파!",
                "[경기 결과] 이변! {winner}, {loser}를 {score}로 잡았다!",
                "[경기 결과] 믿을 수 없는 패배! {loser}, {winner}에 {score} 패!"
            ],
            expected: [
                "[경기 결과] 예상대로! {winner}, {loser}를 {score}로 완파!",
                "[경기 결과] 압도적인 승리! {winner}, {loser}에 {score} 승리!",
                "[경기 결과] 순조로운 출발! {winner}, {loser}에 {score} 승!"
            ],
            normal: [
                "[경기 결과] {homeTeam}, {awayTeam}에 {score} 승리!",
                "[경기 결과] {winner}, {loser} 꺾고 귀중한 승점 3점 획득!"
            ],
            draw: [
                "[경기 결과] {homeTeam}와 {awayTeam}, {score} 무승부!",
                "[경기 결과] 충격적인 무승부! {favorite}, {underdog}과 {score} 무승부!"
            ]
        };

        // 선수 강점 템플릿
        this.playerStrengths = {
            FW: [
                "뛰어난 드리블", "정확한 마무리", "강력한 슈팅", "탁월한 수비력",
                "폭발적인 스피드", "정교한 마무리", "환상적인 드리블 돌파", "예측 불가능한 움직임",
                "순간적인 스피드", "탁월한 오프더볼 움직임", "과감한 슈팅 시도", "상대 수비 교란",
                "엄청난 활동량", "패기 넘치는 플레이", "저돌적인 돌파", "예상치 못한 득점력",
                "창의적인 플레이", "강력한 정신력", "어떤 상황에서도 흔들리지 않는 멘탈"
            ],
            MF: [
                "정확한 패스", "넓은 시야", "뛰어난 리더십", "정확한 위치 선정",
                "영리한 파울 유도", "노련한 경기 운영", "뛰어난 전술 이해도", "후방 빌드업 능력",
                "팀의 템포 조절", "엄청난 활동량", "뛰어난 볼 탈취 능력", "뛰어난 리더십",
                "팀에 대한 이해도", "풍부한 경험", "팬들의 지지"
            ],
            DF: [
                "탁월한 수비력", "뛰어난 태클", "넓은 시야", "정확한 위치 선정",
                "뛰어난 일대일 수비", "제공권 장악 능력", "정확한 태클", "빌드업 시 안정적인 패스",
                "날카로운 크로스", "강력한 헤더", "수비 가담 능력", "폭넓은 활동량"
            ],
            GK: [
                "안정적인 볼 키핑", "정확한 위치 선정", "뛰어난 반응속도", "강력한 펀칭",
                "정확한 배급", "뛰어난 커맨드", "순간 반응 능력", "안정적인 선방"
            ]
        };
    }

    // 포스트 추가
    addPost(type, content, hashtags = [], priority = 0) {
        const post = {
            id: ++this.lastPostId,
            type: type,
            content: content,
            hashtags: hashtags,
            timestamp: new Date(),
            priority: priority
        };

        this.posts.unshift(post); // 맨 앞에 추가

        // 최대 포스트 수 유지
        if (this.posts.length > this.maxPosts) {
            this.posts = this.posts.slice(0, this.maxPosts);
        }

        return post;
    }

    // 이적 확정 포스트 생성
    createTransferPost(playerName, oldTeam, newTeam, fee) {
        const template = this.getRandomElement(this.transferTemplates);
        const strength = this.getPlayerStrength(playerName);
        
        let content = template
            .replace('{playerName}', playerName)
            .replace('{newTeam}', teamNames[newTeam])
            .replace('{fee}', fee);

        // 상세 내용 추가
        const today = new Date().toLocaleDateString();
        const playerData = this.findPlayerData(playerName);
        
        if (playerData) {
            content += `\n\n${today} – ${teamNames[oldTeam]}의 ${playerData.age}세 ${playerName} (${playerData.position}) 선수가 ${fee}억에 달하는 금액으로 **${teamNames[newTeam]}**으로 이적을 확정 지었습니다. ${playerName} 선수는 ${playerData.position}에 맞는 ${strength}을 자랑합니다.`;
        }

        const hashtags = ['#transfer', `#${oldTeam}`, `#${newTeam}`, `#${playerName.replace(/\s+/g, '')}`];
        
        return this.addPost('transfer', content, hashtags, 3);
    }

    // 이적 루머 포스트 생성
    createRumorPost(playerName, currentTeam, targetTeam, estimatedFee) {
        if (Math.random() < 0.7) return null; // 30% 확률로만 루머 생성

        const template = this.getRandomElement(this.rumorTemplates);
        const strength = this.getPlayerStrength(playerName);
        
        let content = template
            .replace('{playerName}', playerName)
            .replace('{newTeam}', teamNames[targetTeam])
            .replace('{fee}', estimatedFee);

        const playerData = this.findPlayerData(playerName);
        
        if (playerData) {
            const rumorDetails = [
                `구단 내부 소식통에 의하면, 최근 ${teamNames[currentTeam]}의 ${playerData.age}세 ${playerName} (${playerData.position}) 선수가 ${estimatedFee}억에 달하는 금액으로 ${teamNames[targetTeam]}과 강하게 연결되고 있다고 합니다.`,
                `유럽 현지 언론에 따르면, ${teamNames[currentTeam]} 소속 ${playerData.age}세 ${playerName} (${playerData.position}) 선수가 ${teamNames[targetTeam]}으로의 깜짝 이적설에 휩싸였습니다.`,
                `믿을 만한 소식통에 의하면, ${teamNames[currentTeam]}의 ${playerData.age}세 ${playerName} (${playerData.position})의 ${teamNames[targetTeam]} 이적설이 급물살을 타고 있습니다.`
            ];
            
            content += `\n\n${this.getRandomElement(rumorDetails)} ${playerName}은 ${playerData.position}에 맞는 ${strength}으로 ${teamNames[targetTeam]}의 관심을 받고 있습니다.`;
        }

        const hashtags = [`#${playerName.replace(/\s+/g, '')}`, `#${targetTeam}`];
        
        return this.addPost('rumor', content, hashtags, 1);
    }

    // 경기 결과 포스트 생성
    createMatchResultPost(homeTeam, awayTeam, homeScore, awayScore, events) {
        const homeRating = this.getTeamStrength(homeTeam);
        const awayRating = this.getTeamStrength(awayTeam);
        const scoreDiff = Math.abs(homeScore - awayScore);
        
        let templateType = 'normal';
        let winner, loser, favorite, underdog;
        
        if (homeScore > awayScore) {
            winner = homeTeam;
            loser = awayTeam;
            // 약한 팀이 강한 팀을 이긴 경우 (이변)
            if (homeRating < awayRating - 5) {
                templateType = 'upset';
            } else if (homeRating > awayRating + 5) {
                templateType = 'expected';
            }
        } else if (awayScore > homeScore) {
            winner = awayTeam;
            loser = homeTeam;
            if (awayRating < homeRating - 5) {
                templateType = 'upset';
            } else if (awayRating > homeRating + 5) {
                templateType = 'expected';
            }
        } else {
            templateType = 'draw';
            favorite = homeRating > awayRating ? homeTeam : awayTeam;
            underdog = homeRating > awayRating ? awayTeam : homeTeam;
        }

        const templates = this.matchTemplates[templateType];
        const template = this.getRandomElement(templates);
        
        let content = template
            .replace('{homeTeam}', teamNames[homeTeam])
            .replace('{awayTeam}', teamNames[awayTeam])
            .replace('{winner}', teamNames[winner])
            .replace('{loser}', teamNames[loser])
            .replace('{favorite}', teamNames[favorite])
            .replace('{underdog}', teamNames[underdog])
            .replace('{score}', `${homeScore}-${awayScore}`);

        // 득점자 정보 추가
        const goalEvents = events.filter(e => e.type === 'goal');
        if (goalEvents.length > 0) {
            const scorers = goalEvents.map(e => e.player?.name || '선수').join(', ');
            content += ` ${scorers} 선수가 득점했습니다.`;
        }

        const hashtags = [`#${homeTeam}`, `#${awayTeam}`];
        
        // 내 팀 경기인 경우 우선순위 높임
        const priority = (homeTeam === gameData.selectedTeam || awayTeam === gameData.selectedTeam) ? 2 : 1;
        
        return this.addPost('match', content, hashtags, priority);
    }

    // 선수의 강점 랜덤 선택
    getPlayerStrength(playerName) {
        const playerData = this.findPlayerData(playerName);
        if (!playerData) return "뛰어난 실력";
        
        const strengths = this.playerStrengths[playerData.position] || this.playerStrengths.FW;
        return this.getRandomElement(strengths);
    }

    // 선수 데이터 찾기
    findPlayerData(playerName) {
        for (const teamKey in teams) {
            const player = teams[teamKey].find(p => p.name === playerName);
            if (player) return player;
        }
        return null;
    }

    // 팀 강도 계산
    getTeamStrength(teamKey) {
        if (!teams[teamKey]) return 70;
        
        const teamPlayers = teams[teamKey];
        const totalRating = teamPlayers.reduce((sum, player) => sum + player.rating, 0);
        return Math.round(totalRating / teamPlayers.length);
    }

    // 랜덤 요소 선택
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 특별 이벤트 포스트 (가끔 생성)
    createSpecialEventPost() {
        if (Math.random() < 0.95) return null; // 5% 확률

        const events = [
            {
                content: "🔥 이번 주말 빅매치 미리보기! 어떤 팀이 승리할까요?",
                hashtags: ['#빅매치', '#프리뷰'],
                type: 'special'
            },
            {
                content: "⚡ 놀라운 이적 시장의 움직임! 이번 주에는 어떤 깜짝 이적이 있을까요?",
                hashtags: ['#이적시장', '#루머'],
                type: 'special'
            },
            {
                content: "🏆 현재 리그 순위를 확인해보세요! 상위권 경쟁이 치열합니다!",
                hashtags: ['#리그순위', '#경쟁'],
                type: 'special'
            }
        ];

        const event = this.getRandomElement(events);
        return this.addPost(event.type, event.content, event.hashtags, 0);
    }

    // 포스트 목록 가져오기
    getPosts(limit = 20) {
        return this.posts
            .sort((a, b) => b.priority - a.priority || b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    // 특정 타입 포스트 가져오기
    getPostsByType(type, limit = 10) {
        return this.posts
            .filter(post => post.type === type)
            .slice(0, limit);
    }

    // 포스트 삭제 (오래된 것부터)
    cleanOldPosts() {
        if (this.posts.length > this.maxPosts) {
            this.posts = this.posts
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, this.maxPosts);
        }
    }

    // 시뮬레이션된 AI 팀 간 이적 생성
    simulateAITransfer() {
        if (Math.random() < 0.95) return; // 5% 확률

        const teamKeys = Object.keys(teams).filter(key => key !== gameData.selectedTeam);
        if (teamKeys.length < 2) return;

        const sellingTeam = this.getRandomElement(teamKeys);
        const buyingTeam = this.getRandomElement(teamKeys.filter(key => key !== sellingTeam));
        
        const sellingPlayers = teams[sellingTeam];
        const transferPlayer = this.getRandomElement(sellingPlayers);
        
        // 간단한 이적료 계산
        const fee = Math.round((transferPlayer.rating * 10 + Math.random() * 200));
        
        this.createTransferPost(transferPlayer.name, sellingTeam, buyingTeam, fee);
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            posts: this.posts,
            lastPostId: this.lastPostId
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        if (saveData.posts) {
            this.posts = saveData.posts.map(post => ({
                ...post,
                timestamp: new Date(post.timestamp)
            }));
        }
        if (saveData.lastPostId) {
            this.lastPostId = saveData.lastPostId;
        }
    }
}

// 전역 SNS 시스템 인스턴스
const snsSystem = new SNSSystem();

// SNS 화면 로드
function loadSNSScreen() {
    const snsContent = document.getElementById('snsContent');
    const posts = snsSystem.getPosts(20);
    
    let html = `
        <div class="sns-container">
            <div class="sns-header">
                <h3>⚽ 축구 SNS</h3>
                <div class="sns-stats">
                    <span>총 ${snsSystem.posts.length}개 포스트</span>
                    <button onclick="refreshSNS()" class="refresh-btn">새로고침</button>
                </div>
            </div>
            
            <div class="sns-feed">
    `;

    if (posts.length === 0) {
        html += `
            <div class="no-posts">
                <p>아직 포스트가 없습니다.</p>
                <p>경기를 하거나 이적 활동을 해보세요!</p>
            </div>
        `;
    } else {
        posts.forEach(post => {
            const timeAgo = formatTimeAgo(post.timestamp);
            const postClass = `sns-post ${post.type}`;
            
            html += `
                <div class="${postClass}">
                    <div class="post-header">
                        <span class="post-type">${getPostTypeIcon(post.type)} ${getPostTypeName(post.type)}</span>
                        <span class="post-time">${timeAgo}</span>
                    </div>
                    <div class="post-content">${post.content}</div>
                    ${post.hashtags.length > 0 ? `<div class="post-hashtags">${post.hashtags.join(' ')}</div>` : ''}
                </div>
            `;
        });
    }

    html += `
            </div>
            
            <div class="sns-actions">
                <button onclick="generateSpecialPost()" class="action-btn">특별 이벤트 생성</button>
                <button onclick="simulateTransferRumor()" class="action-btn">이적 루머 생성</button>
                <button onclick="clearOldPosts()" class="action-btn">오래된 포스트 정리</button>
            </div>
        </div>
    `;

    snsContent.innerHTML = html;
}

// 포스트 타입별 아이콘
function getPostTypeIcon(type) {
    const icons = {
// 포스트 타입별 아이콘
function getPostTypeIcon(type) {
    const icons = {
        'transfer': '🔄',
        'match': '⚽',
        'rumor': '🤔',
        'special': '⭐'
    };
    return icons[type] || '📝';
}

// 포스트 타입별 이름
function getPostTypeName(type) {
    const names = {
        'transfer': '이적 확정',
        'match': '경기 결과',
        'rumor': '이적 루머',
        'special': '특별 소식'
    };
    return names[type] || '일반';
}

// 시간 표시 포맷
function formatTimeAgo(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return timestamp.toLocaleDateString();
}

// SNS 새로고침
function refreshSNS() {
    // 특별 이벤트 포스트 생성 시도
    snsSystem.createSpecialEventPost();
    
    // AI 팀 간 이적 시뮬레이션
    snsSystem.simulateAITransfer();
    
    // 화면 새로고침
    loadSNSScreen();
}

// 특별 포스트 생성
function generateSpecialPost() {
    const post = snsSystem.createSpecialEventPost();
    if (post) {
        alert('특별 이벤트 포스트가 생성되었습니다!');
        loadSNSScreen();
    } else {
        alert('이번에는 특별 이벤트가 없습니다.');
    }
}

// 이적 루머 시뮬레이션
function simulateTransferRumor() {
    // 랜덤 선수와 팀 선택
    const allTeamKeys = Object.keys(teams);
    const sourceTeam = snsSystem.getRandomElement(allTeamKeys);
    const targetTeam = snsSystem.getRandomElement(allTeamKeys.filter(key => key !== sourceTeam));
    
    const players = teams[sourceTeam];
    if (players.length === 0) return;
    
    const player = snsSystem.getRandomElement(players);
    const estimatedFee = Math.round(player.rating * 8 + Math.random() * 150);
    
    const post = snsSystem.createRumorPost(player.name, sourceTeam, targetTeam, estimatedFee);
    if (post) {
        alert('이적 루머가 생성되었습니다!');
        loadSNSScreen();
    } else {
        alert('이번에는 루머가 없습니다.');
    }
}

// 오래된 포스트 정리
function clearOldPosts() {
    const oldCount = snsSystem.posts.length;
    snsSystem.cleanOldPosts();
    const newCount = snsSystem.posts.length;
    
    if (oldCount > newCount) {
        alert(`${oldCount - newCount}개의 오래된 포스트가 삭제되었습니다.`);
        loadSNSScreen();
    } else {
        alert('삭제할 오래된 포스트가 없습니다.');
    }
}

// 경기 후 SNS 업데이트 (다른 파일에서 호출)
function updateSNSAfterMatch(homeTeam, awayTeam, homeScore, awayScore, events) {
    snsSystem.createMatchResultPost(homeTeam, awayTeam, homeScore, awayScore, events);
}

// 이적 후 SNS 업데이트 (다른 파일에서 호출)
function updateSNSAfterTransfer(playerName, oldTeam, newTeam, fee) {
    snsSystem.createTransferPost(playerName, oldTeam, newTeam, fee);
}

// 정기적인 SNS 업데이트 (게임 진행 중 자동 호출)
function periodicSNSUpdate() {
    // 5% 확률로 AI 팀 간 이적 시뮬레이션
    snsSystem.simulateAITransfer();
    
    // 3% 확률로 특별 이벤트
    snsSystem.createSpecialEventPost();
    
    // 오래된 포스트 정리
    snsSystem.cleanOldPosts();
}

// 저장/불러오기에 SNS 데이터 포함
const originalSaveGame5 = window.saveGame;
window.saveGame = function() {
    gameData.snsData = snsSystem.getSaveData();
    if (originalSaveGame5) {
        originalSaveGame5.call(this);
    }
};

const originalLoadGame5 = window.loadGame;
window.loadGame = function() {
    if (originalLoadGame5) {
        originalLoadGame5.call(this);
    }
    if (gameData.snsData) {
        snsSystem.loadSaveData(gameData.snsData);
    }
};
