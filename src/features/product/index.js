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
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import productService from "../../services/product";
import logo from "../../assert/thecutspa.png";
import "./style.css";

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
      sorter: (a, b) => a.id - b.id,
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
  const [loading, setLoading] = useState(true);
  const [listProduct, setListProduct] = useState([]);
  const [isVisible, setIsVisivle] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isVisibleAdd, setIsVisivleAdd] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [subLoading]);

  // fetch data
  const fetchData = async () => {
    global.loading.show();
    const response = await productService.getAll();
    global.loading.hide();
    console.log(response);
    setListProduct(response.data.products);
    setListCategory(response.data.categories);
    setLoading(false);
    setSubLoading(false);
  };

  //handle delete product
  const handleDelete = async (id) => {
    global.loading.show();
    setSubLoading(true);
    const response = await productService.delete(id);
    global.loading.hide();
    console.log(response);
  };

  //handle show modal
  const handleShowModalSearch = (id) => {
    var result = null;
    listProduct.forEach((product) => {
      if (product.id === id) {
        result = product;
      }
    });
    console.log(result)
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
    if (values.uploaded[0] ) {
      params.append("file", values.uploaded[0].originFileObj);
    }
    params.append("description", values.description);
    params.append("quantity", values.quantity);
    params.append("status", values.status=== true ? 1 : 0);
    params.append("price", values.price);
    setSubLoading(true);
    const response = await productService.update(params, values.productId);
    if (response.code === 200) {
      setSubLoading(false);
      setIsVisivle(false);
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
      setSubLoading(false);
      setIsVisivleAdd(false);
      openNotificationWithIcon("success", response.message);
    } else {
      openNotificationWithIcon("warning", response.message);
    }
  };

  // error when input is not finished
  const onFinishFailed = (error) => {
    console.log(error);
  };

  // handle event show modal add product
  const handleShowModalAdd = () => {
    setIsVisivleAdd(true);
  };

  //handle choose a file
  const uploadFile = (e) => {
    console.log("Upload event:", e.fileList);

    if (Array.isArray(e)) {
      return e;
    }

    return e.fileList;
  };

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
      <PageHeader
        title="Quản lí sản phẩm"
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
      <Modal
        title={"Create"}
        visible={isVisibleAdd}
        autoSize
        width={700}
        footer={null}
        onCancel={() => setIsVisivleAdd(false)}
      >
        <Form
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
    </div>
  );
};

export default Product;
