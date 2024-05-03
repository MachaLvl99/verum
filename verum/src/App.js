import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { 
  Accordion,
  Button,  
  Box, 
  Sidebar, 
  Main, 
  Grommet, 
  Grid,
  Card,
  Text,
  TextArea,
  Markdown,
  Paragraph,
  PageHeader,
  AccordionPanel,
  List
} from 'grommet';

import { getResponse, postResponse } from './http/http';
import { construct, sanitize } from './components/auto-builder/auto-builder';

function App() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('Function outputs & exported code goes here');
  const [itemInfo, setItemInfo] = useState([]);

  //This function adds a new grommet component to the list of items
  const addItem = (item) => {
    const newItem = construct(item);
    if (newItem === null) {
      setOutput("Oopsie! It looks like Gemini misfired. Please try again.(returned null value)");
    } else {
      setItems([...items, newItem]);
    }
    //console.log(items);
  };

  //This function removes a grommet component from the list of items
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  //This function clears all grommet components from the screen
  const clearAll = () => {
    setItems([]);
    setOutput('Function outputs & exported code goes here');
  };

  //When there is no grommet component to display, we display this
  const DisplayEmptyState = () => {
    return (
      <Grid
        fill="vertical"
        rows={['flex', 'flex', 'flex']}
        columns={['flex']}
        areas={[
          { name: 'top', start: [0, 0], end: [0, 0] },
          { name: 'mid', start: [0, 1], end: [0, 1] },
          { name: 'bottom', start: [0, 2], end: [0, 2] },
        ]}
      >
      <Box 
        gridArea="mid" 
        align="center" 
        justify="center"
        pad="large"
      >
        <PageHeader
          alignSelf="center"
          title="Welcome to Verum!"
          subtitle="Start prompting Gemini for grommet components to your left. The output will display the function call results. Export will produce the code for the grommet components (unavailable in proof of concept). Gemini may not always return the correct component, but being specific helps!"
      />
      </Box>
      </Grid>
    );
  };

  //Displays all the active grommet components in the sidebar
  const DisplayItems = (items) => {
    return items.map((item) => {
      return (
        <AccordionPanel label={item.type.displayName}>
          <Box>
            <List
              primaryKey="key"
              secondaryKey="value"
              data={Object.entries(item.props).map((prop) => ({ key: prop[0], value: prop[1] }))}
            />
          </Box>
        </AccordionPanel>
      );
    });
  };

  //Sends the prompt to Gemini
  const sendPrompt = async () => {
    const pkg = {
      type: "prompt",
      value: value
    };
    const response = await postResponse(JSON.stringify(pkg));
    addItem(response);
    setOutput(sanitize(response));
    setValue('');
  };

  //Resets the display when something changed
  useEffect(() => {
    setItemInfo(DisplayItems(items));
  }, [items]);

  return (
    <Grommet full>
        <Grid
          fill="vertical"
          rows={['flex']}
          columns={['medium', 'flex']}
          areas={[
            { name: 'sidebar', start: [0, 0], end: [0, 0] },
            { name: 'content', start: [1, 0], end: [1, 0] },
          ]}
        >
          <Sidebar
            gridArea="sidebar" 
            direction = "column"
            background="dark-3"
            width="medium"
            fill="vertical"
            pad="none"
          >
            <Grid
              fill="vertical"  // Ensure the grid fills the sidebar vertically
              rows={['flex', 'flex']}  // Equal height rows
              columns={['flex']}  // One column that takes full width
              areas={[
                { name: 'components', start: [0, 0], end: [0, 0] },
                { name: 'chat', start: [0, 1], end: [0, 1] },
              ]}
            >
              <Box 
                gridArea="components" 
                background="#ffcc66"
                pad="small"
              >
                {/* Component information */}
                <Box 
                  pad="none"
                >
                  <Grid
                    fill="vertical"
                    rows={['flex']}
                    columns={['flex', 'flex', 'flex']}
                    areas={[
                      { name: 'title', start: [0, 0], end: [0, 0] },
                      { name: 'exportButton', start: [1, 0], end: [1, 0] },
                      { name: 'clearButton', start: [2, 0], end: [2, 0] },
                    ]}
                  >
                    <Box gridArea="title">
                      Components
                    </Box>
                    <Button 
                      gridArea="clearButton" 
                      label="Clear" 
                      onClick={clearAll} 
                      fill="horizontal"
                      overflow="auto" 
                      pad="none"
                    />
                    <Button 
                      gridArea="exportButton" 
                      label="Export" 
                      onClick={() => {}} 
                      fill="horizontal"
                      overflow="auto" 
                      pad="none"
                    />
                  </Grid>
                  
                </Box>
                <Accordion >
                  {itemInfo}
                </Accordion>
              </Box>
              <Box 
                gridArea="chat" 
                background="#c38e22"
                pad="small"
              >
                <Grid 
                  fill="vertical"
                  rows={['flex', 'flex']}
                  columns={['flex']}
                  areas={[
                    { name: 'output', start: [0, 0], end: [0, 0] },
                    { name: 'input', start: [0, 1], end: [0, 1] },
                  ]}
                >
                  <Box 
                    gridArea="output" 
                    pad="none"
                  >
                    <Card 
                      background="#ffeecc"
                      overflow="scroll"
                      pad="small"
                      fill="vertical"
                    >
                      <Markdown>
                        {"```" + output + "```"}
                      </Markdown>
                    </Card>
                  </Box>
                  <Box 
                    gridArea="input" 
                    pad="none"
                  >
                    <Card 
                      background="#806f4d"
                      overflow="scroll"
                      pad="small"
                      fill="vertical"
                    >
                      <TextArea
                        placeholder="Prompt with Gemini"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        fill="vertical"
                      />
                      <Button 
                        label="Send" 
                        onClick={sendPrompt} 
                        fill="horizontal"
                        overflow="auto" 
                        pad="small"
                      />
                    </Card>
                  </Box>
                </Grid>
              </Box>
            </Grid>
          </Sidebar>
          <Main
            gridArea="content"
            background="#ffeecc"
            pad="none"
          >
            {/* Content space user can manipulate */}
            {items.length >0 ? items : <DisplayEmptyState />}
          </Main>
        </Grid>
    </Grommet>
  );
}

export default App;
