import React from 'react'
import { Row,  Button, Table } from 'react-bootstrap'

const Predict = ({
  categories,
  product,
  seller,
  handleBack
}) => {
  return (
      <section className="container" >
        <div className="head">
          <h3>
            Recommendations
            </h3>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Categories</th>
              <th>Product ID</th>
              <th>Seller ID</th>
            </tr>
          </thead>
          <tbody>
            {
              categories.map((item, ind) => 
                (<tr key={ind}>
                  <td>{ind + 1}</td>
                  <td>{categories[ind]}</td>
                  <td>{product[ind]}</td>
                  <td>{seller[ind]}</td>
                </tr>)
              )
            }
          </tbody>
        </Table>
        <Row className="center footer">
          <Button onClick={handleBack} variant="outline-secondary">Back</Button>
        </Row>

      </section >

  )
}

export default Predict
