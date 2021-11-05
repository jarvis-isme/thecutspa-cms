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
import { handleShift, handleShifts, handleSkills, openNotificationWithIcon } from "../../utils";
import staffService from "../../services/staff";

const { Option } = Select;
const { Step } = Steps;

const UpdateStaffPage = (props) => {
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

  const handleUpdate = async (values) => {
    const shitfIds = handleShifts(values);
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.email) {
      formData.append("email", values.email);
    }
    values.skills.forEach((item, index) => {
      formData.append(`skillIds[${index}]`, item);
    }); 
    formData.append("password", "staff123");
    formData.append("gender", values.gender);
    shitfIds.forEach((item, index) => {
      formData.append(`shiftIds[${index}]`, item);
    });
    formData.append("birthDay", values.birthday.format("YYYY-MM-DD"));
    formData.append("phone", values.phone);
    if (values.uploaded.length !== 0 && values.uploaded[0].status !== "done") {
      formData.append("file", values.uploaded[0].originFileObj);
    }
    const respone = await staffService.updateStaff(values.staffId, formData);
    openNotificationWithIcon(respone.code ===200? 'success':'warning', respone.message);
  };

  return (
    <Modal
      centred={true}
      visible={props.visible}
      footer={null}
      onCancel={props.onCancel}
      title="Update Staff"
    >
      <Form name="form_add" layout="vertical" onFinish={handleUpdate}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
          <AddFormInformation skills={props.skills} staff={props.staff} />
          <Typography.Paragraph
            style={{
              fontWeight: "bold",
            }}
          >
            Staff's work schedule:
          </Typography.Paragraph>
          <Form.Item
            name="monday"
            label="Monday:"
            initialValue={
              props.staff.shifts["1"]
                ? handleShift(props.staff.shifts["1"])
                : []
            }
          >
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
          <Form.Item
            name="tuesday"
            label="Tuesday:"
            initialValue={
              props.staff.shifts["2"]
                ? handleShift(props.staff.shifts["2"])
                : []
            }
          >
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
          <Form.Item
            name="wednesday"
            label="Wednesday:"
            initialValue={
              props.staff.shifts["3"]
                ? handleShift(props.staff.shifts["3"])
                : []
            }
          >
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
          <Form.Item
            name="thursday"
            label="Thursday:"
            initialValue={
              props.staff.shifts["4"]
                ? handleShift(props.staff.shifts["4"])
                : []
            }
          >
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
          <Form.Item
            name="friday"
            label="Friday:"
            initialValue={
              props.staff.shifts["5"]
                ? handleShift(props.staff.shifts["5"])
                : []
            }
          >
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
          <Form.Item
            name="saturday"
            label="Saturday:"
            initialValue={
              props.staff.shifts["6"]
                ? handleShift(props.staff.shifts["6"])
                : []
            }
          >
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
          <Form.Item
            name="sunday"
            label="Sunday:"
            initialValue={
              props.staff.shifts["0"]
                ? handleShift(props.staff.shifts["0"])
                : []
            }
          >
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
          <Form.Item name="staffId" initialValue={props.staff.id} />
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
export default UpdateStaffPage;

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
        initialValue={props.staff.name}
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
        initialValue={props.staff.phone}
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
            message: "Please input your email!",
          },
        ]}
        initialValue={props.staff.email ? props.staff.email : ""}
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
        initialValue={props.staff.gender}
      >
        <Select defaultValue={props.staff.gender}>
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
        initialValue={moment(props.staff.birthDay)}
      >
        <DatePicker
          defaultValue={
            props.staff.birthDay ? moment(props.staff.birthDay) : null
          }
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
        initialValue={handleSkills(props.staff.skills)}
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
        initialValue={[
          {
            status: "done",
            url: props.staff.avatar.filePath,
            name: "image.png",
          },
        ]}
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
