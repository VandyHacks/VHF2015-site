var FAQQuestion = require('./FAQQuestion.react');
var React = require('react');
global.jQuery = require('jquery');
require('bootstrap');

var FAQ = React.createClass({

  propTypes: {
    questions: React.PropTypes.array.isRequired,
  },

  render() {
    var {questions} = this.props;

    var rows = [];
    questions.forEach((question, idx) => {
      rows.push(
        <div key={`faq-${idx}`} className="col-xs-12 col-sm-6">
          <FAQQuestion
            answer={question.answer}
            index={idx}
            question={question.question}
          />
        </div>
      );
      if (idx % 2 === 1) {
        rows.push(
          <div key={`faq-${idx}-clearfix`} className="clearfix visible-sm-block visible-md-block visible-lg-block" />
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
