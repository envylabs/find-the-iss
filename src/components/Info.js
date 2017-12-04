import { h } from 'preact';
import { connect } from 'preact-redux';

import Close from './Close';
import Question from './Question';

const Info = (props, state) => (
  <div className="info">
    <button class="info-open" onClick={props.openInfo}>
      <Question />
    </button>
    {state.isInfoOpen &&
      <div>
        <button class="info-open" onClick={props.closeInfo}>
          <Close />
        </button>
        <div className="info-fullscreen">
          <h2 className="info-heading">About This Project</h2>
          <div className="info-body">
            <p>
              Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nullam
              id dolor id nibh ultricies vehicula ut id elit. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit. Curabitur blandit tempus
              porttitor.
            </p>
            <p>
              Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nullam
              id dolor id nibh ultricies vehicula ut id elit. Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Curabitur blandit tempus
              porttitor.
            </p>
            <p>
              Built by Envy Labs with help from...
            </p>
          </div>
        </div>
      </div>
    }
  </div>
);

const mapStateToProps = state => ({
  isInfoOpen: state.isInfoOpen,
});

const mapDispatchToProps = dispatch => ({
  closeInfo: () => dispatch({ type: CLOSE_INFO }),
  openInfo: () => dispatch({ type: OPEN_INFO }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Info);
