import styled from "styled-components";
import { ShipCellProps } from "../../models";

const cellWidth = 36.66;
const cellHeight = 36.11;

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f7f7f7;
`;

export const Header = styled.header`
  width: 100%;
  height: 10vh;
  max-height: 10%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const MsgContainer = styled.div`
  flex-grow: 1;
`;

export const GameContainer = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-around; */
`;

export const GridRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

export const GridContainer = styled.div`
  width: 60vh;
  height: 60vh;
  margin: 1rem 2rem;
  display: grid;
  grid-template-columns: 0.1fr 1.9fr;
  grid-template-rows: 0.1fr 1.9fr;
  gap: 0px 0px;
  grid-template-areas:
    ". row"
    "column game-grid";

  .row {
    grid-area: row;
  }
  .column {
    grid-area: column;
  }
  .game-grid {
    grid-area: game-grid;
  }
`;

export const GridHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RowHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`;

export const HeaderCell = styled.div`
  width: 10%;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Cell = styled.div`
  width: 10%;
  height: 10%;
  border: 1px solid rgba(86, 104, 209, 0.5);
  margin-left: -1px;
  margin-top: -1px;
`;
export const HarborContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const HarborArea = styled.div`
  width: 30vh;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Ship = styled.div<ShipCellProps>`
  width: 180px;
  height: 40px;
  background-color: #11183f;
  text-transform: capitalize;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin: 0.75rem;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
`;
