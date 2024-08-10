import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const NotAuthRoutes = ({ isAuth }) => {
  return (
      //isAuth ? <Navigate to={'/'}/> : <Outlet />
      isAuth ? <Outlet /> : <Outlet /> //일단은 로그인 한 상태에서 NavItem 클릭해서 이동할 수 있도록 수정
  )
}

export default NotAuthRoutes
