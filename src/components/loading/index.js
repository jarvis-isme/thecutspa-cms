import React,{useState,useImperativeHandle,forwardRef} from 'react';
import {
    Spin,
    Row,
    Col
} from 'antd';
import {
    LoadingOutlined
} from '@ant-design/icons'

const Loading = (props,ref) => {
    const [isLoading,setIsLoading] = useState(false);
    useImperativeHandle(ref,()=>({
        isLoading,
        show : () => setIsLoading(true),
        hide : () => setIsLoading(false)
    }));
    return (
        <React.Fragment>
            {isLoading && <div style = {{height:'100vh',width:'100vw',position:'fixed',zIndex:1,backgroundColor:'white',opacity:'0.6'}}>
                <Row style={{height:'100vh'}} justify='space-around' align='middle'>
                    <Col span='1'>
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} size='large'/>
                    </Col>
                </Row>
            </div>}
        </React.Fragment>
    )
}

export default forwardRef(Loading);