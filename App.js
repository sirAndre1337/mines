import React, {useState} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {MineField} from './src/components/MineField';
import {LevelSelection} from './src/screens/LevelSelection';
import {
  createMineBoard,
  cloneBoard,
  openField,
  wonGame,
  showMines,
  hadExplosion,
  invertFlag,
  flagsUsed,
} from './src/functions';
import {params} from './src/params';
import {Header} from './src/components/Header';

const minesAmount = () => {
  const cols = params.getColumnsAmount();
  const rows = params.getRowsAmount();
  return Math.ceil(cols * rows * params.difficultLevel);
};

const createState = () => {
  const cols = params.getColumnsAmount();
  const rows = params.getRowsAmount();
  return {
    board: createMineBoard(rows, cols, minesAmount()),
  };
};

const App = () => {
  const [board, setBoard] = useState(createState().board);
  const [lost, setLost] = useState(false);
  const [won, setWon] = useState(false);
  const [showModalLevel, setShowModalLevel] = useState(false);

  const onOpenField = (row, column) => {
    const clonedBoard = cloneBoard(board);
    openField(clonedBoard, row, column);
    const lostGame = hadExplosion(clonedBoard);
    const winTheGame = wonGame(clonedBoard);

    if (lostGame) {
      showMines(clonedBoard);
      Alert.alert('Perdeuuu!', 'Que buuuuuurro!');
    }

    if (winTheGame) {
      Alert.alert('Parabens', 'Voce venceu!');
    }

    setBoard(clonedBoard);
    setWon(winTheGame);
    setLost(lostGame);
  };

  const onSelectField = (row, column) => {
    const clonedBoard = cloneBoard(board);
    invertFlag(clonedBoard, row, column);
    const winTheGame = wonGame(clonedBoard);

    if (winTheGame) {
      Alert.alert('Parabens', 'Voce venceu!');
    }
    setBoard(clonedBoard);
    setWon(winTheGame);
  };

  const onNewGame = () => {
    setBoard(createState().board);
    setWon(false);
    setLost(false);
  };

  const lvlSelection = level => {
    params.difficultLevel = level;
    setBoard(createState().board);

    setLost(false);
    setWon(false);
    setShowModalLevel(false);
  };

  return (
    <View style={styles.container}>
      <LevelSelection
        isVisible={showModalLevel}
        onLevelSelected={level => lvlSelection(level)}
        onCancel={() => setShowModalLevel(false)}
      />
      <Header
        onNewGame={onNewGame}
        onFlagPress={() => setShowModalLevel(!showModalLevel)}
        flagsLeft={minesAmount() - flagsUsed(board)}
      />
      <View style={styles.board}>
        <MineField
          board={board}
          onOpenField={(row, column) => onOpenField(row, column)}
          onSelectField={(row, column) => onSelectField(row, column)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  board: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AAA',
  },
});

export default App;
