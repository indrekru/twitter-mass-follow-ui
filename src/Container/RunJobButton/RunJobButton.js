import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../Component/Button';

class RunJobButton extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
        this.triggerJob = this.triggerJob.bind(this);
    }

    setRunningState(running) {
        this.setState({
            loading: running
        });
    }

    componentDidMount() {
        this.checkJobStatus().then((running) => this.setRunningState(running));
        this.statusTimer = setInterval(() => this.checkJobStatus()
            .then((running) => this.setRunningState(running)), 5000);
    }

    componentWillUnmount() {
        this.statusTimer = null;
    }

    checkJobStatus() {
        return fetch('https://mass-follower1.herokuapp.com/api/v1/job-status', {
            method: 'GET'
        }).then((resp) => resp.json())
        .then((data) => {
            return data.running;
        });
    }

    triggerJob() {
        fetch('https://mass-follower1.herokuapp.com/api/v1/trigger', {
            method: 'POST'
        }).then(() => this.checkJobStatus()
            .then((running) => this.setRunningState(running)));
    }

    render() {
        return (
            <Button
                loading={this.state.loading}
                text="Run job"
                loadingText="Running..."
                icon="icon-setting"
                onClick={this.triggerJob}
                className={this.props.className}
            />
        );
    }
}

RunJobButton.propTypes = {
    className: PropTypes.string,
}

RunJobButton.defaultProps = {
    className: null
}

export default RunJobButton;
