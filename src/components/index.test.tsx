import React from "react";
import { test } from "@jest/globals"
import { render } from "@testing-library/react"
import { FormAssistant } from './index'


test("testing button component", () => {
	render(<FormAssistant />)
})

