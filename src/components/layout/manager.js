import React, { useEffect, useState } from "react";
import { Layout, Menu  } from "antd";
import {
  CustomerServiceOutlined,
  UserOutlined,
  DashOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Route, Switch, useHistory } from "react-router";
import Product from "../../features/product";
import Service from "../../features/service";
import NotFound from '../common/not_found';
import StaffPage from '../../features/staff'
import { Link } from "react-router-dom";
import userService from "../../services/user";
import { USER_ROLE } from "../../constant";

const {  Sider } = Layout;

const ManagerLayout = () => {
  const _useHistory = useHistory()
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    if(!localStorage.getItem('ACCESS_TOKEN')) _useHistory.replace('/')
    if( localStorage.getItem('ROLE') != USER_ROLE.MANAGER) _useHistory.push('/private') 
    else setLoading(false)
  },[])
  const [collapse, setCollapse] = useState(true);
    return (
      <div>
        <Layout>
          <Layout>
            <Sider
              style={{
                minHeight: "100vH",
              }}
              collapsed={collapse}
              collapsible
              onCollapse={() => setCollapse(!collapse)}
            >
              <Menu theme="dark" defaultSelectedKeys={["1"]}>
                {/* <Menu.Item  key="1" icon={<DashOutlined />}>
                  <Link to="/admin/product"></Link>
                  Quản lý sản phẩm
                </Menu.Item> */}
                <Menu.Item key="1" icon={<CustomerServiceOutlined />}>
                  <Link to="/manager/service"></Link>
                  Quản lý dịch vụ
                </Menu.Item>
                <Menu.Item key="2" icon={<UserOutlined />}>
                  <Link to="/manager/staff"></Link>
                  Quản lý nhân viên
                </Menu.Item>
                <Menu.Item key="3" onClick={()=>userService.logout()} icon={<LogoutOutlined />}>
                  <Link to="/"/>
                  Đăng xuất
                </Menu.Item>
              </Menu>
            </Sider>
            {!loading && <Layout className="site-layout">
              <Switch>
                {/* <Route path="/manager/product">
                  <Product />
                </Route> */}
                <Route path="/manager/service">
                  <Service />
                </Route>
                <Route path="/manager/staff">
                  <StaffPage />
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Layout>}
          </Layout>
        </Layout>
      </div>
    );
};
export default ManagerLayout;
