import React, { FC } from "react"



interface Props {
    fields: (FieldText | FieldMultiline)[]

}

export const FormAssistant: FC<Props> = ({

}) => {

    return <div>you are on form  builder </div>
}



interface Field {

    name: string
}


interface FieldText extends Field {
    type?: "Text"
}

interface FieldMultiline extends Field {
    type: "Multiline"
    lines?: number
}

