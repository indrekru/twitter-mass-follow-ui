import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import RunJobButton from './Container/RunJobButton';
//import UpdateFollowersButton from './Container/UpdateFollowersButton';
import Button from './Component/Button';
import './style.css';
import classnames from 'classnames';

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.accounts = [
            'https://mass-follower1.herokuapp.com',
            'https://mass-follower.herokuapp.com'
        ];

        this.state = {
            followers: [],
            updatingFollowers: false,
            apiUrl: this.accounts[0],
            loading: false
        };

        this.onSourceChange = this.onSourceChange.bind(this);
    }
    componentDidMount() {
        this.fetchData(this.state.apiUrl);
        this.timer = setInterval(() => this.fetchData(this.state.apiUrl), 10000);
    }

    componentWillUnmount() {
        this.timer = null;
    }

    fetchData(url) {
        this.setState({
            loading: true
        });
        fetch(`${url}/api/v1/follow-stats`, {
            method: 'GET',
        }).then((resp) => resp.json())
        .then((data) => {
            this.setState({
                loading: false,
                apiUrl: url,
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
        this.fetchData(url);
    }

    render() {
        const that = this;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="panel panel-default">
                            <div className="panel-body p-b-0 p-t-2 bg-primary">
                                <div className="row m-b-3">
                                    <div className="col-xs-12">
                                        <h3 className="panel-title">
                                            Twitter mass follower
                                        </h3>
                                        <p className="m-b-0">
                                            The amount of followers on some Twitter accounts
                                        </p>
                                    </div>
                                </div>
                                <div className="row m-b-3">
                                    <div className="col-xs-12">
                                        <div className="btn-group">
                                            {this.accounts.map(function(accountUrl, index){
                                                return <Button
                                                            key={index}
                                                            loading={that.state.loading}
                                                            text={'Account ' + (index + 1)}
                                                            onClick={(e) => that.onSourceChange(accountUrl)}
                                                            className={classnames({'active' : that.state.apiUrl === accountUrl})}
                                                        />;
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row m-b-3">
                                    <div className="col-xs-12">
                                        <div className="form-group form-group-sm m-b-0">
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
                                </div> */}
                                {/* <div className="row m-b-3">
                                    <div className="col-xs-12">
                                        <div className="btn-group">
                                            <RunJobButton
                                                apiUrl={this.state.apiUrl}
                                            />
                                            <UpdateFollowersButton
                                                apiUrl={this.state.apiUrl}
                                            />
                                        </div>
                                    </div>
                                </div> */}
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

export default App;
