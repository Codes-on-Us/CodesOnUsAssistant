import React from "react";
import { test } from "@jest/globals"
import { render } from "@testing-library/react"
import { AssistantProvicer, Button, FormAssistant } from './index'


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

test("AssistantProvicer", () => {
	render(<AssistantProvicer>
		<div>test</div>
	</AssistantProvicer>)
})

test("button", () => {
	render(<Button size="small" schema="cyan"> test </Button>)
})




