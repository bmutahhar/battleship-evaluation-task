import React, {
  Dispatch,
} from "react-transition-group/node_modules/@types/react";

export interface AlertConfig {
  open: boolean;
  message: string;
  color: string;
}

export interface UserData {
  _id: string | any;
  username: string;
  email: string;
}

export interface UserDisplayData {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

export interface AdminData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export type Layout = string[];

export interface Coordinates {
  x: number;
  y: number;
}

export interface ShipAttributes {
  name?: string;
  length?: number;
  placed?: boolean | null;
  orientation?: string | null;
  position?: Coordinates | null;
  sunk?: boolean | null;
  type?: string | null;
}

export interface ShipProps {
  cells: number;
}

export interface HarborProps {
  availableShips: ShipAttributes[];
  currentSelectedShip: ShipAttributes | null;
  selectShip: (index: number) => void;
}

export interface PlayerBoardProps {
  placeShipOnBoard: (currentSelectedShip: ShipAttributes) => void;
  shipsOnBoard: ShipAttributes[];
  rotateShip: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  currentSelectedShip: ShipAttributes | null;
  setCurrentSelectedShip: Dispatch<React.SetStateAction<ShipAttributes | null>>;
  hitsByComputer: ShipAttributes[];
}

export interface OpponentBoardProps {
  computerShips: ShipAttributes[];
  setComputerShips: Dispatch<React.SetStateAction<ShipAttributes[]>>;
  currentState: string;
  hitsByPlayer: ShipAttributes[];
  setHitsByPlayer: Dispatch<React.SetStateAction<ShipAttributes[]>>;
  handleComputerTurn: () => void;
  // checkIfGameOver: () => boolean;
  gameOver: boolean;
}

export interface GameOverProps {
  winner: string;
  startAgain: () => void;
  quitGame: () => void;
}

export interface GameLayoutProps
  extends HarborProps,
    PlayerBoardProps,
    OpponentBoardProps,
    GameOverProps {
  startTurn: () => void;
  changeTurn: () => void;
  setHitsByComputer: Dispatch<React.SetStateAction<ShipAttributes[]>>;
  message: string;
}

export interface PlayerInfo {
  playerId: number | null;
  connected: boolean | null;
  state: string | null;
}
