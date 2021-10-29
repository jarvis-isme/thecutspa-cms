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
  Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import productService from "../../services/product";
import logo from "../../assert/thecutspa.png";
import "./style.css";

const { Option } = Select;

const Product = () => {
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
          <Button type="primary" onClick={() => handleShowModalSearch(id)}>
            Update
          </Button>
          <Button onClick={() => handleDelete(id)} type="danger">
            Delete
          </Button>
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
  useEffect(() => {
    fetchData();
  }, [loading]);

  const fetchData = async () => {
    const response = await productService.getAll();
    console.log(response);
    setListProduct(response.data.products);
    setListCategory(response.data.categories);
    setLoading(false);
  };
  if (loading) {
    return <Skeleton />;
  }
  const handleDelete = async (id) => {
    const response = await productService.delete(id);
    console.log(response);
    setLoading(!loading);
  };

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
  const onFinish = (values) => {
    console.log(values);
  };
  const onFinishFailed = (error) => {
    console.log(error);
  };

  const handleShowModalAdd = () => {
    setIsVisivleAdd(true);
  };
  return (
    <div>
      <PageHeader
        title="Quản lí sản phẩm"
        className="site-page-header"
        avatar={{ logo }}
      ></PageHeader>
      <div className="group">
        <Button onClick={handleShowModalAdd} type="primary">
          Add new product
        </Button>
      </div>
      <Table
        rowKey={(record) => record.id}
        dataSource={listProduct}
        columns={columns}
        bordered="true"
      />
      <Modal
        title={selectedItem ? "Update" : "Create"}
        visible={isVisible}
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
          <Form.Item
            label="Category"
            initialValue={selectedItem ? selectedItem.category_id : "1"}
          >
            <Select
              onChange={(value) => {
                let newItem = selectedItem;
                newItem.category_id = value;
                setSelectedItem(newItem);
                console.log(selectedItem);
              }}
              name="category"
              defaultValue={selectedItem ? selectedItem.category_id : "1"}
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
          <Form.Item label="Image">
            <Image src={selectedItem ? selectedItem.images.filePath : ""} />
            <Upload maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
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
        onOk={() => setIsVisivleAdd(false)}
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
          onFinish={onFinish}
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
          <Form.Item label="Description" name="description">
            <Input.TextArea autoSize />
          </Form.Item>
          <Form.Item label="Category" name="category" initialValue={1}>
            <Select
              onChange={(value) => {
                // let newItem = selectedItem;
                // newItem.category_id = value;
                // setSelectedItem(newItem);
                // console.log(selectedItem);
              }}
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
          <Form.Item label="Image"
            name='image'
          >
            <Upload name='image' maxCount={1}>
              <Button name='image' icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Create Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
