import React, { useRef } from 'react'
import type { RouteComponentProps } from 'react-router'
import { RouteConnectComponentType } from '@/types/common';


import MSPageTab from '@/components/MSPageTab'

import styles from './index.less'
import { IRouteComponentProps } from 'umi';



const Detail: React.FC<IRouteComponentProps> = props => {
    console.log(props)
    const { children, location: { search } } = props
    // 资源详情页不使用tab
    const mySearch = useRef<string>()
    if (search) {
        mySearch.current = search
    }
    const routesList = [
        {
            path: `/asset/web/detail/property/${mySearch.current}`,
            title: '性能监控',
            key: 'Property'
        },
        {
            path: `/asset/web/detail/port/${mySearch.current}`,
            title: '开放端口扫描',
            key: 'port'
        },
        {
            path: `/asset/web/detail/visit/${mySearch.current}`,
            title: '访问控制',
            key: 'visit'
        },
        {
            path: `/asset/web/detail/baseline/${mySearch.current}`,
            title: '基线扫描',
            key: 'baseline'
        },
    ]
    return <div className={styles.wrapper}>
        <MSPageTab type="line" routesList={routesList} initActiveKey="Property">
            {children}
        </MSPageTab>
    </div>
}

export default Detail
