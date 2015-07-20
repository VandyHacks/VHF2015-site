var React = require('react');

var FAQQuestion = React.createClass({

  propTypes: {
    answer: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    question: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      answerVisible: false,
    };
  },

  _onClick(e) {
    this.setState({
      answerVisible: !this.state.answerVisible,
    });
  },

  render() {
    var {answer, index, question} = this.props;
    var {answerVisible} = this.state;

    return (
      <div>
        <div data-toggle="collapse" data-target={`#faq-${index}-answer`} className="faq-collapse-header" onClick={this._onClick}>
          <h4 className="faq-question">
            {question}
            {answerVisible ?
              <i className="fa fa-angle-right gold faq-arrow hidden-sm hidden-md hidden-lg" ></i> :
              <i className="fa fa-angle-down gold faq-arrow hidden-sm hidden-md hidden-lg" ></i>
            }
          </h4>
        </div>

        <div className="visible-xs">
          <p className="faq-answer collapse" id={`faq-${index}-answer`}>{answer}</p>
        </div>

        <div className="hidden-xs">
          <p className="faq-answer">{answer}</p>
        </div>
      </div>
    );
  }
});

module.exports = FAQQuestion;
