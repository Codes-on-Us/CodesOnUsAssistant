import React from "react";
import { test } from "@jest/globals"
import { render } from "@testing-library/react"
import { FormAssistant } from './index'

test("testing button component", () => {

	render(<FormAssistant fields={[
		{
			name: "test",
			type: "Text",
		},
		{
			name: "test",
			type: "Multiline",
			lines: 2
		},
		{
			name: "dfdf"
		}
	]} />)
})
