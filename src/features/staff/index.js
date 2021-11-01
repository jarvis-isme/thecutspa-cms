import { Button, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import staffService from "../../services/staff";
import { Link, useHistory } from "react-router-dom";
import CreateStaffPage from "./create";

const StaffPage = () => {
  const [subLoading, setSubLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listStaff, setListStaff] = useState([]);
  const [isVisibleAdd, setIsVisibleAdd] = useState(false);

  useEffect(() => {
    fetchData();
  }, [subLoading]);

  // fetch list Data
  const fetchData = async () => {
    const respone = await staffService.getAll();
    setLoading(respone.data.staffs);
    const response = await staffService.getAllShift();
    console.log(respone);
    setLoading(false);
  };

  // show modal add
  const showModalAdd = () => {
    setIsVisibleAdd(true);
  };

  // hide modal add
  const hideModalAdd = () => {
    console.log('pressed')
    setIsVisibleAdd(false);
  };

  if (loading) return <Skeleton />;
  return (
    <div>
      <Button icon={<PlusOutlined />} onClick={showModalAdd}></Button>
     <CreateStaffPage onCancel={hideModalAdd} visible={isVisibleAdd }/>
    </div>
  );
};
export default StaffPage;
