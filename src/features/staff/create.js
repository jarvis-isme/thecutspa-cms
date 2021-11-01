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

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;

const CreateStaffPage = (props) => {
  
  const [saveStaff, setSaveStaff] = useState(); 
  //handle create staff information
  
  const handleAdd = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append()
  };
  
  const [current, setCurrent] = React.useState(0);
  
  const steps = [
    {
      title: "Information",
      content: <AddFormInformation onFinish={handleAdd} />,
    },
    {
      title: "Workdays",
      content: "Second-content",
    },
    {
      title: "Last",
      content: "Last-content",
    },
  ];
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <Modal
      centered={true}
      visible={true}
      footer={null}
      onCancel={props.onCancel}
      title="Create Staff"
    >
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </Modal>
  );
};
export default CreateStaffPage;

const AddFormInformation = (props) => {
  //handle upload image
  const uploadFile = (e) => {
    console.log("Upload event:", e.fileList);

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
      <Form name="form_add" layout="vertical" onFinish={props.onFinish}>
        <Form.Item
          name="name"
          label="Name:"
          rules={[
            {
              required: true,
              message: "Please input your name",
            },
          ]}
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
        >
          <DatePicker
            disabledDate={(current) => {
              return current && current > moment().subtract(18, "year");
            }}
            defaultPickerValue={moment().subtract(18, "year")}
          />
        </Form.Item>
        <Form.Item
          label="Image:"
          name="uploaded"
          valuePropName="fileList"
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
        
        <Form.Item>
          <Button htmlType='submit'>Next</Button>
        </Form.Item>
      </Form>
    </>
  );
};


//
const CreateWorkday = () =>{
  return (
    <>
      <Typography.Paragraph
        style={{
          fontWeight: "bold",
        }}
      >
        Staff's work schedule:
      </Typography.Paragraph>
      <Form.Item
        name="dayInWeek"
        label="Workdays in week:"
        rules={[
          {
            required: true,
            message: "Please input staff's birthday",
          },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select workdays in week    "
        >
          <Option value={1}>Monday</Option>
          <Option value={2}>Tuesday</Option>
          <Option value={3}>Wednesday</Option>
          <Option value={4}>Thursday</Option>
          <Option value={5}>Friday</Option>
          <Option value={6}>Saturday</Option>
          <Option value={0}>Sunday</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="startTime"
        label="Day's work In Week"
        rules={[
          {
            required: true,
            message: "Please input staff's birthday",
          },
        ]}
      >
        <RangePicker picker="time"></RangePicker>
      </Form.Item>
    </>
  );
}
