import { useState } from 'react'

import {
  BaseResponseAreaProps,
  BaseResponseAreaWizardProps,
} from '../base-props.type'
import { ResponseAreaTub } from '../response-area-tub'

import { PseudocodeInput } from './Pseudocode.component'
import { PseudocodeWizard } from './PseudocodeWizard.component'
import {
  StudentResponse,
  StudentResponseSchema,
  ExpectedAnswer,
  ExpectedAnswerSchema,
} from './types/input'
import { EvaluationResult } from './types/output'
import {
  defaultExpectedAnswer,
  defaultStudentResponse,
} from './utils/consts'

export class PseudocodeResponseAreaTub extends ResponseAreaTub {
  public readonly responseType = 'PSEUDOCODE'
  public readonly displayWideInput = true

  /* -------------------- Schemas -------------------- */

  // note to whoever wants to change this
  // since the lambda feedback sandbox stores the answer and run extractAnswer by default
  // when you change the schema there is a chance that the stored answer cannot be parsed, so you see the whole page errors
  // solution: change this to z.any() temporary, change the stored answer and change this back
  protected answerSchema = StudentResponseSchema
  protected answer: ExpectedAnswer = defaultExpectedAnswer

  /* -------------------- Internal State -------------------- */

  public readonly delegateFeedback = false
  public readonly delegateLivePreview = true

  /* -------------------- Init -------------------- */

  initWithConfig = (config: any) => {
    let raw = config?.answer

    // 🔥 Because Wizard stringifies, we must parse here
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw)
      } catch {
        raw = null
      }
    }

    const parsed = ExpectedAnswerSchema.safeParse(raw)

    this.answer = parsed.success
      ? parsed.data
      : defaultExpectedAnswer
  }

  /* =====================================================
   * Student Input
   * ===================================================== */

  public InputComponent = (
    props: BaseResponseAreaProps,
  ): JSX.Element => {
    const parsed = this.answerSchema.safeParse(props.answer)

    const validAnswer = parsed.success
      ? parsed.data
      : defaultStudentResponse
      
    const submittedFeedback: EvaluationResult | null =
      props.feedback &&
      'feedback' in props.feedback &&
      props.feedback.feedback
        ? JSON.parse(
            (props.feedback.feedback as string).split('<br />')[1] ?? '{}'
          )
        : null;

    return (
      <PseudocodeInput
        {...props}
        answer={validAnswer}
        feedback={submittedFeedback}
        handleChange={(val: StudentResponse) => {
          props.handleChange(val)
        }}
      />
    )
  }

  /* =====================================================
   * Wizard / Teacher Input
   * ===================================================== */

  public WizardComponent = (props: BaseResponseAreaWizardProps): JSX.Element => {
    const [localAnswer, setLocalAnswer] = useState(this.answer)

    return (
      <PseudocodeWizard
        answer={localAnswer}
        handleChange={(val) => {
          setLocalAnswer(val)
          this.answer = val
          props.handleChange({
            responseType: this.responseType,
            answer: JSON.stringify(val),
          })
        }}
      />
    )
  }

}
