import './App.css'
import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { RoutePath } from './constant/routes'
import NotFoundPage from './components/other/not-found-page'
import './assets/font/iconfont.css'

// 直接导入页面组件
import LoginPage from './views/login'
import HomePage from './views/home'
import CompPage from './views/comp/competition'
import MainLayout from './components/main-layout'
import ProfilePage from './views/profile'
import CompetitionListPage from './views/comp/comp_list'
import AuthWrap from './components/auth-wrap'
import SSOSession from './components/sso/SsoSession'
import RecruitListPage from './views/recruit'
import RecruitDetail from './views/recruit/detail'
// import PersonPage from './views/personal'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录/注册页面，没有HeaderBar */}
        <Route path={RoutePath.Login} element={<LoginPage />} />
        <Route path={RoutePath.Register} element={<LoginPage />} />
        <Route path={RoutePath.SSOLogin} element={<SSOSession />} />

        {/* 使用MainLayout的页面 */}
        <Route element={<MainLayout />}>
          {/* 首页重定向 */}
          <Route index element={<Navigate to={RoutePath.Home} />} />
          <Route path={RoutePath.Home} element={<HomePage />} />
          <Route path={RoutePath.Competition} element={<CompPage />} />
          <Route
            path={RoutePath.Profile}
            element={
              <AuthWrap>
                <ProfilePage />
              </AuthWrap>
            }
          />
          <Route
            path={RoutePath.CompetitionList}
            element={<CompetitionListPage />}
          ></Route>
          <Route path={RoutePath.Recruit} element={<RecruitListPage/>} />
          <Route path={RoutePath.RecruitDetail} element={<RecruitDetail/>} />
          {/* 404页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
