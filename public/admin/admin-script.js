import { Chart } from "@/components/ui/chart"
// Admin Panel JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeAdminPanel()
})

// Initialize Admin Panel
function initializeAdminPanel() {
  // Check if we're on the login page
  if (document.querySelector(".login-page")) {
    initializeLoginPage()
    return
  }

  // Initialize sidebar toggle
  initializeSidebar()

  // Initialize tabs if they exist
  if (document.querySelector(".tabs")) {
    initializeTabs()
  }

  // Initialize modals if they exist
  if (document.querySelector(".modal")) {
    initializeModals()
  }

  // Initialize charts if they exist
  if (document.getElementById("chatStatChart") || document.getElementById("categoryChart")) {
    initializeCharts()
  }

  // Initialize data tables if they exist
  if (document.querySelector(".data-table")) {
    initializeDataTables()
  }
}

// Login Page
function initializeLoginPage() {
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const username = document.getElementById("username").value
      const password = document.getElementById("password").value

      // Simple validation
      if (!username || !password) {
        alert("아이디와 비밀번호를 입력해주세요.")
        return
      }

      // Simulate login (in a real app, this would be an API call)
      simulateLogin(username, password)
    })
  }
}

function simulateLogin(username, password) {
  // Show loading state
  const submitBtn = document.querySelector('#loginForm button[type="submit"]')
  const originalText = submitBtn.textContent
  submitBtn.textContent = "로그인 중..."
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    // For demo purposes, any credentials will work
    window.location.href = "dashboard.html"
  }, 1500)
}

// Sidebar
function initializeSidebar() {
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
      if (mainContent) {
        mainContent.style.marginLeft = sidebar.classList.contains("collapsed") ? "80px" : "280px"
      }
    })
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("로그아웃 하시겠습니까?")) {
        window.location.href = "index.html"
      }
    })
  }
}

// Tabs
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Hide all tab panes
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("active")
      })

      // Deactivate all tab buttons
      tabButtons.forEach((btn) => {
        btn.classList.remove("active")
      })

      // Activate the clicked tab button
      this.classList.add("active")

      // Show the corresponding tab pane
      document.getElementById(tabId).classList.add("active")
    })
  })
}

// Modals
function initializeModals() {
  // Policy Modal
  const addPolicyBtn = document.getElementById("addPolicyBtn")
  const policyModal = document.getElementById("policyModal")
  const cancelPolicyBtn = document.getElementById("cancelPolicyBtn")
  const savePolicyBtn = document.getElementById("savePolicyBtn")
  const modalClose = document.querySelector(".modal-close")

  if (addPolicyBtn && policyModal) {
    addPolicyBtn.addEventListener("click", () => {
      policyModal.classList.add("active")
    })
  }

  if (cancelPolicyBtn) {
    cancelPolicyBtn.addEventListener("click", () => {
      policyModal.classList.remove("active")
    })
  }

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      policyModal.classList.remove("active")
    })
  }

  if (savePolicyBtn) {
    savePolicyBtn.addEventListener("click", () => {
      // Validate form
      const policyName = document.getElementById("policyName").value
      const policyCategory = document.getElementById("policyCategory").value
      const policyTarget = document.getElementById("policyTarget").value

      if (!policyName || !policyCategory || !policyTarget) {
        alert("필수 항목을 모두 입력해주세요.")
        return
      }

      // Simulate saving (in a real app, this would be an API call)
      simulateSavePolicy()
    })
  }
}

function simulateSavePolicy() {
  // Show loading state
  const saveBtn = document.getElementById("savePolicyBtn")
  const originalText = saveBtn.textContent
  saveBtn.textContent = "저장 중..."
  saveBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    alert("정책이 성공적으로 저장되었습니다.")
    document.getElementById("policyModal").classList.remove("active")

    // Reset form
    document.getElementById("policyForm").reset()

    // Reset button
    saveBtn.textContent = originalText
    saveBtn.disabled = false
  }, 1500)
}

// Charts
function initializeCharts() {
  // Chat Statistics Chart
  const chatStatChart = document.getElementById("chatStatChart")
  if (chatStatChart) {
    new Chart(chatStatChart, {
      type: "line",
      data: {
        labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
        datasets: [
          {
            label: "챗봇 상담 건수",
            data: [5200, 7800, 12000, 18500, 25000, 52147],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.3,
            fill: true,
          },
          {
            label: "성공적 응답률 (%)",
            data: [78, 80, 82, 85, 86, 87],
            borderColor: "#10b981",
            backgroundColor: "transparent",
            tension: 0.3,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "상담 건수",
            },
          },
          y1: {
            beginAtZero: true,
            position: "right",
            max: 100,
            title: {
              display: true,
              text: "성공률 (%)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    })
  }

  // Category Chart
  const categoryChart = document.getElementById("categoryChart")
  if (categoryChart) {
    new Chart(categoryChart, {
      type: "bar",
      data: {
        labels: [
          "육아 지원",
          "노인 복지",
          "청년 지원",
          "장애인 복지",
          "고용 지원",
          "주거 지원",
          "교육 지원",
          "의료 지원",
        ],
        datasets: [
          {
            label: "정책 수",
            data: [245, 187, 156, 142, 128, 115, 98, 177],
            backgroundColor: [
              "rgba(59, 130, 246, 0.7)",
              "rgba(16, 185, 129, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(236, 72, 153, 0.7)",
              "rgba(14, 165, 233, 0.7)",
              "rgba(249, 115, 22, 0.7)",
              "rgba(239, 68, 68, 0.7)",
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "정책 수",
            },
          },
        },
      },
    })
  }
}

// Data Tables
function initializeDataTables() {
  // Select All Checkbox
  const selectAll = document.getElementById("selectAll")
  if (selectAll) {
    selectAll.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(".policy-select")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked
      })
    })
  }

  // Category Filter
  const categoryFilter = document.getElementById("categoryFilter")
  if (categoryFilter) {
    categoryFilter.addEventListener("change", function () {
      const category = this.value
      filterTable(".policy-table tr", 3, category)
    })
  }

  // Status Filter
  const statusFilter = document.getElementById("statusFilter")
  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      const status = this.value
      filterTable(".policy-table tr", 6, status, true)
    })
  }

  // Response Category Filter
  const categoryFilterResponse = document.getElementById("categoryFilterResponse")
  if (categoryFilterResponse) {
    categoryFilterResponse.addEventListener("change", function () {
      const category = this.value
      filterTable(".data-table tr", 3, category)
    })
  }
}

function filterTable(selector, columnIndex, filterValue, isStatus = false) {
  const rows = document.querySelectorAll(selector)

  rows.forEach((row, index) => {
    // Skip header row
    if (index === 0) return

    const cell = row.cells[columnIndex]
    if (!cell) return

    let cellValue

    if (isStatus) {
      const statusSpan = cell.querySelector(".status")
      cellValue = statusSpan ? statusSpan.classList[1] : ""
    } else {
      cellValue = cell.textContent.trim()
    }

    if (filterValue === "" || cellValue.includes(filterValue)) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

// Chatbot Training
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "trainChatbotBtn") {
    trainChatbot()
  }

  if (e.target && e.target.id === "addResponseBtn") {
    alert("새 응답 추가 기능은 개발 중입니다.")
  }

  if (e.target && e.target.id === "importResponsesBtn") {
    alert("일괄 가져오기 기능은 개발 중입니다.")
  }
})

function trainChatbot() {
  const trainBtn = document.getElementById("trainChatbotBtn")
  const originalText = trainBtn.innerHTML

  trainBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 학습 중...'
  trainBtn.disabled = true

  // Simulate training
  setTimeout(() => {
    alert("챗봇 학습이 완료되었습니다.")
    trainBtn.innerHTML = originalText
    trainBtn.disabled = false
  }, 3000)
}
