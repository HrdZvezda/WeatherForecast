import { React, useState, useEffect, useRef } from "react";
import Search from "./Search";
import HeaderWithTime from '../Data/CurrentTime';

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
                        <i className="fa-regular fa-cloud"></i>
                    </div>
                    <p className="nav-title">
                       <i className='title-top'>Weather</i><br />
                       <i className='title-btm'>Forecast</i>
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
                    top: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: calc(100% - 64px); 
                    margin: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0px 32px;
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
                    margin: 12px;
                    font-size: 16px;
                    font-weight:600;
                    line-height: 1;
                    color: white;
                }
                
                .nav-title .title-btm{
                    margin-left: 2ch;
                }

                .navbar-left {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .navbar-right {
                    display: flex;
                    align-items: center;
                    gap: 0px;
                }

                .nav-logo {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2px 2px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 12px;
                    color: white;
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

            `}</style>
        </>
    )
}

export default NavgationBar;
