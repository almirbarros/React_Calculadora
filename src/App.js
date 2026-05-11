import { useState } from "react";
import Input from "./components/Input";
import Button from "./components/Button";
import {
  Container,
  Content,
  Row,
  HistoryContainer,
  HistoryHeader,
  HistoryItem,
} from "./styles";

const App = () => {
  const [currentNumber, setCurrentNumber] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Definição das operações ---
  const operations = {
    "+": (n1, n2) => n1 + n2,
    "-": (n1, n2) => n1 - n2,
    x: (n1, n2) => n1 * n2,
    "/": (n1, n2) => (n2 !== 0 ? n1 / n2 : "Erro"),
  };

  const handleOnClear = () => {
    setCurrentNumber("0");
    setExpression("");
    setIsFinished(false);
  };

  const clearHistory = () => setHistory([]);

  const handleAddNumber = (num) => {
    if (isFinished) {
      setCurrentNumber(num);
      setExpression(num);
      setIsFinished(false);
      return;
    }

    if (num === "." && currentNumber.includes(".")) return;

    setCurrentNumber((prev) => (prev === "0" ? num : prev + num));
    setExpression((prev) => (prev === "0" ? num : prev + num));
  };

  const handleSetOperation = (op) => {
    if (isFinished) {
      setIsFinished(false);
    }

    const lastChar = expression.trim().slice(-1);
    if (["+", "-", "x", "/"].includes(lastChar)) return;

    setExpression((prev) => `${prev || currentNumber} ${op} `);
    setCurrentNumber("0");
  };

  const handleReverseSign = () => {
    setCurrentNumber((prev) => {
      if (prev === "0") return "0";

      // Inverte o sinal do número isolado
      const invertedNumber = prev.startsWith("-") ? prev.slice(1) : `-${prev}`;

      setExpression((prevExpr) => {
        // Se a expressão for igual ao número atual, inverte direto
        if (prevExpr === prev) return invertedNumber;

        // Localiza o último espaço para isolar o último número da conta
        const lastSpaceIndex = prevExpr.trimEnd().lastIndexOf(" ");

        if (lastSpaceIndex === -1) return invertedNumber;

        // Pega tudo que vem antes do último número (ex: "2 + ")
        const prefix = prevExpr.substring(0, lastSpaceIndex + 1);

        return prefix + invertedNumber;
      });

      return invertedNumber;
    });
  };

  const handleBackspace = () => {
    setCurrentNumber((prev) => {
      // Se só tiver um número ou for "0", volta para "0"
      if (prev.length <= 1 || prev === "0") return "0";
      return prev.slice(0, -1);
    });

    setExpression((prev) => {
      if (!prev || prev === "0") return "";

      // Se o último caractere for um espaço (fim de um operador), não apaga
      // Isso evita apagar o operador por engano sem querer
      if (prev.endsWith(" ")) return prev;

      const newValue = prev.slice(0, -1);
      return newValue === "" ? "0" : newValue;
    });
  };

  const handlePercent = () => {
    // Impede colocar % se não houver um número antes
    const lastChar = expression.trim().slice(-1);
    if (!expression || ["+", "-", "x", "/", "%"].includes(lastChar)) return;

    setExpression((prev) => prev + "%");
    // O currentNumber não muda, mas a expressão ganha o símbolo
  };

  const handleEquals = () => {
    if (!expression) return;

    try {
      const tokens = expression.split(" ").filter((t) => t !== "");
      if (tokens.length < 3) return;

      let result = Number(tokens[0]);

      for (let i = 1; i < tokens.length; i += 2) {
        const op = tokens[i];
        let nextToken = tokens[i + 1];
        let nextNum;

        // REGRA DA PORCENTAGEM:
        if (nextToken.includes("%")) {
          const percentValue = Number(nextToken.replace("%", ""));
          // Calcula a porcentagem em cima do acumulado (result)
          nextNum = (result * percentValue) / 100;
        } else {
          nextNum = Number(nextToken);
        }

        if (operations[op]) {
          result = operations[op](result, nextNum);
        }
      }

      setHistory((prev) => [`${expression} = ${result}`, ...prev].slice(0, 5));
      setCurrentNumber(String(result));
      setExpression(String(result));
      setIsFinished(true);
    } catch (error) {
      setCurrentNumber("Erro");
      setExpression("");
    }
  };

  return (
    <Container>
      <Content>
        <Input value={expression || "0"} />

        <Row>
          <Button label="%" onClick={handlePercent} />
          <Button label="c" onClick={handleOnClear} />
          <Button label="⌫" onClick={handleBackspace} />
          <Button label="/" onClick={() => handleSetOperation("/")} />
        </Row>
        <Row>
          <Button label="7" onClick={() => handleAddNumber("7")} />
          <Button label="8" onClick={() => handleAddNumber("8")} />
          <Button label="9" onClick={() => handleAddNumber("9")} />
          <Button label="x" onClick={() => handleSetOperation("x")} />
        </Row>
        <Row>
          <Button label="4" onClick={() => handleAddNumber("4")} />
          <Button label="5" onClick={() => handleAddNumber("5")} />
          <Button label="6" onClick={() => handleAddNumber("6")} />
          <Button label="-" onClick={() => handleSetOperation("-")} />
        </Row>
        <Row>
          <Button label="1" onClick={() => handleAddNumber("1")} />
          <Button label="2" onClick={() => handleAddNumber("2")} />
          <Button label="3" onClick={() => handleAddNumber("3")} />
          <Button label="+" onClick={() => handleSetOperation("+")} />
        </Row>
        <Row>
          <Button label="+/-" onClick={handleReverseSign} />
          <Button label="0" onClick={() => handleAddNumber("0")} />
          <Button label="." onClick={() => handleAddNumber(".")} />
          {/* <Button label="=" onClick={handleEquals} expand /> */}
          <Button label="=" onClick={handleEquals} />
        </Row>
        <HistoryContainer>
          <HistoryHeader>
            <span>Histórico 5 últimos registros</span>
            {history.length > 0 && (
              <button onClick={clearHistory}>Limpar</button>
            )}
          </HistoryHeader>

          {history.map((item, index) => (
            <HistoryItem key={index}>{item}</HistoryItem>
          ))}
        </HistoryContainer>
      </Content>
    </Container>
  );
};

export default App;
