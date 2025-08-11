// SNS 시스템
class SNSSystem {
    constructor() {
        this.news = {
            "1부": [],
            "2부": [],
            "3부": []
        };
        this.maxNewsPerLeague = 50;
    }

    // 뉴스 생성 확률
    shouldGenerateNews(type, league, isMyTeam = false) {
        if (isMyTeam) return true; // 내 팀은 100%
        
        const estimatedPrice = transferSystem.calculatePlayerPrice({
            ...randomPlayer,
            currentLeague: this.getTeamLeague(randomTeam.name)
        });

        const template = rumorTemplates[Math.floor(Math.random() * rumorTemplates.length)];
        const title = template
            .replace('{playerName}', randomPlayer.name)
            .replace('{toTeam}', randomTeam.name)
            .replace('{price}', `${estimatedPrice}억원`);

        const content = `구단 내부 소식통에 의하면, 최근 ${randomPlayer.name} (${randomPlayer.position}) 선수가 ${estimatedPrice}억원에 달하는 금액으로 ${randomTeam.name}과 강하게 연결되고 있다고 합니다.`;

        const hashtags = [`#루머`, `#${randomPlayer.name}`, `#${randomTeam.name}`];

        this.addNews(gameData.currentLeague, {
            type: 'rumor',
            title: title,
            content: content,
            hashtags: hashtags,
            timestamp: Date.now()
        });
    }

    // 승강 뉴스 생성
    generatePromotionNews(team, league, newLeague, position) {
        let title, content;

        if (newLeague > league) { // 승격
            title = `[승격 확정] 🎉 ${team}, ${this.getLeagueName(newLeague)} 승격 확정!`;
            content = `${new Date().toLocaleDateString()} – ${team}이 시즌 ${position}위로 마감하며 ${this.getLeagueName(newLeague)} 승격을 확정지었습니다! 한 시즌 노력이 결실을 맺었습니다. 내년에는 더 높은 무대에서의 도전이 기다리고 있습니다.`;
        } else { // 강등
            title = `[강등 확정] 😢 ${team}, ${this.getLeagueName(newLeague)} 강등...`;
            content = `${new Date().toLocaleDateString()} – ${team}이 시즌 ${position}위로 마감하며 아쉽게도 ${this.getLeagueName(newLeague)} 강등이 확정되었습니다. 한 시즌 동안 최선을 다했지만 결과가 따라주지 않았습니다. 내년에는 재도약을 위한 새로운 출발이 필요합니다.`;
        }

        const hashtags = newLeague > league ? 
            [`#승격`, `#${team}`, `#${this.getLeagueName(league)}`] :
            [`#강등`, `#${team}`, `#${this.getLeagueName(league)}`];

        this.addNews(league, {
            type: 'promotion',
            title: title,
            content: content,
            hashtags: hashtags,
            timestamp: Date.now()
        });
    }

    // 뉴스 추가
    addNews(league, newsItem) {
        if (!this.news[league]) {
            this.news[league] = [];
        }

        this.news[league].unshift(newsItem); // 최신 뉴스가 맨 위로

        // 최대 뉴스 수 제한
        if (this.news[league].length > this.maxNewsPerLeague) {
            this.news[league] = this.news[league].slice(0, this.maxNewsPerLeague);
        }
    }

    // 대이변 결과 판단
    isUpsetResult(homeTeam, awayTeam, homeScore, awayScore) {
        const homeRating = calculateTeamRating(homeTeam);
        const awayRating = calculateTeamRating(awayTeam);
        const ratingDiff = Math.abs(homeRating - awayRating);

        // 10점 이상 차이나는 팀들의 경기에서 약팀이 이기면 대이변
        if (ratingDiff >= 10) {
            if (homeRating < awayRating && homeScore > awayScore) return true;
            if (awayRating < homeRating && awayScore > homeScore) return true;
        }

        return false;
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

    // 리그명 가져오기
    getLeagueName(leagueKey) {
        const names = {
            '1부': '1부 리그',
            '2부': '2부 리그', 
            '3부': '3부 리그'
        };
        return names[leagueKey] || leagueKey;
    }

    // 뉴스 필터링
    getFilteredNews(filter = 'all') {
        if (filter === 'all') {
            const allNews = [];
            Object.values(this.news).forEach(leagueNews => {
                allNews.push(...leagueNews);
            });
            return allNews.sort((a, b) => b.timestamp - a.timestamp);
        } else {
            return this.news[filter] || [];
        }
    }

    // SNS 시스템 초기화
    initialize() {
        // 초기 루머 뉴스 몇 개 생성
        for (let i = 0; i < 3; i++) {
            this.generateTransferRumor();
        }
    }
}

// SNS 시스템 인스턴스 생성
const snsSystem = new SNSSystem();

// SNS 초기화
function initializeSNS() {
    snsSystem.initialize();
}

// SNS 표시
function displaySNS() {
    const currentFilter = document.querySelector('.sns-filter.active')?.dataset.filter || 'all';
    const newsFeed = document.getElementById('newsFeed');
    const news = snsSystem.getFilteredNews(currentFilter);

    newsFeed.innerHTML = '';

    if (news.length === 0) {
        newsFeed.innerHTML = '<div style="text-align: center; color: #666; padding: 2rem;">뉴스가 없습니다.</div>';
        return;
    }

    news.forEach(newsItem => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';

        const date = new Date(newsItem.timestamp).toLocaleDateString('ko-KR');
        const time = new Date(newsItem.timestamp).toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        newsCard.innerHTML = `
            <div class="news-header">
                <div class="news-title">${newsItem.title}</div>
                <div class="news-date">${date} ${time}</div>
            </div>
            <div class="news-content">${newsItem.content}</div>
            <div class="news-hashtags">
                ${newsItem.hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join('')}
            </div>
        `;

        newsFeed.appendChild(newsCard);
    });
}

// SNS 필터 이벤트 리스너
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sns-filter').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelectorAll('.sns-filter').forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            displaySNS();
        });
    });
}); probabilities = {
            match: {
                same: 0.8,   // 같은 리그
                other: 0.3   // 다른 리그
            },
            transfer: 1.0,   // 이적은 100%
            promotion: 1.0,  // 승강은 100%
            rumor: 0.2      // 루머는 20%
        };
        
        const isCurrentLeague = league === gameData.currentLeague;
        
        switch (type) {
            case 'match':
                return Math.random() < (isCurrentLeague ? probabilities.match.same : probabilities.match.other);
            case 'transfer':
                return Math.random() < probabilities.transfer;
            case 'promotion':
                return Math.random() < probabilities.promotion;
            case 'rumor':
                return Math.random() < probabilities.rumor;
            default:
                return false;
        }
    }

    // 경기 결과 뉴스 생성
    generateMatchNews(homeTeam, awayTeam, homeScore, awayScore, league, homeGoalScorers = [], awayGoalScorers = []) {
        if (!this.shouldGenerateNews('match', league, homeTeam === gameData.selectedTeam || awayTeam === gameData.selectedTeam)) {
            return;
        }

        const isUpset = this.isUpsetResult(homeTeam, awayTeam, homeScore, awayScore);
        let title, content;
        
        if (homeScore > awayScore) {
            if (isUpset) {
                title = `[${league}] 🚨 대이변! ${homeTeam}이 ${awayTeam}을 ${homeScore}-${awayScore}로 격파!`;
                content = `${new Date().toLocaleDateString()} – 예상을 뒤엎는 결과가 나왔습니다. ${homeTeam}이 강팀 ${awayTeam}을 상대로 놀라운 승리를 거두었습니다.`;
            } else {
                title = `[${league}] ⚽ ${homeTeam} ${homeScore}-${awayScore} ${awayTeam}`;
                content = `${new Date().toLocaleDateString()} – ${homeTeam}이 홈에서 ${awayTeam}을 ${homeScore}-${awayScore}로 이겼습니다.`;
            }
        } else if (homeScore < awayScore) {
            if (isUpset) {
                title = `[${league}] ⚡ 이변! ${awayTeam}이 원정에서 ${homeTeam}을 ${awayScore}-${homeScore}로 잡았다!`;
                content = `${new Date().toLocaleDateString()} – ${awayTeam}이 어려운 원정에서 ${homeTeam}을 상대로 값진 승리를 챙겼습니다.`;
            } else {
                title = `[${league}] ⚽ ${homeTeam} ${homeScore}-${awayScore} ${awayTeam}`;
                content = `${new Date().toLocaleDateString()} – ${awayTeam}이 원정에서 ${homeTeam}을 ${awayScore}-${homeScore}로 이겼습니다.`;
            }
        } else {
            title = `[${league}] ⚽ ${homeTeam} ${homeScore}-${awayScore} ${awayTeam} - 무승부`;
            content = `${new Date().toLocaleDateString()} – ${homeTeam}과 ${awayTeam}이 ${homeScore}-${awayScore} 무승부를 기록했습니다.`;
        }

        // 득점자 정보 추가
        if (homeGoalScorers.length > 0 || awayGoalScorers.length > 0) {
            content += "\n\n득점자: ";
            if (homeGoalScorers.length > 0) {
                content += `${homeTeam} - ${homeGoalScorers.join(', ')}`;
            }
            if (awayGoalScorers.length > 0) {
                if (homeGoalScorers.length > 0) content += " / ";
                content += `${awayTeam} - ${awayGoalScorers.join(', ')}`;
            }
        }

        const hashtags = [`#${homeTeam}`, `#${awayTeam}`, `#${league}`];
        
        this.addNews(league, {
            type: 'match',
            title: title,
            content: content,
            hashtags: hashtags,
            timestamp: Date.now()
        });
    }

    // 이적 확정 뉴스 생성
    generateTransferNews(player, price, type, fromTeam = null, toTeam = null) {
        const templates = [
            "[오피셜] {playerName}, {price}에 {toTeam} 이적 확정!",
            "HERE WE GO! {playerName}, {toTeam} 이적 확정! by 파브리치오 로마노",
            "[이적 확정] {playerName}, {fromTeam}에서 {toTeam}으로 이적",
            "[공식 발표] {toTeam}, {playerName} 영입 완료",
            "[Breaking] {playerName} → {toTeam} 이적 성사!",
            "[Transfer] {playerName}의 새로운 도전, {toTeam}",
            "[오피셜] {toTeam}, {playerName} 계약 완료",
            "[이적] {playerName}, {price}에 {toTeam} 합류",
            "[News] {playerName}, {toTeam}에서 새로운 시작",
            "[Transfer] {fromTeam} → {toTeam}, {playerName} 이적",
            "[공식] {playerName}, {toTeam} 유니폼 착용",
            "[Welcome] {toTeam}, {playerName} 영입 발표"
        ];

        let title, content;
        let targetTeam, targetLeague;

        if (type === 'buy') {
            targetTeam = gameData.selectedTeam;
            targetLeague = gameData.currentLeague;
            fromTeam = player.originalTeam || '이전 팀';
            toTeam = gameData.selectedTeam;
        } else {
            targetTeam = fromTeam || '타팀';
            targetLeague = this.getTeamLeague(targetTeam);
            fromTeam = gameData.selectedTeam;
            toTeam = '타팀';
        }

        const template = templates[Math.floor(Math.random() * templates.length)];
        title = template
            .replace('{playerName}', player.name)
            .replace('{price}', `${price}억원`)
            .replace('{fromTeam}', fromTeam)
            .replace('{toTeam}', toTeam);

        const contentTemplates = [
            `${new Date().toLocaleDateString()} – ${fromTeam}의 ${player.age}세 ${player.name} (${player.position}) 선수가 ${price}억원에 달하는 금액으로 ${toTeam}으로 이적을 확정지었습니다. ${player.name} 선수는 ${player.position}에 맞는 뛰어난 실력을 자랑합니다.`,
            `${new Date().toLocaleDateString()} – ${fromTeam}의 ${player.age}세 ${player.name} (${player.position}) 선수가 ${price}억원에 달하는 금액으로 ${toTeam} 이적을 확정지었습니다. 모든 계약 서류가 준비되었고, 메디컬 테스트도 완료되었습니다.`,
            `${new Date().toLocaleDateString()} – ${toTeam}이 ${fromTeam}의 ${player.name} 선수 영입을 공식 발표했습니다. 이적료는 ${price}억원으로 알려졌습니다.`,
            `${new Date().toLocaleDateString()} – ${player.name} 선수가 ${fromTeam}을 떠나 ${toTeam}에서 새로운 도전을 시작합니다. 이적료는 ${price}억원입니다.`
        ];

        content = contentTemplates[Math.floor(Math.random() * contentTemplates.length)];

        const hashtags = [`#transfer`, `#${fromTeam}`, `#${toTeam}`, `#${player.name}`];

        // 리그간 이적인 경우 특별 기사
        if (this.getTeamLeague(fromTeam) !== this.getTeamLeague(toTeam)) {
            title = `[리그간 이적] ⬆️ ${player.name}, ${this.getTeamLeague(fromTeam)} → ${this.getTeamLeague(toTeam)} 도전!`;
            content = `${new Date().toLocaleDateString()} – ${this.getTeamLeague(fromTeam)} ${fromTeam}의 ${player.name}이 ${price}억원에 ${this.getTeamLeague(toTeam)} ${toTeam}으로 이적했습니다! 더 높은 무대에서의 도전을 선택한 ${player.name}의 활약이 기대됩니다.`;
            hashtags.push('#리그간이적');
        }

        this.addNews(targetLeague, {
            type: 'transfer',
            title: title,
            content: content,
            hashtags: hashtags,
            timestamp: Date.now()
        });
    }

    // 이적 루머 뉴스 생성
    generateTransferRumor() {
        if (!this.shouldGenerateNews('rumor', gameData.currentLeague)) {
            return;
        }

        const rumorTemplates = [
            "[이적 루머] {playerName}, {toTeam} 이적설 솔솔... {price} 거론",
            "[Rumor] {playerName} → {toTeam} 이적 가능성 제기",
            "[소식통] {playerName}, {toTeam}과 접촉설",
            "[루머] {toTeam}, {playerName} 영입 관심",
            "[Transfer Rumor] {playerName}, {toTeam} 이적 논의 중?"
        ];

        // 랜덤 선수와 팀 선택
        const allPlayers = Object.values(playerDatabase).flat();
        const randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];
        const allTeams = Object.values(leagueData).flat().map(data => data.teams).flat();
        const randomTeam = allTeams[Math.floor(Math.random() * allTeams.length)];
        
        const
