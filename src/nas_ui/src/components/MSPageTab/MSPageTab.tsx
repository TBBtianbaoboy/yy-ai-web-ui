import { Tabs } from 'antd'
import type { TabsType } from 'antd/lib/tabs'
import type { FC } from 'react'
import React from 'react'
import { history, useLocation } from 'umi'

import styles from './index.less'

interface IPageTabRouteItem {
  path: string
  title: string
  key: string
}

interface IProps {
  routesList: IPageTabRouteItem[]
  initActiveKey: string
  type?: TabsType
}

const { TabPane } = Tabs
const MSPageTab: FC<IProps> = ({ routesList, initActiveKey, children, type = 'card' }) => {
  const { pathname } = useLocation()

  const activeKey = routesList.find(item => item.path.replace(/\?.+/, '') === encodeURI(pathname))?.key || initActiveKey
  console.log(encodeURI(pathname), pathname);

  const handleTabChange = (key: string) => {
    console.log('key', key);

    const curRoute = routesList.find(item => item.key === key)
    if (key === activeKey) {
      return
    }
    if (curRoute) {
      history.push(curRoute.path)
    }
  }

  return (
    <Tabs
      type="card"
      activeKey={activeKey}
      animated={false}
      onChange={handleTabChange}
      className={type === 'line' ? styles.tabs : ''}
    >
      {routesList.map(({ title, key }) => {
        console.log(activeKey, key);

        return (
          <TabPane key={key} tab={title}>
            {/* 必须加此判断，否则会造成 children 多次渲染 */}
            {activeKey === key && children}
          </TabPane>
        )
      })}
    </Tabs>
  )
}

export default MSPageTab
