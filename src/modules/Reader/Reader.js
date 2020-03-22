import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Swipeable } from "react-swipeable";
import { EpubJS } from "..";
import defaultStyles from "./style";

// Class for Table of Contents Items
class TocItem extends PureComponent {
  setLocation = () => {
    this.props.setLocation(this.props.href);
  };
  render() {
    const { label, styles } = this.props;
    return (
      <button onClick={this.setLocation} style={styles}>
        {label}
      </button>
    );
  }
}

TocItem.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  setLocation: PropTypes.func,
  styles: PropTypes.object
};

// Reader class
class Reader extends PureComponent {
  constructor(props) {
    super(props);
    this.readerRef = React.createRef();
    this.state = {
      expandToc: false,
      toc: false
    };
  }

  // Seeting toggle toc value
  toggleToc = () => {
    this.setState({
      expandToc: !this.state.expandToc
    });
  };

  // Loading next page
  next = () => {
    const node = this.readerRef.current;
    node.nextPage();
  };

  // Loading previous page
  prev = () => {
    const node = this.readerRef.current;
    node.prevPage();
  };

  // When the chapter is changed using TOC
  onTocChange = toc => {
    const { tocChanged } = this.props;
    this.setState(
      {
        toc: toc
      },
      () => tocChanged && tocChanged(toc)
    );
  };

  // Function for rendering TOC tab
  renderToc() {
    const { toc, expandToc } = this.state;
    const { styles } = this.props;
    return (
      <div>
        <div style={styles.tocArea}>
          <div style={styles.toc}>
            {toc.map((item, i) => (
              <TocItem
                {...item}
                key={i}
                setLocation={this.setLocation}
                styles={styles.tocAreaButton}
              />
            ))}
          </div>
        </div>
        {expandToc && (
          <div style={styles.tocBackground} onClick={this.toggleToc} />
        )}
      </div>
    );
  }

  setLocation = loc => {
    const { locationChanged } = this.props;
    this.setState(
      {
        expandToc: false
      },
      () => locationChanged && locationChanged(loc)
    );
  };

  // Function for ToggleTOC button
  renderTocToggle() {
    const { expandToc } = this.state;
    const { styles } = this.props;
    return (
      <button
        style={Object.assign(
          {},
          styles.tocButton,
          expandToc ? styles.tocButtonexpand : {}
        )}
        onClick={this.toggleToc}
      >
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBarTop)}
        />
        <span
          style={Object.assign({}, styles.tocButtonBar, styles.tocButtonBottom)}
        />
      </button>
    );
  }

  render() {
    const {
      title,
      showToc,
      loadingView,
      styles,
      locationChanged,
      swipeable,
      ...props
    } = this.props;
    const { toc, expandToc } = this.state;
    return (
      <div style={styles.container}>
        <div
          style={Object.assign(
            {},
            styles.readerArea,
            expandToc ? styles.containerexpand : {}
          )}
        >
          {showToc && this.renderTocToggle()}
          <div style={styles.titleArea}>{title}</div>
          <Swipeable
            onSwipedRight={this.prev}
            onSwipedLeft={this.next}
            trackMouse
          >
            <div style={styles.reader}>
              <EpubJS
                ref={this.readerRef}
                loadingView={loadingView}
                {...props}
                tocChanged={this.onTocChange}
                locationChanged={locationChanged}
              />
              {swipeable && <div style={styles.swipeWrapper} />}
            </div>
          </Swipeable>
          <button
            style={Object.assign({}, styles.arrow, styles.prev)}
            onClick={this.prev}
          >
            ‹
          </button>
          <button
            style={Object.assign({}, styles.arrow, styles.next)}
            onClick={this.next}
          >
            ›
          </button>
        </div>
        {showToc && toc && this.renderToc()}
      </div>
    );
  }
}

Reader.defaultProps = {
  loadingView: <div style={defaultStyles.loadingView}>Loading…</div>,
  locationChanged: null,
  tocChanged: null,
  showToc: true,
  styles: defaultStyles
};

Reader.propTypes = {
  title: PropTypes.string,
  loadingView: PropTypes.element,
  showToc: PropTypes.bool,
  locationChanged: PropTypes.func,
  tocChanged: PropTypes.func,
  styles: PropTypes.object,
  swipeable: PropTypes.bool
};

export default Reader;
