import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #cacaca;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  background-color: #ffffff;
  width: 50%;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const HistoryContainer = styled.div`
  margin-top: 15px;
  color: #777;
  font-size: 12px;
  width: 100%;
`;

export const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;

  span {
    font-weight: bold;
  }

  button {
    background: none;
    border: none;
    color: #ff4d4d;
    cursor: pointer;
    font-size: 11px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const HistoryItem = styled.div`
  border-bottom: 1px solid #333;
  padding: 4px 0;
  text-align: left;
`;
