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
  const [currentNumber, setCurrentNumber] = useState("0"); // Número atual exibido
  const [expression, setExpression] = useState(""); // Expressão completa que o usuário está construindo
  const [history, setHistory] = useState([]); // Histórico das últimas contas realizadas
  const [isFinished, setIsFinished] = useState(false); // Indica se a conta atual foi finalizada (apertou "="), para reiniciar a expressão ao começar uma nova conta

  // Definição das operações ---
  const operations = {
    "+": (n1, n2) => n1 + n2,
    "-": (n1, n2) => n1 - n2,
    x: (n1, n2) => n1 * n2,
    "/": (n1, n2) => (n2 !== 0 ? n1 / n2 : "Erro"),
  };

  // Limpa a expressão atual e o número, mas mantém o histórico de contas
  const handleOnClear = () => {
    setCurrentNumber("0");
    setExpression("");
    setIsFinished(false);
  };

  // Limpa o histórico de contas
  const clearHistory = () => setHistory([]);

  // Adiciona um número ou ponto à expressão, mas evita colocar dois pontos seguidos e reinicia a expressão se a conta anterior terminou
  const handleAddNumber = (num) => {
    if (isFinished) {
      setCurrentNumber(num);
      setExpression(num);
      setIsFinished(false);
      return;
    }
    // Evita colocar dois pontos seguidos no número atual
    if (num === "." && currentNumber.includes(".")) return;

    // Se o número atual for "0", substitui pelo novo número, caso contrário, concatena
    setCurrentNumber((prev) => (prev === "0" ? num : prev + num));
    // Atualiza a expressão de acordo, mas se a expressão estiver vazia, começa com o número atual
    setExpression((prev) => (prev === "0" ? num : prev + num));
  };

  // Define a operação atual, mas evita colocar dois operadores seguidos e reinicia a expressão se a conta anterior terminou
  const handleSetOperation = (op) => {
    if (isFinished) {
      setIsFinished(false);
    }

    // Evita colocar dois operadores seguidos
    const lastChar = expression.trim().slice(-1);
    if (["+", "-", "x", "/"].includes(lastChar)) return;

    // Se a expressão estiver vazia, começa com o número atual seguido do operador
    setExpression((prev) => `${prev || currentNumber} ${op} `);
    // O número atual volta para "0" para o próximo número da conta, mas a expressão mantém o que foi digitado
    setCurrentNumber("0");
  };

  //Inverte o sinal do número atual e atualiza a expressão de acordo
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

  // Apaga o último caractere do número atual e da expressão
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

  // Adiciona o símbolo de porcentagem à expressão, mas o número atual não muda
  const handlePercent = () => {
    // Impede colocar % se não houver um número antes
    const lastChar = expression.trim().slice(-1);
    if (!expression || ["+", "-", "x", "/", "%"].includes(lastChar)) return;

    setExpression((prev) => prev + "%");
    // O currentNumber não muda, mas a expressão ganha o símbolo
  };

  // Calcula o resultado da expressão, aplicando a regra de porcentagem
  const handleEquals = () => {
    if (!expression) return;

    try {
      // Tokeniza a expressão, removendo espaços extras
      const tokens = expression.split(" ").filter((t) => t !== "");
      // A expressão deve ter pelo menos um número, um operador e outro número para ser válida
      if (tokens.length < 3) return;

      // O resultado começa com o primeiro número da expressão
      let result = Number(tokens[0]);

      // Percorre os tokens da expressão, aplicando as operações na ordem em que aparecem (sem precedência)
      for (let i = 1; i < tokens.length; i += 2) {
        // O token atual é o operador, e o próximo token é o número seguinte
        const op = tokens[i];
        // O próximo token pode ser um número ou uma porcentagem
        let nextToken = tokens[i + 1];
        // Se o próximo token for uma porcentagem, calcula o valor em cima do resultado atual
        let nextNum;

        // REGRA DA PORCENTAGEM:
        if (nextToken.includes("%")) {
          const percentValue = Number(nextToken.replace("%", ""));
          // Calcula a porcentagem em cima do acumulado (result)
          nextNum = (result * percentValue) / 100;
        } else {
          nextNum = Number(nextToken);
        }

        // Aplica a operação atual entre o resultado acumulado e o próximo número
        if (operations[op]) {
          result = operations[op](result, nextNum);
        }
      }

      // Atualiza o histórico com a expressão completa e o resultado, mantendo apenas os 5 últimos registros
      setHistory((prev) => [`${expression} = ${result}`, ...prev].slice(0, 5));
      // Atualiza o número atual e a expressão para o resultado, e marca a conta como finalizada para reiniciar na próxima entrada
      setCurrentNumber(String(result));
      // Atualiza a expressão para o resultado, mas isso é opcional - poderia deixar a expressão como estava ou mostrar o resultado de outra forma. Aqui escolhi atualizar a expressão para o resultado para facilitar novas operações em cima do resultado.
      setExpression(String(result));
      // Marca a conta como finalizada para que, se o usuário começar a digitar um número, a expressão seja reiniciada, mas se ele clicar em um operador, a expressão continua para permitir encadeamento de operações
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
