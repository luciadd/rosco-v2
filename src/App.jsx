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
        // Remove all letters that are no longer pending
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
    goToNextLetter(true); // Timer pauses
  }

  function handlePasapalabra() {
    const idx = getCurrentIndex();
    if (status[idx].state === "pending" && !pending.includes(idx)) {
      setPending([...pending, idx]);
    }
    goToNextLetter(true); // Timer pauses
  }

  function restart() {
    setCurrent(0);
    setStatus(getInitialStatus());
    setPending([]);
    setRound(1);
    setGameOver(false);
    setTimeLeft(TOTAL_TIME);
    setTimerRunning(false);
    setStarted(false);
  }

  function handleStart() {
    setStarted(true);
    setTimerRunning(true);
  }

  const idx = getCurrentIndex();
  const question = ROSCO[idx];

  return (
    <div className="app-container">
      <h1>El Rosco</h1>
      <LetterCircle status={status} current={idx} />
      <div style={{
        textAlign: "center",
        fontSize: "2.2rem",
        fontWeight: "bold",
        margin: "16px 0 10px 0",
        color: timeLeft <= 10 ? "#f44336" : "#222"
      }}>
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
      </div>
      {!started && !gameOver ? (
        <div style={{textAlign: "center", marginTop: 40}}>
          <button onClick={handleStart} style={{fontSize: "2.4rem", padding: "30px 80px", borderRadius: 18, background: "#2196f3", color: "#fff", border: "none", fontWeight: "bold", boxShadow: "0 2px 18px #2196f366", cursor: "pointer"}}>Start</button>
        </div>
      ) : !gameOver ? (
        <div>
          <div className="clue" style={{textAlign: "center", fontSize: "2rem", margin: "32px auto 12px auto", maxWidth: 650}}>
            <strong>{question.letter}</strong>: {question.clue}
          </div>
          <div className="host-buttons">
            <button onClick={handleCorrect}>Correcto</button>
            <button onClick={handleWrong}>Incorrecto</button>
            <button onClick={handlePasapalabra}>Pasapalabra</button>
          </div>
        </div>
      ) : (
        <div className="gameover" style={{textAlign: "center", fontSize: "2rem", marginTop: 60}}>
          <span>
            ¡Fin del juego! <button onClick={restart} style={{fontSize: "1.2rem", padding: "10px 28px"}}>Reiniciar</button>
          </span>
        </div>
      )}
    </div>
  );
}
