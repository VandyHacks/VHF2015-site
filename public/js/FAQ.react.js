var React = require('react');

var FAQ = React.createClass({

  propTypes: {
    questions: React.PropTypes.array.isRequired,
  },

  render() {
    var {questions} = this.props;

    var rows = [];
    questions.forEach((question, idx) => {
      rows.push(
        <div key={`faq-${idx}`} className="col-xs-12 col-md-6">
          <h3 className="faq-question">{question.question}</h3>
          <p className="faq-answer">{question.answer}</p>
        </div>
      );
      if (idx % 2 === 1) {
        rows.push(
          <div className="clearfix visible-md-block visible-lg-block" />
        );
      }
    });

    return (
      <div className="row">
        {rows}
      </div>
    );
  }
});

module.exports = FAQ;
