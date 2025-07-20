import { useState, useRef, useEffect } from "react";
import { ROSCO } from "./roscoData";
import LetterCircle from "./LetterCircle";

function getInitialStatus() {
  return ROSCO.map((q) => ({
    letter: q.letter,
    state: "pending", // "correct", "wrong", "pending"
  }));
}

const TOTAL_TIME = 150; // 2 minutes 30 seconds

export default function App() {
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState(getInitialStatus());
  const [pending, setPending] = useState([]);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef();

  // Timer effect
  useEffect(() => {
    if (timerRunning && !gameOver && started) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setGameOver(true);
            setTimerRunning(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, gameOver, started]);

  function getCurrentIndex() {
    return round === 1 ? current : pending[current];
  }

  function goToNextLetter(pauseTimer = false) {
    if (pauseTimer) setTimerRunning(false);
    if (round === 1) {
      if (current < ROSCO.length - 1) {
        setCurrent((c) => c + 1);
      } else if (pending.length > 0) {
        setRound(2);
        setCurrent(0);
      } else {
        setGameOver(true);
        setTimerRunning(false);
      }
    } else {
      if (current < pending.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        const stillPending = pending.filter(i => status[i].state === "pending");
        if (stillPending.length > 0) {
          setPending(stillPending);
          setCurrent(0);
          setRound(r => r + 1);
        } else {
          setGameOver(true);
          setTimerRunning(false);
        }
      }
    }
  }

  function handleCorrect() {
    const idx = getCurrentIndex();
    const newStatus = [...status];
    newStatus[idx].state = "correct";
    setStatus(newStatus);
    goToNextLetter(false); // Timer continues
  }

  function handleWrong() {
    const idx = getCurrentIndex();
    const newStatus = [...status];
    newStatus[idx].state = "wrong";
    setStatus(newStatus);
    go
