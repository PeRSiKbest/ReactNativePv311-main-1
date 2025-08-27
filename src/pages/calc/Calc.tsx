import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import CalcButton from "./components/CalcButton";
import { useState } from "react";

export default function Calc() {
  const { width, height } = useWindowDimensions();
  const isPortrait = width < height;

  const [currentExpr, setCurrentExpr] = useState("");
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState<number | null>(null);
  const [result, setResult] = useState("0");

  const onMemoryPress = (command: string) => {
    switch (command) {
      case "MC": setMemory(null); break;
      case "MR": if (memory !== null) { setCurrentExpr(memory.toString()); setResult(memory.toString()); } break;
      case "M+": setMemory((prev) => (prev ?? 0) + Number(result)); break;
      case "M-": setMemory((prev) => (prev ?? 0) - Number(result)); break;
      case "MS": setMemory(Number(result)); break;
    }
  };

  const onDigitPress = (digit: string) => {
    const parts = currentExpr.split(/[\+\-×÷]/);
    const lastNumber = parts[parts.length - 1];

    if (digit === "0") {
      if (lastNumber === "" || lastNumber === "0" || lastNumber === "-0" ) return;
    }

    const newExpr = currentExpr + digit;
    setCurrentExpr(newExpr);
    setResult(newExpr);
  };

  const onDotPress = () => {
    const parts = currentExpr.split(/[\+\-×÷]/);
    const lastNumber = parts[parts.length - 1];
    if (!lastNumber) {
      setCurrentExpr(currentExpr + "0.");
      setResult(currentExpr + "0.");
      return;
    }
    if (!lastNumber.includes(".")) {
      setCurrentExpr(currentExpr + ".");
      setResult(currentExpr + ".");
    }
  };

  const onPmPress = () => {
    const numberMatch = currentExpr.match(/(-*\d+(\.\d+)?)(?=[+\-×÷]*$)/);
    if (!numberMatch) return;

    const [fullMatch, numberStr] = numberMatch;
    if (numberStr === "0" || numberStr === "-0") return;

    const startIndex = currentExpr.lastIndexOf(fullMatch);
    const cleanNumber = numberStr.replace(/^-+/, "");
    const minusCount = (numberStr.match(/-/g) || []).length;
    const isNegative = minusCount % 2 === 1;
    const newNumber = isNegative ? cleanNumber : "-" + cleanNumber;
    const newExpr = currentExpr.substring(0, startIndex) + newNumber;

    setCurrentExpr(newExpr);
    setResult(newExpr);
  };

  const onOperatorPress = (symbol: string) => {
    if (currentExpr.length === 0) return;

    const lastChar = currentExpr[currentExpr.length - 1];
    if (lastChar === ".") return;

    

    if ("+-×÷".includes(lastChar)) {
      const newExpr = currentExpr.slice(0, -1) + symbol;
      setCurrentExpr(newExpr);
      setResult(newExpr);
      return;
    }

    setCurrentExpr(currentExpr + symbol);
    setResult(currentExpr + symbol);
  };

  const onBackspace = () => {
    if (currentExpr.length === 0) return;
    const newExpr = currentExpr.slice(0, -1);
    setCurrentExpr(newExpr);
    setResult(newExpr || "0");
  };

  const onClear = () => {
    setCurrentExpr("");
    setExpression("");
    setResult("0");
  };

  const onClearEntry = () => {
    const parts = currentExpr.split(/([\+\-×÷])/);
    if (parts.length === 0) return;
    parts.pop();
    const newExpr = parts.join("");
    setCurrentExpr(newExpr);
    setResult(newExpr || "0");
  };

  const onSpecialPress = (type: string) => {
    if (currentExpr.length === 0) return;
    const parts = currentExpr.match(/([+\-×÷]?)(\d+(\.\d+)?)(%)?$/);
    if (!parts) return;

    const [match, operatorPart, numberPart, _, percentPart] = parts;
    const start = currentExpr.slice(0, currentExpr.length - match.length);
    let newNumber = numberPart;

    switch (type) {
      case "inverse": newNumber = (1 / Number(numberPart)).toString(); break;
      case "square": newNumber = (Number(numberPart) ** 2).toString(); break;
      case "sqrt":   newNumber = Math.sqrt(Number(numberPart)).toString(); break;
    }

    const newExpr = start + (operatorPart || "") + newNumber + (percentPart || "");
    setCurrentExpr(newExpr);
    setResult(newExpr);
  };

  const onPercentPress = () => {
    const parts = currentExpr.match(/(\d+(\.\d+)?)$/);
    if (!parts) return;

    const [match] = parts;
    const start = currentExpr.slice(0, currentExpr.length - match.length);
    const value = parseFloat(match) / 100;

    const newExpr = start + value.toString();
    setCurrentExpr(newExpr);
    setResult(newExpr);
  };

  const onEqualPress = () => {
    if (currentExpr.length === 0) return;
    try {
      const jsExpr = currentExpr.replace(/×/g, "*").replace(/÷/g, "/").replace(/-/g, "-");
      const value = Function(`return ${jsExpr}`)();
      setExpression(currentExpr + " =");
      setResult(value.toString());
      setCurrentExpr(value.toString());
    } catch {
      setResult("Error");
      setCurrentExpr("");
    }
  };

  const renderButtons = () => (
    <>
      <View style={styles.calcButtonRow}>
        <CalcButton title="%" action={onPercentPress} />
        <CalcButton title="CE" action={onClearEntry} />
        <CalcButton title="C" action={onClear} />
        <CalcButton title={"\u232B"} action={onBackspace} />
        <CalcButton title="MC" action={() => onMemoryPress("MC")} />
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"¹/x"} action={() => onSpecialPress("inverse")} />
        <CalcButton title={"x²"} action={() => onSpecialPress("square")} />
        <CalcButton title={"√x"} action={() => onSpecialPress("sqrt")} />
        <CalcButton title={"÷"} action={() => onOperatorPress("÷")} />
        <CalcButton title="MR" action={() => onMemoryPress("MR")} />
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title="7" type="digit" action={() => onDigitPress("7")} />
        <CalcButton title="8" type="digit" action={() => onDigitPress("8")} />
        <CalcButton title="9" type="digit" action={() => onDigitPress("9")} />
        <CalcButton title={"×"} action={() => onOperatorPress("×")} />
        <CalcButton title="M+" action={() => onMemoryPress("M+")} />
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title="4" type="digit" action={() => onDigitPress("4")} />
        <CalcButton title="5" type="digit" action={() => onDigitPress("5")} />
        <CalcButton title="6" type="digit" action={() => onDigitPress("6")} />
        <CalcButton title={"−"} action={() => onOperatorPress("-")} />
        <CalcButton title="M-" action={() => onMemoryPress("M-")} />
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title="1" type="digit" action={() => onDigitPress("1")} />
        <CalcButton title="2" type="digit" action={() => onDigitPress("2")} />
        <CalcButton title="3" type="digit" action={() => onDigitPress("3")} />
        <CalcButton title={"+"} action={() => onOperatorPress("+")} />
        <CalcButton title="MS" action={() => onMemoryPress("MS")} />
      </View>

      <View style={styles.calcButtonRow}>
        <CalcButton title={"±"} type="digit" action={onPmPress} />
        <CalcButton title="0" type="digit" action={() => onDigitPress("0")} />
        <CalcButton title="." type="digit" action={onDotPress} />
        <CalcButton title={"="} type="equal" action={onEqualPress} />
        <CalcButton title="" invisible action={() => {}} />
      </View>
    </>
  );

  return (
    <View style={isPortrait ? styles.portraitContainer : styles.landscapeContainer}>
      {isPortrait ? (
        <>
          <Text style={styles.title}>Калькулятор</Text>
          <Text style={styles.expression}>{expression}</Text>
          <Text style={styles.result}>{currentExpr || result}</Text>
        </>
      ) : (
        <View style={styles.landscapeDisplay}>
          <View style={{ flex: 2 }}>
            <Text style={styles.title}>Калькулятор</Text>
            <Text style={styles.expression}>{expression}</Text>
          </View>
          <Text style={[styles.result, { flex: 3 }]}>{currentExpr || result}</Text>
        </View>
      )}
      {renderButtons()}
    </View>
  );
}

const styles = StyleSheet.create({
  portraitContainer: { 
    flex: 1, 
    backgroundColor: "#202020", 
    padding: 10 },
  landscapeContainer: { 
    flex: 1, 
    backgroundColor: "#202020",
    padding: 10 },
  landscapeDisplay: { 
    flexDirection: "row", 
    justifyContent: "center",
    marginBottom: 10 },
  title: { 
    color: "#fff", 
    fontSize: 20, 
    margin: 5 },
  expression: { 
    color: "#A6A6A6", 
    textAlign: "right", 
    margin: 5 },
  result: { 
    color: "#fff", 
    fontSize: 30, 
    fontWeight: "700", 
    textAlign: "right", 
    margin: 5 },
  calcButtonRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    flex: 1, 
    paddingHorizontal: 3 },
});