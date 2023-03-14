import React, { useState } from 'react'
import { Carousel as CarouselBootstrap, Container } from 'react-bootstrap'
// import CarouselBootstrap from 'react-bootstrap/Carousel'

import { API_URL } from '../../../utils/consts'
import './Carousel.css'


const Carousel = () => {

    const [index, setIndex] = useState(0);
    
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };
    
    return (
    <CarouselBootstrap 
        activeIndex={index} 
        onSelect={handleSelect}
        className="Carousel" 
        variant="dark"
    >
        <CarouselBootstrap.Item>
            <Container
                className="CarouselContainer"
            >
                <img
                    className="CarouselImg"
                    // width="200"
                    src={API_URL + "milwaukee/4933451512/big/dcd548eb-d5dc-41b1-9b3f-e7fb252bb8dc.jpg"}
                    alt="First slide"
                />
                <CarouselBootstrap.Caption
                    className="CarouselCaption"
                >
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </CarouselBootstrap.Caption>
            </Container>
        </CarouselBootstrap.Item>

        <CarouselBootstrap.Item>
            <Container
                className="CarouselContainer"
            >
                <img
                    className="CarouselImg"
                    // width="200"
                    src={API_URL + "milwaukee/4932471886/big/6577b7a8-bb88-48f6-8f25-d3b25e32131e.jpg"}
                    alt="Second slide"
                />
            
                <CarouselBootstrap.Caption
                    className="CarouselCaption"
                >
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </CarouselBootstrap.Caption>
            </Container>
        </CarouselBootstrap.Item>

        <CarouselBootstrap.Item>
            <Container
                className="CarouselContainer"
            >
                <img
                    className="CarouselImg"
                    // width="200"
                    src={API_URL + "milwaukee/4933441225/big/50e03c6a-f4b4-4f97-8e6e-2a1b1b6470ac.jpg"}
                    alt="Third slide"
                />
            
                <CarouselBootstrap.Caption
                    className="CarouselCaption"
                >
                    <h3>Third slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </CarouselBootstrap.Caption>
            </Container>
        </CarouselBootstrap.Item>

    </CarouselBootstrap>
    )

}

export default Carousel
