import React, { useState, useEffect } from "react";
import {
  Skeleton,
  Table,
  Tag,
  Button,
  PageHeader,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  notification,
  Popconfirm,
  Switch,
  Tabs,
  Row,
  Col,
  Space,
  DatePicker,
  Descriptions,
  Image
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined
} from "@ant-design/icons";
import productService from "../../services/product";
import logo from "../../assert/thecutspa.png";
import "./style.css";
import { PRODUCT_ORDER_PAYMENT_METHOD, PRODUCT_ORDER_SHIPPING_METHOD, PRODUCT_ORDER_STATUS } from "../../constant";

const { Option } = Select;

const openNotificationWithIcon = (type, message) => {
  notification[type]({
    message: message,
  });
};

const Product = () => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.id - b.id
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
            result = category.name;
          }
        });
        return <div>{result}</div>;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
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
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleShowModalSearch(id)}
          ></Button>
          <Popconfirm
            placement="bottomLeft"
            title={"Do you really want to delete  this product?"}
            onConfirm={() => handleDelete(id)}
            okText="Yes"
            cancelText="No"
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
  const orderColumns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render:(id)=>(<h4>#{id}</h4>)
    },
    {
      title: "Receiver name",
      dataIndex: "receiver_name",
      key: "receiver_name"
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at"
    },
    {
      title: "Shipping method",
      dataIndex: "shipping_method",
      key: "shipping_method",
      render: (shippingMethod)=>{
        switch (shippingMethod){
          case PRODUCT_ORDER_SHIPPING_METHOD.STANDARD:
            return (<Tag color='gold'>Standard ship</Tag>)
          case PRODUCT_ORDER_SHIPPING_METHOD.FAST:
            return (<Tag color='geekblue'>Fast ship</Tag>)
          default: return null
        }
      }
    },
    {
      title: "Payment method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (paymentMethod)=>{
        switch (paymentMethod){
          case PRODUCT_ORDER_PAYMENT_METHOD.COD:
            return (<Tag color='gold'>Cash on delivery</Tag>)
          case PRODUCT_ORDER_PAYMENT_METHOD.CREDIT_CARD:
            return (<Tag color='geekblue'>Cash online</Tag>)
          default: return null
        }
      }
    },
    {
      title: "Status",
      key: "status",
      render: (text,record)=>{
        switch (record.status){
          case PRODUCT_ORDER_STATUS.CUSTOMER_CANCEL: return (<Tag color='red'>Customer cancel</Tag>)
          case PRODUCT_ORDER_STATUS.ADMIN_CANCEL: return (<Tag color='red'>Cancel</Tag>)
          case PRODUCT_ORDER_STATUS.NOT_CONFIRM: return (
            <Row>
              <Col span={14}> 
                <Tag color='yellow'>Just Order</Tag>
              </Col>
              <Col span={10} style={{justifyContent:'end'}}>
                <Space direction='horizontal'>
                  <Popconfirm title="Do you want to confirm ?" onConfirm={()=>onClickConfirmOrderHandler(record.id)}>
                    <Button style={{ marginRight: 15}} type='primary' icon={<CheckCircleOutlined/>}>Confirm</Button>
                  </Popconfirm>
                  <Button 
                    danger 
                    icon={<ClockCircleOutlined/>} 
                    onClick={()=>{
                      setIsCancelOrderModalVisible(true)
                      setDetailOrderInfo(record)
                    }} 
                    type='primary'
                  >Cancel</Button>
                </Space>
              </Col>                                 
            </Row>
          )
          case PRODUCT_ORDER_STATUS.CONFIRMED: return (<Tag color='blue'>Confirmed</Tag>)
          case PRODUCT_ORDER_STATUS.DELIVERY: return (<Tag color='orange'>Delivery</Tag>)
          case PRODUCT_ORDER_STATUS.COMPLETED: return (<Tag color='green'>Completed</Tag>)
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
  const [loading, setLoading] = useState(true);
  const [listProduct, setListProduct] = useState([]);
  const [isVisible, setIsVisivle] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isVisibleAdd, setIsVisivleAdd] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("0")

  const [listOrder,setListOrder] = useState([])
  const [totalPage,setTotalPage] = useState(0)
  const [filter,setFilter] = useState({})
  const [cancelReasonText, setCancelReasonText] = useState('')
  const [detailOrderInfo, setDetailOrderInfo] = useState()
  const [isDetailOrderModalVisible,setIsDetailOrderModalVisible] = useState(false)
  const [isCancelOrderModalVisible,setIsCancelOrderModalVisible] = useState(false)

  useEffect(() => {
    fetchData().then(fetchDataOrder());
  }, [subLoading]);

  // fetch data
  const fetchData = async () => {
    global.loading.show();
    const response = await productService.getAll();  
    setListProduct(response.data.products);
    setListCategory(response.data.categories);
    setLoading(false);
    setSubLoading(false);
    global.loading.hide();
  };
  //fetch order data
  const fetchDataOrder = async (filterData={}) => {
    global.loading.show()
    const {data,code} = await productService.getProductOrder(filterData)
    if(code === 200){
      setListOrder(data.orders)
      setTotalPage(data.maxOfPage)
    }else openNotificationWithIcon('error',"Server Error")
    global.loading.hide()
  }
  //handle delete product
  const handleDelete = async (id) => {
    global.loading.show();
    setSubLoading(true);
    const response = await productService.delete(id);
    global.loading.hide();
  };

  //handle show modal
  const handleShowModalSearch = (id) => {
    var result = null;
    listProduct.forEach((product) => {
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

  const onFinish = async (values) => {
    const params = new FormData();
    params.append("name", values.name);
    params.append("categoryId", values.category);
    // if uploaded file
    if (values.uploaded) {
      params.append("file", values.uploaded[0].originFileObj);
    }
    params.append("description", values.description);
    params.append("quantity", values.quantity);
    params.append("status",(Boolean( values.status) === true ) ? 1:0 );
    console.log(values);
    params.append("price", values.price);
    setSubLoading(true);
    const response = await productService.update(params, values.productId);
    if (response.code === 200) {
      setSubLoading(false);
      setIsVisivle(false);
      setSelectedItem(null);
      openNotificationWithIcon("success", response.message);
    } else {
      openNotificationWithIcon("warning", response.message);
    }
  };

  const handleCreateProduct = async (values) => {
    const params = new FormData();
    params.append("name", values.name);
    params.append("categoryId", values.category);
    // if uploaded file
    if (values.uploaded) {
      params.append("file", values.uploaded[0].originFileObj);
    }
    params.append("description", values.description);
    params.append("quantity", values.quantity);
    params.append("price", values.price);
    setSubLoading(true);
    const response = await productService.create(params);
    if (response.code === 200) {
      setSubLoading(true);
      setIsVisivleAdd(false);
      openNotificationWithIcon("success", response.message);
    } else {
      openNotificationWithIcon("warning", response.message);
    }
  };

  // error when input is not finished
  const onFinishFailed = (error) => {
  };

  // handle event show modal add product
  const handleShowModalAdd = () => {
    setIsVisivleAdd(true);
  };

  //handle choose a file
  const uploadFile = (e) => {

    if (Array.isArray(e)) {
      return e;
    }

    return e.fileList;
  };
  const onClickConfirmOrderHandler = async (id) =>{
    global.loading.show()
    const {code} = await productService.confirmProductOrder(id)
    if(code === 200){
      setListOrder(prev=>{
        let updateData = [...prev]
        const index = updateData.findIndex(order=>order.id===id)
        updateData[index].status = PRODUCT_ORDER_STATUS.CONFIRMED
        return updateData
      })
      openNotificationWithIcon('success',"Confirm order successfully")
    }else openNotificationWithIcon('error','Fail')
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
  
  const onClickCancelOrderHandler = async () => {
    global.loading.show()
    const {code} = await productService.cancelProductOrder(detailOrderInfo.id, {"cancelReason":cancelReasonText})
    if(code === 200){
      setListOrder((prev)=>{
        let updateData = [...prev]
        const index = updateData.findIndex(order=>order.id===detailOrderInfo.id)
        updateData[index].status = PRODUCT_ORDER_STATUS.ADMIN_CANCEL
        return updateData
      })
      openNotificationWithIcon('success',"Cancel order successfully")
    } else openNotificationWithIcon('error',"Fail")
    global.loading.hide()
  }
  //render View
  if (loading) {
    return <Skeleton />;
  }
  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <Tabs defaultActiveKey="0" onChange={(value)=>setSelectedTab(value)} style={{marginLeft: '2vw'}}>
        <Tabs.TabPane tab="Manage Product" key="0"/>     
        <Tabs.TabPane tab="Manage Order" key="1"/>       
      </Tabs>
      {selectedTab === "0" && <React.Fragment>
      <PageHeader
        title="Product Management"
        className="site-page-header"
        avatar={{ logo }}
      ></PageHeader>
      <div
        style={{
          marginBlockEnd: 50,
        }}
      >
        <Button
          icon={<PlusOutlined />}
          onClick={handleShowModalAdd}
          type="primary"
        ></Button>
      </div>
      <Table
        loading={subLoading}
        rowKey={(record) => record.id}
        dataSource={listProduct}
        columns={columns}
        bordered="true"
      />
      {selectedItem ? (
        <Modal
          title={"Update"}
          visible={isVisible}
          footer={null}
          autoSize
          width={700}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
        >
          <Form
            layout="vertical"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Name"
              name="name"
              initialValue={selectedItem ? selectedItem.name.toString() : ""}
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
              style={{
                display: "none",
              }}
              name="productId"
              initialValue={selectedItem ? selectedItem.id : 0}
            />
            <Form.Item
              label="Quantity"
              name="quantity"
              initialValue={selectedItem ? selectedItem.quantity : 0}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              initialValue={selectedItem ? selectedItem.price : 0}
              rules={[
                {
                  required: true,
                  message: "Please input your price!",
                },
              ]}
            >
              <Input
                type="number"
                defaultValue={selectedItem ? selectedItem.price : 0}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              initialValue={selectedItem ? selectedItem.description : 0}
              name="description"
            >
              <Input.TextArea autoSize />
            </Form.Item>
            <Form.Item label="Category" name="category" initialValue={selectedItem ? selectedItem.category_id: 0}>
              <Select
                name="category"
                defaultValue={selectedItem ? selectedItem.category_id : 1}
              >
                {listCategory.map((category) => {
                  return (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Status:"
              initialValue={selectedItem ? selectedItem.status : 0}
              name="status"
            >
              <Switch defaultChecked={selectedItem ? selectedItem.status : 0} />
            </Form.Item>
            <Form.Item
              label="Image"
              name="uploaded"
              valuePropName="fileList"
              getValueFromEvent={uploadFile}
            >
              <Upload
                name="image"
                defaultFileList={[
                  selectedItem
                    ? {
                        name: "images.jpg",
                        url: selectedItem.images.filePath,
                        status: "done",
                      }
                    : "",
                ]}
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
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Update Product
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : (
        <div />
      )}
      <Modal
        title={"Create"}
        visible={isVisibleAdd}
        autoSize
        width={700}
        footer={null}
        onCancel={() => setIsVisivleAdd(false)}
      >
        <Form
          layout="vertical"
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleCreateProduct}
          // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              {
                required: true,
                message: "Please input your quantity!",
              },
            ]}
          >
            <Input type="number" />
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
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input your description!",
              },
            ]}
          >
            <Input.TextArea autoSize />
          </Form.Item>
          <Form.Item label="Category" name="category" initialValue={1}>
            <Select
              name="category"
              defaultValue={selectedItem ? selectedItem.category_id : 1}
            >
              {listCategory.map((category) => {
                return (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Image"
            name="uploaded"
            valuePropName="fileList"
            getValueFromEvent={uploadFile}
          >
            <Upload
              name="image"
              showUploadList={true}
              // onChange={uploadFile}
              beforeUpload={(file) => {
                return false;
              }}
              maxCount={1}
            >
              <Button name="image" icon={<UploadOutlined />}>
                Upload
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" loading={subLoading}>
              Create Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      </React.Fragment>}
      {selectedTab === "1" && <React.Fragment>
        <PageHeader
          title="Product Order Management"
          className="site-page-header"
          avatar={{ logo }}
        ></PageHeader>
        <DatePicker.RangePicker
          format="YYYY-MM-DD"
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
                <Descriptions.Item label="Username">{detailOrderInfo.receiver_name}</Descriptions.Item>
                <Descriptions.Item label="Email">{detailOrderInfo.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{detailOrderInfo.phone}</Descriptions.Item>
                <Descriptions.Item label="Order Date">{detailOrderInfo.order_date}</Descriptions.Item>
                <Descriptions.Item label="Address">{detailOrderInfo.address}</Descriptions.Item>
                {detailOrderInfo.shippingMethod === PRODUCT_ORDER_SHIPPING_METHOD.STANDARD && <Descriptions.Item label="Shipping Method">Standard shipping</Descriptions.Item>}
                {detailOrderInfo.shippingMethod === PRODUCT_ORDER_SHIPPING_METHOD.FAST && <Descriptions.Item label="Shipping Method">Fast shipping</Descriptions.Item>}
                {detailOrderInfo.paymentMethod === PRODUCT_ORDER_PAYMENT_METHOD.COD && <Descriptions.Item label="Payment Method">Cash on delivery</Descriptions.Item>}
                {detailOrderInfo.paymentMethod === PRODUCT_ORDER_PAYMENT_METHOD.CREDIT_CARD && <Descriptions.Item label="Payment Method">Cash online</Descriptions.Item>}
            </Descriptions>
            <PageHeader>Services</PageHeader>
            <Table
              rowKey={(record) => record.id}
              dataSource={detailOrderInfo.products}
              columns={[
                {
                  title: "ID",
                  dataIndex: 'id',
                  key: 'id'
                },
                {
                  dataIndex: 'images',
                  key: 'images',
                  render: (images)=>(<Image style={{height: '20vh', width: '20vw'}} src={images.filePath}/>)
                },
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
                    listCategory.forEach(category=>{
                      if(category.id === id) return (<h5>{category.name}</h5>)
                    })
                  }
                },
                {
                  title:'Price',
                  dataIndex: 'price',
                  key: 'price'
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  key: 'quantity'
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
              <Tag color='gold' onClick={()=>setCancelReasonText("Product is not available")}>Service in not available</Tag>
          </Space>
        </Modal>
      </React.Fragment>}
    </div>
  );
};

export default Product;
