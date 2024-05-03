import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as grommet from 'grommet';

/* Since there was only time to implement the construct function, the following code is commented out
export const func_determiner = (func_call) => {
    const clean = sanitize(func_call);
    const jsonObject = JSON.parse(clean);
    const func_name = jsonObject.candidates[0].content.parts[0].functionCall.name;
    if (func_name === 'AddItem') {
        return construct(func_call);
    } else if (func_name === 'ModifyItem') {
        return modify(func_call);
    } else{
        return null;
    }
}
*/

//This builds a new grommet component based on the given schema
export const construct = (func_call) => {
    const newKey = uuidv4();
    const clean = sanitize(func_call);
    const jsonObject = JSON.parse(clean);
    const compName = jsonObject.candidates[0].content.parts[0].functionCall.args.component;
    const grommetComp = grommet[compName];
    if (!grommetComp) {
        console.error('Invalid component:', compName);
        return null;  // Or handle this case as you see fit
    }

    const props = { 
        key: newKey, 
        id: newKey, 
        ...jsonObject.candidates[0].content.parts[0].functionCall.args.props
    };
    const newObject = React.createElement(
        grommetComp,
        props
    );
    //console.log(newObject);
    return newObject;
};

/* Ran out of time to implement this function
export const modify = (func_call) => {
    const clean = sanitize(func_call);
    const jsonObject = JSON.parse(clean);
    const id = jsonObject.candidates[0].content.parts[0].functionCall.args.id;
    const props = jsonObject.candidates[0].content.parts[0].functionCall.args.props;
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
        items[index].props = props;
        setItems([...items]);
    }
}; */

export const sanitize = (json_data) => {
    const sanitized = json_data
        .trim()
        .replace(/^"+|"+$/g, '')
        .replace(/\\n/g, "")
        .replace(/\\"/g, '"')
        .replace(/>\s+/g, "")
        .replace(/,\s*$/, "");
    return sanitized;
};
  
  