import React, { useState } from 'react';
import { Box } from 'grommet';
import Draggable from 'react-draggable';

function MovingBox() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
  
    const handleDrag = (e, data) => {
      setPosition({ x: data.x, y: data.y });
    };

    return (
        <Draggable onDrag={handleDrag}>
          <Box
            background="light-4"
            border
            round="small"
            pad="small"
            style={{ position: 'absolute', top: position.y, left: position.x }}
          >
            Drag me around
          </Box>
        </Draggable>
      );
}

export default MovingBox;