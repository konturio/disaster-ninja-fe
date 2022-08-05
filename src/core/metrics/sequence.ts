type Decision = {
  continueSq?: boolean;
  breakSq?: boolean;
};

interface SequenceStep {
  eventName: string | RegExp;
  /**
   * Sometimes you need check payload for understand is that event that you looking for.
   * return { continueSq: false } from the handler, for repeat this step on next event
   * or { breakSq: true } for end sequence
   * */
  handler?: (ctx: Record<string, any>, payload: any) => void | Decision;
}

export class Sequence {
  private steps: SequenceStep[] = [];
  private context: Record<string, any> = {};
  private nextStepIndex = 0;
  sequenceEnded = false;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  get activeStep() {
    return this.steps[this.nextStepIndex];
  }

  on(eventName: string | RegExp, handler?: SequenceStep['handler']) {
    this.steps.push({ eventName, handler });
    return this;
  }

  update(eventName: string, eventPayload: unknown) {
    if (this.sequenceEnded) return;
    const step = this.activeStep;
    if (!step) return;
    if (
      typeof step.eventName === 'string'
        ? step.eventName === eventName
        : step.eventName.test(eventName)
    ) {
      if (step.handler) {
        const { continueSq = true, breakSq = false } =
          step.handler(this.context, eventPayload) ?? {};
        if (breakSq === true) this.sequenceEnded = true;
        if (continueSq === true) this.nextStepIndex++;
      } else {
        this.nextStepIndex++;
      }
      const isLastStep = this.steps[this.nextStepIndex] === undefined;
      if (isLastStep) this.sequenceEnded = true;
    }
  }
}
