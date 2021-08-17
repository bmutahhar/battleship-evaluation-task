import React from "react";
import Typography from "@material-ui/core/Typography";
import { HarborContainer, HarborArea, Ship } from "./index";
import { HarborProps, ShipAttributes } from "../../models";

const Harbor: React.FC<HarborProps> = (props) => {
  return (
    <HarborContainer>
      <div>
        <Typography variant="body2" align="center" gutterBottom>
          Click on the ship to select, <br /> then place it on the board. <br />{" "}
          Right click to rotate it. <br />
          After placing the ships, <br /> click join room.
        </Typography>
      </div>

      <HarborArea>
        {props.availableShips.map((item: ShipAttributes, index: number) => {
          return (
            <Ship
              key={item.name}
              className={
                props.currentSelectedShip &&
                props.currentSelectedShip.name === item.name
                  ? "active-ship"
                  : ""
              }
              cells={item.length!}
              onClick={() => props.selectShip(index)}
            >
              <span>{item.name}</span>
              <span>{item.length}</span>
            </Ship>
          );
        })}
      </HarborArea>
    </HarborContainer>
  );
};

export default Harbor;
