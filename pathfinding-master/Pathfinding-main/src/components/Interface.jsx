import { Button, IconButton, CircularProgress, Fade, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const Interface = forwardRef(({ canStart, started, animationEnded, playbackOn, time, maxTime, settings, colors, loading, timeChanged, cinematic, placeEnd, changeRadius, changeAlgorithm, setPlaceEnd, setCinematic, setSettings, setColors, startPathfinding, toggleAnimation, clearPath, changeLocation }, ref) => {
    const [snack, setSnack] = useState({
        open: false,
        message: "",
        type: "error",
    });
    const [showTutorial, setShowTutorial] = useState(false);
    const rightDown = useRef(false);
    const leftDown = useRef(false);
    useImperativeHandle(ref, () => ({
        showSnack(message, type = "error") {
            setSnack({ open: true, message, type });
        },
    }));
    function handlePlay() {
        if(!canStart) return;
        if(!started && time === 0) {
            startPathfinding();
            return;
        }
        toggleAnimation();
    }
    window.onkeydown = e => {
        if(e.code === "ArrowRight" && !rightDown.current && !leftDown.current && (!started || animationEnded)) {
            rightDown.current = true;
            toggleAnimation(false, 1);
        }
        else if(e.code === "ArrowLeft" && !leftDown.current && !rightDown.current && animationEnded) {
            leftDown.current = true;
            toggleAnimation(false, -1);
        }
    };

    useEffect(() => {
        if(localStorage.getItem("path_sawtutorial")) return;
        setShowTutorial(true);
        localStorage.setItem("path_sawtutorial", true);
    }, []);

    return (
        <>
            <div className={`nav-top ${cinematic ? "cinematic" : ""}`}>
                <div className="side slider-container" style={{ fontFamily: 'Times New Roman', fontSize: '50px' }}>
                    RUN
                </div>
                <IconButton disabled={!canStart} onClick={handlePlay} style={{ backgroundColor: "red", width: 60, height: 60 }} size="large">
                    {(!started || animationEnded && !playbackOn) 
                        ? <PlayArrow style={{ color: "white", width: 26, height: 26 }} fontSize="inherit" />
                        : <Pause style={{ color: "#fff", width: 26, height: 26, backgroundColor:"green" }} fontSize="inherit" />
                    }
                </IconButton>
                <div className="side">
                    <Button disabled={!animationEnded && started} onClick={clearPath} style={{ color: "#fff", backgroundColor: "green", paddingInline: 30, paddingBlock: 7 }} variant="contained">Clear path</Button>
                </div>
            </div>


            <div className="loader-container">
                <Fade
                    in={loading}
                    style={{
                        transitionDelay: loading ? "50ms" : "0ms",
                    }}
                    unmountOnExit
                >
                    <CircularProgress color="inherit" />
                </Fade>
            </div>


            <div className="mobile-controls">
                <Button onClick={() => {setPlaceEnd(!placeEnd);}} style={{ color: "#fff", backgroundColor: "#404156", paddingInline: 30, paddingBlock: 7 }} variant="contained">
                    {placeEnd ? "placing end node" : "placing start node"}
                </Button>
            </div>

             <FormControl variant="filled">
                        <InputLabel style={{ fontSize: 17 , fontFamily:"Times New Roman"}} id="algo-select">Algorithm</InputLabel>
                        <Select
                            labelId="algo-select"
                            value={settings.algorithm}
                            onChange={e => {changeAlgorithm(e.target.value);}}
                            required
                            style={{ backgroundColor: "#404156", color: "#fff", width: "100%", paddingLeft: 1 }}
                            inputProps={{MenuProps: {MenuListProps: {sx: {backgroundColor: "#404156"}}}}}
                            size="small"
                            disabled={!animationEnded && started}
                        >
                            <MenuItem value={"astar"}>A* algorithm</MenuItem>
                            <MenuItem value={"greedy"}>Greedy algorithm</MenuItem>
                            <MenuItem value={"dijkstra"}>Dijkstra&apos;s algorithm</MenuItem>
                            <MenuItem value={"bidirectional"}>Bidirectional Search algorithm</MenuItem>
                        </Select>
             </FormControl>            
        </>
    );
});

Interface.displayName = "Interface";
export default Interface;