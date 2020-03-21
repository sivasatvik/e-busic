import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import FileReaderInput from "react-file-reader-input";
//import { ReactReader } from "./modules";
import {
  Container,
  ReaderContainer,
  ToolBar,
  LogoWrapper,
  Logo,
  ButtonWrapper,
  GenericButton
} from "./Components";

const storage = global.localStorage || null;

// Creating a Global default view style
const GlobalStyle = createGlobalStyle`
    * {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        margin: 0;
        padding: 0;
        color: inherit;
        font-size: inherit;
        font-weight: 300;
        line-height: 1.4;
        word-break: break-word;
    }
    html {
        font-size: 62.5%;
    }
    body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        font-size: 1.8rem;
        background: #333;
        position: absolute;
        height: 100%;
        width: 100%;
        color: #fff;
    }
`;

// Actual App code
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false,
      location:
        storage && storage.getItem("epub-location")
          ? storage.getItem("epub-location")
          : 2,
      localFile: null,
      localName: null
      //TODO largeText: false
    };
    this.rendition = null;
  }

  // Function to toggle full screen
  toggleFullScreen = () => {
    this.setState(
      {
        fullscreen: !this.state.fullscreen
      },
      () => {
        setTimeout(() => {
          const e = document.createEvent("UIEvents");
          e.initUIEvent("resize", true, false, global, 0);
        }, 1000);
      }
    );
  };

  // Function to update location of the epub file
  onLocationChanged = location => {
    this.setState(
      {
        location
      },
      () => {
        storage && storage.setItem("epub-location", location);
      }
    );
  };

  getRendition = rendition => {
    this.rendition = rendition;
    rendition.themes.fontSize("100%");
  };

  // Function to handle file upload by user
  handleFileChange = (event, results) => {
    if (results.length > 0) {
      const [e, file] = results[0];
      if (file.type !== "application/epub+zip") {
        return alert("File type not supported");
      }
      this.setState({
        localFile: e.target.result,
        localName: file.name,
        location: null
      });
    }
  };

  // Render function
  render() {
    const { fullscreen, location, localFile, localName } = this.state;
    return (
      <Container>
        <GlobalStyle />
        <ToolBar>
          <LogoWrapper>
            <Logo />
          </LogoWrapper>
          <ButtonWrapper>
            <FileReaderInput as="buffer" onChange={this.handleFileChange}>
              <GenericButton> Upload file </GenericButton>
            </FileReaderInput>
            <GenericButton onClick={this.toggleFullScreen}>
              Full Screen
            </GenericButton>
          </ButtonWrapper>
        </ToolBar>
        <ReaderContainer fullscreen={fullscreen}>
          <h1> Book starts here </h1>
        </ReaderContainer>
      </Container>
    );
  }
}

export default App;
