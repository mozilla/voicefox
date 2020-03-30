/* globals lottie, React */
/* eslint-disable no-unused-vars */
// For some reason, eslint is not detecting that <Variable /> means that Variable is used

import * as browserUtil from "../browserUtil.js";

const { useState, useEffect, PureComponent } = React;

export const Popup = ({
  currentView,
  suggestions,
  feedback,
  lastIntent,
  transcript,
  displayText,
  errorMessage,
  displayAutoplay,
  searchResult,
  cardImage,
  recorderVolume,
  showSettings,
  submitTextInput,
  onClickLexicon,
  onSearchImageClick,
  onNextSearchResultClick,
  onInputStarted,
  onSubmitFeedback,
  setMinPopupSize,
  expandListeningView,
  timerInMS,
  timerTotalInMS,
  renderFollowup,
  followupText,
}) => {
  const [inputValue, setInputValue] = useState(null);
  function savingOnInputStarted(value) {
    // When the user types in the hidden field, we need to keep that
    // first input and use it later
    setInputValue(value);
    onInputStarted();
  }
  return (
    <div
      id="popup"
      className={`${currentView} ${renderFollowup ? "followup" : ""}`}
    >
      <PopupHeader
        currentView={currentView}
        transcript={transcript}
        lastIntent={lastIntent}
      />
      <PopupContent
        currentView={currentView}
        suggestions={suggestions}
        feedback={feedback}
        transcript={transcript}
        displayText={displayText}
        errorMessage={errorMessage}
        displayAutoplay={displayAutoplay}
        searchResult={searchResult}
        cardImage={cardImage}
        recorderVolume={recorderVolume}
        submitTextInput={submitTextInput}
        inputValue={inputValue}
        onClickLexicon={onClickLexicon}
        onSearchImageClick={onSearchImageClick}
        onNextSearchResultClick={onNextSearchResultClick}
        onInputStarted={savingOnInputStarted}
        onSubmitFeedback={onSubmitFeedback}
        setMinPopupSize={setMinPopupSize}
        expandListeningView={expandListeningView}
        timerInMS={timerInMS}
        timerTotalInMS={timerTotalInMS}
        renderFollowup={renderFollowup}
      />
      <PopupFooter
        currentView={currentView}
        renderFollowup={renderFollowup}
        showSettings={showSettings}
        timerInMS={timerInMS}
      />
      {timerInMS > 0 ? (
        <TimerFooter
          currentView={currentView}
          timerInMS={timerInMS}
        ></TimerFooter>
      ) : null}
      <FollowupContainer
        lastIntent={lastIntent}
        followupText={followupText}
        renderFollowup={renderFollowup}
        currentView={currentView}
      />
    </div>
  );
};

const PopupHeader = ({ currentView, transcript, lastIntent }) => {
  const getTitle = () => {
    switch (currentView) {
      case "processing":
        return "One second...";
      case "success":
        return "Got it!";
      case "error":
        return "Sorry, there was an issue";
      case "typing":
        return "Type your request";
      case "searchResults":
        return transcript;
      case "startSavingPage":
        return "Saving page...";
      case "endSavingPage":
        return "Success";
      case "feedback":
        return (
          <React.Fragment>
            <p>{lastIntentTime(lastIntent)} ago you said</p>
            <p className="utterance">{lastIntent.utterance}</p>
          </React.Fragment>
        );
      case "feedbackThanks":
        return "";
      case "waiting":
        return "One moment...";
      case "timer":
        return transcript;
      case "listening":
      default:
        return "Listening";
    }
  };

  const onClickGoBack = () => {
    location.href = `${location.pathname}?${Date.now()}`;
  };

  const onClickClose = () => {
    window.close();
  };

  const hiddenClass =
    currentView === "error" ||
    currentView === "searchResults" ||
    currentView === "typing" ||
    currentView === "startSavingPage" ||
    currentView === "endSavingPage" ||
    currentView === "feedback" ||
    currentView === "feedbackThanks" ||
    currentView === "timer"
      ? ""
      : "hidden";

  return (
    <div id="popup-header">
      <button id="left-icon" className={hiddenClass} onClick={onClickGoBack}>
        <svg
          id="back-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          aria-label="Back"
        >
          <path
            fill="context-fill"
            d="M6.414 8l4.293-4.293a1 1 0 0 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414z"
          ></path>
        </svg>
      </button>
      <div id="header-title">{getTitle()}</div>
      <button id="close-icon" aria-label="Close" onClick={onClickClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            fill="context-fill"
            d="M9.061 8l3.47-3.47a.75.75 0 0 0-1.061-1.06L8 6.939 4.53 3.47a.75.75 0 1 0-1.06 1.06L6.939 8 3.47 11.47a.75.75 0 1 0 1.06 1.06L8 9.061l3.47 3.47a.75.75 0 0 0 1.06-1.061z"
          ></path>
        </svg>
      </button>
    </div>
  );
};

const PopupContent = ({
  currentView,
  suggestions,
  feedback,
  transcript,
  displayText,
  errorMessage,
  displayAutoplay,
  searchResult,
  cardImage,
  recorderVolume,
  submitTextInput,
  inputValue,
  onClickLexicon,
  onSearchImageClick,
  onNextSearchResultClick,
  onInputStarted,
  onSubmitFeedback,
  setMinPopupSize,
  expandListeningView,
  timerInMS,
  timerTotalInMS,
  renderFollowup,
}) => {
  const getContent = () => {
    switch (currentView) {
      case "listening":
        return (
          <ListeningContent
            displayText={displayText}
            suggestions={suggestions}
            onClickLexicon={onClickLexicon}
            onInputStarted={onInputStarted}
            expandListeningView={expandListeningView}
          />
        );
      case "typing":
        return (
          <TypingContent
            displayText={displayText}
            submitTextInput={submitTextInput}
            inputValue={inputValue}
          />
        );
      case "processing":
        return (
          <ProcessingContent
            transcript={transcript}
            displayText={displayText}
            renderFollowup={renderFollowup}
          />
        );
      case "success":
        return (
          <SuccessContent transcript={transcript} displayText={displayText} />
        );
      case "error":
        return (
          <ErrorContent
            displayText={displayText}
            errorMessage={errorMessage}
            displayAutoplay={displayAutoplay}
          />
        );
      case "searchResults":
        return (
          <SearchResultsContent
            search={searchResult}
            cardImage={cardImage}
            displayText={displayText}
            onSearchImageClick={onSearchImageClick}
            onNextSearchResultClick={onNextSearchResultClick}
            setMinPopupSize={setMinPopupSize}
            onSubmitFeedback={onSubmitFeedback}
            renderFollowup={renderFollowup}
          />
        );
      case "startSavingPage":
        return <SavingPageContent transcript={transcript} />;
      case "endSavingPage":
        return (
          <SuccessContent transcript={transcript} displayText={displayText} />
        );
      case "feedback":
        return (
          <Feedback feedback={feedback} onSubmitFeedback={onSubmitFeedback} />
        );
      case "feedbackThanks":
        return <FeedbackThanks />;
      case "timer":
        return (
          <TimerCard
            timerInMS={timerInMS}
            timerTotalInMS={timerTotalInMS}
            onSubmitFeedback={onSubmitFeedback}
          ></TimerCard>
        );
      default:
        return null;
    }
  };

  return (
    <div id="popup-content">
      <Zap currentView={currentView} recorderVolume={recorderVolume} />
      {getContent()}
    </div>
  );
};

const FollowupContainer = ({
  lastIntent,
  followupText,
  renderFollowup,
  currentView,
}) => {
  if (
    !lastIntent ||
    !followupText ||
    currentView === "listening" ||
    currentView === "waiting" ||
    currentView === "processing" ||
    !renderFollowup
  ) {
    return null;
  }

  let heading = "Waiting...";
  let subheading;
  if (followupText) {
    heading = followupText.heading;
    subheading = followupText.subheading;
  }
  return (
    <div id="followup-container">
      <IntentFeedback />
      <div id="followup-wrapper">
        <div id="followup_mic-container">Mic On</div>
        <div id="followup_headings-wrapper">
          <div id="followup_heading">{heading}</div>
          {subheading && <div id="followup_subheading">{subheading}</div>}
        </div>
      </div>
    </div>
  );
};

const Feedback = ({ feedback, onSubmitFeedback }) => {
  const textarea = React.createRef();
  function onSubmit() {
    const text = textarea.current.value;
    onSubmitFeedback({ rating: feedback.rating, feedback: text });
  }
  useEffect(() => {
    textarea.current.focus();
  });

  function onInputKeyPress(event) {
    if (event.key === "Enter") {
      onSubmit();
    }
  }

  return (
    <div id="feedback-whats-wrong">
      <button className="sad-icon"></button>
      <form onSubmit={onSubmit} className="feedback-form">
        <h1>What went wrong?</h1>
        <div>
          <textarea
            className="styled-textarea"
            ref={textarea}
            autofocus="1"
            onKeyPress={onInputKeyPress}
          ></textarea>
        </div>
        <div>
          <button type="submit" className="styled-green-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

const FeedbackThanks = () => {
  return (
    <div className="feedback-thanks">
      <h2>Thanks for your feedback</h2>
    </div>
  );
};

const PopupFooter = ({ currentView, showSettings, renderFollowup }) => {
  if (
    currentView === "searchResults" ||
    currentView === "feedback" ||
    currentView === "feedbackThanks" ||
    currentView === "timer" ||
    renderFollowup
  )
    return null;
  return (
    <div id="popup-footer">
      <button id="settings-icon" aria-label="Settings" onClick={showSettings}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            fill="context-fill"
            d="M15 7h-2.1a4.967 4.967 0 0 0-.732-1.753l1.49-1.49a1 1 0 0 0-1.414-1.414l-1.49 1.49A4.968 4.968 0 0 0 9 3.1V1a1 1 0 0 0-2 0v2.1a4.968 4.968 0 0 0-1.753.732l-1.49-1.49a1 1 0 0 0-1.414 1.415l1.49 1.49A4.967 4.967 0 0 0 3.1 7H1a1 1 0 0 0 0 2h2.1a4.968 4.968 0 0 0 .737 1.763c-.014.013-.032.017-.045.03l-1.45 1.45a1 1 0 1 0 1.414 1.414l1.45-1.45c.013-.013.018-.031.03-.045A4.968 4.968 0 0 0 7 12.9V15a1 1 0 0 0 2 0v-2.1a4.968 4.968 0 0 0 1.753-.732l1.49 1.49a1 1 0 0 0 1.414-1.414l-1.49-1.49A4.967 4.967 0 0 0 12.9 9H15a1 1 0 0 0 0-2zM5 8a3 3 0 1 1 3 3 3 3 0 0 1-3-3z"
          ></path>
        </svg>
      </button>
      <div id="moz-voice-privacy">
        <a
          href="https://firefox-voice-feedback.herokuapp.com/"
          target="_blank"
          rel="noopener"
        >
          Feedback?
        </a>
      </div>
      <div></div>
    </div>
  );
};

const getHourMinuteSecond = timerInMS => {
  const time = parseFloat(timerInMS / 1000).toFixed(3);
  const hours = Math.floor(time / 60 / 60);
  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time - minutes * 60);

  return { hours, minutes, seconds };
};
const parseTimer = timerInMS => {
  const pad = (num, size) => {
    return ("000" + num).slice(size * -1);
  };
  const { hours, minutes, seconds } = getHourMinuteSecond(timerInMS);

  if (hours > 0)
    return pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
  return pad(minutes, 2) + ":" + pad(seconds, 2);
};

const TimerCard = ({ timerInMS, timerTotalInMS, onSubmitFeedback }) => {
  const getNotificationExpression = timerTotalInMS => {
    const { hours, minutes, seconds } = getHourMinuteSecond(timerTotalInMS);
    let expression = "";

    if (hours !== 0) {
      expression += `${hours} hours`;
    }
    if (minutes !== 0) {
      if (expression.length > 0) {
        expression += " and ";
      }
      expression += `${minutes} minutes`;
    }

    if (seconds !== 0) {
      if (expression.length > 0) {
        expression += " and ";
      }
      expression += `${seconds} seconds`;
    }
    return `It's been ${expression}`;
  };

  const notificationExpression = getNotificationExpression(timerTotalInMS);
  return (
    <React.Fragment>
      <div className="timer-card">
        <div className="circle-timer">
          <p className="timer-clock">{parseTimer(timerInMS)}</p>
        </div>
        <div className="timer-notification-text">
          {timerInMS <= 0 ? <p>{notificationExpression}</p> : null}
        </div>
      </div>
      <IntentFeedback onSubmitFeedback={onSubmitFeedback} />
    </React.Fragment>
  );
};

const TimerFooter = ({ currentView, timerInMS }) => {
  if (currentView !== "listening") return null;

  return (
    <div className="search-footer">
      <div className="timer-footer">
        {timerInMS < 3600 * 1000 ? (
          <div className="circle-timer-footer">
            <p className="timer-clock">{parseTimer(timerInMS)} </p>
          </div>
        ) : (
          <p className="timer-clock-footer">{parseTimer(timerInMS)}</p>
        )}
        <div className="timer-text">
          <p>Say "cancel", "pause" or "reset" timer.</p>
        </div>
      </div>
    </div>
  );
};

const ListeningContent = ({
  displayText,
  suggestions,
  onClickLexicon,
  onInputStarted,
  expandListeningView,
}) => {
  return (
    <React.Fragment>
      <TextDisplay displayText={displayText} />
      <div id="extra-content" className={expandListeningView ? "expanded" : ""}>
        <VoiceInput suggestions={suggestions} onClickLexicon={onClickLexicon} />
        <TypingInput onInputStarted={onInputStarted} />
      </div>
    </React.Fragment>
  );
};

const TypingContent = ({ displayText, submitTextInput, inputValue }) => {
  return (
    <React.Fragment>
      <TextDisplay displayText={displayText} />
      <TypingInput submitTextInput={submitTextInput} inputValue={inputValue} />
    </React.Fragment>
  );
};

const VoiceInput = ({ suggestions, onClickLexicon }) => {
  const onMoreSuggestions = event => {
    if (event) {
      event.preventDefault();
      onClickLexicon(event);
    }
  };
  return (
    <div id="voice-input">
      {suggestions ? (
        <div id="suggestions">
          <p id="prompt">You can say things like:</p>
          <div id="suggestions-list">
            {suggestions.map(suggestion => (
              <p className="suggestion" key={suggestion}>
                {suggestion}
              </p>
            ))}
          </div>
          <div>
            <a
              target="_blank"
              rel="noopener"
              id="lexicon"
              href="../views/lexicon.html"
              onClick={browserUtil.activateTabClickHandler}
            >
              More things you can say
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const IntentFeedback = ({ eduText, onSubmitFeedback }) => {
  function onPositive() {
    onSubmitFeedback({ rating: 1, feedback: null });
  }
  function onNegative() {
    onSubmitFeedback({ rating: -1, feedback: null });
  }
  return (
    <div id="intent-feedback">
      <div>Did we get this right?</div>
      <div className="feedback-controls">
        <button
          className="happy-icon"
          aria-label="Leave a positive review"
          onClick={onPositive}
        ></button>
        <button
          className="sad-icon"
          aria-label="Leave a negative review"
          onClick={onNegative}
        ></button>
      </div>
      {eduText ? (
        <div>
          <hr />
          <em>{eduText}</em>
        </div>
      ) : null}
    </div>
  );
};

const lastIntentTime = lastIntent => {
  let ago;
  const minutesAgo = Math.max(
    1,
    Math.round((Date.now() - lastIntent.timestamp) / 60000)
  );
  if (minutesAgo > 60) {
    const hoursAgo = Math.round(minutesAgo / 60);
    const plural = hoursAgo === 1 ? "" : "s";
    ago = `${hoursAgo} hour${plural}`;
  } else {
    const plural = minutesAgo === 1 ? "" : "s";
    ago = `${minutesAgo} min${plural}`;
  }

  return ago;
};

class TypingInput extends PureComponent {
  constructor(props) {
    super(props);

    this.textInputRef = React.createRef();
    this.value = this.props.inputValue || null;
  }

  componentDidMount() {
    this.focusText();
    const el = this.textInputRef.current;
    if (el) {
      el.addEventListener("blur", this.focusText);
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }

  focusText = () => {
    if (this.textInputRef.current) {
      setTimeout(() => {
        this.textInputRef.current.focus();
      }, 0);
    }
  };

  onInputKeyPress = event => {
    if (event.key === "Enter") {
      this.submitTextInput();
    }
  };

  onInputTextChange = event => {
    this.value = event.target.value;
    if (this.value && this.props.onInputStarted) {
      this.props.onInputStarted(this.value);
    }
  };

  submitTextInput = async () => {
    const text = this.value;
    if (text) {
      this.props.submitTextInput(text);
    }
  };

  render() {
    return (
      <div id="text-input">
        <textarea
          id="text-input-field"
          className="styled-textarea"
          autofocus="1"
          onKeyPress={this.onInputKeyPress}
          onChange={this.onInputTextChange}
          defaultValue={this.value}
          ref={this.textInputRef}
        ></textarea>
        <div id="send-btn-wrapper">
          <button
            className="styled-green-button"
            onClick={this.submitTextInput}
          >
            GO
          </button>
        </div>
      </div>
    );
  }
}

const ProcessingContent = ({ transcript, displayText, renderFollowup }) => {
  return (
    <React.Fragment>
      <Transcript transcript={renderFollowup ? "" : transcript} />
      <TextDisplay displayText={renderFollowup ? "" : displayText} />
    </React.Fragment>
  );
};

const SuccessContent = ({ transcript, displayText }) => {
  return (
    <React.Fragment>
      <Transcript transcript={transcript} />
      <TextDisplay displayText={displayText} />
    </React.Fragment>
  );
};

const ErrorContent = ({ displayText, errorMessage, displayAutoplay }) => {
  return (
    <div>
      <TextDisplay displayText={displayText} />
      {errorMessage ? <div id="error-message">{errorMessage}</div> : null}
      {displayAutoplay ? (
        <div id="error-autoplay">
          <img
            src="images/autoplay-instruction.png"
            alt="To enable autoplay, open the site preferences and select Allow Audio and Video"
          />
        </div>
      ) : null}
    </div>
  );
};

const SavingPageContent = ({ transcript }) => {
  return (
    <React.Fragment>
      <Transcript transcript={transcript} />
    </React.Fragment>
  );
};

const SearchResultsContent = ({
  search,
  cardImage,
  displayText,
  onSearchImageClick,
  onNextSearchResultClick,
  setMinPopupSize,
  onSubmitFeedback,
  renderFollowup,
}) => {
  if (!search) return null;

  const { searchResults, index, searchUrl } = search;
  const card = cardImage;
  const next = searchResults[index + 1];
  const cardStyles = card ? { height: card.height, width: card.width } : {};
  const imgAlt =
    card && card.alt
      ? `Click to show search results: ${card.alt}`
      : "Show search results";

  if (card) {
    setMinPopupSize(card.width);
  }

  const onSearchCardClick = () => {
    onSearchImageClick(searchUrl);
  };

  const onNextResultClick = event => {
    event.preventDefault();
    onNextSearchResultClick();
  };

  const SearchCard = () => (
    <button class="invisible-button" onClick={onSearchCardClick}>
      <img id="search-image" alt={imgAlt} style={cardStyles} src={card.src} />
    </button>
  );

  const AnswerCard = () => (
    <div className="results-set">
      {card.answer.imgSrc ? (
        <img
          className="results-image"
          src={card.answer.imgSrc}
          alt={card.answer.alt}
        />
      ) : null}
      <div className="results-text">
        <em>
          {card.answer.largeText ? (
            <div className="results-largeText">{card.answer.largeText}</div>
          ) : null}
          <div>{card.answer.text}</div>
        </em>
      </div>
    </div>
  );

  const renderCard = () => {
    if (card && card.answer) {
      return AnswerCard();
    } else if (card) {
      return SearchCard();
    }
    return null;
  };

  return (
    <React.Fragment>
      <TextDisplay displayText={displayText} />
      {renderFollowup ? null : (
        <React.Fragment>
          <div id="search-results">{renderCard()}</div>
          <div id="search-footer">
            <IntentFeedback
              onSubmitFeedback={onSubmitFeedback}
              eduText={card && card.answer ? card.answer.eduText : null}
            />
            {next ? (
              <div id="next-result">
                <p>
                  <strong>
                    Click mic and say <i>'next'</i> to view
                  </strong>
                </p>
                <a
                  href={next.url}
                  id="search-show-next"
                  onClick={onNextResultClick}
                >
                  {new URL(next.url).hostname} | {next.title}
                </a>
              </div>
            ) : null}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

const Transcript = ({ transcript }) => {
  return transcript ? <div id="transcript">{transcript}</div> : null;
};

const TextDisplay = ({ displayText }) => {
  return displayText ? <div id="text-display">{displayText}</div> : null;
};

class Zap extends PureComponent {
  constructor(props) {
    super(props);

    this.animation = null;

    this.animationSegmentTimes = {
      reveal: [0, 14],
      base: [14, 30],
      low: [30, 46],
      medium: [46, 62],
      high: [62, 78],
      processing: [78, 134],
      waiting: [88, 122],
      error: [134, 153],
      success: [184, 203],
    };

    this.animationConfig = {
      listening: {
        segments: [
          this.animationSegmentTimes.reveal,
          this.animationSegmentTimes.base,
        ],
        loop: true,
        interrupt: true,
      },
      processing: {
        segments: [this.animationSegmentTimes.processing],
        loop: false,
        interrupt: true,
      },
      waiting: {
        segments: [this.animationSegmentTimes.waiting],
        loop: true,
        interrupt: true,
      },
      success: {
        segments: [this.animationSegmentTimes.success],
        loop: false,
        interrupt: true,
      },
      error: {
        segments: [this.animationSegmentTimes.error],
        loop: false,
        interrupt: true,
      },
      startSavingPage: {
        segments: [this.animationSegmentTimes.waiting],
        loop: false,
        interrupt: true,
      },
      feedbackThanks: {
        segments: [this.animationSegmentTimes.success],
        loop: false,
        interrupt: true,
      },
    };
  }

  componentDidMount() {
    this.loadAnimation();
  }

  componentDidUpdate() {
    const config =
      this.animationConfig[this.props.currentView] ||
      this.animationConfig.success;

    if (config) {
      this.playAnimation(config.segments, config.interrupt, config.loop);

      if (this.props.currentView === "listening" && this.props.recorderVolume) {
        this.setAnimationForVolume(this.props.recorderVolume);
      }
    }
  }

  loadAnimation = async () => {
    this.animation = await lottie.loadAnimation({
      container: document.getElementById("zap"), // the dom element that will contain the animation
      loop: false,
      renderer: "svg",
      autoplay: false,
      path: "animations/Firefox_Voice_Full.json", // the path to the animation json
    });
  };

  playAnimation = (segments, interrupt, loop) => {
    if (this.animation) {
      this.animation.loop = loop;
      this.animation.playSegments(segments, interrupt);
    }
  };

  setAnimationForVolume = avgVolume => {
    // this.animation.onLoopComplete = function() {
    if (avgVolume < 0.1) {
      this.playAnimation(this.animationSegmentTimes.base, true, true);
    } else if (avgVolume < 0.3) {
      this.playAnimation(this.animationSegmentTimes.low, true, true);
    } else if (avgVolume < 0.4) {
      this.playAnimation(this.animationSegmentTimes.medium, true, true);
    } else {
      this.playAnimation(this.animationSegmentTimes.high, true, true);
    }
    // };
  };

  render() {
    return (
      <div id="zap-wrapper">
        <div id="zap"></div>
      </div>
    );
  }
}
