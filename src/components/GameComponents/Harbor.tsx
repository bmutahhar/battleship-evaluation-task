import React from "react";
import Typography from "@material-ui/core/Typography";
import { HarborContainer, HarborArea, Ship } from "./index";
import { HarborProps, ShipAttributes } from "../../models";

const Harbor: React.FC<HarborProps> = (props) => {
  return (
    <HarborContainer>
      <div>
        <Typography variant="body2" align="center" gutterBottom>
          Drag the ships to the grid <br /> and click to rotate then
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
