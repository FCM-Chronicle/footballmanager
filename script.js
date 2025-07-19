// 게임 데이터
let gameData = {
    selectedTeam: null,
    teamMoney: 1000,
    teamMorale: 50,
    currentSeason: 1,
    matchesPlayed: 0,
    currentTactic: 'gegenPressing',
    sponsor: null,
    squad: {
        gk: null,
        df: [null, null, null, null],
        mf: [null, null, null],
        fw: [null, null, null]
    },
    leagueTable: {},
    playerGrowthData: {},
    transferSystemData: {},
    snsData: {
        posts: [],
        lastPostId: 0
    }
};

// 팀 이름 매핑
const teamNames = {
    tottenham: "토트넘 홋스퍼",
    liverpool: "리버풀",
    manCity: "맨체스터 시티",
    arsenal: "아스널",
    manUnited: "맨체스터 유나이티드",
    chelsea: "첼시",
    realMadrid: "레알 마드리드",
    barcelona: "바르셀로나",
    acMilan: "AC 밀란",
    inter: "인터 밀란",
    bayern: "바이에른 뮌헨",
    psg: "파리 생제르맹",
    leverkusen: "바이어 레버쿠젠",
    dortmund: "보루시아 도르트문트",
    newCastle: "뉴캐슬 유나이티드",
    asRoma: "AS 로마",
    atMadrid: "아틀레티코 마드리드",
    napoli: "나폴리"
};

// 팀 데이터
const teams = {
    tottenham: [
        { name: "비카리오", position: "GK", rating: 82, age: 27 },
        { name: "레길론", position: "DF", rating: 78, age: 27 },
        { name: "드라구신", position: "DF", rating: 75, age: 24 },
        { name: "손흥민", position: "FW", rating: 90, age: 31 },
        { name: "비수마", position: "MF", rating: 80, age: 28 },
        { name: "히샬리송", position: "FW", rating: 83, age: 26 },
        { name: "매디슨", position: "MF", rating: 85, age: 27 },
        { name: "우도기", position: "DF", rating: 76, age: 25 },
        { name: "그레이", position: "MF", rating: 81, age: 24 },
        { name: "베리발", position: "FW", rating: 77, age: 23 },
        { name: "베르너", position: "FW", rating: 75, age: 29 },
        { name: "로메로", position: "DF", rating: 85, age: 25 },
        { name: "솔랑케", position: "FW", rating: 78, age: 26 },
        { name: "포스터", position: "GK", rating: 70, age: 24 },
        { name: "마티스 텔", position: "FW", rating: 81, age: 19 },
        { name: "쿨루셉스키", position: "FW", rating: 84, age: 23 },
        { name: "케빈 단소", position: "DF", rating: 81, age: 26 },
        { name: "존슨", position: "MF", rating: 76, age: 25 },
        { name: "페드로 포로", position: "DF", rating: 78, age: 24 },
        { name: "스펜스", position: "DF", rating: 74, age: 22 },
        { name: "오도베르", position: "MF", rating: 72, age: 21 },
        { name: "P. M. 사르", position: "MF", rating: 70, age: 21 },
        { name: "벤탕쿠르", position: "MF", rating: 82, age: 26 },
        { name: "데이비스", position: "DF", rating: 77, age: 30 },
        { name: "판더펜", position: "DF", rating: 73, age: 22 },
        { name: "오스틴", position: "GK", rating: 71, age: 25 },
        { name: "화이트먼", position: "DF", rating: 69, age: 23 },
        { name: "양민혁", position: "MF", rating: 78, age: 18 }
    ],
    liverpool: [
        { name: "A. 베케르", position: "GK", rating: 81, age: 27 },
        { name: "고메즈", position: "DF", rating: 78, age: 26 },
        { name: "엔도", position: "MF", rating: 76, age: 25 },
        { name: "버질", position: "DF", rating: 90, age: 31 },
        { name: "코나테", position: "DF", rating: 84, age: 24 },
        { name: "루이스 디아스", position: "FW", rating: 82, age: 26 },
        { name: "소보슬라이", position: "MF", rating: 79, age: 22 },
        { name: "다르윈", position: "FW", rating: 85, age: 25 },
        { name: "맥 알리스터", position: "MF", rating: 83, age: 25 },
        { name: "M. 살라", position: "FW", rating: 92, age: 31 },
        { name: "키에사", position: "FW", rating: 80, age: 25 },
        { name: "존스", position: "MF", rating: 75, age: 22 },
        { name: "각포", position: "MF", rating: 74, age: 23 },
        { name: "엘리엇", position: "MF", rating: 76, age: 20 },
        { name: "디오구 J.", position: "FW", rating: 78, age: 26 },
        { name: "치미카스", position: "DF", rating: 73, age: 27 },
        { name: "로버트슨", position: "DF", rating: 83, age: 29 },
        { name: "흐라벤베르흐", position: "MF", rating: 72, age: 21 },
        { name: "야로스", position: "GK", rating: 70, age: 23 },
        { name: "켈러허", position: "GK", rating: 77, age: 25 },
        { name: "콴사", position: "DF", rating: 71, age: 19 },
        { name: "모튼", position: "MF", rating: 69, age: 20 },
        { name: "브래들리", position: "MF", rating: 68, age: 22 },
        { name: "데이비스", position: "DF", rating: 72, age: 25 }
    ],
    manCity: [
        { name: "후벵 디아스", position: "DF", rating: 85, age: 29 },
        { name: "스톤스", position: "DF", rating: 82, age: 29 },
        { name: "아케", position: "DF", rating: 78, age: 24 },
        { name: "코바치치", position: "MF", rating: 81, age: 29 },
        { name: "홀란드", position: "FW", rating: 92, age: 23 },
        { name: "그릴리쉬", position: "FW", rating: 84, age: 28 },
        { name: "로드리고", position: "MF", rating: 79, age: 27 },
        { name: "오르테가 모레노", position: "GK", rating: 75, age: 30 },
        { name: "귄도안", position: "MF", rating: 83, age: 32 },
        { name: "베르나르두", position: "MF", rating: 87, age: 29 },
        { name: "그바르디올", position: "DF", rating: 82, age: 22 },
        { name: "아칸지", position: "DF", rating: 80, age: 28 },
        { name: "사비뉴", position: "MF", rating: 76, age: 25 },
        { name: "마테우스 N.", position: "MF", rating: 74, age: 23 },
        { name: "에데르송 M.", position: "GK", rating: 88, age: 30 },
        { name: "카슨", position: "GK", rating: 70, age: 35 },
        { name: "포든", position: "MF", rating: 85, age: 23 },
        { name: "리코 루이스", position: "DF", rating: 72, age: 19 },
        { name: "매카티", position: "MF", rating: 71, age: 20 },
        { name: "윌슨-에스브랜드", position: "FW", rating: 73, age: 21 }
    ],
    arsenal: [
        { name: "키어런 티어니", position: "DF", rating: 80, age: 26 },
        { name: "벤 화이트", position: "DF", rating: 82, age: 25 },
        { name: "토마스 파티", position: "MF", rating: 85, age: 30 },
        { name: "가브리엘 마갈량이스", position: "DF", rating: 83, age: 25 },
        { name: "부카요 사카", position: "FW", rating: 88, age: 22 },
        { name: "마르틴 외데고르", position: "MF", rating: 87, age: 25 },
        { name: "가브리엘 제주스", position: "FW", rating: 84, age: 26 },
        { name: "가브리엘 마르티넬리", position: "FW", rating: 86, age: 22 },
        { name: "유리언 팀버르", position: "DF", rating: 78, age: 23 },
        { name: "야쿠프 키비오르", position: "DF", rating: 76, age: 24 },
        { name: "올렉산드르 진첸코", position: "DF", rating: 81, age: 27 },
        { name: "도미야스 다케히로", position: "DF", rating: 79, age: 26 },
        { name: "레안드로 트로사르", position: "FW", rating: 80, age: 28 },
        { name: "조르지뉴", position: "MF", rating: 82, age: 31 },
        { name: "다비드 라야", position: "GK", rating: 83, age: 28 },
        { name: "미켈 메리노", position: "MF", rating: 77, age: 26 },
        { name: "카이 하베르츠", position: "FW", rating: 84, age: 24 },
        { name: "라힘 스털링", position: "FW", rating: 85, age: 29 },
        { name: "리카르도 칼라피오리", position: "DF", rating: 74, age: 22 },
        { name: "데클런 라이스", position: "MF", rating: 86, age: 24 }
    ],
    manUnited: [
        { name: "알타이 바이은드르", position: "GK", rating: 78, age: 25 },
        { name: "빅토르 린델뢰프", position: "DF", rating: 80, age: 29 },
        { name: "누사이르 마즈라위", position: "DF", rating: 82, age: 25 },
        { name: "마테이스 더 리흐트", position: "DF", rating: 85, age: 25 },
        { name: "해리 매과이어", position: "DF", rating: 79, age: 30 },
        { name: "리산드로 마르티네스", position: "DF", rating: 81, age: 25 },
        { name: "메이슨 마운트", position: "MF", rating: 84, age: 24 },
        { name: "브루노 페르난데스", position: "MF", rating: 88, age: 29 },
        { name: "라스무스 호일룬", position: "FW", rating: 80, age: 20 },
        { name: "마커스 래시퍼드", position: "FW", rating: 86, age: 26 },
        { name: "조슈아 지르크제이", position: "FW", rating: 75, age: 23 },
        { name: "티렐 말라시아", position: "DF", rating: 77, age: 24 },
        { name: "크리스티안 에릭센", position: "MF", rating: 83, age: 31 },
        { name: "레니 요로", position: "DF", rating: 74, age: 21 },
        { name: "아마드 디알로", position: "FW", rating: 78, age: 21 },
        { name: "알레한드로 가르나초", position: "FW", rating: 76, age: 19 },
        { name: "카세미루", position: "MF", rating: 86, age: 31 },
        { name: "디오구 달로", position: "DF", rating: 79, age: 23 },
        { name: "안토니", position: "FW", rating: 82, age: 23 },
        { name: "톰 히턴", position: "GK", rating: 75, age: 36 },
        { name: "루크 쇼", position: "DF", rating: 81, age: 28 },
        { name: "앙드레 오나나", position: "GK", rating: 84, age: 27 },
        { name: "마누엘 우가르테", position: "MF", rating: 73, age: 23 },
        { name: "조니 에번스", position: "DF", rating: 72, age: 35 },
        { name: "에단 휘틀리", position: "GK", rating: 70, age: 20 },
        { name: "코비 마이누", position: "MF", rating: 71, age: 19 },
        { name: "해리 애머스", position: "DF", rating: 68, age: 21 },
        { name: "토비 콜리어", position: "DF", rating: 69, age: 22 },
        { name: "대니얼 고어", position: "GK", rating: 67, age: 22 }
    ],
    realMadrid: [
        { name: "티보 쿠르투아", position: "GK", rating: 90, age: 31 },
        { name: "다니 카르바할", position: "DF", rating: 80, age: 31 },
        { name: "에데르 밀리탕", position: "DF", rating: 84, age: 25 },
        { name: "데이비드 알라바", position: "DF", rating: 82, age: 30 },
        { name: "주드 벨링엄", position: "MF", rating: 91, age: 20 },
        { name: "에두아르도 카마빙가", position: "MF", rating: 84, age: 21 },
        { name: "비니시우스 주니오르", position: "FW", rating: 89, age: 23 },
        { name: "페데리코 발베르데", position: "MF", rating: 85, age: 25 },
        { name: "킬리안 음바페", position: "FW", rating: 93, age: 25 },
        { name: "루카 모드리치", position: "MF", rating: 88, age: 38 },
        { name: "호드리구", position: "FW", rating: 88, age: 22 },
        { name: "안드리 루닌", position: "GK", rating: 76, age: 24 },
        { name: "오렐리앵 추아메니", position: "MF", rating: 81, age: 23 },
        { name: "아르다 귈러", position: "FW", rating: 78, age: 19 },
        { name: "엔드릭", position: "FW", rating: 75, age: 18 },
        { name: "루카스 바스케스", position: "DF", rating: 77, age: 32 },
        { name: "헤수스 바예호", position: "DF", rating: 74, age: 25 },
        { name: "다니 세바요스", position: "MF", rating: 79, age: 27 },
        { name: "프란 가르시아", position: "DF", rating: 73, age: 24 },
        { name: "안토니오 뤼디거", position: "DF", rating: 85, age: 30 },
        { name: "페를랑 멘디", position: "DF", rating: 80, age: 28 }
    ],
    barcelona: [
        { name: "마르크-안드레 테어 슈테겐", position: "GK", rating: 89, age: 31 },
        { name: "파우 쿠바르시", position: "DF", rating: 78, age: 23 },
        { name: "알레한드로 발데", position: "DF", rating: 80, age: 20 },
        { name: "로날드 아라우호", position: "DF", rating: 84, age: 24 },
        { name: "이니고 마르티네스", position: "DF", rating: 82, age: 32 },
        { name: "가비", position: "MF", rating: 83, age: 19 },
        { name: "페란 토레스", position: "FW", rating: 81, age: 23 },
        { name: "페드리", position: "MF", rating: 88, age: 20 },
        { name: "로베르트 레반도프스키", position: "FW", rating: 91, age: 35 },
        { name: "안수 파티", position: "FW", rating: 80, age: 20 },
        { name: "하피냐", position: "FW", rating: 85, age: 26 },
        { name: "이냐키 페냐", position: "GK", rating: 76, age: 23 },
        { name: "파블로 토레", position: "MF", rating: 75, age: 19 },
        { name: "안드레아스 크리스텐센", position: "DF", rating: 80, age: 27 },
        { name: "페르민 로페스", position: "MF", rating: 78, age: 23 },
        { name: "마르크 카사도", position: "DF", rating: 73, age: 21 },
        { name: "파우 빅토르", position: "DF", rating: 70, age: 21 },
        { name: "라민 야말", position: "FW", rating: 86, age: 17 },
        { name: "다니 올모", position: "MF", rating: 80, age: 25 },
        { name: "프렝키 더 용", position: "MF", rating: 86, age: 26 },
        { name: "쥘 쿤데", position: "DF", rating: 83, age: 25 },
        { name: "에리크 가르시아", position: "DF", rating: 79, age: 24 },
        { name: "보이치에흐 슈쳉스니", position: "GK", rating: 81, age: 33 }
    ],
    acMilan: [
        { name: "다비데 칼라브리아", position: "DF", rating: 80, age: 26 },
        { name: "이스마엘 벤나세르", position: "MF", rating: 82, age: 25 },
        { name: "알바로 모라타", position: "FW", rating: 85, age: 30 },
        { name: "루빈 로프터스치크", position: "MF", rating: 80, age: 28 },
        { name: "루카 요비치", position: "FW", rating: 78, age: 25 },
        { name: "하파엘 레앙", position: "FW", rating: 86, age: 24 },
        { name: "크리스천 풀리식", position: "FW", rating: 81, age: 25 },
        { name: "티자니 라인더르스", position: "DF", rating: 75, age: 20 },
        { name: "마이크 메냥", position: "GK", rating: 86, age: 27 },
        { name: "노아 오카포르", position: "DF", rating: 76, age: 22 },
        { name: "케빈 체롤리", position: "MF", rating: 74, age: 19 },
        { name: "테오 에르난데스", position: "DF", rating: 85, age: 26 },
        { name: "알렉스 히메네스", position: "DF", rating: 78, age: 33 },
        { name: "새뮤얼 추쿠에제", position: "FW", rating: 81, age: 24 },
        { name: "에메르송 로얄", position: "DF", rating: 79, age: 24 },
        { name: "피카요 토모리", position: "DF", rating: 82, age: 25 },
        { name: "알레산드로 플로렌치", position: "DF", rating: 77, age: 33 },
        { name: "말릭 티아우", position: "DF", rating: 74, age: 23 },
        { name: "유수프 포파나", position: "DF", rating: 76, age: 25 },
        { name: "스트라히냐 파블로비치", position: "DF", rating: 75, age: 24 },
        { name: "필리포 테라치아노", position: "GK", rating: 72, age: 27 },
        { name: "마테오 가비아", position: "DF", rating: 70, age: 23 },
        { name: "마르코 스포르티엘로", position: "GK", rating: 73, age: 30 },
        { name: "유누스 무사", position: "MF", rating: 78, age: 21 },
        { name: "태미 에이브러햄", position: "FW", rating: 84, age: 26 },
        { name: "로렌초 토리아니", position: "GK", rating: 71, age: 22 }
    ],
    inter: [
        { name: "얀 조머", position: "GK", rating: 84, age: 30 },
        { name: "덴젤 둠프리스", position: "DF", rating: 81, age: 26 },
        { name: "스테판 더브레이", position: "DF", rating: 82, age: 29 },
        { name: "피오트르 지엘린스키", position: "MF", rating: 80, age: 28 },
        { name: "마르코 아르나우토비치", position: "FW", rating: 78, age: 34 },
        { name: "마르쿠스 튀람", position: "FW", rating: 84, age: 25 },
        { name: "라우타로 마르티네스", position: "FW", rating: 89, age: 26 },
        { name: "호아킨 코레아", position: "FW", rating: 79, age: 29 },
        { name: "라파엘레 디 젠나로", position: "DF", rating: 76, age: 24 },
        { name: "조제프 마르티네스", position: "FW", rating: 75, age: 26 },
        { name: "프란체스코 아체르비", position: "DF", rating: 80, age: 30 },
        { name: "다비데 프라테시", position: "DF", rating: 78, age: 25 },
        { name: "테이존 뷰캐넌", position: "DF", rating: 74, age: 22 },
        { name: "하칸 찰하노글루", position: "MF", rating: 83, age: 29 },
        { name: "크리스티안 아슬라니", position: "MF", rating: 76, age: 22 },
        { name: "헨리크 미키타리안", position: "MF", rating: 81, age: 34 },
        { name: "니콜로 바렐라", position: "MF", rating: 85, age: 26 },
        { name: "뱅자맹 파바르", position: "DF", rating: 79, age: 27 },
        { name: "카를루스 아우구스투", position: "DF", rating: 75, age: 29 },
        { name: "얀 아우렐 비세크", position: "DF", rating: 73, age: 25 },
        { name: "페데리코 디마르코", position: "DF", rating: 78, age: 25 },
        { name: "마테오 다르미안", position: "DF", rating: 76, age: 33 },
        { name: "알레산드로 바스토니", position: "DF", rating: 80, age: 24 },
        { name: "실바노 스카르파", position: "FW", rating: 77, age: 26 }
    ],
    bayern: [
        { name: "마누엘 노이어", position: "GK", rating: 90, age: 37 },
        { name: "다요 우파메카노", position: "DF", rating: 83, age: 25 },
        { name: "김민재", position: "DF", rating: 84, age: 27 },
        { name: "요주아 키미히", position: "MF", rating: 88, age: 28 },
        { name: "세르주 그나브리", position: "FW", rating: 85, age: 28 },
        { name: "레온 고레츠카", position: "MF", rating: 84, age: 28 },
        { name: "해리 케인", position: "FW", rating: 92, age: 30 },
        { name: "리로이 자네", position: "FW", rating: 86, age: 28 },
        { name: "킹슬레 코망", position: "FW", rating: 82, age: 28 },
        { name: "알폰소 데이비스", position: "DF", rating: 87, age: 23 },
        { name: "주앙 팔리냐", position: "MF", rating: 80, age: 28 },
        { name: "다니엘 페레츠", position: "GK", rating: 75, age: 26 },
        { name: "다니엘 산체스", position: "DF", rating: 79, age: 28 },
        { name: "하파엘 게헤이루", position: "DF", rating: 78, age: 27 },
        { name: "마이클 올리스", position: "MF", rating: 76, age: 25 },
        { name: "다니엘 베르너", position: "FW", rating: 79, age: 28 },
        { name: "이토 히로키", position: "DF", rating: 72, age: 26 },
        { name: "타레크 부흐만", position: "MF", rating: 74, age: 22 },
        { name: "마르코 레흐너", position: "DF", rating: 73, age: 21 },
        { name: "자말 무시알라", position: "FW", rating: 81, age: 20 },
        { name: "스벤 울라이히", position: "GK", rating: 76, age: 29 },
        { name: "콘라트 라이머", position: "MF", rating: 75, age: 29 },
        { name: "요시프 스타니시치", position: "DF", rating: 73, age: 23 },
        { name: "알렉산다르 파블로비치", position: "DF", rating: 72, age: 27 }
    ],
    psg: [
        { name: "잔루이지 돈나룸마", position: "GK", rating: 89, age: 24 },
        { name: "아슈라프 하키미", position: "DF", rating: 85, age: 25 },
        { name: "프레스넬 킴펨베", position: "DF", rating: 83, age: 28 },
        { name: "마르키뉴스", position: "DF", rating: 87, age: 29 },
        { name: "파비안 루이스", position: "MF", rating: 81, age: 27 },
        { name: "곤살루 하무스", position: "FW", rating: 82, age: 27 },
        { name: "우스만 뎀벨레", position: "FW", rating: 80, age: 26 },
        { name: "마르코 아센시오", position: "FW", rating: 82, age: 31 },
        { name: "데지레 두에", position: "MF", rating: 76, age: 25 },
        { name: "비티냐", position: "MF", rating: 81, age: 23 },
        { name: "이강인", position: "MF", rating: 85, age: 22 },
        { name: "루카스 에르난데스", position: "DF", rating: 82, age: 27 },
        { name: "랑달 콜로 무아니", position: "FW", rating: 81, age: 24 },
        { name: "세니 마율루", position: "DF", rating: 75, age: 23 },
        { name: "누누 멘데스", position: "DF", rating: 82, age: 21 },
        { name: "브래들리 바르콜라", position: "FW", rating: 74, age: 22 },
        { name: "워렌 자이르에메리", position: "MF", rating: 77, age: 18 },
        { name: "루카스 베라우두", position: "MF", rating: 72, age: 20 },
        { name: "밀란 슈크리니아르", position: "DF", rating: 84, age: 28 },
        { name: "마트베이 사포노프", position: "GK", rating: 75, age: 29 },
        { name: "크바라츠헬리아", position: "FW", rating: 90, age: 22 },
        { name: "요람 자그", position: "DF", rating: 70, age: 21 },
        { name: "이브라힘 음바예", position: "FW", rating: 73, age: 22 },
        { name: "주앙 네베스", position: "MF", rating: 78, age: 23 },
        { name: "아르나우 테나스", position: "GK", rating: 76, age: 22 }
    ],
    leverkusen: [
        { name: "루카시 흐라데츠키", position: "GK", rating: 85, age: 31 },
        { name: "피에로 인카피에", position: "DF", rating: 78, age: 25 },
        { name: "조나탕 타", position: "DF", rating: 82, age: 29 },
        { name: "요나스 호프만", position: "FW", rating: 80, age: 30 },
        { name: "로베르트 안드리히", position: "MF", rating: 79, age: 27 },
        { name: "플로리안 비르츠", position: "MF", rating: 88, age: 20 },
        { name: "마르탱 테리에", position: "FW", rating: 81, age: 27 },
        { name: "에드몽 탑소바", position: "DF", rating: 81, age: 24 },
        { name: "아르투르", position: "FW", rating: 76, age: 26 },
        { name: "파트리크 시크", position: "FW", rating: 84, age: 28 },
        { name: "마테이 코바르시", position: "DF", rating: 75, age: 23 },
        { name: "네이선 텔러", position: "FW", rating: 77, age: 25 },
        { name: "알렉스 그리말도", position: "DF", rating: 79, age: 28 },
        { name: "아민 아들리", position: "FW", rating: 78, age: 26 },
        { name: "빅터 보니페이스", position: "MF", rating: 74, age: 22 },
        { name: "노르디 무키엘레", position: "DF", rating: 82, age: 25 },
        { name: "알레시 가르시아", position: "DF", rating: 76, age: 24 },
        { name: "에세키엘 팔라시오스", position: "FW", rating: 75, age: 23 },
        { name: "제레미 프림퐁", position: "DF", rating: 77, age: 27 },
        { name: "그라니트 자카", position: "MF", rating: 83, age: 31 },
        { name: "니클라스 롬브", position: "DF", rating: 72, age: 24 },
        { name: "사디크 포파나", position: "FW", rating: 74, age: 23 },
        { name: "주누엘 벨로시앙", position: "DF", rating: 73, age: 25 },
        { name: "아이만 아우리르", position: "FW", rating: 70, age: 22 }
    ],
    dortmund: [
        { name: "그레고어 코벨", position: "GK", rating: 84, age: 25 },
        { name: "얀 코투", position: "DF", rating: 77, age: 26 },
        { name: "발데마르 안톤", position: "DF", rating: 76, age: 24 },
        { name: "니코 슐로터베크", position: "DF", rating: 82, age: 24 },
        { name: "라미 벤세바이니", position: "DF", rating: 80, age: 28 },
        { name: "지오바니 레이나", position: "MF", rating: 81, age: 21 },
        { name: "펠릭스 은메차", position: "FW", rating: 79, age: 22 },
        { name: "세루 기라시", position: "FW", rating: 77, age: 26 },
        { name: "율리안 브란트", position: "MF", rating: 83, age: 27 },
        { name: "파스칼 그로스", position: "MF", rating: 78, age: 28 },
        { name: "막시밀리안 바이어", position: "DF", rating: 76, age: 26 },
        { name: "쥘리앵 듀렁빌", position: "DF", rating: 75, age: 25 },
        { name: "마르셀 자비처", position: "DF", rating: 74, age: 27 },
        { name: "도니얼 말런", position: "FW", rating: 78, age: 25 },
        { name: "엠레 잔", position: "MF", rating: 84, age: 30 },
        { name: "니클라스 쥘레", position: "DF", rating: 83, age: 29 },
        { name: "율리안 뤼에르손", position: "DF", rating: 73, age: 23 },
        { name: "카림 아데예미", position: "FW", rating: 79, age: 22 },
        { name: "실라스 오스트르진스키", position: "DF", rating: 72, age: 21 },
        { name: "알렉산더 마이어", position: "GK", rating: 75, age: 32 },
        { name: "마르셀 로트카", position: "GK", rating: 71, age: 24 },
        { name: "콜 캠벨", position: "FW", rating: 70, age: 23 },
        { name: "키엘 베티엔", position: "DF", rating: 68, age: 25 },
        { name: "제이미 기튼스", position: "FW", rating: 69, age: 20 }
    ],
    newCastle: [
        { name: "두브라프카", position: "GK", rating: 85, age: 35 },
        { name: "트리피어", position: "DF", rating: 83, age: 34 },
        { name: "보트만", position: "DF", rating: 82, age: 24 },
        { name: "셰어", position: "DF", rating: 80, age: 32 },
        { name: "라셀스", position: "DF", rating: 81, age: 31 },
        { name: "조엘린통", position: "MF", rating: 80, age: 28 },
        { name: "토날리", position: "MF", rating: 84, age: 24 },
        { name: "윌슨", position: "FW", rating: 82, age: 32 },
        { name: "고든", position: "FW", rating: 79, age: 23 },
        { name: "반스", position: "FW", rating: 78, age: 26 },
        { name: "타겟", position: "DF", rating: 76, age: 29 },
        { name: "이사크", position: "FW", rating: 84, age: 25 },
        { name: "크라프트", position: "DF", rating: 78, age: 30 },
        { name: "오술라", position: "FW", rating: 73, age: 21 },
        { name: "닉 포프", position: "GK", rating: 78, age: 33 },
        { name: "홀", position: "DF", rating: 74, age: 20 },
        { name: "리브라멘토", position: "DF", rating: 75, age: 22 },
        { name: "포프", position: "GK", rating: 82, age: 32 },
        { name: "머피", position: "MF", rating: 76, age: 29 },
        { name: "알미론", position: "MF", rating: 82, age: 30 },
        { name: "켈리", position: "DF", rating: 73, age: 26 },
        { name: "러디", position: "GK", rating: 75, age: 38 },
        { name: "윌록", position: "MF", rating: 75, age: 25 },
        { name: "길레스피", position: "GK", rating: 74, age: 32 },
        { name: "번", position: "DF", rating: 79, age: 32 },
        { name: "롱스태프", position: "MF", rating: 76, age: 27 },
        { name: "A. 머피", position: "DF", rating: 72, age: 20 },
        { name: "브루누", position: "MF", rating: 81, age: 27 },
        { name: "L. 마일리", position: "MF", rating: 70, age: 18 }
    ],
    asRoma: [
        { name: "앙헬리뇨", position: "DF", rating: 75, age: 28 },
        { name: "은디카", position: "DF", rating: 80, age: 27 },
        { name: "도우비크", position: "FW", rating: 76, age: 29 },
        { name: "압둘하미드", position: "DF", rating: 74, age: 29 },
        { name: "쇼무로도프", position: "FW", rating: 77, age: 27 },
        { name: "후멜스", position: "DF", rating: 81, age: 35 },
        { name: "파레데스", position: "MF", rating: 79, age: 28 },
        { name: "코네", position: "MF", rating: 76, age: 24 },
        { name: "소울레", position: "FW", rating: 72, age: 22 },
        { name: "첼리크", position: "DF", rating: 75, age: 25 },
        { name: "디발라", position: "FW", rating: 90, age: 30 },
        { name: "에르모소", position: "DF", rating: 77, age: 29 },
        { name: "달", position: "DF", rating: 74, age: 23 },
        { name: "르페", position: "MF", rating: 70, age: 21 },
        { name: "발단치", position: "MF", rating: 72, age: 20 },
        { name: "살레마커스", position: "MF", rating: 71, age: 26 },
        { name: "잘레프스키", position: "MF", rating: 69, age: 22 },
        { name: "피실리", position: "MF", rating: 70, age: 24 },
        { name: "B. 상가레", position: "DF", rating: 75, age: 25 },
        { name: "레나토 벨루치", position: "MF", rating: 72, age: 27 },
        { name: "엘샤라위", position: "FW", rating: 82, age: 30 },
        { name: "라이언", position: "FW", rating: 73, age: 21 },
        { name: "스빌라르", position: "GK", rating: 71, age: 24 }
    ],
    chelsea: [
        { name: "산체스", position: "GK", rating: 80, age: 30 },
        { name: "디사시", position: "DF", rating: 79, age: 25 },
        { name: "쿠쿠레야", position: "DF", rating: 78, age: 25 },
        { name: "토신", position: "DF", rating: 75, age: 24 },
        { name: "B. 바디아실", position: "DF", rating: 80, age: 22 },
        { name: "콜윌", position: "DF", rating: 76, age: 23 },
        { name: "네투", position: "GK", rating: 75, age: 29 },
        { name: "엔소", position: "MF", rating: 85, age: 22 },
        { name: "무드리크", position: "FW", rating: 81, age: 24 },
        { name: "마두에케", position: "FW", rating: 77, age: 21 },
        { name: "요르겐센", position: "MF", rating: 74, age: 26 },
        { name: "베티넬리", position: "GK", rating: 72, age: 31 },
        { name: "주앙 펠릭스", position: "FW", rating: 84, age: 23 },
        { name: "N. 잭슨", position: "FW", rating: 78, age: 22 },
        { name: "추쿠에메카", position: "MF", rating: 76, age: 20 },
        { name: "은쿤쿠", position: "MF", rating: 82, age: 25 },
        { name: "산초", position: "FW", rating: 80, age: 24 },
        { name: "파머", position: "GK", rating: 70, age: 22 },
        { name: "칠웰", position: "DF", rating: 81, age: 26 },
        { name: "듀스버리홀", position: "MF", rating: 75, age: 23 },
        { name: "제임스", position: "DF", rating: 84, age: 23 },
        { name: "카이세도", position: "MF", rating: 80, age: 21 },
        { name: "귀스토", position: "DF", rating: 76, age: 22 },
        { name: "포파나", position: "DF", rating: 78, age: 22 },
        { name: "카사데이", position: "MF", rating: 72, age: 20 },
        { name: "조지", position: "MF", rating: 71, age: 26 },
        { name: "아체암퐁", position: "DF", rating: 74, age: 25 },
        { name: "데이비드", position: "MF", rating: 73, age: 22 },
        { name: "켈리먼", position: "FW", rating: 70, age: 21 },
        { name: "마르크 기우", position: "DF", rating: 72, age: 24 },
        { name: "헤나투 베이가", position: "MF", rating: 73, age: 22 },
        { name: "라비아", position: "MF", rating: 75, age: 26 },
        { name: "베리스트룀", position: "FW", rating: 71, age: 21 }
    ],
    atMadrid: [
        { name: "J. 무소", position: "GK", rating: 75, age: 30 },
        { name: "J. M. 히메네스", position: "DF", rating: 80, age: 28 },
        { name: "아스필리쿠에타", position: "DF", rating: 82, age: 34 },
        { name: "갤러거", position: "MF", rating: 78, age: 23 },
        { name: "R. 데 파울", position: "MF", rating: 80, age: 29 },
        { name: "코케", position: "MF", rating: 84, age: 31 },
        { name: "그리즈만", position: "FW", rating: 89, age: 33 },
        { name: "바리오스", position: "MF", rating: 76, age: 25 },
        { name: "쇠를로트", position: "FW", rating: 79, age: 26 },
        { name: "코레아", position: "FW", rating: 79, age: 28 },
        { name: "S. 리누", position: "GK", rating: 72, age: 25 },
        { name: "오블락", position: "GK", rating: 90, age: 31 },
        { name: "M. 요렌테", position: "DF", rating: 81, age: 29 },
        { name: "랑글레", position: "DF", rating: 77, age: 27 },
        { name: "몰리나", position: "DF", rating: 75, age: 32 },
        { name: "리켈메", position: "FW", rating: 78, age: 24 },
        { name: "J. 알바레스", position: "FW", rating: 80, age: 22 },
        { name: "비첼", position: "MF", rating: 79, age: 30 },
        { name: "하비 갈란", position: "MF", rating: 73, age: 26 },
        { name: "줄리아노", position: "MF", rating: 72, age: 27 },
        { name: "헤이닐두", position: "FW", rating: 71, age: 23 },
        { name: "르노르망", position: "DF", rating: 82, age: 25 }
    ],
    napoli: [
        { name: "메렛", position: "GK", rating: 80, age: 30 },
        { name: "부온조르노", position: "DF", rating: 83, age: 26 },
        { name: "제주스", position: "DF", rating: 76, age: 28 },
        { name: "길모어", position: "MF", rating: 80, age: 22 },
        { name: "네리스", position: "FW", rating: 79, age: 24 },
        { name: "맥토미니", position: "MF", rating: 82, age: 26 },
        { name: "루카쿠", position: "FW", rating: 83, age: 30 },
        { name: "라흐마니", position: "DF", rating: 84, age: 29 },
        { name: "콘티니", position: "DF", rating: 73, age: 25 },
        { name: "라파 마린", position: "MF", rating: 72, age: 27 },
        { name: "M. 올리베라", position: "MF", rating: 77, age: 28 },
        { name: "시메오네", position: "FW", rating: 80, age: 28 },
        { name: "포포비치", position: "GK", rating: 70, age: 25 },
        { name: "폴리타노", position: "FW", rating: 79, age: 29 },
        { name: "디 로렌초", position: "DF", rating: 82, age: 30 },
        { name: "카프릴레", position: "DF", rating: 74, age: 25 },
        { name: "은곤게", position: "MF", rating: 72, age: 24 },
        { name: "마초키", position: "DF", rating: 71, age: 22 },
        { name: "스피나촐라", position: "DF", rating: 78, age: 30 },
        { name: "로보트카", position: "MF", rating: 75, age: 26 },
        { name: "라스파도리", position: "FW", rating: 80, age: 25 },
        { name: "폴로룬쇼", position: "FW", rating: 76, age: 24 },
        { name: "잠보-앙귀사", position: "MF", rating: 78, age: 23 },
        { name: "마리우 후이", position: "DF", rating: 76, age: 26 }
    ]
};

// 현재 선택된 포지션
let selectedPosition = null;
let selectedIndex = null;

// 화면 전환 함수
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    // 각 화면별 초기화 함수 호출
    switch(screenId) {
        case 'squad':
            displayTeamPlayers();
            updateFormationDisplay();
            break;
        case 'tactics':
            if (typeof loadTacticsScreen === 'function') {
                loadTacticsScreen();
            }
            break;
        case 'transfer':
            if (typeof loadTransferScreen === 'function') {
                loadTransferScreen();
            }
            break;
        case 'table':
            displayLeagueTable();
            break;
        case 'records':
            if (typeof loadRecordsScreen === 'function') {
                loadRecordsScreen();
            }
            break;
        case 'sns':
            if (typeof loadSNSScreen === 'function') {
                loadSNSScreen();
            }
            break;
        case 'sponsor':
            if (typeof loadSponsorScreen === 'function') {
                loadSponsorScreen();
            }
            break;
    }
}

// 팀 선택 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
        card.addEventListener('click', function() {
            const teamKey = this.getAttribute('data-team');
            selectTeam(teamKey);
        });
    });
});

// 팀 선택 함수
function selectTeam(teamKey) {
    if (!teams[teamKey]) {
        alert('팀 데이터를 찾을 수 없습니다.');
        return;
    }

    gameData.selectedTeam = teamKey;
    gameData.teamMoney = 1000;
    gameData.teamMorale = 50;
    gameData.currentSeason = 1;
    gameData.matchesPlayed = 0;
    
    // 스쿼드 초기화
    gameData.squad = {
        gk: null,
        df: [null, null, null, null],
        mf: [null, null, null],
        fw: [null, null, null]
    };

    // 리그 테이블 초기화
    initializeLeagueTable();
    
    // 로비로 이동
    showScreen('lobby');
    updateLobbyDisplay();
    
    // 성장 시스템 초기화
    if (typeof initializePlayerGrowth === 'function') {
        initializePlayerGrowth();
    }
    
    // 이적 시장 초기화
    if (typeof initializeTransferMarket === 'function') {
        initializeTransferMarket();
    }
}

// 로비 화면 업데이트
function updateLobbyDisplay() {
    if (!gameData.selectedTeam) return;
    
    document.getElementById('teamName').textContent = teamNames[gameData.selectedTeam];
    document.getElementById('teamMoney').textContent = gameData.teamMoney + '억';
    document.getElementById('teamMorale').textContent = gameData.teamMorale;
    document.getElementById('currentSeason').textContent = gameData.currentSeason + '시즌';
    document.getElementById('matchesPlayed').textContent = gameData.matchesPlayed + '경기';
}

// 스쿼드 관련 함수들
function displayTeamPlayers() {
    if (!gameData.selectedTeam) return;
    
    const playersList = document.getElementById('playersList');
    const teamPlayers = teams[gameData.selectedTeam];
    
    playersList.innerHTML = '';
    
    teamPlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-item';
        playerDiv.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-details">
                <span>${player.position}</span>
                <span>능력치: ${player.rating}</span>
                <span>나이: ${player.age}</span>
            </div>
        `;
        
        playerDiv.addEventListener('click', () => {
            if (selectedPosition !== null) {
                assignPlayerToPosition(player);
            }
        });
        
        playersList.appendChild(playerDiv);
    });
}

function selectPosition(position, index) {
    selectedPosition = position;
    selectedIndex = index;
    
    // 모든 포지션 하이라이트 제거
    document.querySelectorAll('.position').forEach(pos => {
        pos.classList.remove('selected');
    });
    
    // 선택된 포지션 하이라이트
    const positionElement = document.querySelector(`[data-position="${position}${index !== null ? '-' + index : ''}"]`);
    if (positionElement) {
        positionElement.classList.add('selected');
    }
}

function assignPlayerToPosition(player) {
    if (!selectedPosition) return;
    
    // 포지션 호환성 체크
    if (!isPositionCompatible(player.position, selectedPosition)) {
        alert(`${player.name}은(는) ${selectedPosition} 포지션에 적합하지 않습니다.`);
        return;
    }
    
    // 이미 다른 포지션에 배치된 선수인지 확인
    if (isPlayerInSquad(player)) {
        if (!confirm(`${player.name}은(는) 이미 다른 포지션에 배치되어 있습니다. 이동하시겠습니까?`)) {
            return;
        }
        removePlayerFromSquad(player);
    }
    
    // 선수 배치
    if (selectedPosition === 'gk') {
        gameData.squad.gk = { ...player };
    } else {
        gameData.squad[selectedPosition][selectedIndex] = { ...player };
    }
    
    updateFormationDisplay();
    selectedPosition = null;
    selectedIndex = null;
    
    // 하이라이트 제거
    document.querySelectorAll('.position').forEach(pos => {
        pos.classList.remove('selected');
    });
}

function isPositionCompatible(playerPosition, targetPosition) {
    const compatibility = {
        'GK': ['gk'],
        'DF': ['df'],
        'MF': ['mf', 'df'], // 미드필더는 수비수 포지션도 가능
        'FW': ['fw', 'mf']  // 공격수는 미드필더 포지션도 가능
    };
    
    return compatibility[playerPosition]?.includes(targetPosition) || false;
}

function isPlayerInSquad(player) {
    if (gameData.squad.gk?.name === player.name) return true;
    
    for (let pos of ['df', 'mf', 'fw']) {
        for (let p of gameData.squad[pos]) {
            if (p?.name === player.name) return true;
        }
    }
    return false;
}

function removePlayerFromSquad(player) {
    if (gameData.squad.gk?.name === player.name) {
        gameData.squad.gk = null;
    }
    
    for (let pos of ['df', 'mf', 'fw']) {
        for (let i = 0; i < gameData.squad[pos].length; i++) {
            if (gameData.squad[pos][i]?.name === player.name) {
                gameData.squad[pos][i] = null;
            }
        }
    }
}

function updateFormationDisplay() {
    // GK 업데이트
    const gkSlot = document.querySelector('[data-position="gk"] .player-slot');
    if (gameData.squad.gk) {
        gkSlot.classList.add('filled');
        gkSlot.innerHTML = `<div>${gameData.squad.gk.name}</div><div>${gameData.squad.gk.rating}</div>`;
    } else {
        gkSlot.classList.remove('filled');
        gkSlot.innerHTML = 'GK';
    }
    
    // DF 업데이트
    gameData.squad.df.forEach((player, index) => {
        const slot = document.querySelector(`[data-position="df-${index}"] .player-slot`);
        if (player) {
            slot.classList.add('filled');
            slot.innerHTML = `<div>${player.name}</div><div>${player.rating}</div>`;
        } else {
            slot.classList.remove('filled');
            const positions = ['LB', 'CB', 'CB', 'RB'];
            slot.innerHTML = positions[index];
        }
    });
    
    // MF 업데이트
    gameData.squad.mf.forEach((player, index) => {
        const slot = document.querySelector(`[data-position="mf-${index}"] .player-slot`);
        if (player) {
            slot.classList.add('filled');
            slot.innerHTML = `<div>${player.name}</div><div>${player.rating}</div>`;
        } else {
            slot.classList.remove('filled');
            const positions = ['LM', 'CM', 'RM'];
            slot.innerHTML = positions[index];
        }
    });
    
    // FW 업데이트
    gameData.squad.fw.forEach((player, index) => {
        const slot = document.querySelector(`[data-position="fw-${index}"] .player-slot`);
        if (player) {
            slot.classList.add('filled');
            slot.innerHTML = `<div>${player.name}</div><div>${player.rating}</div>`;
        } else {
            slot.classList.remove('filled');
            const positions = ['LW', 'ST', 'RW'];
            slot.innerHTML = positions[index];
        }
    });
}

// 리그 테이블 관련 함수들
function initializeLeagueTable() {
    gameData.leagueTable = {};
    
    Object.keys(teams).forEach(teamKey => {
        gameData.leagueTable[teamKey] = {
            matches: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0
        };
    });
}

function displayLeagueTable() {
    const tableContent = document.getElementById('tableContent');
    
    // 순위표 계산
    const sortedTeams = Object.keys(gameData.leagueTable).sort((a, b) => {
        const teamA = gameData.leagueTable[a];
        const teamB = gameData.leagueTable[b];
        
        if (teamA.points !== teamB.points) {
            return teamB.points - teamA.points;
        }
        
        const goalDiffA = teamA.goalsFor - teamA.goalsAgainst;
        const goalDiffB = teamB.goalsFor - teamB.goalsAgainst;
        
        return goalDiffB - goalDiffA;
    });
    
    let tableHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>순위</th>
                        <th>팀명</th>
                        <th>경기</th>
                        <th>승</th>
                        <th>무</th>
                        <th>패</th>
                        <th>득점</th>
                        <th>실점</th>
                        <th>득실차</th>
                        <th>승점</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    sortedTeams.forEach((teamKey, index) => {
        const team = gameData.leagueTable[teamKey];
        const goalDiff = team.goalsFor - team.goalsAgainst;
        const isMyTeam = teamKey === gameData.selectedTeam;
        
        tableHTML += `
            <tr ${isMyTeam ? 'style="background: rgba(76, 175, 80, 0.3); font-weight: bold;"' : ''}>
                <td>${index + 1}</td>
                <td>${teamNames[teamKey]}</td>
                <td>${team.matches}</td>
                <td>${team.wins}</td>
                <td>${team.draws}</td>
                <td>${team.losses}</td>
                <td>${team.goalsFor}</td>
                <td>${team.goalsAgainst}</td>
                <td>${goalDiff > 0 ? '+' : ''}${goalDiff}</td>
                <td>${team.points}</td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    tableContent.innerHTML = tableHTML;
}

// 저장/불러오기 함수들
function saveGame() {
    const saveData = {
        gameData: gameData,
        teams: teams,
        timestamp: Date.now()
    };
    
    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    link.download = `${teamNames[gameData.selectedTeam]}_${dateStr}.json`;
    
    link.click();
}

function loadGame() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const saveData = JSON.parse(e.target.result);
                
                if (saveData.gameData && saveData.teams) {
                    gameData = saveData.gameData;
                    Object.assign(teams, saveData.teams);
                    
                    showScreen('lobby');
                    updateLobbyDisplay();
                    alert('게임이 성공적으로 로드되었습니다!');
                } else {
                    alert('잘못된 저장 파일입니다.');
                }
            } catch (error) {
                alert('파일을 읽는 중 오류가 발생했습니다.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// 경기 시작 함수
function startMatch() {
    if (!isSquadValid()) {
        alert('스쿼드가 완성되지 않았습니다. 모든 포지션에 선수를 배치해주세요.');
        return;
    }
    
    // 상대팀 선택 (나를 제외한 팀 중 랜덤)
    const availableOpponents = Object.keys(teams).filter(team => team !== gameData.selectedTeam);
    const opponent = availableOpponents[Math.floor(Math.random() * availableOpponents.length)];
    
    if (typeof simulateMatch === 'function') {
        simulateMatch(opponent);
    }
}

function isSquadValid() {
    if (!gameData.squad.gk) return false;
    
    for (let player of gameData.squad.df) {
        if (!player) return false;
    }
    
    for (let player of gameData.squad.mf) {
        if (!player) return false;
    }
    
    for (let player of gameData.squad.fw) {
        if (!player) return false;
    }
    
    return true;
}

// 유틸리티 함수들
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function calculateTeamRating(teamKey) {
    const teamPlayers = teams[teamKey];
    const totalRating = teamPlayers.reduce((sum, player) => sum + player.rating, 0);
    return Math.round(totalRating / teamPlayers.length);
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 초기 화면 설정
    showScreen('teamSelection');
});
