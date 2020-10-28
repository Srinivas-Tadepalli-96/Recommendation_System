import React, { useState } from 'react';
import './App.scss';
import { Navbar, Container, Row, Col, Alert, Table, Tabs, Tab, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Upload from './components/Upload';
import Predict from './components/Predict';
import Category from './assets/category.png';
import Product from './assets/product.png';
import Seller from './assets/seller.png';

function App() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")

  const [customerId, setCustomerId] = useState("")

  const [categories, setCategories] = useState([])
  const [product, setProduct] = useState([])
  const [seller, setSeller] = useState([]);

  const colors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#bdc3c7",
    "#2980b9",
    "#d35400"
  ]

  const handleFileUpload = async () => {
    setLoading(true)
    setError(false);
    setErrorMsg("")

    try {
      console.log("data before sending -->")

      const data = {
        "customer_id": customerId
      }

      const res = await postRawData('http://localhost:5000/api/recommendations', data);
      console.log("res -->", res);
      if (res.status == 200) {
        setCategories(res.Product_Categories);
        setProduct(res.Product_Id);
        setSeller(res.Seller_Id);
        setLoading(false)
        setStep(step + 1)
      }
      else {
        throw new Error(res.error)
      }
    }
    catch (err) {
      setLoading(false)
      setError(true);
      setErrorMsg(err.message)
      console.log("error -->", err)
    }
  }

  const handleBack = () => {
    setStep(step - 1);
  }

  // Example POST method implementation with form data
  async function postFormData(url = '', data = {}) {
    console.log("data -->", data)
    const response = await fetch(url, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      body: data
    });
    return response.json();
  }

  // Example POST method implementation with raw data
  async function postRawData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  const uploadProps = {
    loading,
    customerId,
    setCustomerId,
    handleFileUpload
  }

  const predictProps = {
    categories,
    product,
    seller,
    handleBack
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Recommendation System</Navbar.Brand>
      </Navbar>
      {
        error
          ? <Alert variant="danger" onClose={() => { setError(false); setErrorMsg("") }} dismissible>
            {errorMsg}
          </Alert>
          : null
      }
      <Container>
        <Row>
          <Col>
            <div className="content-card">
              {
                step === 0 ?
                  <Upload {...uploadProps} />
                  : step === 1 ?
                    <Predict {...predictProps} />
                    : null
              }
            </div>
          </Col>
        </Row>

        {
          step === 1
            ? <Row>
              <Col>
                <div className="content-card">
                  <section className="container" >
                    <Tabs id="uncontrolled-tab-example">
                      <Tab eventKey="home" title="Product Category">
                        <div className="balls-container">

                          {
                            categories.map((cat, ind) => (
                              <OverlayTrigger
                                key={ind}
                                placement={'top'}
                                overlay={
                                  <Tooltip id={`tooltip-${'top'}`}>{cat}</Tooltip>
                                }
                              >
                                <div className="ball" style={{backgroundColor: `${colors[ind]}`}}>
                                </div>
                              </OverlayTrigger>
                            ))
                          }
                        </div>

                      </Tab>
                      <Tab eventKey="profile" title="Product ID">
                        <div className="balls-container">

                          {
                            product.map((cat, ind) => (
                              <OverlayTrigger
                                key={ind}
                                placement={'top'}
                                overlay={
                                  <Tooltip id={`tooltip-${'top'}`}>{cat}</Tooltip>
                                }
                              >
                                <div className="ball" style={{backgroundColor: `${colors[ind]}`}}>
                                </div>
                              </OverlayTrigger>
                            ))
                          }
                        </div>
                      </Tab>
                      <Tab eventKey="contact" title="Seller ID">
                        <div className="balls-container">

                          {
                            seller.map((cat, ind) => (
                              <OverlayTrigger
                                key={ind}
                                placement={'top'}
                                overlay={
                                  <Tooltip id={`tooltip-${'top'}`}>{cat}</Tooltip>
                                }
                              >
                                <div className="ball" style={{backgroundColor: `${colors[ind]}`}}>
                                </div>
                              </OverlayTrigger>
                            ))
                          }
                        </div>
                      </Tab>
                    </Tabs>

                  </section >

                </div>
              </Col>
            </Row>
            : null
        }

        <Row>
          <Col>
            <div className="content-card">
              <section className="container" >
                <div className="head">
                  <h3>
                    Testing Result
                  </h3>
                  <p>P.S: Accuracy is in Percentage.</p>
                </div>
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <th scope="row">Total Testing Data Length</th>
                      <td>10875</td>
                    </tr>
                    <tr>
                      <th scope="row">True Predicted Product Category</th>
                      <td>7564</td>
                    </tr>
                    <tr>
                      <th scope="row">False Predicted Product Category</th>
                      <td>3311</td>
                    </tr>
                    <tr>
                      <th scope="row">True Predicted Seller ID</th>
                      <td>3808</td>
                    </tr>
                    <tr>
                      <th scope="row">False Predicted Seller ID</th>
                      <td>7067</td>
                    </tr>
                    <tr>
                      <th scope="row">True Predicted Product ID</th>
                      <td>1272</td>
                    </tr>
                    <tr>
                      <th scope="row">False Predicted Product ID</th>
                      <td>9603</td>
                    </tr>
                    <tr>
                      <th scope="row">Testing accuracy of product category</th>
                      <td>69.55402298850575</td>
                    </tr>
                    <tr>
                      <th scope="row">Testing accuracy of seller id</th>
                      <td>35.01609195402299</td>
                    </tr>
                    <tr>
                      <th scope="row">Testing accuracy of product id</th>
                      <td>11.696551724137931</td>
                    </tr>
                  </tbody>
                </Table>

              </section >

            </div>
          </Col>
        </Row>


        <Row>
          <Col>
            <div className="content-card">
              <section className="container" >
                <Tabs id="uncontrolled-tab-example">
                  <Tab eventKey="home" title="Product Category">
                    <div className="graph-img">
                      <img src={Category} alt="" />
                    </div>
                  </Tab>
                  <Tab eventKey="profile" title="Product ID">
                    <div className="graph-img">
                      <img src={Product} alt="" />
                    </div>
                  </Tab>
                  <Tab eventKey="contact" title="Seller ID">
                    <div className="graph-img">
                      <img src={Seller} alt="" />
                    </div>
                  </Tab>
                </Tabs>

              </section >

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
