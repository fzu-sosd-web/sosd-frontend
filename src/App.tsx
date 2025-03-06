import './App.css'
import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { RoutePath } from './constant/routes'
import NotFoundPage from './components/other/not-found-page'
import './assets/font/iconfont.css'

// 直接导入页面组件
import LoginPage from './views/login'
import RegisterPage from './views/register'
import HomePage from './views/home'
import CompPage from './views/comp/competition'
import MainLayout from './components/main-layout'
import ProfilePage from './views/profile'
// import PersonPage from './views/personal'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录/注册页面，没有HeaderBar */}
        <Route path={RoutePath.Login} element={<LoginPage />} />
        <Route path={RoutePath.Register} element={<RegisterPage />} />
        
        {/* 使用MainLayout的页面 */}
        <Route element={<MainLayout />}>
          {/* 首页重定向 */}
          <Route index element={<Navigate to={RoutePath.Home} />} />
          <Route path={RoutePath.Home} element={<HomePage />} />
          <Route path={RoutePath.Competition} element={<CompPage />} />
          <Route path={RoutePath.Profile} element={<ProfilePage />} /> 
          {/* 404页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
