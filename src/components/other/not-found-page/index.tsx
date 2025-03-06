import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

/**404页 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate('/') // Navigate to the home page
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
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={goHome}>
            Back Home
          </Button>
        }
      />
    </div>
  )
}

export default NotFoundPage
