// SNS 시스템
class SNSSystem {
    constructor() {
        this.newsFeed = [];
        this.maxNews = 50; // 최대 50개 뉴스 유지
        
        // 이적 확정 기사 템플릿
        this.transferConfirmedTemplates = [
            "[오피셜] {playerName}, {transferFee}억에 {newTeam} 이적 확정!",
            "[오피셜] {playerName}, {transferFee}억에 {newTeam} 합류!",
            "[오피셜] {playerName}, **{newTeam}**과 계약! 새로운 도전 시작!",
            "[오피셜] {playerName}, {transferFee}억으로 {newTeam} 이적 '충격'!",
            "[오피셜] {playerName}, **{newTeam}**과 동행!",
            "[오피셜] {playerName}, {transferFee}억에 {newTeam} 이적!",
            "[오피셜] {playerName}, **{newTeam}**과 계약!",
            "[오피셜] {playerName}, {transferFee}억에 {newTeam} 이적 '전격'!",
            "[오피셜] {playerName}, **{newTeam}**으로 '유턴'!",
            "[오피셜] {playerName}, {newTeam} 이적! '이변'의 주인공!",
            "HERE WE GO! {playerName}, {newTeam} 이적 확정! by 파브리치오 로마노"
        ];
        
        // 이적 루머 템플릿
        this.transferRumorTemplates = [
            "[이적 루머] {playerName}, {newTeam} 이적설 솔솔... {transferFee}억 거론",
            "[이적설] {playerName}, {newTeam}으로 깜짝 이적하나?",
            "[이적시장] {playerName}, {newTeam} 이적 임박?",
            "[루머] {playerName}, {newTeam} '러브콜' 받았다!",
            "[이적 가십] {playerName}, {newTeam} 이적 '가능성' 제기!"
        ];
        
        // 경기 결과 템플릿
        this.matchResultTemplates = {
            shock: [
                "[경기 결과] 충격! {winTeam}이 {loseTeam}을 {score}로 격파!",
                "[경기 결과] 이변! {winTeam}, {loseTeam}을 {score}로 잡았다!",
                "[경기 결과] 믿을 수 없는 패배! {loseTeam}, {winTeam}에 {score} 패!"
            ],
            expected: [
                "[경기 결과] 예상대로! {winTeam}, {loseTeam}을 {score}로 완파!",
                "[경기 결과] 압도적인 승리! {winTeam}, {loseTeam}에 {score} 승리!",
                "[경기 결과] 순조로운 출발! {winTeam}, {loseTeam}에 {score} 승!"
            ],
            normal: [
                "[경기 결과] {winTeam}, {loseTeam}에 {score} 승리!",
                "[경기 결과] {winTeam}, {loseTeam} 꺾고 귀중한 승점 3점 획득!"
            ],
            draw: [
                "[경기 결과] {team1}와 {team2}, {score} 무승부!",
                "[경기 결과] 충격적인 무승부! {strongTeam}, {weakTeam}과 {score} 무승부!"
            ]
        };
        
        // 선수 강점 설명
        this.playerStrengths = {
            GK: ["안정적인 볼 키핑", "뛰어난 반사신경", "정확한 킥", "제공권 장악 능력", "훌륭한 위치 선정"],
            DF: ["탁월한 수비력", "뛰어난 태클", "정확한 패스", "강력한 헤더", "안정적인 빌드업", "뛰어난 일대일 수비"],
            MF: ["넓은 시야", "정확한 패스", "뛰어난 드리블", "경기 조율 능력", "엄청난 활동량", "창의적인 플레이"],
            FW: ["뛰어난 득점력", "폭발적인 스피드", "정교한 마무리", "환상적인 드리블 돌파", "강력한 슈팅", "탁월한 오프더볼 움직임"]
        };
    }

    // 이적 뉴스 추가
    addTransferNews(player, newTeam, oldTeam, transferFee) {
        const isRumor = Math.random() < 0.3; // 30% 확률로 루머
        const templates = isRumor ? this.transferRumorTemplates : this.transferConfirmedTemplates;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        const playerStrengths = this.playerStrengths[player.position];
        const strength = playerStrengths[Math.floor(Math.random() * playerStrengths.length)];
        
        const newTeamName = teamNames[newTeam] || newTeam;
        const oldTeamName = teamNames[oldTeam] || oldTeam;
        
        let title = template
            .replace(/{playerName}/g, player.name)
            .replace(/{newTeam}/g, newTeamName)
            .replace(/{transferFee}/g, transferFee);
        
        let content = '';
        if (!isRumor) {
            content = `${this.getCurrentDate()} – ${oldTeamName}의 ${player.age}세 ${player.name} (${player.position}) 선수가 ${transferFee}억에 달하는 금액으로 **${newTeamName}**으로 이적을 확정 지었습니다. ${player.name} 선수는 ${player.position}에 맞는 ${strength}을(를) 자랑합니다.`;
        } else {
            content = `구단 내부 소식통에 의하면, 최근 ${oldTeamName}의 ${player.age}세 ${player.name} (${player.position}) 선수가 ${transferFee}억에 달하는 금액으로 ${newTeamName}과 강하게 연결되고 있다고 합니다. ${player.name}은 ${player.position}에 맞는 ${strength}으로 ${newTeamName}의 관심을 받고 있습니다.`;
        }
        
        const hashtags = `#transfer #${oldTeam} #${newTeam} #${player.name.replace(' ', '')}`;
        
        this.addNews({
            type: isRumor ? 'rumor' : 'transfer',
            title: title,
            content: content,
            hashtags: hashtags,
            timestamp: Date.now()
        });
    }

    // 경기 결과 뉴스 추가
    addMatchResultNews(team1, team2, score1, score2, goalScorers) {
        const team1Name = teamNames[team1] || team1;
        const team2Name = teamNames[team2] || team2;
        const scoreText = `${score1}-${score2}`;
        
        let templateCategory;
        let winTeam, loseTeam;
        
        if (score1 !== score2) {
            winTeam = score1 > score2 ? team1Name : team2Name;
            loseTeam = score1 > score2 ? team2Name : team1Name;
            
            // 팀 강도 비교 (대략적)
            const team1Strength = this.getTeamStrength(team1);
            const team2Strength = this.getTeamStrength(team2);
            const strengthDiff = Math.abs(team1Strength - team2Strength);
            
            if (strengthDiff > 10 && ((score1 > score2 && team1Strength < team2Strength) || (score2 > score1 && team2Strength < team1Strength))) {
                templateCategory = 'shock'; // 이변
            } else if (strengthDiff > 5 && ((score1 > score2 && team1Strength > team2Strength) || (score2 > score1 && team2Strength > team1Strength))) {
                templateCategory = 'expected'; // 예상된 결과
            } else {
                templateCategory = 'normal'; // 일반적인 결과
            }
        } else {
            templateCategory = 'draw'; // 무승부
        }
        
        const templates = this.matchResultTemplates[templateCategory];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        let title = template;
        let scorerInfo = '';
        
        if (goalScorers && goalScorers.length > 0) {
            const mainScorer = goalScorers[0];
            scorerInfo = ` ${mainScorer}이 득점했습니다.`;
        }
        
        if (templateCategory === 'draw') {
            title = title
                .replace(/{team1}/g, team1Name)
                .replace(/{team2}/g, team2Name)
                .replace(/{score}/g, scoreText);
        } else {
            title = title
                .replace(/{winTeam}/g, winTeam)
                .replace(/{loseTeam}/g, loseTeam)
                .replace(/{strongTeam}/g, team1Strength > team2Strength ? team1Name : team2Name)
                .replace(/{weakTeam}/g, team1Strength < team2Strength ? team1Name : team2Name)
                .replace(/{score}/g, scoreText);
        }
        
        const content = title + scorerInfo;
        const hashtags = `#${team1} #${team2} #matchresult`;
        
        this.addNews({
            type: 'match',
            title: title,
            content: content,
            hashtags: hashtags,
            timestamp: Date.now()
        });
    }

    // 팀 강도 계산 (대략적)
    getTeamStrength(teamKey) {
        if (!teams[teamKey]) return 75;
        
        const teamPlayers = teams[teamKey];
        const avgRating = teamPlayers.reduce((sum, player) => sum + player.rating, 0) / teamPlayers.length;
        return Math.round(avgRating);
    }

    // 뉴스 추가
    addNews(newsItem) {
        // 뉴스 앞쪽에 추가 (최신 뉴스가 위에 오도록)
        this.newsFeed.unshift(newsItem);
        
        // 최대 개수 초과 시 오래된 뉴스 제거
        if (this.newsFeed.length > this.maxNews) {
            this.newsFeed = this.newsFeed.slice(0, this.maxNews);
        }
        
        console.log(`새 뉴스 추가: ${newsItem.title}`);
    }

    // 현재 날짜 문자열 생성
    getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    }

    // 시간 경과 표시 (상대적)
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        return `${days}일 전`;
    }

    // 뉴스 피드 필터링
    filterNews(type = 'all') {
        if (type === 'all') {
            return this.newsFeed;
        }
        return this.newsFeed.filter(news => news.type === type);
    }

    // 게임 시작 환영 뉴스 추가
    addWelcomeNews() {
        this.addNews({
            type: 'announcement',
            title: '새로운 감독 임명!',
            content: `${teamNames[gameData.selectedTeam]}의 새로운 감독이 임명되었습니다. 팬들의 기대가 높아지고 있습니다.`,
            hashtags: `#${gameData.selectedTeam} #newmanager`,
            timestamp: Date.now()
        });
    }

    // 선수 이적 루머 생성 (가끔)
    generateTransferRumor() {
        if (Math.random() > 0.1) return; // 10% 확률로만 실행
        
        // 이적시장에 있는 선수 중 하나를 선택
        if (transferSystem.transferMarket.length === 0) return;
        
        const randomPlayer = transferSystem.transferMarket[
            Math.floor(Math.random() * transferSystem.transferMarket.length)
        ];
        
        // 랜덤한 관심 팀 선택
        const allTeams = Object.keys(teamNames);
        const interestedTeam = allTeams[Math.floor(Math.random() * allTeams.length)];
        
        const template = this.transferRumorTemplates[Math.floor(Math.random() * this.transferRumorTemplates.length)];
        const playerStrengths = this.playerStrengths[randomPlayer.position];
        const strength = playerStrengths[Math.floor(Math.random() * playerStrengths.length)];
        
        const title = template
            .replace(/{playerName}/g, randomPlayer.name)
            .replace(/{newTeam}/g, teamNames[interestedTeam])
            .replace(/{transferFee}/g, randomPlayer.price);
        
        const oldTeamName = randomPlayer.originalTeam === "외부리그" ? 
            "외부리그" : (teamNames[randomPlayer.originalTeam] || randomPlayer.originalTeam);
        
        const content = `구단 내부 소식통에 의하면, 최근 ${oldTeamName}의 ${randomPlayer.age}세 ${randomPlayer.name} (${randomPlayer.position}) 선수가 ${randomPlayer.price}억에 달하는 금액으로 ${teamNames[interestedTeam]}과 강하게 연결되고 있다고 합니다. ${randomPlayer.name}은 ${randomPlayer.position}에 맞는 ${strength}으로 ${teamNames[interestedTeam]}의 관심을 받고 있습니다.`;
        
        const hashtags = `#${randomPlayer.name.replace(' ', '')} #${interestedTeam} #transferrumor`;
        
        this.addNews({
            type: 'rumor',
            title: title,
            content: content,
            hashtags: hashtags,
            timestamp: Date.now()
        });
    }

    // 시즌 관련 뉴스 생성
    addSeasonNews(type, teamData) {
        let title, content;
        
        switch(type) {
            case 'championship':
                title = `🏆 ${teamNames[gameData.selectedTeam]} 우승 확정!`;
                content = `${teamNames[gameData.selectedTeam]}이 시즌 우승을 확정지었습니다. 팬들의 환호가 경기장을 가득 메웠습니다.`;
                break;
            case 'topFour':
                title = `✨ ${teamNames[gameData.selectedTeam]} 상위권 진출!`;
                content = `${teamNames[gameData.selectedTeam]}이 상위권 진출에 성공했습니다. 훌륭한 시즌을 보냈습니다.`;
                break;
            case 'relegation':
                title = `⚠️ ${teamNames[gameData.selectedTeam]} 강등권 위기`;
                content = `${teamNames[gameData.selectedTeam]}이 강등권에 머물고 있습니다. 남은 경기에서의 분발이 필요합니다.`;
                break;
        }
        
        if (title && content) {
            this.addNews({
                type: 'announcement',
                title: title,
                content: content,
                hashtags: `#${gameData.selectedTeam} #season`,
                timestamp: Date.now()
            });
        }
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            newsFeed: this.newsFeed
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        if (saveData && saveData.newsFeed) {
            this.newsFeed = saveData.newsFeed;
        }
    }
}

// 전역 SNS 시스템 인스턴스
const snsSystem = new SNSSystem();

// SNS 뉴스 피드 표시
function displayNewsFeed(filter = 'all') {
    const newsFeed = document.getElementById('newsFeed');
    if (!newsFeed) return;
    
    const filteredNews = snsSystem.filterNews(filter);
    
    if (filteredNews.length === 0) {
        newsFeed.innerHTML = `
            <div class="news-item">
                <div class="news-content">
                    <h4>아직 뉴스가 없습니다</h4>
                    <p>경기를 진행하고 이적을 하면서 다양한 뉴스를 확인해보세요!</p>
                    <div class="news-time">지금</div>
                </div>
            </div>
        `;
        return;
    }
    
    newsFeed.innerHTML = '';
    
    filteredNews.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.className = `news-item ${news.type}`;
        
        newsCard.innerHTML = `
            <div class="news-content">
                <h4 class="news-title">${news.title}</h4>
                <p class="news-text">${news.content}</p>
                <div class="news-hashtags">${news.hashtags}</div>
                <div class="news-time">${snsSystem.getTimeAgo(news.timestamp)}</div>
            </div>
        `;
        
        newsFeed.appendChild(newsCard);
    });
}

// SNS 필터 설정
function setSNSFilter(filter) {
    const filterBtns = document.querySelectorAll('#sns .filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    displayNewsFeed(filter);
}

// 경기 후 SNS 업데이트
function updateSNSAfterMatch(homeTeam, awayTeam, homeScore, awayScore, goalScorers) {
    // 내 팀 경기는 무조건 뉴스 생성
    if (homeTeam === gameData.selectedTeam || awayTeam === gameData.selectedTeam) {
        snsSystem.addMatchResultNews(homeTeam, awayTeam, homeScore, awayScore, goalScorers);
    } 
    // 다른 팀 경기는 가끔 뉴스 생성
    else if (Math.random() < 0.3) {
        snsSystem.addMatchResultNews(homeTeam, awayTeam, homeScore, awayScore, goalScorers);
    }
    
    // 이적 루머 생성
    snsSystem.generateTransferRumor();
}

// 팀 선택 후 환영 뉴스
function addWelcomeNews() {
    snsSystem.addWelcomeNews();
}

// SNS 이벤트 리스너 설정
function setupSNSEventListeners() {
    const snsFilterBtns = document.querySelectorAll('#sns .filter-btn');
    snsFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            setSNSFilter(filter);
        });
    });
}

// 시즌별 SNS 뉴스
function addSeasonEndNews() {
    const finalPosition = calculateFinalPosition();
    
    if (finalPosition === 1) {
        snsSystem.addSeasonNews('championship');
    } else if (finalPosition <= 4) {
        snsSystem.addSeasonNews('topFour');
    } else if (finalPosition >= 15) {
        snsSystem.addSeasonNews('relegation');
    }
}

// 전역 함수로 노출
window.snsSystem = snsSystem;
window.displayNewsFeed = displayNewsFeed;
window.setSNSFilter = setSNSFilter;
window.updateSNSAfterMatch = updateSNSAfterMatch;
window.addWelcomeNews = addWelcomeNews;
window.setupSNSEventListeners = setupSNSEventListeners;
window.addSeasonEndNews = addSeasonEndNews;
