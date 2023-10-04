import { useState, useEffect, useRef } from "react";
import bg from "./assets/images/bg.jpg";
import {
   FaArrowDown,
   FaArrowUp,
   FaPlay,
   FaPause,
} from "../node_modules/react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import "./App.css";
import notice from "./noticefile.mp3";

function App() {
   const [breakTime, setBreakTime] = useState(2);
   const [sessionTime, setSessionTime] = useState(1);
   const [timeLeft, setTimeLeft] = useState(sessionTime * 60);
   const [isRunning, setIsRunning] = useState(false);
   const [timeRefresh, setRefreshTime] = useState(false);
   const [isSessionMode, setIsSessionMode] = useState(true); // Tracks session/break mode
   const [disableTimeAdjustment, setDisableTimeAdjustment] = useState(false);

   const audioRef = useRef(null);

   const handleDecreaseBreakTime = () => {
      if (!disableTimeAdjustment && breakTime > 1) {
         setBreakTime(breakTime - 1);
      }
   };
   const handleIncreaseBreakTime = () => {
      if (!disableTimeAdjustment && breakTime < 30) {
         setBreakTime(breakTime + 1);
      }
   };
   const handleDecreaseSessionTime = () => {
      if (!disableTimeAdjustment && sessionTime > 1) {
         setSessionTime(sessionTime - 1);
      }
   };
   const handleIncreaseSessionTime = () => {
      if (!disableTimeAdjustment && sessionTime < 60) {
         setSessionTime(sessionTime + 1);
      }
   };
   const handlePlayClick = () => {
      setIsRunning(true);
      setDisableTimeAdjustment(true);
   };

   const handlePauseClick = () => {
      setIsRunning(false);
      setDisableTimeAdjustment(false);
   };
   const handleRefreshClick = () => {
      setRefreshTime(true);
      setDisableTimeAdjustment(false);
      setIsSessionMode(true);
   };
   // chuan hoa thoi gian
   const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${
         remainingSeconds < 10 ? "0" : ""
      }${remainingSeconds}`;
   };

   useEffect(() => {
      if (isSessionMode) setTimeLeft(sessionTime * 60);
   }, [sessionTime, isSessionMode]);
   useEffect(() => {
      if (!isSessionMode) setTimeLeft(breakTime * 60);
   }, [breakTime, isSessionMode]);
   //refresh
   useEffect(() => {
      setTimeLeft(sessionTime * 60);
      setIsRunning(false);
      setRefreshTime(false);
   }, [timeRefresh, sessionTime]);

   useEffect(() => {
      let timer;
      if (isRunning && timeLeft > 0) {
         timer = setInterval(() => {
            setTimeLeft(timeLeft - 1);
         }, 1000);
      }
      return () => {
         clearInterval(timer);
      };
   }, [isRunning, timeLeft]);

   useEffect(() => {
      if (isRunning && timeLeft === 0) {
         // Handle when the timer reaches 0, e.g., switch between break and session
         setIsRunning(false); // Pause the timer
         //audio
         if (isSessionMode) audioRef.current.play();
         // Implement logic for switching between break and session here
         setTimeout(() => {
            setIsSessionMode((prevMode) => !prevMode);
            // Reset the timer based on the new mode
            setTimeLeft(isSessionMode ? breakTime * 60 : sessionTime * 60);
            if (isRunning) {
               setIsRunning(true);
            }
         }, 4000);
      }
   }, [isRunning, timeLeft, isSessionMode, sessionTime, breakTime]);

   return (
      <>
         <div
            style={{
               width: "100%",
               height: "100%",
               backgroundImage: `url(${bg})`,
               backgroundRepeat: "no-repeat",
               backgroundSize: "cover",
               position: "absolute",
            }}
         >
            <h1>25 + 5 Clock</h1>
            <div className="set-length">
               <div className="title-length">Break Length</div>
               <div className="set-time-length">
                  <button
                     className="decrease-btn"
                     onClick={handleDecreaseBreakTime}
                  >
                     <FaArrowDown />
                  </button>
                  <div className="time-length time-length-break">
                     {breakTime}
                  </div>
                  <button
                     className="increase-btn"
                     onClick={handleIncreaseBreakTime}
                  >
                     <FaArrowUp />
                  </button>
               </div>
            </div>
            <div className="set-length">
               <div className="title-length">Session Length</div>
               <div className="set-time-length">
                  <button
                     className="decrease-btn"
                     onClick={handleDecreaseSessionTime}
                  >
                     <FaArrowDown />
                  </button>
                  <div className="time-length time-length-session">
                     {sessionTime}
                  </div>
                  <button
                     className="increase-btn"
                     onClick={handleIncreaseSessionTime}
                  >
                     <FaArrowUp />
                  </button>
               </div>
            </div>
            <div className="time-display">
               <div className="time-label">
                  {isSessionMode ? "Session" : "Break"}
               </div>
               <div className="time-left">{formatTime(timeLeft)}</div>
            </div>
            <div className="list-btn">
               <button className="play-btn" onClick={handlePlayClick}>
                  <FaPlay />
               </button>
               <button className="pause-btn" onClick={handlePauseClick}>
                  <FaPause />
               </button>
               <button className="back-btn" onClick={handleRefreshClick}>
                  <FiRefreshCw />
               </button>
            </div>
            <audio ref={audioRef} src={notice}></audio>
         </div>
      </>
   );
}

export default App;
