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
            .map((file, index) => {
                if (file.type.includes("video")) {
                    file.preview = URL.createObjectURL(file);
                    return file;
                }
                else if (file.type.includes("image")) {
                    file.preview = URL.createObjectURL(file);
                    return file;
                }
                return null;
            })
            .filter(elem => elem !== null);

        setstate(blobs);
    }
    return [state, withBlobs];
}

function VideoUpload({ onDrop, maxFiles = 1 }) {
    const [over, setover] = useState(false);
    const [files, setfiles] = useFiles({ maxFiles });
    const $input = useRef(null);
    const [source, setSource] = useState();
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
                    width: "400px",
                    height: "200px",
                    backgroundColor: "white",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer"
                }}
            >
                {
                    (!files[0]?.type.includes("image") && !files[0]?.type.includes("video")) &&
                    <AddIcon style={{ width: "100%", height: "100%", color: "grey", position: "absolute" }} />
                }
                <input
                    style={{ display: "none" }}
                    type="file"
                    accept="image/* video/*"
                    ref={$input}
                    onChange={e => {
                        if (e.target.files.length != 0) {
                            setfiles(e.target.files);
                            const file = e.target.files[0];
                            const url = URL.createObjectURL(file);
                            setSource(url);
                        }
                    }}
                    multiple={maxFiles > 1}
                />
                {
                    files[0]?.type.includes("image") && 
                    files.map((file, index) => (
                        <div key={index} style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            backgroundImage: `url(${file.preview})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }} />
                    ))
                }
                {files[0]?.type.includes("video") && source && (
                    <video 
                        width="100%"
                        height={200}
                        controls
                        src={source}
                    />
                )}
            </div>
        </>
    );
}

export { VideoUpload };
