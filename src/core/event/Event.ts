export class Event {
  atom: CurrentEventAtom;
  constructor({ focusedGeometry }) {
    this.atom = createCurrentEventAtom;
  }
}
