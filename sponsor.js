// 스폰서 시스템
class SponsorSystem {
    constructor() {
        this.sponsors = [
            {
                id: 'puma',
                name: "푸마",
                description: "빠르고 역동적인 스포츠 브랜드",
                payPerWin: 15,
                payPerLoss: 3,
                contractLength: 12,
                signingBonus: 80,
                requirements: { minRating: 70 }
            },
            {
                id: 'nike',
                name: "나이키",
                description: "세계적인 스포츠 브랜드",
                payPerWin: 20,
                payPerLoss: 5,
                contractLength: 10,
                signingBonus: 100,
                requirements: { minRating: 75 }
            },
            {
                id: 'newBalance',
                name: "뉴발란스",
                description: "전문성을 추구하는 스포츠 브랜드",
                payPerWin: 18,
                payPerLoss: 4,
                contractLength: 15,
                signingBonus: 120,
                requirements: { minRating: 78 }
            },
            {
                id: 'adidas',
                name: "아디다스",
                description: "독일의 프리미엄 스포츠 브랜드",
                payPerWin: 25,
                payPerLoss: 8,
                contractLength: 8,
                signingBonus: 150,
                requirements: { minRating: 80 }
            },
            {
                id: 'nexen',
                name: "넥센타이어",
                description: "한국의 타이어 브랜드",
                payPerWin: 30,
                payPerLoss: 10,
                contractLength: 6,
                signingBonus: 200,
                requirements: { minRating: 85 }
            },
            {
                id: 'emirates',
                name: "플라이 에미레이츠",
                description: "세계 최고의 항공사 중 하나",
                payPerWin: 40,
                payPerLoss: 15,
                contractLength: 5,
                signingBonus: 300,
                requirements: { minRating: 88 }
            },
            {
                id: 'fifa',
                name: "FIFA 공식 파트너십",
                description: "FIFA와의 독점 글로벌 파트너십",
                payPerWin: 50,
                payPerLoss: 20,
                contractLength: 4,
                signingBonus: 500,
                requirements: { minRating: 90 }
            }
        ];
        
        this.currentContract = null;
        this.contractMatchesRemaining = 0;
    }

    // 사용 가능한 스폰서 목록 가져오기
    getAvailableSponsors() {
        const teamRating = this.calculateTeamRating();
        
        return this.sponsors.filter(sponsor => {
            // 이미 계약중인 스폰서는 제외
            if (this.currentContract && this.currentContract.id === sponsor.id) {
                return false;
            }
            
            // 팀 능력치 요구사항 체크
            return teamRating >= sponsor.requirements.minRating;
        });
    }

    // 팀 평균 능력치 계산
    calculateTeamRating() {
        if (!gameData.selectedTeam || !isSquadValid()) {
            return 0;
        }

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

        return playerCount > 0 ? Math.round(totalRating / playerCount) : 0;
    }

    // 스폰서 계약
    signContract(sponsorId) {
        const sponsor = this.sponsors.find(s => s.id === sponsorId);
        if (!sponsor) {
            return { success: false, message: "해당 스폰서를 찾을 수 없습니다." };
        }

        // 이미 계약중인지 체크
        if (this.currentContract) {
            return { success: false, message: "이미 다른 스폰서와 계약중입니다." };
        }

        // 요구사항 체크
        const teamRating = this.calculateTeamRating();
        if (teamRating < sponsor.requirements.minRating) {
            return { 
                success: false, 
                message: `팀 평균 능력치가 ${sponsor.requirements.minRating} 이상이어야 합니다. (현재: ${teamRating})` 
            };
        }

        // 계약 체결
        this.currentContract = { ...sponsor };
        this.contractMatchesRemaining = sponsor.contractLength;
        
        // 계약금 지급
        gameData.teamMoney += sponsor.signingBonus;

        return { 
            success: true, 
            message: `${sponsor.name}과 계약을 체결했습니다! 계약금 ${sponsor.signingBonus}억을 받았습니다.`,
            sponsor: sponsor
        };
    }

    // 계약 해지
    terminateContract() {
        if (!this.currentContract) {
            return { success: false, message: "현재 계약중인 스폰서가 없습니다." };
        }

        const contractName = this.currentContract.name;
        
        // 해지 위약금 (남은 계약 기간에 따라)
        const penalty = Math.round(this.contractMatchesRemaining * 10);
        
        if (gameData.teamMoney < penalty) {
            return { 
                success: false, 
                message: `계약 해지 위약금이 부족합니다. (필요: ${penalty}억, 보유: ${gameData.teamMoney}억)` 
            };
        }

        gameData.teamMoney -= penalty;
        this.currentContract = null;
        this.contractMatchesRemaining = 0;

        return { 
            success: true, 
            message: `${contractName}와의 계약이 해지되었습니다. 위약금 ${penalty}억이 차감되었습니다.`
        };
    }

    // 경기 후 스폰서 수당 지급
    processMatchPayment(isWin, isDraw) {
        if (!this.currentContract) return 0;

        let payment = 0;
        
        if (isWin) {
            payment = this.currentContract.payPerWin;
        } else if (!isDraw) {
            payment = this.currentContract.payPerLoss;
        }

        if (payment > 0) {
            gameData.teamMoney += payment;
        }

        // 계약 기간 감소
        this.contractMatchesRemaining--;
        
        // 계약 만료 체크
        if (this.contractMatchesRemaining <= 0) {
            const expiredSponsor = this.currentContract.name;
            this.currentContract = null;
            this.contractMatchesRemaining = 0;
            
            setTimeout(() => {
                alert(`${expiredSponsor}와의 계약이 만료되었습니다.`);
            }, 2000);
        }

        return payment;
    }

    // 현재 계약 정보 가져오기
    getCurrentContract() {
        return this.currentContract;
    }

    // 계약 남은 기간 가져오기
    getContractMatchesRemaining() {
        return this.contractMatchesRemaining;
    }

    // 스폰서 상세 정보 가져오기
    getSponsorDetails(sponsorId) {
        return this.sponsors.find(s => s.id === sponsorId);
    }

    // 예상 수익 계산
    calculateExpectedRevenue(sponsorId) {
        const sponsor = this.sponsors.find(s => s.id === sponsorId);
        if (!sponsor) return null;

        // 예상 승률 계산 (팀 사기와 능력치 기반)
        const teamRating = this.calculateTeamRating();
        const morale = gameData.teamMorale;
        
        let winRate = 0.3; // 기본 30%
        
        // 팀 능력치에 따른 승률 조정
        if (teamRating >= 85) winRate = 0.7;
        else if (teamRating >= 80) winRate = 0.6;
        else if (teamRating >= 75) winRate = 0.5;
        else if (teamRating >= 70) winRate = 0.4;
        
        // 팀 사기에 따른 승률 조정
        winRate += (morale - 50) / 100;
        winRate = Math.max(0.1, Math.min(0.9, winRate));

        const lossRate = 1 - winRate - 0.2; // 20% 무승부 가정
        
        const expectedWins = Math.round(sponsor.contractLength * winRate);
        const expectedLosses = Math.round(sponsor.contractLength * lossRate);
        
        const totalRevenue = sponsor.signingBonus + 
                           (expectedWins * sponsor.payPerWin) + 
                           (expectedLosses * sponsor.payPerLoss);

        return {
            contractLength: sponsor.contractLength,
            signingBonus: sponsor.signingBonus,
            expectedWins: expectedWins,
            expectedLosses: expectedLosses,
            winRevenue: expectedWins * sponsor.payPerWin,
            lossRevenue: expectedLosses * sponsor.payPerLoss,
            totalRevenue: totalRevenue,
            averagePerMatch: Math.round(totalRevenue / sponsor.contractLength)
        };
    }

    // 저장 데이터 준비
    getSaveData() {
        return {
            currentContract: this.currentContract,
            contractMatchesRemaining: this.contractMatchesRemaining
        };
    }

    // 저장 데이터 로드
    loadSaveData(saveData) {
        if (saveData.currentContract) {
            this.currentContract = saveData.currentContract;
        }
        if (saveData.contractMatchesRemaining !== undefined) {
            this.contractMatchesRemaining = saveData.contractMatchesRemaining;
        }
    }
}

// 전역 스폰서 시스템 인스턴스
const sponsorSystem = new SponsorSystem();

// 스폰서 화면 로드
function loadSponsorScreen() {
    const sponsorContent = document.getElementById('sponsorContent');
    const currentContract = sponsorSystem.getCurrentContract();
    const availableSponsors = sponsorSystem.getAvailableSponsors();
    const teamRating = sponsorSystem.calculateTeamRating();

    let html = `
        <div class="sponsor-container">
            <div class="sponsor-header">
                <h3>💼 스폰서 관리</h3>
                <div class="team-rating-display">
                    <span>팀 평균 능력치: ${teamRating}</span>
                    <span>팀 사기: ${gameData.teamMorale}</span>
                </div>
            </div>

            <!-- 현재 계약 정보 -->
            <div class="current-contract-section">
                <h4>현재 계약</h4>
    `;

    if (currentContract) {
        const matchesRemaining = sponsorSystem.getContractMatchesRemaining();
        html += `
                <div class="current-contract-card">
                    <div class="contract-header">
                        <h5>${currentContract.name}</h5>
                        <div class="contract-status active">계약중</div>
                    </div>
                    <div class="contract-details">
                        <p>${currentContract.description}</p>
                        <div class="contract-terms">
                            <div class="term-item">
                                <span class="label">승리 시 수당:</span>
                                <span class="value">${currentContract.payPerWin}억</span>
                            </div>
                            <div class="term-item">
                                <span class="label">패배 시 수당:</span>
                                <span class="value">${currentContract.payPerLoss}억</span>
                            </div>
                            <div class="term-item">
                                <span class="label">남은 계약 기간:</span>
                                <span class="value">${matchesRemaining}경기</span>
                            </div>
                        </div>
                    </div>
                    <div class="contract-actions">
                        <button onclick="showContractDetails('${currentContract.id}')" class="details-btn">
                            계약 상세보기
                        </button>
                        <button onclick="terminateContract()" class="terminate-btn">
                            계약 해지
                        </button>
                    </div>
                </div>
        `;
    } else {
        html += `
                <div class="no-contract">
                    <p>현재 계약중인 스폰서가 없습니다.</p>
                    <p>아래에서 새로운 스폰서를 선택해보세요!</p>
                </div>
        `;
    }

    html += `
            </div>

            <!-- 사용 가능한 스폰서 목록 -->
            <div class="available-sponsors-section">
                <h4>사용 가능한 스폰서</h4>
                <div class="sponsors-grid">
    `;

    if (availableSponsors.length === 0) {
        html += `
                    <div class="no-sponsors">
                        <p>현재 계약 가능한 스폰서가 없습니다.</p>
                        <p>팀 능력치를 높여서 더 좋은 스폰서의 관심을 받아보세요!</p>
                    </div>
        `;
    } else {
        availableSponsors.forEach(sponsor => {
            const expectedRevenue = sponsorSystem.calculateExpectedRevenue(sponsor.id);
            
            html += `
                <div class="sponsor-card">
                    <div class="sponsor-header">
                        <h5>${sponsor.name}</h5>
                        <div class="sponsor-tier tier-${sponsor.requirements.minRating >= 88 ? 'premium' : sponsor.requirements.minRating >= 80 ? 'high' : 'standard'}">
                            ${sponsor.requirements.minRating >= 88 ? '프리미엄' : sponsor.requirements.minRating >= 80 ? '고급' : '일반'}
                        </div>
                    </div>
                    <div class="sponsor-description">
                        <p>${sponsor.description}</p>
                    </div>
                    <div class="sponsor-terms">
                        <div class="term-row">
                            <span class="label">계약금:</span>
                            <span class="value highlight">${sponsor.signingBonus}억</span>
                        </div>
                        <div class="term-row">
                            <span class="label">승리 수당:</span>
                            <span class="value">${sponsor.payPerWin}억</span>
                        </div>
                        <div class="term-row">
                            <span class="label">패배 수당:</span>
                            <span class="value">${sponsor.payPerLoss}억</span>
                        </div>
                        <div class="term-row">
                            <span class="label">계약 기간:</span>
                            <span class="value">${sponsor.contractLength}경기</span>
                        </div>
                        <div class="term-row">
                            <span class="label">요구 능력치:</span>
                            <span class="value ${teamRating >= sponsor.requirements.minRating ? 'success' : 'danger'}">
                                ${sponsor.requirements.minRating}+
                            </span>
                        </div>
                    </div>
                    <div class="expected-revenue">
                        <h6>예상 수익</h6>
                        <div class="revenue-breakdown">
                            <div>총 예상 수익: <strong>${expectedRevenue.totalRevenue}억</strong></div>
                            <div>경기당 평균: <strong>${expectedRevenue.averagePerMatch}억</strong></div>
                        </div>
                    </div>
                    <div class="sponsor-actions">
                        <button onclick="showSponsorDetails('${sponsor.id}')" class="details-btn">
                            상세보기
                        </button>
                        <button onclick="signSponsorContract('${sponsor.id}')" 
                                class="sign-btn ${teamRating >= sponsor.requirements.minRating ? '' : 'disabled'}"
                                ${teamRating >= sponsor.requirements.minRating ? '' : 'disabled'}>
                            ${currentContract ? '계약 불가' : '계약하기'}
                        </button>
                    </div>
                </div>
            `;
        });
    }

    html += `
                </div>
            </div>

            <!-- 모든 스폰서 목록 (참고용) -->
            <div class="all-sponsors-section">
                <h4>모든 스폰서 목록</h4>
                <div class="sponsors-table">
                    <table>
                        <thead>
                            <tr>
                                <th>스폰서명</th>
                                <th>요구 능력치</th>
                                <th>계약금</th>
                                <th>승리 수당</th>
                                <th>계약 기간</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    sponsorSystem.sponsors.forEach(sponsor => {
        const isAvailable = teamRating >= sponsor.requirements.minRating && !currentContract;
        const isCurrent = currentContract && currentContract.id === sponsor.id;
        
        html += `
            <tr class="${isCurrent ? 'current' : isAvailable ? 'available' : 'unavailable'}">
                <td>${sponsor.name}</td>
                <td>${sponsor.requirements.minRating}</td>
                <td>${sponsor.signingBonus}억</td>
                <td>${sponsor.payPerWin}억</td>
                <td>${sponsor.contractLength}경기</td>
                <td>
                    ${isCurrent ? '계약중' : 
                      isAvailable ? '계약 가능' : 
                      teamRating < sponsor.requirements.minRating ? '능력치 부족' : '계약중 불가'}
                </td>
            </tr>
        `;
    });

    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    sponsorContent.innerHTML = html;
}

// 스폰서 계약
function signSponsorContract(sponsorId) {
    if (sponsorSystem.getCurrentContract()) {
        alert('이미 다른 스폰서와 계약중입니다. 기존 계약을 해지한 후 새로운 계약을 진행해주세요.');
        return;
    }

    const sponsor = sponsorSystem.getSponsorDetails(sponsorId);
    if (!sponsor) {
        alert('스폰서 정보를 찾을 수 없습니다.');
        return;
    }

    const expectedRevenue = sponsorSystem.calculateExpectedRevenue(sponsorId);
    
    const message = `${sponsor.name}와 계약하시겠습니까?\n\n` +
                   `계약금: ${sponsor.signingBonus}억\n` +
                   `승리 수당: ${sponsor.payPerWin}억\n` +
                   `패배 수당: ${sponsor.payPerLoss}억\n` +
                   `계약 기간: ${sponsor.contractLength}경기\n\n` +
                   `예상 총 수익: ${expectedRevenue.totalRevenue}억`;

    if (confirm(message)) {
        const result = sponsorSystem.signContract(sponsorId);
        
        if (result.success) {
            alert(result.message);
            loadSponsorScreen();
            updateLobbyDisplay();
        } else {
            alert(result.message);
        }
    }
}

// 계약 해지
function terminateContract() {
    const currentContract = sponsorSystem.getCurrentContract();
    if (!currentContract) {
        alert('현재 계약중인 스폰서가 없습니다.');
        return;
    }

    const matchesRemaining = sponsorSystem.getContractMatchesRemaining();
    const penalty = Math.round(matchesRemaining * 10);

    const message = `${currentContract.name}와의 계약을 해지하시겠습니까?\n\n` +
                   `위약금: ${penalty}억\n` +
                   `남은 계약 기간: ${matchesRemaining}경기\n\n` +
                   `정말로 계약을 해지하시겠습니까?`;

    if (confirm(message)) {
        const result = sponsorSystem.terminateContract();
        
        if (result.success) {
            alert(result.message);
            loadSponsorScreen();
            updateLobbyDisplay();
        } else {
            alert(result.message);
        }
    }
}

// 스폰서 상세 정보 표시
function showSponsorDetails(sponsorId) {
    const sponsor = sponsorSystem.getSponsorDetails(sponsorId);
    if (!sponsor) return;

    const expectedRevenue = sponsorSystem.calculateExpectedRevenue(sponsorId);
    const teamRating = sponsorSystem.calculateTeamRating();

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${sponsor.name} 상세 정보</h3>
            <div class="sponsor-details">
                <div class="sponsor-info">
                    <p><strong>설명:</strong> ${sponsor.description}</p>
                    <p><strong>요구 팀 능력치:</strong> ${sponsor.requirements.minRating} (현재: ${teamRating})</p>
                </div>
                
                <div class="contract-terms-detail">
                    <h4>계약 조건</h4>
                    <ul>
                        <li>계약금: ${sponsor.signingBonus}억</li>
                        <li>승리 시 수당: ${sponsor.payPerWin}억</li>
                        <li>패배 시 수당: ${sponsor.payPerLoss}억</li>
                        <li>무승부 시 수당: 0억</li>
                        <li>계약 기간: ${sponsor.contractLength}경기</li>
                    </ul>
                </div>

                <div class="revenue-projection">
                    <h4>수익 예상</h4>
                    <div class="projection-details">
                        <div class="projection-item">
                            <span>계약금:</span>
                            <span>${expectedRevenue.signingBonus}억</span>
                        </div>
                        <div class="projection-item">
                            <span>예상 승수:</span>
                            <span>${expectedRevenue.expectedWins}경기</span>
                        </div>
                        <div class="projection-item">
                            <span>예상 패수:</span>
                            <span>${expectedRevenue.expectedLosses}경기</span>
                        </div>
                        <div class="projection-item">
                            <span>승리 수당 총액:</span>
                            <span>${expectedRevenue.winRevenue}억</span>
                        </div>
                        <div class="projection-item">
                            <span>패배 수당 총액:</span>
                            <span>${expectedRevenue.lossRevenue}억</span>
                        </div>
                        <div class="projection-item total">
                            <span><strong>총 예상 수익:</strong></span>
                            <span><strong>${expectedRevenue.totalRevenue}억</strong></span>
                        </div>
                        <div class="projection-item">
                            <span>경기당 평균:</span>
                            <span>${expectedRevenue.averagePerMatch}억</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                ${teamRating >= sponsor.requirements.minRating && !sponsorSystem.getCurrentContract() ? 
                    `<button onclick="signSponsorContract('${sponsor.id}'); closeModal()">계약하기</button>` : 
                    ''}
                <button onclick="closeModal()">닫기</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 현재 계약 상세 정보 표시
function showContractDetails(sponsorId) {
    const contract = sponsorSystem.getCurrentContract();
    if (!contract) return;

    const matchesRemaining = sponsorSystem.getContractMatchesRemaining();
    const penalty = Math.round(matchesRemaining * 10);

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>현재 계약 상세</h3>
            <div class="contract-details">
                <h4>${contract.name}</h4>
                <p>${contract.description}</p>
                
                <div class="contract-status">
                    <div class="status-item">
                        <span class="label">계약 상태:</span>
                        <span class="value active">활성</span>
                    </div>
                    <div class="status-item">
                        <span class="label">남은 경기:</span>
                        <span class="value">${matchesRemaining}경기</span>
                    </div>
                    <div class="status-item">
                        <span class="label">해지 위약금:</span>
                        <span class="value">${penalty}억</span>
                    </div>
                </div>

                <div class="payment-terms">
                    <h5>수당 체계</h5>
                    <ul>
                        <li>승리: +${contract.payPerWin}억</li>
                        <li>무승부: +0억</li>
                        <li>패배: +${contract.payPerLoss}억</li>
                    </ul>
                </div>

                <div class="contract-performance">
                    <h5>계약 성과</h5>
                    <p>지금까지 이 계약으로 ${(contract.contractLength - matchesRemaining)}경기를 진행했습니다.</p>
                </div>
            </div>
            <div class="modal-actions">
                <button onclick="terminateContract(); closeModal()" class="danger-btn">계약 해지</button>
                <button onclick="closeModal()">닫기</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 경기 후 스폰서 수당 처리 (다른 파일에서 호출)
function processSponsorPayment(isWin, isDraw) {
    const payment = sponsorSystem.processMatchPayment(isWin, isDraw);
    
    if (payment > 0) {
        const contract = sponsorSystem.getCurrentContract();
        setTimeout(() => {
            alert(`스폰서 수당: ${contract.name}으로부터 ${payment}억을 받았습니다!`);
        }, 4000);
    }
}

// 저장/불러오기에 스폰서 데이터 포함
const originalSaveGame7 = window.saveGame;
window.saveGame = function() {
    gameData.sponsorData = sponsorSystem.getSaveData();
    if (originalSaveGame7) {
        originalSaveGame7.call(this);
    }
};

const originalLoadGame7 = window.loadGame;
window.loadGame = function() {
    if (originalLoadGame7) {
        originalLoadGame7.call(this);
    }
    if (gameData.sponsorData) {
        sponsorSystem.loadSaveData(gameData.sponsorData);
    }
};
