import { Drawer } from 'antd'
import styles from './index.less'
import React from 'react'
import { useRequest } from 'ahooks'
import { getBaselineDetailinfo } from '@/services/agent'
interface IProps {
    data?: string | boolean
    onClose: () => void
}

const IndexPage: React.FC<IProps> = ({ data, onClose }) => {
    const { data: detail } = useRequest(() => data ? getBaselineDetailinfo({ cis_id: data + '' }) : Promise.resolve({
        desc: '',
        explain: '',
        name: '',
        solute: ''
    }), {
        refreshDeps: [data]
    })
    return (
        <Drawer width={450} visible={!!data} closable={false} onClose={onClose}>
            <h2>端口服务详情</h2>
            <ul className={styles.list}>
                <li>基线规则名称:<span>{detail?.name || ''}</span></li>
                <li>基线规则描述:<span>{detail?.desc || ''}</span></li>
                <li>解释:<span>{detail?.explain || ''}</span></li>
                <li>解决方案:<span>{detail?.solute || ''}</span></li>
            </ul>
        </Drawer>
    )
}

export default IndexPage