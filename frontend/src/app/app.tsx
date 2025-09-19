import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login/login';
import Register from './register/register';
import Dashboard from './dashboard/dashboard';
import Test from './test/test';
import SimpleLogin from './simple-login/simple-login';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/simple" element={<SimpleLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<NxWelcome title="@polls/frontend" />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
