import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';

type NewUserPopupProps = {
  show: boolean;
  onAccept: () => void;
};
// for testing, set localStorage.removeItem('privacyAccepted'); then reoload the page.
//instead of local storage, we wil use the database to store the user's acceptance of the privacy policy

const NewUserPopup = ({ show, onAccept }: NewUserPopupProps) => {
  return (
    <Modal show={show} onHide={() => {}} centered size="lg" scrollable>
      <Card>
        <Card.Header><strong>Data Privacy Agreement</strong></Card.Header>
        <Card.Body style={{ maxHeight: '400px', overflowY: 'scroll' }}>
          <p>At <strong>UML Mentor</strong>, we are committed to safeguarding the privacy of our users. This Data Privacy Policy outlines our practices regarding the collection, use, and protection of your personal data. By engaging with our Service, you consent to the processing of your information as described in this policy.</p>
          
          <h4>Collection and Use of Personal Data</h4>
          <p>In our pursuit to enhance the <strong>UML Mentor</strong> experience and evaluate student performance effectively, we may collect the following personal data:</p>
          <ul>
            <li><strong>Email Address:</strong> To communicate with you regarding your account and our services.</li>
            <li><strong>Name:</strong> To personalize your experience with UML Mentor.</li>
          </ul>
          
          <h4>Purposes of Processing Your Personal Data</h4>
          <p>Your personal data is vital for us to:</p>
          <ul>
            <li><strong>Service Provision and Maintenance:</strong> We use your information to deliver our services and maintain their functionality, including monitoring and analyzing the usage of our Service.</li>
            <li><strong>Account Management:</strong> Your personal data assists in managing your Service registration. As a registered user, it enables access to various Service functionalities exclusive to you.</li>
          </ul>
          
          <h4>Your Data Privacy Rights</h4>
          <p><strong>Opt-out and Deletion Requests:</strong> You reserve the right to withdraw your consent or request the deletion of your personal data from our systems. If you wish to opt out of our data collection or have your information deleted, please contact us at xxxxxx@utoronto.ca.</p>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" onClick={onAccept}>Accept</Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
};

export default NewUserPopup;
