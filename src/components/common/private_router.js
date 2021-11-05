import { notification } from 'antd';
import React, {useEffect} from 'react';
import { useHistory } from 'react-router';
const openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };
const PrivateRouter = () =>{
    const _useHistory = useHistory()
    useEffect(()=>{
        openNotification('warning','Your permission is deny')
        _useHistory.goBack()
        _useHistory.goBack()
    })
    return(
        <React.Fragment></React.Fragment>
    )
}

export default PrivateRouter;