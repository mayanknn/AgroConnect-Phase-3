import React from 'react';
import './CreditCard.css'; // Import the CSS file

const CreditCard = () => {
    return (
        <div className="container">
            <div className="card">
                <div className="card-inner">
                    <div className="front">
                        <img src="https://i.ibb.co/PYss3yv/map.png" className="map-img" alt="Map" />
                        <div className="row">
                            <img src="https://i.ibb.co/G9pDnYJ/chip.png" width="60px" alt="Chip" />
                            {/* <img src="https://i.ibb.co/WHZ3nRJ/visa.png" width="60px" alt="Visa" /> */}
                            <h1 style={{color:'white' ,fontWeight:'500',fontSize:'2rem'}}>ACC</h1>
                        </div>
                        <div className="row card-no">
                            <p>5244</p>
                            <p>2150</p>
                            <p>8252</p>
                            <p>6420</p>
                        </div>
                        <div className="row card-holder">
                            <p>CARD HOLDER</p>
                            <p>VALID TILL</p>
                        </div>
                        <div className="row name">
                            <p>JOE ALISON</p>
                            <p>10 / 25</p>
                        </div>
                    </div>
                    <div className="back">
                        <img src="https://i.ibb.co/PYss3yv/map.png" className="map-img" alt="Map" />
                        <div className="bar"></div>
                        <div className="row card-cvv">
                            <div>
                                <img src="https://i.ibb.co/S6JG8px/pattern.png" alt="Pattern" />
                            </div>
                            <p>824</p>
                        </div>
                        <div className="row card-text">
                            <p>This is a virtual card design using HTML and CSS. You can also design something like this.</p>
                        </div>
                        <div className="row signature">
                            <p>CUSTOMER SIGNATURE</p>
                            {/* <img src="https://i.ibb.co/WHZ3nRJ/visa.png" width="80px" alt="Visa" /> */}
                            <h1 style={{color:'white' ,fontWeight:'500',fontSize:'2rem'}}>ACC</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCard;