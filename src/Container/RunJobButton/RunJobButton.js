import React, { PureComponent } from 'react';
import Button from '../../Component/Button';

class RunJobButton extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
        this.triggerJob = this.triggerJob.bind(this);
    }

    componentDidMount() {
        this.statusTimer = setInterval(() => this.checkJobStatus().then((running) => {
            this.setState({
                loading: running
            });
        }), 5000);
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
        }).then(() => this.checkJobStatus().then((running) => {
            this.setState({
                loading: running
            });
        }));
    }

    render() {
        return (
            <Button
                loading={this.state.loading}
                text="Run job"
                loadingText="Running..."
                icon="icon-setting"
                onClick={this.triggerJob}
            />
        );
    }
}

export default RunJobButton;
