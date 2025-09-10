import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    // Load data from localStorage
    const savedProjects = localStorage.getItem('projects');
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [projects, tasks]);

  const addProject = (project) => {
    const newProject = {
      id: Date.now().toString(),
      ...project,
      createdAt: new Date().toISOString(),
      progress: 0,
      status: 'active'
    };
    setProjects([...projects, newProject]);
    setShowModal(false);
  };

  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setShowModal(false);
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard projects={projects} tasks={tasks} />;
      case 'projects':
        return <Projects projects={projects} openModal={openModal} />;
      case 'tasks':
        return <Tasks tasks={tasks} setTasks={setTasks} openModal={openModal} />;
      case 'team':
        return <Team />;
      case 'calendar':
        return <Calendar tasks={tasks} />;
      case 'reports':
        return <Reports projects={projects} tasks={tasks} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard projects={projects} tasks={tasks} />;
    }
  };

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-content">
        <Header openModal={openModal} />
        <div className="content">
          {renderPage()}
        </div>
      </div>
      {showModal && (
        <Modal 
          type={modalType} 
          onClose={() => setShowModal(false)}
          onSubmit={modalType === 'project' ? addProject : addTask}
        />
      )}
    </div>
  );
}

// Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'tasks', label: 'Tasks', icon: '✅' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">PM</div>
        <span className="logo-text">Project Elite</span>
      </div>
      <nav>
        <ul className="nav-menu">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Header Component
const Header = ({ openModal }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
      </div>
      <div className="header-right">
        <button className="btn btn-primary" onClick={() => openModal('project')}>
          ➕ New Project
        </button>
      </div>
    </header>
  );
};

// Dashboard Component
const Dashboard = ({ projects, tasks }) => {
  const stats = [
    { title: 'Total Projects', value: projects.length, icon: '📊', change: '+12%', positive: true },
    { title: 'Active Tasks', value: tasks.filter(t => !t.completed).length, icon: '✓', change: '+8%', positive: true },
    { title: 'Completed', value: tasks.filter(t => t.completed).length, icon: '🎯', change: '+15%', positive: true },
    { title: 'Team Members', value: 12, icon: '👥', change: '+2', positive: true }
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard Overview</h1>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <div className="stat-icon">{stat.icon}</div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>
      <h2 className="section-title">Recent Projects</h2>
      <div className="projects-grid">
        {projects.slice(0, 3).map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-title">{project.name}</h3>
        <span className={`project-status status-${project.status}`}>
          {project.status}
        </span>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

// Projects Page
const Projects = ({ projects, openModal }) => {
  return (
    <div className="projects-page">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <button className="btn btn-primary" onClick={() => openModal('project')}>
          Add Project
        </button>
      </div>
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

// Tasks Page
const Tasks = ({ tasks, setTasks, openModal }) => {
  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <button className="btn btn-primary" onClick={() => openModal('task')}>
          Add Task
        </button>
      </div>
      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="task-checkbox"
            />
            <div className="task-content">
              <div className={`task-title ${task.completed ? 'completed' : ''}`}>
                {task.name}
              </div>
              <div className="task-meta">
                <span className={`priority priority-${task.priority}`}>
                  {task.priority}
                </span>
                <span>{task.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Other Pages (simplified)
const Team = () => <div><h1 className="page-title">Team Management</h1></div>;
const Calendar = ({ tasks }) => <div><h1 className="page-title">Calendar View</h1></div>;
const Reports = ({ projects, tasks }) => <div><h1 className="page-title">Reports & Analytics</h1></div>;
const Settings = () => <div><h1 className="page-title">Settings</h1></div>;

// Modal Component
const Modal = ({ type, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">New {type === 'project' ? 'Project' : 'Task'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select 
              className="form-select"
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
