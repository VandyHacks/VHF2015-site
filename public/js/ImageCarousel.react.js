var Bootstrap = require('react-bootstrap');
var React = require('react');

var ImageCarousel = React.createClass({

  render() {
    var {Carousel, CarouselItem} = Bootstrap;

    return (
      <Carousel controls={false}>
        <CarouselItem>
          <img className="happy-people" src="img/spring1.png" />
        </CarouselItem>
        <CarouselItem>
          <img className="happy-people" src="img/spring5.png" />
        </CarouselItem>
        <CarouselItem>
          <img className="happy-people" src="img/spring2.png" />
        </CarouselItem>
        <CarouselItem>
          <img className="happy-people" src="img/spring3.png" />
        </CarouselItem>
        <CarouselItem>
          <img className="happy-people" src="img/spring4.png" />
        </CarouselItem>
      </Carousel>
    );
  }
});

module.exports = ImageCarousel;
