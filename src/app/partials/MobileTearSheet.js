import React, {Component, PropTypes} from 'react';

class MobileTearSheet extends Component {

  static propTypes = {
    children: PropTypes.node,
    height: PropTypes.number.isRequired,
  };

  static defaultProps = {
    height: 500,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  renderSVGImage(obj) {
    
    return (

      <div dangerouslySetInnerHTML={

        {__html:

        '<img style=' + {obj} + ' src="images/bottom-tear.svg" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-us" />'

        }

      }/>

    )
  
  }

  render() {
    const {
      prepareStyles,
    } = this.context.muiTheme;

    const styles = {
      root: {
        marginBottom: 24,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 0,
        maxWidth: 360,
        width: '100%',
      },
      container: {
        border: 'solid 1px #d9d9d9',
        borderBottom: 'none',
        height: 'auto',
        overflow: 'hidden',
      },
      bottomTear: {
        display: 'block',
        position: 'relative',
        marginTop: -10,
        maxWidth: 360,
      },
    };

    return (
      <div style={prepareStyles(styles.root)}>
        <div style={prepareStyles(styles.container)}>
          {this.props.children}
        </div>
        <img style={prepareStyles(styles.bottomTear)} src="images/bottom-tear.svg" />
        
        {/*this.renderSVGImage(prepareStyles(styles.bottomTear))*/}

      </div>
    );
  }
}

export default MobileTearSheet;
