// ===== تسجيل الدخول =====
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        if (username === 'admin' && password === '1234') {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            alert('خطأ في اسم المستخدم أو كلمة المرور');
        }
    });
}

// ===== التحقق من تسجيل الدخول =====
if (window.location.pathname.includes('dashboard.html')) {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
    }
}

// ===== دوال المهام الأساسية =====
function getTasks() {
    let tasks = localStorage.getItem('myTasks');
    if (tasks === null) {
        return [];
    } else {
        return JSON.parse(tasks);
    }
}

function saveTasks(tasks) {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function showMessage(msg) {
    let div = document.createElement('div');
    div.className = 'alert-message';
    div.innerText = msg;
    document.body.appendChild(div);
    setTimeout(function() {
        div.remove();
    }, 2000);
}

// ===== إضافة مهمة =====
function addTask(title) {
    let tasks = getTasks();
    let newTask = {
        id: Date.now(),
        title: title
    };
    tasks.push(newTask);
    saveTasks(tasks);
    showMessage('✅ تمت الإضافة بنجاح');
}

// ===== حذف مهمة =====
function deleteTask(id) {
    let confirmDelete = confirm('هل أنت متأكد من الحذف؟');
    if (confirmDelete === true) {
        let tasks = getTasks();
        let newTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id !== id) {
                newTasks.push(tasks[i]);
            }
        }
        saveTasks(newTasks);
        showMessage('🗑️ تم الحذف بنجاح');
        
        let listSection = document.getElementById('listSection');
        if (listSection && listSection.style.display !== 'none') {
            displayTasks();
        }
        updateTotalTasks();
    }
}

// ===== عرض جميع المهام =====
function displayTasks() {
    let tasks = getTasks();
    let container = document.getElementById('tasksList');
    container.innerHTML = '';
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-message">📭 لا توجد مهام حالياً</div>';
        return;
    }
    
    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        let div = document.createElement('div');
        div.className = 'task-item';
        
        let span = document.createElement('span');
        span.className = 'task-text';
        span.innerText = task.title;
        
        let btn = document.createElement('button');
        btn.className = 'btn-delete';
        btn.innerText = '🗑️ حذف';
        btn.setAttribute('onclick', 'deleteTask(' + task.id + ')');
        
        div.appendChild(span);
        div.appendChild(btn);
        container.appendChild(div);
    }
}

// ===== تحديث عدد المهام =====
function updateTotalTasks() {
    let span = document.getElementById('totalTasks');
    if (span) {
        let tasks = getTasks();
        span.innerText = tasks.length;
    }
}

// ===== التنقل بين الأقسام =====
function showSection(sectionName) {
    let homeSec = document.getElementById('homeSection');
    let addSec = document.getElementById('addSection');
    let listSec = document.getElementById('listSection');
    let aboutSec = document.getElementById('aboutSection');
    
    if (homeSec) homeSec.style.display = 'none';
    if (addSec) addSec.style.display = 'none';
    if (listSec) listSec.style.display = 'none';
    if (aboutSec) aboutSec.style.display = 'none';
    
    if (sectionName === 'home') {
        homeSec.style.display = 'block';
        updateTotalTasks();
    } else if (sectionName === 'add') {
        addSec.style.display = 'block';
    } else if (sectionName === 'list') {
        listSec.style.display = 'block';
        displayTasks();
    } else if (sectionName === 'about') {
        aboutSec.style.display = 'block';
    }
}

// ===== نموذج إضافة مهمة =====
let taskForm = document.getElementById('taskForm');
if (taskForm) {
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let input = document.getElementById('taskTitle');
        let title = input.value;
        
        if (title === '') {
            alert('الرجاء إدخال عنوان المهمة');
            return;
        }
        
        addTask(title);
        input.value = '';
        updateTotalTasks();
    });
}

// ===== تسجيل الخروج =====
let logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
    });
}

// ===== عند تحميل الصفحة =====
if (window.location.pathname.includes('dashboard.html')) {
    updateTotalTasks();
    showSection('home');
}