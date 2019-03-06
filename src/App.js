import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import RunJobButton from './Container/RunJobButton';
import Button from './Component/Button';
import './style.css';

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            followers: [],
            updatingFollowers: false
        };

        this.handleUpdateFollowers = this.handleUpdateFollowers.bind(this);
    }
    componentDidMount() {
        this.fetchData();
        this.timer = setInterval(() => this.fetchData(), 5000);
    }

    componentWillUnmount() {
        this.timer = null;
    }

    fetchData() {
        fetch(`${this.props.apiUrl}/api/v1/follow-stats`, {
            method: 'GET',
        }).then((resp) => resp.json())
        .then((data) => {
            this.setState({
                followers: this.transformData(data)
            });
        });
    }

    transformData(data) {
        let out = [];
        data.forEach((item) => {
            out.push({
                name: new Date(item.created).toLocaleString(),
                Followers: item.myFollowers,
                Following: item.imFollowing
            });
        });
        return out;
    }

    handleUpdateFollowers() {
        this.setState({
            updatingFollowers: true
        });
        fetch(`${this.props.apiUrl}/api/v1/update-followers`, {
            method: 'POST'
        }).then((resp) => {
            this.setState({
                updatingFollowers: false
            });
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="panel panel-default">
                            <div className="panel-body p-b-0 p-t-2 bg-primary">
                                <h3 className="panel-title">
                                    Followers
                                </h3>
                                <p className="m-b-2">
                                    The total amount of followers on some account at given times.
                                </p>
//                                <div className="btn-group">
//                                    <RunJobButton
//                                        className="m-b-3"
//                                        apiUrl={this.props.apiUrl}
//                                    />
//                                    <Button
//                                        loading={this.state.updatingFollowers}
//                                        text="Update followers"
//                                        loadingText="Updating..."
//                                        onClick={this.handleUpdateFollowers}
//                                    />
//                                </div>
                            </div>
                            <div className="panel-body">
                                {this.state.followers.length &&
                                    <ResponsiveContainer width='100%' height={300}>
                                    <LineChart
                                        data={this.state.followers}
                                    >
                                        <CartesianGrid strokeDasharray="5 5"  />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={['auto', 'auto']} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Followers" stroke="#00b9ff" />
                                        <Line type="monotone" dataKey="Following" stroke="#2ED06E" />
                                    </LineChart>
                                    </ResponsiveContainer>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    apiUrl: PropTypes.string
}

App.defaultProps = {
    apiUrl: 'https://mass-follower1.herokuapp.com'
}

export default App;
