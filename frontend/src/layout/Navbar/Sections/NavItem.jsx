import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../store/thunkFunction';
import ReportModal from './ReportModal'; // 모달 컴포넌트 import
import SettingModal from './SettingModal'; // 모달 컴포넌트 import
import { toast } from "react-toastify";

const routes = [
  {to: '/dashboard', name: 'DashBoard', auth: false, isDashboard: true},
  {to: '/graph', name: 'GraphDetail', auth: false, isDashboard: true},
  {to: '/airmonitor', name: 'IndoorEnv', auth: false, isDashboard: true},
  {to: '', name: 'Report', auth: false, isDashboard: true},
  {to: '/setting', name: 'Setting', auth: false, isDashboard: true},
  {to: '/login', name: 'Login', auth: false, isDashboard: false},
  {to: '/register', name: 'Sign Up', auth: false, isDashboard: false},
  {to: '/', name: 'Logout', auth: true, isDashboard: false},
]

const NavItem = ({ mobile }) => {
  const isAuth = useSelector(state => state.user?.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        navigate('/login');
      })
  }

  // 모달 상태 관리
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const handleReportClick = () => {
    setIsReportModalOpen(prevState => !prevState);
  }

  const handleSettingClick = () => {
    setIsSettingModalOpen(prevState => !prevState);
  }

  const handleCloseModal = () => {
    setIsReportModalOpen(false);
    setIsSettingModalOpen(false);
  }
  
  const handleToast = () => {
    toast.error('로그인 하세요')
  }

  const [checkedMenu, setCheckedMenu] = useState('DashBoard');
  const handleClick = (name) => {
    setCheckedMenu(name);
  }
  
  return (
    <div>
      <ul className={`text-md justify-center w-full flex gap-6 ${mobile && "flex-col bg-gray-800 h-full"} items-center`}>
        {routes.map(({to, name, auth, isDashboard}) => {
          if (isAuth !== auth && !isDashboard) return null;


          else if ( isDashboard === true ) {
            if (name === 'Report') {
              return (
                <li key={name} className='py-2 border-b-2 text-center cursor-pointer hover:text-gray-800'>
                  {isAuth ? (
                    <button onClick={handleReportClick}>
                      {name}
                    </button>
                      ) : (
                    <button onClick={handleToast}>
                      {name}
                    </button>
                  )}
                </li>
              );
            }
            else if (name === 'Setting') {
              return (
                <li key={name} className='py-2 border-b-2 text-center cursor-pointer hover:text-gray-800'>
                  {isAuth ? (
                    <button onClick={handleSettingClick}>
                      {name}
                    </button>
                      ) : (
                    <button onClick={handleToast}>
                      {name}
                    </button>
                  )}
                </li>
              );
            }
            return (
              <li key={name} className={`${checkedMenu==name && "font-extrabold text-black"} py-2 border-b-2 text-center cursor-pointer hover:text-gray-800`}>
                <Link
                  to={to}
                  onClick={() => handleClick(name)}>
                    {name}
                </Link>
              </li>
            );
          }
           else if (name === 'Logout') {
            return (
              <li key={name} className='py-2 text-center cursor-pointer hover:text-gray-800'>
                <Link onClick={handleLogout}>
                  {name}
                </Link>
              </li>
            );
          } else {
            return (
              <li key={name} className='py-2 text-center cursor-pointer hover:text-gray-800'>
                <Link to={to}>
                  {name}
                </Link>
              </li>
            );
          }
        })}
      </ul>
      {/* 모달 렌더링 */}
      {isReportModalOpen && <ReportModal closeModal={handleCloseModal}/>}
      {isSettingModalOpen && <SettingModal closeModal={handleCloseModal}/>}
    </div>
  )
}

export default NavItem;
