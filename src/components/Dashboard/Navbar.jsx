import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../css/navbar.css';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  let userName =currentUser?.email || "Gusst"
   if(userName) {
       const match = userName.match(/^([a-zA-Z]+)[0-9]*@/);
       userName= match ? match[1] : ''
       userName =  userName.charAt(0).toUpperCase()+userName.slice(1).toLowerCase()
   }  

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        Smart Home
      </div>
      <div className="navbar-user">
        <span>{`Welcome ${userName}`}</span>
        {currentUser && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
