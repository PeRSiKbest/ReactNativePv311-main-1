import { Animated, Pressable, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View, Modal } from "react-native";
import { useEffect, useState } from "react";
import RNFS from "react-native-fs";

type EventData = {
    x: number,
    y: number,
    t: number
};

type FieldState = {
    tiles: Array<number>,
    score: number,
    bestScore: number
};

const distanceThreshold = 50;
const timeThreshold = 500;
const bestScoreFilename = '/best.score';
const N = 4;

let animValue = new Animated.Value(1);
const opacityValues = Array.from({length: 16}, () => new Animated.Value(1));
const scaleValues   = Array.from({length: 16}, () => new Animated.Value(1));
let scoreAnim = new Animated.Value(1);

// колір плиток
function tileBackground(tileValue: number) {
    return tileValue == 0 ? "#BDAFA2"
    : tileValue == 2      ? "#EEE3DB"
    : tileValue == 4      ? "#EEE1D0"
    : tileValue == 8      ? "#d5e641ff"
    : tileValue == 16     ? "#dbe91aff"
    : tileValue == 32     ? "#e0d100ff"
    : tileValue == 64     ? "#f08a76ff"
    : tileValue == 128    ? "#fd5f5fff"
    : tileValue == 256    ? "#ff4343ff"
    : tileValue == 512    ? "#ff0000ff"
    : tileValue == 1024   ? "#6070ffff"
    : tileValue == 2048   ? "#525dffff"
    : tileValue == 4096   ? "#1827ffff"
    : tileValue == 8192   ? "#ff4ff6ff"
    : tileValue == 16384  ? "#ee38ffff"
    : tileValue == 32768  ? "#d503ffff"
                          : "#f14af7ff";
}

//колір цифр
function tileForeground(tileValue: number) {
    return tileValue == 0 ? "#BDAFA2"
    : tileValue == 2      ? "#746C63"
    : tileValue == 4      ? "#766E66"
    : tileValue == 8      ? "#FAF3EF"
    : tileValue == 16     ? "#FBF5F2"
    : tileValue == 32     ? "#FBF5F2"
    : tileValue == 64     ? "#FBF5F2"
    : tileValue == 128    ? "#444"
    : tileValue == 256    ? "#444"
    : tileValue == 512    ? "#444"
    : tileValue == 1024   ? "#FBF5F2"
    : tileValue == 2048   ? "#FBF5F2"
    : tileValue == 4096   ? "#FBF5F2"
    : tileValue == 8192   ? "#444"
    : tileValue == 16384  ? "#444"
    : tileValue == 32768  ? "#444"
                          : "#444";
}

export default function Game() {
    const {width} = useWindowDimensions();
    const [tiles, setTiles] = useState([
        0,    2,    4,     8,
        16,   32,   64,    128,
        256,  512,  1024,  2048,
        4096, 8192, 16384, 32768
    ]);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(4);
    const [savedField, setSavedField] = useState(null as FieldState|null);

    const [win, setWin] = useState(false);
    const [gameOver, setGameOver] = useState(false);
 
    useEffect(() => {
        loadBestScore();   
    }, []);
 
    useEffect(() => {
        if (score > bestScore) {
            setBestScore(score);
        }              
    }, [score]);

    useEffect(() => {
        saveBestScore();             
    }, [bestScore]);

    // анімація SCORE
    useEffect(() => {
        Animated.sequence([
            Animated.timing(scoreAnim, {
                toValue: 1.2,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scoreAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, [score]);

    const saveBestScore = () => {
        const path = RNFS.DocumentDirectoryPath + bestScoreFilename;
        RNFS.writeFile(path, bestScore.toString(), 'utf8')
    };
    const loadBestScore = () => {
        const path = RNFS.DocumentDirectoryPath + bestScoreFilename;
        return RNFS.readFile(path, 'utf8')
        .then(str => {
            setBestScore(Number(str));
        }).catch(() => {
        })
    };

    const saveField = () => {
        setSavedField({
            tiles: [...tiles],
            score: score,
            bestScore: bestScore,
        });
    };

    const undoField = () => {
        if(savedField == null) return;
        setTiles(savedField!.tiles);
        setScore(savedField!.score);
        setBestScore(savedField!.bestScore);
        // після відкату скидаємо savedField, щоб undo був лише на 1 крок
        setSavedField(null);
        setWin(false);
        setGameOver(false);
    };

    const tileFontSize = (tileValue: number) => {
        return tileValue < 10 ? width * 0.12
        : tileValue < 100     ? width * 0.1
        : tileValue < 1000    ? width * 0.08
        : tileValue < 10000   ? width * 0.07
                              : width * 0.06;
    };

    const [text,setText] = useState("Game");
    var startData: EventData|null = null;

    const detectSwipe = (finishData: EventData) => {
        if(startData == null) return;
        const dx = finishData.x - startData!.x;
        const dy = finishData.y - startData!.y;
        const dt = finishData.t - startData!.t;
        if(dt < timeThreshold) {
            if(Math.abs(dx) > Math.abs(dy)) {
                if(Math.abs(dx) > distanceThreshold) {
                    if(dx > 0) {
                        if( canMoveRight() ) {
                            saveField();
                            moveRight();
                            setText("Right - OK");
                            spawnTile();
                            setTiles([...tiles]);
                        }
                        else {
                            setText("Right - NO MOVE");
                        }
                    }
                    else {
                        if( canMoveLeft() ) {
                            saveField();
                            moveLeft();
                            setText("Left - OK");
                            spawnTile();
                            setTiles([...tiles]);
                        }
                        else {
                            setText("Left - NO MOVE");
                        }
                    }
                }
            }
            else {
                if(Math.abs(dy) > distanceThreshold) {
                    if(dy > 0) {
                        if ( canMoveDown() ) {
                            saveField();
                            moveDown();
                            setText("Down - OK");
                            spawnTile();
                            setTiles([...tiles]);
                        } else {
                            setText("Down - NO MOVE");
                        }
                        Animated.sequence([
                            Animated.timing(animValue, {
                                toValue: 0,
                                duration: 20,
                                useNativeDriver: true,
                            }),
                            Animated.timing(animValue, {
                                toValue: 1,
                                duration: 500,
                                useNativeDriver: true,
                            })
                        ]).start();
                    }
                    else {
                        if ( canMoveUp() ) {
                            saveField();
                            moveUp();
                            setText("Up - OK");
                            spawnTile();
                            setTiles([...tiles]);
                        } else {
                            setText("Up - NO MOVE");
                        }
                    }
                }
            }
        }
    };

    const spawnTile = () => {
        var freeTiles: number[] = [];
        for(let i = 0; i < tiles.length; i += 1) {
            if(tiles[i] == 0) {
                freeTiles.push(i);
            }
        }
        if (freeTiles.length === 0) return;
        const randomIndex = freeTiles[Math.floor(Math.random() * freeTiles.length)];
        tiles[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        Animated.sequence([
            Animated.timing( opacityValues[randomIndex], {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }),
            Animated.timing( opacityValues[randomIndex], {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const newGame = () => {
        for(let i = 0; i < tiles.length; i += 1) {
            tiles[i] = 0;
        }
        spawnTile();
        setTiles([...tiles]);
        setScore(0);
        setSavedField(null);
        setWin(false);
        setGameOver(false);
    };


    const moveRight = () => {
        const N = 4;
        let collapsedIndexes: number[] = [];
        for(let r = 0; r < N; r += 1) {
            for(let i = 1; i < N; i += 1) {
                for(let c = 0; c < N - 1; c += 1 ) {
                    if( tiles[r*N + c] != 0 && tiles[r*N + c + 1] == 0 ) {
                        tiles[r*N + c + 1] = tiles[r*N + c];
                        tiles[r*N + c] = 0;
                    }
                }
            }
            for(let c = N - 1; c > 0; c -= 1 ) {
                if( tiles[r*N + c] != 0 && tiles[r*N + c - 1] == tiles[r*N + c] ) {
                    tiles[r*N + c] *= 2;
                    tiles[r*N + c - 1] = 0;
                    setScore(score + tiles[r*N + c]);
                    collapsedIndexes.push(r*N + c);
                }
            }
            for(let i = 1; i < N; i += 1) {
                for(let c = 0; c < N - 1; c += 1 ) {
                    if( tiles[r*N + c] != 0 && tiles[r*N + c + 1] == 0 ) {
                        let index = collapsedIndexes.indexOf(r*N + c);
                        tiles[r*N + c + 1] = tiles[r*N + c];              
                        tiles[r*N + c] = 0;  
                        if (index !== -1) collapsedIndexes[index] = r*N + c + 1;                             
                    }
                }
            }
        }
        if(collapsedIndexes.length > 0) {
            Animated.parallel( collapsedIndexes.map(index => 
                Animated.sequence([
                    Animated.timing(scaleValues[index], {
                        toValue: 1.2,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleValues[index], {
                        toValue: 1.0,
                        duration: 150,
                        useNativeDriver: true,
                    }),
                ])
            )).start();
        }
    };

    const moveLeft = () => {
        let res = false;
        let collapsedIndexes: number[] = [];

        for(let r = 0; r < N; r++) {
            for(let i = 1; i < N; i++) {
                for(let c = 0; c < N-1; c++) {
                    if(tiles[r*N + c] == 0 && tiles[r*N + c + 1] != 0) {
                        tiles[r*N + c] = tiles[r*N + c + 1];
                        tiles[r*N + c + 1] = 0;
                        res = true;
                    }
                }
            }

            for(let c = 0; c < N-1; c++) {
                if(tiles[r*N + c] != 0 && tiles[r*N + c] == tiles[r*N + c + 1]) {
                    tiles[r*N + c] *= 2;
                    tiles[r*N + c + 1] = 0;
                    setScore(score + tiles[r*N + c]);
                    collapsedIndexes.push(r*N + c);
                    res = true;
                }
            }

            for(let i = 1; i < N; i++) {
                for(let c = 0; c < N-1; c++) {
                    if(tiles[r*N + c] == 0 && tiles[r*N + c + 1] != 0) {
                        tiles[r*N + c] = tiles[r*N + c + 1];
                        tiles[r*N + c + 1] = 0;
                    }
                }
            }
        }

        if(collapsedIndexes.length > 0) {
            Animated.parallel(
                collapsedIndexes.map(index => 
                    Animated.sequence([
                        Animated.timing(scaleValues[index], { toValue: 1.2, duration: 150, useNativeDriver: true }),
                        Animated.timing(scaleValues[index], { toValue: 1.0, duration: 150, useNativeDriver: true }),
                    ])
                )
            ).start();
        }

        return res;
    };

    const moveUp = () => {
        let res = false;
        let collapsedIndexes: number[] = [];

        for(let c = 0; c < N; c++) {
            for(let i = 1; i < N; i++) {
                for(let r = 1; r < N; r++) {
                    if(tiles[(r-1)*N + c] == 0 && tiles[r*N + c] != 0) {
                        tiles[(r-1)*N + c] = tiles[r*N + c];
                        tiles[r*N + c] = 0;
                        res = true;
                    }
                }
            }

            for(let r = 1; r < N; r++) {
                if(tiles[r*N + c] != 0 && tiles[(r-1)*N + c] == tiles[r*N + c]) {
                    tiles[(r-1)*N + c] *= 2;
                    tiles[r*N + c] = 0;
                    setScore(score + tiles[(r-1)*N + c]);
                    collapsedIndexes.push((r-1)*N + c);
                    res = true;
                }
            }

            for(let i = 1; i < N; i++) {
                for(let r = 1; r < N; r++) {
                    if(tiles[(r-1)*N + c] == 0 && tiles[r*N + c] != 0) {
                        tiles[(r-1)*N + c] = tiles[r*N + c];
                        tiles[r*N + c] = 0;
                    }
                }
            }
        }

        if(collapsedIndexes.length > 0) {
            Animated.parallel(
                collapsedIndexes.map(index => 
                    Animated.sequence([
                        Animated.timing(scaleValues[index], { toValue: 1.2, duration: 150, useNativeDriver: true }),
                        Animated.timing(scaleValues[index], { toValue: 1.0, duration: 150, useNativeDriver: true }),
                    ])
                )
            ).start();
        }

        return res;
    };

    const moveDown = () => {
        let res = false;
        let collapsedIndexes: number[] = [];

        for(let c = 0; c < N; c++) {
            for(let i = 1; i < N; i++) {
                for(let r = N-2; r >= 0; r--) {
                    if(tiles[(r+1)*N + c] == 0 && tiles[r*N + c] != 0) {
                        tiles[(r+1)*N + c] = tiles[r*N + c];
                        tiles[r*N + c] = 0;
                        res = true;
                    }
                }
            }

            for(let r = N-2; r >= 0; r--) {
                if(tiles[r*N + c] != 0 && tiles[(r+1)*N + c] == tiles[r*N + c]) {
                    tiles[(r+1)*N + c] *= 2;
                    tiles[r*N + c] = 0;
                    setScore(score + tiles[(r+1)*N + c]);
                    collapsedIndexes.push((r+1)*N + c);
                    res = true;
                }
            }

            for(let i = 1; i < N; i++) {
                for(let r = N-2; r >= 0; r--) {
                    if(tiles[(r+1)*N + c] == 0 && tiles[r*N + c] != 0) {
                        tiles[(r+1)*N + c] = tiles[r*N + c];
                        tiles[r*N + c] = 0;
                    }
                }
            }
        }

        if(collapsedIndexes.length > 0) {
            Animated.parallel(
                collapsedIndexes.map(index => 
                    Animated.sequence([
                        Animated.timing(scaleValues[index], { toValue: 1.2, duration: 150, useNativeDriver: true }),
                        Animated.timing(scaleValues[index], { toValue: 1.0, duration: 150, useNativeDriver: true }),
                    ])
                )
            ).start();
        }

        return res;
    };


    const canMoveLeft = () => {
        for(let r = 0; r < N; r += 1) {
            for(let c = 1; c < N; c += 1) {
                const curr = tiles[r*N + c];
                const left = tiles[r*N + (c - 1)];
                if (curr !== 0 && (left === 0 || left === curr)) {
                    return true;
                }
            }
        }
        return false;
    };

    const canMoveRight = () => {
        for(let r = 0; r < N; r += 1) {
            for(let c = 0; c < N - 1; c += 1) {
                const curr = tiles[r*N + c];
                const right = tiles[r*N + (c + 1)];
                if (curr !== 0 && (right === 0 || right === curr)) {
                    return true;
                }
            }
        }
        return false;
    };

    const canMoveUp = () => {
        for(let r = 1; r < N; r += 1) {
            for(let c = 0; c < N; c += 1) {
                const curr = tiles[r*N + c];
                const up = tiles[(r - 1)*N + c];
                if (curr !== 0 && (up === 0 || up === curr)) {
                    return true;
                }
            }
        }
        return false;
    };

    const canMoveDown = () => {
        for(let r = 0; r < N - 1; r += 1) {
            for(let c = 0; c < N; c += 1) {
                const curr = tiles[r*N + c];
                const down = tiles[(r + 1)*N + c];
                if (curr !== 0 && (down === 0 || down === curr)) {
                    return true;
                }
            }
        }
        return false;
    };


    useEffect(() => {
        if (tiles.includes(2048)) {
            setWin(true);
        }
        const hasEmpty = tiles.some(t => t === 0);
        if (!hasEmpty && !canMoveLeft() && !canMoveRight() && !canMoveUp() && !canMoveDown()) {
            setGameOver(true);
        } else {
            setGameOver(false);
        }
    }, [tiles]);

    return <View style={styles.container}>
        <View style={[styles.topBlock, {marginHorizontal: width * 0.025}]}>
            <Text style={styles.topBlockText}>
                2048
            </Text>
            <View  style={styles.topBlockSub}>
                <View  style={styles.topBlockScores}>
                    <View style={styles.topBlockScore}>
                        <Text style={styles.topBlockScoreText}>SCORE</Text>
                        <Animated.Text 
                            style={[styles.topBlockScoreText, {transform: [{scale: scoreAnim}]}]}>
                            {score}
                        </Animated.Text>
                    </View>
                    
                    <View style={styles.topBlockScore}>
                        <Text style={styles.topBlockScoreText}>BEST</Text>
                        <Text style={styles.topBlockScoreText}>{bestScore}</Text>
                    </View>
                </View>

                <View style={styles.topBlockButtons}>
                    <Pressable style={styles.topBlockButton} onPress={newGame}><Text style={styles.topBlockButtonText}>NEW</Text></Pressable>
                    <Pressable style={[styles.topBlockButton, savedField ? {} : {opacity: 0.5}]} onPress={undoField}><Text style={styles.topBlockButtonText}>UNDO</Text></Pressable>
                </View>
            </View>
        </View>

        <Text>
            Join the numbers and get to the 2048 tile!
        </Text>
        
        <TouchableWithoutFeedback
                onPressIn = {e => {startData = {
                    x: e.nativeEvent.pageX,
                    y: e.nativeEvent.pageY,
                    t: e.nativeEvent.timestamp
                }}}
                onPressOut={e => detectSwipe({
                    x: e.nativeEvent.pageX,
                    y: e.nativeEvent.pageY,
                    t: e.nativeEvent.timestamp
                })}> 

            <View style={[styles.field, {width: width * 0.95, height: width * 0.95}]}>
                {tiles.map((tile, index) => <Animated.View key={index} 
                    style={{
                        opacity: opacityValues[index],
                        transform: [{scale: scaleValues[index]}]
                    }}>
                    <Text style={[styles.tile, {
                        backgroundColor: tileBackground(tile),
                        color: tileForeground(tile),
                        width: width * 0.21,
                        fontSize: tileFontSize(tile),
                        fontWeight: 900 as any,
                        height: width * 0.21,
                        marginLeft: width * 0.022,
                        marginTop: width * 0.022,
                    }]}>{tile}</Text>
                </Animated.View>)}
            </View>
        </TouchableWithoutFeedback>

        <Animated.View style={{opacity: animValue}}>
            <Text>{text}</Text>
        </Animated.View>

        {/* WIN */}
        <Modal transparent={true} visible={win} animationType="fade" onRequestClose={() => setWin(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>🎉 Вітаємо!</Text>
                    <Text style={{marginBottom: 12}}>Ви досягли 2048!</Text>
                    <View style={{flexDirection: "row"}}>
                        <Pressable style={[styles.topBlockButton, {marginRight: 10}]} onPress={() => setWin(false)}>
                            <Text style={styles.topBlockButtonText}>Продовжити</Text>
                        </Pressable>
                        <Pressable style={styles.topBlockButton} onPress={() => { setWin(false); newGame(); }}>
                            <Text style={styles.topBlockButtonText}>Нова гра</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>

        {/* GAME OVER modal */}
        <Modal transparent={true} visible={gameOver} animationType="fade" onRequestClose={() => setGameOver(false)}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>❌ Гра закінчена</Text>
                    <Pressable style={styles.modalButton} onPress={() => { newGame(); }}>
                        <Text style={styles.modalButtonText}>Нова гра</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
        
    </View>
    ;
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FCF7F0",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%"
  },
  topBlock: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBlockText: {
    backgroundColor: "gold",
    borderRadius: 5,
    color: "white",
    fontSize: 32,
    marginVertical: 5,
    paddingHorizontal: 10,
    verticalAlign: "middle"
  },
  topBlockSub: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBlockScores: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topBlockScore: {
    backgroundColor: "#3C3A34",
    borderRadius: 5,
    flex: 1,
    marginVertical: 5,
    marginLeft: 10,
    padding: 10,
  },
  topBlockScoreText: {
    color: "white",
    textAlign: "center"
  },
  topBlockButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",

  },
  topBlockButton: {
    backgroundColor: "#E06849",
    borderRadius: 5,
    flex: 1,
    marginVertical: 5,
    marginLeft: 10,
    padding: 10,

  },
  topBlockButtonText: {
    color: "white",
    textAlign: "center"
  },
  field: {
    backgroundColor: "#A29383",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: "auto"
  },
  tile: {
    borderRadius: 5,
    textAlign: "center",
    verticalAlign: "middle"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6
  },
  modalButton: {
  backgroundColor: "#6a5acd",
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 8,
  marginHorizontal: 5,
},
modalButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},
});