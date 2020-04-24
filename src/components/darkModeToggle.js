import React from "react"
import styled, { css } from "styled-components"
import { useTheme } from "../hooks"

function DarkModeToggle() {
  const [theme, toggleTheme] = useTheme()
  return (
    <Toggle darkMode={theme === "dark"} onClick={() => toggleTheme()}>
      <Icon darkMode={theme === "dark"} />
    </Toggle>
  )
}

export { DarkModeToggle }

// Component Styles
const Toggle = styled.button`
  position: relative;
  align-items: center;
  background-color: transparent;
  border: 0;
  border-radius: 5px;
  display: inline-flex;
  cursor: pointer;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  width: 40px;
  height: 40px;
  transform: scale(0.8);
  outline: 0;
  padding: 0;
  margin: 0;
`

const darkModeStyles = () => css`
  background-color: ${props => props.theme.white};
  transform: scale(0.55);
  overflow: visible;

  &:before {
    background-color: ${props => props.theme.secondary};
    opacity: 0;
    transform: translate(14px, -14px);
    border-image: initial;
    transition: transform 0.45s ease 0s;
  }

  &:after {
    box-shadow: rgb(255, 255, 255) 0px -23px 0px,
      rgb(255, 255, 255) 0px 23px 0px, rgb(255, 255, 255) 23px 0px 0px,
      rgb(255, 255, 255) -23px 0px 0px, rgb(255, 255, 255) 15px 15px 0px,
      rgb(255, 255, 255) -15px 15px 0px, rgb(255, 255, 255) 15px -15px 0px,
      rgb(255, 255, 255) -15px -15px 0px;
    transform: scale(1);
    transition: all 0.35s ease 0s;
  }
`

const lightModeStyles = () => css`
  background-color: ${props => props.theme.secondary};
  overflow: hidden;
  transform: scale(1);

  &:before {
    background-color: ${props => props.theme.white};
    border-color: ${props => props.theme.white};
    opacity: 1;
    transform: translate(0, 0);
    transition: transform 0.45s ease;
  }

  &:after {
    box-shadow: 0 -23px 0 #1a202c, 0 23px 0 #1a202c, 23px 0 0 #1a202c,
      -23px 0 0 #1a202c, 15px 15px 0 #1a202c, -15px 15px 0 #1a202c,
      15px -15px 0 #1a202c, -15px -15px 0 #1a202c;
    transform: scale(0);
    transition: all 0.35s ease;
  }
`

const Icon = styled.div`
  position: relative;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  transition: all 0.45s ease 0s;

  &:before {
    content: "";
    border: 2px solid;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    position: absolute;
    right: -12px;
    top: -12px;
  }

  &:after {
    content: "";
    width: 8px;
    height: 8px;
    left: 50%;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    margin: -4px 0px 0px -4px;
  }

  ${props => props.darkMode && darkModeStyles(props)};
  ${props => !props.darkMode && lightModeStyles(props)};
`
