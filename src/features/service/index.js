import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  PageHeader,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Image,
  notification,
  Popconfirm,
  Tabs,
  Tag,
  Descriptions,
  DatePicker,
  Space,
  Row,
  Col
} from "antd";
import { 
  UploadOutlined , 
  PlusCircleOutlined, 
  EditOutlined, 
  DeleteOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import logo from "../../assert/thecutspa.png";
import "./style.css";
import serviceService from "../../services/service";
import { SERVICE_ORDER_STATUS, USER_ROLE } from "../../constant";
const { Option } = Select;

const openNotification = (type, message) => {
  notification[type]({
    message: message,
  });
};

const Service = () => {
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (category_id) => {
        var result = "";
        listCategory.forEach((category) => {
          if (category.id === category_id) {
            listCategory.forEach((rootCategory)=>{
              if (rootCategory.id === category.parent_id){
                result = rootCategory.name;
              }
            })            
          }
        });
        return <div>{result}</div>;
      },
    },
    {
      title: "Subcategory",
      dataIndex: "category_id",
      key: "category_id",
      render: (category_id) => {
        var result = "";
        listCategory.forEach((category) => {
          if (category.id === category_id) {
            result = category.name;
          }
        });
        return <div>{result}</div>;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Modifer",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <div>
          <Button icon={<EditOutlined/>} type="primary" onClick={() => handleShowModalSearch(id)}/>
          <Popconfirm placement="topLeft" title={`Do you want to delete this service ?`} onConfirm={() => handleDelete(id)} okText="Delete" cancelText="Cancel">
            <Button style={{marginLeft: 30}} icon={<DeleteOutlined/>} type="danger"/>
          </Popconfirm>
          
        </div>
      ),
    },
  ];
  const categoryColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },{
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Subcategory',
      dataIndex:'id',
      key:'id',
      render: (id)=>(
        <div>
          {listCategory.filter(category=>category.parent_id === id).map((subcategory)=>(
            <h4>{subcategory.name}</h4>
          ))}
          <Button 
            icon={<PlusCircleOutlined/>} 
            onClick={()=>{setIsVisibleAddCategoryModal(true)
            categoryForm.resetFields() 
            categoryForm.setFieldsValue({
              'parent_id':id
            })}}
          >Add more</Button>
        </div>
      )
    }
  ]
  const orderColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render:(id)=>(<h4>#{id}</h4>)
    },
    {
      title: "User name",
      dataIndex: "user_name",
      key: "user_name"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at"
    },
    {
      title: "Status",
      key: "status",
      render: (text,record)=>{
        switch (record.status){
          case SERVICE_ORDER_STATUS.CUSTOMER_CANCEL: return (<Tag color='red'>Customer cancel</Tag>)
          case SERVICE_ORDER_STATUS.ADMIN_MANAGER_CANCEL: return (<Tag color='orange'>Cancel</Tag>)
          case SERVICE_ORDER_STATUS.NOT_CONFIRM: return (
            <Row>
              <Col span={14}> 
                <Tag color='yellow'>Just Order</Tag>
              </Col>
              <Col span={10} style={{justifyContent:'end'}}>
                <Space direction='horizontal'>
                  <Popconfirm title="Do you want to confirm ?" onConfirm={()=>onClickConfirmOrderHandler(record.id)}>
                    <Button style={{ marginRight: 30}} type='primary' icon={<CheckCircleOutlined/>}>Confirm</Button>
                  </Popconfirm>
                  <Button danger icon={<ClockCircleOutlined/>} 
                    onClick={()=>{
                      setDetailOrderInfo(record)
                      setIsCancelOrderModalVisible(true)
                    }} type='primary'>Cancel</Button>
                </Space>
              </Col>                                 
            </Row>
          )
          case SERVICE_ORDER_STATUS.CONFIRMED: return (
            <Row>
              <Col span={14}>
                <Tag color='blue'>Confirmed</Tag> 
              </Col>
              <Col span={10} style={{justifyContent: 'end'}}>
                <Space align='end'>
                  <Popconfirm title="Do you want to mark complete ?" onConfirm={()=>onClickMarkCompleteOrderHandler(record.id)}>
                      <Button style={{backgroundColor:'green', marginRight: 30}} type='primary' icon={<CheckCircleOutlined/>}>Mark complete</Button>
                  </Popconfirm>
                </Space>
              </Col>
            </Row>
          )
          case SERVICE_ORDER_STATUS.USED: return (<Tag color='green'>Completed</Tag>)
          default: return;
        }
      }
    },
    {
      title: "Detail",
      key: "contact_info",
      render: (text, record)=>(
        <
          Button 
          onClick={()=>{
            setDetailOrderInfo(record)
            setIsDetailOrderModalVisible(true)
          }}
          icon={<FileSearchOutlined />}
          />
      )
    }
  ]
  const [listService, setListService] = useState([])
  const [isVisible, setIsVisivle] = useState(false)
  const [isVisibleAddCategoryModal,setIsVisibleAddCategoryModal] = useState(false)
  const [listCategory, setListCategory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedTab,setSelectedTab] = useState("0")
  const [cancelReasonText, setCancelReasonText] = useState('')

  const [listOrder,setListOrder] = useState([])
  const [totalPage,setTotalPage] = useState(0)
  const [filter,setFilter] = useState({})
  const [detailOrderInfo,setDetailOrderInfo] = useState()
  const [isDetailOrderModalVisible, setIsDetailOrderModalVisible] = useState(false)
  const [isCancelOrderModalVisible, setIsCancelOrderModalVisible] = useState(false)
  const [detailForm] = Form.useForm() 
  const [categoryForm] = Form.useForm()
  const role = localStorage.getItem("ROLE")

  useEffect(() => {
    if (role == USER_ROLE.ADMIN){
      fetchDataService()
    } else if (role == USER_ROLE.MANAGER){
      fetchServiceCategoryOnly().then(fetchDataOrder())
    } 
  }, []);
  useEffect(()=>{
    if(selectedItem){
      detailForm.setFieldsValue({
        'name':selectedItem.name,
        'price':selectedItem.price,
        'description':selectedItem.description,
        'subcategory':selectedItem.category_id
      })
      detailForm.resetFields(['file'])      
      listCategory.every((category)=>{
          let isFound = false
          if(category.id === selectedItem.category_id){
            listCategory.every((rootCategory)=>{
              if(rootCategory.id === category.parent_id) {
                detailForm.setFieldsValue({'category':rootCategory.id});
                isFound = true
                return false
              }else return true
            })
          }
          return !isFound
        })
    } else {
      detailForm.resetFields()
      listCategory.every((category)=> {
        if(category.parent_id === null){
          detailForm.setFieldsValue({'category':category.id});
          return false
        } else return true
      })
      listCategory.every((category)=> {
        if(category.parent_id !== null){
          detailForm.setFieldsValue({'subcategory':category.id});
          return false
        } else return true
      })
    }
  },[selectedItem])

  const fetchDataService = async () => {
    global.loading.show();
    const response = await serviceService.getAllWithCategory();
    const {data} = response
    let _listService= []
    let _listCategory = []
    data.forEach((rootCategory)=>{
       let _rootCategory = {...rootCategory}
       delete _rootCategory['all_children']
       _listCategory.push(_rootCategory)
       rootCategory.all_children.forEach((category)=>{
         let _category = {...category}
         delete _category['services']
         _listCategory.push(_category)
         category.services.forEach((service)=>_listService.push(service))
       })
    })
    setListService(_listService);
    setListCategory(_listCategory);
    global.loading.hide();
  };
  const fetchServiceCategoryOnly = async () =>{
    global.loading.show();
    const {data,code} = await serviceService.getAllServiceCategory()
    if(code === 200){
      let _listCategory = []
      data.forEach(rootCategory => {
        let _rootCategory = {...rootCategory}
        delete _rootCategory['all_children']
        _listCategory.push(_rootCategory)
        rootCategory.all_children.forEach(category =>{
          _listCategory.push(category)
        })
      })
      setListCategory(_listCategory)
    }
    global.loading.hide();
  }
  const fetchDataOrder = async (filterData={}) => {
    global.loading.show()
    const {data,code} = await serviceService.getServiceOrder(filterData)
    if(code === 200){
      setListOrder(data.orders)
      setTotalPage(data.maxOfPage)
    }else openNotification('error',"Server Error")
    global.loading.hide()
  }
  const handleDelete = async (id) => {
    global.loading.show()
    const res = await serviceService.deleteService(id)
    if(res.code === 200){
      setListService((prev)=>{
        let updateData = [...prev]
        updateData = updateData.filter((val)=>val.id !== id)
        return updateData
      })
      setIsVisivle(false)
      openNotification('success','Delete successfully')
    }else openNotification('error','Error')
    global.loading.hide()
  };

  const handleShowModalSearch = (id) => {
    var result = null;
    listService.forEach((product) => {
      if (product.id === id) {
        result = product;
      }
    });
    setSelectedItem(result);
    setIsVisivle(true);
  };
  const handleCloseModal = () => {
    setIsVisivle(false);
    setSelectedItem(null);
  };
  const onFinish = (values) => {
    selectedItem ? onFinishUpdate(values) : onFinishedCreate(values)
  };
  const onFinishUpdate = async (values) => {
    const formData = new FormData()
    formData.append('name',values.name)
    formData.append('description',values.description)
    formData.append('price',values.price)
    formData.append('categoryId',values.subcategory)
    values.file &&  formData.append('file',values.file.file.originFileObj)
    global.loading.show()
    const  {code,data} = await serviceService.updateService(selectedItem.id,formData)
    if(code === 200){
      setListService((prev)=>{
        let updateData = [...prev]
        const index = updateData.findIndex((val)=>val.id === selectedItem.id)
        updateData[index] = data
        return updateData
      })
      setSelectedItem(data)
      openNotification('success','Update successfully')
    }else openNotification('error','Error')
    global.loading.hide()
  }
  const onFinishedCreate = async (values) => {
    const formData = new FormData()
    formData.append('name',values.name)
    formData.append('description',values.description)
    formData.append('price',values.price)
    formData.append('categoryId',values.subcategory)
    formData.append('file',values.file.file.originFileObj)
    global.loading.show()
    const  {code,data} = await serviceService.createService(formData)
    if(code === 200){
      setIsVisivle(false)
      setListService((prev)=>[...prev,data])
      openNotification('success','Create successfully')
    }else openNotification('error','Error')
    global.loading.hide()   
  }
  const onFinishFailed = (error) => {
    console.log(error);
  };

  const onFinishCategoryForm = async (values) => {
    const formData = new FormData()
    formData.append('name',values.name)
    formData.append('file',values.image.file.originFileObj)
    values.parent_id && formData.append('parentId',values.parent_id)

    global.loading.show()
    const  {code,data} = await serviceService.createCategory(formData)
    if(code === 200){
      setListCategory((prev)=>[...prev,data])
      setIsVisibleAddCategoryModal(false)
      openNotification('success','Update successfully')
    }else openNotification('error','Error')
    global.loading.hide() 
  }

  const handleShowModalAdd = () => {
    setSelectedItem(undefined)
    setIsVisivle(true)
  };

  const onClickConfirmOrderHandler = async (id) => {
    global.loading.show()
    const {code} = await serviceService.confirmServiceOrder(id)
    if(code === 200){
      setListOrder((prev)=>{
        let updateData = [...prev]
        const index = updateData.findIndex(order=>order.id===id)
        updateData[index].status = SERVICE_ORDER_STATUS.CONFIRMED
        return updateData
      })
      openNotification('success',"Confirm order successfully")
    } else openNotification('error',"Fail")
    global.loading.hide()
  }
  const onClickCancelOrderHandler = async () => {
    global.loading.show()
    const {code} = await serviceService.cancelServiceOrder(detailOrderInfo.id, {"cancelReason":cancelReasonText})
    if(code === 200){
      setListOrder((prev)=>{
        let updateData = [...prev]
        const index = updateData.findIndex(order=>order.id===detailOrderInfo.id)
        updateData[index].status = SERVICE_ORDER_STATUS.ADMIN_MANAGER_CANCEL
        return updateData
      })
      setIsCancelOrderModalVisible(false)
      openNotification('success',"Cancel order successfully")
    } else openNotification('error',"Fail")
    global.loading.hide()
  }
  const onClickMarkCompleteOrderHandler = async (id) => {
    global.loading.show()
    const {code} = await serviceService.markCompleteServiceOrder(id)
    if(code === 200){
      setListOrder((prev)=>{
        let updateData = [...prev]
        const index = updateData.findIndex(order=>order.id===detailOrderInfo.id)
        updateData[index].status = SERVICE_ORDER_STATUS.USED
        return updateData
      })
      openNotification('success',"Mark complete order successfully")
    } else openNotification('error',"Fail")
    global.loading.hide()
  }
  
  const onDateRangePickerChangeHandler = (dates) => {
    let _filter = {}
    if(dates){
      _filter = {
        ...filter,
        fromDate: dates[0].toDate().toISOString().slice(0,10),
        toDate: dates[1].toDate().toISOString().slice(0,10),
        page: 1
      }
      setFilter(_filter)
    } else {
      _filter = {...filter,page: 1}
      delete _filter['fromDate']
      delete _filter['toDate']
    }
    setFilter(_filter)
    fetchDataOrder(_filter)
  } 
  const onOrderTablePaginationChangeHandler = (page,itemPerPage) => {
    let _filter = {
      ...filter,
      page,
      itemPerPage
    }
    setFilter(_filter)
    fetchDataOrder(_filter)
  }
  return (
    <React.Fragment>
      {role == USER_ROLE.ADMIN && <React.Fragment>
        <Tabs defaultActiveKey="0" onChange={(value)=>setSelectedTab(value)} style={{marginLeft: '2vw'}}>
          <Tabs.TabPane tab="Manage Service" key="0"/>
          <Tabs.TabPane tab="Manage Category" key="1"/>       
          {/* <Tabs.TabPane tab="Manage Order" key="2"/>        */}
        </Tabs>
        {selectedTab === "1" && <div>
          <PageHeader
            title="Category Management"
            className="site-page-header"
            avatar={{ logo }}
          ></PageHeader>
          <div className="group">
            <Button 
              onClick={()=>{
                setIsVisibleAddCategoryModal(true) 
                categoryForm.resetFields()
              }}
              icon={<PlusCircleOutlined/>} 
              danger 
              type="primary"
            >
              New Category
            </Button>
          </div>
          <Table
            rowKey={(record) => record.id}
            dataSource={listCategory.filter(category=>category.parent_id === null)}
            columns={categoryColumns}
            bordered="true"
          />
          <Modal
            title={"Create"}
            visible={isVisibleAddCategoryModal}
            autoSize
            width='60vw'
            okText='Create'
            onCancel={()=>setIsVisibleAddCategoryModal(false)}
            onOk={()=>categoryForm.submit()}
          >
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              form={categoryForm}
              onFinish={onFinishCategoryForm}
            >
              <Form.Item 
                label='Name' 
                name='name'
                rules={[
                  {
                    required: true,
                    message: "Please input name",
                  },
                ]}
              >
                <Input/>
              </Form.Item>
              <Form.Item name='parent_id'>
                <Input hidden/>
              </Form.Item>
              <Form.Item 
                label="Image" 
                name='image'
                rules={[
                  {
                    required: true,
                    message: "Please upload an image",
                  },
                ]}
              >
                <Upload maxCount={1} beforeUpload={()=>false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
        </div>}
        {selectedTab === "0" && <div>
          <PageHeader
            title="Service Management"
            className="site-page-header"
            avatar={{ logo }}
          ></PageHeader>    
          <div className="group">
            <Button icon={<PlusCircleOutlined/>}  onClick={handleShowModalAdd} type="primary">
              New Service
            </Button>
          </div>   
          <Table
            rowKey={(record) => record.id}
            dataSource={listService}
            columns={columns}
            bordered="true"
          />
          <Modal
            title={selectedItem ? "Update" : "Create"}
            visible={isVisible}
            autoSize
            width='60vw'
            okText={selectedItem ? 'Save':'Create'}
            onOk={()=>detailForm.submit()}
            onCancel={handleCloseModal}
          >
            <Form
              form={detailForm}
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Name"
                name="name"
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
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your price!",
                  },
                ]}
              >
                <Input type="number"/>
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
              >
                <Input.TextArea autoSize />
              </Form.Item>
              <Form.Item
                label="Category"
                name="category"
                shouldUpdate={(prev,current)=> prev.category !== current.category}
              >
                <Select
                  onChange={(value) => listCategory.every(category=>{
                    if(category.parent_id === value){
                      detailForm.setFieldsValue({'subcategory':category.id})
                      return false
                    }else return true                
                  })}
                >
                  {listCategory.filter((rootCategory)=>rootCategory.parent_id === null).map((category) => {
                    return (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev,current)=> prev.category !== current.category}
              >
                {({getFieldValue})=> (
                    <Form.Item
                      label="Subcategory"
                      name="subcategory"
                    >
                      <Select>
                        {listCategory.filter((allCategory)=>allCategory.parent_id === getFieldValue('category')).map((category) => {
                          return (
                            <Option key={category.id} value={category.id}>
                              {category.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                )}
              </Form.Item>
              
              <Form.Item label="Image">
                <Image style src={selectedItem && selectedItem.images ? selectedItem.images.filePath : ""} />              
              </Form.Item>
              <Form.Item 
                label=" " 
                name='file' 
                rules={[
                  {
                    required: selectedItem ? false : true,
                    message: "Please upload an image",
                  },
                ]}
              >
                <Upload maxCount={1} beforeUpload={()=>false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Form>
          </Modal>   
        </div>}
      </React.Fragment>}
      {role == USER_ROLE.MANAGER && <div>
      <PageHeader
          title="Service Order Management"
          className="site-page-header"
          avatar={{ logo }}
        ></PageHeader>
        <DatePicker.RangePicker
          format="YYYY-MM-DD"
          onOk={(value)=>console.log(value)}
          onChange={onDateRangePickerChangeHandler}
          allowClear
        />
        <Table
          rowKey={(record) => record.id}
          dataSource={listOrder}
          columns={orderColumns}
          bordered="true"
          pagination={{
            total: totalPage,
            onChange: onOrderTablePaginationChangeHandler
          }}
        />
        <Modal
          title="Detail information"
          width= '80vw'
          visible={isDetailOrderModalVisible}
          onCancel={()=>setIsDetailOrderModalVisible(false)}
          footer={<Button danger onClick={()=>setIsDetailOrderModalVisible(false)}>Close</Button>}
        >
          {detailOrderInfo && <React.Fragment>
            <Descriptions title="Customer Info">
                <Descriptions.Item label="ID">{detailOrderInfo.user_id}</Descriptions.Item>
                <Descriptions.Item label="Username">{detailOrderInfo.user_name}</Descriptions.Item>
                <Descriptions.Item label="Email">{detailOrderInfo.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{detailOrderInfo.phone}</Descriptions.Item>
                <Descriptions.Item label="Order Date">{detailOrderInfo.order_date}</Descriptions.Item>
            </Descriptions>
            <PageHeader>Services</PageHeader>
            <Table
              rowKey={(record) => record.id}
              dataSource={detailOrderInfo.services}
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key:'name'
                },
                {
                  title: 'Category',
                  dataIndex: 'category_id',
                  key: 'category',
                  render: (id)=>{
                    let category=''
                    let subcategory=''
                    listCategory.every((_category)=>{
                      if(_category.id === id){
                        subcategory = _category.name
                        listCategory.every((root_category)=>{
                          if(root_category.id === _category.parent_id){
                            category = root_category.name
                            return false
                          }else return true
                        })
                        return false
                      }else return true
                    })
                    return (<h5>{`${category} / ${subcategory}`}</h5>)
                  }
                },
                {
                  title:'Price',
                  dataIndex: 'price',
                  key: 'price'
                }
              ]}
              bordered="true"
            />
            <Row justify='end'><h5>Total: </h5>{detailOrderInfo.amount} VND</Row>
          </React.Fragment>}
        </Modal>
        <Modal
          title="Cancel reason"
          width= '40vw'
          visible={isCancelOrderModalVisible}
          okText='Cancel Order'
          cancelText='Close'
          onCancel={()=>{
            setCancelReasonText('')
            setIsCancelOrderModalVisible(false)
          }}
          onOk={onClickCancelOrderHandler}
          okType='danger'
        >
          <Input.TextArea value={cancelReasonText} onChange={(val)=>{setCancelReasonText(val.currentTarget.value)}}/>
          <Space direction='horizontal'>
              <Tag color='gold' onClick={()=>setCancelReasonText("Cannot contact to customer")}>Cannot contact to customer</Tag>
              <Tag color='gold' onClick={()=>setCancelReasonText("Customer cancel")}>Customer cancel</Tag>
              <Tag color='gold' onClick={()=>setCancelReasonText("Service in not available")}>Service in not available</Tag>
          </Space>
        </Modal>
      </div>}
    </React.Fragment>    
  );
};

export default Service;
