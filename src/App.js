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
      localName: null
      //TODO largeText: false
    };
    this.rendition = null;
    this.spine = null;
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

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  getRendition = rendition => {
    this.rendition = rendition;
    /*this.spine = spine;
    console.log("Here qm");
    console.log(rendition.hooks.content);
    console.log(spine.hooks.content);
    //console.log(spine.get(3).output);
    //console.log(spine.get("chapter_001.xhtml").output);
    rendition.themes.fontSize("100%");

    //Server stuff
    var data1 = spine.get(3);
    console.table(data1);

    var seen = [];
    var data2 = JSON.stringify(spine.get(3), function(key, val) {
      if (val != null && typeof val == "object") {
        if (seen.indexOf(val) >= 0) {
          return;
        }
        seen.push(val);
      }
      return val;
    });
    // var data2 = {
    //   chapter: data1
    // }
    console.log(data2);
    //console.log(data1.document);
    axios({
      method: "post",
      url: "http://localhost:5000/time",
      data: data2,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-type": "application/json"
      }
    })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    // console.log(data);
    // var url = 'http://localhost:5000/time';
    // axios.post(url, data, {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   }
    // })
    // .then(function(response) {
    //   console.log(response);
    // })
    // .catch(function(error) {
    //   console.log(error);
    // })
    // fetch('http://localhost:5000/time').then(res => res.json()).then(data => {
    //   console.log(data);
    // });*/
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
          <ButtonWrapper>
            <FileReaderInput as="buffer" onChange={this.handleFileChange}>
              <GenericButton> Upload file </GenericButton>
            </FileReaderInput>
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
