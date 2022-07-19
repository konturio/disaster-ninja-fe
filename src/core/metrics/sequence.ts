interface SequenceStep {
  eventName: string | RegExp;
  handler?: (ctx: Record<string, any>, payload: any) => void | true; // id step return true - sequence stop
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

  on(eventName: string | RegExp, handler?: SequenceStep['handler']) {
    this.steps.push({ eventName, handler });
    return this;
  }

  update(eventName: string, eventPayload: unknown) {
    if (this.sequenceEnded) return;
    const step = this.steps[this.nextStepIndex];
    if (!step) return;
    if (
      typeof step.eventName === 'string'
        ? step.eventName === eventName
        : step.eventName.test(eventName)
    ) {
      this.nextStepIndex++;
      if (step.handler) {
        const isFinal = step.handler(this.context, eventPayload);
        if (isFinal === true) this.sequenceEnded = true;
      }
    }
  }
}
