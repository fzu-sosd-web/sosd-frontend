import React, { Suspense } from 'react'
import { Spin } from 'antd'

/**懒加载组件 */
const createLazyComponent = (
  importFunc: () => Promise<{ default: React.ComponentType }>,
) => {
  const LazyComponent = React.lazy(importFunc)

  return (
    <Suspense fallback={<Spin />}>
      <LazyComponent />
    </Suspense>
  )
}

export default createLazyComponent
