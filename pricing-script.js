// Pricing Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  window.dataLayer = window.dataLayer || []
  initializePricingPage()
  initializeScrollAnimations()
})

function initializePricingPage() {
  // Billing toggle functionality
  const billingToggle = document.getElementById("billingToggle")
  if (billingToggle) {
    billingToggle.addEventListener("change", toggleBilling)
  }

  // FAQ functionality
  initializeFAQ()

  // Plan selection tracking
  initializePlanTracking()

  // Smooth scrolling for anchor links
  initializeSmoothScrolling()
}

// Billing Toggle
function toggleBilling() {
  const billingToggle = document.getElementById("billingToggle")
  const monthlyPrices = document.querySelectorAll(".monthly-price")
  const yearlyPrices = document.querySelectorAll(".yearly-price")

  const isYearly = billingToggle.checked

  monthlyPrices.forEach((price) => {
    price.style.display = isYearly ? "none" : "inline"
  })

  yearlyPrices.forEach((price) => {
    price.style.display = isYearly ? "inline" : "none"
  })

  // Add animation effect
  const priceContainers = document.querySelectorAll(".price-container")
  priceContainers.forEach((container) => {
    container.classList.add("price-transition")
    setTimeout(() => {
      container.classList.remove("price-transition")
    }, 300)
  })

  // Track billing preference
  trackEvent("billing_toggle", {
    billing_type: isYearly ? "yearly" : "monthly",
  })
}

// FAQ Functionality
function initializeFAQ() {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active")

      // Close all other FAQ items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active")
        }
      })

      // Toggle current item
      if (isActive) {
        item.classList.remove("active")
      } else {
        item.classList.add("active")
      }
    })
  })
}

// Plan Selection Tracking
function initializePlanTracking() {
  const planButtons = document.querySelectorAll(".plan-btn")

  planButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const planCard = this.closest(".plan-card")
      const planName = planCard.querySelector(".plan-name").textContent
      const planPrice = planCard.querySelector(".price").textContent

      trackEvent("plan_selected", {
        plan_name: planName,
        plan_price: planPrice,
        button_text: this.textContent.trim(),
      })

      // Handle different button actions
      const buttonText = this.textContent.trim()

      if (buttonText.includes("무료 체험")) {
        startTrial(planName)
      } else if (buttonText.includes("지금 시작")) {
        startSubscription(planName)
      } else if (buttonText.includes("상담 문의") || buttonText.includes("전문가 상담")) {
        contactSales(planName)
      }
    })
  })
}

// Smooth Scrolling
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Trial and Subscription Functions
function startTrial(planName = "") {
  // Show trial signup modal or redirect to signup page
  showTrialModal(planName)

  trackEvent("trial_started", {
    plan_name: planName,
    source: "pricing_page",
  })
}

function startSubscription(planName = "") {
  // Show subscription modal or redirect to checkout
  showSubscriptionModal(planName)

  trackEvent("subscription_started", {
    plan_name: planName,
    source: "pricing_page",
  })
}

function contactSales(planName = "") {
  // Show contact form modal or redirect to contact page
  showContactModal(planName)

  trackEvent("sales_contact", {
    plan_name: planName,
    source: "pricing_page",
  })
}

// Modal Functions
function showTrialModal(planName) {
  const modal = createModal("trial", planName)
  document.body.appendChild(modal)
  modal.style.display = "flex"
}

function showSubscriptionModal(planName) {
  const modal = createModal("subscription", planName)
  document.body.appendChild(modal)
  modal.style.display = "flex"
}

function showContactModal(planName) {
  const modal = createModal("contact", planName)
  document.body.appendChild(modal)
  modal.style.display = "flex"
}

function createModal(type, planName) {
  const modal = document.createElement("div")
  modal.className = "modal pricing-modal"
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `

  let modalContent = ""

  switch (type) {
    case "trial":
      modalContent = createTrialModalContent(planName)
      break
    case "subscription":
      modalContent = createSubscriptionModalContent(planName)
      break
    case "contact":
      modalContent = createContactModalContent(planName)
      break
  }

  modal.innerHTML = modalContent

  // Close modal functionality
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal-close")) {
      modal.remove()
    }
  })

  return modal
}

function createTrialModalContent(planName) {
  return `
        <div class="modal-content" style="background: white; padding: 2rem; border-radius: 20px; max-width: 500px; width: 90%;">
            <div class="modal-header" style="text-align: center; margin-bottom: 2rem;">
                <h2 style="color: #1e293b; margin-bottom: 0.5rem;">14일 무료 체험 시작</h2>
                <p style="color: #64748b;">${planName} 플랜으로 시작하기</p>
                <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <form class="trial-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">기관명</label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">담당자명</label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">이메일</label>
                    <input type="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">연락처</label>
                    <input type="tel" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <button type="submit" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">
                    무료 체험 시작하기
                </button>
            </form>
            <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #64748b;">
                신용카드 등록 없이 체험 가능합니다
            </p>
        </div>
    `
}

function createSubscriptionModalContent(planName) {
  return `
        <div class="modal-content" style="background: white; padding: 2rem; border-radius: 20px; max-width: 500px; width: 90%;">
            <div class="modal-header" style="text-align: center; margin-bottom: 2rem;">
                <h2 style="color: #1e293b; margin-bottom: 0.5rem;">${planName} 플랜 구독</h2>
                <p style="color: #64748b;">구독을 시작하려면 정보를 입력해주세요</p>
                <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <form class="subscription-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">기관명</label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">담당자명</label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">이메일</label>
                    <input type="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">연락처</label>
                    <input type="tel" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">결제 방식</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <option value="monthly">월간 결제</option>
                        <option value="yearly">연간 결제 (20% 할인)</option>
                    </select>
                </div>
                <button type="submit" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">
                    구독 시작하기
                </button>
            </form>
        </div>
    `
}

function createContactModalContent(planName) {
  return `
        <div class="modal-content" style="background: white; padding: 2rem; border-radius: 20px; max-width: 500px; width: 90%;">
            <div class="modal-header" style="text-align: center; margin-bottom: 2rem;">
                <h2 style="color: #1e293b; margin-bottom: 0.5rem;">영업팀 문의</h2>
                <p style="color: #64748b;">${planName} 플랜에 대한 상담을 요청하세요</p>
                <button class="modal-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <form class="contact-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">기관명</label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">담당자명</label>
                    <input type="text" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">이메일</label>
                    <input type="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">연락처</label>
                    <input type="tel" required style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">예상 사용자 수</label>
                    <select style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <option value="1-100">1-100명</option>
                        <option value="101-500">101-500명</option>
                        <option value="501-1000">501-1,000명</option>
                        <option value="1000+">1,000명 이상</option>
                    </select>
                </div>
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">문의 내용</label>
                    <textarea rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; resize: vertical;" placeholder="구체적인 요구사항이나 궁금한 점을 적어주세요"></textarea>
                </div>
                <button type="submit" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">
                    상담 요청하기
                </button>
            </form>
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="color: #64748b; margin-bottom: 0.5rem;">또는 직접 연락하세요</p>
                <p style="color: #2563eb; font-weight: 600;">📞 1588-0000 | ✉️ sales@welfare-ai.kr</p>
            </div>
        </div>
    `
}

// Analytics Tracking
function trackEvent(eventName, properties = {}) {
  // Google Analytics 4 tracking
  window.gtag =
    window.gtag ||
    (() => {
      window.dataLayer.push(arguments)
    })
  window.dataLayer.push(arguments)

  // Custom analytics tracking
  console.log("Event tracked:", eventName, properties)

  // You can add other analytics services here
  // Example: Mixpanel, Amplitude, etc.
}

// Form Submission Handlers
document.addEventListener("submit", (e) => {
  if (e.target.classList.contains("trial-form")) {
    e.preventDefault()
    handleTrialSubmission(e.target)
  } else if (e.target.classList.contains("subscription-form")) {
    e.preventDefault()
    handleSubscriptionSubmission(e.target)
  } else if (e.target.classList.contains("contact-form")) {
    e.preventDefault()
    handleContactSubmission(e.target)
  }
})

function handleTrialSubmission(form) {
  const formData = new FormData(form)
  const data = Object.fromEntries(formData)

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "처리 중..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    alert("무료 체험 신청이 완료되었습니다! 곧 이메일로 안내를 보내드리겠습니다.")
    form.closest(".modal").remove()

    trackEvent("trial_form_submitted", data)
  }, 2000)
}

function handleSubscriptionSubmission(form) {
  const formData = new FormData(form)
  const data = Object.fromEntries(formData)

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "처리 중..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    alert("구독 신청이 완료되었습니다! 결제 페이지로 이동합니다.")
    form.closest(".modal").remove()

    trackEvent("subscription_form_submitted", data)
  }, 2000)
}

function handleContactSubmission(form) {
  const formData = new FormData(form)
  const data = Object.fromEntries(formData)

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "전송 중..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    alert("상담 요청이 전송되었습니다! 영업팀에서 24시간 내에 연락드리겠습니다.")
    form.closest(".modal").remove()

    trackEvent("contact_form_submitted", data)
  }, 2000)
}

// Scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe plan cards
  const planCards = document.querySelectorAll(".plan-card")
  planCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(card)
  })

  // Observe addon cards
  const addonCards = document.querySelectorAll(".addon-card")
  addonCards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
    observer.observe(card)
  })
}
