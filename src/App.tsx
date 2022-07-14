import { useEffect, useState } from "react";
import Button from "./components/Button";
import { FaHandRock, FaHandPaper, FaHandPeace, FaUndo } from "react-icons/fa";
const brain = require("brain.js");

interface IGameDetails {
  round: number;
  myScore: number;
  AIScore: number;
  isCorrect?: boolean;
  message?: string;
}

function App() {
  const initGameDetails = {
    round: 0,
    myScore: 0,
    AIScore: 0,
  };
  const [gameDetails, setGameDetails] = useState<IGameDetails>(initGameDetails);
  const [pattern, setPattern] = useState<number[]>([]);

  useEffect(() => {
    prepare();
  }, [pattern]);

  const prepare = () => {
    if (pattern.length < 1) {
      const newPattern = [];

      for (let i = 1; newPattern.length < 15; i++) {
        newPattern.push(Math.floor(Math.random() * 3 + 1));
      }
      setPattern(newPattern);
    }
  };

  const whoWon = (humanNumber: number, aiNumber: number) => {
    if (humanNumber === aiNumber) {
      gameDetails.round += 1;
      gameDetails.isCorrect = false;
      gameDetails.message = "Draw!";
      setGameDetails(gameDetails);
    } else if (
      (humanNumber === 1 && aiNumber === 3) ||
      (humanNumber === 2 && aiNumber === 1) ||
      (humanNumber === 3 && aiNumber === 2)
    ) {
      gameDetails.myScore += 1;
      gameDetails.round += 1;
      gameDetails.message = "You won!";
      gameDetails.isCorrect = true;
      setGameDetails(gameDetails);
    } else {
      gameDetails.AIScore += 1;
      gameDetails.round += 1;
      gameDetails.message = "AI won!";
      gameDetails.isCorrect = false;
      setGameDetails(gameDetails);
    }
  };

  const updatePattern = (humanNumber: number) => {
    if (pattern.length !== 0) {
      setPattern((prev) => prev.slice(1));

      setPattern((prev) => [...prev, humanNumber]);
    }
  };

  const humanChoose = async (humanNumber: number) => {
    prepare();

    const net = new brain.recurrent.LSTMTimeStep();

    await net.train([pattern], { iterations: 100, log: true });

    const humanWillChose = net.run(pattern);

    const roundedHumanWillChose = Math.round(humanWillChose);

    updatePattern(humanNumber);

    const chosenByAI =
      1 <= roundedHumanWillChose && roundedHumanWillChose <= 3
        ? (roundedHumanWillChose % 3) + 1
        : 1;

    whoWon(humanNumber, chosenByAI);
  };

  const restartGame = () => {
    setPattern([]);
    setGameDetails(initGameDetails);
  };

  return (
    <div className="relative flex flex-col justify-evenly items-center min-h-screen gap-3 bg-gradient-to-r from-cyan-800 to-blue-800">
      <div className="absolute right-0 top-0 p-2">
        <div className="flex flex-col justify-end items-end p-5 gap-5 text-gray-800">
          <p>Rounds: {gameDetails.round}</p>
          <button
            className="hover:text-white hover:scale-150 transition-all hover:-rotate-180"
            onClick={() => restartGame()}
          >
            <FaUndo />
          </button>
        </div>
      </div>

      <div className="relative px-5 text-white w-full text-4xl">
        <div className="absolute left-0 right-0 bottom-0 top-0 m-auto table">
          {gameDetails.isCorrect ? (
            <p className="text-yellow-400">{gameDetails.message}</p>
          ) : gameDetails.message === "Draw!" ? (
            <p className="text-white">{gameDetails.message}</p>
          ) : (
            <p className="text-red-500">{gameDetails.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 justify-items-center border border-white rounded p-2 text-white text-4xl">
        <p className=" text-white">
          You <span>{gameDetails.myScore}</span>
        </p>
        <span>vs</span>
        <p>
          AI <span>{gameDetails.AIScore}</span>
        </p>
      </div>

      <div className="grid gap-10">
        <Button icon={<FaHandRock />} onClick={() => humanChoose(1)} />
        <Button icon={<FaHandPaper />} onClick={() => humanChoose(2)} />
        <Button icon={<FaHandPeace />} onClick={() => humanChoose(3)} />
      </div>
    </div>
  );
}

export default App;
