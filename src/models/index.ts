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

export interface ShipCellProps {
  cells: number;
}

export interface ShipAttributes {
  name: string;
  length: number;
  placed: boolean | null;
  orientation?: string | null;
  position?: string | null;
}

export interface HarborProps {
  availableShips: ShipAttributes[];
}

export interface GameLayoutProps {
  availableShips: ShipAttributes[];
}
