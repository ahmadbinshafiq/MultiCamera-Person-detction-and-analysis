import React from 'react'
import background from "../images/s1.jpeg";
export default function New() {
  return (
    <div>
<div classNameName="container-fluid">
    <div classNameName="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
        <div
        className="side-inner align-items-end"
      style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          height: "100vh",
          width:"30vh",
        }}
      >
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline">Menu</span>
                </a>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <a href="#" className="nav-link align-middle px-0">
                            <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline text-light">Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                           <span className="ms-1 d-none d-sm-inline text-light" >Add Camera</span> </a>

                    </li>
                    <li>
                        <a href="#" className="nav-link px-0 align-middle">
                            <span className="ms-1 d-none d-sm-inline text-primary">Analysis</span></a>
                    </li>
                    <li>
                        <a href="#submenu2" data-bs-toggle="collapse" className="nav-link px-0 align-middle ">
                            <span className="ms-1 d-none d-sm-inline text-warning">HeatMap</span></a>
                      
                    </li>
                    <li>
                        <a href="#submenu3" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                            <span className="ms-1 d-none d-sm-inline text-danger">Top-View</span> </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link px-0 align-middle">
                             <span className="ms-1 d-none d-sm-inline text-light">Customers</span> </a>
                    </li>
                </ul>
              
 
            </div>
        </div>
        <div className="col py-3">
            Content area...
        </div>
    </div>
</div>
</div>
    </div>
  )
}
