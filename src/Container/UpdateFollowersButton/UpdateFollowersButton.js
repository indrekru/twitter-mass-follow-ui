import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../Component/Button';

class UpdateFollowersButton extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
        this.handleUpdateFollowers = this.handleUpdateFollowers.bind(this);
    }

    handleUpdateFollowers() {
        this.setState({
            loading: true
        });
        fetch(`${this.props.apiUrl}/api/v1/update-followers`, {
            method: 'POST'
        }).then((resp) => {
            this.setState({
                loading: false
            });
        });
    }

    render() {
        return (
            <Button
                loading={this.state.loading}
                text="Update followers"
                loadingText="Updating..."
                onClick={this.handleUpdateFollowers}
                className={this.props.className}
            />
        );
    }
}

UpdateFollowersButton.propTypes = {
    className: PropTypes.string,
    apiUrl: PropTypes.string.isRequired
}

UpdateFollowersButton.defaultProps = {
    className: null
}

export default UpdateFollowersButton;
