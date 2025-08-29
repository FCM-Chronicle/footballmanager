// SNS 뉴스 시스템

let newsHistory = [];
const MAX_NEWS = 50;

// 이적 확정 기사 템플릿 (12가지)
const transferConfirmedTemplates = [
    {
        title: "[오피셜] {player}, {fee}에 {team} 이적 확정!",
        content: "{date} – {previousTeam}의 {age}세 {player} ({position}) 선수가 {fee}에 달하는 금액으로 {team}으로 이적을 확정지었습니다. {player} 선수는 {position}에 맞는 뛰어난 능력을 자랑합니다.",
        hashtags: "#transfer #{previousTeam} #{team} #{player}"
    },
    {
        title: "[공식발표] {team}, {player} 영입 완료",
        content: "{team}이 {player} 선수와의 계약을 공식 발표했습니다. {fee}의 이적료가 지불되었으며, {player}는 '{team}에서 새로운 도전을 시작하게 되어 기쁘다'고 소감을 밝혔습니다.",
        hashtags: "#공식발표 #{team} #영입 #{player}"
    },
    {
        title: "[브레이킹] {player}, {previousTeam} 떠나 {team} 합류",
        content: "마침내 성사되었습니다! {player}가 {previousTeam}을 떠나 {team}에 합류합니다. 이적료는 {fee}으로 알려졌습니다. {age}세의 {position} 선수는 새로운 환경에서의 도전을 준비하고 있습니다.",
        hashtags: "#브레이킹뉴스 #{player} #이적완료"
    },
    {
        title: "[이적완료] {team}의 새로운 얼굴, {player}",
        content: "{team}이 {player} 선수 영입을 완료했다고 발표했습니다. {previousTeam}에서 뛰던 {player}는 {fee}의 이적료로 새로운 팀에 합류하게 되었습니다.",
        hashtags: "#이적완료 #{team} #새로운얼굴"
    },
    {
        title: "[독점] {player} 이적 스토리 전말",
        content: "{player}의 {team} 이적 뒤에는 흥미로운 이야기가 있었습니다. {fee}라는 거액의 이적료가 오간 이번 이적은 {previousTeam} 팬들에게는 아쉬운 소식이지만, {team} 팬들에게는 희소식입니다.",
        hashtags: "#독점스토리 #이적전말 #{player}"
    },
    {
        title: "[계약체결] {team}-{player}, 공식 사인 완료",
        content: "{team}이 {player}와의 계약서에 공식 사인을 완료했습니다. {age}세 {position}인 {player}는 {fee}의 이적료로 {previousTeam}에서 이적해왔습니다.",
        hashtags: "#계약체결 #공식사인 #{team}"
    },
    {
        title: "[메디컬 통과] {player}, {team} 이적 최종 승인",
        content: "{player}가 메디컬 테스트를 성공적으로 통과하며 {team} 이적이 최종 승인되었습니다. {fee}의 이적료로 성사된 이번 이적으로 {team}의 전력이 한층 보강될 것으로 예상됩니다.",
        hashtags: "#메디컬통과 #최종승인 #{player}"
    },
    {
        title: "[웰컴] {team}, {player} 환영식 개최",
        content: "{team}이 새로 영입한 {player} 선수의 환영식을 개최했습니다. {fee}으로 {previousTeam}에서 이적한 {player}는 '최선을 다하겠다'는 각오를 다졌습니다.",
        hashtags: "#웰컴 #환영식 #{team}"
    },
    {
        title: "[빅딜] {fee} 이적료의 주인공은 {player}",
        content: "이번 이적시장의 빅딜이 성사되었습니다. {player}가 {fee}라는 거액의 이적료로 {previousTeam}에서 {team}으로 이적했습니다. {position} 포지션의 핵심 선수로 기대를 모으고 있습니다.",
        hashtags: "#빅딜 #거액이적료 #{player}"
    },
    {
        title: "[신규영입] {team}의 야심작, {player} 영입",
        content: "{team}이 야심차게 추진한 {player} 영입이 드디어 성사되었습니다. {age}세의 {position} 선수는 {fee}의 몸값으로 {previousTeam}을 떠나 새로운 도전을 시작합니다.",
        hashtags: "#신규영입 #야심작 #{team}"
    },
    {
        title: "[이적시장] {player}, 새 둥지는 {team}",
        content: "이적시장에서 주목받던 {player}의 새 둥지가 결정되었습니다. {team}이 {fee}을 지불하며 {previousTeam}에서 {player}를 데려왔습니다. 팬들의 기대가 높아지고 있습니다.",
        hashtags: "#이적시장 #새둥지 #{player}"
    },
    {
        title: "[팬들주목] {team}, {player} 영입으로 전력 보강",
        content: "{team} 팬들이 주목해야 할 소식입니다. {player}가 {fee}의 이적료로 팀에 합류했습니다. {previousTeam}에서 좋은 활약을 보인 {age}세 {position} 선수의 활약이 기대됩니다.",
        hashtags: "#팬들주목 #전력보강 #{team}"
    }
];

// 이적 루머 템플릿 (5가지)
const transferRumorTemplates = [
    {
        title: "[루머] {player}, {team} 이적설 급부상",
        content: "{player}의 {team} 이적설이 급부상하고 있습니다. 관계자들은 '구체적인 것은 없다'고 선을 그었지만, 업계에서는 이미 기정사실로 받아들이는 분위기입니다.",
        hashtags: "#루머 #이적설 #{player}"
    },
    {
        title: "[단독] {player}-{team}, 비밀 접촉 포착",
        content: "본지가 단독 포착한 바에 따르면, {player}와 {team} 측이 비밀리에 접촉을 가진 것으로 알려졌습니다. 아직 공식 발표는 없지만 이적 가능성이 높아 보입니다.",
        hashtags: "#단독 #비밀접촉 #{team}"
    },
    {
        title: "[관측] {team}, {player} 영입 검토 중",
        content: "복수의 관계자에 따르면 {team}이 {player} 영입을 적극 검토 중인 것으로 파악됩니다. 구체적인 조건은 아직 협의 단계인 것으로 알려졌습니다.",
        hashtags: "#관측 #영입검토 #{team}"
    },
    {
        title: "[추측] {player} 거취, {team}이 유력",
        content: "{player}의 다음 행선지로 {team}이 가장 유력한 후보로 떠오르고 있습니다. 양측 모두 공식 입장은 밝히지 않았지만, 업계에서는 가능성을 높게 보고 있습니다.",
        hashtags: "#추측 #거취 #{player}"
    },
    {
        title: "[소문] {team} 스카우팅 리스트 1순위는 {player}?",
        content: "{team}의 스카우팅 리스트 1순위에 {player}가 올라있다는 소문이 돌고 있습니다. 아직 확인되지 않은 정보이지만, 팬들 사이에서는 벌써 화제가 되고 있습니다.",
        hashtags: "#소문 #스카우팅리스트 #{team}"
    }
];

// 경기 결과 템플릿
const matchResultTemplates = {
    shock: [
        {
            title: "[충격] {loser}, {winner}에게 완패... {score}",
            content: "충격적인 결과입니다. {loser}가 {winner}에게 {score}로 완패를 당했습니다. 경기 전 예상을 뒤엎는 결과에 축구팬들이 놀라고 있습니다.",
            hashtags: "#충격 #{loser} #{winner}"
        },
        {
            title: "[이변] {winner}, {loser} 상대로 대승!",
            content: "큰 이변이 일어났습니다! {winner}가 {loser}를 상대로 {score}라는 스코어로 승리를 거두었습니다. 경기 전 전력 차이를 생각하면 놀라운 결과입니다.",
            hashtags: "#이변 #{winner} #대승"
        }
    ],
    expected: [
        {
            title: "[예상대로] {winner}, {loser} 꺾고 승리",
            content: "예상대로의 결과입니다. {winner}가 {loser}를 {score}로 제압했습니다. 경기 내내 우세를 점했던 {winner}의 승리는 당연한 결과로 보입니다.",
            hashtags: "#예상대로 #{winner} #승리"
        },
        {
            title: "[순조] {winner}, {loser}전에서 무난한 승리",
            content: "{winner}가 {loser}와의 경기에서 {score}로 순조로운 승리를 거두었습니다. 경기력에서 앞선 {winner}의 실력이 고스란히 드러난 경기였습니다.",
            hashtags: "#순조 #{winner} #무난한승리"
        }
    ],
    normal: [
        {
            title: "[박빙] {team1} vs {team2}, {score}로 마감",
            content: "{team1}과 {team2}의 경기가 {score}로 마무리되었습니다. 양팀 모두 좋은 경기력을 보여주며 팬들에게 볼거리를 선사했습니다.",
            hashtags: "#박빙 #{team1} #{team2}"
        }
    ],
    draw: [
        {
            title: "[무승부] {team1}-{team2}, {score} 스코어리스 드로",
            content: "{team1}과 {team2}가 {score}로 무승부를 기록했습니다. 양팀 모두 골을 넣기 위해 노력했지만 결국 승부를 가리지 못했습니다.",
            hashtags: "#무승부 #{team1} #{team2}"
        },
        {
            title: "[아쉬움] {team1}-{team2} 경기, 승부 가리지 못해",
            content: "{team1}과 {team2}의 경기가 {score} 무승부로 끝났습니다. 양팀 모두 승점 1점씩을 나눠 가지며 아쉬움을 남겼습니다.",
            hashtags: "#아쉬움 #무승부 #{team1}"
        }
    ]
};

function generateNews(title, content, hashtags) {
    const news = {
        id: Date.now(),
        title: title,
        content: content,
        hashtags: hashtags,
        date: new Date().toLocaleString('ko-KR')
    };
    
    newsHistory.unshift(news);
    
    // 최대 50개 뉴스만 보관
    if (newsHistory.length > MAX_NEWS) {
        newsHistory = newsHistory.slice(0, MAX_NEWS);
    }
    
    console.log('News generated:', news.title);
}

function generateTransferNews(type, player, price, fromTeam = null, toTeam = null) {
    if (type === 'buy' || type === 'confirmed') {
        const template = transferConfirmedTemplates[Math.floor(Math.random() * transferConfirmedTemplates.length)];
        
        let title = template.title
            .replace('{player}', player.name)
            .replace('{fee}', `${price}억원`)
            .replace('{team}', toTeam || gameState.selectedTeam);
            
        let content = template.content
            .replace(/\{player\}/g, player.name)
            .replace(/\{fee\}/g, `${price}억원`)
            .replace(/\{team\}/g, toTeam || gameState.selectedTeam)
            .replace('{previousTeam}', fromTeam || '이전 소속팀')
            .replace('{age}', player.age)
            .replace('{position}', player.position)
            .replace('{date}', new Date().toLocaleDateString('ko-KR'));
            
        let hashtags = template.hashtags
            .replace('{player}', player.name.replace(/\s+/g, ''))
            .replace('{team}', (toTeam || gameState.selectedTeam).replace(/\s+/g, ''))
            .replace('{previousTeam}', (fromTeam || '이전팀').replace(/\s+/g, ''));
            
        generateNews(title, content, hashtags);
        
    } else if (type === 'rumor') {
    } else if (type === 'rumor') {
        const template = transferRumorTemplates[Math.floor(Math.random() * transferRumorTemplates.length)];
        
        let title = template.title
            .replace('{player}', player.name)
            .replace('{team}', toTeam || gameState.selectedTeam);
            
        let content = template.content
            .replace(/\{player\}/g, player.name)
            .replace(/\{team\}/g, toTeam || gameState.selectedTeam);
            
        let hashtags = template.hashtags
            .replace('{player}', player.name.replace(/\s+/g, ''))
            .replace('{team}', (toTeam || gameState.selectedTeam).replace(/\s+/g, ''));
            
        generateNews(title, content, hashtags);
    }
}

function generateMatchNews(result) {
    const myTeam = gameState.selectedTeam;
    const opponent = matchState.awayTeam;
    const score = `${matchState.homeScore}-${matchState.awayScore}`;
    
    let template;
    let newsType;
    
    // 결과에 따른 뉴스 타입 결정
    if (result === 'draw') {
        template = matchResultTemplates.draw[Math.floor(Math.random() * matchResultTemplates.draw.length)];
        newsType = 'draw';
    } else {
        const scoreDiff = Math.abs(matchState.homeScore - matchState.awayScore);
        const winner = result === 'win' ? myTeam : opponent;
        const loser = result === 'win' ? opponent : myTeam;
        
        // 대승/완패 (3골 이상 차이) = 충격
        if (scoreDiff >= 3) {
            template = matchResultTemplates.shock[Math.floor(Math.random() * matchResultTemplates.shock.length)];
            newsType = 'shock';
        } 
        // 1-2골 차이 = 예상대로 또는 일반
        else {
            if (Math.random() < 0.6) {
                template = matchResultTemplates.expected[Math.floor(Math.random() * matchResultTemplates.expected.length)];
                newsType = 'expected';
            } else {
                template = matchResultTemplates.normal[Math.floor(Math.random() * matchResultTemplates.normal.length)];
                newsType = 'normal';
            }
        }
    }
    
    let title, content, hashtags;
    
    if (newsType === 'draw') {
        title = template.title
            .replace('{team1}', myTeam)
            .replace('{team2}', opponent)
            .replace('{score}', score);
            
        content = template.content
            .replace(/\{team1\}/g, myTeam)
            .replace(/\{team2\}/g, opponent)
            .replace(/\{score\}/g, score);
            
        hashtags = template.hashtags
            .replace('{team1}', myTeam.replace(/\s+/g, ''))
            .replace('{team2}', opponent.replace(/\s+/g, ''));
    } else if (newsType === 'normal') {
        title = template.title
            .replace('{team1}', myTeam)
            .replace('{team2}', opponent)
            .replace('{score}', score);
            
        content = template.content
            .replace(/\{team1\}/g, myTeam)
            .replace(/\{team2\}/g, opponent)
            .replace(/\{score\}/g, score);
            
        hashtags = template.hashtags
            .replace('{team1}', myTeam.replace(/\s+/g, ''))
            .replace('{team2}', opponent.replace(/\s+/g, ''));
    } else {
        const winner = result === 'win' ? myTeam : opponent;
        const loser = result === 'win' ? opponent : myTeam;
        
        title = template.title
            .replace('{winner}', winner)
            .replace('{loser}', loser)
            .replace('{score}', score);
            
        content = template.content
            .replace(/\{winner\}/g, winner)
            .replace(/\{loser\}/g, loser)
            .replace(/\{score\}/g, score);
            
        hashtags = template.hashtags
            .replace('{winner}', winner.replace(/\s+/g, ''))
            .replace('{loser}', loser.replace(/\s+/g, ''));
    }
    
    generateNews(title, content, hashtags);
}

function generateRandomTransferRumor() {
    // 가끔씩 랜덤 이적 루머 생성
    if (Math.random() < 0.05) { // 5% 확률
        const availableTeams = [];
        
        for (let league = 1; league <= 3; league++) {
            gameState.leagueTables[league].forEach(team => {
                if (team.name !== gameState.selectedTeam && superLeagueTeams[team.name]) {
                    availableTeams.push(team.name);
                }
            });
        }
        
        if (availableTeams.length >= 2) {
            const fromTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
            const toTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
            
            if (fromTeam !== toTeam && superLeagueTeams[fromTeam] && superLeagueTeams[fromTeam].players.length > 0) {
                const player = superLeagueTeams[fromTeam].players[Math.floor(Math.random() * superLeagueTeams[fromTeam].players.length)];
                
                generateTransferNews('rumor', player, 0, fromTeam, toTeam);
            }
        }
    }
}

function generateSeasonNews(type) {
    switch(type) {
        case 'seasonStart':
            generateNews(
                `[시즌시작] 새로운 시즌이 시작됩니다!`,
                `새로운 시즌이 시작되었습니다. 모든 팀들이 리그 우승을 향한 열정을 불태우고 있습니다. ${gameState.selectedTeam}은 과연 어떤 성과를 거둘까요?`,
                `#새시즌 #시즌시작 #리그`
            );
            break;
            
        case 'seasonEnd':
            generateNews(
                `[시즌종료] ${gameState.season}시즌이 막을 내렸습니다`,
                `길고 긴 ${gameState.season}시즌이 마침내 끝났습니다. 모든 팀과 선수들의 노고에 박수를 보냅니다. 다음 시즌을 기대해봅시다!`,
                `#시즌종료 #수고 #다음시즌기대`
            );
            break;
            
        case 'promotion':
            generateNews(
                `[승격] ${gameState.selectedTeam}, 상위 리그 승격 확정!`,
                `축하합니다! ${gameState.selectedTeam}이 상위 리그 승격을 확정지었습니다. 팬들의 열렬한 성원에 힘입어 이룬 값진 성과입니다.`,
                `#승격 #축하 #${gameState.selectedTeam.replace(/\s+/g, '')}`
            );
            break;
            
        case 'relegation':
            generateNews(
                `[강등] ${gameState.selectedTeam}, 하위 리그 강등...`,
                `안타까운 소식입니다. ${gameState.selectedTeam}이 하위 리그로 강등되었습니다. 내년에는 더 좋은 결과를 기대해봅시다.`,
                `#강등 #아쉬움 #${gameState.selectedTeam.replace(/\s+/g, '')}`
            );
            break;
    }
}

function generatePlayerMilestoneNews(player, milestone) {
    let title, content;
    
    switch(milestone) {
        case 'rating80':
            title = `[성장] ${player.name}, 능력치 80 돌파!`;
            content = `${gameState.selectedTeam}의 ${player.name} 선수가 능력치 80을 돌파했습니다. ${player.age}세의 ${player.position} 선수는 꾸준한 성장을 보이며 팀의 핵심 선수로 자리잡고 있습니다.`;
            break;
        case 'rating85':
            title = `[엘리트] ${player.name}, 능력치 85 달성!`;
            content = `${player.name}이 능력치 85에 도달하며 엘리트 선수 대열에 합류했습니다. 지속적인 성장을 보이고 있는 ${player.name}의 앞으로의 활약이 더욱 기대됩니다.`;
            break;
        case 'rating90':
            title = `[월드클래스] ${player.name}, 능력치 90 달성!`;
            content = `놀라운 소식입니다! ${player.name}이 능력치 90을 달성하며 월드클래스 선수가 되었습니다. ${gameState.selectedTeam}의 자랑스러운 선수입니다.`;
            break;
    }
    
    generateNews(title, content, `#성장 #마일스톤 #${player.name.replace(/\s+/g, '')} #${gameState.selectedTeam.replace(/\s+/g, '')}`);
}

function loadNews() {
    const newsFeed = document.getElementById('newsFeed');
    
    if (newsHistory.length === 0) {
        newsFeed.innerHTML = '<p>아직 뉴스가 없습니다.</p>';
        return;
    }
    
    newsFeed.innerHTML = '';
    
    newsHistory.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        newsItem.innerHTML = `
            <div class="news-title">${news.title}</div>
            <div class="news-content">${news.content}</div>
            <div class="news-hashtags">${news.hashtags}</div>
            <div class="news-date">${news.date}</div>
        `;
        
        newsFeed.appendChild(newsItem);
    });
}

function generateSponsorNews(sponsorName, contractLength, signingBonus) {
    generateNews(
        `[스폰서십] ${gameState.selectedTeam}, ${sponsorName}과 계약 체결`,
        `${gameState.selectedTeam}이 ${sponsorName}과 ${contractLength}경기 계약을 체결했습니다. 계약금 ${signingBonus}억원이 지급되며, 양측 모두 만족스러운 결과라고 밝혔습니다.`,
        `#스폰서십 #계약체결 #${gameState.selectedTeam.replace(/\s+/g, '')} #${sponsorName.replace(/\s+/g, '')}`
    );
}

function generateTacticNews(newTactic) {
    generateNews(
        `[전술변경] ${gameState.selectedTeam}, ${newTactic} 전술 도입`,
        `${gameState.selectedTeam}이 새로운 전술 ${newTactic}을 도입했다고 발표했습니다. 감독은 '팀에 가장 적합한 전술을 선택했다'며 자신감을 드러냈습니다.`,
        `#전술변경 #${newTactic.replace(/\s+/g, '')} #${gameState.selectedTeam.replace(/\s+/g, '')}`
    );
}

function generateYouthNews(playerName, position, rating) {
    generateNews(
        `[유스승격] ${gameState.selectedTeam} 유스 ${playerName}, 1군 승격`,
        `${gameState.selectedTeam} 유스팀의 ${playerName} 선수가 1군으로 승격했습니다. ${position} 포지션의 유망주로 능력치 ${rating}을 기록하며 미래가 기대되는 선수입니다.`,
        `#유스승격 #유망주 #${playerName.replace(/\s+/g, '')} #${gameState.selectedTeam.replace(/\s+/g, '')}`
    );
}

// 자동 뉴스 생성 (경기마다 실행)
function generateAutomaticNews() {
    generateRandomTransferRumor();
    
    // 기타 랜덤 뉴스들도 여기에 추가 가능
    // 예: 부상 뉴스, 징계 뉴스, 개인 수상 뉴스 등
}

// 뉴스 검색 기능
function searchNews(keyword) {
    return newsHistory.filter(news => 
        news.title.toLowerCase().includes(keyword.toLowerCase()) ||
        news.content.toLowerCase().includes(keyword.toLowerCase()) ||
        news.hashtags.toLowerCase().includes(keyword.toLowerCase())
    );
}

// 뉴스 카테고리별 필터링
function filterNewsByCategory(category) {
    const categoryKeywords = {
        'transfer': ['이적', '영입', '방출', '루머'],
        'match': ['승리', '패배', '무승부', '경기'],
        'growth': ['성장', '능력치', '마일스톤'],
        'management': ['전술', '스폰서', '계약']
    };
    
    const keywords = categoryKeywords[category] || [];
    
    return newsHistory.filter(news => 
        keywords.some(keyword => 
            news.title.includes(keyword) || 
            news.content.includes(keyword) || 
            news.hashtags.includes(keyword)
        )
    );
}

// 뉴스 데이터 내보내기/가져오기
function exportNewsData() {
    return JSON.stringify({
        newsHistory: newsHistory,
        exportDate: new Date().toISOString()
    }, null, 2);
}

function importNewsData(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        newsHistory = data.newsHistory || [];
        return true;
    } catch (error) {
        console.error('News data import failed:', error);
        return false;
    }
}

// 뉴스 통계
function getNewsStatistics() {
    const stats = {
        totalNews: newsHistory.length,
        categories: {
            transfer: filterNewsByCategory('transfer').length,
            match: filterNewsByCategory('match').length,
            growth: filterNewsByCategory('growth').length,
            management: filterNewsByCategory('management').length
        },
        recentNews: newsHistory.slice(0, 10)
    };
    
    return stats;
}

// 실시간 뉴스 피드 업데이트
function updateNewsFeed() {
    if (document.getElementById('sns-tab').classList.contains('active')) {
        loadNews();
    }
}
