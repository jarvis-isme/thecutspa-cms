import { Button, Skeleton, Popconfirm, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import staffService from "../../services/staff";
import CreateStaffPage from "./create";
import { openNotificationWithIcon } from "../../utils";
import UpdateStaffPage from "./update";
import { handleShifts } from "../../utils";

const StaffPage = () => {
  const [subLoading, setSubLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listStaff, setListStaff] = useState([]);
  const [isVisibleAdd, setIsVisibleAdd] = useState(false);
  const [selectedStaff, setSelectedStaff]= useState(null);
  const [listShift, setListShift] = useState([])
  const [isVisibleUpdate, setIsVisibleUpdate] = useState(false);
  const [listSkill, setListSkill] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Birthday",
      dataIndex: "birthDay",
      key: "birthDay",
      render: (birthDay) => <div>{birthDay ? birthDay.substr(0, 11) : ""}</div>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gener",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => <div>{gender === 0 ? "Male" : "Female"}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "red"} className="my-tag">
          {status ? "Active" : "Unactive"}
        </Tag>
      ),
    },
    {
      title: "Modifer",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <div>
          <Button icon={<EditOutlined />} type="primary" onClick={()=>handleShowModalUpdate(id)}></Button>
          <Popconfirm
            placement="bottomLeft"
            title={"Do you really want to delete  this product?"}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(id)}
          >
            <Button
              style={{
                marginLeft: 30,
              }}
              icon={<DeleteOutlined />}
              type="danger"
            ></Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  useEffect(() => {
    fetchData();
  }, [subLoading]);

  // fetch list Data
  const fetchData = async () => {
    const responseStaff = await staffService.getAll();
    const responseShift = await staffService.getAllShift();
    const responeSkill = await staffService.getAllSkill();
    setListShift(responseShift.data.shifts);
    setListStaff(responseStaff.data.staffs);
    setListSkill(responeSkill.data.skills);
    console.log(listStaff);
    console.log(listSkill);
    setLoading(false);
    setSubLoading(false);
  };

  //handle show modal update
  const handleShowModalUpdate = (id) => {
    let staff = null;
    listStaff.forEach((item) => {
      console.log(item.id);
      if (item.id === id) {
        staff = item;
      }
    });
    setSelectedStaff(staff);
    setIsVisibleUpdate(true);
    console.log(staff);
  };
  //handle hide modal update
  const handleHideModalUpdate= async()=>{
    await setIsVisibleUpdate(false);
    setSelectedStaff(null);
    setSubLoading(true);
  }
  //handle delete staff
  const handleDelete = async (id) => {
    const respone = await staffService.deleteStaff(id);
    if (respone.code === 200) {
      openNotificationWithIcon("success", respone.message);
      setSubLoading(true);
    } else {
      openNotificationWithIcon("warning", respone.message);
    }
  };
  const handleAfterAdding= () =>{
    setIsVisibleAdd(false);
    setSubLoading(true);
  }
  
  // show modal add
  const showModalAdd = () => {
    setIsVisibleAdd(true);
  };

  // hide modal add
  const hideModalAdd = () => {
    setIsVisibleAdd(false);
    setSubLoading(true);
  };
  if (loading) return <Skeleton />;
  return (
    <div>
      <Button
        style={{
          margin: 30,
        }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModalAdd}
      ></Button>
      <CreateStaffPage
        onCancel={hideModalAdd}
        shifts={listShift}
        visible={isVisibleAdd}
        skills={listSkill}
        onSuccess={handleAfterAdding}
      />
      {selectedStaff ? (
        <UpdateStaffPage
          visible={isVisibleUpdate}
          onCancel={handleHideModalUpdate}
          shifts={listShift}
          staff={selectedStaff}
          skills={listSkill}
        />
      ) : (
        <div />
      )}
      <Table loading={subLoading} dataSource={listStaff} columns={columns} />
    </div>
  );
};
export default StaffPage;
