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
  Tabs
} from "antd";
import { UploadOutlined , PlusCircleOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import logo from "../../assert/thecutspa.png";
import "./style.css";
import serviceService from "../../services/service";
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
  const [listService, setListService] = useState([]);
  const [isVisible, setIsVisivle] = useState(false);
  const [isVisibleAddCategoryModal,setIsVisibleAddCategoryModal] = useState(false)
  const [listCategory, setListCategory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTab,setSelectedTab] = useState("0")

  const [detailForm] = Form.useForm() 
  const [categoryForm] = Form.useForm()
  const uploadRef = useRef()
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(()=>{
    if(selectedItem){
      detailForm.setFieldsValue({
        'name':selectedItem.name,
        'price':selectedItem.price,
        'description':selectedItem.description,
        'subcategory':selectedItem.category_id,
        //'image':selectedItem.images.filePath
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

  const fetchData = async () => {
    global.loading.show();
    const response = await serviceService.getAllWithCategory();
    global.loading.hide();
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
    //setLoading(false);
  };
  // if (loading) {
  //   return <Skeleton />;
  // }
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
    //console.log(values);
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

  

  return (
    <React.Fragment>
      <Tabs defaultActiveKey="0" onChange={(value)=>setSelectedTab(value)} style={{marginLeft: '2vw'}}>
        <Tabs.TabPane tab="Manage Service" key="0">

        </Tabs.TabPane>
        <Tabs.TabPane tab="Manage Category" key="1">       
        </Tabs.TabPane>
      </Tabs>
      {selectedTab === "1" ? <div>
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
            Add category
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
      </div>
      :
      <div>
        <PageHeader
          title="Service Management"
          className="site-page-header"
          avatar={{ logo }}
        ></PageHeader>    
        <div className="group">
          <Button icon={<PlusCircleOutlined/>}  onClick={handleShowModalAdd} type="primary">
            Add service
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
              <Upload ref={uploadRef} maxCount={1} beforeUpload={()=>false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>   
      </div>}
      
    </React.Fragment>    
  );
};

export default Service;
