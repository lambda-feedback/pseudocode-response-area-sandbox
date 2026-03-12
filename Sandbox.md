This is just a document for the sandbox, in case anyone happened to bump across this

# Main Structure
## yarn
yes this use yarn and vite, dont attempt to use other npm, pnpm, vue, angular, next, or what ever it is

## Tub
The response area is essentially a tub class, (see .\src\types\response-area-tub.ts for the detailed documentation)

E.g (src\types\NumberInput\index.ts)

```ts
import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { NumberInput } from './NumberInput.component'
import { numberResponseAnswerSchema } from './NumberInput.schema'

export class NumberResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'NUMBER'

  public readonly delegateErrorMessage = false

  protected answerSchema = numberResponseAnswerSchema

  protected answer?: number | null

  InputComponent = (props: BaseResponseAreaProps) => {
    const parsedAnswer = this.answerSchema.safeParse(props.answer)
    return NumberInput({
      ...props,
      answer: parsedAnswer.success ? parsedAnswer.data : undefined,
    })
  }

  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    return NumberInput({
      ...props,
      handleChange: answer => {
        props.handleChange({
          responseType: this.responseType,
          answer,
        })
      },
      answer: this.answer,
    })
  }
}
```

### required

typescript wont give you an error if you do not extend the methods, however, just in case please follow this

1. Think of a name for you sandbox response area (you dont want to name to just be sandbox until the very end), we'll use XXX as an example
2. open a folder in ./src/types with the name XXX (follow the conventions, the folder name and file name be camel case, and organise your files in a similar manner)
3. in the ./src/types/XXX/index.ts, do

```ts
export class XXXResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'XXX'
  protected answerSchema = ____ // some zod schema as you define

  protected answer?: number | null // the current reference answer
  InputComponent = (props: BaseResponseAreaProps) => {
    // as you define
  }
  WizardComponent = (props: BaseResponseAreaWizardProps) => {
    // as you define
  }
}
```

4. in the ./src/types/index.ts register you response area (this step is also here to make sure the name dont coincide)
5. (Should be altering the Sandbox folder, but what I've dont is) change .\src\sandbox-component.tsx to 

```ts
class WrappedSandboxResponseAreaTub extends XXXResponseAreaTub
```

### Evaluation:

so we should do two things

1. pass the answer to Input
2. pass the answer and allow change by prop.handleChange (see examples in the folder)

additionaly, use zod schemas to make sure the answer and submission is valid (at your choice), but notice that the answer need to follow IModularResponseSchema['answer'] (yep there is discrepencies here since the props ask for this, and the Tub class defines this to be any type)

### Preview
We havent run this through, but see src\usePreviewSubmission.ts

### FAQ
1. The response area says unable to extract answer
if refreshing dont work, then consider opening a new response area or temp set the answer schemas to z.any() then change it back

2. component shows Void
refresh 2-3 times, if not working, see if you run yarn dev