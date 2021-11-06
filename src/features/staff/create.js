import {
  Steps,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Typography,
  
} from "antd";
import moment from "moment";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { handleShifts, openNotificationWithIcon } from "../../utils";
import staffService from "../../services/staff";

const { Option } = Select;
const { Step } = Steps;

const CreateStaffPage = (props) => {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: "Information",
      content: <AddFormInformation />,
    },
    {
      title: "Workdays",
      content: "<CreateWorkday/> ",
    },
    {
      title: "Done",
      content: "Last-content",
    },
  ];
  const handleAdd = async (values) => {
    const shitfIds = handleShifts(values);
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.email) {
      formData.append("email", values.email);
    }
    formData.append("password", "staff123");
    formData.append("gender", values.gender);
    shitfIds.forEach((item, index) => {
      formData.append(`shiftIds[${index}]`, item);
    });
    values.skills.forEach((item, index) => {
      formData.append(`skillIds[${index}]`, item);
    });
    formData.append("birthDay", values.birthday.format("YYYY-MM-DD"));
    formData.append("phone", values.phone);
    if (values.uploaded.length !== 0) {
      formData.append("file", values.uploaded[0].originFileObj);
    }
    const respone = await staffService.createStaff(formData);
    if(respone.code===200){
      openNotificationWithIcon('success',respone.message);
    }else{
      openNotificationWithIcon('error', respone.message);
    }
  };

  return (
    <Modal
      centred={true}
      visible={props.visible}
      footer={null}
      onCancel={props.onCancel}
      title="Create Staff"
    >
      <Form name="form_add" layout="vertical" onFinish={handleAdd}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          <AddFormInformation skills={props.skills}/>
        
          <Typography.Paragraph
            style={{
              fontWeight: "bold",
            }}
          >
            Staff's work schedule:
          </Typography.Paragraph>
          <Form.Item name="monday" label="Monday:">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select workdays in week    "
            >
              {props.shifts["1"].map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.shift_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="tuesday" label="Tuesday:">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select workdays in week    "
            >
              {props.shifts["2"].map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.shift_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="wednesday" label="Wednesday:">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select workdays in week    "
            >
              {props.shifts["3"].map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.shift_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="thursday" label="Thursday:">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select workdays in week    "
            >
              {props.shifts["4"].map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.shift_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="friday" label="Friday:" initialValue={[]}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select workdays in week    "
            >
              {props.shifts["5"].map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.shift_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="saturday" label="Saturday:" initialValue={[]}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select workdays in week    "
            >
              {props.shifts["6"].map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.shift_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sunday" label="Sunday:" initialValue={[]}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Please select workdays in week"
            >
              {props.shifts["0"].map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.shift_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="steps-action">
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Done
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
export default CreateStaffPage;

const AddFormInformation = (props) => {
  //handle upload image
  const uploadFile = (e) => {

    if (Array.isArray(e)) {
      return e;
    }

    return e.fileList;
  };
  return (
    <>
      <Typography.Paragraph
        style={{
          fontWeight: "bold",
          marginTop: 10,
        }}
      >
        Staff's information:
      </Typography.Paragraph>
      <Form.Item
        name="name"
        label="Name:"
        rules={[
          {
            required: true,
            message: "Please input your name",
          },
        ]}
        initialValue={""}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone:"
        rules={[
          {
            required: true,
            message: "Please input your phone!",
          },
        ]}
        initialValue={""}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email:"
        rules={[
          {
            message: "Please input valid your staff email!",
            type: "email",
          },
          {
            required: true,
            message: "Please input staff's birthday",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Gender:"
        rules={[
          {
            required: true,
            message: "Please select staff's gender!",
          },
        ]}
        initialValue={0}
      >
        <Select defaultValue={0}>
          <Option value={0}>Male</Option>
          <Option value={1}>Female</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="birthday"
        label="Birthday:"
        rules={[
          {
            required: true,
            message: "Please input staff's birthday",
          },
        ]}
        initialValue={""}
      >
        <DatePicker
          format={"YYYY-MM-DD"}
          disabledDate={(current) => {
            return current && current > moment().subtract(18, "year");
          }}
          defaultPickerValue={moment().subtract(18, "year")}
        />
      </Form.Item>
      <Form.Item
        name="skills"
        label="Skills:"
        rules={[
          {
            required: true,
            message: "Please input staff's skills",
          },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select staff skills "
        >
          {props.skills.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Image:"
        name="uploaded"
        valuePropName="fileList"
        initialValue={[]}
        getValueFromEvent={uploadFile}
      >
        <Upload
          name="image"
          showUploadList={true}
          listType="picture"
          beforeUpload={(file) => {
            return false;
          }}
          maxCount={1}
        >
          <Button name="image" icon={<UploadOutlined />}>
            Edit
          </Button>
        </Upload>
      </Form.Item>
    </>
  );
};
