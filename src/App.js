import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            followers: {}
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
        let out = {
            labels      : [],
            datasets    : [{
                label   : 'Followers',
                data    : []
            }]
        };
        data.forEach((item) => {
            out.labels.push(new Date(item.created).toLocaleString());
            out.datasets[0].data.push(item.following);
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
                                </h3>
                                <p>The total amount of followers on <a href={'https://twitter.com/' + this.props.homeAccount} target="_blank">{this.props.homeAccount}</a> account at given times.</p>
                            </div>
                            <div className="panel-body">
                                <Line data={this.state.followers} />
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
