import React, { useState } from "react";
import { Layout, Menu  } from "antd";
import {
  CustomerServiceOutlined,
  UserOutlined,
  DashOutlined,
} from "@ant-design/icons";
import { Route, Switch } from "react-router";
import Product from "../../features/product";
import Service from "../../features/service";
import NotFound from '../common/not_found';
import { Link } from "react-router-dom";

const {  Sider } = Layout;

const AdminLayout = () => {
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
                <Menu.Item key="1" icon={<DashOutlined />}>
                  <Link to="/admin/product"></Link>
                  Quản lý sản phẩm
                </Menu.Item>
                <Menu.Item key="2" icon={<CustomerServiceOutlined />}>
                  <Link to="/admin/service"></Link>
                  Quản lý dịch vụ
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />}>
                  Quản lý nhân viên
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout className="site-layout">
              <Switch>
                <Route path="/admin/product">
                  <Product />
                </Route>
                <Route path="/admin/service">
                  <Service />
                </Route>
                <Route >
                  <NotFound/>
                </Route>
              </Switch>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
};
export default AdminLayout;
