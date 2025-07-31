import { React, useState, useEffect } from "react";
import Search from "./Search";
import HeaderWithTime from './CurrentTime';


const NavgationBar = ({ children, weather, isFavorite, handleAddFavorite }) => {
    
    const [searchStart, setSearchStart] = useState(false);
    const [shake, setShake] = useState(false);


    return(
        <>
            <div className="navbar">
                <div className="navbar-left">
                    <div className="nav-logo">
                        <button className="nav-btn">
                            <i class="fa-solid fa-cloud"></i>
                        </button>
                    </div>
                    <p className="nav-title">
                        <strong><i>Weather</i></strong><br />
                        <strong><i>Forecast</i></strong>
                    </p>
                    <div className="nav-time">
                        <HeaderWithTime />
                    </div>
                </div>
                
                <div className="navbar-right">
                    {children}
                    <button 
                        className='collectionBtn nav-btn-outline' 
                        onClick={handleAddFavorite}
                        disabled={!weather || isFavorite(weather?.name)}
                    >
                        {isFavorite(weather?.name) ? "Added" : "Add City"}
                    </button> 
                </div>
            </div>
            <style>{`
                .navbar {
                    position: sticky;
                    top: 32px;
                    margin: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2px 32px;
                    border-radius: 9999px;
                    max-width: 960px;

                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

                    color: white;
                    font-family: 'Helvetica Neue', sans-serif;
                    font-weight: 300;
                    z-index: 1000;
                }
                .nav-title {
                    font-size: 20px;
                    font-weight: bold;
                    line-height: 1.1;
                    color: white;
                    margin-right: 16px;
                }
                .nav-title br + strong {
                    margin-left: 4ch; /* 4 個字寬的縮排 */
                    display: inline-block;
                }
                .nav-time {
                    display:flex;
                    align-items: baseline;
                }
                .nav-time h4 {
                    color:#fff;
                    margin: 0;
                }
                .nav-time h4 .big {
                    font-size: 20px;
                }

                .nav-time h4 .small {
                    font-size: 12px;
                    vertical-align: super;
                }
                .navbar-left {
                    display: flex;
                    align-items: center;
                    gap: 0px;
                }
                .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 0px;
                }
                .nav-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2px 2px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid white;
                    border-radius: 12px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .navbar-left p {
                    font-size: 18px;
                }
                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.2);   
                    border: none;
                    transition: all 0.7s;
                }

                .nav-btn-outline {
                    padding: 6px 16px;
                    background: transparent;
                    border: 1px solid white;
                    border-radius: 9999px;
                    color: white;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .nav-btn-outline:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    transition: all 0.7s;
                }
            

            `}</style>
        </>
    )
}

export default NavgationBar;
