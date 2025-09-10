import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TasksPage from './pages/TasksPage';
import TeamPage from './pages/TeamPage';
import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { loadFromStorage, saveToStorage } from './services/storage';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const data = loadFromStorage();
    setProjects(data.projects || []);
    setTasks(data.tasks || []);
    setTeam(data.team || []);
  }, []);

  useEffect(() => {
    saveToStorage({ projects, tasks, team });
  }, [projects, tasks, team]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardPage projects={projects} tasks={tasks} />} />
        <Route path="/projects" element={<ProjectsPage projects={projects} setProjects={setProjects} />} />
        <Route path="/tasks" element={<TasksPage tasks={tasks} setTasks={setTasks} />} />
        <Route path="/team" element={<TeamPage team={team} setTeam={setTeam} />} />
        <Route path="/calendar" element={<CalendarPage tasks={tasks} />} />
        <Route path="/reports" element={<ReportsPage projects={projects} tasks={tasks} />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
