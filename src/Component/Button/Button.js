import React, { PureComponent } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Button extends PureComponent {
    render() {
        return (
            <button
                className={classnames('btn btn-primary btn-sm', this.props.className)}
                onClick={this.props.onClick}
                disabled={this.props.loading}
            >
                {this.props.icon &&
                    <i className={classnames("icon", this.props.icon)}></i>
                }
                {this.props.loading &&
                    <span>{this.props.loadingText}</span>
                }
                {!this.props.loading &&
                    <span>{this.props.text}</span>
                }
                {this.props.loading &&
                    <span className="m-l-1 btn-loader pull-right"></span>
                }
            </button>
        );
    }
}

Button.propTypes = {
    loading: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    loadingText: PropTypes.string.isRequired,
    icon: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
}

Button.defaultProps = {
    icon: null,
    className: null
}

export default Button;
