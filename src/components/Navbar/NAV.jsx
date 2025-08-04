import { React, useState, useEffect, useRef } from "react";
import Search from "./Search";
import HeaderWithTime from '../CurrentTime';
import Collection from "./Collection";

const NavgationBar = ({
    children,
    weather,
    isFavorite,
    handleAddFavorite,
    handleRemoveFavorite,
    handleGetLocation,
    locationLoading,
    favorites=[],
    setQuery,
  }) => {
      
    const [searchStart, setSearchStart] = useState(false);
    const [shake, setShake] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const handleFavoriteToggle = () => {
        if (!weather) return;
        
        if (isFavorite(weather.name)) {
            // 如果已收藏，則移除收藏
            handleRemoveFavorite(weather.name);
        } else {
            // 如果未收藏，則添加收藏
            handleAddFavorite();
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

    return(
        <>
            <div className="navbar">
                <div className="navbar-left" ref={menuRef}>
                    <div className="nav-logo">
                        <button className="nav-btn" onClick={() => setIsOpen(!isOpen)}>
                            <i className="fa-regular fa-cloud"></i>
                        </button>
                        {isOpen && (
                        <div className="popover">
                            <Collection 
                                favorites={favorites}
                                setQuery={setQuery}
                                removeFavorite={handleRemoveFavorite}
                                onSelect={(cityName) => {
                                    setQuery(cityName);
                                    setIsOpen(false);
                                }}
                            />
                        </div>
                    )}
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
                    <div className='btn'>
                        <button 
                            className={` location-btn ${locationLoading ? 'loading' : ''}`} 
                            onClick={handleGetLocation}
                            disabled={locationLoading}
                        >
                            {locationLoading ? " " : <i class="fa-regular fa-compass"></i> }
                        </button>
                    </div>

                    <button 
                        className='collectionBtn nav-btn-outline' 
                        onClick={handleFavoriteToggle}
                        disabled={!weather}
                        title={isFavorite(weather?.name) ? "取消收藏" : "加入收藏"}
                    >
                        {isFavorite(weather?.name) ? <i class="fa-solid fa-bookmark"></i> : <i class="fa-regular fa-bookmark"></i> }
                    </button> 
                </div>
                
            </div>
            <style>{`
                .navbar {
                    position: absolute;
                    top: 32px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: calc(100% - 64px); 
                    margin: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2px 32px;
                    border-radius: 9999px;
                    max-width: 960px;

                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(20px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1); 

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
                

                .navbar-left {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0px;
                }
                .navbar-left p {
                    font-size: 18px;
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
                    // border: 1px solid white;
                    border-radius: 12px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .nav-btn:hover {
                    background: rgba(255, 255, 255, 0.2);   
                    border: none;
                    transition: all 0.7s;
                }

                .nav-btn-outline {
                    padding: 6px 16px;
                    background: transparent;
                    // border: 1px solid white;
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

                .location-btn {
                    padding: 6px 16px;
                    margin-right: 10px;
                    background: transparent;
                    // border: 1px solid white;
                    border-radius: 9999px;
                    color: white;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                .location-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    transition: all 0.7s;
                }


                .popover {
                    position: absolute;
                    top: 70px;
                    left: 50%;
                    transform: translateX(-10%);
                    width: 280px;
                    max-height: 300px;
                    overflow-y: auto;
                    padding: 8px;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
                    // border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    z-index: 999;
                    pointer-events: auto; /* 確保可以點擊 */
                }

            `}</style>
        </>
    )
}

export default NavgationBar;
