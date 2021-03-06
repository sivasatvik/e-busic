import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import FileReaderInput from "react-file-reader-input";
import { Reader } from "./modules";
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

const DEMO_URL =
  "https://gerhardsletten.github.io/react-reader/files/alice.epub";
const DEMO_NAME = "Alice in wonderland";

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
      localName: null,
      selectedTrack: "/music/bensound-relaxing.mp3", //TODO: Change selectedTrack logic
      playing: 0
      //TODO largeText: false
    };
    this.audioTune = new Audio("/music/bensound-relaxing.mp3"); //Default Hardcoded
    this.rendition = null;
  }

  componentDidMount() {
    this.audioTune.load();
  }

  componentWillUnmount() {
    this.audioTune.stop();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.playing);
    console.log(this.state.selectedTrack);
    if (this.state.playing !== prevState.playing) {
      if (this.state.playing) {
        this.audioTune.play();
      } else if (!this.state.playing) {
        this.audioTune.pause();
      }
    }
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

  handleMusic = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleCycleMusic = () => {
    this.audioTune.src = this.state.selectedTrack; //TODO: Change selectedTrack logic
    this.audioTune.load();
    if (this.state.playing) {
      this.audioTune.play();
    }
  };

  // Render function
  render() {
    const { fullscreen, location, localFile, localName } = this.state;
    return (
      <Container>
        <GlobalStyle />
        <ToolBar>
          <ButtonWrapper>
            <FileReaderInput as="buffer" onChange={this.handleFileChange}>
              <GenericButton> Upload file </GenericButton>
            </FileReaderInput>
          </ButtonWrapper>
          <ButtonWrapper>
            <GenericButton onClick={this.handleMusic}>
              {" "}
              {this.state.playing ? "Pause" : "Play"} music{" "}
            </GenericButton>
            {/* <audio ref={ref => (this.player = ref)} /> */}
          </ButtonWrapper>
          <ButtonWrapper>
            <GenericButton onClick={this.handleCycleMusic}>
              {" "}
              Cycle music{" "}
            </GenericButton>
            {/* <audio ref={ref => (this.player = ref)} /> */}
          </ButtonWrapper>
        </ToolBar>
        <ReaderContainer fullscreen={fullscreen}>
          <Reader
            url={localFile || DEMO_URL}
            title={localName || DEMO_NAME}
            location={location}
            locationChanged={this.onLocationChanged}
            getRendition={this.getRendition}
          />
        </ReaderContainer>
      </Container>
    );
  }
}

export default App;
