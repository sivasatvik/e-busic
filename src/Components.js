import styled from "styled-components";
import breakpoint from "styled-components-breakpoint";

// Global container
export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #eee 0%, #333 100%);
`;

// Container for the book
export const ReaderContainer = styled.div`
  position: absolute;
  top: ${props => (props.fullscreen ? 0 : 50)}px;
  left: ${props => (props.fullscreen ? 0 : 1)}rem;
  right: ${props => (props.fullscreen ? 0 : 1)}rem;
  bottom: ${props => (props.fullscreen ? 0 : 1)}rem;
  transition: all 0.6s ease;
`;

// Style for ToolBar at the top
export const ToolBar = styled.header`
  position: absolute;
  top: 10px;
  left: 20px;
  right: 20px;

  ${breakpoint("tablet")`
        display: flex;
        align-items: flex-end;
    `};
`;

// Wrapper for button
export const ButtonWrapper = styled.div`
  ${breakpoint("mobile")`
        display: flex;
        justify-content: center;
        align-items: baseline;
        padding-top: 0.5rem;
    `};
`;

// Defining skeleton of a button
const Button = styled.button`
  font-family: inherit;
  font-size: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  appearance: none;
  background: none;
`;

// Creating a generic button
export const GenericButton = styled(Button)`
  color: #666;
  font-size: 12px;
  display: inline-block;
  margin-left: 1rem;
  ${breakpoint("tablet")`
    font-size: 16px;
  `};
`;
