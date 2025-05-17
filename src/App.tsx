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
import AboutUs from './views/aboutus'
import AdminRecruitPage from './views/admin/recruit'
import AdminRecruitDetailPage from './views/admin/recruit/detail'
import { API_BASE_URL } from './constant/web'
import { route } from './utils'
import { routes } from './routes'

// import PersonPage from './views/personal'

const App = () => {
  const routeList = route.flattenRoutes(routes)
  return (
    <BrowserRouter>
      <Routes>
        {API_BASE_URL == 'http://81.68.212.127:5083' && (
          <Route path={RoutePath.Login} element={<LoginPage />} />
        )}
        <Route path={RoutePath.SSOLogin} element={<SSOSession />} />
        <Route element={<MainLayout />}>
          {/* 首页重定向 */}
          <Route index element={<Navigate to={RoutePath.Home} />} />
          {routeList.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                <AuthWrap permission={item.permission}>{item.element}</AuthWrap>
              }
            />
          ))}
          {/* 404页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

{
  /* 首页重定向 */
}
{
  /* <Route index element={<Navigate to={RoutePath.Home} />} />
          <Route path={RoutePath.Home} element={<HomePage />} />
          <Route path={RoutePath.Competition} element={<CompPage />} />
          <Route
            path={RoutePath.AdminRecruit}
            element={
              <AuthWrap>
                <AdminRecruitPage />
              </AuthWrap>
            }
          />
          <Route
            path={RoutePath.AdminRecruitDetail}
            element={
              <AuthWrap>
                <AdminRecruitDetailPage />
              </AuthWrap>
            }
          />
          <Route
            path={RoutePath.Profile}
            element={
              <AuthWrapLogin>
                <ProfilePage />
              </AuthWrapLogin>
            }
          />
          <Route
            path={RoutePath.CompetitionList}
            element={<CompetitionListPage />}
          ></Route>
          <Route path={RoutePath.Recruit} element={<RecruitListPage />} />
          <Route path={RoutePath.RecruitDetail} element={<RecruitDetail />} />
          <Route path={RoutePath.AboutUs} element={<AboutUs />} /> */
}
