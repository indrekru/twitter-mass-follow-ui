import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import RunJobButton from './Container/RunJobButton';

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            followers: []
        };
    }
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        fetch('https://mass-follower1.herokuapp.com/api/v1/follow-stats', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
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
                Followers: item.following
            });
        });
        return out;
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">
                                    Followers
                                    &nbsp;&nbsp;
                                    <RunJobButton />
                                </h3>
                                <p>The total amount of followers on <a href={'https://twitter.com/' + this.props.homeAccount} target="_blank" rel="noopener noreferrer">{this.props.homeAccount}</a> account at given times.</p>
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
    homeAccount: PropTypes.string,
}

App.defaultProps = {
    homeAccount: 'freenancefeed'
}

export default App;
