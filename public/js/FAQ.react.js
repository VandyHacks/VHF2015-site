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
          <div data-toggle="collapse" data-target={`#faq-${idx}-answer`} className="faq-collapse-header">
            <h4 className="faq-question">
              {question.question}
                <i className="fa fa-angle-down gold faq-arrow hidden-sm hidden-md hidden-lg" ></i>
            </h4>
          </div>

          <div className="visible-xs">
            <p className="faq-answer collapse" id={`faq-${idx}-answer`}>{question.answer}</p>
          </div>

          <div className="hidden-xs">
            <p className="faq-answer">{question.answer}</p>
          </div>
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
