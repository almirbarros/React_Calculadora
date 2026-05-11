import styled from "styled-components";

export const ButtonContainer = styled.button`
  /* Garante que o padding e a border não aumentem o tamanho total do botão */
  box-sizing: border-box;

  padding: 20px;
  margin: 2px; /* Espaço entre botões */
  border: none;
  border-radius: 8px;

  /* Cores (Mantenha sua lógica de cores aqui) */
  background-color: ${(props) => {
    if (["c", "⌫"].includes(props.label)) return "#e84545";
    if (["+/-", "%", "."].includes(props.label)) return "#4e5d6c";
    if (["x", "/", "-", "+"].includes(props.label)) return "#ff9f0a";
    if (props.label === "=") return "#007aff";
    return "#313136";
  }};

  color: #ffffff;
  font-size: 22px;
  font-weight: 500;

  /* AJUSTE DO LAYOUT */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 
     Se expandir, ele ocupa o resto. 
     Se não, calculamos 25% menos a margem para caber 4 na linha.
  */
  flex: ${(props) => (props.expand ? "1" : "none")};
  width: ${(props) => (props.expand ? "auto" : "calc(25% - 4px)")};

  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.2);
    cursor: pointer;
  }
`;
