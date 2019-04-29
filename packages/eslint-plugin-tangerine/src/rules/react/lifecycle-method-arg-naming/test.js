const outdent = require('outdent');

const ruleTester = require('../../../utils/rule-tester');

const rule = require('../lifecycle-method-arg-naming');

const invalidNameError = (actual, expected) =>
  `Invalid parameter name '${actual}' for react lifecycle method; use '${expected}' instead`;

const reactComponent = componentBody => outdent`
    class Foo extends Component {
        ${outdent(componentBody)}
    }
`;

describe('Rule react/lifecycle-method-arg-naming', () => {
  ruleTester.run('not applicable cases', rule, {
    valid: [
      {
        code: `
                        class NotAComponent {
                            componentDidUpdate(anythingGoes) {
                                this.something(anythingGoes);
                            }
                        }
                    `,
      },
      {
        code: reactComponent`
                        notALifecycleMethod(fancyProps: Props) {
                            this.something(fancyProps);
                        }
                    `,
      },
    ],
    invalid: [],
  });

  ruleTester.run('componentDidUpdate', rule, {
    valid: [
      {
        code: reactComponent`
                        componentDidUpdate() {
                            this.something();
                        }
                    `,
      },
      {
        code: reactComponent`
                        componentDidUpdate(prevProps: Props) {
                            this.something(prevProps);
                        }
                    `,
      },
      {
        code: reactComponent`
                        componentDidUpdate(prevProps: Props, prevState: State) {
                            this.something(prevProps, prevState);
                        }
                    `,
      },
      {
        code: reactComponent`
                        componentDidUpdate(prevProps: Props, prevState: State, snapshot) {
                            this.something(prevProps, prevState);
                        }
                    `,
      },
    ],
    invalid: [
      {
        code: reactComponent`
                        componentDidUpdate(nextProps: Props) {
                            this.something(nextProps);
                        }
                    `,
        errors: [invalidNameError('nextProps', 'prevProps')],
        output: reactComponent`
                        componentDidUpdate(prevProps: Props) {
                            this.something(prevProps);
                        }
                    `,
      },
      {
        code: reactComponent`
                        componentDidUpdate(prevProps: Props, prevState: State, snooopdog: Snapshot) {
                            this.something(snooopdog);
                        }
                    `,
        errors: [invalidNameError('snooopdog', 'snapshot')],
        output: reactComponent`
                        componentDidUpdate(prevProps: Props, prevState: State, snapshot: Snapshot) {
                            this.something(snapshot);
                        }
                    `,
      },
    ],
  });

  ruleTester.run('shouldComponentUpdate', rule, {
    valid: [
      {
        code: reactComponent`
                        shouldComponentUpdate() {
                            this.something();
                        }
                    `,
      },
      {
        code: reactComponent`
                        shouldComponentUpdate(nextProps: Props) {
                            this.something(nextProps);
                        }
                    `,
      },
      {
        code: reactComponent`
                        shouldComponentUpdate(nextProps: Props, nextState: State) {
                            this.something(nextProps, nextState);
                        }
                    `,
      },
    ],
    invalid: [
      {
        code: reactComponent`
                        shouldComponentUpdate(someWackyName: Props) {
                            this.something(someWackyName);
                        }
                    `,
        errors: [invalidNameError('someWackyName', 'nextProps')],
        output: reactComponent`
                        shouldComponentUpdate(nextProps: Props) {
                            this.something(nextProps);
                        }
                    `,
      },
      {
        code: reactComponent`
                        shouldComponentUpdate(nextProps: Props, prevState: State) {
                            this.something(nextProps, prevState);
                        }
                    `,
        errors: [invalidNameError('prevState', 'nextState')],
        output: reactComponent`
                        shouldComponentUpdate(nextProps: Props, nextState: State) {
                            this.something(nextProps, nextState);
                        }
                    `,
      },
    ],
  });

  ruleTester.run('getSnapshotBeforeUpdate', rule, {
    valid: [
      {
        code: reactComponent`
                        getSnapshotBeforeUpdate() {
                            this.something();
                        }
                    `,
      },
      {
        code: reactComponent`
                        getSnapshotBeforeUpdate(prevProps: Props) {
                            this.something(prevProps);
                        }
                    `,
      },
      {
        code: reactComponent`
                        getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
                            this.something(prevProps, prevState);
                        }
                    `,
      },
    ],
    invalid: [
      {
        code: reactComponent`
                        getSnapshotBeforeUpdate(props) {
                            this.something(props);
                        }
                    `,
        errors: [invalidNameError('props', 'prevProps')],
        output: reactComponent`
                        getSnapshotBeforeUpdate(prevProps) {
                            this.something(prevProps);
                        }
                    `,
      },
    ],
  });

  ruleTester.run('Multiple errors', rule, {
    valid: [],
    invalid: [
      {
        code: reactComponent`
                        shouldComponentUpdate(someWackyName, anotherWackyName) {
                            this.something(someWackyName, anotherWackyName);
                        }
                    `,
        errors: [
          invalidNameError('someWackyName', 'nextProps'),
          invalidNameError('anotherWackyName', 'nextState'),
        ],
        // RuleTester only performs one loop of fixing, which results in not all fixes being applied if
        // the code they touch (range) overlaps.
        // In practice, eslint loops multiple times to fix all instances, see the next test for the 'next loop'
        output: reactComponent`
                        shouldComponentUpdate(nextProps, anotherWackyName) {
                            this.something(nextProps, anotherWackyName);
                        }
                    `,
      },
      {
        code: reactComponent`
                        shouldComponentUpdate(nextProps, anotherWackyName) {
                            this.something(nextProps, anotherWackyName);
                        }
                    `,
        errors: [invalidNameError('anotherWackyName', 'nextState')],
        output: reactComponent`
                        shouldComponentUpdate(nextProps, nextState) {
                            this.something(nextProps, nextState);
                        }
                    `,
      },
      {
        code: reactComponent`
                        shouldComponentUpdate(prevProps: Props, nextState: State) {
                            this.something(prevProps, nextState);
                        }
                        componentDidUpdate(p) {
                          this.somethingElse(p);
                        }
                    `,
        errors: [invalidNameError('prevProps', 'nextProps'), invalidNameError('p', 'prevProps')],
        // Both violations are fixed in this test because the fixed code does not overlap
        output: reactComponent`
                        shouldComponentUpdate(nextProps: Props, nextState: State) {
                            this.something(nextProps, nextState);
                        }
                        componentDidUpdate(prevProps) {
                          this.somethingElse(prevProps);
                        }
                    `,
      },
    ],
  });

  ruleTester.run('Identifier fixes', rule, {
    valid: [],
    invalid: [
      {
        code: reactComponent`
                        shouldComponentUpdate(nextProps, anotherWackyName) {
                            this.something(nextProps, anotherWackyName);
                        }

                        render() {
                          const anotherWackyName = 'bar';
                        }
                    `,
        errors: [invalidNameError('anotherWackyName', 'nextState')],
        // Should not touch variables in other scopes
        output: reactComponent`
                        shouldComponentUpdate(nextProps, nextState) {
                            this.something(nextProps, nextState);
                        }

                        render() {
                          const anotherWackyName = 'bar';
                        }
                    `,
      },
    ],
  });
});
