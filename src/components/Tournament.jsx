import React from "react";
import {
  Bracket,
  BracketGame,
  BracketGenerator,
} from "react-tournament-bracket";

const game = {
  id: 0,
  name: "Winner of 1",
  scheduled: "2017-07-06",
  sides: {
    home: {
      team: {
        id: "1",
        name: "Team A",
      },
      score: {
        score: 3,
      },
    },
    visitor: {
      team: {
        id: "2",
        name: "Team B",
      },
      score: {
        score: 2,
      },
    },
  },
};

const Tournament = () => {
  return <Bracket game={game} />;
};

export default Tournament;
