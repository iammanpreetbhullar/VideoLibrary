import React from 'react';
import { Button, Modal } from 'react-bootstrap';


export default class MovieModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
    }

    

    render() {
        return (
            // <Modal show={this.props.handleShow} onHide={this.handleClose}>
            //     <Modal.Header closeButton>
            //         {/* {this.props.details.titleText.text} */}
            //     </Modal.Header>
            //     <Modal.Body>
            //         hello how are you
            //     </Modal.Body>
            //     <Modal.Footer>
            //         <Button variant="secondary" onClick={this.handleClose}>
            //             Close
            //         </Button>
            //         <Button variant="primary" onClick={this.handleClose}>
            //             Save Changes
            //         </Button>
            //     </Modal.Footer>
            // </Modal>
            <div></div>
        )
    }
}