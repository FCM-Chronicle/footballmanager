// 게임 데이터
const gameData = {
    selectedTeam: null,
    currentLeague: null,
    teamMoney: 0,
    teamMorale: 50,
    matchesPlayed: 0,
    season: 1,
    squad: new Array(11).fill(null),
    bench: [],
    allPlayers: [],
    transferMarket: [],
    currentSponsor: null,
    sponsorContract: null,
    leagueHistory: [],
    currentTactic: '게겐프레싱',
    matchDay: 1,
    totalMatchDays: 26
};

// 리그 데이터
const leagueData = {
    "1부": {
        teams: [
            { name: "바르셀로나", country: "🇪🇸", motto: "VISCA BARCA", description: "라마시아의 전통과 카탈루냐의 자존심", players: [] },
            { name: "레알 마드리드", country: "🇪🇸", motto: "HALA MADRID", description: "갈락티코 정신과 화려한 공격축구의 대명사", players: [] },
            { name: "맨체스터 시티", country: "🏴", motto: "SUPERBIA IN PROELIA", description: "티키타카의 완성형과 압도적 공격력", players: [] },
            { name: "바이에른 뮌헨", country: "🇩🇪", motto: "MIA SAN MIA", description: "독일 축구의 왕자, 완벽한 조직력", players: [] },
            { name: "파리 생제르맹", country: "🇫🇷", motto: "ICI C'EST PARIS", description: "프랑스 수도의 자존심과 스타 군단", players: [] },
            { name: "리버풀", country: "🏴", motto: "YOU WILL NEVER WALK ALONE", description: "게겐프레싱의 대가, 안필드의 열정", players: [] },
            { name: "아스널", country: "🏴", motto: "VICTORY THROUGH HARMONY", description: "젊은 에너지와 아름다운 축구", players: [] },
            { name: "AC 밀란", country: "🇮🇹", motto: "FORZA MILAN", description: "로쏘네리의 전통과 이탈리아의 명문", players: [] },
            { name: "인터 밀란", country: "🇮🇹", motto: "AMALA", description: "네라주리의 강력한 공격진과 밀라노의 자존심", players: [] },
            { name: "아틀레티코 마드리드", country: "🇪🇸", motto: "LOS COLCHONEROS", description: "빗장수비의 대가, 강철 같은 정신력", players: [] },
            { name: "첼시", country: "🏴", motto: "BLUE IS THE COLOUR", description: "런던 블루스의 새로운 시대와 젊은 재능들", players: [] },
            { name: "도르트문트", country: "🇩🇪", motto: "ECHTE LIEBE", description: "게겐프레싱의 완성형과 독일의 젊은 피", players: [] },
            { name: "나폴리", country: "🇮🇹", motto: "FORZA NAPOLI SEMPRE", description: "남부 이탈리아의 열정과 파르테노페이의 꿈", players: [] },
            { name: "토트넘 홋스퍼", country: "🏴", motto: "TO DARE IS TO DO", description: "북런던의 강호, 공격적인 축구 철학", players: [] }
        ],
        money: 1000
    },
    "2부": {
        teams: [
            { name: "유벤투스", country: "🇮🇹", motto: "FINO ALLA FINE", description: "이탈리아의 전설적인 명문, 승리의 DNA", players: [] },
            { name: "라이프치히", country: "🇩🇪", motto: "MACHT GEMEINSAM", description: "독일의 떠오르는 강호, 혁신적 축구", players: [] },
            { name: "뉴캐슬 유나이티드", country: "🏴", motto: "THE MAGPIES", description: "영국 북동부의 야심찬 도전, 스피드 축구", players: [] },
            { name: "세비야", country: "🇪🇸", motto: "NUNCA TE RINDAS", description: "유로파리그의 제왕, 끈질긴 투지", players: [] },
            { name: "아약스", country: "🇳🇱", motto: "AJAX AMSTERDAM", description: "네덜란드 축구의 자존심, 토탈 풋볼의 원조", players: [] },
            { name: "로마", country: "🇮🇹", motto: "FORZA ROMA", description: "이탈리아 수도의 늑대들, 마법 같은 기술", players: [] },
            { name: "레버쿠젠", country: "🇩🇪", motto: "WERKSELF", description: "젊은 에너지와 창의적인 플레이", players: [] },
            { name: "페예노르트", country: "🇳🇱", motto: "HAND IN HAND", description: "네덜란드의 전통 강호, 단단한 조직력", players: [] },
            { name: "리옹", country: "🇫🇷", motto: "OLYMPIQUE LYONNAIS", description: "프랑스 축구의 명문, 기술적 완성도", players: [] },
            { name: "벤피카", country: "🇵🇹", motto: "E PLURIBUS UNUM", description: "포르투갈의 독수리, 선수 육성의 명가", players: [] },
            { name: "PSV", country: "🇳🇱", motto: "EENDRACHT MAAKT MACHT", description: "네덜란드의 강호, 공격 축구", players: [] },
            { name: "스포르팅 CP", country: "🇵🇹", motto: "SPORTING", description: "포르투갈의 라이온, 젊은 재능의 산실", players: [] },
            { name: "셀틱", country: "🏴", motto: "HAIL HAIL", description: "스코틀랜드의 전통 강호, 열정적인 서포터즈", players: [] },
            { name: "아스톤 빌라", country: "🏴", motto: "PREPARED", description: "영국의 명문 클럽, 클래식한 축구 철학", players: [] }
        ],
        money: 700
    },
    "3부": {
        teams: [
            { name: "FC 서울", country: "🇰🇷", motto: "SEOUL IS RED", description: "한국 축구의 명문, 수도의 자존심", players: [] },
            { name: "전북 현대", country: "🇰🇷", motto: "GREEN WARRIORS", description: "K리그의 강호, 현대적 축구 시스템", players: [] },
            { name: "울산 현대", country: "🇰🇷", motto: "BLUE WHALE", description: "아시아 챔피언의 경험, 강인한 정신력", players: [] },
            { name: "포항 스틸러스", country: "🇰🇷", motto: "STEELERS", description: "한국 축구의 전통, 강철 같은 의지", players: [] },
            { name: "광주 FC", country: "🇰🇷", motto: "GWANGJU FC", description: "호남의 자존심, 끈기 있는 축구", players: [] },
            { name: "마르세유", country: "🇫🇷", motto: "DROIT AU BUT", description: "프랑스 남부의 열정, 지중해의 낭만", players: [] },
            { name: "브라질 연합", country: "🇧🇷", motto: "JOGO BONITO", description: "삼바 축구의 정수, 화려한 개인기", players: [] },
            { name: "아르헨티나 연합", country: "🇦🇷", motto: "CORAZON ARGENTINO", description: "탱고의 열정, 기술적 축구", players: [] },
            { name: "멕시코 연합", country: "🇲🇽", motto: "VIVA MEXICO", description: "중미의 강자, 역동적인 플레이", players: [] },
            { name: "미국 연합", country: "🇺🇸", motto: "STARS & STRIPES", description: "신대륙의 도전, 피지컬 축구", players: [] },
            { name: "알힐랄", country: "🇸🇦", motto: "THE LEADER", description: "사우디의 왕자, 중동 축구의 자존심", players: [] },
            { name: "알나스르", country: "🇸🇦", motto: "GLOBAL VICTORY", description: "글로벌 비전과 야심찬 프로젝트", players: [] },
            { name: "알이티하드", country: "🇸🇦", motto: "FEDERATION", description: "사우디의 강호, 조직적인 축구", players: [] },
            { name: "갈라타사라이", country: "🇹🇷", motto: "CIM BOM BOM", description: "터키의 자존심, 보스포루스의 열정", players: [] }
        ],
        money: 400
    }
};

// 선수 데이터베이스 (기본 선수들만 예시로)
const playerDatabase = {
   

    "아르헨티나 연합": [
        { name: "프랑코 아르마니", position: "GK", country: "아르헨티나", age: 38, rating: 74 },
        { name: "세르히오 로메로", position: "GK", country: "아르헨티나", age: 38, rating: 73 },
        { name: "세바스티안 메사", position: "GK", country: "아르헨티나", age: 25, rating: 72 },
        { name: "엔소 디아스", position: "DF", country: "아르헨티나", age: 29, rating: 76 },
        { name: "루카스 블론델", position: "DF", country: "아르헨티나", age: 28, rating: 75 },
        { name: "마르코스 로호", position: "DF", country: "아르헨티나", age: 35, rating: 74 },
        { name: "파브리시오 부스토스", position: "DF", country: "아르헨티나", age: 29, rating: 76 },
        { name: "니콜라스 발렌티니", position: "DF", country: "아르헨티나", age: 24, rating: 75 },
        { name: "에마누엘 맘마나", position: "DF", country: "아르헨티나", age: 29, rating: 75 },
        { name: "가브리엘 로하스", position: "DF", country: "아르헨티나", age: 28, rating: 74 },
        { name: "레오나르도 시갈리", position: "DF", country: "아르헨티나", age: 38, rating: 70 },
        { name: "아구스틴 팔라베시노", position: "MF", country: "아르헨티나", age: 28, rating: 77 },
        { name: "에세키엘 바르코", position: "MF", country: "아르헨티나", age: 26, rating: 76 },
        { name: "크리스티안 메디나", position: "MF", country: "아르헨티나", age: 23, rating: 74 },
        { name: "에키 페르난데스", position: "MF", country: "아르헨티나", age: 22, rating: 73 },
        { name: "엔소 페레스", position: "MF", country: "아르헨티나", age: 39, rating: 72 },
        { name: "이그나시오 페르난데스", position: "MF", country: "아르헨티나", age: 35, rating: 73 },
        { name: "후안 나르도니", position: "MF", country: "아르헨티나", age: 23, rating: 72 },
        { name: "페데리코 만쿠에요", position: "MF", country: "아르헨티나", age: 36, rating: 71 },
        { name: "미겔 보르하", position: "FW", country: "콜롬비아", age: 32, rating: 76 },
        { name: "에딘손 카바니", position: "FW", country: "우루과이", age: 38, rating: 75 },
        { name: "다리오 베네데토", position: "FW", country: "아르헨티나", age: 35, rating: 74 },
        { name: "후안 페르난도 킨테로", position: "FW", country: "콜롬비아", age: 32, rating: 75 },
        { name: "아담 바레이로", position: "FW", country: "파라과이", age: 29, rating: 73 },
        { name: "파쿤도 콜리디오", position: "FW", country: "아르헨티나", age: 25, rating: 74 }
    ],

    "미국 연합": [
        { name: "리오넬 메시", position: "FW", country: "아르헨티나", age: 38, rating: 88 },
        { name: "루이스 수아레스", position: "FW", country: "우루과이", age: 38, rating: 81 },
        { name: "세르히오 부스케츠", position: "MF", country: "스페인", age: 37, rating: 79 },
        { name: "조르디 알바", position: "DF", country: "스페인", age: 36, rating: 76 },
        { name: "로드리고 데 파울", position: "MF", country: "아르헨티나", age: 31, rating: 83 },
        { name: "드레이크 캘린더", position: "GK", country: "미국", age: 27, rating: 72 },
        { name: "벤자민 크레마스키", position: "MF", country: "미국", age: 20, rating: 69 },
        { name: "니콜라스 프레이레", position: "DF", country: "아르헨티나", age: 31, rating: 74 },
        { name: "로만 첼렌타노", position: "GK", country: "미국", age: 24, rating: 70 },
        { name: "마르텐 파에스", position: "GK", country: "네덜란드", age: 27, rating: 73 },
        { name: "워커 짐머만", position: "DF", country: "미국", age: 32, rating: 74 },
        { name: "맷 미아즈가", position: "DF", country: "미국", age: 30, rating: 73 },
        { name: "마일스 로빈슨", position: "DF", country: "미국", age: 28, rating: 74 },
        { name: "카이 바그너", position: "DF", country: "독일", age: 32, rating: 75 },
        { name: "라이언 홀링스헤드", position: "DF", country: "미국", age: 34, rating: 72 },
        { name: "루시아노 아코스타", position: "MF", country: "아르헨티나", age: 31, rating: 76 },
        { name: "카를레스 길", position: "MF", country: "스페인", age: 32, rating: 75 },
        { name: "하니 무크타르", position: "MF", country: "독일", age: 30, rating: 74 },
        { name: "리키 푸치", position: "MF", country: "스페인", age: 25, rating: 73 },
        { name: "티아고 알마다", position: "MF", country: "아르헨티나", age: 24, rating: 75 },
        { name: "쿠초 에르난데스", position: "FW", country: "콜롬비아", age: 26, rating: 76 },
        { name: "데니스 부앙가", position: "FW", country: "가봉", age: 30, rating: 75 },
        { name: "크리스티안 벤테케", position: "FW", country: "벨기에", age: 34, rating: 76 },
        { name: "로렌초 인시녜", position: "FW", country: "이탈리아", age: 34, rating: 77 },
        { name: "요르고스 야쿠마키스", position: "FW", country: "그리스", age: 30, rating: 74 }
    ],

    "멕시코 연합": [
        { name: "세르히오 라모스", position: "DF", country: "스페인", age: 39, rating: 78 },
        { name: "루이스 말라곤", position: "GK", country: "멕시코", age: 28, rating: 74 },
        { name: "나우엘 구스만", position: "GK", country: "아르헨티나", age: 39, rating: 72 },
        { name: "에스테반 안드라다", position: "GK", country: "아르헨티나", age: 34, rating: 73 },
        { name: "헤수스 가야르도", position: "DF", country: "멕시코", age: 30, rating: 74 },
        { name: "케빈 알바레스", position: "DF", country: "멕시코", age: 26, rating: 73 },
        { name: "이고르 리치노프스키", position: "DF", country: "칠레", age: 31, rating: 75 },
        { name: "에릭 아기레", position: "DF", country: "멕시코", age: 28, rating: 73 },
        { name: "빅토르 구스만", position: "DF", country: "멕시코", age: 30, rating: 74 },
        { name: "카를로스 살세도", position: "DF", country: "멕시코", age: 31, rating: 74 },
        { name: "이스라엘 레예스", position: "DF", country: "멕시코", age: 25, rating: 72 },
        { name: "기도 피사로", position: "MF", country: "아르헨티나", age: 35, rating: 75 },
        { name: "루이스 로모", position: "MF", country: "멕시코", age: 30, rating: 74 },
        { name: "디에고 발데스", position: "MF", country: "칠레", age: 31, rating: 75 },
        { name: "에릭 산체스", position: "MF", country: "멕시코", age: 25, rating: 72 },
        { name: "페르난도 고리아란", position: "MF", country: "우루과이", age: 30, rating: 74 },
        { name: "장 메네세스", position: "MF", country: "칠레", age: 32, rating: 74 },
        { name: "빅토르 구스만", position: "MF", country: "멕시코", age: 30, rating: 74 },
        { name: "알바로 피달고", position: "MF", country: "스페인", age: 28, rating: 73 },
        { name: "헨리 마르틴", position: "FW", country: "멕시코", age: 32, rating: 75 },
        { name: "앙드레 피에르 지냐크", position: "FW", country: "프랑스", age: 39, rating: 73 },
        { name: "기예르모 마르티네스", position: "FW", country: "멕시코", age: 30, rating: 74 },
        { name: "훌리안 키뇨네스", position: "FW", country: "멕시코", age: 28, rating: 73 },
        { name: "니콜라스 이바녜스", position: "FW", country: "아르헨티나", age: 30, rating: 74 }
    ],

    "갈라타사라이": [
        { name: "페르난도 무슬레라", position: "GK", country: "우루과이", age: 39, rating: 74 },
        { name: "이스마일 자콥스", position: "DF", country: "세네갈", age: 25, rating: 76 },
        { name: "에위프 아이든", position: "MF", country: "튀르키예", age: 21, rating: 71 },
        { name: "다빈손 산체스", position: "DF", country: "콜롬비아", age: 29, rating: 78 },
        { name: "롤런드 셜러이", position: "FW", country: "헝가리", age: 28, rating: 77 },
        { name: "케렘 데미르바이", position: "MF", country: "독일", age: 32, rating: 76 },
        { name: "마우로 이카르디", position: "FW", country: "아르헨티나", age: 32, rating: 79 },
        { name: "리로이 사네", position: "MF", country: "독일", age: 29, rating: 82 },
        { name: "유누스 아크귄", position: "MF", country: "튀르키예", age: 25, rating: 74 },
        { name: "데릭 쾬", position: "DF", country: "독일", age: 30, rating: 75 },
        { name: "베르칸 쿠틀루", position: "MF", country: "튀르키예", age: 27, rating: 74 },
        { name: "귀나이 귀벤츠", position: "GK", country: "튀르키예", age: 34, rating: 72 },
        { name: "가브리에우 사라", position: "MF", country: "브라질", age: 26, rating: 76 },
        { name: "아흐메드 쿠투주", position: "FW", country: "튀르키예", age: 25, rating: 74 },
        { name: "칸 아이한", position: "DF", country: "튀르키예", age: 30, rating: 73 },
        { name: "엘리아스 엘러르트", position: "DF", country: "덴마크", age: 22, rating: 73 },
        { name: "카를로스 쿠에스타", position: "DF", country: "콜롬비아", age: 26, rating: 74 },
        { name: "프셰미스와프 프랑코프스키", position: "DF", country: "폴란드", age: 30, rating: 73 },
        { name: "유수프 데미르", position: "MF", country: "오스트리아", age: 22, rating: 72 },
        { name: "루카스 토레이라", position: "MF", country: "우루과이", age: 29, rating: 76 },
        { name: "압둘케림 바르닥치", position: "DF", country: "튀르키예", age: 30, rating: 73 },
        { name: "빅터 오시멘", position: "FW", country: "나이지리아", age: 26, rating: 85 },
        { name: "잔카트 일마즈", position: "GK", country: "튀르키예", age: 20, rating: 68 },
        { name: "바르쉬 알페르 일마즈", position: "MF", country: "튀르키예", age: 25, rating: 72 },
        { name: "바란 데미로글루", position: "MF", country: "튀르키예", age: 20, rating: 70 },
        { name: "알리 예실유르트", position: "DF", country: "튀르키예", age: 20, rating: 68 },
        { name: "알리 투랍 불뷜", position: "DF", country: "튀르키예", age: 20, rating: 68 },
        { name: "알바로 모라타", position: "FW", country: "스페인", age: 32, rating: 78 },
        { name: "함자 아크만", position: "MF", country: "튀르키예", age: 20, rating: 69 },
        { name: "에페 아크만", position: "MF", country: "튀르키예", age: 19, rating: 68 },
        { name: "카짐칸 카라타스", position: "DF", country: "튀르키예", age: 27, rating: 72 },
        { name: "아르다 윈야이", position: "DF", country: "튀르키예", age: 20, rating: 69 },
        { name: "마리오 르미나", position: "MF", country: "가봉", age: 31, rating: 74 }
    ],

    "알 힐랄": [
        { name: "야신 부누", position: "GK", country: "모로코", age: 34, rating: 79 },
        { name: "모하메드 알 오와이스", position: "GK", country: "사우디아라비아", age: 33, rating: 76 },
        { name: "칼리두 쿨리발리", position: "DF", country: "세네갈", age: 34, rating: 81 },
        { name: "알리 알 불라이히", position: "DF", country: "사우디아라비아", age: 35, rating: 74 },
        { name: "칼리파 알 다우사리", position: "DF", country: "사우디아라비아", age: 26, rating: 73 },
        { name: "테오 에르난데스", position: "DF", country: "프랑스", age: 27, rating: 84 },
        { name: "주앙 칸셀루", position: "DF", country: "포르투갈", age: 31, rating: 82 },
        { name: "야세르 알 샤흐라니", position: "DF", country: "사우디아라비아", age: 33, rating: 72 },
        { name: "하산 알 탐박티", position: "DF", country: "사우디아라비아", age: 26, rating: 72 },
        { name: "하마드 알 야미", position: "DF", country: "사우디아라비아", age: 26, rating: 71 },
        { name: "알리 라자미", position: "DF", country: "사우디아라비아", age: 29, rating: 72 },
        { name: "후벵 네베스", position: "MF", country: "포르투갈", age: 28, rating: 83 },
        { name: "세르게이 밀린코비치-사비치", position: "MF", country: "세르비아", age: 30, rating: 82 },
        { name: "모하메드 칸노", position: "MF", country: "사우디아라비아", age: 30, rating: 74 },
        { name: "살렘 알 다우사리", position: "MF", country: "사우디아라비아", age: 33, rating: 73 },
        { name: "무사브 알 주와이르", position: "MF", country: "사우디아라비아", age: 22, rating: 70 },
        { name: "나세르 알 다우사리", position: "MF", country: "사우디아라비아", age: 26, rating: 71 },
        { name: "알렉산다르 미트로비치", position: "FW", country: "세르비아", age: 30, rating: 81 },
        { name: "마우콩", position: "FW", country: "브라질", age: 28, rating: 77 },
        { name: "마르코스 레오나르두", position: "FW", country: "브라질", age: 22, rating: 75 },
        { name: "압둘라 알 함단", position: "FW", country: "사우디아라비아", age: 25, rating: 71 },
        { name: "압데라작 함달라", position: "FW", country: "모로코", age: 34, rating: 74 },
        { name: "카이오 세자르", position: "FW", country: "브라질", age: 21, rating: 72 },
        { name: "모테브 알 하르비", position: "DF", country: "사우디아라비아", age: 25, rating: 70 },
        { name: "모하메드 알 야미", position: "GK", country: "사우디아라비아", age: 27, rating: 69 }
    ],

    "알 이티하드": [
        { name: "카림 벤제마", position: "FW", country: "프랑스", age: 37, rating: 83 },
        { name: "은골로 캉테", position: "MF", country: "프랑스", age: 34, rating: 80 },
        { name: "파비뉴", position: "MF", country: "브라질", age: 31, rating: 79 },
        { name: "루이스 펠리피", position: "DF", country: "이탈리아", age: 28, rating: 77 },
        { name: "아흐메드 헤가지", position: "DF", country: "이집트", age: 34, rating: 73 },
        { name: "로마리뉴", position: "FW", country: "브라질", age: 34, rating: 75 },
        { name: "조타", position: "FW", country: "포르투갈", age: 26, rating: 76 },
        { name: "압데라작 함달라", position: "FW", country: "모로코", age: 34, rating: 74 },
        { name: "마르셀루 그로헤", position: "GK", country: "브라질", age: 38, rating: 71 },
        { name: "압둘라 알 마이유프", position: "GK", country: "사우디아라비아", age: 38, rating: 69 },
        { name: "파와즈 알 카르니", position: "GK", country: "사우디아라비아", age: 33, rating: 68 },
        { name: "아흐메드 샤라힐리", position: "DF", country: "사우디아라비아", age: 30, rating: 71 },
        { name: "무한나드 알 샹키티", position: "DF", country: "사우디아라비아", age: 25, rating: 70 },
        { name: "오마르 하우사위", position: "DF", country: "사우디아라비아", age: 40, rating: 67 },
        { name: "아흐메드 바마수드", position: "DF", country: "사우디아라비아", age: 29, rating: 70 },
        { name: "자카리아 알 하우사위", position: "DF", country: "사우디아라비아", age: 24, rating: 69 },
        { name: "파와즈 알 사구르", position: "DF", country: "사우디아라비아", age: 32, rating: 69 },
        { name: "술탄 파르한", position: "MF", country: "사우디아라비아", age: 28, rating: 71 },
        { name: "아와드 알 나슈리", position: "MF", country: "사우디아라비아", age: 23, rating: 70 },
        { name: "파르한 알 샴라니", position: "MF", country: "사우디아라비아", age: 26, rating: 70 },
        { name: "마르완 알 사하피", position: "MF", country: "사우디아라비아", age: 21, rating: 69 },
        { name: "압둘하미드", position: "MF", country: "사우디아라비아", age: 26, rating: 70 },
        { name: "탈랄 하지", position: "FW", country: "사우디아라비아", age: 17, rating: 66 },
        { name: "하룬 카마라", position: "FW", country: "사우디아라비아", age: 27, rating: 70 },
        { name: "압둘라만 알 아부드", position: "FW", country: "사우디아라비아", age: 30, rating: 71 }
    ],

    "알 나스르": [
        { name: "크리스티아누 호날두", position: "FW", country: "포르투갈", age: 40, rating: 86 },
        { name: "사디오 마네", position: "FW", country: "세네갈", age: 33, rating: 82 },
        { name: "마르셀루 브로조비치", position: "MF", country: "크로아티아", age: 32, rating: 80 },
        { name: "아이메릭 라포르테", position: "DF", country: "스페인", age: 31, rating: 81 },
        { name: "오타비우", position: "MF", country: "포르투갈", age: 30, rating: 78 },
        { name: "안데르송 탈리스카", position: "FW", country: "브라질", age: 31, rating: 78 },
        { name: "알렉스 텔레스", position: "DF", country: "브라질", age: 32, rating: 76 },
        { name: "유세프 엔네시리", position: "FW", country: "모로코", age: 28, rating: 77 },
        { name: "다비드 오스피나", position: "GK", country: "콜롬비아", age: 36, rating: 74 },
        { name: "나와프 알 아키디", position: "GK", country: "사우디아라비아", age: 25, rating: 70 },
        { name: "술탄 알 간남", position: "DF", country: "사우디아라비아", age: 31, rating: 72 },
        { name: "압둘라 알 암리", position: "DF", country: "사우디아라비아", age: 28, rating: 71 },
        { name: "압둘라흐만 가리브", position: "FW", country: "사우디아라비아", age: 28, rating: 72 },
        { name: "압둘마지드 알 술라이힘", position: "MF", country: "사우디아라비아", age: 31, rating: 71 },
        { name: "사미 알 나지", position: "MF", country: "사우디아라비아", age: 28, rating: 71 },
        { name: "알리 알 하산", position: "MF", country: "사우디아라비아", age: 28, rating: 71 },
        { name: "아이만 야히아", position: "MF", country: "사우디아라비아", age: 24, rating: 70 },
        { name: "모하메드 마란", position: "FW", country: "사우디아라비아", age: 24, rating: 70 },
        { name: "압둘아지즈 알 알리와", position: "FW", country: "사우디아라비아", age: 25, rating: 70 },
        { name: "칼리드 알 간남", position: "FW", country: "사우디아라비아", age: 24, rating: 69 },
        { name: "무함마드 알 파틸", position: "DF", country: "사우디아라비아", age: 33, rating: 70 },
        { name: "압둘레라 알 암리", position: "DF", country: "사우디아라비아", age: 28, rating: 70 },
        { name: "나와프 알 부샬", position: "DF", country: "사우디아라비아", age: 25, rating: 69 },
        { name: "압둘라히 마두", position: "DF", country: "사우디아라비아", age: 32, rating: 69 },
        { name: "모하메드 카심", position: "DF", country: "사우디아라비아", age: 30, rating: 69 }
    ],

    "브라질 연합": [
        { name: "베베르통", position: "GK", country: "브라질", age: 37, rating: 74 },
        { name: "카시우", position: "GK", country: "브라질", age: 38, rating: 72 },
        { name: "존 빅토르", position: "GK", country: "브라질", age: 29, rating: 75 },
        { name: "구스타부 고메스", position: "DF", country: "파라과이", age: 32, rating: 80 },
        { name: "무리루 세르케이라", position: "DF", country: "브라질", age: 28, rating: 76 },
        { name: "레오 오르티스", position: "DF", country: "브라질", age: 29, rating: 77 },
        { name: "기예르메 아라나", position: "DF", country: "브라질", age: 28, rating: 78 },
        { name: "마르사우", position: "DF", country: "브라질", age: 36, rating: 73 },
        { name: "페드루 엔히키", position: "DF", country: "브라질", age: 30, rating: 76 },
        { name: "파브리시우 브루누", position: "DF", country: "브라질", age: 29, rating: 75 },
        { name: "아드리엘송", position: "DF", country: "브라질", age: 27, rating: 74 },
        { name: "하파에우 베이가", position: "MF", country: "브라질", age: 30, rating: 79 },
        { name: "히오르히안 데 아라스카에타", position: "MF", country: "우루과이", age: 31, rating: 82 },
        { name: "제르송", position: "MF", country: "브라질", age: 28, rating: 76 },
        { name: "안드레", position: "MF", country: "브라질", age: 24, rating: 77 },
        { name: "에베르통 히베이루", position: "MF", country: "브라질", age: 36, rating: 74 },
        { name: "알란 파트릭", position: "MF", country: "브라질", age: 34, rating: 75 },
        { name: "제 하파에우", position: "MF", country: "브라질", age: 32, rating: 76 },
        { name: "이고르 코로나두", position: "MF", country: "브라질", age: 32, rating: 75 },
        { name: "헐크", position: "FW", country: "브라질", age: 39, rating: 79 },
        { name: "치키뉴 소아레스", position: "FW", country: "브라질", age: 34, rating: 76 },
        { name: "헤르만 카노", position: "FW", country: "아르헨티나", age: 37, rating: 75 },
        { name: "가브리에우 바르보사", position: "FW", country: "브라질", age: 28, rating: 80 },
        { name: "페드루", position: "FW", country: "브라질", age: 28, rating: 78 },
        { name: "예페르손 소텔도", position: "FW", country: "베네수엘라", age: 28, rating: 77 }
    ],

    "전북 현대": [
        { name: "김정훈", position: "GK", country: "대한민국", age: 24, rating: 72 },
        { name: "김영빈", position: "DF", country: "대한민국", age: 33, rating: 74 },
        { name: "최우진", position: "DF", country: "대한민국", age: 21, rating: 69 },
        { name: "박진섭", position: "MF", country: "대한민국", age: 29, rating: 76 },
        { name: "감보아", position: "MF", country: "브라질", age: 28, rating: 78 },
        { name: "한국영", position: "MF", country: "대한민국", age: 35, rating: 73 },
        { name: "티아고", position: "FW", country: "브라질", age: 31, rating: 79 },
        { name: "송민규", position: "FW", country: "대한민국", age: 25, rating: 74 },
        { name: "이승우", position: "MF", country: "대한민국", age: 27, rating: 80 },
        { name: "강상윤", position: "MF", country: "대한민국", age: 21, rating: 71 },
        { name: "전진우", position: "MF", country: "대한민국", age: 25, rating: 73 },
        { name: "성진영", position: "FW", country: "대한민국", age: 22, rating: 72 },
        { name: "박재용", position: "FW", country: "대한민국", age: 25, rating: 73 },
        { name: "진태호", position: "MF", country: "대한민국", age: 19, rating: 68 },
        { name: "이준호", position: "DF", country: "대한민국", age: 22, rating: 70 },
        { name: "츄마시", position: "FW", country: "가나", age: 31, rating: 74 },
        { name: "권창훈", position: "MF", country: "대한민국", age: 31, rating: 75 },
        { name: "김태환", position: "DF", country: "대한민국", age: 36, rating: 71 },
        { name: "박규민", position: "DF", country: "대한민국", age: 24, rating: 70 },
        { name: "최철순", position: "DF", country: "대한민국", age: 38, rating: 68 },
        { name: "홍정호", position: "DF", country: "대한민국", age: 35, rating: 72 },
        { name: "이규동", position: "MF", country: "대한민국", age: 21, rating: 69 },
        { name: "이영재", position: "MF", country: "대한민국", age: 30, rating: 74 },
        { name: "송범근", position: "GK", country: "대한민국", age: 27, rating: 71 },
        { name: "엄승민", position: "FW", country: "대한민국", age: 22, rating: 70 },
        { name: "장남웅", position: "MF", country: "대한민국", age: 21, rating: 68 },
        { name: "강현종", position: "FW", country: "대한민국", age: 21, rating: 69 },
        { name: "윤주영", position: "DF", country: "대한민국", age: 20, rating: 67 },
        { name: "황정구", position: "DF", country: "대한민국", age: 20, rating: 66 },
        { name: "이한결", position: "GK", country: "대한민국", age: 18, rating: 65 },
        { name: "한석진", position: "MF", country: "대한민국", age: 17, rating: 64 },
        { name: "김수형", position: "DF", country: "대한민국", age: 18, rating: 65 },
        { name: "서정혁", position: "DF", country: "대한민국", age: 19, rating: 66 },
        { name: "이재준", position: "DF", country: "대한민국", age: 18, rating: 65 },
        { name: "황승준", position: "DF", country: "대한민국", age: 19, rating: 66 },
        { name: "김민재", position: "MF", country: "대한민국", age: 21, rating: 68 },
        { name: "김태현", position: "DF", country: "대한민국", age: 28, rating: 73 },
        { name: "전지완", position: "GK", country: "대한민국", age: 21, rating: 67 },
        { name: "윤현석", position: "MF", country: "대한민국", age: 21, rating: 68 },
        { name: "정상운", position: "FW", country: "대한민국", age: 22, rating: 69 },
        { name: "공시현", position: "GK", country: "대한민국", age: 20, rating: 66 },
        { name: "연제운", position: "DF", country: "대한민국", age: 30, rating: 72 },
        { name: "콤파뇨", position: "FW", country: "이탈리아", age: 29, rating: 78 },
        { name: "김진규", position: "MF", country: "대한민국", age: 28, rating: 74 },
        { name: "임준휘", position: "FW", country: "대한민국", age: 20, rating: 67 },
        { name: "김창훈", position: "FW", country: "대한민국", age: 20, rating: 68 }
    ],

    "울산 현대": [
        { name: "조현택", position: "DF", country: "대한민국", age: 24, rating: 72 },
        { name: "강민우", position: "DF", country: "대한민국", age: 19, rating: 67 },
        { name: "서명관", position: "DF", country: "대한민국", age: 22, rating: 70 },
        { name: "정우영", position: "MF", country: "대한민국", age: 35, rating: 74 },
        { name: "보야니치", position: "MF", country: "스웨덴", age: 30, rating: 77 },
        { name: "고승범", position: "MF", country: "대한민국", age: 31, rating: 75 },
        { name: "말컹", position: "FW", country: "브라질", age: 31, rating: 78 },
        { name: "엄원상", position: "MF", country: "대한민국", age: 26, rating: 73 },
        { name: "강상우", position: "DF", country: "대한민국", age: 31, rating: 74 },
        { name: "이진현", position: "MF", country: "대한민국", age: 27, rating: 73 },
        { name: "정승현", position: "DF", country: "대한민국", age: 31, rating: 75 },
        { name: "이희균", position: "MF", country: "대한민국", age: 27, rating: 73 },
        { name: "루빅손", position: "MF", country: "스웨덴", age: 31, rating: 76 },
        { name: "허율", position: "FW", country: "대한민국", age: 24, rating: 72 },
        { name: "김영권", position: "DF", country: "대한민국", age: 35, rating: 73 },
        { name: "조현우", position: "GK", country: "대한민국", age: 33, rating: 76 },
        { name: "김민혁", position: "MF", country: "대한민국", age: 32, rating: 74 },
        { name: "문정인", position: "GK", country: "대한민국", age: 27, rating: 71 },
        { name: "윤종규", position: "DF", country: "대한민국", age: 26, rating: 72 },
        { name: "박민서", position: "DF", country: "대한민국", age: 24, rating: 71 },
        { name: "이청용", position: "MF", country: "대한민국", age: 37, rating: 72 },
        { name: "이재익", position: "DF", country: "대한민국", age: 26, rating: 72 },
        { name: "윤재석", position: "MF", country: "대한민국", age: 21, rating: 69 },
        { name: "류성민", position: "GK", country: "대한민국", age: 21, rating: 67 },
        { name: "라카바", position: "MF", country: "베네수엘라", age: 22, rating: 73 },
        { name: "트로야크", position: "DF", country: "폴란드", age: 31, rating: 74 },
        { name: "백인우", position: "MF", country: "대한민국", age: 18, rating: 66 },
        { name: "최석현", position: "DF", country: "대한민국", age: 22, rating: 69 },
        { name: "에릭", position: "MF", country: "브라질", age: 28, rating: 75 }
    ],

    "포항 스틸러스": [
        { name: "윤평국", position: "GK", country: "대한민국", age: 33, rating: 74 },
        { name: "어정원", position: "DF", country: "대한민국", age: 26, rating: 72 },
        { name: "이동희", position: "DF", country: "대한민국", age: 25, rating: 71 },
        { name: "전민광", position: "DF", country: "대한민국", age: 32, rating: 73 },
        { name: "아스프로", position: "DF", country: "오스트레일리아", age: 29, rating: 75 },
        { name: "김종우", position: "MF", country: "대한민국", age: 31, rating: 74 },
        { name: "김인성", position: "FW", country: "대한민국", age: 35, rating: 73 },
        { name: "오베르단", position: "MF", country: "브라질", age: 30, rating: 76 },
        { name: "조르지", position: "FW", country: "브라질", age: 26, rating: 77 },
        { name: "백성동", position: "FW", country: "대한민국", age: 33, rating: 72 },
        { name: "주닝요", position: "FW", country: "브라질", age: 27, rating: 76 },
        { name: "조재훈", position: "FW", country: "대한민국", age: 22, rating: 70 },
        { name: "강민준", position: "DF", country: "대한민국", age: 22, rating: 69 },
        { name: "박승욱", position: "DF", country: "대한민국", age: 28, rating: 72 },
        { name: "이규민", position: "FW", country: "대한민국", age: 19, rating: 68 },
        { name: "신광훈", position: "DF", country: "대한민국", age: 38, rating: 69 },
        { name: "강현제", position: "FW", country: "대한민국", age: 22, rating: 69 },
        { name: "이호재", position: "FW", country: "대한민국", age: 24, rating: 70 },
        { name: "안재준", position: "FW", country: "대한민국", age: 24, rating: 70 },
        { name: "황인재", position: "GK", country: "대한민국", age: 31, rating: 72 },
        { name: "홍지우", position: "MF", country: "대한민국", age: 22, rating: 69 },
        { name: "이동협", position: "DF", country: "대한민국", age: 22, rating: 68 },
        { name: "한현서", position: "DF", country: "대한민국", age: 21, rating: 67 },
        { name: "차준영", position: "DF", country: "대한민국", age: 21, rating: 67 },
        { name: "박수빈", position: "FW", country: "대한민국", age: 19, rating: 66 },
        { name: "백승원", position: "FW", country: "대한민국", age: 19, rating: 66 },
        { name: "조성욱", position: "DF", country: "대한민국", age: 30, rating: 71 },
        { name: "홍윤상", position: "FW", country: "대한민국", age: 23, rating: 69 },
        { name: "기성용", position: "MF", country: "대한민국", age: 36, rating: 72 },
        { name: "이헌재", position: "FW", country: "대한민국", age: 19, rating: 66 },
        { name: "이창우", position: "DF", country: "대한민국", age: 19, rating: 66 },
        { name: "황서웅", position: "MF", country: "대한민국", age: 20, rating: 67 },
        { name: "완델손", position: "DF", country: "브라질", age: 36, rating: 70 },
        { name: "홍성민", position: "GK", country: "대한민국", age: 18, rating: 64 },
        { name: "김동진", position: "MF", country: "대한민국", age: 22, rating: 68 },
        { name: "김동민", position: "MF", country: "대한민국", age: 20, rating: 67 },
        { name: "권능", position: "GK", country: "대한민국", age: 19, rating: 65 },
        { name: "조상혁", position: "FW", country: "대한민국", age: 21, rating: 67 }
    ],

    "광주 FC": [
        { name: "김경민", position: "GK", country: "대한민국", age: 33, rating: 73 },
        { name: "조성권", position: "DF", country: "대한민국", age: 24, rating: 70 },
        { name: "이민기", position: "DF", country: "대한민국", age: 32, rating: 72 },
        { name: "변준수", position: "DF", country: "대한민국", age: 23, rating: 69 },
        { name: "안영규", position: "DF", country: "대한민국", age: 35, rating: 70 },
        { name: "아사니", position: "FW", country: "북마케도니아", age: 27, rating: 78 },
        { name: "이강현", position: "MF", country: "대한민국", age: 27, rating: 73 },
        { name: "최경록", position: "MF", country: "대한민국", age: 30, rating: 73 },
        { name: "가브리엘", position: "FW", country: "브라질", age: 23, rating: 74 },
        { name: "노희동", position: "GK", country: "대한민국", age: 23, rating: 68 },
        { name: "박정인", position: "FW", country: "대한민국", age: 24, rating: 71 },
        { name: "유제호", position: "MF", country: "대한민국", age: 24, rating: 70 },
        { name: "정지훈", position: "MF", country: "대한민국", age: 21, rating: 68 },
        { name: "헤이스", position: "FW", country: "브라질", age: 32, rating: 74 },
        { name: "박인혁", position: "FW", country: "대한민국", age: 29, rating: 72 },
        { name: "진시우", position: "DF", country: "대한민국", age: 22, rating: 68 },
        { name: "강희수", position: "MF", country: "대한민국", age: 22, rating: 68 },
        { name: "김한길", position: "MF", country: "대한민국", age: 30, rating: 72 },
        { name: "김진호", position: "DF", country: "대한민국", age: 25, rating: 70 },
        { name: "권성윤", position: "MF", country: "대한민국", age: 24, rating: 69 },
        { name: "곽성훈", position: "DF", country: "대한민국", age: 19, rating: 66 },
        { name: "안혁주", position: "MF", country: "대한민국", age: 20, rating: 67 },
        { name: "김동화", position: "GK", country: "대한민국", age: 22, rating: 67 },
        { name: "민상기", position: "DF", country: "대한민국", age: 33, rating: 71 },
        { name: "신창무", position: "FW", country: "대한민국", age: 32, rating: 71 },
        { name: "김태준", position: "GK", country: "대한민국", age: 24, rating: 68 },
        { name: "김윤호", position: "FW", country: "대한민국", age: 18, rating: 65 },
        { name: "하승운", position: "FW", country: "대한민국", age: 27, rating: 72 },
        { name: "오후성", position: "MF", country: "대한민국", age: 25, rating: 70 },
        { name: "주세종", position: "MF", country: "대한민국", age: 34, rating: 71 },
        { name: "문민서", position: "MF", country: "대한민국", age: 21, rating: 67 },
        { name: "심상민", position: "DF", country: "대한민국", age: 32, rating: 70 },
        { name: "홍용준", position: "MF", country: "대한민국", age: 22, rating: 68 },
        { name: "박태준", position: "MF", country: "대한민국", age: 26, rating: 70 },
        { name: "두현석", position: "MF", country: "대한민국", age: 29, rating: 72 }
    ],

    "리옹": [
        { name: "루카스 페리", position: "GK", country: "브라질", age: 27, rating: 76 },
        { name: "니콜라스 탈리아피코", position: "DF", country: "아르헨티나", age: 32, rating: 78 },
        { name: "폴 아쿠오쿠", position: "MF", country: "코트디부아르", age: 27, rating: 76 },
        { name: "조르당 베레투", position: "MF", country: "프랑스", age: 32, rating: 75 },
        { name: "코랑탱 톨리소", position: "MF", country: "프랑스", age: 30, rating: 79 },
        { name: "알렉상드르 라카제트", position: "FW", country: "프랑스", age: 34, rating: 81 },
        { name: "말릭 포파나", position: "MF", country: "벨기에", age: 20, rating: 74 },
        { name: "태너 테스만", position: "MF", country: "미국", age: 23, rating: 75 },
        { name: "아브네르 비니시우스", position: "DF", country: "브라질", age: 25, rating: 77 },
        { name: "라얀 셰르키", position: "MF", country: "프랑스", age: 21, rating: 87 },
        { name: "무사 니아카테", position: "DF", country: "세네갈", age: 29, rating: 76 },
        { name: "샤엘 쿰베디", position: "DF", country: "프랑스", age: 20, rating: 73 },
        { name: "클린톤 마타", position: "DF", country: "앙골라", age: 32, rating: 74 },
        { name: "티아고 알마다", position: "MF", country: "아르헨티나", age: 24, rating: 75 },
        { name: "와흐메드 오마리", position: "DF", country: "코모로스", age: 25, rating: 74 },
        { name: "네마냐 마티치", position: "MF", country: "세르비아", age: 37, rating: 75 },
        { name: "마하마두 디아와라", position: "MF", country: "프랑스", age: 20, rating: 71 },
        { name: "어니스트 누아마", position: "FW", country: "가나", age: 21, rating: 72 },
        { name: "레미 데캉", position: "GK", country: "프랑스", age: 29, rating: 72 },
        { name: "두예 찰레타차르", position: "DF", country: "크로아티아", age: 28, rating: 75 },
        { name: "조르지 미카우타제", position: "FW", country: "조지아", age: 24, rating: 76 },
        { name: "에인슬리 메이틀랜드나일스", position: "DF", country: "잉글랜드", age: 27, rating: 74 }
    ],

    "아스톤 빌라": [
        { name: "매티 캐시", position: "DF", country: "폴란드", age: 27, rating: 83 },
        { name: "악셀 디사시", position: "DF", country: "프랑스", age: 27, rating: 77 },
        { name: "에즈리 콘사", position: "DF", country: "잉글랜드", age: 27, rating: 75 },
        { name: "타이론 밍스", position: "DF", country: "잉글랜드", age: 31, rating: 72 },
        { name: "로스 바클리", position: "MF", country: "잉글랜드", age: 31, rating: 75 },
        { name: "존 맥긴", position: "MF", country: "스코틀랜드", age: 30, rating: 82 },
        { name: "유리 틸레만스", position: "MF", country: "벨기에", age: 28, rating: 88 },
        { name: "올리 왓킨스", position: "FW", country: "잉글랜드", age: 29, rating: 87 },
        { name: "뤼카 디뉴", position: "DF", country: "프랑스", age: 32, rating: 71 },
        { name: "파우 토레스", position: "DF", country: "스페인", age: 28, rating: 85 },
        { name: "안드레스 가르시아", position: "DF", country: "스페인", age: 22, rating: 68 },
        { name: "도니얼 말런", position: "FW", country: "네덜란드", age: 26, rating: 83 },
        { name: "마르코 아센시오", position: "FW", country: "스페인", age: 29, rating: 79 },
        { name: "이안 마트센", position: "DF", country: "네덜란드", age: 23, rating: 82 },
        { name: "에밀리아노 마르티네스", position: "GK", country: "아르헨티나", age: 32, rating: 85 },
        { name: "아마두 오나나", position: "MF", country: "벨기에", age: 23, rating: 84 },
        { name: "로빈 올센", position: "GK", country: "스웨덴", age: 35, rating: 69 },
        { name: "라마어 보하르더", position: "DF", country: "네덜란드", age: 21, rating: 71 },
        { name: "모건 로저스", position: "FW", country: "잉글랜드", age: 23, rating: 86 },
        { name: "코트니 호즈", position: "DF", country: "잉글랜드", age: 30, rating: 71 },
        { name: "레온 베일리", position: "FW", country: "자메이카", age: 27, rating: 82 },
        { name: "제이콥 램지", position: "MF", country: "잉글랜드", age: 24, rating: 79 },
        { name: "부바카르 카마라", position: "MF", country: "프랑스", age: 25, rating: 82 },
        { name: "올리비에르 지크", position: "GK", country: "폴란드", age: 21, rating: 67 }
    ],

    "라이프치히": [
        { name: "페테르 굴라치", position: "GK", country: "헝가리", age: 35, rating: 81 },
        { name: "뤼츠하럴 헤이르트라위다", position: "DF", country: "네덜란드", age: 25, rating: 83 },
        { name: "빌리 오르반", position: "DF", country: "헝가리", age: 32, rating: 83 },
        { name: "엘 샤데유 비치아부", position: "DF", country: "프랑스", age: 20, rating: 77 },
        { name: "안토니오 누사", position: "MF", country: "노르웨이", age: 20, rating: 84 },
        { name: "아마두 아이다라", position: "MF", country: "말리", age: 27, rating: 81 },
        { name: "유수프 포울센", position: "FW", country: "덴마크", age: 31, rating: 73 },
        { name: "사비 시몬스", position: "MF", country: "네덜란드", age: 22, rating: 90 },
        { name: "로이스 오펜다", position: "FW", country: "벨기에", age: 25, rating: 87 },
        { name: "니콜라스 자이발트", position: "MF", country: "오스트리아", age: 24, rating: 80 },
        { name: "크리스토프 바움가르트너", position: "MF", country: "오스트리아", age: 26, rating: 78 },
        { name: "루카스 클로스터만", position: "DF", country: "독일", age: 29, rating: 81 },
        { name: "리들레 바쿠", position: "DF", country: "독일", age: 27, rating: 78 },
        { name: "아르투르 베르미렌", position: "MF", country: "벨기에", age: 20, rating: 79 },
        { name: "아산 웨드라오고", position: "MF", country: "독일", age: 19, rating: 70 },
        { name: "코스타 네델코비치", position: "DF", country: "세르비아", age: 20, rating: 67 },
        { name: "다비트 라움", position: "DF", country: "독일", age: 27, rating: 84 },
        { name: "카스텔로 뤼케바", position: "DF", country: "프랑스", age: 22, rating: 76 },
        { name: "크사버 슐라거", position: "MF", country: "오스트리아", age: 27, rating: 82 },
        { name: "마르턴 판더보르트", position: "GK", country: "벨기에", age: 23, rating: 81 },
        { name: "베냐민 셰슈코", position: "FW", country: "슬로베니아", age: 22, rating: 87 },
        { name: "베냐민 헨릭스", position: "DF", country: "독일", age: 28, rating: 76 },
        { name: "케빈 캄플", position: "MF", country: "슬로베니아", age: 34, rating: 69 }
    ],

    "뉴캐슬 유나이티드": [
        { name: "마르틴 두브라프카", position: "GK", country: "슬로바키아", age: 36, rating: 71 },
        { name: "키어런 트리피어", position: "DF", country: "잉글랜드", age: 34, rating: 82 },
        { name: "스벤 보트만", position: "DF", country: "네덜란드", age: 25, rating: 83 },
        { name: "파비안 셰어", position: "DF", country: "스위스", age: 33, rating: 84 },
        { name: "자말 라셀스", position: "DF", country: "잉글랜드", age: 31, rating: 75 },
        { name: "조엘린통", position: "MF", country: "브라질", age: 28, rating: 84 },
        { name: "산드로 토날리", position: "MF", country: "이탈리아", age: 25, rating: 89 },
        { name: "칼럼 윌슨", position: "FW", country: "잉글랜드", age: 33, rating: 74 },
        { name: "앤서니 고든", position: "FW", country: "잉글랜드", age: 24, rating: 87 },
        { name: "하비 반스", position: "FW", country: "잉글랜드", age: 27, rating: 81 },
        { name: "맷 타겟", position: "DF", country: "잉글랜드", age: 29, rating: 74 },
        { name: "알렉산데르 이사크", position: "FW", country: "스웨덴", age: 25, rating: 92 },
        { name: "에밀 크라프트", position: "DF", country: "스웨덴", age: 31, rating: 71 },
        { name: "윌리엄 오술라", position: "FW", country: "덴마크", age: 21, rating: 72 },
        { name: "오디세아스 블라호디모스", position: "GK", country: "그리스", age: 31, rating: 72 },
        { name: "루이스 홀", position: "DF", country: "잉글랜드", age: 20, rating: 84 },
        { name: "티노 리브라멘토", position: "DF", country: "잉글랜드", age: 22, rating: 85 },
        { name: "닉 포프", position: "GK", country: "잉글랜드", age: 33, rating: 81 },
        { name: "제이콥 머피", position: "FW", country: "잉글랜드", age: 30, rating: 84 },
        { name: "존 러디", position: "GK", country: "잉글랜드", age: 38, rating: 66 },
        { name: "조 윌록", position: "MF", country: "잉글랜드", age: 25, rating: 73 },
        { name: "마크 길레스피", position: "GK", country: "스코틀랜드", age: 33, rating: 70 },
        { name: "댄 번", position: "DF", country: "잉글랜드", age: 33, rating: 83 },
        { name: "션 롱스태프", position: "MF", country: "잉글랜드", age: 27, rating: 77 },
        { name: "브루누 기마랑이스", position: "MF", country: "브라질", age: 27, rating: 90 },
        { name: "루이스 마일리", position: "MF", country: "잉글랜드", age: 19, rating: 72 }
    ],

    "세비야": [
        { name: "알바로 페르난데스", position: "GK", country: "스페인", age: 27, rating: 73 },
        { name: "아드리아 페드로사", position: "DF", country: "스페인", age: 27, rating: 76 },
        { name: "키케 살라스", position: "DF", country: "스페인", age: 23, rating: 79 },
        { name: "루벤 바르가스", position: "FW", country: "스위스", age: 26, rating: 78 },
        { name: "네마냐 구데이", position: "MF", country: "세르비아", age: 33, rating: 78 },
        { name: "이삭 로메로", position: "FW", country: "스페인", age: 25, rating: 74 },
        { name: "도디 루케바키오", position: "FW", country: "벨기에", age: 27, rating: 84 },
        { name: "외르얀 뉠란", position: "GK", country: "노르웨이", age: 34, rating: 75 },
        { name: "페케", position: "FW", country: "스페인", age: 24, rating: 74 },
        { name: "아코르 아담스", position: "FW", country: "나이지리아", age: 30, rating: 71 },
        { name: "뤼시앵 아구메", position: "MF", country: "프랑스", age: 23, rating: 83 },
        { name: "지브릴 소우", position: "MF", country: "스위스", age: 28, rating: 82 },
        { name: "치데라 에주케", position: "FW", country: "나이지리아", age: 27, rating: 72 },
        { name: "로익 바데", position: "DF", country: "프랑스", age: 25, rating: 83 },
        { name: "마르캉", position: "DF", country: "브라질", age: 29, rating: 75 },
        { name: "탕기 니안주", position: "DF", country: "프랑스", age: 23, rating: 79 },
        { name: "후안루 산체스", position: "DF", country: "스페인", age: 21, rating: 76 },
        { name: "스타니스 이덤보 무잠보", position: "FW", country: "벨기에", age: 20, rating: 70 },
        { name: "알베르토 플로레스", position: "GK", country: "스페인", age: 28, rating: 68 },
        { name: "호세 앙헬 카르모나", position: "DF", country: "스페인", age: 23, rating: 82 },
        { name: "켈레치 이헤나초", position: "FW", country: "나이지리아", age: 28, rating: 74 },
        { name: "김민수", position: "MF", country: "대한민국", age: 19, rating: 68 }
    ],

    "아약스": [
        { name: "비테슬라프 야로스", position: "GK", country: "체코", age: 24, rating: 67 },
        { name: "루카스 호자", position: "DF", country: "브라질", age: 25, rating: 73 },
        { name: "안톤 고에이", position: "DF", country: "덴마크", age: 22, rating: 74 },
        { name: "조렐 하토", position: "DF", country: "네덜란드", age: 19, rating: 84 },
        { name: "오언 베인달", position: "DF", country: "네덜란드", age: 25, rating: 71 },
        { name: "라울 모로", position: "FW", country: "스페인", age: 22, rating: 72 },
        { name: "케네스 테일러", position: "MF", country: "네덜란드", age: 23, rating: 82 },
        { name: "브라이언 브로비", position: "FW", country: "네덜란드", age: 23, rating: 85 },
        { name: "오스카르 글루크", position: "FW", country: "이스라엘", age: 21, rating: 70 },
        { name: "미카 고츠", position: "FW", country: "벨기에", age: 20, rating: 68 },
        { name: "요에리 헤르켄스", position: "GK", country: "네덜란드", age: 19, rating: 66 },
        { name: "아흐메트잔 카플란", position: "DF", country: "튀르키예", age: 22, rating: 71 },
        { name: "유리 바스", position: "DF", country: "네덜란드", age: 22, rating: 76 },
        { name: "올리베르 에드바르센", position: "FW", country: "노르웨이", age: 26, rating: 77 },
        { name: "데이비 클라선", position: "MF", country: "네덜란드", age: 32, rating: 78 },
        { name: "베르트랑 트라오레", position: "FW", country: "부르키나파소", age: 29, rating: 73 },
        { name: "브랑코 판 덴 보먼", position: "MF", country: "네덜란드", age: 30, rating: 74 },
        { name: "렘코 파스베이르", position: "GK", country: "네덜란드", age: 41, rating: 75 },
        { name: "스티븐 베르하위스", position: "FW", country: "네덜란드", age: 33, rating: 83 },
        { name: "바웃 베호르스트", position: "FW", country: "네덜란드", age: 32, rating: 74 },
        { name: "키안 피츠짐", position: "MF", country: "네덜란드", age: 22, rating: 70 },
        { name: "요르디 무키오", position: "MF", country: "벨기에", age: 17, rating: 66 },
        { name: "디스 얀서", position: "DF", country: "네덜란드", age: 19, rating: 67 },
        { name: "요시프 슈탈로", position: "DF", country: "크로아티아", age: 25, rating: 81 },
        { name: "율리안 브란데스", position: "MF", country: "독일", age: 21, rating: 70 },
        { name: "유리 레헤이르", position: "MF", country: "네덜란드", age: 21, rating: 72 },
        { name: "얀 파베르스키", position: "FW", country: "폴란드", age: 19, rating: 68 },
        { name: "찰리 셋퍼드", position: "GK", country: "잉글랜드", age: 21, rating: 74 },
        { name: "폴 리버슨", position: "GK", country: "네덜란드", age: 20, rating: 68 },
        { name: "라얀 부니다", position: "FW", country: "벨기에", age: 19, rating: 67 },
        { name: "데이빗 칼로코", position: "FW", country: "네덜란드", age: 20, rating: 68 },
        { name: "돈안젤로 코나두", position: "FW", country: "네덜란드", age: 19, rating: 68 },
        { name: "숀 스퇴르", position: "MF", country: "네덜란드", age: 17, rating: 66 },
        { name: "아론 바우만", position: "DF", country: "네덜란드", age: 17, rating: 65 },
        { name: "추바 악폼", position: "FW", country: "잉글랜드", age: 29, rating: 73 },
        { name: "시베르트 만스베르크", position: "MF", country: "노르웨이", age: 23, rating: 75 },
        { name: "트리스탄 호이어", position: "DF", country: "네덜란드", age: 20, rating: 67 }
    ],

    "AS 로마": [
        { name: "데빈 렌스", position: "DF", country: "네덜란드", age: 22, rating: 75 },
        { name: "앙헬리뇨", position: "DF", country: "스페인", age: 28, rating: 82 },
        { name: "브라얀 크리스탄테", position: "MF", country: "이탈리아", age: 30, rating: 81 },
        { name: "에방 은디카", position: "DF", country: "프랑스", age: 25, rating: 84 },
        { name: "로렌초 펠레그리니", position: "MF", country: "이탈리아", age: 29, rating: 83 },
        { name: "아르템 도우비크", position: "FW", country: "우크라이나", age: 28, rating: 85 },
        { name: "사우드 압둘하미드", position: "DF", country: "사우디아라비아", age: 26, rating: 74 },
        { name: "에반 퍼거슨", position: "FW", country: "아일랜드", age: 20, rating: 78 },
        { name: "마라쉬 쿰불라", position: "DF", country: "알바니아", age: 25, rating: 78 },
        { name: "레안드로 파레데스", position: "MF", country: "아르헨티나", age: 31, rating: 75 },
        { name: "마누 코네", position: "MF", country: "프랑스", age: 24, rating: 82 },
        { name: "마티아스 소울레", position: "FW", country: "아르헨티나", age: 22, rating: 86 },
        { name: "제키 첼리크", position: "DF", country: "튀르키예", age: 28, rating: 77 },
        { name: "파울로 디발라", position: "FW", country: "아르헨티나", age: 31, rating: 84 },
        { name: "잔루카 만치니", position: "DF", country: "이탈리아", age: 29, rating: 83 },
        { name: "빅토르 넬손", position: "DF", country: "덴마크", age: 26, rating: 76 },
        { name: "닐 엘 야누이", position: "MF", country: "프랑스", age: 21, rating: 83 },
        { name: "아나스 살라에딘", position: "DF", country: "네덜란드", age: 23, rating: 69 },
        { name: "톰마소 발단치", position: "MF", country: "이탈리아", age: 22, rating: 77 },
        { name: "알렉시스 살레마커스", position: "FW", country: "벨기에", age: 26, rating: 81 },
        { name: "니콜로 피실리", position: "FW", country: "이탈리아", age: 20, rating: 75 },
        { name: "부바 상가레", position: "DF", country: "스페인", age: 17, rating: 67 },
        { name: "페데리코 나르딘", position: "DF", country: "이탈리아", age: 18, rating: 66 },
        { name: "스테판 엘샤라위", position: "FW", country: "이탈리아", age: 32, rating: 82 },
        { name: "피에를루이지 골리니", position: "GK", country: "이탈리아", age: 30, rating: 71 },
        { name: "밀레 스빌라르", position: "GK", country: "세르비아", age: 25, rating: 75 }
    ],

    "레버쿠젠": [
        { name: "루카시 흐라데츠키", position: "GK", country: "핀란드", age: 35, rating: 82 },
        { name: "피에로 잉카피에", position: "DF", country: "에콰도르", age: 23, rating: 83 },
        { name: "자렐 콴사", position: "DF", country: "잉글랜드", age: 22, rating: 74 },
        { name: "마리오 에르모소", position: "DF", country: "스페인", age: 30, rating: 77 },
        { name: "요나스 호프만", position: "MF", country: "독일", age: 33, rating: 81 },
        { name: "로베르트 안드리히", position: "MF", country: "독일", age: 30, rating: 79 },
        { name: "마르탱 테리에", position: "FW", country: "프랑스", age: 28, rating: 76 },
        { name: "에드몽 탑소바", position: "DF", country: "부르키나파소", age: 26, rating: 85 },
        { name: "아르투르", position: "DF", country: "브라질", age: 22, rating: 69 },
        { name: "파트리크 시크", position: "FW", country: "체코", age: 29, rating: 86 },
        { name: "알레호 사르코", position: "FW", country: "아르헨티나", age: 19, rating: 67 },
        { name: "네이선 텔러", position: "FW", country: "잉글랜드", age: 26, rating: 76 },
        { name: "알레한드로 그리말도", position: "DF", country: "스페인", age: 29, rating: 85 },
        { name: "아민 아들리", position: "FW", country: "프랑스", age: 25, rating: 77 },
        { name: "빅터 보니페이스", position: "FW", country: "나이지리아", age: 24, rating: 85 },
        { name: "알레시 가르시아", position: "MF", country: "스페인", age: 28, rating: 81 },
        { name: "에세키엘 팔라시오스", position: "MF", country: "아르헨티나", age: 26, rating: 82 },
        { name: "말릭 틸먼", position: "MF", country: "미국", age: 23, rating: 86 },
        { name: "니클라스 롬프", position: "GK", country: "독일", age: 32, rating: 64 },
        { name: "주누엘 벨로시앙", position: "DF", country: "프랑스", age: 20, rating: 76 },
        { name: "마르크 플레컨", position: "GK", country: "네덜란드", age: 32, rating: 71 },
        { name: "악셀 타페", position: "DF", country: "프랑스", age: 17, rating: 66 },
        { name: "이브라힘 마자", position: "MF", country: "독일", age: 19, rating: 67 },
        { name: "압둘라예 파예", position: "DF", country: "세네갈", age: 20, rating: 72 }
    ],

    "스포르팅 CP": [
        { name: "프랑코 이스라엘", position: "GK", country: "우루과이", age: 25, rating: 72 },
        { name: "마테우스 헤이스", position: "DF", country: "브라질", age: 30, rating: 74 },
        { name: "제리 신트쥐스터", position: "DF", country: "네덜란드", age: 28, rating: 72 },
        { name: "모리타 히데마사", position: "MF", country: "일본", age: 30, rating: 77 },
        { name: "제노 데바스트", position: "DF", country: "벨기에", age: 21, rating: 73 },
        { name: "페드루 곤살베스", position: "FW", country: "포르투갈", age: 27, rating: 85 },
        { name: "누누 산투스", position: "MF", country: "포르투갈", age: 30, rating: 82 },
        { name: "블라단 코바체비치", position: "GK", country: "보스니아 헤르체고비나", age: 27, rating: 69 },
        { name: "프란시스쿠 트링캉", position: "FW", country: "포르투갈", age: 25, rating: 86 },
        { name: "콘라드 하더", position: "FW", country: "덴마크", age: 20, rating: 67 },
        { name: "막시밀리아노 아라우호", position: "FW", country: "우루과이", age: 25, rating: 71 },
        { name: "이반 프레스네다", position: "DF", country: "스페인", age: 20, rating: 72 },
        { name: "후이 실바", position: "GK", country: "포르투갈", age: 31, rating: 74 },
        { name: "곤살루 이나시우", position: "DF", country: "포르투갈", age: 23, rating: 84 },
        { name: "우스망 디오망데", position: "DF", country: "코트디부아르", age: 21, rating: 83 },
        { name: "비엘 테이셰이라", position: "FW", country: "포르투갈", age: 20, rating: 67 },
        { name: "지에구 칼라이", position: "GK", country: "브라질", age: 21, rating: 66 },
        { name: "모르텐 히울만", position: "MF", country: "덴마크", age: 26, rating: 83 },
        { name: "히카르두 이스가이우", position: "DF", country: "포르투갈", age: 32, rating: 69 },
        { name: "지오바니 켄다", position: "FW", country: "포르투갈", age: 18, rating: 83 },
        { name: "에두아르두 콰레스마", position: "DF", country: "포르투갈", age: 23, rating: 79 },
        { name: "라파엘 넬", position: "FW", country: "포르투갈", age: 19, rating: 66 },
        { name: "아폰수 모레이라", position: "FW", country: "포르투갈", age: 20, rating: 67 }
    ],

    "벤피카": [
        { name: "아나톨리 트루빈", position: "GK", country: "우크라이나", age: 24, rating: 79 },
        { name: "알바로 카레라스", position: "DF", country: "스페인", age: 22, rating: 83 },
        { name: "안토니우 실바", position: "DF", country: "포르투갈", age: 21, rating: 84 },
        { name: "알렉산데르 바", position: "DF", country: "덴마크", age: 27, rating: 82 },
        { name: "아마르 데디치", position: "DF", country: "보스니아", age: 22, rating: 72 },
        { name: "프레드리크 아우르스네스", position: "MF", country: "노르웨이", age: 29, rating: 84 },
        { name: "프란조 이바노비치", position: "FW", country: "크로아티아", age: 21, rating: 73 },
        { name: "오르쿤 쾨크취", position: "MF", country: "튀르키예", age: 24, rating: 85 },
        { name: "엔조 바레네체아", position: "MF", country: "아르헨티나", age: 24, rating: 82 },
        { name: "반젤리스 파블리디스", position: "FW", country: "그리스", age: 26, rating: 86 },
        { name: "마누 실바", position: "MF", country: "포르투갈", age: 24, rating: 81 },
        { name: "케렘 아크튀르크올루", position: "FW", country: "튀르키예", age: 26, rating: 84 },
        { name: "레안드루 바헤이루", position: "MF", country: "룩셈부르크", age: 25, rating: 77 },
        { name: "안드레아 벨로티", position: "FW", country: "이탈리아", age: 31, rating: 75 },
        { name: "안드레아스 시엘데루프", position: "MF", country: "노르웨이", age: 21, rating: 73 },
        { name: "사무엘 소아르스", position: "GK", country: "포르투갈", age: 23, rating: 74 },
        { name: "잔루카 프레스티아니", position: "FW", country: "아르헨티나", age: 19, rating: 71 },
        { name: "사무엘 달", position: "DF", country: "노르웨이", age: 22, rating: 77 },
        { name: "브루마", position: "FW", country: "포르투갈", age: 30, rating: 82 },
        { name: "니콜라스 오타멘디", position: "DF", country: "아르헨티나", age: 37, rating: 78 },
        { name: "토마스 아라우주", position: "DF", country: "포르투갈", age: 23, rating: 81 },
        { name: "티아구 고베이아", position: "FW", country: "포르투갈", age: 24, rating: 69 },
        { name: "플로렌티누 루이스", position: "MF", country: "포르투갈", age: 25, rating: 82 },
        { name: "안드레 고메스", position: "GK", country: "포르투갈", age: 20, rating: 67 },
        { name: "구스타부 마르케스", position: "DF", country: "브라질", age: 22, rating: 68 },
        { name: "아드리안 바이마리", position: "MF", country: "스위스", age: 22, rating: 67 },
        { name: "주앙 벨로소", position: "MF", country: "포르투갈", age: 20, rating: 69 },
        { name: "헤나투 산체스", position: "MF", country: "포르투갈", age: 27, rating: 82 },
        { name: "리차르드 리오스", position: "MF", country: "콜롬비아", age: 25, rating: 71 }
    ],

    "셀틱": [
        { name: "카스페르 슈마이켈", position: "GK", country: "덴마크", age: 38, rating: 72 },
        { name: "앨리스테어 존스턴", position: "DF", country: "캐나다", age: 26, rating: 81 },
        { name: "리암 스케일스", position: "DF", country: "아일랜드", age: 26, rating: 76 },
        { name: "오스턴 트러스티", position: "DF", country: "미국", age: 26, rating: 70 },
        { name: "조타", position: "FW", country: "포르투갈", age: 26, rating: 76 },
        { name: "베니아민 뉘그렌", position: "FW", country: "스웨덴", age: 24, rating: 72 },
        { name: "아담 이다", position: "FW", country: "아일랜드", age: 24, rating: 73 },
        { name: "빌랴미 시니살로", position: "GK", country: "핀란드", age: 23, rating: 73 },
        { name: "양현준", position: "FW", country: "대한민국", age: 23, rating: 71 },
        { name: "루크 매코완", position: "MF", country: "스코틀랜드", age: 27, rating: 75 },
        { name: "야마다 신", position: "FW", country: "일본", age: 25, rating: 69 },
        { name: "칼럼 오스먼드", position: "FW", country: "오스트레일리아", age: 19, rating: 66 },
        { name: "캐머런 카터비커스", position: "DF", country: "미국", age: 27, rating: 74 },
        { name: "마르코 틸리오", position: "FW", country: "오스트레일리아", age: 23, rating: 71 },
        { name: "조니 케니", position: "FW", country: "아일랜드", age: 22, rating: 66 },
        { name: "이나무라 하야토", position: "DF", country: "일본", age: 24, rating: 75 },
        { name: "아르네 엥얼스", position: "MF", country: "벨기에", age: 21, rating: 67 },
        { name: "파울루 베르나르두", position: "MF", country: "포르투갈", age: 23, rating: 69 },
        { name: "로스 두핸", position: "GK", country: "스코틀랜드", age: 27, rating: 68 },
        { name: "마에다 다이젠", position: "FW", country: "일본", age: 27, rating: 77 },
        { name: "하타테 레오", position: "MF", country: "일본", age: 27, rating: 74 },
        { name: "칼럼 맥그리거", position: "MF", country: "스코틀랜드", age: 32, rating: 76 },
        { name: "자마이 심슨-퓨시", position: "DF", country: "잉글랜드", age: 19, rating: 69 },
        { name: "제임스 포레스트", position: "FW", country: "스코틀랜드", age: 34, rating: 67 },
        { name: "안토니 랄스턴", position: "DF", country: "스코틀랜드", age: 26, rating: 73 },
        { name: "스티븐 웰시", position: "DF", country: "스코틀랜드", age: 25, rating: 70 },
        { name: "키어런 티어니", position: "DF", country: "스코틀랜드", age: 28, rating: 76 }
    ],

    "페예노르트": [
        { name: "저스틴 베일로", position: "GK", country: "네덜란드", age: 27, rating: 67 },
        { name: "바르트 니우코프", position: "DF", country: "네덜란드", age: 29, rating: 71 },
        { name: "토마스 베일런", position: "DF", country: "네덜란드", age: 23, rating: 77 },
        { name: "와타나베 츠요시", position: "DF", country: "일본", age: 28, rating: 73 },
        { name: "헤이스 스말", position: "DF", country: "네덜란드", age: 27, rating: 76 },
        { name: "황인범", position: "MF", country: "대한민국", age: 28, rating: 83 },
        { name: "야쿠프 모데르", position: "MF", country: "폴란드", age: 26, rating: 82 },
        { name: "퀸턴 팀버르", position: "MF", country: "네덜란드", age: 24, rating: 82 },
        { name: "우에다 아야세", position: "FW", country: "일본", age: 26, rating: 73 },
        { name: "칼빈 스텡스", position: "FW", country: "네덜란드", age: 26, rating: 75 },
        { name: "아넬 아흐메도지치", position: "DF", country: "보스니아", age: 26, rating: 76 },
        { name: "곤살로 보르즈스", position: "FW", country: "포르투갈", age: 24, rating: 74 },
        { name: "루시아노 발렌테", position: "MF", country: "네덜란드", age: 21, rating: 78 },
        { name: "게르노트 트라우너", position: "DF", country: "오스트리아", age: 33, rating: 73 },
        { name: "훌리안 카란사", position: "FW", country: "아르헨티나", age: 25, rating: 72 },
        { name: "제일란드 미첼", position: "DF", country: "코스타리카", age: 20, rating: 66 },
        { name: "플라멘 안드레예프", position: "GK", country: "불가리아", age: 21, rating: 65 },
        { name: "티몬 벨렌로이터", position: "GK", country: "독일", age: 29, rating: 75 },
        { name: "아니스 하지 무사", position: "FW", country: "알제리", age: 23, rating: 79 },
        { name: "셈 스테인", position: "MF", country: "네덜란드", age: 23, rating: 84 },
        { name: "실로 트잔트", position: "MF", country: "네덜란드", age: 21, rating: 69 },
        { name: "히베로 레아트", position: "DF", country: "네덜란드", age: 19, rating: 78 },
        { name: "카스퍼르 텡스테트", position: "FW", country: "덴마크", age: 25, rating: 76 },
        { name: "우사마 타갈린", position: "MF", country: "모로코", age: 22, rating: 73 },
        { name: "조르당 로통바", position: "DF", country: "스위스", age: 26, rating: 74 },
        { name: "스테파노 카리요", position: "FW", country: "멕시코", age: 19, rating: 68 },
        { name: "크리스-케빈 나제", position: "MF", country: "프랑스", age: 24, rating: 71 },
        { name: "리암 보신", position: "GK", country: "벨기에", age: 29, rating: 68 }
    ],

    "PSV": [
        { name: "니크 올레이", position: "GK", country: "네덜란드", age: 30, rating: 75 },
        { name: "아르만도 오비스포", position: "DF", country: "네덜란드", age: 26, rating: 72 },
        { name: "이반 페리시치", position: "MF", country: "크로아티아", age: 36, rating: 82 },
        { name: "라이언 플라밍고", position: "DF", country: "네덜란드", age: 22, rating: 80 },
        { name: "루번 판보멀", position: "FW", country: "네덜란드", age: 20, rating: 79 },
        { name: "세르지뇨 데스트", position: "DF", country: "미국", age: 24, rating: 75 },
        { name: "리카르도 페피", position: "FW", country: "미국", age: 22, rating: 79 },
        { name: "알라산 플레아", position: "FW", country: "프랑스", age: 32, rating: 77 },
        { name: "마체이 코바르시", position: "GK", country: "체코", age: 25, rating: 73 },
        { name: "마우루 주니오르", position: "MF", country: "브라질", age: 26, rating: 83 },
        { name: "올리비에 보스칼리", position: "DF", country: "프랑스", age: 27, rating: 81 },
        { name: "에스미르 바즈락타레비치", position: "FW", country: "미국", age: 20, rating: 68 },
        { name: "휘스 틸", position: "MF", country: "네덜란드", age: 27, rating: 84 },
        { name: "쿠하이브 드리우시", position: "FW", country: "모로코", age: 23, rating: 72 },
        { name: "예르디 스하우턴", position: "MF", country: "네덜란드", age: 28, rating: 78 },
        { name: "조이 페이르만", position: "MF", country: "네덜란드", age: 26, rating: 85 },
        { name: "닉 스힉스", position: "GK", country: "네덜란드", age: 19, rating: 69 },
        { name: "킬리안 실디야", position: "DF", country: "프랑스", age: 23, rating: 81 },
        { name: "아이삭 바바디", position: "MF", country: "네덜란드", age: 20, rating: 76 },
        { name: "루카스 페레스", position: "FW", country: "스페인", age: 36, rating: 74 },
        { name: "티호 랜드", position: "MF", country: "네덜란드", age: 19, rating: 70 },
        { name: "이스마엘 세이바리", position: "MF", country: "모로코", age: 24, rating: 83 },
        { name: "야레크 가시오로프스키", position: "DF", country: "스페인", age: 20, rating: 74 },
        { name: "아다모 나갈로", position: "DF", country: "부르키나파소", age: 22, rating: 69 },
        { name: "타이 아베드", position: "MF", country: "이스라엘", age: 21, rating: 71 }
    ],

    "올랭피크 드 마르세유": [
        { name: "헤로니모 룰리", position: "GK", country: "아르헨티나", age: 33, rating: 78 },
        { name: "파쿤도 메디나", position: "DF", country: "아르헨티나", age: 26, rating: 83 },
        { name: "C-J 이건라일리", position: "DF", country: "잉글랜드", age: 22, rating: 80 },
        { name: "레오나르도 발레르디", position: "DF", country: "아르헨티나", age: 26, rating: 85 },
        { name: "울리세스 가르시아", position: "DF", country: "스위스", age: 29, rating: 78 },
        { name: "앙겔 고메스", position: "MF", country: "잉글랜드", age: 24, rating: 76 },
        { name: "닐 모페", position: "FW", country: "프랑스", age: 28, rating: 72 },
        { name: "아민 구이리", position: "FW", country: "프랑스", age: 25, rating: 81 },
        { name: "메이슨 그린우드", position: "FW", country: "잉글랜드", age: 23, rating: 87 },
        { name: "아민 하릿", position: "MF", country: "모로코", age: 28, rating: 78 },
        { name: "제프리 더랭", position: "GK", country: "네덜란드", age: 27, rating: 71 },
        { name: "데릭 코넬리우스", position: "DF", country: "캐나다", age: 27, rating: 75 },
        { name: "이고르 파이샹", position: "FW", country: "브라질", age: 25, rating: 84 },
        { name: "조너선 로우", position: "FW", country: "잉글랜드", age: 22, rating: 74 },
        { name: "조프레 콘도그비아", position: "MF", country: "중앙아프리카공화국", age: 32, rating: 79 },
        { name: "티모시 웨아", position: "FW", country: "미국", age: 25, rating: 79 },
        { name: "이스마엘 베나세르", position: "MF", country: "알제리", age: 27, rating: 78 },
        { name: "피에르에밀 호이비에르", position: "MF", country: "덴마크", age: 30, rating: 85 },
        { name: "아드리앙 라비오", position: "MF", country: "프랑스", age: 30, rating: 86 },
        { name: "빌랄 나디르", position: "MF", country: "프랑스", age: 21, rating: 69 },
        { name: "폴 리롤라", position: "DF", country: "스페인", age: 27, rating: 73 },
        { name: "루벤 블랑코", position: "GK", country: "스페인", age: 30, rating: 70 },
        { name: "피에르 에메릭 오바메양", position: "FW", country: "가봉", age: 36, rating: 83 },
        { name: "야니스 셀라미", position: "MF", country: "프랑스", age: 18, rating: 66 },
        { name: "가엘 라퐁", position: "MF", country: "프랑스", age: 19, rating: 67 },
        { name: "케일리안 압달라", position: "FW", country: "프랑스", age: 19, rating: 66 },
        { name: "대릴 바콜라", position: "MF", country: "프랑스", age: 17, rating: 68 },
        { name: "아미르 무리요", position: "DF", country: "파나마", age: 29, rating: 82 },
        { name: "아마르 데디치", position: "DF", country: "보스니아 헤르체고비나", age: 23, rating: 72 }
    ],

    // 3부 리그 시작
    "FC 서울": [
        { name: "이상민", position: "DF", country: "대한민국", age: 27, rating: 75 },
        { name: "야잔", position: "DF", country: "요르단", age: 29, rating: 78 },
        { name: "정승원", position: "MF", country: "대한민국", age: 28, rating: 79 },
        { name: "이승모", position: "MF", country: "대한민국", age: 27, rating: 76 },
        { name: "조영욱", position: "FW", country: "대한민국", age: 26, rating: 74 },
        { name: "린가드", position: "MF", country: "잉글랜드", age: 32, rating: 82 },
        { name: "천성훈", position: "FW", country: "대한민국", age: 24, rating: 72 },
        { name: "손승범", position: "FW", country: "대한민국", age: 21, rating: 71 },
        { name: "김현덕", position: "DF", country: "대한민국", age: 20, rating: 69 },
        { name: "최준", position: "DF", country: "대한민국", age: 26, rating: 73 },
        { name: "정태욱", position: "DF", country: "대한민국", age: 28, rating: 75 },
        { name: "강주혁", position: "FW", country: "대한민국", age: 18, rating: 67 },
        { name: "이한도", position: "DF", country: "대한민국", age: 31, rating: 76 },
        { name: "최철원", position: "GK", country: "대한민국", age: 31, rating: 74 },
        { name: "김진수", position: "DF", country: "대한민국", age: 33, rating: 73 },
        { name: "조영광", position: "DF", country: "대한민국", age: 21, rating: 68 },
        { name: "임준섭", position: "GK", country: "대한민국", age: 21, rating: 67 },
        { name: "허동민", position: "MF", country: "대한민국", age: 21, rating: 69 },
        { name: "문선민", position: "FW", country: "대한민국", age: 33, rating: 72 },
        { name: "바또", position: "FW", country: "코트디부아르", age: 19, rating: 70 },
        { name: "류재문", position: "MF", country: "대한민국", age: 31, rating: 74 },
        { name: "김주성", position: "DF", country: "대한민국", age: 24, rating: 71 },
        { name: "강현무", position: "GK", country: "대한민국", age: 30, rating: 73 },
        { name: "클리말라", position: "FW", country: "폴란드", age: 26, rating: 76 },
        { name: "배현서", position: "DF", country: "대한민국", age: 20, rating: 67 },
        { name: "김지원", position: "DF", country: "대한민국", age: 21, rating: 68 },
        { name: "정한민", position: "FW", country: "대한민국", age: 24, rating: 71 },
        { name: "박성훈", position: "DF", country: "대한민국", age: 22, rating: 69 },
        { name: "황도윤", position: "MF", country: "대한민국", age: 22, rating: 70 },
        { name: "둑스", position: "FW", country: "크로아티아", age: 31, rating: 77 },
        { name: "박수일", position: "DF", country: "대한민국", age: 29, rating: 72 },
        { name: "최준영", position: "DF", country: "대한민국", age: 20, rating: 67 },
        { name: "안데르손", position: "FW", country: "브라질", age: 27, rating: 75 },
        { name: "윤기욱", position: "GK", country: "대한민국", age: 18, rating: 65 },
        { name: "민지훈", position: "MF", country: "대한민국", age: 20, rating: 68 },
        { name: "루카스", position: "FW", country: "브라질", age: 25, rating: 74 },
        { name: "박장한결", position: "MF", country: "대한민국", age: 21, rating: 68 }
    ]

    // 1부 리그
    "바르셀로나": [
        { name: "페드리", position: "MF", country: "스페인", age: 22, rating: 92 },
        { name: "로베르트 레반도프스키", position: "FW", country: "폴란드", age: 36, rating: 92 },
        { name: "라민 야말", position: "FW", country: "스페인", age: 18, rating: 94 },
        { name: "하피냐", position: "FW", country: "브라질", age: 28, rating: 95 },
        { name: "이냐키 페냐", position: "GK", country: "스페인", age: 26, rating: 73 },
        { name: "마커스 래시포드", position: "MF", country: "잉글랜드", age: 27, rating: 80 },
        { name: "마르크 안드레 테어 슈테겐", position: "GK", country: "독일", age: 33, rating: 85 },
        { name: "안드레아스 크리스텐센", position: "DF", country: "덴마크", age: 29, rating: 73 },
        { name: "페르민 로페스", position: "MF", country: "스페인", age: 22, rating: 82 },
        { name: "마르크 카사도", position: "MF", country: "스페인", age: 21, rating: 79 },
        { name: "다니 올모", position: "MF", country: "스페인", age: 27, rating: 86 },
        { name: "프렝키 더용", position: "MF", country: "네덜란드", age: 28, rating: 86 },
        { name: "쥘 쿤데", position: "DF", country: "프랑스", age: 26, rating: 88 },
        { name: "에릭 가르시아", position: "DF", country: "스페인", age: 24, rating: 75 },
        { name: "보이치에흐 슈체스니", position: "GK", country: "폴란드", age: 35, rating: 84 },
        { name: "주안 가르시아", position: "GK", country: "스페인", age: 23, rating: 81 },
        { name: "오리올 로메우", position: "MF", country: "스페인", age: 33, rating: 69 },
        { name: "엑토르 포트", position: "DF", country: "스페인", age: 19, rating: 72 },
        { name: "마르크 베르날", position: "MF", country: "스페인", age: 18, rating: 71 },
        { name: "제라르 마르틴", position: "DF", country: "스페인", age: 23, rating: 67 },
        { name: "루니 바르다그지", position: "FW", country: "덴마크", age: 19, rating: 69 }
    ],

    "레알 마드리드": [
        { name: "티보 쿠르투아", position: "GK", country: "벨기에", age: 33, rating: 85 },
        { name: "다니 카르바할", position: "DF", country: "스페인", age: 33, rating: 83 },
        { name: "에데르 밀리탕", position: "DF", country: "브라질", age: 27, rating: 86 },
        { name: "데이비드 알라바", position: "DF", country: "오스트리아", age: 33, rating: 69 },
        { name: "주드 벨링엄", position: "MF", country: "잉글랜드", age: 22, rating: 92 },
        { name: "에두아르도 카마빙가", position: "MF", country: "프랑스", age: 22, rating: 85 },
        { name: "비니시우스 주니오르", position: "FW", country: "브라질", age: 25, rating: 93 },
        { name: "페데리코 발베르데", position: "MF", country: "우루과이", age: 27, rating: 92 },
        { name: "킬리안 음바페", position: "FW", country: "프랑스", age: 26, rating: 94 },
        { name: "호드리구", position: "FW", country: "브라질", age: 24, rating: 89 },
        { name: "트렌트 알렉산더아놀드", position: "DF", country: "잉글랜드", age: 26, rating: 86 },
        { name: "안드리 루닌", position: "GK", country: "우크라이나", age: 26, rating: 79 },
        { name: "오렐리앵 추아메니", position: "MF", country: "프랑스", age: 25, rating: 85 },
        { name: "아르다 귈러", position: "MF", country: "튀르키예", age: 20, rating: 83 },
        { name: "엔드릭", position: "FW", country: "브라질", age: 19, rating: 75 },
        { name: "알바로 카레라스", position: "DF", country: "스페인", age: 22, rating: 83 },
        { name: "다니 세바요스", position: "MF", country: "스페인", age: 28, rating: 73 },
        { name: "프란 가르시아", position: "DF", country: "스페인", age: 25, rating: 81 },
        { name: "브라힘 디아스", position: "FW", country: "모로코", age: 25, rating: 82 },
        { name: "안토니오 뤼디거", position: "DF", country: "독일", age: 32, rating: 84 },
        { name: "페를랑 멘디", position: "DF", country: "프랑스", age: 30, rating: 72 },
        { name: "딘 하위선", position: "DF", country: "스페인", age: 20, rating: 86 },
        { name: "라울 아센시오", position: "DF", country: "스페인", age: 22, rating: 84 }
    ],

    "맨체스터 시티": [
        { name: "제임스 트래포드", position: "GK", country: "잉글랜드", age: 22, rating: 81 },
        { name: "후벵 디아스", position: "DF", country: "포르투갈", age: 28, rating: 87 },
        { name: "티자니 라인더르스", position: "MF", country: "네덜란드", age: 27, rating: 88 },
        { name: "존 스톤스", position: "DF", country: "잉글랜드", age: 31, rating: 77 },
        { name: "네이선 아케", position: "DF", country: "네덜란드", age: 30, rating: 79 },
        { name: "오마르 마르무시", position: "FW", country: "이집트", age: 26, rating: 88 },
        { name: "마테오 코바치치", position: "MF", country: "크로아티아", age: 31, rating: 83 },
        { name: "엘링 홀란드", position: "FW", country: "노르웨이", age: 25, rating: 94 },
        { name: "잭 그릴리쉬", position: "MF", country: "잉글랜드", age: 29, rating: 71 },
        { name: "제레미 도쿠", position: "MF", country: "벨기에", age: 23, rating: 85 },
        { name: "마커스 베티넬리", position: "GK", country: "잉글랜드", age: 33, rating: 62 },
        { name: "니코 곤살레스", position: "MF", country: "스페인", age: 27, rating: 81 },
        { name: "로드리", position: "MF", country: "스페인", age: 29, rating: 93 },
        { name: "슈테판 오르테가", position: "GK", country: "독일", age: 32, rating: 76 },
        { name: "일카이 귄도안", position: "MF", country: "독일", age: 34, rating: 82 },
        { name: "베르나르두 실바", position: "MF", country: "포르투갈", age: 30, rating: 84 },
        { name: "라얀 아이트누리", position: "DF", country: "알제리", age: 24, rating: 85 },
        { name: "비토르 헤이스", position: "DF", country: "브라질", age: 19, rating: 73 },
        { name: "요슈코 그바르디올", position: "DF", country: "크로아티아", age: 23, rating: 89 },
        { name: "마누엘 아칸지", position: "DF", country: "스위스", age: 30, rating: 78 },
        { name: "사비뉴", position: "MF", country: "브라질", age: 21, rating: 84 },
        { name: "마테우스 누네스", position: "MF", country: "포르투갈", age: 26, rating: 81 },
        { name: "라얀 셰르키", position: "MF", country: "프랑스", age: 21, rating: 87 },
        { name: "클라우디오 에체베리", position: "MF", country: "아르헨티나", age: 19, rating: 74 },
        { name: "에데르송", position: "GK", country: "브라질", age: 31, rating: 82 },
        { name: "필 포든", position: "MF", country: "잉글랜드", age: 25, rating: 87 },
        { name: "오스카르 보브", position: "MF", country: "노르웨이", age: 22, rating: 73 },
        { name: "리코 루이스", position: "DF", country: "잉글랜드", age: 20, rating: 79 }
    ],

    "맨체스터 유나이티드": [
        { name: "알타이 바이은드르", position: "GK", country: "튀르키예", age: 27, rating: 69 },
        { name: "디오구 달로", position: "DF", country: "포르투갈", age: 26, rating: 77 },
        { name: "누사이르 마즈라위", position: "DF", country: "모로코", age: 27, rating: 84 },
        { name: "마테이스 더리흐트", position: "DF", country: "네덜란드", age: 25, rating: 82 },
        { name: "해리 매과이어", position: "DF", country: "잉글랜드", age: 32, rating: 80 },
        { name: "리산드로 마르티네스", position: "DF", country: "아르헨티나", age: 27, rating: 84 },
        { name: "메이슨 마운트", position: "MF", country: "잉글랜드", age: 26, rating: 76 },
        { name: "브루노 페르난데스", position: "MF", country: "포르투갈", age: 30, rating: 90 },
        { name: "라스무스 호일룬", position: "FW", country: "덴마크", age: 22, rating: 75 },
        { name: "마테우스 쿠냐", position: "FW", country: "브라질", age: 26, rating: 88 },
        { name: "조슈아 지르크지", position: "FW", country: "네덜란드", age: 24, rating: 76 },
        { name: "파트리크 도르구", position: "DF", country: "덴마크", age: 19, rating: 80 },
        { name: "레니 요로", position: "DF", country: "프랑스", age: 19, rating: 82 },
        { name: "아마드 디알로", position: "MF", country: "코트디부아르", age: 23, rating: 84 },
        { name: "알레한드로 가르나초", position: "FW", country: "아르헨티나", age: 21, rating: 82 },
        { name: "카세미루", position: "MF", country: "브라질", age: 33, rating: 83 },
        { name: "브라이언 음뵈모", position: "FW", country: "카메룬", age: 25, rating: 87 },
        { name: "톰 히튼", position: "GK", country: "잉글랜드", age: 39, rating: 62 },
        { name: "루크 쇼", position: "DF", country: "잉글랜드", age: 30, rating: 77 },
        { name: "안드레 오나나", position: "GK", country: "카메룬", age: 29, rating: 81 },
        { name: "마누엘 우가르테", position: "MF", country: "우루과이", age: 24, rating: 83 },
        { name: "코비 마이누", position: "MF", country: "잉글랜드", age: 20, rating: 78 }
    ],

    "리버풀": [
        { name: "알리송 베케르", position: "GK", country: "브라질", age: 32, rating: 86 },
        { name: "조 고메즈", position: "DF", country: "잉글랜드", age: 28, rating: 75 },
        { name: "엔도 와타루", position: "MF", country: "일본", age: 32, rating: 74 },
        { name: "버질 반 다이크", position: "DF", country: "네덜란드", age: 34, rating: 92 },
        { name: "이브라히마 코나테", position: "DF", country: "프랑스", age: 26, rating: 86 },
        { name: "밀로시 케르케즈", position: "DF", country: "헝가리", age: 21, rating: 85 },
        { name: "플로리안 비르츠", position: "FW", country: "독일", age: 22, rating: 93 },
        { name: "도미니크 소보슬라이", position: "MF", country: "헝가리", age: 24, rating: 87 },
        { name: "다르윈 누녜스", position: "FW", country: "우루과이", age: 26, rating: 75 },
        { name: "알렉시스 맥 알리스터", position: "MF", country: "아르헨티나", age: 26, rating: 90 },
        { name: "모하메드 살라", position: "FW", country: "이집트", age: 33, rating: 94 },
        { name: "코너 브래들리", position: "DF", country: "북아일랜드", age: 22, rating: 76 },
        { name: "페데리코 키에사", position: "FW", country: "이탈리아", age: 27, rating: 75 },
        { name: "커티스 존스", position: "MF", country: "잉글랜드", age: 24, rating: 81 },
        { name: "코디 각포", position: "FW", country: "네덜란드", age: 26, rating: 84 },
        { name: "하비 엘리엇", position: "MF", country: "잉글랜드", age: 22, rating: 83 },
        { name: "코스타스 치미카스", position: "DF", country: "그리스", age: 29, rating: 73 },
        { name: "위고 에키티케", position: "FW", country: "프랑스", age: 23, rating: 86 },
        { name: "기오르기 마마르다슈빌리", position: "GK", country: "조지아", age: 24, rating: 81 },
        { name: "앤디 로버트슨", position: "DF", country: "스코틀랜드", age: 31, rating: 83 },
        { name: "제레미 프림퐁", position: "DF", country: "네덜란드", age: 24, rating: 87 },
        { name: "라이언 흐라벤베르흐", position: "MF", country: "네덜란드", age: 23, rating: 91 },
        { name: "스테판 바이체티치", position: "MF", country: "스페인", age: 20, rating: 67 },
        { name: "리스 윌리엄스", position: "DF", country: "잉글랜드", age: 24, rating: 66 },
        { name: "벤 도크", position: "FW", country: "스코틀랜드", age: 19, rating: 69 },
        { name: "타일러 모튼", position: "MF", country: "잉글랜드", age: 22, rating: 71 }
    ],

    "토트넘 홋스퍼": [
        { name: "굴리엘모 비카리오", position: "GK", country: "이탈리아", age: 28, rating: 84 },
        { name: "케빈 단조", position: "DF", country: "오스트리아", age: 26, rating: 81 },
        { name: "라두 드라구신", position: "DF", country: "루마니아", age: 23, rating: 76 },
        { name: "손흥민", position: "FW", country: "대한민국", age: 33, rating: 93 },
        { name: "이브 비수마", position: "MF", country: "말리", age: 28, rating: 82 },
        { name: "히샬리송", position: "FW", country: "브라질", age: 28, rating: 77 },
        { name: "제임스 매디슨", position: "MF", country: "잉글랜드", age: 28, rating: 85 },
        { name: "마티스 텔", position: "FW", country: "프랑스", age: 20, rating: 78 },
        { name: "데스티니 우도기", position: "DF", country: "이탈리아", age: 22, rating: 84 },
        { name: "아치 그레이", position: "MF", country: "잉글랜드", age: 19, rating: 82 },
        { name: "루카스 베리발", position: "MF", country: "스웨덴", age: 19, rating: 82 },
        { name: "크리스티안 로메로", position: "DF", country: "아르헨티나", age: 27, rating: 88 },
        { name: "양민혁", position: "FW", country: "대한민국", age: 19, rating: 85 },
        { name: "도미닉 솔랑케", position: "FW", country: "잉글랜드", age: 27, rating: 86 },
        { name: "모하메드 쿠두스", position: "FW", country: "가나", age: 25, rating: 87 },
        { name: "데얀 쿨루셉스키", position: "MF", country: "스웨덴", age: 25, rating: 85 },
        { name: "브레넌 존슨", position: "FW", country: "웨일스", age: 24, rating: 82 },
        { name: "페드로 포로", position: "DF", country: "스페인", age: 25, rating: 86 },
        { name: "제드 스펜스", position: "DF", country: "잉글랜드", age: 24, rating: 77 },
        { name: "마노르 솔로몬", position: "FW", country: "이스라엘", age: 26, rating: 78 },
        { name: "윌손 오도베르", position: "FW", country: "프랑스", age: 20, rating: 75 },
        { name: "파페 마타르 사르", position: "MF", country: "세네갈", age: 22, rating: 83 },
        { name: "로드리고 벤쿠르", position: "MF", country: "우루과이", age: 28, rating: 81 },
        { name: "안토닌 킨스키", position: "GK", country: "체코", age: 22, rating: 73 },
        { name: "벤 데이비스", position: "DF", country: "웨일스", age: 32, rating: 76 },
        { name: "미키 판더벤", position: "DF", country: "네덜란드", age: 24, rating: 86 },
        { name: "브랜던 오스틴", position: "GK", country: "미국", age: 25, rating: 65 },
        { name: "데인 스칼렛", position: "FW", country: "잉글랜드", age: 21, rating: 68 },
        { name: "알피 디바인", position: "MF", country: "잉글랜드", age: 20, rating: 66 },
        { name: "루카 부슈코비치", position: "DF", country: "크로아티아", age: 18, rating: 68 },
        { name: "타카이 코타", position: "DF", country: "일본", age: 20, rating: 71 }
    ],

    "파리 생제르맹": [
        { name: "잔루이지 돈나룸마", position: "GK", country: "이탈리아", age: 26, rating: 87 },
        { name: "아슈라프 하키미", position: "DF", country: "모로코", age: 26, rating: 92 },
        { name: "프레스넬 킴펨베", position: "DF", country: "프랑스", age: 29, rating: 69 },
        { name: "루카스 베랄두", position: "DF", country: "브라질", age: 21, rating: 75 },
        { name: "마르퀴뇨스", position: "DF", country: "브라질", age: 31, rating: 85 },
        { name: "흐비차 크바라츠헬리아", position: "FW", country: "조지아", age: 24, rating: 93 },
        { name: "파비안 루이스", position: "MF", country: "스페인", age: 29, rating: 83 },
        { name: "곤살루 하무스", position: "FW", country: "포르투갈", age: 24, rating: 75 },
        { name: "우스만 뎀벨레", position: "FW", country: "프랑스", age: 28, rating: 95 },
        { name: "데지레 두에", position: "FW", country: "프랑스", age: 20, rating: 89 },
        { name: "비티냐", position: "MF", country: "포르투갈", age: 25, rating: 93 },
        { name: "이강인", position: "MF", country: "대한민국", age: 24, rating: 82 },
        { name: "뤼카 에르난데스", position: "DF", country: "프랑스", age: 29, rating: 77 },
        { name: "세니 마율루", position: "MF", country: "프랑스", age: 19, rating: 73 },
        { name: "누누 멘데스", position: "DF", country: "포르투갈", age: 23, rating: 91 },
        { name: "브래들리 바르콜라", position: "FW", country: "프랑스", age: 22, rating: 86 },
        { name: "워렌 자이르에메리", position: "MF", country: "프랑스", age: 19, rating: 82 },
        { name: "마트베이 사포노프", position: "GK", country: "러시아", age: 26, rating: 68 },
        { name: "윌리안 파초", position: "DF", country: "에콰도르", age: 23, rating: 83 },
        { name: "아르나우 테나스", position: "GK", country: "스페인", age: 24, rating: 72 },
        { name: "주앙 네베스", position: "MF", country: "포르투갈", age: 20, rating: 92 }
    ],

    "AC 밀란": [
        { name: "피에트로 테라치아노", position: "GK", country: "이탈리아", age: 21, rating: 67 },
        { name: "사무엘레 리치", position: "FW", country: "이탈리아", age: 22, rating: 80 },
        { name: "산티아고 히메네스", position: "FW", country: "멕시코", age: 24, rating: 83 },
        { name: "루벤 로프터스치크", position: "MF", country: "잉글랜드", age: 29, rating: 81 },
        { name: "하파엘 레앙", position: "FW", country: "포르투갈", age: 26, rating: 89 },
        { name: "크리스천 풀리식", position: "FW", country: "미국", age: 26, rating: 90 },
        { name: "루카 모드리치", position: "MF", country: "크로아티아", age: 39, rating: 85 },
        { name: "마이크 메냥", position: "GK", country: "프랑스", age: 30, rating: 85 },
        { name: "알렉스 히메네스", position: "DF", country: "스페인", age: 20, rating: 73 },
        { name: "사무엘 추쿠에제", position: "FW", country: "나이지리아", age: 26, rating: 76 },
        { name: "에메르송 로얄", position: "DF", country: "브라질", age: 26, rating: 72 },
        { name: "피카요 토모리", position: "DF", country: "잉글랜드", age: 27, rating: 85 },
        { name: "말릭 티아우", position: "DF", country: "독일", age: 23, rating: 78 },
        { name: "유수프 포파나", position: "MF", country: "프랑스", age: 26, rating: 82 },
        { name: "스트라히냐 파블로비치", position: "DF", country: "세르비아", age: 24, rating: 77 },
        { name: "워렌 본도", position: "MF", country: "프랑스", age: 23, rating: 67 },
        { name: "필리포 테라치아노", position: "DF", country: "이탈리아", age: 22, rating: 67 },
        { name: "마테오 가비아", position: "DF", country: "이탈리아", age: 25, rating: 80 },
        { name: "유누스 무사", position: "MF", country: "미국", age: 22, rating: 77 }
    ],

    "인터 밀란": [
        { name: "얀 조머", position: "GK", country: "스위스", age: 36, rating: 83 },
        { name: "덴젤 둠프리스", position: "DF", country: "네덜란드", age: 29, rating: 87 },
        { name: "스테판 더프레이", position: "DF", country: "네덜란드", age: 33, rating: 74 },
        { name: "피오트르 지엘린스키", position: "MF", country: "폴란드", age: 31, rating: 81 },
        { name: "페타르 수치치", position: "MF", country: "크로아티아", age: 22, rating: 72 },
        { name: "마르쿠스 튀랑", position: "FW", country: "프랑스", age: 27, rating: 87 },
        { name: "라우타로 마르티네스", position: "FW", country: "아르헨티나", age: 27, rating: 90 },
        { name: "루이스 엔히키", position: "FW", country: "브라질", age: 24, rating: 72 },
        { name: "라파엘레 디젠나로", position: "GK", country: "이탈리아", age: 25, rating: 67 },
        { name: "주젭 마르티네스", position: "GK", country: "스페인", age: 27, rating: 69 },
        { name: "프란체스코 아체르비", position: "DF", country: "이탈리아", age: 37, rating: 83 },
        { name: "다비데 프라테시", position: "MF", country: "이탈리아", age: 25, rating: 82 },
        { name: "하칸 찰하놀루", position: "MF", country: "튀르키예", age: 31, rating: 89 },
        { name: "크리스티안 아슬라니", position: "MF", country: "알바니아", age: 23, rating: 79 },
        { name: "헨리크 미키타리안", position: "MF", country: "아르메니아", age: 36, rating: 75 },
        { name: "니콜로 바렐라", position: "MF", country: "이탈리아", age: 28, rating: 91 },
        { name: "뱅자맹 파바르", position: "DF", country: "프랑스", age: 29, rating: 81 },
        { name: "카를루스 아우구스투", position: "DF", country: "브라질", age: 26, rating: 77 },
        { name: "얀 아우렐 비세크", position: "DF", country: "독일", age: 24, rating: 73 },
        { name: "페데리코 디마르코", position: "DF", country: "이탈리아", age: 27, rating: 87 },
        { name: "마테오 다르미안", position: "DF", country: "이탈리아", age: 35, rating: 71 },
        { name: "니콜라 잘레프스키", position: "DF", country: "폴란드", age: 23, rating: 74 },
        { name: "알레산드로 바스토니", position: "DF", country: "이탈리아", age: 26, rating: 90 },
        { name: "메흐디 타레미", position: "FW", country: "이란", age: 33, rating: 69 }
    ],

    "아스널": [
        { name: "다비드 라야", position: "GK", country: "스페인", age: 29, rating: 85 },
        { name: "윌리엄 살리바", position: "DF", country: "프랑스", age: 24, rating: 85 },
        { name: "크리스티안 모스케라", position: "DF", country: "스페인", age: 21, rating: 73 },
        { name: "벤 화이트", position: "DF", country: "잉글랜드", age: 27, rating: 78 },
        { name: "가브리에우 마갈량이스", position: "DF", country: "브라질", age: 27, rating: 90 },
        { name: "부카요 사카", position: "FW", country: "잉글랜드", age: 23, rating: 91 },
        { name: "마르틴 외데고르", position: "MF", country: "노르웨이", age: 26, rating: 86 },
        { name: "가브리에우 제주스", position: "FW", country: "브라질", age: 28, rating: 75 },
        { name: "가브리에우 마르티넬리", position: "FW", country: "브라질", age: 24, rating: 85 },
        { name: "위리엔 팀버르", position: "DF", country: "네덜란드", age: 24, rating: 85 },
        { name: "케파 아리사발라가", position: "GK", country: "스페인", age: 30, rating: 74 },
        { name: "빅토르 요케레스", position: "FW", country: "스웨덴", age: 27, rating: 90 },
        { name: "야쿠프 키비오르", position: "DF", country: "폴란드", age: 25, rating: 81 },
        { name: "크리스티안 뇌르고르", position: "MF", country: "덴마크", age: 31, rating: 76 },
        { name: "올렉산드르 진첸코", position: "DF", country: "우크라이나", age: 28, rating: 76 },
        { name: "레안드로 트로사르", position: "MF", country: "벨기에", age: 30, rating: 78 },
        { name: "노니 마두에케", position: "FW", country: "잉글랜드", age: 23, rating: 77 },
        { name: "에단 은와네리", position: "FW", country: "잉글랜드", age: 18, rating: 75 },
        { name: "미켈 메리노", position: "MF", country: "스페인", age: 29, rating: 83 },
        { name: "카이 하베르츠", position: "MF", country: "독일", age: 26, rating: 80 },
        { name: "리카르도 칼라피오리", position: "DF", country: "이탈리아", age: 23, rating: 85 },
        { name: "마르틴 수비멘디", position: "MF", country: "스페인", age: 26, rating: 87 },
        { name: "데클란 라이스", position: "MF", country: "잉글랜드", age: 26, rating: 91 },
        { name: "마일스 루이스스켈리", position: "DF", country: "잉글랜드", age: 19, rating: 83 }
    ],

    "나폴리": [
        { name: "알렉스 메렛", position: "GK", country: "이탈리아", age: 28, rating: 83 },
        { name: "알레산드로 부온조르노", position: "DF", country: "이탈리아", age: 26, rating: 85 },
        { name: "주앙 제주스", position: "DF", country: "브라질", age: 34, rating: 72 },
        { name: "빌리 길모어", position: "MF", country: "스코틀랜드", age: 24, rating: 81 },
        { name: "다비드 네리스", position: "FW", country: "브라질", age: 28, rating: 76 },
        { name: "스콧 맥토미니", position: "MF", country: "스코틀랜드", age: 28, rating: 92 },
        { name: "노아 오카포르", position: "FW", country: "스위스", age: 25, rating: 74 },
        { name: "로멜루 루카쿠", position: "FW", country: "벨기에", age: 32, rating: 86 },
        { name: "아미르 라흐마니", position: "DF", country: "코소보", age: 31, rating: 82 },
        { name: "니키타 콘티니", position: "GK", country: "이탈리아", age: 29, rating: 65 },
        { name: "필리프 빌링", position: "MF", country: "덴마크", age: 28, rating: 76 },
        { name: "라파 마린", position: "MF", country: "스페인", age: 23, rating: 74 },
        { name: "마티아스 올리베라", position: "DF", country: "우루과이", age: 27, rating: 83 },
        { name: "지오바니 시메오네", position: "FW", country: "아르헨티나", age: 30, rating: 74 },
        { name: "마테오 폴리타노", position: "FW", country: "이탈리아", age: 31, rating: 85 },
        { name: "조반니 디 로렌초", position: "DF", country: "이탈리아", age: 31, rating: 87 },
        { name: "시릴 은곤게", position: "FW", country: "벨기에", age: 30, rating: 67 },
        { name: "케빈 더 브라위너", position: "MF", country: "벨기에", age: 34, rating: 87 },
        { name: "레오나르도 스피나촐라", position: "DF", country: "이탈리아", age: 32, rating: 81 },
        { name: "스타니슬라프 로보트카", position: "MF", country: "슬로바키아", age: 30, rating: 84 },
        { name: "자코모 라스파도리", position: "FW", country: "이탈리아", age: 25, rating: 85 },
        { name: "시모네 스쿠페트", position: "GK", country: "이탈리아", age: 29, rating: 67 },
        { name: "앙드레프랑크 잠보 앙귀사", position: "MF", country: "카메룬", age: 29, rating: 82 }
    ],

    "첼시": [
        { name: "로베르트 산체스", position: "GK", country: "스페인", age: 27, rating: 81 },
        { name: "마르크 쿠쿠레야", position: "DF", country: "스페인", age: 27, rating: 88 },
        { name: "토신 아다라비오요", position: "DF", country: "잉글랜드", age: 27, rating: 77 },
        { name: "브누아 바디아실", position: "DF", country: "프랑스", age: 24, rating: 76 },
        { name: "리바이 콜윌", position: "DF", country: "잉글랜드", age: 22, rating: 84 },
        { name: "페드루 네투", position: "FW", country: "포르투갈", age: 25, rating: 83 },
        { name: "엔소 페르난데스", position: "MF", country: "아르헨티나", age: 24, rating: 90 },
        { name: "리암 델랍", position: "FW", country: "잉글랜드", age: 22, rating: 81 },
        { name: "콜 파머", position: "MF", country: "잉글랜드", age: 23, rating: 91 },
        { name: "필립 요르겐센", position: "GK", country: "덴마크", age: 23, rating: 72 },
        { name: "다리우 이수구", position: "MF", country: "포르투갈", age: 21, rating: 73 },
        { name: "니콜라 잭슨", position: "FW", country: "세네갈", age: 24, rating: 79 },
        { name: "안드레이 산투스", position: "MF", country: "브라질", age: 21, rating: 86 },
        { name: "크리스토퍼 은쿤쿠", position: "FW", country: "프랑스", age: 27, rating: 75 },
        { name: "마마두 사르", position: "DF", country: "프랑스", age: 19, rating: 74 },
        { name: "주앙 페드루", position: "FW", country: "브라질", age: 24, rating: 86 },
        { name: "키어넌 듀스버리홀", position: "MF", country: "잉글랜드", age: 26, rating: 77 },
        { name: "트레보 찰로바", position: "DF", country: "잉글랜드", age: 26, rating: 80 },
        { name: "리스 제임스", position: "DF", country: "잉글랜드", age: 25, rating: 88 },
        { name: "모이세스 카이세도", position: "MF", country: "에콰도르", age: 23, rating: 91 },
        { name: "말로 귀스토", position: "DF", country: "프랑스", age: 22, rating: 84 },
        { name: "웨슬리 포파나", position: "DF", country: "프랑스", age: 24, rating: 79 },
        { name: "아론 안셀미노", position: "DF", country: "아르헨티나", age: 20, rating: 72 },
        { name: "타이리크 조지", position: "FW", country: "잉글랜드", age: 20, rating: 64 },
        { name: "조시 아체암퐁", position: "DF", country: "잉글랜드", age: 18, rating: 69 },
        { name: "오마리 켈리먼", position: "MF", country: "잉글랜드", age: 19, rating: 66 },
        { name: "마르크 기우", position: "FW", country: "스페인", age: 19, rating: 71 },
        { name: "가브리엘 슬로니나", position: "GK", country: "미국", age: 21, rating: 68 },
        { name: "로메오 라비아", position: "MF", country: "벨기에", age: 21, rating: 82 },
        { name: "제이미 기튼스", position: "FW", country: "잉글랜드", age: 20, rating: 83 }
    ],

    "바이에른 뮌헨": [
        { name: "마누엘 노이어", position: "GK", country: "독일", age: 39, rating: 83 },
        { name: "다요 우파메카노", position: "DF", country: "프랑스", age: 26, rating: 85 },
        { name: "김민재", position: "DF", country: "대한민국", age: 28, rating: 86 },
        { name: "요나단 타", position: "DF", country: "독일", age: 29, rating: 87 },
        { name: "요주아 키미히", position: "MF", country: "독일", age: 30, rating: 90 },
        { name: "세르주 그나브리", position: "FW", country: "독일", age: 30, rating: 77 },
        { name: "레온 고레츠카", position: "MF", country: "독일", age: 30, rating: 85 },
        { name: "해리 케인", position: "FW", country: "잉글랜드", age: 32, rating: 93 },
        { name: "자말 무시알라", position: "MF", country: "독일", age: 22, rating: 93 },
        { name: "킹슬리 코망", position: "FW", country: "프랑스", age: 29, rating: 80 },
        { name: "루이스 디아스", position: "MF", country: "콜롬비아", age: 28, rating: 87 },
        { name: "주앙 팔리냐", position: "MF", country: "포르투갈", age: 30, rating: 79 },
        { name: "마이클 올리세", position: "FW", country: "프랑스", age: 23, rating: 88 },
        { name: "알폰소 데이비스", position: "DF", country: "캐나다", age: 24, rating: 87 },
        { name: "이토 히로키", position: "DF", country: "일본", age: 26, rating: 75 },
        { name: "라파엘 게헤이루", position: "DF", country: "포르투갈", age: 31, rating: 77 },
        { name: "사샤 보이", position: "DF", country: "프랑스", age: 24, rating: 73 },
        { name: "스벤 울라이히", position: "GK", country: "독일", age: 36, rating: 67 },
        { name: "콘라트 라이머", position: "MF", country: "오스트리아", age: 28, rating: 81 },
        { name: "요시프 스타니시치", position: "DF", country: "크로아티아", age: 25, rating: 76 },
        { name: "알렉산다르 파블로비치", position: "MF", country: "독일", age: 21, rating: 85 },
        { name: "파울 바너", position: "MF", country: "독일", age: 19, rating: 67 }
    ],

    "아틀레티코 마드리드": [
        { name: "후안 무소", position: "GK", country: "아르헨티나", age: 31, rating: 70 },
        { name: "호세 히메네스", position: "DF", country: "우루과이", age: 30, rating: 84 },
        { name: "마테오 루제리", position: "DF", country: "이탈리아", age: 23, rating: 79 },
        { name: "코너 갤러거", position: "MF", country: "잉글랜드", age: 25, rating: 83 },
        { name: "조니 카르도주", position: "MF", country: "미국", age: 23, rating: 81 },
        { name: "코케", position: "MF", country: "스페인", age: 33, rating: 82 },
        { name: "앙투안 그리즈만", position: "FW", country: "프랑스", age: 34, rating: 90 },
        { name: "파블로 바리오스", position: "MF", country: "스페인", age: 22, rating: 85 },
        { name: "알렉산데르 쇠를로트", position: "FW", country: "노르웨이", age: 29, rating: 81 },
        { name: "알렉스 바에나", position: "MF", country: "스페인", age: 24, rating: 86 },
        { name: "티아고 알마다", position: "FW", country: "아르헨티나", age: 24, rating: 75 },
        { name: "얀 오블락", position: "GK", country: "슬로베니아", age: 32, rating: 86 },
        { name: "마르코스 요렌테", position: "MF", country: "스페인", age: 30, rating: 84 },
        { name: "클레망 랑글레", position: "DF", country: "프랑스", age: 30, rating: 87 },
        { name: "나우엘 몰리나", position: "DF", country: "아르헨티나", age: 27, rating: 82 },
        { name: "다비드 한츠코", position: "DF", country: "슬로바키아", age: 27, rating: 83 },
        { name: "마르크 푸빌", position: "DF", country: "스페인", age: 22, rating: 67 },
        { name: "훌리안 알바레스", position: "FW", country: "아르헨티나", age: 25, rating: 90 },
        { name: "하비 갈란", position: "DF", country: "스페인", age: 30, rating: 72 },
        { name: "줄리아노 시메오네", position: "FW", country: "아르헨티나", age: 22, rating: 81 },
        { name: "로뱅 르노르망", position: "DF", country: "스페인", age: 28, rating: 82 },
        { name: "카를로스 마르틴", position: "FW", country: "스페인", age: 23, rating: 67 }
    ],

    "도르트문트": [
        { name: "그레고어 코벨", position: "GK", country: "스위스", age: 27, rating: 85 },
        { name: "얀 코투", position: "DF", country: "브라질", age: 23, rating: 82 },
        { name: "발데마르 안톤", position: "DF", country: "독일", age: 29, rating: 78 },
        { name: "니코 슐로터베크", position: "DF", country: "독일", age: 25, rating: 86 },
        { name: "라미 벤세바이니", position: "DF", country: "알제리", age: 30, rating: 81 },
        { name: "살리흐 외즈잔", position: "MF", country: "튀르키예", age: 27, rating: 72 },
        { name: "펠릭스 은메차", position: "MF", country: "독일", age: 24, rating: 80 },
        { name: "세루 기라시", position: "FW", country: "기니", age: 29, rating: 91 },
        { name: "율리안 브란트", position: "MF", country: "독일", age: 29, rating: 86 },
        { name: "파스칼 그로스", position: "MF", country: "독일", age: 34, rating: 83 },
        { name: "막시밀리안 바이어", position: "FW", country: "독일", age: 22, rating: 80 },
        { name: "쥘리앵 뒤랑빌", position: "FW", country: "벨기에", age: 19, rating: 73 },
        { name: "카니 추쿠에메카", position: "MF", country: "잉글랜드", age: 21, rating: 77 },
        { name: "마르셀 자비처", position: "MF", country: "오스트리아", age: 31, rating: 81 },
        { name: "엠레 잔", position: "MF", country: "독일", age: 31, rating: 75 },
        { name: "율리안 뤼에르손", position: "DF", country: "노르웨이", age: 27, rating: 84 },
        { name: "카림 아데예미", position: "FW", country: "독일", age: 23, rating: 85 },
        { name: "실라스 오스트신스키", position: "GK", country: "폴란드", age: 21, rating: 67 },
        { name: "알렉산더 마이어", position: "GK", country: "독일", age: 34, rating: 65 },
        { name: "마르셀 로트카", position: "GK", country: "폴란드", age: 24, rating: 67 },
        { name: "콜 캠벨", position: "FW", country: "미국", age: 19, rating: 70 },
        { name: "키엘 베티엔", position: "MF", country: "독일", age: 19, rating: 67 },
        { name: "알무게라 카바르", position: "DF", country: "독일", age: 19, rating: 66 },
        { name: "다니엘 스벤슨", position: "DF", country: "스웨덴", age: 23, rating: 82 }
    ],

    // 2부 리그
    "유벤투스": [
        { name: "마티아 페린", position: "GK", country: "이탈리아", age: 35, rating: 72 },
        { name: "알베르투 코스타", position: "DF", country: "포르투갈", age: 21, rating: 67 },
        { name: "글레이송 브레메르", position: "DF", country: "브라질", age: 28, rating: 86 },
        { name: "페데리코 가티", position: "DF", country: "이탈리아", age: 27, rating: 83 },
        { name: "마누엘 로카텔리", position: "MF", country: "이탈리아", age: 27, rating: 79 },
        { name: "로이드 켈리", position: "DF", country: "잉글랜드", age: 26, rating: 74 },
        { name: "프란시스쿠 콘세이상", position: "FW", country: "포르투갈", age: 22, rating: 82 },
        { name: "퇸 코프메이너르스", position: "MF", country: "네덜란드", age: 27, rating: 85 },
        { name: "두샨 블라호비치", position: "FW", country: "세르비아", age: 25, rating: 84 },
        { name: "케난 일디즈", position: "FW", country: "튀르키예", age: 20, rating: 87 },
        { name: "니코 곤살레스", position: "FW", country: "아르헨티나", age: 27, rating: 82 },
        { name: "아르카디우스 밀리크", position: "FW", country: "폴란드", age: 31, rating: 69 },
        { name: "피에르 칼룰루", position: "DF", country: "프랑스", age: 25, rating: 80 },
        { name: "웨스턴 맥케니", position: "MF", country: "미국", age: 26, rating: 81 },
        { name: "바실리예 아지치", position: "MF", country: "몬테네그로", age: 19, rating: 67 },
        { name: "케프랑 튀랑", position: "MF", country: "프랑스", age: 24, rating: 84 },
        { name: "랑달 콜로 무아니", position: "FW", country: "프랑스", age: 26, rating: 82 },
        { name: "조너선 데이비드", position: "FW", country: "캐나다", age: 25, rating: 86 },
        { name: "카를로 핀솔리오", position: "GK", country: "이탈리아", age: 35, rating: 66 },
        { name: "도글라스 루이스", position: "MF", country: "브라질", age: 27, rating: 85 },
        { name: "안드레아 캄비아소", position: "DF", country: "이탈리아", age: 25, rating: 86 },
        { name: "미켈레 디그레고리오", position: "GK", country: "이탈리아", age: 28, rating: 80 },
        { name: "후안 카발", position: "DF", country: "콜롬비아", age: 24, rating: 74 },
        { name: "니콜로 사보나", position: "DF", country: "이탈리아", age: 22, rating: 70 },
        { name: "요나스 로우히", position: "DF", country: "스웨덴", age: 21, rating: 68 },
        { name: "사무엘 음방굴라", position: "FW", country: "벨기에", age: 21, rating: 75 }
    ]
    // 다른 팀들의 선수 데이터는 나중에 추가
};

// 기본 선수 데이터 생성 함수
function generateDefaultPlayers(teamName, league) {
    const positions = [
        { pos: 'GK', count: 3 },
        { pos: 'DF', count: 8 },
        { pos: 'MF', count: 8 },
        { pos: 'FW', count: 6 }
    ];
    
    const players = [];
    let playerIndex = 1;
    
    // 리그별 평균 레이팅
    const avgRatings = {
        '1부': { min: 75, max: 95 },
        '2부': { min: 65, max: 85 },
        '3부': { min: 60, max: 80 }
    };
    
    const leagueRating = avgRatings[league] || avgRatings['3부'];
    
    positions.forEach(({ pos, count }) => {
        for (let i = 0; i < count; i++) {
            const rating = Math.floor(Math.random() * (leagueRating.max - leagueRating.min + 1)) + leagueRating.min;
            const age = Math.floor(Math.random() * 15) + 20; // 20-34세
            
            players.push({
                name: `${teamName} 선수${playerIndex}`,
                position: pos,
                country: "미정",
                age: age,
                rating: rating
            });
            playerIndex++;
        }
    });
    
    return players;
}

// 모든 팀의 선수 데이터 확인 및 생성
function ensureAllTeamsHavePlayers() {
    Object.keys(leagueData).forEach(league => {
        leagueData[league].teams.forEach(team => {
            if (!playerDatabase[team.name]) {
                playerDatabase[team.name] = generateDefaultPlayers(team.name, league);
            }
        });
    });
}

// 성장 시스템 초기화
function initializeAllPlayersGrowth() {
    if (typeof playerGrowthSystem !== 'undefined') {
        gameData.allPlayers.forEach(player => {
            playerGrowthSystem.initializeGrowthPotential(player);
        });
    }
}

// 게임 초기화
function initGame() {
    ensureAllTeamsHavePlayers();
    showTeamSelection();
    setupEventListeners();
}

// 팀 선택 화면 표시
function showTeamSelection() {
    document.getElementById('teamSelection').classList.remove('hidden');
    document.getElementById('mainGame').classList.add('hidden');
    displayTeams('1부');
}

// 팀 목록 표시
function displayTeams(league) {
    const teamsGrid = document.getElementById('teamsGrid');
    const teams = leagueData[league].teams;
    
    teamsGrid.innerHTML = '';
    teamsGrid.className = `teams-grid league-${league}`;
    
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.onclick = () => selectTeam(team.name, league);
        
        // 팀 레이팅 계산 (베스트 11 평균)
        const teamRating = calculateTeamRating(team.name);
        const stars = '★'.repeat(Math.floor(teamRating / 20)) + '☆'.repeat(5 - Math.floor(teamRating / 20));
        
        teamCard.innerHTML = `
            <div class="team-name">${team.name}</div>
            <div class="team-country">${team.country}</div>
            <div class="team-motto">${team.motto}</div>
            <div class="team-rating">${stars}</div>
            <div class="team-description">${team.description}</div>
        `;
        
        teamsGrid.appendChild(teamCard);
    });
}

// 팀 레이팅 계산
function calculateTeamRating(teamName) {
    const players = playerDatabase[teamName] || [];
    if (players.length === 0) return 70; // 기본값
    
    // 포지션별 최고 레이팅 선수 선택
    const positions = { GK: [], DF: [], MF: [], FW: [] };
    
    players.forEach(player => {
        if (positions[player.position]) {
            positions[player.position].push(player);
        }
    });
    
    // 각 포지션별로 정렬하고 베스트 선수들 선택
    const bestEleven = [];
    
    // GK 1명
    if (positions.GK.length > 0) {
        positions.GK.sort((a, b) => b.rating - a.rating);
        bestEleven.push(positions.GK[0]);
    }
    
    // DF 4명
    if (positions.DF.length > 0) {
        positions.DF.sort((a, b) => b.rating - a.rating);
        bestEleven.push(...positions.DF.slice(0, 4));
    }
    
    // MF 3명
    if (positions.MF.length > 0) {
        positions.MF.sort((a, b) => b.rating - a.rating);
        bestEleven.push(...positions.MF.slice(0, 3));
    }
    
    // FW 3명
    if (positions.FW.length > 0) {
        positions.FW.sort((a, b) => b.rating - a.rating);
        bestEleven.push(...positions.FW.slice(0, 3));
    }
    
    // 평균 레이팅 계산
    if (bestEleven.length === 0) return 70;
    
    const totalRating = bestEleven.reduce((sum, player) => sum + player.rating, 0);
    return Math.round(totalRating / bestEleven.length);
}

// 팀 선택
function selectTeam(teamName, league) {
    gameData.selectedTeam = teamName;
    gameData.currentLeague = league;
    gameData.teamMoney = leagueData[league].money;
    
    // 선수단 초기화
    initializeSquad(teamName);
    
    // 성장 시스템 초기화
    initializeAllPlayersGrowth();
    
    // 메인 게임 화면으로 전환
    document.getElementById('teamSelection').classList.add('hidden');
    document.getElementById('mainGame').classList.remove('hidden');
    
    // UI 업데이트
    updateHeader();
    showLobby();
    
    // 이적 시장 초기화
    if (typeof initializeTransferMarket === 'function') {
        initializeTransferMarket();
    }
    
    // 리그 테이블 초기화
    if (typeof initializeLeagueTables === 'function') {
        initializeLeagueTables();
    }
    
    // SNS 시스템 초기화
    if (typeof initializeSNS === 'function') {
        initializeSNS();
    }
}

// 선수단 초기화
function initializeSquad(teamName) {
    const players = playerDatabase[teamName] || [];
    
    // 모든 선수를 팀에 추가
    gameData.allPlayers = players.map((player, index) => ({
        ...player,
        id: `${teamName}_${index}`,
        team: teamName,
        goals: 0,
        assists: 0,
        matches: 0,
        growthPotential: player.age <= 25 ? Math.floor(Math.random() * 12) + 3 : 0, // 3-15 성장 가능성
        inSquad: false
    }));
    
    // 포지션별로 최고 선수들을 스쿼드에 배치
    const positions = {
        GK: gameData.allPlayers.filter(p => p.position === 'GK').sort((a, b) => b.rating - a.rating),
        DF: gameData.allPlayers.filter(p => p.position === 'DF').sort((a, b) => b.rating - a.rating),
        MF: gameData.allPlayers.filter(p => p.position === 'MF').sort((a, b) => b.rating - a.rating),
        FW: gameData.allPlayers.filter(p => p.position === 'FW').sort((a, b) => b.rating - a.rating)
    };
    
    // 4-3-3 포메이션으로 배치
    const squadPositions = ['FW', 'FW', 'FW', 'MF', 'MF', 'MF', 'DF', 'DF', 'DF', 'DF', 'GK'];
    
    squadPositions.forEach((pos, index) => {
        if (positions[pos] && positions[pos].length > 0) {
            const player = positions[pos].shift();
            player.inSquad = true;
            gameData.squad[index] = player;
        }
    });
    
    // 나머지 선수들은 벤치로
    gameData.bench = gameData.allPlayers.filter(p => !p.inSquad);
}

// 헤더 업데이트
function updateHeader() {
    document.getElementById('teamName').textContent = gameData.selectedTeam;
    document.getElementById('currentLeague').textContent = `${gameData.currentLeague} 리그`;
    document.getElementById('teamMoney').textContent = `${gameData.teamMoney}억원`;
    document.getElementById('teamMorale').textContent = `${gameData.teamMorale}/100`;
    document.getElementById('currentSponsor').textContent = gameData.currentSponsor || '없음';
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 리그 탭 전환
    document.querySelectorAll('.league-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.league-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            displayTeams(tab.dataset.league);
        });
    });
    
    // 메인 탭 전환
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
            
            // 탭별 초기화
            switch(tab.dataset.tab) {
                case 'squad':
                    displaySquad();
                    break;
                case 'match':
                    if (typeof displayMatch === 'function') displayMatch();
                    break;
                case 'transfer':
                    if (typeof displayTransferMarket === 'function') displayTransferMarket();
                    if (typeof displayMyPlayers === 'function') displayMyPlayers();
                    break;
                case 'statistics':
                    if (typeof displayStatistics === 'function') displayStatistics();
                    break;
                case 'sns':
                    if (typeof displaySNS === 'function') displaySNS();
                    break;
                case 'settings':
                    displaySettings();
                    break;
            }
        });
    });
    
    // 모달 닫기
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // 모달 배경 클릭으로 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // 경기 시작 버튼
    const startMatchBtn = document.getElementById('startMatch');
    if (startMatchBtn) {
        startMatchBtn.addEventListener('click', () => {
            if (typeof startMatch === 'function') {
                startMatch();
            }
        });
    }
    
    // 이적 시장 새로고침
    const refreshBtn = document.getElementById('refreshTransferMarket');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (typeof refreshTransferMarket === 'function') {
                refreshTransferMarket();
            }
        });
    }
    
    // 게임 저장/불러오기
    const saveBtn = document.getElementById('saveGame');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (typeof saveGame === 'function') {
                saveGame();
            }
        });
    }
    
    const loadBtn = document.getElementById('loadGame');
    if (loadBtn) {
        loadBtn.addEventListener('change', () => {
            if (typeof loadGame === 'function') {
                loadGame();
            }
        });
    }
}

// 로비 표시
function showLobby() {
    // 다음 경기 정보 표시
    const nextOpponent = getNextOpponent();
    
    const homeTeamEl = document.getElementById('homeTeam');
    const awayTeamEl = document.getElementById('awayTeam');
    const matchWeekEl = document.getElementById('matchWeek');
    const currentLeagueNameEl = document.getElementById('currentLeagueName');
    
    if (homeTeamEl) homeTeamEl.textContent = gameData.selectedTeam;
    if (awayTeamEl) awayTeamEl.textContent = nextOpponent;
    if (matchWeekEl) matchWeekEl.textContent = `${gameData.matchDay}라운드`;
    if (currentLeagueNameEl) currentLeagueNameEl.textContent = `${gameData.currentLeague} 리그`;
    
    // 팀 상태 업데이트
    const currentPositionEl = document.getElementById('currentPosition');
    const matchesPlayedEl = document.getElementById('matchesPlayed');
    const currentSeasonEl = document.getElementById('currentSeason');
    
    if (currentPositionEl) currentPositionEl.textContent = '1위'; // TODO: 실제 순위 계산
    if (matchesPlayedEl) matchesPlayedEl.textContent = `${gameData.matchesPlayed}경기`;
    if (currentSeasonEl) currentSeasonEl.textContent = `${gameData.season}시즌`;
}

// 다음 상대팀 가져오기
function getNextOpponent() {
    const teams = leagueData[gameData.currentLeague].teams;
    const currentIndex = teams.findIndex(team => team.name === gameData.selectedTeam);
    const opponentIndex = (currentIndex + gameData.matchDay) % teams.length;
    return teams[opponentIndex].name;
}

// 스쿼드 표시
function displaySquad() {
    // 스쿼드 선수들 표시
    gameData.squad.forEach((player, index) => {
        const slot = document.querySelector(`[data-index="${index}"]`);
        if (slot) {
            if (player) {
                slot.textContent = `${player.name} (${player.rating})`;
                slot.classList.add('filled');
            } else {
                slot.textContent = slot.getAttribute('data-position') || 'Empty';
                slot.classList.remove('filled');
            }
            
            // 클릭 이벤트 추가
            slot.onclick = () => openPlayerSelectModal(index);
        }
    });
    
    // 벤치 선수들 표시
    const benchContainer = document.getElementById('benchPlayers');
    if (benchContainer) {
        benchContainer.innerHTML = '';
        
        gameData.bench.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'bench-player';
            playerDiv.innerHTML = `
                <div style="font-weight: bold;">${player.name}</div>
                <div>${player.position} | ${player.country} | ${player.age}세</div>
                <div>레이팅: ${player.rating}</div>
            `;
            playerDiv.onclick = () => {
                // 벤치 선수 클릭 시 스쿼드로 이동할 포지션 선택
                const compatiblePositions = getCompatiblePositions(player.position);
                if (compatiblePositions.length > 0) {
                    // 첫 번째 호환 포지션으로 이동
                    const emptySlot = compatiblePositions.find(pos => !gameData.squad[pos]);
                    if (emptySlot !== undefined) {
                        swapPlayers(null, emptySlot, player);
                        displaySquad();
                    }
                }
            };
            benchContainer.appendChild(playerDiv);
        });
    }
}

// 호환 포지션 가져오기
function getCompatiblePositions(position) {
    const positionMap = {
        'GK': [10],
        'DF': [6, 7, 8, 9],
        'MF': [3, 4, 5],
        'FW': [0, 1, 2]
    };
    return positionMap[position] || [];
}

// 선수 선택 모달 열기
function openPlayerSelectModal(squadIndex) {
    const modal = document.getElementById('playerSelectModal');
    const playerList = document.getElementById('modalPlayerList');
    
    if (!modal || !playerList) return;
    
    // 현재 포지션과 호환되는 선수들 필터링
    const currentPlayer = gameData.squad[squadIndex];
    const requiredPosition = getPositionByIndex(squadIndex);
    const availablePlayers = gameData.allPlayers.filter(player => 
        player.position === requiredPosition && (!player.inSquad || player === currentPlayer)
    );
    
    playerList.innerHTML = '';
    
    availablePlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'modal-player';
        playerDiv.innerHTML = `
            <div style="font-weight: bold;">${player.name}</div>
            <div>${player.position} | ${player.country} | ${player.age}세 | 레이팅: ${player.rating}</div>
            ${player.inSquad ? '<div style="color: #667eea;">(현재 스쿼드)</div>' : ''}
        `;
        playerDiv.onclick = () => {
            swapPlayers(currentPlayer, squadIndex, player);
            closeModal();
            displaySquad();
        };
        playerList.appendChild(playerDiv);
    });
    
    modal.classList.remove('hidden');
}

// 인덱스로 포지션 가져오기
function getPositionByIndex(index) {
    const positions = ['FW', 'FW', 'FW', 'MF', 'MF', 'MF', 'DF', 'DF', 'DF', 'DF', 'GK'];
    return positions[index];
}

// 선수 교체
function swapPlayers(currentPlayer, squadIndex, newPlayer) {
    // 현재 선수를 벤치로
    if (currentPlayer) {
        currentPlayer.inSquad = false;
        gameData.bench.push(currentPlayer);
    }
    
    // 새 선수를 스쿼드로
    if (newPlayer) {
        newPlayer.inSquad = true;
        gameData.squad[squadIndex] = newPlayer;
        
        // 벤치에서 제거
        const benchIndex = gameData.bench.indexOf(newPlayer);
        if (benchIndex > -1) {
            gameData.bench.splice(benchIndex, 1);
        }
    } else {
        gameData.squad[squadIndex] = null;
    }
}

// 모달 닫기
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// 설정 화면 표시
function displaySettings() {
    displayTacticsMatrix();
    displayPlayerPotentials();
}

// 전술 매트릭스 표시
function displayTacticsMatrix() {
    if (typeof tacticsSystem !== 'undefined' && typeof tacticsSystem.displayTacticsMatrix === 'function') {
        tacticsSystem.displayTacticsMatrix();
    }
}

// 선수 잠재력 표시
function displayPlayerPotentials() {
    const container = document.getElementById('potentialList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (typeof playerGrowthSystem !== 'undefined' && typeof playerGrowthSystem.getTeamGrowthSummary === 'function') {
        const potentials = playerGrowthSystem.getTeamGrowthSummary();
        
        potentials.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'potential-player';
            playerDiv.innerHTML = `
                <div class="player-name">${player.name}</div>
                <div class="player-info">${player.position} | ${player.age}세 | 현재: ${player.rating}</div>
                <div class="potential-info">잠재력: +${player.growthPotential} | 최대: ${player.maxPotential}</div>
                <div class="growth-rate">성장률: ${player.growthRate}%</div>
            `;
            container.appendChild(playerDiv);
        });
    } else {
        container.innerHTML = '<div>선수 성장 시스템이 로드되지 않았습니다.</div>';
    }
}

// 통계 화면 표시 (기본 구현)
function displayStatistics() {
    const statsContainer = document.getElementById('teamStats');
    if (!statsContainer) return;
    
    // 기본 통계 표시
    const stats = {
        totalMatches: gameData.matchesPlayed,
        wins: Math.floor(gameData.matchesPlayed * 0.6), // 임시 데이터
        draws: Math.floor(gameData.matchesPlayed * 0.2),
        losses: Math.floor(gameData.matchesPlayed * 0.2),
        goalsFor: Math.floor(gameData.matchesPlayed * 2.1),
        goalsAgainst: Math.floor(gameData.matchesPlayed * 1.2)
    };
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-label">경기 수</div>
            <div class="stat-value">${stats.totalMatches}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">승리</div>
            <div class="stat-value">${stats.wins}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">무승부</div>
            <div class="stat-value">${stats.draws}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">패배</div>
            <div class="stat-value">${stats.losses}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">득점</div>
            <div class="stat-value">${stats.goalsFor}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">실점</div>
            <div class="stat-value">${stats.goalsAgainst}</div>
        </div>
    `;
}

// 게임 저장
function saveGame() {
    try {
        const saveData = {
            gameData: gameData,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(saveData);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `football_manager_save_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        
        alert('게임이 저장되었습니다!');
    } catch (error) {
        console.error('저장 실패:', error);
        alert('게임 저장에 실패했습니다.');
    }
}

// 게임 불러오기
function loadGame(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const saveData = JSON.parse(e.target.result);
            
            // 게임 데이터 복원
            Object.assign(gameData, saveData.gameData);
            
            // UI 업데이트
            updateHeader();
            showLobby();
            
            // 현재 활성 탭에 따라 화면 갱신
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabName = activeTab.dataset.tab;
                switch(tabName) {
                    case 'squad':
                        displaySquad();
                        break;
                    case 'statistics':
                        displayStatistics();
                        break;
                    case 'settings':
                        displaySettings();
                        break;
                }
            }
            
            alert('게임이 불러와졌습니다!');
        } catch (error) {
            console.error('불러오기 실패:', error);
            alert('게임 불러오기에 실패했습니다.');
        }
    };
    reader.readAsText(file);
}

// 게임 시작 시 초기화
document.addEventListener('DOMContentLoaded', initGame);
