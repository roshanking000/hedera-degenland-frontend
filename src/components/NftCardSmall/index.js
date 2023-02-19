import React from "react";

const NftCardSmall = ({ singleNftInfo }) => {
    return (
        <div style={{
            width: "215px",
            heigh: "100px",
            margin: "0 5px",
            display: "flex",
            flexDirection: "row"
        }}>
            <img alt="..." src={singleNftInfo.imgUrl}
                style={{
                    margin: "5px",
                    width: "100px",
                    border: "2px solid #873135",
                    borderRadius: "5px"
                }} />
            <div>
                <p style={{
                    color: "#873135",
                    fontWeight: "700",
                    margin: "0 0 0 5px",
                    padding: "10px 0 5px 0",
                    borderBottom: "2px solid #873135"
                }}>
                    {singleNftInfo.name}
                </p>
                <p style={{
                    fontSize: "20px",
                    color: "#2b3283",
                    fontWeight: "700",
                    margin: "5px 0 0 5px"
                }}>
                    {singleNftInfo.nftCount}
                </p>
            </div>
        </div >
    );
}

export default NftCardSmall;