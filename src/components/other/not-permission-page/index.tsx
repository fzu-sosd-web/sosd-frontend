import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { RoutePath } from '@/constant/routes'

/**无权访问页 */
const NotPermissionPage: React.FC = () => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate(RoutePath.Login) // Navigate to the login page
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={goHome}>
            To Login
          </Button>
        }
      />
    </div>
  )
}

export default NotPermissionPage
