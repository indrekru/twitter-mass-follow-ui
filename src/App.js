import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import RunJobButton from './Container/RunJobButton';
import UpdateFollowersButton from './Container/UpdateFollowersButton';
import Button from './Component/Button';
import './style.css';
import classnames from 'classnames';

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            followers: [],
            updatingFollowers: false,
            apiUrl: props.apiUrl
        };

        this.onSourceChange = this.onSourceChange.bind(this);
    }
    componentDidMount() {
        this.fetchData();
        this.timer = setInterval(() => this.fetchData(), 5000);
    }

    componentWillUnmount() {
        this.timer = null;
    }

    fetchData() {
        fetch(`${this.state.apiUrl}/api/v1/follow-stats`, {
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

    onSourceChange(url) {
        this.setState({
            apiUrl: url
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
                                    Twitter mass follower
                                </h3>
                                <p className="m-b-2">
                                    The amount of followers on some Twitter accounts
                                </p>
                                <div className="btn-group">
                                    <RunJobButton
                                        className="m-b-3"
                                        apiUrl={this.state.apiUrl}
                                    />
                                    <UpdateFollowersButton
                                        apiUrl={this.state.apiUrl}
                                    />
                                </div>
                                <div className="row m-b-3">
                                    <div className="col-xs-12">
                                        <div className="btn-group">
                                            <Button
                                                text="Node 1"
                                                loadingText="Loading..."
                                                onClick={(e) => this.onSourceChange('https://mass-follower1.herokuapp.com')}
                                                loading={false}
                                                className={classnames({'active' : this.state.apiUrl === 'https://mass-follower1.herokuapp.com'})}
                                             />
                                             <Button
                                                 text="Node 2"
                                                 loadingText="Loading..."
                                                 onClick={(e) => this.onSourceChange('https://mass-follower.herokuapp.com')}
                                                 loading={false}
                                                 className={classnames({'active' : this.state.apiUrl === 'https://mass-follower.herokuapp.com'})}
                                              />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        disabled={true}
                                        value={this.state.apiUrl}
                                        onChange={this.onSourceChange}
                                        className="form-control"
                                        placeholder="API URL"
                                    />
                                </div>
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
