// State Management
let state = {
    projects: [],
    tasks: [],
    currentPage: 'dashboard',
    modalType: '',
    sidebarCollapsed: false
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    updateDashboard();
});

// Storage functions
function saveToStorage() {
    localStorage.setItem('pmAppState', JSON.stringify(state));
}

function loadFromStorage() {
    const saved = localStorage.getItem('pmAppState');
    if (saved) {
        state = JSON.parse(saved);
    }
}

// Page Navigation
function showPage(pageId) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.nav-link').classList.add('active');
    
    // Show selected page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId + '-page').classList.add('active');
    
    state.currentPage = pageId;
    
    // Update content based on page
    if (pageId === 'dashboard') {
        updateDashboard();
    } else if (pageId === 'projects') {
        renderAllProjects();
    } else if (pageId === 'tasks') {
        renderAllTasks();
    }
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    state.sidebarCollapsed = !state.sidebarCollapsed;
}

// Modal Functions
function openModal(type) {
    state.modalType = type;
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    
    title.textContent = type === 'project' ? 'New Project' : 'New Task';
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.getElementById('modalForm').reset();
}

function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        id: Date.now().toString(),
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        status: document.getElementById('itemStatus').value,
        priority: document.getElementById('itemPriority').value,
        dueDate: document.getElementById('itemDueDate').value,
        createdAt: new Date().toISOString(),
        progress: Math.
