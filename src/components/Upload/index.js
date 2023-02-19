import React, { useState, useEffect, useRef } from "react";
import AddIcon from '@mui/icons-material/Add';

function removeItems(arr, item) {
    for (var i = 0; i < item; i++) {
        arr.pop();
    }
}

function useFiles({ initialState = [], maxFiles }) {
    const [state, setstate] = useState(initialState);
    function withBlobs(files) {
        const destructured = [...files];
        if (destructured.length > maxFiles) {
            const difference = destructured.length - maxFiles;
            removeItems(destructured, difference);
        }
        const blobs = destructured
            .map(file => {
                if (file.type.includes("image")) {
                    console.log("image");
                    file.preview = URL.createObjectURL(file);
                    return file;
                }
                console.log("not image");
                return null;
            })
            .filter(elem => elem !== null);

        setstate(blobs);
    }
    return [state, withBlobs];
}

function Upload({ onDrop, maxFiles = 1 }) {
    const [over, setover] = useState(false);
    const [files, setfiles] = useFiles({ maxFiles });
    const $input = useRef(null);
    useEffect(() => {
        if (onDrop) {
            onDrop(files);
        }
    }, [files]);
    return (
        <>
            <div
                onClick={() => {
                    $input.current.click();
                }}
                onDrop={e => {
                    console.log(e);
                    e.preventDefault();
                    e.persist();
                    setfiles(e.dataTransfer.files);
                    setover(false);
                }}
                onDragOver={e => {
                    e.preventDefault();
                    setover(true);
                }}
                onDragLeave={e => {
                    e.preventDefault();
                    setover(false);
                }}
                className={over ? "upload-container over" : "upload-container"}
                style={{
                    width: "128px",
                    height: "128px",
                    borderRadius: "64px",
                    backgroundColor: "white",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer"
                }}
            >
                <AddIcon style={{ width: "100%", height: "100%", color: "grey", position: "absolute" }} />
                <input
                    style={{ display: "none" }}
                    type="file"
                    accept="image/*"
                    ref={$input}
                    onChange={e => {
                        setfiles(e.target.files);
                    }}
                    multiple={maxFiles > 1}
                />
                {files.map(file => (
                    <div style={{
                        width: "128px",
                        height: "128px",
                        position: "absolute",
                        backgroundImage: `url(${file.preview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }} />
                ))}
            </div>
        </>
    );
}

export { Upload };
