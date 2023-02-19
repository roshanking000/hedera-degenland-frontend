import React from "react";
import { useHistory } from "react-router-dom";
import "./style.scss";

import Button from '@mui/material/Button';

function Home() {
    let history = useHistory();

    const onClickStart = async () => {
        history.push('/login');
    };

    return (
        <>
            <div className="home-container">
                <div className="home-wrapper">
                    <img className="cloud-1-image" alt="" src={"imgs/front/home/cloud-1.png"} />
                    <img className="cloud-2-image" alt="" src={"imgs/front/home/cloud-2.png"} />
                    <img className="cloud-3-image" alt="" src={"imgs/front/home/cloud-3.png"} />
                    <img className="earth-land-image" alt="" src={"imgs/front/home/earth.png"} />
                    <img className="title-image" alt="" src={"imgs/front/home/title.png"} />
                    <img className="rocket-image" alt="" src={"imgs/front/home/rocket.png"} />
                    <Button className="start-game-btn" onClick={onClickStart}>
                        <img className="start-btn-image" alt="" src={"imgs/front/home/start-btn.png"} />
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Home;
