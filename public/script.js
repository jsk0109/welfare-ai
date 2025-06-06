// 전역 변수
let chatMessages = [];
let isTyping = false;

// DOM 요소
const chatContainer = document.getElementById('chatContainer');
const chatBody = document.getElementById('chatBody');
const messageInput = document.getElementById('messageInput');

// 복지 혜택 데이터베이스 (실제 서비스에서는 API로 대체)
const welfareDatabase = {
    '육아': [
        {
            name: '아동수당',
            description: '만 8세 미만 아동에게 월 10만원 지급',
            requirements: '대한민국 국적, 주민등록 등재',
            documents: ['신분증', '통장사본', '가족관계증명서'],
            application: '주민센터 방문 또는 온라인 신청'
        },
        {
            name: '육아휴직급여',
            description: '육아휴직 기간 중 급여의 80% 지급',
            requirements: '고용보험 가입, 육아휴직 신청',
            documents: ['육아휴직신청서', '출생증명서'],
            application: '고용센터 신청'
        }
    ],
    '노인': [
        {
            name: '기초연금',
            description: '만 65세 이상 소득하위 70%에게 월 최대 32만원',
            requirements: '만 65세 이상, 소득인정액 기준 충족',
            documents: ['신분증', '통장사본', '소득재산신고서'],
            application: '국민연금공단 또는 주민센터'
        }
    ],
    '청년': [
        {
            name: '청년도약계좌',
            description: '5년간 매월 70만원 적립 시 정부지원금 지급',
            requirements: '만 19~34세, 소득요건 충족',
            documents: ['신분증', '소득증명서', '통장사본'],
            application: '은행 방문 신청'
        }
    ],
    '장애인': [
        {
            name: '장애인연금',
            description: '중증장애인에게 기초급여 및 부가급여 지급',
            requirements: '장애등급 1~3급, 소득인정액 기준',
            documents: ['장애인등록증', '소득재산신고서'],
            application: '주민센터 방문 신청'
        }
    ]
};

// 챗봇 응답 템플릿
const responses = {
    greeting: "안녕하세요! 복지정책 통합안내 AI입니다. 어떤 복지 혜택에 대해 궁금하신가요?",
    help: "다음과 같은 분야의 복지 혜택을 안내해드릴 수 있습니다:\n• 육아 지원\n• 노인 복지\n• 청년 지원\n• 장애인 복지\n\n구체적으로 어떤 분야가 궁금하신가요?",
    notFound: "죄송합니다. 해당 내용을 찾을 수 없습니다. 다른 키워드로 다시 검색해보시거나, '도움말'을 입력해주세요."
};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addTypingIndicator();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 스크롤 이벤트
    window.addEventListener('scroll', handleScroll);
    
    // 모바일 메뉴
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // 네비게이션 링크
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
}

// 스크롤 처리
function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// 네비게이션 클릭 처리
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // 활성 링크 업데이트
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
}

// 채팅 시작
function startChat() {
    chatContainer.classList.add('active');
    messageInput.focus();
    
    // 환영 메시지가 없으면 추가
    if (chatMessages.length === 0) {
        setTimeout(() => {
            addBotMessage(responses.greeting);
        }, 500);
    }
}

// 채팅 닫기
function closeChat() {
    chatContainer.classList.remove('active');
}

// 키 입력 처리
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// 메시지 전송
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;
    
    addUserMessage(message);
    messageInput.value = '';
    
    // 봇 응답 처리
    setTimeout(() => {
        processBotResponse(message);
    }, 1000);
}

// 빠른 메시지 전송
function sendQuickMessage(message) {
    addUserMessage(message);
    setTimeout(() => {
        processBotResponse(message);
    }, 1000);
}

// 사용자 메시지 추가
function addUserMessage(message) {
    const messageElement = createMessageElement(message, 'user');
    appendMessage(messageElement);
    chatMessages.push({ type: 'user', content: message });
}

// 봇 메시지 추가
function addBotMessage(message) {
    const messageElement = createMessageElement(message, 'bot');
    appendMessage(messageElement);
    chatMessages.push({ type: 'bot', content: message });
    isTyping = false;
    removeTypingIndicator();
}

// 메시지 요소 생성
function createMessageElement(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    if (type === 'bot') {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
        messageDiv.appendChild(avatar);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = content.replace(/\n/g, '<br>');
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

// 메시지 추가
function appendMessage(messageElement) {
    // 환영 메시지 제거
    const welcomeMessage = chatBody.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }
    
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// 타이핑 인디케이터 추가
function addTypingIndicator() {
    if (document.querySelector('.typing-indicator')) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    isTyping = true;
}

// 타이핑 인디케이터 제거
function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// 봇 응답 처리
function processBotResponse(userMessage) {
    addTypingIndicator();
    
    const message = userMessage.toLowerCase();
    let response = '';
    
    // 인사말 처리
    if (message.includes('안녕') || message.includes('hello') || message.includes('hi')) {
        response = responses.greeting;
    }
    // 도움말 처리
    else if (message.includes('도움') || message.includes('help') || message.includes('뭐')) {
        response = responses.help;
    }
    // 복지 혜택 검색
    else {
        response = searchWelfareBenefits(message);
    }
    
    setTimeout(() => {
        addBotMessage(response);
    }, 1500);
}

// 복지 혜택 검색
function searchWelfareBenefits(query) {
    let results = [];
    
    // 키워드별 검색
    Object.keys(welfareDatabase).forEach(category => {
        if (query.includes(category) || 
            (category === '육아' && (query.includes('아이') || query.includes('자녀') || query.includes('출산'))) ||
            (category === '노인' && (query.includes('어르신') || query.includes('고령'))) ||
            (category === '청년' && (query.includes('젊은') || query.includes('20대') || query.includes('30대'))) ||
            (category === '장애인' && query.includes('장애'))) {
            
            results = results.concat(welfareDatabase[category]);
        }
    });
    
    if (results.length === 0) {
        return responses.notFound;
    }
    
    // 검색 결과 포맷팅
    let response = `${results.length}개의 관련 혜택을 찾았습니다:\n\n`;
    
    results.forEach((benefit, index) => {
        response += `📋 **${benefit.name}**\n`;
        response += `${benefit.description}\n\n`;
        response += `✅ **신청 자격:** ${benefit.requirements}\n`;
        response += `📄 **필요 서류:** ${benefit.documents.join(', ')}\n`;
        response += `🏢 **신청 방법:** ${benefit.application}\n`;
        
        if (index < results.length - 1) {
            response += '\n' + '─'.repeat(30) + '\n\n';
        }
    });
    
    response += '\n\n더 자세한 정보가 필요하시면 언제든 말씀해주세요! 😊';
    
    return response;
}

// CSS 애니메이션 추가
const additionalStyles = `
.typing-dots {
    display: flex;
    gap: 4px;
    padding: 8px 0;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    background: #64748b;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}

.message {
    animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message-content strong,
.message-content **strong** {
    font-weight: 600;
    color: #1e293b;
}
`;

// 스타일 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 애니메이션 대상 요소들 관찰
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .step, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});