import React from "react";
import "antd/dist/antd.css";
import { Form, Input, Button, notification, Space } from "antd";
import { useHistory } from "react-router-dom";
import userService from "../../services/user";
import { USER_ROLE } from "../../constant";

const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: message,
  });
};

const Login = (props) => {
  const history = useHistory();
  const onFinish = async (values) => {
    //format username
    let username = values.username;
    if (!values.username.includes("@")) {
      username = "+84" + values.username.substr(1, values.username.length);
    }
    //call api to login
    const params = {
      userId: username,
      password: values.password,
    };
    global.loading.show();
    const respone = await userService.loginService(params);
    global.loading.hide();
    if (respone.code === 200 && (respone.data.user.role_id === USER_ROLE.ADMIN || respone.data.user.role_id === USER_ROLE.MANAGER)) {
      localStorage.setItem("ACCESS_TOKEN", respone.data.token);
      localStorage.setItem("ROLE", respone.data.user.role_id);
      openNotificationWithIcon("success", respone.message);
      if(respone.data.user.role_id === USER_ROLE.ADMIN) history.replace("admin/product");
      else history.replace("manager/service")
    } else {
      openNotificationWithIcon("error", respone.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
  };
  return (
    <Space
      size="middle"
      style={{
        marginTop: "10%",
        marginLeft: "25%",
        border: "1px solid",
        padding: 20,
      }}
      align="center"
    >
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 12,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default Login;
